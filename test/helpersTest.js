const { assert } = require('chai');

const { createUser, getUserByEmail, validInput, validPassword, urlsForUser } = require('../helpers/helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const newUser = { 'email': 'ragnar@vikings.com', 'password': 'Athelstan' };
const newUser2 = { 'email': 'napoleon@bonaparte.com', 'password': 'France' };
const newUser3 = { 'email': "", 'password': "theEther" };
const newUser4 = { 'email': "forgot@password.com", 'password': "" };


describe('getUserByEmail', function() {
  it('should return true if the user email and ID are currently in the database', function() {
    const { userEmail, currentID } = getUserByEmail('user2@example.com', testUsers);
    const expectedEmail = 'user2@example.com';
    const expectedId = "user2RandomID";
    assert.equal(expectedId, currentID);
    assert.equal(expectedEmail, userEmail);
  });
  it('should return true if the user email and ID NOT in the database', function() {
    const { userEmail, currentID } = getUserByEmail(newUser2['email'], testUsers);
    const expectedEmail = null;
    const expectedId = null;
    assert.equal(expectedId, currentID);
    assert.equal(expectedEmail, userEmail);
  });
});

describe('createUser', function() {
  it('if it\'s a new user, it should return a user object with their email and new id', function() {
    const { email, userID } = createUser(newUser, testUsers);
    const expectedEmail = newUser['email'];
    assert.exists(userID);
    assert.equal(expectedEmail, email);
  });
  it('if it\'s not a new user, it should return null for both email and ID', function() {
    const { email, userID } = createUser(newUser, testUsers);
    const expectedNull = null;
    assert.equal(expectedNull, userID);
    assert.equal(expectedNull, email);
  });
});

describe('validInput', function() {
  it('should return true if object of email and password have lengths greater than zero', function() {
    const isValid = validInput(newUser);
    const expectedValue = true;
    assert.equal(expectedValue, isValid);
  });
  it('should return true if email length is equal to zero', function() {
    const isValid = validInput(newUser3);
    const expectedValue = false;
    assert.equal(expectedValue, isValid);
  });
  it('should return true if password length is equal to zero', function() {
    const isValid = validInput(newUser4);
    const expectedValue = false;
    assert.equal(expectedValue, isValid);
  });
});