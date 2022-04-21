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
//global users object
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

//=============HELPER FUNCTIONS================//
const generateRandomString = function () {
  const str = Math.random().toString(36).slice(7);
  return str;
};

const emailAlreadyExists = function (email) {
  for (const userId in users) {
    const user = users[userId];
    // const email = users[userId][email];
    return user.email === email; //this will return true or false.
  }
};
//================GET====================///

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const userID = req.cookies["user_id"];
  const loggedUser = users[userID];
  // console.log("loggedUser", loggedUser);
  // console.log("userID", userID);
  const templateVars = {
    urls: urlDatabase,
    // name: req.cookies["user_name"],
    user: loggedUser,
  };
  res.render("urls_index", templateVars); //brining the files in partials
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    name: req.cookies["user_name"],
    user: users.id,
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL],
    name: req.cookies["user_name"],
    user: users.id,
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

//do i need this?
// app.get("/login", (req, res) => {
//   const templateVars = {
//     name: req.cookies["user_name"],
//   };
//   res.render("urls_index", templateVars);
// });

app.get("/register", (req, res) => {
  // const res.cookie["user_id"]
  const templateVars = {
    name: req.cookies["user_name"],
    user: users.id,
  };
  res.render("urls_register", templateVars);
});

//================POST====================///

app.post("/register", (req, res) => {
  // res.status(404).send(); //temporary error page  before building
  const email = req.body.email;
  const password = req.body.password;
  // check if email or password are falsey
  if (!email || !password) {
    return res.status(400).send("please enter an email address and a password");
  }

  if (emailAlreadyExists(email)) {
    // return res.sendStatus(400, "email already exists");
    return res.status(400).send("jordan");
  }

  const id = generateRandomString();
  const user = {
    id: id,
    email: email,
    password: password,
  };

  users[id] = user; //should add a user to the global users object.
  res.cookie("user_id", id); //set cookie with the id.
  res.redirect("/urls");

  console.log(users);
});

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
    name: req.cookies["user_name"],
    user: users.id,
  };
  //JC did redirect.
  res.render("urls_show", templateVars); //after mathching keys are found in the .ejs file, then it shows the values. (Rendering)
  //rendering means getting the page displayed with the values.
  // alligator: interpretes dynamic values.
});

app.post("/urls/new", (req, res) => {
  const templateVars = {
    name: req.cookies["user_name"],
    user: users.id,
  };
  res.render("urls_new", templateVars);
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
  const username = req.body.nameEJS; //got from the form
  res.cookie("user_name", username); //sets the cookie always singular .. setting only one cookie at a time.`
  // console.log("getcookie", req.cookies["user_name"]);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_name");
  res.redirect("/urls/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
