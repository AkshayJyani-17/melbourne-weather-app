import { useState } from 'react';
import axios from 'axios';
import { WeatherData, DaySelection } from './types/weather';
import WeatherCard from './components/WeatherCard';
import styles from './App.module.css';

export default function App() {
  const [selectedDay, setSelectedDay] = useState<DaySelection>('today');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleCalculate() {
    setLoading(true);
    setError(null);
    setWeather(null);
    setSearched(true);

    try {
      const { data } = await axios.get<WeatherData>(`/api/weather/${selectedDay}`);
      setWeather(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error as string);
      } else {
        setError('Unable to connect to the weather service. Make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.backgroundOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>

      <main className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon}>☀️</div>
          <h1 className={styles.title}>Melbourne Weather</h1>
          <p className={styles.subtitle}>Melbourne, VIC, Australia — Real-time forecast</p>
        </header>

        {/* Form Card */}
        <section className={styles.formCard}>
          <h2 className={styles.formTitle}>Select a Day</h2>
          <p className={styles.formHint}>Choose which day's forecast you want to view</p>

          {/* Day Toggle */}
          <div className={styles.toggleGroup} role="radiogroup" aria-label="Select day">
            <button
              type="button"
              role="radio"
              aria-checked={selectedDay === 'today'}
              className={`${styles.toggleBtn} ${selectedDay === 'today' ? styles.toggleActive : ''}`}
              onClick={() => setSelectedDay('today')}
            >
              <span className={styles.toggleIcon}>🌤️</span>
              <span className={styles.toggleLabel}>Today</span>
              <span className={styles.toggleSub}>Current conditions</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={selectedDay === 'tomorrow'}
              className={`${styles.toggleBtn} ${selectedDay === 'tomorrow' ? styles.toggleActive : ''}`}
              onClick={() => setSelectedDay('tomorrow')}
            >
              <span className={styles.toggleIcon}>🌥️</span>
              <span className={styles.toggleLabel}>Tomorrow</span>
              <span className={styles.toggleSub}>24-hour forecast</span>
            </button>
          </div>

          {/* Calculate Button */}
          <button
            type="button"
            className={styles.calculateBtn}
            onClick={handleCalculate}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.btnInner}>
                <span className={styles.spinner} />
                Fetching forecast…
              </span>
            ) : (
              <span className={styles.btnInner}>
                <span>🔍</span>
                Get Weather Forecast
              </span>
            )}
          </button>
        </section>

        {/* Result area */}
        <section className={styles.resultArea}>
          {!searched && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🌏</div>
              <p className={styles.emptyText}>Select a day and click the button to see the forecast</p>
            </div>
          )}

          {error && (
            <div className={styles.errorCard}>
              <span className={styles.errorIcon}>⚠️</span>
              <div>
                <p className={styles.errorTitle}>Something went wrong</p>
                <p className={styles.errorMsg}>{error}</p>
              </div>
            </div>
          )}

          {weather && !error && (
            <WeatherCard data={weather} day={selectedDay} />
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>Powered by <span className={styles.footerAccent}>OpenWeatherMap</span> · Data updated in real-time</p>
      </footer>
    </div>
  );
}
