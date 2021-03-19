const express = require("express");
const app = express();
const PORT = 8080; // default port 808
const bodyParser = require("body-parser"); // The body-parser library will convert the request body from a Buffer into string that we can read.
app.use(bodyParser.urlencoded({extended: true}));
const { validSession, createUser, getUserByEmail, generateRandomString, validInput, validPassword, urlsForUser } = require('./helpers/helpers.js');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
// default recommended salt rounds for hashing passwords
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

// cookie session with 2 alternating keys
app.use(cookieSession({
  name: 'session',
  keys: ['7f69fa85-caec-4d9c-acd7-eebdccb368d5', 'f13b4d38-41c4-46d3-9ef6-8836d03cd8eb']
}));


const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "user2RandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }
};


app.get("/", (req, res) => {
  res.redirect('/urls');
});

// get to urls_index page
app.get("/urls", validSession, (req, res) => {
  const user = users[req.session['user_id']];
  const myURLs = urlsForUser(req.session['user_id'], urlDatabase);
  const templateVars = { 'urls': myURLs, 'user': user};
  res.render("urls_index", templateVars);
});

// get to new longURL input
app.get("/urls/new", validSession, (req, res) => {
  const user = users[req.session['user_id']];
  const templateVars = { user: user };
  res.render("urls_new", templateVars);
});

// to to specific edit page of a short URL
app.get("/urls/:shortURL", validSession, (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL,  user: users[req.session['user_id']] };
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
    user: users[req.session['user_id']]
  };
  res.render('register', templateVars);
});

// Login page
app.get('/login', (req, res) => {
  const templateVars = {
    user: users[req.session['user_id']]
  };
  res.render('login', templateVars);
});

// catch all and to redirect to urls page
app.get("*", (req, res) => {
  res.redirect('/urls');
});


// remove a URL
app.post("/urls/:shortURL/delete", validSession, (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  }
});

// modify a longURL
app.post("/urls/:shortURL/edit", validSession, (req, res) => {
  const userID = req.session['user_id'];
  const longURL = req.body.longURL;
  if (urlDatabase[req.params.shortURL]) {
    urlDatabase[req.params.shortURL] = { longURL, userID };
    res.redirect('/urls');
  }
});

// Add a new URL
app.post("/urls", validSession, (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session['user_id'] };
  res.redirect(`/urls/${shortURL}`);
});

// Login with cookies
app.post("/login", (req, res) => {
  const { email, password }  = req.body;
  const { userEmail, currentID } = getUserByEmail(email, users);
  if (userEmail && currentID) {
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