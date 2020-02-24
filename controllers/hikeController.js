const db = require("../models/index");
const CONSTANTS = require("../const");
const fetch = require("node-fetch");

function getHikes(req, res) {
  let maxDuration = 4 * 60;
  
  // adding in the user's location.
  // CONSTANTS.hklocation = {user.}
  // lat=47.6045335&lon=-122.3531904
  let lat = req.session.user.lat
  let lon = req.session.user.lon
  
  let finalurl = `${CONSTANTS.hkUrl}/get-trails?key=${CONSTANTS.hkApikey}&maxDistance=${CONSTANTS.hkRadius}&maxResult=${CONSTANTS.hkMaxResults}&lat=${lat}&lon=${lon}`;
  console.log(finalurl)
  fetch(finalurl)
    .then(res => res.json())
    .then(data => {
      let activities = data.trails.map(event => {
        return db.Activity.createFromHikes(event);
      })
      res.json(activities);
    });
}

function getHikeById(id) {
  return fetch(`${CONSTANTS.hkUrl}/get-trails-by-id?key=${CONSTANTS.hkApikey}&ids=${id}`)
    .then(res => res.json())
    .then(data => {
      return db.Activity.createFromHikes(data.trails[0]) //not getting any info for data.trails[0] because the id is udefined. 
      // append to current user [completedActivities]
    })
}

module.exports = {
  getHikes,
  getHikeById
}