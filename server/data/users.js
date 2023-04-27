const bcrypt=require('bcrypt')
const saltRounds=11
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users
const events = mongoCollections.events
const eventFunctions=require('./events')
const {ObjectId}=require('mongodb')
const validation=require('../validation')

const createUser = async (username, password) => {
    username = validation.checkUsername(username)
    const userCollection = await users();
    if(await userCollection.findOne({username: username})) {
        throw "Either the username or password is invalid"
    }
    
    password = validation.checkPassword(password,false)
    const hashed_pw = await bcrypt.hash(password,saltRounds)

    let newUser = {
        username: username,
        password: hashed_pw,
        events: []
    }

    const insertUser = await userCollection.insertOne(newUser);
    if(!insertUser.acknowledged || !insertUser.insertedId)
        throw new Error("Could not add user")
    
    return {insertedUser: true, userId: insertUser.insertedId}
}

const checkUser = async (username, password) => {
    username = validation.checkUsername(username)
    password = validation.checkPassword(password,true)

    const userCollection = await users();
    const user = await userCollection.findOne({username: username})
    if(!user) throw "Either the username or password is invalid"

    let user_hashed_password = user.password
    let comparison = await bcrypt.compare(password, user_hashed_password)

    if(comparison) return {authenticatedUser: true, userId:user._id}
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

module.exports={
    createUser,
    checkUser,
    addUserPicture,
    getUsersEvents
}