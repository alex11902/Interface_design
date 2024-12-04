// URLs für APIs
const WEATHER_API_URL = "https://interface-design.onrender.com/weather";
const AIR_QUALITY_API_URL = "https://interface-design.onrender.com/air-quality";

// DOM-Elementreferenzen
const scoreBackground = document.getElementById("score-background");
const infoBox = document.getElementById("info-box");
const cityIcon = document.getElementById("city-icon");
const cityName = document.getElementById("city-name");

// Icons für Wetter und Luftqualität
const weatherIcons = {
    Sunny: "./assets/icons/quality/Sunny.svg",
    Rain: "",
    Snowy: "",
    Storm: "",
};
const airQualityIcons = {
    good: "public/icons/quality/airquality_good.svg",
    medium: "./assets/icons/quality/airquality_medium.svg",
    bad: "public/assets/icons/quality/airquality_bad.svg",
};

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
        // Setzt das Wettericon und zeigt eine Beschreibung
        const weatherType = data.weather[0].main; // Bsp.: "Rain", "Sunny", etc.
        cityIcon.style.display = "none"; // Versteckt das Stadticon
        infoBox.innerHTML = `
            <img src="${weatherIcons[weatherType]}" alt="${weatherType}" style="width: 50px;">
            <p>Wetter: ${weatherType}</p>
        `;
        cityName.textContent = `${data.weather[0].description}`; // Minimalbeschreibung
    } else {
        console.error("Ungültige Wetterdaten:", data);
    }
}

// Luftqualitätsdaten aktualisieren
function updateAirQuality(data) {
    if (data && data.data && data.data.aqi !== undefined) {
        // Setzt das Luftqualitätsicon und zeigt eine Beschreibung
        const airQualityType = data.data.aqi <= 50 ? "good" : data.data.aqi <= 100 ? "medium" : "bad";
        cityIcon.style.display = "none"; // Versteckt das Stadticon
        infoBox.innerHTML = `
            <img src="${airQualityIcons[airQualityType]}" alt="${airQualityType}" style="width: 50px;">
            <p>Luftqualität: ${airQualityType}</p>
        `;
        cityName.textContent = `Luftqualität ist ${airQualityType}`; // Minimalbeschreibung
    } else {
        console.error("Ungültige Luftqualitätsdaten:", data);
    }
}

// Hintergrundgradient basierend auf Score aktualisieren
function updateGradient(score) {
    const gradientColor = score > 70 ? "#009957" : score > 40 ? "#777" : "#333";
    scoreBackground.style.background = `radial-gradient(circle, ${gradientColor} 0%, #000 100%)`;
}

// Pfeiltasten-Logik
let currentState = "city"; // Der Standardzustand ist "city"

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && currentState === "city") {
        // Wenn wir in der City-Ansicht sind und nach links drücken, zeigt das Wetter an
        fetchData(WEATHER_API_URL, updateWeather);
        currentState = "weather"; // Setzt den Zustand auf "weather"
    } else if (e.key === "ArrowRight" && currentState === "weather") {
        // Wenn wir in der Wetteransicht sind und nach rechts drücken, zeigt die Stadt an
        cityIcon.style.display = "block"; // Zeigt das Stadticon wieder an
        infoBox.innerHTML = ""; // Löscht die InfoBox
        cityName.textContent = "Freiburg"; // Setzt den Stadtnamen zurück
        currentState = "city"; // Setzt den Zustand auf "city"
    } else if (e.key === "ArrowRight" && currentState === "city") {
        // Wenn wir in der City-Ansicht sind und nach rechts drücken, zeigt die Luftqualität an
        fetchData(AIR_QUALITY_API_URL, updateAirQuality);
        currentState = "airQuality"; // Setzt den Zustand auf "airQuality"
    } else if (e.key === "ArrowLeft" && currentState === "airQuality") {
        // Wenn wir in der Luftqualitätsansicht sind und nach links drücken, zeigt das Wetter an
        fetchData(WEATHER_API_URL, updateWeather);
        currentState = "weather"; // Setzt den Zustand auf "weather"
    }
});

// Initialdaten abrufen und anzeigen
fetchData(WEATHER_API_URL, updateWeather);
fetchData(AIR_QUALITY_API_URL, updateAirQuality);
