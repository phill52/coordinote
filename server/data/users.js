const bcrypt=require('bcryptjs')
const saltRounds=11
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users
const validation=require('../validation')

const createUser = async(username,password) => {        //when a user registers
    username=validation.checkUsername(username)
    const userCollection=await users();
    if(await userCollection.findOne({username:username})) {
        throw "That user already exists"
    }
    password=validation.checkPassword(password,false)
    const hashed_pw=await bcrypt.hash(password,saltRounds)
    let newUser= {
        username: username,
        password: hashed_pw,
        events: []
    }
    const insertUser=await userCollection.insertOne(newUser);
    if(!insertUser.acknowledged || !insertUser.insertedId)
        throw new Error("Could not add user")
    return {insertedUser: true, userId: insertUser.insertedId}
}

const checkUser = async(username,password) => {         //when a user logs in
    username=validation.checkUsername(username)
    password=validation.checkPassword(password,true)
    const userCollection=await users();
    const user=await userCollection.findOne({username:username})
    if(!user) throw "Either the username or password is invalid"
    let user_hashed_password=user.password
    let comparison=await bcrypt.compare(password,user_hashed_password)
    if(comparison) return {authenticatedUser: true}
    throw "Either the username or password is invalid"
}

module.exports={
    createUser,
    checkUser
}