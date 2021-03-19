const bcrypt = require('bcrypt');
const saltRounds = 10;

// returns object of the URL database for objects matching the users account only.
const urlsForUser = (id, userDB) => {
  let userURLs = {};
  for (const key in userDB) {
    if (userDB[key].userID === id) {
      userURLs[key] = userDB[key];
    }
  }
  return userURLs;
};

// Validate that the password is correct
const validPassword = (userEmail, userPassword, userDB) => {
  for (const currentID in userDB) {
    if (userDB[currentID]['email'] === userEmail) {
      const hashedPass = userDB[currentID].password;
      if (bcrypt.compareSync(userPassword, hashedPass)) {
        return currentID;
      }
    }
  }
  return null;
};

// validates that email and password have a value.
const validInput = (object) => {
  const { email, password } = object;
  if (email.length === 0 || password.length === 0) {
    return false;
  } else if (email.length > 0 || password.length > 0) {
    return true;
  }
};

// get user email and ID if it's in the system.
const getUserByEmail = (userEmail, userDB) => {
  for (const currentID in userDB) {
    if (userDB[currentID]['email'] === userEmail) {
      return { userEmail, currentID };
    }
  }
  return { 'userEmail': null, 'currentID': null };
};

// generates a random string for IDs
const generateRandomString = () => {
  return Math.random().toString(36).substring(6);
};

// create a new user if it's not already in the database
const createUser = (userInfo, userDB) => {
  const { email, password } = userInfo;
  const { userEmail, currentID } = getUserByEmail(email, userDB);
  if (!userEmail && !currentID) {
    const userID = generateRandomString();
    const cryptPass = bcrypt.hashSync(password, saltRounds);
    userDB[userID] = { 'id': userID, 'email': email, 'password': cryptPass};

    return { email, userID };
  } else {
    return { 'userEmail': null, 'currentID': null };
  }
};

// checks the cookies for a valid/loged in session. Next if valid, else it redirects to login.
const validSession = (req, res, next) => {
  if (!req.session['user_id']) {

    res.redirect('/login');
    return;
  }
  next();
};

module.exports = { validSession, createUser, generateRandomString, getUserByEmail, validInput, validPassword, urlsForUser };