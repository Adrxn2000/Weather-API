Weather API

This is a simple Weather API built using Node.js, Express, and Redis. It fetches real-time weather data from a third-party API and caches results using Redis to improve performance and reduce unnecessary API calls.

Features

Fetches weather data for any city

Caches API responses using Redis to improve efficiency

Implements rate limiting to prevent abuse

Uses environment variables to store sensitive API keys

Built with Express.js and Axios for API requests

Technologies Used

Node.js

Express.js (Backend framework)

Axios (HTTP requests to third-party API)

Redis (Caching)

express-rate-limit (Rate limiting)

dotenv (Environment variables management)

Installation & Setup

Prerequisites

Make sure you have the following installed on your system:

Node.js (>= v14)

Redis (Ensure Redis server is running)

1️⃣ Clone the Repository

git clone https://github.com/your-username/weather-api.git
cd weather-api

2️⃣ Install Dependencies

npm install

3️⃣ Set Up Environment Variables

Create a .env file in the root directory and add your API key:

PORT=3000
WEATHER_API_KEY=your_openweather_api_key
REDIS_HOST=localhost
REDIS_PORT=6379

4️⃣ Start Redis Server

Make sure Redis is running before starting the API:

redis-server

5️⃣ Run the Server

npm start

The API will run at: http://localhost:3000

Usage

Get Weather for a City

Send a GET request to:

http://localhost:3000/weather?city=London

Example Response:

{
  "city": "London",
  "temperature": 15,
  "humidity": 70,
  "description": "Clear sky"
}

Frontend Integration

If you're building a frontend for this API, make a fetch request like this:

fetch("http://localhost:3000/weather?city=London")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error fetching weather data:", error));

Error Handling

If something goes wrong, the API will return an error response:

{
  "error": "City not found"
}

Next Steps

Deploy the API to a cloud service (e.g., Heroku, Vercel, or AWS)

Improve caching logic with TTL (time-to-live) strategies

Add user authentication (optional)

Author

Developed by Adrian Majavu 🚀

