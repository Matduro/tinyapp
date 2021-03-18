const bcrypt = require('bcrypt');
const saltRounds = 10;
/* const validateUser = (userInfo, userDB) => {
  const { email, password } =
  && userDB[currentID][email]
  for (const currentID in userDB) {
    if (userDB[currentID][email] === email) {
      return { user: null, error: "email" };
    } else return { user: currentUser, error: null };
  }
}; */

const urlsForUser = (id, userDB) => {
  let userURLs = {};
  // return object which contains the objects that contain userID
  for (const key in userDB) {
    if (userDB[key].userID === id) {
      userURLs[key] = userDB[key];
    }
  }
  return userURLs;
};

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

const validInput = (object) => {
  const { email, password } = object;
  if (email.length === 0 || password.length === 0) {
    return false;
  } else if (email.length > 0 || password.length > 0) {
    return true;
  }
};
// userDB.filter(userObj => userObj.email === email)
const getUserByEmail = (userEmail, userDB) => {
  
  for (const currentID in userDB) {
    if (userDB[currentID]['email'] === userEmail) {
      return { userEmail, currentID };
    }
  }
  return { 'userEmail': null, 'currentID': null };
};


/*   const currentUser = userDB[email]
  if (currentUser) {
    if (currentUser.password === password) {
      // successful login
      return { user: currentUser, error: null };
    } else {
      // failed at password
      return { user: null, error: "password" };
    }
  } else {
    // failed at email
    return { user: null, error: "email" };
  }
}; */


const generateRandomString = () => {
  return Math.random().toString(36).substring(6);
};


const createUser = (userInfo, userDB) => {
  const { email, password } = userInfo;
  const { userEmail, currentID } = getUserByEmail(email, userDB);
  if (!userEmail && !currentID) {
    const userID = generateRandomString();
    const cryptPass = bcrypt.hashSync(password, saltRounds);
    userDB[userID] = { 'id': userID, 'email': email, 'password': cryptPass};

    return { email, userID };
  } else {
    return null;
  }
};


const validSession = (req, res, next) => {
  if (!req.session['user_id']) {

    res.redirect('/login');
    return;
  }
  next();
};

/* const findUser = (email, userDB) => {
  const currentUser = userDB.find(userObj => userObj.email === email);

  return currentUser;
}; */

module.exports = { validSession, createUser, generateRandomString, getUserByEmail, validInput, validPassword, urlsForUser };