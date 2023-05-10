const validatePassword = password => {
  //returns true if valid. returns false otherwise.
  if (typeof password !== "string") throw "Input must be a string";
  password = password.trim();
  if (password.length < 1) return false;
  const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.*[a-zA-Z]).{6,20}$/; //Contains one number, one lowercase, one uppercase, and one special char, and length 6-20
  return passRegex.test(password);
};

const validateEmail = email => {
  //returns true if valid. returns false otherwise.
  if (typeof email !== "string") throw "Input must be a string";
  email = email.trim();
  if (email.length < 1) return false;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; //Contains one number, one lowercase, one uppercase, and one special char, and length 6-20
  return emailRegex.test(email);
}
//name: 40, descritption: 1000, location: 100 
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

const checkDomainDates = function checkDomainDates(domainDates) {
  for (let domainDate of domainDates) {
      if (!domainDate) throw `Error: You must provide domainDate.`;
      if (typeof domainDate !== 'object') throw `Error: domainDate must be an object.`;
      if (!domainDate.date) throw `Error: domainDate must have a date.`;
      if (new Date(domainDate.date) == 'Invalid Date') throw `Error: date must be a valid date.`;
      if (!domainDate.time) throw `Error: domainDate must have a time.`;
      if (typeof domainDate.time !== 'object') throw `Error: time must be an object.`;
      if (!domainDate.time.start) throw `Error: time must have a start.`;
      if (!domainDate.time.end) throw `Error: time must have an end.`;
      if (new Date(domainDate.time.start) == 'Invalid Date') throw `Error: start must be a valid date.`;
      if (new Date(domainDate.time.end) == 'Invalid Date') throw `Error: end must be a valid date.`;
      if (new Date(domainDate.time.start) > new Date(domainDate.time.end)) throw `Error: start must be before end.`;
  }
}

export { validatePassword, validateEmail, checkString, checkDomainDates};