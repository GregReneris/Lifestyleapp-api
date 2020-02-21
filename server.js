const express = require("express");
const session = require("express-session");
const cors = require("cors");
const fetch = require("node-fetch")
const CONSTANTS = require("./const")
const authController = require("./controllers/authController")
const tm = require("./controllers/ticketMasterController")
const hikeController = require("./controllers/hikeController")
const activityController = require("./controllers/activityController")
const getWeather = require("./controllers/weatherController")
const cityAutoComplete = require("./controllers/cityAutoCompleteController")
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//this is where we start using authentication. 
app.use(session({ secret: "something secret here", resave: true, saveUninitialized: true, cookie: { maxAge: 7200000 } }));
// app.use(cors({
//     origin:["https://ourherku.herokuapp.com"]
// }));
app.use(cors({
  origin: ["http://localhost:3000"], // 3000 is the front end
  credentials: true
}));
// BELOW IS AUTHENTICATION **********************
app.post("/api/auth/signup", (req, res) => {
  authController.signUp(req, res)
})
app.post("/api/auth/login", (req, res) => {
  authController.login(req, res)
})
app.get("/api/auth/logout", (req, res) => {
  authController.logout (req, res)
})
app.get('/api/auth/loggedinuser', (req, res) => {
  authController.getSessionUser(req, res)
});
// ABOVE IS AUTHENTICATION **************************
app.get('/api/user', (req, res) => {
  authController.getUser(req, res)
});

app.get('/api/events', (req, res) => {
  tm.getEvents(req, res)
});

app.get('/api/hikes', (req, res) => {
  hikeController.getHikes(req, res)
});

app.get('/api/addactivity/:id', (req, res) => {     // not sure if it needs to be post here and from front end.
  activityController.addEvent(req, res)
})

app.get('/api/saveEventToUser', (req, res) => {     // not sure if it needs to be post here and from front end.
  console.log(req.params);
  authController.saveActivity(req, res);
})

app.get('/api/weather/:city', (req, res) => {
  console.log(req.params.city);
  getWeather(req, res, req.params.city )
})

app.get('/api/places/:search', (req, res) => {
  cityAutoComplete.userCity(req, res)
})



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});