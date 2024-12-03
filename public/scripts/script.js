// URLs für APIs
const WEATHER_API_URL = "https://interface-design.onrender.com/weather";
const AIR_QUALITY_API_URL = "https://interface-design.onrender.com/air-quality";

// DOM-Elementreferenzen
const scoreBackground = document.getElementById("score-background");
const infoBox = document.getElementById("info-box");
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

// Funktion zum Interpolieren von Farben
function blendColor(startColor, endColor, percentage) {
    const hexToDec = (hex) => parseInt(hex, 16);
    const decToHex = (dec) => dec.toString(16).padStart(2, "0");

    const r = Math.round(
        hexToDec(startColor.slice(0, 2)) +
            percentage * (hexToDec(endColor.slice(0, 2)) - hexToDec(startColor.slice(0, 2)))
    );
    const g = Math.round(
        hexToDec(startColor.slice(2, 4)) +
            percentage * (hexToDec(endColor.slice(2, 4)) - hexToDec(startColor.slice(2, 4)))
    );
    const b = Math.round(
        hexToDec(startColor.slice(4, 6)) +
            percentage * (hexToDec(endColor.slice(4, 6)) - hexToDec(startColor.slice(4, 6)))
    );

    return `#${decToHex(r)}${decToHex(g)}${decToHex(b)}`;
}

// Dynamische Anpassung der Sphäre basierend auf dem Score
function updateSphere(score) {
    const startColor = "87ceeb"; // Himmelblau (gut)
    const endColor = "333"; // Dunkelgrau/Schwarz (schlecht)
    const percentage = Math.min(Math.max(score / 100, 0), 1);
    const color = blendColor(startColor, endColor, 1 - percentage);

    scoreBackground.style.background = `radial-gradient(circle, ${color} 0%, #000 100%)`;
}

// Funktion zum Abrufen und Verarbeiten von API-Daten
async function fetchData(url, updateFunction) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        updateFunction(data);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}

// Wetterdaten aktualisieren
function updateWeather(data) {
    if (data && data.main && data.weather) {
        document.getElementById("temperature").textContent = `Temperatur: ${data.main.temp}°C`;
        document.getElementById("description").textContent = `Beschreibung: ${data.weather[0].description}`;
        
        const weatherType = data.weather[0].main; // Bsp.: "Rain", "Sunny", etc.
        if (weatherIcons[weatherType]) {
            infoBox.innerHTML = `
                <img src="${weatherIcons[weatherType]}" alt="${weatherType}" style="width: 80px;">
                <p>Wetter: ${weatherType}</p>
            `;
        }
    } else {
        console.error("Ungültige Wetterdaten:", data);
    }
}

// Luftqualitätsdaten aktualisieren
function updateAirQuality(data) {
    if (data && data.data && data.data.aqi !== undefined) {
        const airQualityType =
            data.data.aqi <= 50 ? "good" : data.data.aqi <= 100 ? "medium" : "bad";

        if (airQualityIcons[airQualityType]) {
            infoBox.innerHTML = `
                <img src="${airQualityIcons[airQualityType]}" alt="${airQualityType}" style="width: 80px;">
                <p>Luftqualität: ${airQualityType}</p>
            `;
        }
    } else {
        console.error("Ungültige Luftqualitätsdaten:", data);
    }
}

// Pfeiltasten-Logik für Wetter und Luftqualität
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        fetchData(AIR_QUALITY_API_URL, updateAirQuality);
    } else if (e.key === "ArrowLeft") {
        fetchData(WEATHER_API_URL, updateWeather);
    }
});

// Initialdaten abrufen und anzeigen
fetchData(WEATHER_API_URL, updateWeather);
fetchData(AIR_QUALITY_API_URL, updateAirQuality);

// Initialisiere die Sphäre mit einem Test-Score
updateSphere(85); // Beispielscore
