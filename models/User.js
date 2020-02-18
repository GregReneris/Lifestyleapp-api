const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Activity = require("./Activity")
let bcrypt = require('bcrypt');



const UserSchema = new Schema(
    {
        firstname: String,
        lastname: String,
        password: String,
        location: String,
        email: String,
        completedActivites: [Activity.schema]
    }
);


    //sequelize hook, will run before model instance is created and hash password
// UserSchema.pre(function(user) {
//     user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
//   });

UserSchema.pre('save', () => bcrypt.hashSync(UserSchema.password, bcrypt.genSaltSync(10), null));


//const UserSchema = mongoose.model("lifestyle", UserSchema);
module.exports = mongoose.model("User", UserSchema);