const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivitySchema = new Schema(
    {
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
        }
    },
);










//const ActivitySchema = mongoose.model("lifestyle", ActivitySchema);
module.exports = mongoose.model("Activity", ActivitySchema);