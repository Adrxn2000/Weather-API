async function getWeather() {
    const city = document.getElementById("city").value;
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/weather?city=${city}`);
        const data = await response.json();
        console.log(data);

        if (data.error) {
            document.getElementById("weatherResult").innerHTML = `<p style="color:red;">${data.error}</p>`;
        } else {
            document.getElementById("weatherResult").innerHTML = `
                <h3>${data.city}</h3>
                <p>🌡️ Temperature: ${data.temperature}°C</p>
                <p>💨 Humidity: ${data.humidity}%</p>
                <p>☁️ Condition: ${data.description}</p>
            `;
        }
    } catch (error) {
        document.getElementById("weatherResult").innerHTML = `<p style="color:red;">Error fetching data</p>`;
    }
}
