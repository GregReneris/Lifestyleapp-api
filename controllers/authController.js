const axios = require("axios");
const db = require("../models/index");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/lifestyle", { useNewUrlParser: true, useUnifiedTopology: true });

function signUp(req, res) {
  const newUser = {
    ...req.body
  }
  let googleAPI = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+ ${req.body.city} +&key=AIzaSyDZCcU8rBUnb8cXg8AoHZHr0Vymd7YT59A`
  axios.get(googleAPI)
    .then(({ data }) => {
      newUser.lat = data.results[0].geometry.location.lat
      newUser.lon = data.results[0].geometry.location.lng
      console.log("THIS IS NEW USER - ", newUser);
      // console.log({cityLat, cityLon})
      db.User.create(newUser).then(userData => {
        res.json(userData);


      }).catch(err => console.log("THIS IS DB ERROR", err))
    }).catch(err => console.log("THIS US ERROR", err))
}

function login(req, res) {
  db.User.findOne({
    email: req.body.email
  }).then(dbUser => {
    if (bcrypt.compareSync(req.body.password, dbUser.password)) {
      req.session.user = {
        id: dbUser._id,
        name: dbUser.name,
        city: dbUser.city,
        lat: dbUser.lat,
        lon: dbUser.lon
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

function logout(req, res) {
  console.log("Hitting Logout")
  req.session.destroy(function () {
    console.log("Destroyed session")
    res.render("login")
  })
}

function updateUser(req, res) {
  console.log(req.body)
   
db.User.findOneAndUpdate(
  { _id: req.body.id }, 
  { $set: { 
    name: req.body.name,
    city: req.body.city
    } }
).then((dbUser) => {
  console.log("dbUser", dbUser);
  res.json(dbUser)
})
}

module.exports = {
  signUp,
  login,
  getSessionUser,
  logout,
  getUser,
  updateUser
}