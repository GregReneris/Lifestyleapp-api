const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Activity = require("./Activity")

const UserSchema = new Schema(
    {
        User:{
            firstname: String,
            lastname: String,
            password: String,
            location: String,
            email: String,
            completedActivites: [Activity]
        }

    },
);










const UserSchema = mongoose.model("lifestyle", UserSchema);
module.exports = User;