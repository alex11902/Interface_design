// URLs für APIs
const WEATHER_API_URL = "https://interface-design.onrender.com/weather";
const AIR_QUALITY_API_URL = "https://interface-design.onrender.com/air-quality";

// DOM-Elementreferenzen
const scoreBackground = document.getElementById("score-background");
const infoBox = document.getElementById("info-box");
const cityIcon = document.getElementById("city-icon");
const cityName = document.getElementById("city-name");
const DataDisplay = document.getElementById("data-display");

// Icons für Wetter und Luftqualität
const weatherIcons = {
    Storm: "public/assets/icons/quality/Rain.svg",
};
const airQualityIcons = {
    good: "./assets/icons/quality/",
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
        console.error("Fehler beim Abrufen der Daten", error);
        displayError("Daten konnten nicht abgerufen werden");
    }
}

// Funktion zum Anzeigen eines Fehlers
function displayError(message) {
    infoBox.innerHTML = `<p>${message}</p>`;
    DataDisplay.style.display = "none";
}

// Wetterdaten aktualisieren
function updateWeather(data) {
    if (data?.main?.temp && data.weather?.[0]?.main) {
        const weatherType = data.weather[0].main;
        const temperature = Math.round(data.main.temp);

        showInfoBox(`
            <img src="${weatherIcons[weatherType]}" alt="${weatherType}" style="width: 50px;">
            <p>Wetter: ${weatherType}</p>
            <p>Temperatur: ${temperature}°C</p>
        `, `${data.weather[0].description}`);
    } else {
        displayError("Wetterdaten nicht verfügbar");
    }
}

// Luftqualitätsdaten aktualisieren
function updateAirQuality(data) {
    if (data?.data?.aqi !== undefined) {
        const airQualityType = data.data.aqi <= 50 ? "good" : data.data.aqi <= 100 ? "medium" : "bad";

        showInfoBox(`
            <img src="${airQualityIcons[airQualityType]}" alt="${airQualityType}" style="width: 50px;">
            <p>AQI: ${data.data.aqi} (${airQualityType})</p>
        `, `Luftqualität: ${airQualityType}`);
    } else {
        displayError("Luftqualitätsdaten nicht verfügbar");
    }
}

// Funktion zum Anzeigen der InfoBox
function showInfoBox(content, description) {
    cityIcon.style.display = "none";
    infoBox.innerHTML = content;
    cityName.textContent = description;
}

// Funktion zur Rückkehr zur Stadtansicht
function resetToCity() {
    cityIcon.style.display = "block";
    infoBox.innerHTML = "";
    cityName.textContent = "Freiburg";
}

// Hintergrundgradient basierend auf Score aktualisieren
function updateGradient(score) {
    const gradientColor = score > 70 ? "#00b2ff7d" : score > 40 ? "#777" : "#333";
    scoreBackground.style.background = `radial-gradient(circle, ${gradientColor} 0%, #000 100%)`;
}

// Pfeiltasten-Logik
let currentState = "city";

document.addEventListener("keydown", (e) => {
    switch (`${e.key}-${currentState}`) {
        case "ArrowLeft-city":
            fetchData(WEATHER_API_URL, updateWeather);
            currentState = "weather";
            break;

        case "ArrowRight-weather":
            resetToCity();
            currentState = "city";
            break;

        case "ArrowRight-city":
            fetchData(AIR_QUALITY_API_URL, updateAirQuality);
            currentState = "airQuality";
            break;

        case "ArrowLeft-airQuality":
            fetchData(WEATHER_API_URL, updateWeather);
            currentState = "weather";
            break;

        default:
            // Keine Aktion für andere Tasten
            break;
    }
});

// Initialdaten abrufen und anzeigen
fetchData(WEATHER_API_URL, updateWeather);
fetchData(AIR_QUALITY_API_URL, updateAirQuality);
