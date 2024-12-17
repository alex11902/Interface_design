const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

// Serve statische Dateien (Frontend)
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Statische Dateien bereitstellen
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Wetterdaten-Endpunkt
const WEATHER_API_KEY = "ccfe51382ba398aa60bb08056f21c443"; // Dein OpenWeatherMap API-Schlüssel
app.get("/weather", async (req, res) => {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=Freiburg&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        res.json(data); // JSON-Antwort an den Client senden
    } catch (error) {
        console.error("Fehler beim Abrufen der Wetterdaten:", error);
        res.status(500).json({ error: "Fehler beim Abrufen der Wetterdaten" });
    }
});

// Luftqualitätsdaten-Endpunkt
const AIR_QUALITY_API_KEY = "c3e5367de336c145cdbd0903027a41af955b1579"; // Dein WAQI API-Schlüssel
app.get("/air-quality", async (req, res) => {
    try {
        const response = await fetch(
            `https://api.waqi.info/feed/Freiburg/?token=${AIR_QUALITY_API_KEY}`
        );
        const data = await response.json();
        res.json(data); // JSON-Antwort an den Client senden
    } catch (error) {
        console.error("Fehler beim Abrufen der Luftqualitätsdaten:", error);
        res.status(500).json({ error: "Fehler beim Abrufen der Luftqualitätsdaten" });
    }
});

// Starten des Servers
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
if (!app.listen) {
    displayError("hier gibts nichts zu sehen");
    console.warn("hat nicht funktioniert")
}