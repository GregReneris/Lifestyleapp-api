const db = require("../models/index")
const CONSTANTS = require("../const")
const fetch = require("node-fetch")

function getEvents(req, res) {
    let maxDuration = 4 * 60;
    let date = new Date();
    let currentTime = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    let startTime = currentTime.toISOString().split(".")[0] + "Z";
    let endTime = new Date(currentTime.getTime() + 60 * 60 * 24 * 1000).toISOString().split(".")[0] + "Z";

    let finalurl = `${CONSTANTS.tmUrl}?apikey=${CONSTANTS.tmApikey}&size=${CONSTANTS.tmSize}&city=${CONSTANTS.tmCity}&startDateTime=${startTime}&endDateTime=${endTime}`;
    fetch(finalurl)
        .then(res => res.json())
        .then(data => {
            let activities = data._embedded.events.map(event => {
                return db.Activity.createFromEvent(event);
            })
            res.json(activities);
        });
}

function getEventById(id) {
    return fetch(`${CONSTANTS.tmUrl}?apikey=${CONSTANTS.tmApikey}&id=${id}`)
        .then(res => res.json())
        .then(data => {
            return db.Activity.createFromEvent(data._embedded.events[0])
            // append to current user [completedActivities]. this.session.user mongoappendTo [completedActivities].
        })
}

module.exports = {
    getEvents,
    getEventById
}