/* const validateUser = (email, password, userDB) => {
  for (const userObj in userDB) {
    if (userObj.email === email) {
      return { user: null, error: "email" };
    }
    else return { user: currentUser, error: null };
  }
} */
// userDB.filter(userObj => userObj.email === email)
const currentUser = (userEmail, userDB) => {
  for (const currentID in userDB) {
    console.log(`the userEmail: ${userEmail}`);
    console.log(`the currentID: ${currentID}`);
    console.log(`the currentIDemail: ${currentID['email']}`);
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
  const { email, password } = userInfo;
  const existingEmail = currentUser(email, userDB);
  if (!existingEmail) {
    const userID = generateRandomString();
    userDB[userID] = userInfo;
    return { email, userID };
  } else {
    return null;
  }
};

/* const findUser = (email, userDB) => {
  const currentUser = userDB.find(userObj => userObj.email === email);

  return currentUser;
}; */

module.exports = { createUser, generateRandomString, currentUser };