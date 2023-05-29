const mongoose=require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/WeatherForecast", {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=> {
    console.log('Connection Successful');
}).catch((e)=> {
    console.log(e);
})

const WeatherSchema = new mongoose.Schema({
    CityName:{
        type:String,
        required:true
    },
    DateTime:{
        type:Number,
        required:true
    },
    Temprature_Min:{
        type:Number,
        required:true
    },
    Temprature_Max:{
        type:Number,
        required:true
    },
    WindSpeed:{
        type:Number,
        required:true
    },
    Humidity:{
        type:Number,
        required:true
    }
})

const modelWeather = mongoose.model("Collection1", WeatherSchema)
module.exports=modelWeather;

/*
const DailySchema = new mongoose.Schema({

    Temprature_Min:{
        type:Number,
        required:true
    },
    Temprature_Max:{
        type:Number,
        required:true
    },
    WindSpeed:{
        type:Number,
        required:true
    },
    Humidity:{
        type:Number,
        required:true
    }

})

const dailyData = mongoose.model("DailyCollection", DailySchema)
module.export = dailyData;

*/