import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 5000;

// Melbourne coordinates
const LAT = -37.8136;
const LON = 144.9631;

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

app.use(cors());
app.use(express.json());

interface WeatherData {
  temperature: number;
  humidity: number;
  date: string;
  description: string;
  icon: string;
  feelsLike: number;
  windSpeed: number;
  minTemp: number;
  maxTemp: number;
}

// WMO weather code → human-readable description + emoji icon
function getWeatherInfo(code: number): { description: string; icon: string } {
  if (code === 0) return { description: 'clear sky', icon: '01d' };
  if (code === 1) return { description: 'mainly clear', icon: '02d' };
  if (code === 2) return { description: 'partly cloudy', icon: '03d' };
  if (code === 3) return { description: 'overcast', icon: '04d' };
  if (code <= 49) return { description: 'foggy', icon: '50d' };
  if (code <= 57) return { description: 'drizzle', icon: '09d' };
  if (code <= 67) return { description: 'rain', icon: '10d' };
  if (code <= 77) return { description: 'snow', icon: '13d' };
  if (code <= 82) return { description: 'rain showers', icon: '09d' };
  if (code <= 86) return { description: 'snow showers', icon: '13d' };
  if (code <= 99) return { description: 'thunderstorm', icon: '11d' };
  return { description: 'unknown', icon: '03d' };
}

app.get('/api/weather/today', async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latitude: LAT,
        longitude: LON,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'weather_code',
          'wind_speed_10m',
        ].join(','),
        daily: ['temperature_2m_max', 'temperature_2m_min'].join(','),
        timezone: 'Australia/Melbourne',
        forecast_days: 1,
      },
    });

    const current = response.data.current;
    const daily = response.data.daily;
    const { description, icon } = getWeatherInfo(current.weather_code);

    const weatherData: WeatherData = {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      date: new Date().toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Australia/Melbourne',
      }),
      description,
      icon,
      feelsLike: Math.round(current.apparent_temperature),
      windSpeed: Math.round(current.wind_speed_10m),
      minTemp: Math.round(daily.temperature_2m_min[0]),
      maxTemp: Math.round(daily.temperature_2m_max[0]),
    };

    return res.json(weatherData);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch weather data. Please try again.' });
  }
});

app.get('/api/weather/tomorrow', async (_req: Request, res: Response) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latitude: LAT,
        longitude: LON,
        hourly: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'weather_code',
          'wind_speed_10m',
        ].join(','),
        daily: ['temperature_2m_max', 'temperature_2m_min', 'weather_code'].join(','),
        timezone: 'Australia/Melbourne',
        forecast_days: 2,
      },
    });

    const daily = response.data.daily;
    const hourly = response.data.hourly;

    // Get tomorrow's date string
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().slice(0, 10);

    // Find noon tomorrow in hourly data for representative temp/humidity/wind
    const noonIndex = hourly.time.findIndex((t: string) => t.startsWith(tomorrowStr) && t.includes('T12:'));
    const idx = noonIndex >= 0 ? noonIndex : hourly.time.findIndex((t: string) => t.startsWith(tomorrowStr));

    const { description, icon } = getWeatherInfo(daily.weather_code[1]);

    const weatherData: WeatherData = {
      temperature: Math.round(hourly.temperature_2m[idx]),
      humidity: hourly.relative_humidity_2m[idx],
      date: tomorrow.toLocaleDateString('en-AU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Australia/Melbourne',
      }),
      description,
      icon,
      feelsLike: Math.round(hourly.apparent_temperature[idx]),
      windSpeed: Math.round(hourly.wind_speed_10m[idx]),
      minTemp: Math.round(daily.temperature_2m_min[1]),
      maxTemp: Math.round(daily.temperature_2m_max[1]),
    };

    return res.json(weatherData);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch forecast data. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Weather backend running on http://localhost:${PORT}`);
});
