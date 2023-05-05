import xss from 'xss'
import {ObjectId} from 'mongodb'

function fn(str){       //adds leading 0 to 1 digit time numbers
    if(str.toString().length===1) str='0'+str.toString();
    return str
}

function checkNotNull(obj){
    if(obj === null) throw new Error("Object is null");
    return obj;
}

function checkUsername(username,notCreating){
    if(!username) throw "You must supply a username"
    if(typeof username!=='string') throw new Error("Username must be a string")
    username=username.trim();
     username=xss(username);
    if(notCreating) { //done this way so that users can still log in if username requirements change
        if(username.length<4) throw new Error("Username must be at least 4 characters long")
    }
    return username
}

function checkPassword(password,notCreating){       //2nd parameter differentiates between registering and logging in
    if(!password) throw "You must supply a password"
    if(typeof password!=='string') throw new Error("Password must be a string")
    password=password.trim(); password=xss(password);
    if(!notCreating) {          //done this way so that users can still log in if password requirements change
        //password criteria
        if(password.length<6) throw "Password must be at least 6 characters long"
        if(password.toLowerCase()===password) throw "Password must include at least one uppercase character"
        if(!(/[0-9]/).test(password)) throw ("Password must include at least one number")
        if(!(/[^a-z0-9]/i).test(password)) throw "Password must include at least one special character"
    }
    return password
}

function checkId(id){
    if(!id) throw new Error("id is not defined")
    // if(typeof id!=='string') throw new Error('id is not a string')
    // if(id.trim().length===0) throw new Error("id cannot be an empty string or just spaces")
    // id=id.trim(); id=xss(id);
    if(!ObjectId.isValid(id)) throw new Error("Invalid object id")
    return id
}

function checkEventName(name){
    if(!name) throw "Event name does not exist"
    if(typeof name!=='string') throw "Event name must be a string"
    if(name.trim().length<=2) throw "Event name must be at least 2 characters long"
    name=xss(name)
    return name.trim()
    
}

function checkAttendees(participants){
    let index=0;
    for(index in participants){
        // if(!checkId(participants[index])){
        //     throw `Invalid participant: ${participants[index]}`
        // }
    }
    return participants
}

function checkDate(date){
    // let d=new Date()
    return date
}

function checkLocation(location){
    return location
}


export default {
    checkNotNull,
    checkUsername,
    checkPassword,
    checkId, //this bad boy is gonna be used a lot
    checkEventName,
    checkDate,
    checkAttendees,
    checkLocation,
    fn
}