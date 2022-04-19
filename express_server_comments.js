const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
//EJS automatically knows to look inside the views directory for any template files that have the extension .ejs. This means we don't need to tell it where to find them. It also means that we do not need to include the extension of the filename when referencing it.

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca", //short(key): long(value)
  "9sm5xK": "http://www.google.com", //i want to get the value (longURL)
};

const generateRandomString = function () {
  //generating shortURL
  const str = Math.random().toString(36).slice(7);
  return str;
};

app.get("/", (req, res) => {
  //homepage

  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  //.json is just a hint that data is json type.
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// when i click submit.
// when i click on create new url, and add a new url, we are running .post.
app.post("/urls", (req, res) => {
  // console.log(req.body.longURL); // Log the POST request body to the console
  const longURL = req.body.longURL; //from bodyparser looking for something input tag. from ejs file.
  //req.body only works then there is post request.
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL; // give a new key-value pair to the urlDatabase object.
  res.redirect("/urls"); // Respond with 'Ok' (we will replace this)
});
//params, body: variable.

//colon :shortURL == creates key-value pair.
//:shortURL == '9sm5xK'
app.get("/urls/:id", (req, res) => {
  // colon means making a variable.
  const shortURL = req.params.id; //req.params only works when there is colon.
  // req.params: is a way for us to gather input from user's request
  // object containing the parameter value
  // parse from the url path. search bar. takes the url path data and parse it into info we can use.
  // console.log(shortURL, "shortURL");
  // console.log(req.params, "req.params"); //it's an object.

  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL],
  };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
