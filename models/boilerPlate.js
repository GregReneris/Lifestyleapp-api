const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        User:{
            name: String,
            password: String,
            location: String,
            email: String,
            completedActivites: [ {
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
            }]
        }

    },
);










const UserSchema = mongoose.model("lifestyle", UserSchema);
module.exports = User;