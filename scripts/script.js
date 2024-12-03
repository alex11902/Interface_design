// URLs für APIs
const weatherUrl = "";
const airQualityUrl = "";

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
    document.getElementById("temperature").textContent = `Temperatur: ${data.temperature}°C`;
    document.getElementById("description").textContent = `Beschreibung: ${data.description}`;
}

// Luftqualitätsdaten anzeigen
function updateAirQuality(data) {
    document.getElementById("aqi").textContent = `AQI: ${data.aqi}`;
    document.getElementById("pollutionLevel").textContent = `Dominanter Schadstoff: ${data.pollutionLevel}`;
}

// Daten abrufen
fetchData(weatherUrl, updateWeather);
fetchData(airQualityUrl, updateAirQuality);
