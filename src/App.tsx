import React, { useState } from "react";
import "./App.css";
import config from "./config";

function App() {
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [weather, setWeather] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchWeather = async () => {
    setError(null);
    setWeather(null);
    setLoading(true);
    try {
      const response = await fetch(
        `${config.baseUrl}/weather?city=${city}&country=${country}`,
        {
          headers: {
            apiKey: config.apiKey,
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
    } finally {
      setLoading(false);
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

      {loading && <p>Loading...</p>}
      {weather && <p>Weather: {weather}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default App;
