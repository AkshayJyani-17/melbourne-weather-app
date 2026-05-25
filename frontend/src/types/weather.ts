export interface WeatherData {
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

export type DaySelection = 'today' | 'tomorrow';
