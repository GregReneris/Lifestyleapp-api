// add or remove activities
const hikeController = require("./hikeController")
const tm = require("./ticketMasterController")

function addEvent(req, res) {
    let [type, id] = req.params.id.split(":");

    if (type === "hike") {
        hikeController.getHikeById(id).then(hike => {
            saveActivity(hike, res)
        })
    } else if (type === "event") {
        tm.getEventById(id).then(event => {
            saveActivity(event, res)
        })
    } else {
        res.sendStatus(403);
    }
}

function saveActivity (activity, res) {
    activity.save(err => {
        if (err) {
            console.log("Save failed " + err);
        }
    users.completedActivites.save


    findOneAndUpdate(
        {"_id":req.session.user.id }, 
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
    res.sendStatus(200); // in future change to redirect.

}
// get current session user
// add activity id to completed activity array
// save user
// NEED LOGGED IN USER FOR THIS TO WORK

module.exports = {
    addEvent
}