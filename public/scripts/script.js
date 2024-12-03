// URLs für APIs
const WEATHER_API_URL = "https://interface-design.onrender.com/weather";
const AIR_QUALITY_API_URL = "https://interface-design.onrender.com/air-quality";

// Daten abrufen und anzeigen
async function fetchData(url, updateFunction) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        updateFunction(data);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}

// Wetterdaten anzeigen
function updateWeather(data) {
    if (data && data.main && data.weather) {
        document.getElementById("temperature").textContent = `Temperatur: ${data.main.temp}°C`;
        document.getElementById("description").textContent = `Beschreibung: ${data.weather[0].description}`;
    } else {
        console.error("Ungültige Wetterdaten:", data);
    }
}

// Luftqualitätsdaten anzeigen
function updateAirQuality(data) {
    if (data && data.data && data.data.aqi !== undefined) {
        document.getElementById("aqi").textContent = `AQI: ${data.data.aqi}`;
        document.getElementById("pollutionLevel").textContent =
            data.data.dominentpol
                ? `Dominanter Schadstoff: ${data.data.dominentpol}`
                : "Dominanter Schadstoff: Keine Daten verfügbar";
    } else {
        console.error("Ungültige Luftqualitätsdaten:", data);
    }
}

// Daten abrufen
fetchData(WEATHER_API_URL, updateWeather);
fetchData(AIR_QUALITY_API_URL, updateAirQuality);
