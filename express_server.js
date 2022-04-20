const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//THERE IS NO BODY IN GET REQUEST

//BODY IS JUST FOR THE POST REQUEST.
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const generateRandomString = function () {
  const str = Math.random().toString(36).slice(7);
  return str;
};

//================GET====================///

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars); //brining the files in partials
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL],
  };
  res.render("urls_show", templateVars);
});

// body is used for post.
// get is used for the urls_show.ejs
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

//================POST====================///

//in urls_new.ejs
//actions: /urls
app.post("/urls", (req, res) => {
  const longURL = req.body.longURL; //body inside the post request, pull the 'longURL' info.
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;
  const templateVars = {
    //we need to pass it to 69.
    shortURL: shortURL,
    longURL: urlDatabase[shortURL], //saving it to the DB.
  };
  res.render("urls_show", templateVars); //after mathching keys are found in the .ejs file, then it shows the values. (Rendering)
  //rendering means getting the page displayed with the values.
  // alligator: interpretes dynamic values.
});

app.post("/urls/new", (req, res) => {
  res.render("urls_new");
});

//wildcard is :shortURL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls/");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const newURL = req.body.newURL;
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = newURL;
  res.redirect("/urls/");
});

app.post("/login", (req, res) => {
  const username = req.body.username; //got from the form
  res.cookie("cookie", username); //sets the cookie always singular .. setting only one cookie at a time.
  // console.log("getcookie", req.cookies["cookie"]);
  const templateVars = {
    nameEJS: req.cookies["cookie"], //gets all the cookies
    urls: urlDatabase,
  };
  res.render("urls_index", templateVars);
});

// app.post("/logout", (req, res) => {
//   const username = req.body.username; //got from the form
//   res.cookie("cookie", username);
//   res.redirect("/urls/");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
