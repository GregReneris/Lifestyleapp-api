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
            places.forEach(place => {
                place.types.forEach(type => {
                    if (type === "locality" || type === "political"){
                        results.push(place);
                    }
                })
            })
            res.status(200).json(results);
        })
    }
}