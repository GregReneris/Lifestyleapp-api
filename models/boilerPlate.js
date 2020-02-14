const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const boilerPlateSchema = new Schema(
    {
        day: {
            type: Date,
            default: () => new Date()
        },
        
        user:{
            name: String,
            password: String,
            location: String,
            email: String,
            completedActivites: {
                    default: null
                    // insert completed activities via mongo version of join.
                }
        },

        completedActivites: {
            activityName: String,
            description: String,
            Type: String,
            LengthofHike: Number,
            Date: {
                type: Date,
                default: () => new Date ()
            }
        }

    },
);








const boilerPlate = mongoose.model("lifestyle", boilerPlateSchema);
module.exports = boilerPlate;