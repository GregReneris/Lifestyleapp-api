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