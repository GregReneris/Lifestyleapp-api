// add or remove activities
const hikeController = require("./hikeController")
const tm = require("./ticketMasterController")
const db = require("../models")

function addEvent(req, res) {
    let [type, id] = req.params.id.split(":");

    if (type === "hike") {
        hikeController.getHikeById(id).then(hike => {
            saveActivity(hike, res, req) // joe added (req) to this because we weren't passing the object all the way through and thus weren't getting the user.session either.
        })
    } else if (type === "event") {
        tm.getEventById(id).then(event => {
            saveActivity(event, res, req)
        })
    } else {
        res.sendStatus(403);
    }
}

function saveActivity(activity, res, req) {
    activity.save(err => {
        if (err) {
            console.log("Save failed " + err);
        }
        console.log(activity)
        // users.completedActivites.save
        // we need to get users defined by the get call so the server knows which user to attach the activity to. It is crashing because of this.
        db.User.findOneAndUpdate( // needed to call db.User instead of this.findOneAndUpdate. Joe also was like this design is crazy!
            // this.findOneAndUpdate(
            // console.log(req.session.user.id),
            { "_id": req.session.user.id },

            { $push: { "completedActivites": { _id: activity._id, id: activity.id, activityName: activity.activityName, description: activity.description, url: activity.url, imgurl: activity.imgurl, type: activity.type, latitude: activity.latitude, longitude: activity.longitude, travelTime: activity.travelTime, date: activity.date, _v: activity._v, rating: activity.rating } } },
            { new: true },
            function (err, model) {
                console.log("Got here to findoneandupdate ******************************************************")

                if (err) {
                    console.log("ERROR: ", err);
                    res.send(500, err);
                } else {
                    res.status(200).send(model);
                }
            }
        );
    })
    // res.sendStatus(200); // in future change to redirect.
}


function deleteActivity(req, res, activity) {
    console.log("IN DELETE ACTIVITY")
    console.log(activity)
    console.log("BELOW IS REQ")
    // console.log (req)
    db.User.findOneAndUpdate(
        { "_id": req.session.user.id },

        { $pull: { "completedActivites": { id: activity } } },
        function (err, model) {
            console.log("Got here to findoneandpull ******************************************************")
            console.log(model);

            if (err) {
                console.log("ERROR: ", err);
                res.send(500, err);
            } else {
                res.status(200).send(model);
            }
        }
    );
}
// res.sendStatus(200); // in future change to redirect.


function setStars(req, res) {
    // console.log(id, value);
    console.log (req.session.user)
    console.log(req.body)

    db.User.findOne(
        { _id: req.session.user.id } )
        .then(user => {
            console.log("GOT HERE tO USER")
            console.log(user)
            user.update(
                { "completedActivites.id" : req.body.id }, 
                {
                    "$set": {
                        "completedActivites.$.rating": Number(req.body.value)
                    }
                })
        } )

            // if (err) {
            //     console.log("ERROR: ", err);
            //     res.send(500, err);
            // } else {
            //     res.status(200).send(model);
            // }
};
    


module.exports = {
    addEvent,
    deleteActivity,
    setStars

}