const express = require("express");
const session = require("express-session");
const cors = require("cors");
const authController = require("./controllers/authController")
const tm = require("./controllers/ticketMasterController")
const hikeController = require("./controllers/hikeController")
const activityController = require("./controllers/activityController")
const getWeather = require("./controllers/weatherController")
const cityAutoComplete = require("./controllers/cityAutoCompleteController")

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
app.put('/api/user', (req, res) =>{
   authController.updateUser(req,res)
})
// CREATE ACCOUNT
app.post("/api/auth/signup", (req, res) => {
  authController.signUp(req, res)
});
// LOGIN
app.post("/api/auth/login", (req, res) => {
  authController.login(req, res)
});
// LOGOUT
app.get("/api/auth/logout", (req, res) => {
  authController.logout (req, res)
});
// CHECKING USER IS LOGGED IN
app.get('/api/auth/loggedinuser', (req, res) => {
  authController.getSessionUser(req, res)
});
// GETTING USER INFO
app.get('/api/user', (req, res) => {
  authController.getUser(req, res)
});
// GET EVENTS FROM TM API
app.get('/api/events', (req, res) => {
  tm.getEvents(req, res)
});
// GET HIKES FROM HIKE API
app.get('/api/hikes', (req, res) => {
  hikeController.getHikes(req, res)
});
// SAVE EVENT / HIKE TO ACTIVITY COLLECTION
app.get('/api/addactivity/:id', (req, res) => { 
  activityController.addEvent(req, res)
});
// SAVE EVENT / HIKE TO USER
app.get('/api/saveEventToUser', (req, res) => {    
  console.log(req.params);
  authController.saveActivity(req, res);
});
// WEATHER
app.get('/api/weather/:city', (req, res) => {
  console.log(req.params.city);
  getWeather(req, res, req.params.city )
});
// AUTO COMPLETE FOR CITY
app.get('/api/places/:search', (req, res) => {
  cityAutoComplete.userCity(req, res)
});
// PORT
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});