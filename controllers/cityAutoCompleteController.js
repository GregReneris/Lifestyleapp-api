const axios = require ('axios');
const crypto = require('crypto');
let token = crypto.randomBytes(64).toString('hex');


module.exports= {
    userCity: function (req, res) {
        const search = req.params.search;
        console.log(process.env.PLACESKEY);

        let googleURL= "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + search + "&key=" + process.env.PLACESKEY + "&sessiontoken=" + token;
        
        axios.get(googleURL).then(response => {
            const places = response.data.predictions;
            const results = [];
            console.log(places)
            places.forEach(place => {
                    if (place.types.indexOf("locality") > -1 || place.types.indexOf("political") > -1){
                        results.push(place);
                    }
                })
            
            res.status(200).json(results);
        }).catch((err) => {res.status(200).json("")})
    }
}





// module.exports= {
//     userCity: function (req, res) {
//         const search = req.params.search;
//         console.log(process.env.PLACESKEY);

//         let googleURL= "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + search + "&key=" + process.env.PLACESKEY + "&sessiontoken=" + token;
        
//         axios.get(googleURL).then(response => {
//             const places = response.data.predictions;
//             const results = [];
//             places.forEach(place => {
//                 place.types.forEach(type => {
//                     if (type === "locality" || type === "political"){
//                         results.push(place);
//                         console.log(results)
//                     }
//                 })
//             })
//             res.status(200).json(results);
//         })
//     }
// }