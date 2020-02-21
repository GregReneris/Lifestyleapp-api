const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Activity = require("./Activity")
let bcrypt = require('bcrypt');
const saltRounds = 10;



const UserSchema = new Schema(
    {
        name: String,
        password: {type: String, required: true},
        city: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        lat: Number,
        lon: Number,
        completedActivites: [Activity.schema]
    }
);


    //sequelize hook, will run before model instance is created and hash password
// UserSchema.pre(function(user) {
//     user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
//   });

// UserSchema.pre('save', () => bcrypt.hashSync(UserSchema.password, bcrypt.genSaltSync(10), null));

UserSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
  });
  


// UserSchema.beforeCreate(function(user) {
//     UserSchema.password = bcrypt.hashSync(UserSchema.password, bcrypt.genSaltSync(10), null);
//   });

//const UserSchema = mongoose.model("lifestyle", UserSchema);
module.exports = mongoose.model("User", UserSchema);