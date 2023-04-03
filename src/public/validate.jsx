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

export { validatePassword, validateEmail };