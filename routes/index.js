var express = require("express");
var router = express.Router();
const cities = require("../public/javascripts/cities.js");
const modalWeather = require("../public/javascripts/mongodb");
//const dailyData = require('../public/javascripts/mongodb');
const intToDay = (dayAsInt) => {
  let day = "Weather";
  switch (dayAsInt) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
  }
  return day;
};
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* GET home page. */
router.get("/", function (req, res, next) {
  const apiKey = "31b1715eea27e8546c5192709d456eb7";
  city_info = cities.filter(function (city) {
    return city.name.includes(req.query.CityName);
  });

  // console.log(city_info[0].coord.lon);
  let lat = city_info[0].coord.lat ? city_info[0].coord.lat : "19.033331";
  let lon = city_info[0].coord.lon ? city_info[0].coord.lon : "73.316673";
  let url =
    `https://api.openweathermap.org/data/2.5/onecall?lat=` +
    lat +
    `&lon=` +
    lon +
    `&appid=` +
    apiKey +
    `&exclude=hourly`;
  let cityName = "Delhi";
  let firstLoad = true;
  let data = {};

  fetch(url)
    .then((reponse) => reponse.json())
    .then((out) => {
      // console.log("hi");
      // console.log(out.daily);
      //  console.log("hi");
      data["name"] = city_info[0].name ? city_info[0].name : "Delhi";
      data["max"] = Math.round(out.daily[0].temp.max - 273.15);
      data["min"] = Math.round(out.daily[0].temp.min - 273.15);
      data["wind"] = out.current.wind_speed;
      //data['d_wind']=out.daily.wind_speed;
      data["humidity"] = out.current.humidity;
      //data['d_humidity']= out.daily.humidity;
      data["uv"] =
        out.daily[0].uvi > 7
          ? "Very High"
          : out.daily[0].uvi > 5
          ? "High"
          : out.daily[0].uvi > 2
          ? "Moderate"
          : "Low";
      //console.log("hi");
      // console.log(out);
      //console.log("hi");
      var date = [];
      var day = [];
      var currentIconSrc = [];
      for (var i = 0; i < 5; i++) {
        const c_date = new Date(out.daily[i].dt * 1000);
        const c_day = intToDay(c_date.getDay());
        date[i] =
          c_day + ", " + c_date.getDate() + " " + months[c_date.getMonth()];
        day[i] = c_day;
        currentIcon = out.daily[i].weather[0].icon;
        currentIconSrc[i] =
          `http://openweathermap.org/img/wn/` + currentIcon + `@2x.png`;
      }
      /*for (var i = 0; i < 5; i++){
      
        const currentDiv = $(`div[data-fiveday="${i}"]`)[0];

        const currentMax = Math.round(out.daily[i].temp.max - 273.15);
        const currentMin = Math.round(out.daily[i].temp.min - 273.15);
        const currentWind = out[i].wind_speed;
        const currentHumidity = daysData[i].humidity;
        //const currentIcon = daysData[i].weather[0].icon;
        //const currentIconSrc = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`;
        //const date = new Date(daysData[i].dt * 1000);
        //const day = intToDay(date.getDay())

        $(currentDiv).children(".max")[0].textContent = `Max: ${currentMax}°C`
        $(currentDiv).children(".min")[0].textContent = `Min: ${currentMin}°C`
        $(currentDiv).children(".wind")[0].textContent = `Wind: ${currentWind}mph`
        $(currentDiv).children(".humidity")[0].textContent = `Humidity: ${currentHumidity}%`
        $(currentDiv).children(".weather-img")[0].src = currentIconSrc;
        $(currentDiv).children(".day")[0].textContent = day;  
      }*/

      data["date"] = date;
      data["icon"] = currentIconSrc;
      data["day"] = day;
      //console.log(date)
      const dbdata = {
        CityName: city_info[0].name,
        DateTime: data["date"][0],
        Temprature_Min: data["min"],
        Temprature_Max: data["max"],
        WindSpeed: data["wind"],
        Humidity: data["humidity"],
      };

      // ---------------------------18th may----------------------------

      if (city_info.length > 0) {
        // console.log(city_info)
        modalWeather.collection.insertOne(dbdata);
      }
      /*const d_data={
        "Temprature_Min": data['min'],
        "Temprature_Max": data['max'],
        "WindSpeed": data['d_wind'],
        "Humidity": data['d_humidity']
      }
       if(city_info.length > 0){
        // console.log(city_info)
        modalWeather.collection.insertOne(dbdata);
        dailyData.collection.insertOne(d_data);
      }
      */
      //console.log(dbdata)
      res.render("index", { data: data, all: out });
    });

  //---------------------------
});

router.get('/analysis',async function (req,res,next) {

    endpoint_url = "https://egal.p.rapidapi.com/linear/regressionplot";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "f56aa6af8fmsh7b076d06c9eaf28p145fe1jsnc433bd1dd041",
        "X-RapidAPI-Host": "egal.p.rapidapi.com",
      },
      body: {
        url: "https://drive.google.com/file/d/1eaUpzKjFZPM5GtYwiCckZsieCDXSnBB2/view?usp=share_link",
      },
    };

    fetch(endpoint_url, options)
    .then((response)=>{
      console.log(response);
      res.render("analysis",{body:response});
    })

    // try {
    //   const response = await fetch(endpoint_url, options);
    //   const result = await response.text();
    //   console.log(result);
    // } catch (error) {
    //   console.error(error);
    // } 

});

module.exports = router;
