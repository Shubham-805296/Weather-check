document.querySelector(".btn").addEventListener("click", async () => {
    const input = document.querySelector(".form-control").value.trim();
    if (!input) return alert("Please enter a location");

    try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input}`);
        const geoData = await geoRes.json();
        const place = geoData?.results?.[0];
        if (!place) return alert("Location not found");

        const { latitude, longitude, name, country } = place;
        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
        );
        const weatherData = await weatherRes.json();
        const weather = weatherData.current_weather;

        if (!weather) {
            alert("Weather data not available");
            return;
        }

        const localDate = new Date().toLocaleDateString();
        const localTime = new Date().toLocaleTimeString();

        const weatherHTML = `
            <table class="table table-bordered text-center">
                <thead>
                    <tr><th colspan="2">📍 ${name}, ${country}</th></tr>
                </thead>
                <tbody>
                    <tr><td>📅 Local Date</td><td>${localDate}</td></tr>
                    <tr><td>🕒 Local Time</td><td>${localTime}</td></tr>
                    <tr><td>🌡️ Temperature</td><td>${weather.temperature}°C</td></tr>
                    <tr><td>💨 Wind Speed</td><td>${weather.windspeed} km/h</td></tr>
                </tbody>
            </table>
        `;

        const tableContainer = document.getElementById("weatherTable");
        tableContainer.innerHTML = weatherHTML;
        tableContainer.style.display = "block";

    } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Something went wrong. Try again!");
    }
});
