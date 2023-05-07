import xss from 'xss'
import {ObjectId} from 'mongodb'

/**
 * Arg counting
 */
const checkNumOfArgs = function checkNumOfArgs(args, numArgsLow, numArgsHigh) {
    if (!numArgsHigh) {
        if (args.length != numArgsLow)
            throw ((numArgsLow == 1) 
            ? `Error: Exactly ${numArgsLow} argument must be provided.`
            : `Error: Exactly ${numArgsLow} arguments must be provided.`);
    }
    if(args.length < numArgsLow || args.length > numArgsHigh)
        throw (numArgsLow == numArgsHigh)
        ? ((numArgsLow == 1) 
        ? `Error: Exactly ${numArgsLow} argument must be provided.`
        : `Error: Exactly ${numArgsLow} arguments must be provided.`)
        : `Error: Number of arguments must be in range [${numArgsLow}, ${numArgsHigh}].`;
};

/**
 * Arg typing
 */

const checkNotNull = function checkNotNull(obj){
    if(obj === null) throw new Error("Object is null");
    return obj;
}

const checkIsProper = function checkIsProper(val, varType, variableName) {
    if(!val && typeof val != 'boolean') throw `Error: ${variableName || 'Variable'} is not defined.`;
    // Check parameter type is correct (also checks if its defined)
    if (typeof val != varType) throw `Error: ${variableName || 'provided variable'} must be a ${varType}.`;

    // Also required to catch NaNs since theyre technically type 'number'
    if (varType == 'number' && isNaN(val)) throw `Error: ${variableName || 'provided variable'} must not be NaN.`;

    // For strings, check if trimmed string is empty
    if(varType == 'string' && val.trim().length < 1) throw (1 == 1)
        ? `Error: Trimmed ${variableName || 'provided variable'} cannot be empty.`
        : `Error: Trimmed ${variableName || 'provided variable'} must be at least ${length} characters long.`;
};

const checkString = function checkString(strVal, varName = '', minLength = 0, maxLength = Infinity, alpha = true, numeric = true, spacesOk = true, specialCharOk = false) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
  
    if (strVal.length < minLength)
      throw `Error: Trimmed ${varName} must be at least ${minLength} characters long.`;
    if (strVal.length > maxLength)
      throw `Error: Trimmed ${varName} must be no more than ${maxLength} characters long.`;
  
    if (!spacesOk && strVal.includes(' '))
      throw `Error: ${varName} cannot contain spaces.`;
  
    if (alpha && !(/[a-zA-Z]/.test(strVal)))
      throw `Error: ${varName} must contain some letters.`;
  
    // Check if all characters fall within 0-9 and a-z
    if (alpha && numeric && !specialCharOk && !spacesOk && !strVal.match(/^[0-9a-zA-Z]+$/))
      throw `Error: ${varName} must be alphanumeric without spaces.`;
    if (alpha && numeric && !specialCharOk && spacesOk && !strVal.match(/^[0-9a-zA-Z ]+$/))
      throw `Error: ${varName} must be alphanumeric (can have spaces).`;
    if (alpha && !numeric && !specialCharOk && !strVal.match(/^[a-zA-Z ]+$/))
      throw `Error: ${varName} must only be alphabetic.`;
    if (!alpha && numeric && !specialCharOk && !strVal.match(/^[0-9]+$/))
      throw `Error: ${varName} must only be numeric.`;
};

const checkInt = function checkInteger(num, numName, mustBePositive) {
    checkIsProper(num, 'number', numName);
    if(isNaN(num) || !Number.isInteger(num)) throw `Error: ${numName} must be a valid integer.`;
    if(mustBePositive && num < 1) throw `Error: Integer ${numName} must be greater than 0.`;
};

/**
 * Complex typing
 */

const checkArray = function checkArray(array, arrName, elemType, minArrayLength = 0, maxArrayLength = Infinity, minElemLength = 0, maxElemLength = Infinity) {
    if(!Array.isArray(array)) throw `Error: ${arrName} must be an array.`;
    if(array.length < minArrayLength || array.length > maxArrayLength) throw `Error: ${arrName} must have length within [${minArrayLength}, ${maxArrayLength}].`;
    for (const elem of array) {
        checkIsProper(elem, elemType,`Within ${arrName}, ${elem}`);
        if(elemType == 'string') {
            checkString(elem, minElemLength, maxElemLength, `Within ${arrName}, ${elem}`, true, false, true);
        }
        if(elemType == 'number') {
            checkInt(num, `Within ${arrName}, ${elem}`);
        }
        if(elemType == 'id') {
            checkId(elem, `Within ${arrName}, ${elem}`);
        }
    }
};

/**
 * Specific checks
 */

const checkId = function checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}.`;
    // apparently this is a better check than ObjectId.isValid(), according to
    // https://stackoverflow.com/questions/13850819/can-i-determine-if-a-string-is-a-mongodb-objectid
    if(id != new ObjectId(id)) throw `Error: ID is not a valid ObjectId.`;
    return id;
};

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

const checkImage = function checkImage(image) {
    if (!image) throw `Error: You must provide a image.`;
    if (typeof image !== 'string') throw `Error: image must be a string.`;
    image = image.trim();
    if (image.length === 0)
        throw `Error: image cannot be an empty string or just spaces`;
    if (image.indexOf('https://coordinote.s3.amazonaws.com/') != 0)
        throw `Error: image URL must start with 'https://coordinote.s3.amazonaws.com/'.`;
    if (image.split('https://coordinote.s3.amazonaws.com/')[1].length === 0)
        throw `Error: image URL must contain a file name.`;
}

const checkDomainDates = function checkDomainDates(domainDates) {
    checkArray(domainDates, 'domainDates', 'object');
    for (let domainDate of domainDates) {
        if (!domainDate) throw `Error: You must provide domainDate.`;
        if (typeof domainDate !== 'object') throw `Error: domainDate must be an object.`;
        if (!domainDate.date) throw `Error: domainDate must have a date.`;
        if (typeof domainDate.date !== 'string') throw `Error: date must be a string.`;
        if (new Date(domainDate.date) == 'Invalid Date') throw `Error: date must be a valid date.`;
        if (!domainDate.time) throw `Error: domainDate must have a time.`;
        if (typeof domainDate.time !== 'object') throw `Error: time must be an object.`;
        if (!domainDate.time.start) throw `Error: time must have a start.`;
        if (!domainDate.time.end) throw `Error: time must have an end.`;
        if (typeof domainDate.time.start !== 'string') throw `Error: start must be a string.`;
        if (typeof domainDate.time.end !== 'string') throw `Error: end must be a string.`;
        if (new Date(domainDate.time.start) == 'Invalid Date') throw `Error: start must be a valid date.`;
        if (new Date(domainDate.time.end) == 'Invalid Date') throw `Error: end must be a valid date.`;
        if (new Date(domainDate.time.start) > new Date(domainDate.time.end)) throw `Error: start must be before end.`;
    }
}

function checkDate(date){
    // let d=new Date()
    return date
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

function checkLocation(location){
    return location
}

function fn(str){       //adds leading 0 to 1 digit time numbers
    if(str.toString().length===1) str='0'+str.toString();
    return str
}

export default {
    // Arg counting
    checkNumOfArgs,
    // Basic typing
    checkNotNull,
    checkIsProper,
    checkString,
    checkInt,
    // Complex typing
    checkArray,
    // Specific typing
    checkId,
    checkUsername,
    checkPassword,
    checkImage,
    checkDomainDates,
    checkDate,
    checkAttendees,
    checkLocation,
    fn
}