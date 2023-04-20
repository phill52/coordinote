const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const events= mongoCollections.events;
const validation=require('../validation')
const {ObjectId}=require('mongodb')
const fn=validation.fn;

const createEvent = async(eventName,eventLocation,participantIDs,eventDate,timeRange,userId) => {
    eventName=validation.checkEventName(eventName);
    eventLocation=validation.checkLocation(eventLocation)
    eventDate=validation.checkDate(eventDate)
    userId=validation.checkId(userId);
    const eventCollection=await events();
    let d=new Date();
    let date=d.toLocaleDateString()
    let time=`${fn(d.getHours())}:${fn(d.getMinutes())}`
    let newEvent = {
        name:eventName,
        dateCreated: date+' '+time,
        creatorID:userId,
        date:eventDate,
        timeRange:timeRange,
        location:eventLocation,
        participants:participantIDs
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

const updateEvent = async(eventId,newName,newLocation,newParticipants,newDate,userId) => {
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
            "date":newDate?newDate:oldEvent.date, 
            "location":newLocation?newLocation:oldEvent.location, 
            "participants":newParticipants?newParticipants:oldEvent.participants
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

module.exports={
    createEvent,
    getEventById,
    deleteEvent,
    updateEvent
}