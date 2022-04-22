const express = require("express");
// const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const { getUserByEmail } = require("./helpers.js");
app.use(
  cookieSession({
    name: "session",
    keys: ["mykey1", "mykey2", "mykey3"],
  })
);
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//THERE IS NO BODY IN GET REQUEST. //BODY IS JUST FOR THE POST REQUEST.

//=============GLOBAL OBJECTS================//
const urlDB = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "a",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "a",
  },
  userArandomID: {
    id: "userArandomID",
    email: "a@a.co",
    password: bcrypt.hashSync("a", 10),
  },
  userBrandomID: {
    id: "userBrandomID",
    email: "b@b.co",
    password: bcrypt.hashSync("b", 10),
  },
};

//=============HELPER FUNCTIONS================//
const generateRandomString = function () {
  const str = Math.random().toString(36).slice(7);
  return str;
};

const userExistsByID = function (id) {
  for (const userId in users) {
    if (userId === id) {
      return true;
    }
  }
  return false;
};

const passwordMatches = function (password) {
  for (const userId in users) {
    const user = users[userId];
    if (user.password === password) {
      return true;
    }
  }
  return false;
};

const urlsForUser = function (id) {
  let userURLs = {}; //shortURL, longURL, userID
  for (const url in urlDB) {
    if (urlDB[url]["userID"] === id) {
      userURLs[url] = urlDB[url]; //we need key-value pair.
      //key: url   //value: urlDB[url]
    }
  }
  // console.log("OBJECT", userURLs);
  return userURLs;
};

//================GET====================///

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/login", (req, res) => {
  const userID = req.session.user_id;
  const currentUser = users[userID];
  const templateVars = {
    urls: urlDB, //this is used in urls_index.ejs
    user: currentUser,
  };
  if (userExistsByID(userID)) {
    res.redirect("/urls");
  }
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  const userID = req.session.user_id;
  const currentUser = users[userID];
  const templateVars = {
    user: currentUser,
  };
  res.render("urls_register", templateVars);
});

////MENTOR HELP: Andrea Mastrantoni
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const currentUser = users[userID];
  if (!userExistsByID(userID)) {
    //if user is not logged in they can't access urls.
    return res.status(401).send("Please login first."); //header has already been sent so i can't call res.redirect again.
  }
  const currentUserID = currentUser["id"];
  const userURLs = urlsForUser(currentUserID);
  const templateVars = {
    urls: userURLs,
    user: currentUser,
  };

  res.render("urls_index", templateVars); //brining the files in partials
});

app.get("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const currentUser = users[userID];
  const templateVars = {
    user: currentUser,
  };
  if (!userExistsByID(userID)) {
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars); ///store the newly creted url in the url database.
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.user_id;

  if (!userID) {
    return res.status(401).send("Please login first.");
  }
  const currentUser = users[userID];
  const currentUserID = currentUser["id"];
  const userURLs = urlsForUser(currentUserID);

  const templateVars = {
    //need to be below if statement.
    shortURL: shortURL,
    longURL: urlDB[shortURL].longURL,
    user: currentUser,
    urls: userURLs,
  };

  if (userID !== urlDB[shortURL]["userID"]) {
    res.status(401).send("This page does not belong to you.");
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDB[shortURL].longURL;
  res.redirect(longURL);
});

//================POST====================///

app.post("/register", (req, res) => {
  // const password = "purple-monkey-dinosaur"; // found in the req.params object
  // const hashedPassword = bcrypt.hashSync(password, 10);
  // bcrypt.compareSync("purple-monkey-dinosaur", hashedPassword); // returns true

  // res.status(404).send(); //temporary error page  before building
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  // check if email or password are falsey
  if (!email || !password) {
    return res.status(400).send("Please enter an email address and a password");
  }

  if (getUserByEmail(email, users)) {
    return res.status(400).send("This email already exists!");
  }

  const id = generateRandomString();
  const user = {
    id: id,
    email: email,
    password: hashedPassword,
  };

  users[id] = user; //should add a user to the global users object.
  // res.cookie("user_id", id); //set cookie with the id.
  req.session["user_id"] = id;

  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL; //body inside the post request, pull the 'longURL' info.
  const shortURL = generateRandomString(); //abcde.
  const userID = req.session.user_id;
  const currentUser = users[userID];
  urlDB[shortURL] = { longURL: longURL, userID: userID };

  const templateVars = {
    //we need to pass it to 69.
    shortURL: shortURL,
    longURL: urlDB[shortURL].longURL, //saving it to the DB.
    user: currentUser,
  };
  //JC did redirect.
  res.render("urls_show", templateVars); //after mathching keys are found in the .ejs file, then it shows the values. (Rendering)
  //rendering means getting the page displayed with the values.
  // alligator: interpretes dynamic values.
});

app.post("/urls/new", (req, res) => {
  const userID = req.session.user_id;
  const longURL = req.body.longURL; //body inside the post request, pull the 'longURL' info.
  const shortURL = generateRandomString(); //abcde.
  if (!userExistsByID(userID)) {
    res.send("You have to login first to shorten URLS.");
    res.redirect("/login");
  }
  urlDB[shortURL] = { longURL: longURL, userID: userID };
  //****** adding the short url, long url, and user id to the data base
  console.log(urlDB);
  res.redirect("/urls");
});

//wildcard is :shortURL
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session.user_id;
  if (!userID) {
    //checking if userID exists.
    res.redirect("/urls");
    return; //END
  }
  if (userID !== urlDB[shortURL]["userID"]) {
    return res.status(401).send("You don't have permission to delete.");
  }
  delete urlDB[shortURL]; //after delete, it will continue waiting after it's done.
  res.redirect("/urls"); //so we need to redirect.
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const newURL = req.body.newURL;
  const shortURL = req.params.shortURL;
  const userID = req.session.user_id;
  if (!userID) {
    res.redirect("/urls");
    return; //END
  }
  if (userID !== urlDB[shortURL]["userID"]) {
    return res.status(401).send("You don't have permission to edit.");
  }
  urlDB[shortURL]["longURL"] = newURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const inputEmail = req.body.email;
  const inputPW = req.body.password;
  const user = getUserByEmail(inputEmail, users);
  console.log(inputEmail, inputPW, user);
  if (!user) {
    return res.status(403).send("Email is not found.");
  } else if (user && !bcrypt.compareSync(inputPW, user.password)) {
    return res.status(403).send("Email is found but password is incorrect.");
  } else {
    // res.cookie("user_id", user.id); //name , value
    req.session["user_id"] = user.id;
  }
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  // res.clearCookie("user_id");
  req.session = null;
  res.redirect("/login"); // just redirecting WITHOUT data
});

//=============LISTEN================//
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
