const express = require("express");
const app = express();
const PORT = 8080; // default port 808
const bodyParser = require("body-parser"); // The body-parser library will convert the request body from a Buffer into string that we can read.
app.use(bodyParser.urlencoded({extended: true}));
const { createUser, currentUser, generateRandomString, validInput, validPassword, urlsForUser } = require('./helpers/userFunctions');
const bcrypt = require('bcrypt');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const saltRounds = 10;

// morgan middleware allows to log the request in the terminal
app.use(morgan('short'));

app.set("view engine", "ejs");

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", saltRounds),
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", saltRounds),
  }
};

app.use(cookieSession({
  name: 'session',
  keys: ['7f69fa85-caec-4d9c-acd7-eebdccb368d5', 'f13b4d38-41c4-46d3-9ef6-8836d03cd8eb']
}));

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "user2RandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }
};


app.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.session['user_id']};
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  if (!req.session['user_id']) {
    res.redirect('/login');
    return;
  }
  const myURLs = urlsForUser(req.session['user_id'], urlDatabase);
  const templateVars = { urls: myURLs, username: req.session['user_id']};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session['user_id']) {
    res.redirect('/login');
    return;
  }
  const templateVars = { username: req.session['user_id'] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL,  username: req.session['user_id'] };
  res.render("urls_show", templateVars);
});

// click on the shortURL link to redirect you to the URL website (ie Amazon)
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send("404 page not found!");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// Registration page
app.get('/register', (req, res) => {
  const templateVars = {
    username: req.session['user_id']
  };
  res.render('register', templateVars);
});

// Login page
app.get('/login', (req, res) => {
  const templateVars = {
    username: req.session['user_id']
  };
  res.render('login', templateVars);
});


// remove a URL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!req.session['user_id']) {

    res.redirect('/login');
    return;
  }
  if (urlDatabase[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  }
});

// modify a longURL
app.post("/urls/:shortURL/edit", (req, res) => {
  const userID = req.session['user_id'];
  const longURL = req.body;
  if (!userID) {
    res.redirect('/login');
    return;
  }
  if (urlDatabase[req.params.shortURL]) {

    urlDatabase[req.params.shortURL] = { longURL, userID };
    res.redirect('/urls');
  }
});

// Add a new URL
app.post("/urls", (req, res) => {
  if (!req.session['user_id']) {
    res.redirect('/login');
    return;
  }
  // console.log(req.body);  // Log the POST request body to the console, get an object of { longURL: url }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session['user_id'] };
  res.redirect(`/urls/${shortURL}`);
});

// Login with cookies
app.post("/login", (req, res) => {
  const { email, password }  = req.body;
  const current = currentUser(email, users);
  if (current) {
    const userID = validPassword(email, password, users);
  
    if (userID) {
      req.session['user_id'] =  userID;
      res.redirect('/urls');
    } else {
      return res.status(403).send("403 invalid password!");
    }
  } else {
    return res.status(403).send("403 e-mail address not found!");
  }
});

// logout, and remove cookies
app.post("/logout", (req, res) => {
  // ('Signed Cookies: ', req.signedCookies)
  req.session['user_id'] = null;
  res.redirect('/urls');
});

// register new user
app.post('/register', (req, res) => {

  if (!validInput(req.body)) {
    res.send('error 400, email and/or password error');
  }
  // const currentUser = validateUser(req.body, users);
  
  const { email, userID } = createUser(req.body, users);
  if (email) {
    req.session['user_id'] =  userID;
    res.redirect('/urls');
  } else {
    res.send('error 400, user exists');
  }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});