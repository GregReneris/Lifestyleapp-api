const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema(
    {
        id: String,
        activityName: String,
        description: String,
        startTime: Date,
        duration: Number,
        url: String,
        imgurl: String,
        type: String,
        lengthofHike: Number,
        date: {
            type: Date,
            default: () => new Date ()
        },
        longitude: String,
        latitude: String,
        travelTime: Number //in minutes.
        
    },
);

ActivitySchema.methods.test = function (tacocat) {
    console.log ("got to activity test");
}

ActivitySchema.statics.createFromEvent = function (event) {
    //console.log ("got to activity static");
    return new mongoose.model("Activity") ( {
        id: event.id,
        activityName: event.name,
        description: event.info,
        url: event.url,     // need to find the other url for the local venue if possible.
        imgurl: event.images[0].url,    // it's a very tiny image
        startTime: new Date(event.dates.start.dateTime),
        type: "Event",
        latitude: event._embedded.venues[0].location.latitude,
        longitude: event._embedded.venues[0].location.longitude,
        travelTime: Math.floor(Math.random() * 60) // TODO
      })
}

ActivitySchema.statics.createFromHikes = function (event) {
    //console.log ("got to activity static");
    return new mongoose.model("Activity") ( {
        id: event.id,
        activityName: event.name,
        description: event.summary,
        url: event.url,     // need to find the other url for the local venue if possible.
        imgurl: event.imgMedium,
        type: "Hike",
        latitude: event.latitude,
        longitude: event.longitude,
        travelTime: Math.floor(Math.random() * 60) // TODO
      })
}






//const ActivitySchema = mongoose.model("lifestyle", ActivitySchema);
module.exports =  mongoose.model("Activity", ActivitySchema);

