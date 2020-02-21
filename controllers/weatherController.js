const axios = require ("axios");
// const db = require("../models/user");


// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/lifestyle", { useNewUrlParser: true, useUnifiedTopology: true });

function getWeather(req, res, city) {
    if (!city) res.status(400).send("must include city param")

    const newWeather = {}
console.log("THIS IS CITY: ", city);

  let openWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city} &units=imperial&appid=e7196856e41701aad2ab6aa22965b557`

  console.log("URL TYPE = ", typeof openWeatherAPI);
  
  axios.get(openWeatherAPI)
  .then(({data}) => {
      console.log(data);
      
    newWeather.weather = data.weather[0].main
    newWeather.desc = data.weather[0].description
    newWeather.icon = data.weather[0].icon
    console.log(newWeather);
    res.json(newWeather)

  }).catch(err=>{
    res.status(400).send("error requesting data")
    console.log("ERROR", err)})
}

module.exports = getWeather