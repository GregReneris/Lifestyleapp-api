const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const boilerPlateSchema = new Schema(
    {
        day: {
            type: Date,
            default: () => new Date()
        },
        // exercises: [
        //     {
        //         type: {
        //             type: String,
        //             trim: true,
        //             required: "Enter an exercise type"
        //         },
        //         name: {
        //             type: String,
        //             trim: true,
        //             required: "Enter an exercise name"
        //         },
        //         duration: {
        //             type: Number,
        //             required: "Enter an exercise duration in minutes"
        //         }
        //     }
        // ],
        
        user:{
            name: String,
            password: String,
            location: String,
            email: String,

            completedActivites [
                {
                    placeholder: null
                    // insert completed activities via mongo version of join.
                }
            ]


        }


    },
);
const boilerPlate = mongoose.model("lifestyle", boilerPlateSchema);
module.exports = boilerPlate;