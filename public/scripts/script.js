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


// script.js

// Elementreferenzen
const scoreBackground = document.getElementById("score-background");
const infoBox = document.getElementById("info-box");

// Beispielwerte für Wetter und Luftqualität
const data = {
    weather: "Sunny", // "Rain", "Snowy", "Storm"
    airQuality: "good", // "medium", "bad"
    score: 85, // Prozentwert für den Score
};

// Gradient basierend auf dem Score aktualisieren
function updateGradient(score) {
    const gradientColor = score > 70 ? "#009957" : score > 40 ? "#777" : "#333";
    scoreBackground.style.background = `radial-gradient(circle, ${gradientColor} 0%, #000 100%)`;
}

// Icons und Beschreibungen
const weatherIcons = {
    Sunny: "./assets/icons/quality/Sunny.svg",
    Rain: "./assets/icons/quality/Rain.svg",
    Snowy: "./assets/icons/quality/Snowy.svg",
    Storm: "./assets/icons/quality/Storm.svg",
};

const airQualityIcons = {
    good: "./assets/icons/quality/airquality_good.svg",
    medium: "./assets/icons/quality/airquality_medium.svg",
    bad: "./assets/icons/quality/airquality_bad.svg",
};

// Eventlistener für Pfeiltasten
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        // Luftqualität anzeigen
        infoBox.innerHTML = `
            <img src="${airQualityIcons[data.airQuality]}" alt="${data.airQuality}" style="width: 50px;">
            <p>Luftqualität: ${data.airQuality}</p>
        `;
    } else if (e.key === "ArrowLeft") {
        // Wetter anzeigen
        infoBox.innerHTML = `
            <img src="${weatherIcons[data.weather]}" alt="${data.weather}" style="width: 50px;">
            <p>Wetter: ${data.weather}</p>
        `;
    }
});

// Initialisiere mit dem aktuellen Score
updateGradient(data.score);
