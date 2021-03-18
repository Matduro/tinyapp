const express = require("express");
const app = express();
const PORT = 8080; // default port 808
const bodyParser = require("body-parser"); // The body-parser library will convert the request body from a Buffer into string that we can read.
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser'); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());
const { createUser, currentUser, generateRandomString, validInput} = require('./helpers/userFunctions');
app.set("view engine", "ejs");

const users = {
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

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["email"]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.cookies['username']) {
    res.redirect('/login');
    return;
  }
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

// click on the shortURL link to redirect you to the URL website (ie Amazon)
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send("404 page not found!");
  }
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// Registration page
app.get('/register', (req, res) => {
  // const user = findUser(req.cookies.email, userArrayOfDestiny);
  const templateVars = {
    username: req.body.username
  };
  res.cookie('username', templateVars.username);
  res.render('register', templateVars);
});


// remove a URL
app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect('/urls');
  }
});

// modify a longURL
app.post("/urls/:shortURL/edit", (req, res) => {
  if (urlDatabase[req.params.shortURL]) {
    urlDatabase[req.params.shortURL] = req.body.longURL;
    res.redirect('/urls');
  }
});

// Add a new URL
app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console, get an object of { longURL: url }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
});

// Login with cookies
app.post("/login", (req, res) => {
  const { email, password }  = req.body;
  const current = currentUser(email, users);
  if (current) {
    console.log(req.body);
    res.cookie('email', email);
    // let password = req.body.password;
    res.redirect('/urls');
  } else {
    return res.status(404).send("404 page not found!");
  }
});

// logout, and remove cookies
app.post("/logout", (req, res) => {
  // ('Signed Cookies: ', req.signedCookies)
  res.clearCookie('email');
  res.redirect('/urls');
});

// register new user
app.post('/register', (req, res) => {

  if (!validInput(req.body)) {
    res.send('error 400, email and/or password error');
  }
  // const currentUser = validateUser(req.body, users);
  
  const { newEmail, userID } = createUser(req.body, users);
  if (newEmail) {
    res.cookie('email', newEmail);
    res.redirect('/urls');
  } else {
    res.send('error 400, user exists');
  }

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});