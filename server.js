const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cors = require("cors");
const mongojs = require("mongojs")
const mongoose = require("mongoose");
const fetch = require("node-fetch")
const db = require("./models/index")
//const User = require("./models/User")
const PORT = process.env.PORT || 8080;

const databaseUrl = "lifestyle";
const collections = ["user"];

const tmApikey = "dwXD5AKGG1cYnioNAAh1PSKaTZu2TIVN";
const tmSize = 100; 
const tmUrl = "https://app.ticketmaster.com/discovery/v2/events.json";
const tmCity = "seattle"; // this will be pulled from user location later. UserSchema.location
const hkApikey = "200685387-0d1f511c4df4599326d988945a93ebf8";
const hkLocation = "lat=47.6045335&lon=-122.3531904" // this will be pulled from user location later. UserSchema.location.
const hkRadius = 30;
const hkMaxResults = 5;
const hkUrl = "https://www.hikingproject.com/data";

// const db = mongojs(databaseUrl, collections);
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/lifestyle", { useNewUrlParser: true, useUnifiedTopology: true});


// console logging out "db" here and switching schemas from .models/index to DB 12:54 2.18/2020
// const db = mongojs(databaseUrl, collections);
// db.on("error", error => {
//   console.log("Database Error:", error);
// });

// this creates local database for local use. As mongoose databases are created on demand.
// let z = new db.User({ 
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

app.use(cors({
  origin: ["http://localhost:3000"], // 3000 is the front end
  credentials: true
}));


// BELOW IS AUTHENTICATION **********************
app.post("/api/auth/signup", (req, res) => {
  console.log("MADE IT INTO SIGNUP");
  console.log(req.body);
  db.User.create(req.body).then(userData => {         // this needs to switch to Mongo stuff. users is the mongo db table. 
    res.json(userData);
  })
})
app.post("/api/auth/login", (req, res) => {
  db.User.findOne({                                   // double check this with Mongo commands as well.
    where: {
      email: req.body.email                             // for our sign up should this be name or email or username?
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
// ABOVE IS AUTHENTICATION **************************



app.get('/api/events' , (req,res)=>{
  console.log("We want to know!");
  let maxDuration = 4*60;
  let date = new Date();
  let currentTime = new Date( date.getTime()-date.getTimezoneOffset()*60*1000);
  let startTime = currentTime.toISOString().split(".")[0]+"Z";
  let endTime = new Date( currentTime.getTime() + 60*60*24*1000 ).toISOString().split(".")[0]+"Z";
 

  let finalurl = `${tmUrl}?apikey=${tmApikey}&size=${tmSize}&city=${tmCity}&startDateTime=${startTime}&endDateTime=${endTime}`; 
  //console.log(finalurl);
  fetch(finalurl)
    .then(res => res.json())
    .then(data => {
      let activities = data._embedded.events.map(event => {
        return db.Activity.createFromEvent(event);
      })
      res.json(activities);  
  });
});



app.get('/api/hikes' , (req,res)=>{
  // console.log("We want to know!");
  let maxDuration = 4*60;

  let finalurl = `${hkUrl}/get-trails?key=${hkApikey}&maxDistance=${hkRadius}&maxResult=${hkMaxResults}&${hkLocation}`; 
  // console.log(finalurl);
  fetch(finalurl)
    .then(res => res.json())    
    .then(data => {
      let activities = data.trails.map(event => {
        return db.Activity.createFromHikes(event);
      })
      res.json(activities);
    });
});

app.get('/api/addevent/:id' , (req, res) => {
  console.log ("We are saving this event/hike: "+ req.params.id)
  let ids = req.params.id.split(":");
  console.log(ids);
  let id = ids[1];

  function save(activity)
  {
    // console.log("Save Now ")
    // console.log( activity)
    activity.save(err => {
      if (err){
        console.log("Save failed " + err);
      }
    })
    res.sendStatus(200); // in future change to redirect.

  }

  if (ids[0] === "hike"){
    fetch(`${hkUrl}/get-trails-by-id?key=${hkApikey}&ids=${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        save( db.Activity.createFromHikes(data.trails[0]) );
        // append to current user [completedActivities]
      })
  } else if (ids[0] === "event"){
    fetch(`${tmUrl}?apikey=${tmApikey}&id=${id}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      save( db.Activity.createFromEvent(data._embedded.events[0]) );
        // append to current user [completedActivities]. this.session.user mongoappendTo [completedActivities].
    })
  } else {
    res.sendStatus(403);
  }

})

//this returns the user and it's associated objects.
app.get('/api/user' , (req,res)=>{
  console.log("We want the user");

  db.User.findOne({
    "name":  "Jenny"
       // email: "${db.User.email}"
  }).
  then(userresponse =>{
    console.log (userresponse);
  });
});



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});