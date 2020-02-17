const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const mongojs = require("mongojs")
const mongoose = require("mongoose");
const fetch = require("node-fetch")
const schemas = require("./models/index")
//const User = require("./models/User")
const PORT = process.env.PORT || 3000;

const databaseUrl = "lifestyle";
const collections = ["user"];

// const db = mongojs(databaseUrl, collections);
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/lifestyle", { useNewUrlParser: true, useUnifiedTopology: true});

// the below is probably wrong.
const db = mongojs(databaseUrl, collections);
db.on("error", error => {
  console.log("Database Error:", error);
});

// this creates local database for local use. As it's created on demand.
// let z = new schemas.User({ 
//   firstname: "myFirstName",
//   lastname: "myLastName"
// })
// z.save( err=> { console.log("ERROR " + err ) });


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


//this is where we start using authentication. 
app.use(session({ secret: "something secret here", resave: true, saveUninitialized: true,cookie:{maxAge: 7200000} }));
// app.use(cors({
//     origin:["https://joesreactzoo.herokuapp.com"]
// }));



app.post("/api/auth/signup", (req, res) => {
  db.User.create(req.body).then(userData => {
    res.json(userData);
  })
})
app.post("/api/auth/login", (req, res) => {
  db.User.findOne({
    where: {
      name: req.body.name
    }
  }).then(dbUser=>{
    if(bcrypt.compareSync(req.body.password,dbUser.password)){
      req.session.user={
        id:dbUser.id,
        name:dbUser.name
      }
      res.json(req.session.user)
    }
    else{
      res.status(401).json("not logged in")
    }
  })
})

app.get('/api/auth/loggedinuser',(req,res)=>{
  if(req.session.user){
    res.json(req.session.user)
  } else {
    res.status(401).json("not logged in")
  }
});


app.get('/api/activities' , (req,res)=>{
  console.log("We want to know!");
  let maxDuration = 4*60;
  let apikey = "dwXD5AKGG1cYnioNAAh1PSKaTZu2TIVN";

  let date = new Date();
  let currentTime = new Date( date.getTime()-date.getTimezoneOffset()*60*1000);
  let startTime = currentTime.toISOString().split(".")[0]+"Z";
  let endTime = new Date( currentTime.getTime() + 60*60*24*1000 ).toISOString().split(".")[0]+"Z";
  let size = 1; 
  let url = "https://app.ticketmaster.com/discovery/v2/events.json";
  let city = "seattle";

  //"https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=dwXD5AKGG1cYnioNAAh1PSKaTZu2TIVN&city=seattle&startDateTime=2020-02-14T14:00:00Z"
  
  let finalurl = `${url}?apikey=${apikey}&size=${size}&city=${city}&startDateTime=${startTime}&endDateTime=${endTime}`; 
  console.log(finalurl);
  fetch(finalurl).then(response => {
    // console.log(response);

    return response.json()

    
}).then(data => {
    new db
    let activities = data._embedded.events.map(event => {
        return {
            name: event.name,
            img: event.images[0].url,
            date: event.dates.start.localDate,
            url: event.url
        }
    })
  });
});








app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});