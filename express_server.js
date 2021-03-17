const express = require("express");
const app = express();
const PORT = 8080; // default port 808
const bodyParser = require("body-parser"); // The body-parser library will convert the request body from a Buffer into string that we can read.
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser'); // Parse Cookie header and populate req.cookies with an object keyed by the cookie names.
app.use(cookieParser());
app.set("view engine", "ejs");

const generateRandomString = () => {
  return Math.random().toString(36).substring(6);
};


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
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
  let username = req.body.username;
  res.cookie('username', username);
  // let password = req.body.password;
  res.redirect('/urls');
});

// logout, and remove cookies
app.post("/logout", (req, res) => {
  // ('Signed Cookies: ', req.signedCookies)
  res.clearCookie('username');
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});