import mongoCollections from '../config/mongoCollections.js';
const users = mongoCollections.users
const events = mongoCollections.events
import eventFunctions from './events.js'
import {ObjectId} from 'mongodb'
import validation from'../validation.js'

// Create mongo user
const createUser = async (username, uid) => {
    username = validation.checkUsername(username);
    uid = validation.checkNotNull(uid);
    const userCollection = await users();

    if (await userCollection.findOne({username: username})
     || await userCollection.findOne({uid: uid})) {
        throw "Error: Cannot create user.";
    }
    
    let newUser = {
        _id: uid,
        username: username,
        events: [],
        attendedEvents:[]
    }

    const insertUser = await userCollection.insertOne(newUser);
    if(!insertUser.acknowledged || !insertUser.insertedId) {
        throw "Error: Cannot create user."
    }

    const user = await userCollection.findOne({username: username});

    // return the user doc sans uid (firebase token)
    return {insertedUser: true, username: user.username}
}

const checkUsernameUnique = async (username) => {
    username = validation.checkUsername(username);
    const userCollection = await users();
    const user = await userCollection.findOne({username: username});
    if(user) return false;
    return true;
}

const addUserPicture = async (userId, picture) => {
    userId = validation.checkId(userId)
    picture = validation.checkPicture(picture)

    const userCollection = await users();
    const updatedUser = await userCollection.updateOne(
        {_id: new ObjectId(userId)},
        {$set: {picture: picture}}
    );

    if(!updatedUser.acknowledged || !updatedUser.modifiedCount)
        throw "Could not update user picture"

    return await getUserById(userId);
}

const getUsersEvents = async (userId) => {
    userId = validation.checkId(userId);

    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(userId)});
    if(!user) throw `Could not find user with id ${userId}.`;
    
    let eventsArray = [];
    for(let i in user.events){
        eventsArray.push(await eventFunctions.getEventById(user.events[i]));
    }
    let attendedArray=[];
    for(let i in user.attendedEvents){
        attendedArray.push(await eventFunctions.getEventById(user.attendedEvents[i]))
    }
    
    return {events:eventsArray,attended:attendedArray};
}

export default {
    createUser,
    checkUsernameUnique,
    addUserPicture,
    getUsersEvents
}