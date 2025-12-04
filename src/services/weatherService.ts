import { WEATHER_API_URL } from '@/constants';
import { WeatherData } from '@/types';

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    const data = await response.json();
    
    if (!data.current_weather) {
      throw new Error("Invalid weather data format");
    }

    return {
      temperature: data.current_weather.temperature,
      weatherCode: data.current_weather.weathercode,
      isDay: data.current_weather.is_day,
    };
  } catch (error) {
    console.error("Failed to fetch weather", error);
    // Return fallback data on error to keep UI intact
    return {
      temperature: 22,
      weatherCode: 0,
      isDay: 1
    };
  }
};