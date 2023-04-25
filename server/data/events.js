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

const getEventAttendees=async(eventId) => {
    eventId=validation.checkId(eventId);
    const event=await getEventById(eventId);
    return event.attendees;
}

const addEventAttendee=async(eventId,newAttendee) => {
    eventId=validation.checkId(eventId);
    const eventCollection=await events();
    const updatedEvent=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {$push:{"attendees":newAttendee}}
    )
    if(!updatedEvent.modifiedCount){
        throw `Unable to add participant ${newAttendee} to event ${eventId}`
    }
    return await getEventById(eventId);
}

const removeEventAttendee=async(eventId,newAttendee) => {
    eventId=validation.checkId(eventId);
    const eventCollection=await events();
    const updatedEvent=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {$push:{"attendees":newAttendee}}
    )
    if(!updatedEvent.modifiedCount){
        throw `Unable to add participant ${newAttendee} to event ${eventId}`
    }
    return await getEventById(eventId);
}

const getEventDates=async(eventId) => {
    eventId=validation.checkId(eventId);
    const event=await getEventById(eventId);
    return event.dates;
}

const addEventDates=async(eventId,newDate) => {
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

const removeEventDate=async(eventId,dateToRemove) => {      //needs an entire date
    eventId=validation.checkId(eventId);
    const eventCollection=await events();
    const updatedEvent=await eventCollection.updateOne(
        {_id:new ObjectId(eventId)},
        {$pull:{"domainDates":dateToRemove}}
    )
    if(!updatedEvent.modifiedCount){
        throw `Unable to remove date ${dateToRemove} from event ${eventId}`
    }
    return await getEventById(eventId);
}

const getAttendeeAvailability=async(eventId,attendeeId) => {        //gets a single attendee's availability for one event
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

module.exports={
    createEvent,
    getEventById,
    deleteEvent,
    updateEvent,
    getEventAttendees,
    addEventAttendee,
    removeEventAttendee,
    getEventDates,
    addEventDates,
    removeEventDate,
    getAttendeeAvailability
}