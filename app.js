
const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const redis = require("redis");
const rateLimit = require("express-rate-limit");
const cors = require('cors');


//Initialize environment variables
dotenv.config();


const app = express();
app.use(cors());

const port = process.env.PORT || 3000;
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";



const limiter = rateLimit({
    windowMs: 1* 60 * 1000, // 1 minute
    max: 5, // Limit each IP to % requests per windowMs
    message:{error: "Too many requests, please try again later." },
    headers: true, // Include rate limit headers in response
});

//Apply rate limiter to all requests
app.use(limiter);


//Create Redis client
const redisClient = redis.createClient();

//Handle Redis errors
redisClient.on("error", (err) => {
    console.error("Redis error:", err);
}
);//Connect to Redis server
redisClient.connect();



// Middleware to check cache
const checkCache = async (req, res, next) => {
    const city = req.query.city;

    try{
        const data = await redisClient.get(city);
        if(data) {
            console.log(`Cache hit for ${city}`);
            return res.json(JSON.parse(data)); // Return cached response
        }
        console.log(`Cache miss for ${city}`);
        next(); // Proceed to the route
    }catch(error){
        console.error("Redis Cache Error", error);
        next(); // Proceed to the route
    }
};

//route to get weather data by city name
app.get('/weather', checkCache, async (req, res) => {
     const city = req.query.city; //Get city name from query params

    
      if(!city) {
         return res.status(400).json({ message: "City is required" });
     }

     try {
        const response = await axios.get(BASE_URL, {
            params: { q: city, appid: API_KEY, units: "metric" // Use metrics for temperature in Celsius
            }
            
        });

//    console.log(`weather data received: ${JSON.stringify(response.data)}`);


        const weatherData = {
            city: response.data.name,
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            humidity: response.data.main.humidity
            

        };
        // store data in Redis cache for 1 hour (3600 seconds)
       await redisClient.setEx(city, 3600, JSON.stringify(weatherData));
        console.log(weatherData);
        res.json(weatherData); 
     } catch(error){
        console.error("Error fetching weather data", error.response ? error.response.data : error.message);

        res.status(error.response?.status || 500).json({
            error: error.response?.data?. message || "Server error"
        });no

     }

    });

    app.listen(port, () => {
        console.log(`Weather API running on port ${port}`);
    });


// Simple endpoint to return a hardcoded weather response
// app.get('/weather', (req, res) => {
//     const weatherData = {
//         city: 'Sample City',
//         temperature: 25,
//         description: 'Clear sky',
//         humidity: 60
//     };
//     res.json(weatherData);
// });

// app.listen(port, () => {
//     console.log(`Weather API running on port ${port}`);
// });