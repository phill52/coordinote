const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const events= mongoCollections.events;
const validation=require('../validation')
const fn=validation.fn;

const createEvent = async(eventName,eventLocation,participantIDs,eventDate,timeRange,userId) => {
    eventName=validation.checkEventName(eventName);
    // userId=validation.checkId(userId);
    const eventCollection=await events();
    let d=new Date();
    let date=d.toLocaleDateString()
    let time=`${fn(d.getHours())} ${fn(d.getMinutes())}`
    let newEvent = {
        name: eventName,
        dateCreated: date+' '+time,
        creatorID:userId,
        date:eventDate,
        timeRange:timeRange,
        location:eventLocation,
        participants:participantIDs
    }
    const insertEvent=await eventCollection.insertOne(newEvent);
    if(!insertEvent.acknowledged || !insertEvent.insertedId)
        throw "Unable to add event"
    return await getEventById(insertEvent.insertedId)
}

const getEventById = async(eventId) => {
    eventId=validation.checkId(eventId);
    const eventCollection=await events();
    const event=await eventCollection.findOne({_id:eventId})
    if(!event) throw `Could not get event with id of ${eventId.toString()}`
    return event
}

const deleteEvent = async(userId,eventId) => {
    eventId=validation.checkId(eventId)
    userId=validation.checkId(userId)
    const eventCollection=await events();
    const userCollection=await users();
    const deleteEvent=await eventCollection.deleteOne({_id:eventId})
    if(!deleteEvent.acknowledged || !deleteEvent.deletedCount) {
        throw "Unable to delete event"
    }
    const updatedUser=await userCollection.updateOne(
        {_id:userId},
        {$pull: {"events": {"_id": eventId}}}
    )
    if(!updatedUser.acknowledged || !updatedUser.modifiedCount) {
        throw "Event not removed from user"
    }
    return {deleted:true}
}

const updateEvent = async(eventId,newName,newLocation,newParticipants,newDate,userId) => {
    eventId=validation.checkId(eventId)
    userId=validation.checkId(userId)
    if(newName) newName=validation.checkEventName(newName)
    if(newLocation) newLocation=validation.checkLocation(newLocation)
    if(newParticipants) newParticipants=validation.checkParticipants(newParticipants)
    if(newDate) newDate=validation.checkDate(newDate)

    const eventCollection=await events();
    const editedEvent=await eventCollection.updateOne(
        {_id:eventId},
        {$set: {"name":newName, "date":newDate, "location":newLocation, "participants":newParticipants}}
    )
    if(editedEvent.modifiedCount===0){
        throw "Could not update event"
    }
    return await getEventById(eventId)
}

module.exports={
    createEvent,
    getEventById,
    deleteEvent,
    updateEvent
}