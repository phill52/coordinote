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
        events: []
    }

    const insertUser = await userCollection.insertOne(newUser);
    if(!insertUser.acknowledged || !insertUser.insertedId) {
        throw "Error: Cannot create user."
    }

    const user = await userCollection.findOne({username: username});

    // return the user doc sans uid (firebase token)
    return {insertedUser: true, username: user.username}
}

const checkUser = async (username, password) => {
    username = validation.checkUsername(username)
    password = validation.checkPassword(password,true)

    const userCollection = await users();
    const user = await userCollection.findOne({username: username})
    if(!user) throw "Error: Either the username or password is invalid"

    // let user_hashed_password = user.password
    // let comparison = await bcrypt.compare(password, user_hashed_password)

    if(true) return {authenticatedUser: true, userId:user._id}
    throw "Either the username or password is invalid"
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
    
    return eventsArray;
}

export default {
    createUser,
    checkUser,
    addUserPicture,
    getUsersEvents
}