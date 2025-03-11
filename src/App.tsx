import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setError(null);
    setWeather(null);

    try {
      const response = await fetch(
        `https://localhost:7103/weather?city=${city}&country=${country}`,
        {
          headers: {
            apiKey: "API_KEY_1",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setWeather(data.description);
      } else {
        const data = await response.text();
        setError(data || "Failed to fetch weather");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {weather && <p>Weather: {weather}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default App;
