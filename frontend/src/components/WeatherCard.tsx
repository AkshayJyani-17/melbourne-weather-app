import { WeatherData, DaySelection } from '../types/weather';
import styles from './WeatherCard.module.css';

interface WeatherCardProps {
  data: WeatherData;
  day: DaySelection;
}

function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function WeatherCard({ data, day }: WeatherCardProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

  return (
    <div className={styles.card}>
      <div className={styles.badge}>{day === 'today' ? "Today's Weather" : "Tomorrow's Forecast"}</div>

      <div className={styles.header}>
        <div className={styles.location}>
          <span className={styles.locationIcon}>📍</span>
          <span>Melbourne, VIC</span>
        </div>
        <p className={styles.date}>{data.date}</p>
      </div>

      <div className={styles.mainWeather}>
        <div className={styles.iconWrap}>
          <img src={iconUrl} alt={data.description} className={styles.weatherIcon} />
        </div>
        <div className={styles.tempBlock}>
          <span className={styles.temp}>{data.temperature}°</span>
          <span className={styles.unit}>C</span>
        </div>
      </div>

      <p className={styles.description}>{capitalise(data.description)}</p>

      <div className={styles.minMax}>
        <span className={styles.minMaxItem}>
          <span className={styles.minMaxIcon}>▼</span>
          <span className={styles.minMaxVal}>{data.minTemp}°</span>
          <span className={styles.minMaxLabel}>Low</span>
        </span>
        <div className={styles.divider} />
        <span className={styles.minMaxItem}>
          <span className={`${styles.minMaxIcon} ${styles.maxIcon}`}>▲</span>
          <span className={styles.minMaxVal}>{data.maxTemp}°</span>
          <span className={styles.minMaxLabel}>High</span>
        </span>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>💧</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{data.humidity}%</span>
            <span className={styles.statLabel}>Humidity</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIcon}>🌡️</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{data.feelsLike}°C</span>
            <span className={styles.statLabel}>Feels Like</span>
          </div>
        </div>

        <div className={styles.statItem}>
          <div className={styles.statIcon}>💨</div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{data.windSpeed} km/h</span>
            <span className={styles.statLabel}>Wind Speed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
