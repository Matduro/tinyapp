/* const validateUser = (userInfo, userDB) => {
  const { email, password } =
  && userDB[currentID][email]
  for (const currentID in userDB) {
    if (userDB[currentID][email] === email) {
      return { user: null, error: "email" };
    } else return { user: currentUser, error: null };
  }
}; */

const validInput = (object) => {
  const { email, password } = object;
  if (email.length === 0 || password.length === 0) {
    return false;
  } else if (email.length > 0 || password.length > 0) {
    return true;
  }
};
// userDB.filter(userObj => userObj.email === email)
const currentUser = (userEmail, userDB) => {
  
  for (const currentID in userDB) {
    if (userDB[currentID]['email'] === userEmail) {
      return true;
    }
  }
  return false;
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
  const { newEmail, password } = userInfo;
  const existingEmail = currentUser(newEmail, userDB);
  if (!existingEmail) {
    const userID = generateRandomString();
    userDB[userID] = userInfo;
    return { newEmail, userID };
  } else {
    return null;
  }
};

/* const findUser = (email, userDB) => {
  const currentUser = userDB.find(userObj => userObj.email === email);

  return currentUser;
}; */

module.exports = { createUser, generateRandomString, currentUser, validInput };