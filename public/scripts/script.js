// URLs für APIs
const WEATHER_API_URL = "https://interface-design.onrender.com/weather";
const AIR_QUALITY_API_URL = "https://interface-design.onrender.com/air-quality";

// Gradient nach Datenabruf initial setzen
fetchData(WEATHER_API_URL, (weatherData) => {
    fetchData(AIR_QUALITY_API_URL, (airQualityData) => {
        updateGradient(weatherData, airQualityData);
    });
});


// DOM-Elementreferenzen
const scoreBackground = document.getElementById("score-background");
const infoBox = document.getElementById("info-box");
const cityIcon = document.getElementById("city-icon");
const Name = document.getElementById("namespace");
const DataDisplay = document.getElementById("data-display");


// Icons für Wetter und Luftqualität
const weatherIcons = {
    weatherDisplayStorm: document.getElementById("weather-Storm"),
    weatherDisplayRain: document.getElementById("weather-Rain"),
    weatherDisplaySunny: document.getElementById("weather-Sun"),
    weatherDisplayWindy: document.getElementById("weather-Wind"),
    weatherDisplayNameSnowy: document.getElementById("weather-Snow"),

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
        const airQualityType = data.data.aqi <= 50 ? "Gut" : data.data.aqi <= 85 ? "Mäßig" : "Schlecht";

        showInfoBox(`
            <img src="${airQualityIcons[airQualityType]}" alt="${airQualityType}" style="width: 50px;">
            <p>AQI: ${data.data.aqi} (${airQualityType})</p>`, 
            `Luftqualität: ${airQualityType}`);
    } else {
        displayError("Luftqualitätsdaten nicht verfügbar");
    }
}

// Funktion zum Anzeigen der InfoBox
function showInfoBox(content, description) {
    cityIcon.style.display = "none";
    infoBox.innerHTML = content;
    Name.textContent = description;
}

// Funktion zur Rückkehr zur Stadtansicht
function resetToCity() {
    cityIcon.style.display = "block";
    infoBox.style.display = "none";
    DataDisplay.style.display = "none";
    Name.textContent = "Freiburg";
    
}

// Funktion zur Aktualisierung des Hintergrundgradienten basierend auf Wetter- und Luftqualitätsscore
function updateGradient(weatherData, airQualityData) {
    // 1. Wetterdaten normalisieren (z. B. Temperatur)
    const temperature = weatherData.main.temp; // Aktuelle Temperatur
    const weatherScore = normalize(temperature, 0, 30); // Skaliere von 0°C bis 30°C

    // 2. Luftqualitätsdaten normalisieren (z. B. AQI)
    const aqi = airQualityData.data.aqi; // Air Quality Index
    const airQualityScore = normalize(aqi, 0, 200, true); // Skaliere von 0 (ideal) bis 200 (schlecht)

    // 3. Gesamt-Score berechnen (50% Gewichtung für beide)
    const score = 0.5 * weatherScore + 0.5 * airQualityScore;

    // 4. Hintergrundfarbe basierend auf dem Score setzen
    const gradientColor = score > 70 ? "#00b2ff7d" : score > 40 ? "#888" : "#333";
    scoreBackground.style.background = `radial-gradient(circle, ${gradientColor} 0%, #000 67%)`;

    console.log(`Score: ${score} | Wetter: ${weatherScore} | Luftqualität: ${airQualityScore}`);
}

// Funktion zur Normalisierung eines Werts zwischen min und max
function normalize(value, min, max, invert = false) {
    const normalized = (value - min) / (max - min);
    return invert ? 100 - Math.min(Math.max(normalized * 100, 0), 100) : Math.min(Math.max(normalized * 100, 0), 100);
}


// Pfeiltasten-Logik
let currentState = "city";
document.addEventListener("keydown", (e) => {
    switch (`${e.key}-${currentState}`) {
        case "ArrowLeft-city":
            // Zeigt das Wetter an
            fetchData(WEATHER_API_URL, (weatherData) => {
                fetchData(AIR_QUALITY_API_URL, (airQualityData) => {
                    updateGradient(weatherData, airQualityData);
                });
                updateWeather(weatherData);
            });
            currentState = "weather";
            break;

        case "ArrowRight-city":
            // Zeigt die Luftqualität an
            fetchData(AIR_QUALITY_API_URL, (airQualityData) => {
                fetchData(WEATHER_API_URL, (weatherData) => {
                    updateGradient(weatherData, airQualityData);
                });
                updateAirQuality(airQualityData);
            });
            currentState = "airQuality";
            break;

        case "ArrowUp-weather":
        case "ArrowUp-airQuality":
            // Zeigt die Stadtansicht an
            resetToCity();
            currentState = "city";
            break;

        default:
            // Keine Aktion für andere Tasten
            break;
    }
});


// Initialdaten abrufen und anzeigen
fetchData(WEATHER_API_URL, updateWeather);
fetchData(AIR_QUALITY_API_URL, updateAirQuality);
