const express = require("express");
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
//EJS automatically knows to look inside the views directory for any template files that have the extension .ejs. This means we don't need to tell it where to find them. It also means that we do not need to include the extension of the filename when referencing it.

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca", //short(key): long(value)
  "9sm5xK": "http://www.google.com", //i want to get the value
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//colon :shortURL == creates key-value pair.
//:shortURL == '9sm5xK'
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL; //way for us to gather input from users' request
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

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
