const db = require("../models/index");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/lifestyle", { useNewUrlParser: true, useUnifiedTopology: true });

function signUp(req, res) {
  db.User.create(req.body).then(userData => {
    res.json(userData);
  })
}

function login(req, res) {
  db.User.findOne({
    email: req.body.email
  }).then(dbUser => {
    if (bcrypt.compareSync(req.body.password, dbUser.password)) {
      req.session.user = {
        id: dbUser._id,
        name: dbUser.name
      }
      res.json(req.session.user)
    }
    else {
      res.status(401).json("not logged in")
    }
  })
}

function getSessionUser(req, res) {
  if (req.session.user) {
    res.json(req.session.user)
  } else {
    res.status(401).json("not logged in")
  }
}

function getUser(req, res) {
  console.log("We want the user");

  db.User.findOne({
    _id: req.session.user.id
  }).
    then(userresponse => {
      res.json(userresponse)
    });
}

// module.exports as an object, easier to pull / use specific functions
module.exports = {
  signUp,
  login,
  getSessionUser,
  getUser
}