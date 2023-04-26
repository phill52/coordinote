const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const events= mongoCollections.events;
const validation=require('../validation')
const {ObjectId}=require('mongodb')
const fn=validation.fn;

const createEvent = async(eventName,description,eventLocation,eventDate,userId) => {
    eventName=validation.checkEventName(eventName);
    eventLocation=validation.checkLocation(eventLocation)
    eventDate=validation.checkDate(eventDate)
    userId=validation.checkId(userId);
    const eventCollection=await events();
    let newEvent = {
        name:eventName,
        description:description,
        location:eventLocation,
        domainDates:[],
        attendeed:[],
        image:"https://streamsentials.com/wp-content/uploads/pogchamp-transparent.png",
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
const updateEvent = async(eventId,newName,newLocation,newDomainDates,newAttendees,newImage,newDescription) => {
    eventId=validation.checkId(eventId)
    userId=validation.checkId(userId)
    if(newName) newName=validation.checkEventName(newName)
    if(newLocation) newLocation=validation.checkLocation(newLocation)
    if(newParticipants) newParticipants=validation.checkParticipants(newParticipants)
    if(newDate) newDate=validation.checkDate(newDate)
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
    return {deleted:true}
}

const getAttendees=async(eventId) => {
    eventId=validation.checkId(eventId);
    const event=await getEventById(eventId);
    return event.attendees;
}

const getAttendeeById=async(eventId,attendeeId) => {
    eventId=validation.checkId(eventId);
    attendeeId=validation.checkId(attendeeId);
    const eventCollection=await events();
    const attendee=await eventCollection.findOne(
        {_id:new ObjectId(eventId)},
        {'attendees':{$elemMatch:{_id:new ObjectId(attendeeId)}},
         _id:0}
    )
    if(!attendee) throw `Unable to find attendee ${attendeeId} in event ${eventId}`
    return attendee.attendees[0];
}
//needs an entire attendee object (with attendee id and new availability)
const addAttendee=async(eventId,newAttendee) => {
    eventId=validation.checkId(eventId);
    const eventCollection=await events();
    const updatedEvent=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {$push:{"attendees":newAttendee}}
    )
    if(!updatedEvent.modifiedCount){
        throw `Unable to add attendee ${newAttendee} to event ${eventId}`
    }
    return await getEventById(eventId);
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
        {$set:{"attendees.$.availability":newAvailability}}
    )
    if(updatedEvent.matchedCount<=0 && updatedEvent.modifiedCount<=0){
        throw `Unable to update event ${eventId} with attendee ${attendeeId} with availability ${newAvailability}`
    }
    return getEventById(eventId);
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
module.exports={
    createEvent,
    getEventById,
    deleteEvent,
    updateEvent,
    getAttendees,
    getAttendeeById,
    addAttendee,
    removeAttendee,
    getEventDates,
    updateEventDates,
    updateAttendeeAvailability,
    //possibly redundant:
    getAttendeeAvailability,
    addAttendeeAvailabilityNewDay,
    addEventDate,
    removeEventDate
}