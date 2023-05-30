var express = require("express");
var router = express.Router();
const cities = require("../public/javascripts/cities.js");
const modalWeather = require("../public/javascripts/mongodb");
const intToDay = (dayAsInt) => {
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

const toTitleCase = (str)=>{
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

/* GET home page. */
router.get("/", function (req, res, next) {
  const apiKey = "31b1715eea27e8546c5192709d456eb7";
  city_info = cities.filter(function (city) {
    return city.name.includes(req.query.CityName);
    });
  if(city_info.length < 1){
    city_info = cities.filter(function (city) {
      return city.name.includes("Pune");
  });
  }

  let lat = city_info[0].coord.lat;
  let lon = city_info[0].coord.lon;
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
      data["name"] = city_info[0].name;
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

router.get('/analysis',function (req,res,next) {
  axios = require('axios')
  const options = {
    method: 'POST',
    url: 'https://egal.p.rapidapi.com/linear/regressionplot',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': '46e65031c1msheef2293fd427ad5p1415a1jsn3142276e757d',
      'X-RapidAPI-Host': 'egal.p.rapidapi.com'
    },
    data: {
      url: 'https://drive.google.com/u/0/uc?id=1L6RErnw0Xb_R_ZKJ_s6zbcGePmirEg-r&export=download'
    },
    responseType: 'arraybuffer'
  };

  urlList=[];

  async function test() {
    try {
      const response = await axios.request(options);
      // console.log(response.data);
      base64 = new Buffer.from(response.data).toString('base64');
      url = "data:image/png;base64,"+base64;
      urlList.push(url);
    } catch (error) {
      console.error(error);
    }
  }
  test();
  options.url="https://egal.p.rapidapi.com/linear/plot";


});

module.exports = router;
