
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  description: string;
  icon: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  feelsLike: number;
}

export const useWeatherData = (latitude: number | null, longitude: number | null) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Using OpenWeatherMap API (free tier)
        // User will need to get their own API key
        const API_KEY = 'demo_key'; // This will be replaced with actual API key
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        const data = response.data;
        setWeatherData({
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          windDirection: data.wind.deg,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          pressure: data.main.pressure,
          visibility: data.visibility / 1000, // Convert to km
          uvIndex: 0, // Would need additional API call
          feelsLike: Math.round(data.main.feels_like),
        });
      } catch (err) {
        // Fallback to mock data for demo
        setWeatherData({
          temperature: 28,
          humidity: 75,
          windSpeed: 12,
          windDirection: 180,
          description: 'Partly cloudy',
          icon: '02d',
          pressure: 1013,
          visibility: 10,
          uvIndex: 6,
          feelsLike: 31,
        });
        setError('Using demo weather data. Please add OpenWeatherMap API key for real data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [latitude, longitude]);

  return { weatherData, loading, error };
};
