// add or remove activities
const hikeController = require("./hikeController")
const tm = require("./ticketMasterController")
const db = require("../models")

let users = ""

function addEvent(req, res) {
    let [type, id] = req.params.id.split(":");

    if (type === "hike") {
        hikeController.getHikeById(id).then(    hike => {
            saveActivity(hike, res,req) // joe aded (req) to this because we weren't passing the object all the way through and thus weren't getting the user.session either.
        })
    } else if (type === "event") {
        tm.getEventById(id).then(event => {
            saveActivity(event, res,req)
        })
    } else {
        res.sendStatus(403);
    }
}

function saveActivity (activity, res,req) {
    activity.save(err => {
        if (err) {
            console.log("Save failed " + err);
        }
        console.log(activity)
    // users.completedActivites.save
            // we need to get users defined by the get call so the server knows which user to attach the activity to. It is crashing because of this.
    db.User.findOneAndUpdate( // needed to call db.User instead of this.findOneAndUpdate. Joe also was like this design is crazy!
    // this.findOneAndUpdate(
        // console.log("Got here to findoneandupdate ******************************************************"),
        // console.log(req.session.user.id),
        {"_id": req.session.user.id }, 
    
        {$push: {"completedActivites": {_id: activity._id, id: activity.id, activityName: activity.activityName, description : activity.description, url : activity.url, imgurl :activity.imgurl, type : activity.type, latitude : activity.latitude, longitude : activity.longitude, travelTime : activity.travelTime, date : activity.date, _v: activity._v}}},
        {new: true},
        function(err, model){
           if (err){
             console.log("ERROR: ", err);
             res.send(500, err);
           }else{
             res.status(200).send(model);
           }
          }
        );

    // (err => {7
    //     if (err) {
    //         console.log ("Save failed" + err); 
    //     }
    // }) 
    })
    // res.sendStatus(200); // in future change to redirect.

}
// get current session user
// add activity id to completed activity array
// save user
// NEED LOGGED IN USER FOR THIS TO WORK

module.exports = {
    addEvent
}