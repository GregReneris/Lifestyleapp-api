// mode is driving as default

//https://developers.google.com/maps/documentation/distance-matrix/intro



// example from Alexa Proj2

let googleApiKey = "AIzaSyB6YDdaRNCGktlvWISrGBjv75lcHfR-l44"
let cityOne = "Seattle+WA"
let cityTwo = "phoenix+az"
let vehicleType = "driving"

let googleURL= "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + cityOne + "&destinations=" + cityTwo + "&mode=" + vehicleType + "&language=en-FR&key=" + googleApiKey;


console.log(googleURL)


//TODO: Convert user.location from city into lat/long. Maybe. MDP


// var example = "https://maps.googleapis.com/maps/api/place/autocomplete/xml?input=Amoeba&types=establishment&location=37.76999,-122.44696&radius=500&key="+googleApiKey;

// "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Amoeba&types=establishment&location=37.76999,-122.44696&radius=500&key=AIzaSyB6YDdaRNCGktlvWISrGBjv75lcHfR-l44"


//             tripDistance: Math.round(response.data.rows[0].elements[0].distance.value * 0.000621371),
//             tripTime_car: (response.data.rows[0].elements[0].distance.value * 0.000621371 / 40).toFixed(2),



// this is one from seattle to phoenix.
"https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=Seattle+WA&destinations=phoenix+az&mode=driving&language=en-FR&key=AIzaSyB6YDdaRNCGktlvWISrGBjv75lcHfR-l44"