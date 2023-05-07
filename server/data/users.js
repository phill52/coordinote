import {ObjectId} from 'mongodb';
import xss from 'xss';

import mongoCollections from '../config/mongoCollections.js';
import eventFunctions from './events.js';
import validation from'../validation.js';

const users = mongoCollections.users;
const events = mongoCollections.events;

// Create mongo user
const createUser = async function (username, userId) {
    // Validation
    validation.checkNumOfArgs(arguments, 2);
    validation.checkIsProper(username, 'string', 'username');
    validation.checkString(username, 'username', 6, 32, true, true, false, false);
    validation.checkIsProper(userId, 'string', 'userId');
    // TODO: Does userId have a certain structure?
    validation.checkString(userId, 'userId', 0, 100, true, true, false, false);

    // Cleaning
    username = xss(username).trim();
    userId = xss(userId).trim();

    // Grab collection
    const userCollection = await users();

    // Check if already exists
    if (await userCollection.findOne({username: username})
     || await userCollection.findOne({firebaseId: userId}))
        throw "Error: Invalid credentials.";
    
    // Create new entry
    let newUser = {
        firebaseId: userId,
        username: username,
        picture: "",
        createdEvents: [],
        attendedEvents:[],
        picture: "https://coordinote.s3.amazonaws.com/defaultPFP.png"
    }

    // Insert into database
    const insertUser = await userCollection.insertOne(newUser);
    if(!insertUser.acknowledged || !insertUser.insertedId)
        throw "Error: Could not insert user into database.";

    // Check for success
    const user = await userCollection.findOne({username: username});
    if(!user) throw `Error: Could not retreive user from database with name ${username}.`;

    // return the user doc sans userId (firebase token)
    return {insertedUser: true, username: user.username}
}

const getUserByName = async function (username) {
    // Validation
    validation.checkNumOfArgs(arguments, 1);
    validation.checkIsProper(username, 'string', 'username');
    validation.checkString(username, 'username', 1, 32, true, true, false, false);

    // Cleaning
    username = xss(username).trim();

    const userCollection = await users();
    const user = await userCollection.findOne({username: username});
    if(!user) throw `Error: No user found with username '${username}'.`;

    return user;
}

const getUserByUID = async function (userId) {
    // Validation
    validation.checkNumOfArgs(arguments, 1);
    validation.checkIsProper(userId, 'string', 'userId');
    validation.checkString(userId, 'userId', 1, 100, true, true, false, false);

    // Cleaning
    userId = xss(userId).trim();

    const userCollection = await users();
    const user = await userCollection.findOne({firebaseId: userId});
    if (!user) throw `Error: No user found with userId '${userId}'.`;

    return user;
}

const getUserById = async function (mongoId) {
    // Validation
    validation.checkNumOfArgs(arguments, 1);
    validation.checkIsProper(mongoId, 'string', 'mongoId');
    validation.checkId(mongoId);

    // Cleaning
    mongoId = xss(mongoId).trim();

    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(mongoId)});
    if (!user) throw `Error: No user found with _id '${mongoId}'.`;

    return user;
}

const checkUsernameUnique = async function (username) {
    // Validation
    validation.checkNumOfArgs(arguments, 1);
    validation.checkIsProper(username, 'string', 'username');
    validation.checkString(username, 'username', 1, 32, true, true, false, false);

    // Cleaning
    username = xss(username).trim();

    const userCollection = await users();
    const user = await userCollection.findOne({username: username});

    // If user found, not unique
    if(user) return false;
    return true;
}

const setUserPicture = async function (userId, picture) {
    // Validation
    validation.checkNumOfArgs(arguments, 2);
    validation.checkIsProper(userId, 'string', 'userId');
    validation.checkString(userId, 'userId', 1, 100, true, true, false, false);
    validation.checkIsProper(picture, 'string', 'picture');
    validation.checkString(picture, 'picture', 1, 100, true, true, false, true);
    validation.checkImage(picture);

    // Cleaning
    userId = xss(userId).trim();
    picture = xss(picture).trim();

    const userCollection = await users();
    const updatedUser = await userCollection.updateOne(
        {_id: new ObjectId(userId)},
        {$set: {picture: picture}}
    );

    if(!updatedUser.acknowledged || !updatedUser.modifiedCount)
        throw `Error: Could not add picture ${picture} to user with id ${userId}.`;

    return await getUserByUID(userId);
}

const getUserEvents = async function (userId) {
    // Validation
    validation.checkNumOfArgs(arguments, 1);
    validation.checkIsProper(userId, 'string', 'userId');
    validation.checkString(userId, 'userId', 1, 100, true, true, false, false);

    // Cleaning
    userId = xss(userId).trim();

    const userCollection = await users();
    const user = await userCollection.findOne({firebaseId: new ObjectId(userId)});
    if(!user) throw `Could not find user with id ${userId}.`;
    
    let eventsArray = [];
    for(let i in user.createdEvents) {
        eventsArray.push(await eventFunctions.getEventById(user.createdEvents[i]));
    }
    let attendedArray=[];
    for(let i in user.attendedEvents) {
        attendedArray.push(await eventFunctions.getEventById(user.attendedEvents[i]))
    }
    
    return {events: eventsArray, attended: attendedArray};
}

export default {
    createUser,
    getUserByName,
    getUserByUID,
    getUserById,
    checkUsernameUnique,
    setUserPicture,
    getUserEvents
}