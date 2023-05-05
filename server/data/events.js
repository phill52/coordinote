import mongoCollections from '../config/mongoCollections.js';
const users = mongoCollections.users;
const events= mongoCollections.events;
import validation from '../validation.js'
import {ObjectId} from 'mongodb'
const fn=validation.fn;

const createEvent = async(eventName,domainDates,location,description,attendees,image,userId) => {
    eventName=validation.checkEventName(eventName);
    location=validation.checkLocation(location)
    domainDates=validation.checkDate(domainDates)
    //userId=validation.checkId(userId);
    const eventCollection=await events();
    let newEvent = {
        name:eventName,
        domainDates:domainDates,
        location:location,
        description,description,
        attendees:attendees,
        image:image,
        creatorID:userId
    }
    const insertEvent=await eventCollection.insertOne(newEvent);
    if(!insertEvent.acknowledged || !insertEvent.insertedId)
        throw "Unable to add event to events collection"
    const userCollection=await users()
    const updatedUser = await userCollection.updateOne(
        {_id:new ObjectId(userId)},
        {$push: {events:insertEvent.insertedId}}
    )
    if(updatedUser.modifiedCount<1){
        throw "Unable to add this event to your account"
    }
    return await getEventById(insertEvent.insertedId)
}
//replaces fields in event document with the ones pass in as parameters
const updateEvent = async(eventId,newName,newDomainDates,newLocation,newDescription,newAttendees,newImage,creatorId) => {
    eventId=validation.checkId(eventId)
    // creatorId=validation.checkId(creatorId)
    if(newName) newName=validation.checkEventName(newName)
    if(newLocation) newLocation=validation.checkLocation(newLocation)
    if(newAttendees) newAttendees=validation.checkAttendees(newAttendees)
    if(newDomainDates) newDomainDates=validation.checkDate(newDomainDates)
    const eventCollection=await events();
    const oldEvent=await eventCollection.findOne({_id:new ObjectId(eventId)})
    const editedEvent=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {$set: {
            "name":newName?newName:oldEvent.name,
            "domainDates":newDomainDates?newDomainDates:oldEvent.domainDates, 
            "location":newLocation?newLocation:oldEvent.location, 
            "description":newDescription?newDescription:oldEvent.description,
            "attendees":newAttendees?newAttendees:oldEvent.attendees,
            "image":newImage?newAttendees:oldEvent.image
        }}
    )
    if(editedEvent.modifiedCount==0 && editedEvent.matchedCount==0){
        // !(newName==oldEvent.name && newLocation==oldEvent.location &&
        //  JSON.stringify(newParticipants)==JSON.stringify(oldEvent.participants) && 
        //  newDate==oldEvent.date) ){
        throw "Could not update event"
    }
    return await getEventById(eventId)
}

const getEventById = async(eventId) => {
    eventId=validation.checkId(eventId);
    const eventCollection=await events();
    const event=await eventCollection.findOne({_id:new ObjectId(eventId)})
    if(!event) throw `Could not get event with id of ${eventId}`
    return event
}

const deleteEvent = async(eventId,userId) => {
    eventId=validation.checkId(eventId)
    userId=validation.checkId(userId)
    const eventCollection=await events();
    const userCollection=await users();
    let attendees=await getAttendees(eventId);
    const deleteEvent=await eventCollection.deleteOne({_id:new ObjectId(eventId)})
    if(!deleteEvent.acknowledged || !deleteEvent.deletedCount) {
        throw "Unable to delete event"
    }
    const updatedUser=await userCollection.updateOne(
        {_id:new ObjectId(userId)},
        {$pull: {"events": new ObjectId(eventId)}}
    )
    if(!updatedUser.acknowledged || !updatedUser.modifiedCount) {
        throw "Event not removed from user"
    }
    for(let x=0;x<attendees.length;x++){
        let updatedAttendee=await userCollection.updateOne(
            {_id:new ObjectId(attendees[x]._id)},
            {$pull: {"attendedEvents": new ObjectId(eventId)}}
        )
        if(!updatedUser.acknowledged || !updatedUser.modifiedCount) {
            throw "Event not removed from attendee"
        }
    }
    return {deleted:true}
}

const getAttendees=async(eventId) => {
    eventId=validation.checkId(eventId);
    const event=await getEventById(eventId);
    return event.attendees;
}

const getIndex = async (id1,arr) =>{
    let index=-1;
    console.log(arr)
    for(let x=0;x<arr.length;x++){
        console.log(arr[x]);
        if(arr[x]._id.toString()===(id1.toString())){
            index=x;
        }
    }
    return index;
}

const getAttendeeById=async(eventId,attendeeId) => {
    eventId=validation.checkId(eventId);
    attendeeId=validation.checkId(attendeeId);
    const eventCollection=await events();
    const attendee=await eventCollection.findOne(
        {_id:new ObjectId(eventId)},
        {'attendees':{$elemMatch:{_id:new ObjectId(attendeeId)}}}
    )
    console.log(attendee.attendees[0]);
    console.log('i dont like to work')
    let index=await getIndex(attendeeId,attendee.attendees);
    console.log(index);
    if(index===-1) throw `Unable to find attendee ${attendeeId} in event ${eventId}`
    return attendee.attendees[index];
}
//needs an entire attendee object (with attendee id and new availability)
const addAttendee=async(eventId,newAttendee) => {
    console.log(newAttendee)
    eventId=validation.checkId(eventId);
    const eventCollection=await events();
    const updatedEvent=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {$push:{"attendees":{_id:new ObjectId(newAttendee._id),availability:newAttendee.availability}}}
    )
    if(!updatedEvent.modifiedCount){
        throw `Unable to add attendee ${newAttendee} to event ${eventId}`
    }
    const userCollection=await users();
    const updatedUser = await userCollection.updateOne(
        {_id:new ObjectId(newAttendee._id)},
        {$push: {attendedEvents:new ObjectId(eventId)}}
    )
    if(updatedUser.modifiedCount<1){
        throw "Unable to add this event to your account"
    }

    return await getEventById(eventId);
}
//if the attendee does not currently exist for that event, add it. If it does, update its availability
const upsertAttendee=async(eventId,newAttendee) => {
    let attendee=undefined; let action=undefined;
    try{
        attendee=await getAttendeeById(eventId,newAttendee._id)
    }
    catch(e){
        console.log(e);
        if(e.toString().includes("Unable to find attendee")){       //add attendee with availability
            action='addAttendee'
        }
    }
    if(action=='addAttendee'){
        attendee=newAttendee;
        return await addAttendee(eventId,newAttendee)
    }
    else{   //just change the attendee's availability
        return await updateAttendeeAvailability(eventId,newAttendee._id,newAttendee.availability);
    }

}
//removes attendee with a certain id from an event
const removeAttendee=async(eventId,attendeeId) => {
    eventId=validation.checkId(eventId);
    attendeeId=validation.checkId(attendeeId);
    const eventCollection=await events();
    const updatedEvent=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {$pull:{"attendees":{_id:new ObjectId(attendeeId)}}}
    )
    if(!updatedEvent.modifiedCount){
        throw `Unable to remove attendee ${attendee} from event ${eventId}`
    }
    return await getEventById(eventId);
}

function unwindStartToEnd(start,end){       //given a starting date and ending date, return a range of half hour increments
    let startDate=new Date(start);
    let endDate=new Date(end);
    let dateArr=[]
    let incrDate=new Date(start);
    dateArr.push(startDate.toString())
    while(incrDate<endDate){
        let d=new Date(incrDate.setMinutes(incrDate.getMinutes()+30))
        dateArr.push(d.toString())
    }
    return dateArr;
}
//Takes array of attendees. Returns array of date objects when the most attendees can meet
function findCommonDates(attendees){        
    let datesObj={}
    for(let attendee of attendees){     //for each attendee
        for(let availableDate of attendee.availability){       //get their availability
            availableDate=availableDate.time                   //get the time from that
            for(let eachStartEndObj of availableDate){          //for each start and end point in that time
                let dateRange=unwindStartToEnd(eachStartEndObj.start,eachStartEndObj.end)       //get the entire range from start to end
                for(let eachHalfHourInterval of dateRange){     //for each half hour interval, +=1 it to the datesObj
                    if(!datesObj[eachHalfHourInterval]){
                        datesObj[eachHalfHourInterval]=1
                    }
                    else{
                        datesObj[eachHalfHourInterval]+=1
                    }
                }
            }
        }
    }
    let max=1
    for(let date in datesObj){      //highest number of attendees available at once
        if(datesObj[date]>max){
            max=datesObj[date]
        }
    }
    let bestMeetupTimes=[]
    for(let date in datesObj){
        if(datesObj[date]===max){       //add times/dates with max to the best meetup times
            bestMeetupTimes.push(new Date(date))
        }
    }
    return bestMeetupTimes;
}

const getEventDates=async(eventId) => {
    eventId=validation.checkId(eventId);
    const event=await getEventById(eventId);
    return event.dates;
}

const updateEventDates=async(eventId,dates) => {
    eventId=validation.checkId(eventId);
    const eventCollection=await events();
    const updatedEvent=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {$set:{"domainDates":dates}}
    )
    if(updatedEvent.modifiedCount<=0){
        throw `Unable to update event ${eventId} date with ${dates}`
    }
    return await getEventById(eventId);
}

const updateAttendeeAvailability=async(eventId,attendeeId,newAvailability) => {
    eventId=validation.checkId(eventId)
    attendeeId=validation.checkId(attendeeId)
    const eventCollection=await events();
    const updatedEvent=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {"$set":{"attendees.$[attendee].availability":newAvailability}},
        {arrayFilters:[{"attendee._id":new ObjectId(attendeeId)}]}
    )
    //BREAKS RIGHT ABOVE HERE, IS BEING ADDED AS A STRING NOT AN OBJECT ID
    if(updatedEvent.matchedCount<=0 && updatedEvent.modifiedCount<=0){
        throw `Unable to update event ${eventId} with attendee ${attendeeId} with availability ${newAvailability}`
    }
    return await getEventById(eventId);
}

//POSSIBLY REDUNDANT FUNCTIONS:

//gets a single attendee's availability for one event. Possibly redundant
const getAttendeeAvailability=async(eventId,attendeeId) => {
    eventId=validation.checkId(eventId);
    attendeeId=validation.checkId(attendeeId);
    const eventCollection=await events();
    const availability=await eventCollection.aggregate([
        {$match:{_id:new ObjectId(eventId)}},
        {$unwind:"$attendees"},
        {$match:{"attendees._id":new ObjectId(attendeeId)}},
        {$replaceRoot:{newRoot:"$attendees"}}
    ])
    return await (availability.toArray()).availability;
}
//pushes the availability object to the attendeeId availability array. Possibly redundant
const addAttendeeAvailabilityNewDay=async(eventId,attendeeId,availability) => { 
    eventId=validation.checkId(eventId);
    attendeeId=validation.checkId(attendeeId);
    const eventCollection=await events();
    const updatedUser=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {'attendees._id':new ObjectId(attendeeId)},
        {$push:{'attendees.$.availability':availability}}
    )
    if(updatedUser.modifiedCount<=0){
        throw `Unable to add availability ${availability} to attendee ${attendeeId} in event ${eventId}`
    }
    return await getEventById(attendeeId);
}
//adds a date object (date, start time, and end time) to the event. Possibly redundant
const addEventDate=async(eventId,newDate) => {
    eventId=validation.checkId(eventId);
    const eventCollection=await events();
    const updatedEvent=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {$push:{"domainDates":newDate}}
    )
    if(!updatedEvent.modifiedCount){
        throw `Unable to add date ${newDate} to event ${eventId}`
    }
    return await getEventById(eventId);
}
//will remove anything under domainDates that matches dateToRemove. Possibly redundant
const removeEventDate=async(eventId,dateToRemove) => {      
    eventId=validation.checkId(eventId);
    const eventCollection=await events();
    const updatedEvent=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {$pull:{"domainDates":dateToRemove}}
    )
    if(updatedEvent.modifiedCount<=0){
        throw `Unable to remove date ${dateToRemove} from event ${eventId}`
    }
    return await getEventById(eventId);
}
export default {
    createEvent,
    getEventById,
    deleteEvent,
    updateEvent,
    getAttendees,
    getAttendeeById,
    addAttendee,
    upsertAttendee,
    removeAttendee,
    getEventDates,
    updateEventDates,
    updateAttendeeAvailability,
    findCommonDates,
    //possibly redundant:
    getAttendeeAvailability,
    addAttendeeAvailabilityNewDay,
    addEventDate,
    removeEventDate
}