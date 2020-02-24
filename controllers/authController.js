const axios = require("axios");
const db = require("../models/index");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt')


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/lifestyle", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false  });

function signUp(req, res) {
  const newUser = {
    ...req.body
  }
  let googleAPI = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.city}&key=AIzaSyDZCcU8rBUnb8cXg8AoHZHr0Vymd7YT59A`
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
  // the user is not available in this object
  console.log(req.session);
  db.User.findOne({
    _id: req.session.user.id
  }).
    then(userresponse => {
      res.json(userresponse)
    });
}

function logout(req, res) {
  // console.log("Hitting Logout")
  //delete session user, logging you out
  req.session.destroy(function () {
    res.send('successfully logged out')
})
}


function updateUser(req, res) {
  console.log(req.session)
  req.session.user.name = req.body.name;
  req.session.user.city = req.body.city;  

  
  let googleAPI = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.body.city}&key=AIzaSyDZCcU8rBUnb8cXg8AoHZHr0Vymd7YT59A`
  axios.get(googleAPI)
    .then(({ data }) => {
      data.lat = JSON.stringify(data.results[0].geometry.location.lat),
      data.lon = JSON.stringify(data.results[0].geometry.location.lng),
      req.session.user.lat = data.lat
      req.session.user.lon = data.lon
    // .then(  
  db.User.findOneAndUpdate(
  { _id: req.body.id }, 
  { $set: { 
    name: req.body.name,
    city: req.body.city,
    lat: data.lat,
    lon: data.lon
    } }
  ).then((dbUser) => {
    // console.log("dbUser", dbUser);
    res.json(dbUser)
  })
  //)
  }
    )};


module.exports = {
  signUp,
  login,
  getSessionUser,
  logout,
  getUser,
  updateUser
}