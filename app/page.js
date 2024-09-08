'use client';
import { useState } from 'react';
import { 
  getCurrentWeather, 
  getFiveDayForecast, 
  getCurrentWeatherByCoords, 
  getFiveDayForecastByCoords 
} from '../utils/weather';
import { getWeatherSummary } from '../utils/openai'; 
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Grid, 
  Button, 
  TextField, 
  Container, 
  Box, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  CircularProgress,
  Snackbar 
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { motion } from 'framer-motion';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [summary, setSummary] = useState('');
  const [infoOpen, setInfoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toLocaleDateString();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const currentWeather = await getCurrentWeather(city);
      setWeather(currentWeather);

      const weatherSummary = await getWeatherSummary(currentWeather);
      setSummary(weatherSummary);

      const weatherForecast = await getFiveDayForecast(city);
      setForecast(weatherForecast);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("Could not fetch weather data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const currentWeather = await getCurrentWeatherByCoords(latitude, longitude);
          setWeather(currentWeather);

          const weatherSummary = await getWeatherSummary(currentWeather);
          setSummary(weatherSummary);

          const weatherForecast = await getFiveDayForecastByCoords(latitude, longitude);
          setForecast(weatherForecast);
        } catch (error) {
          console.error("Error fetching weather data:", error);
          setError("Could not fetch weather data. Please try again later.");
        } finally {
          setLoading(false);
        }
      }, (error) => {
        console.error("Error getting location:", error);
        setError("Error getting location. Please try again.");
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleInfoOpen = () => {
    setInfoOpen(true);
  };

  const handleInfoClose = () => {
    setInfoOpen(false);
  };

  const getUniqueForecasts = (forecastList) => {
    const uniqueForecasts = [];
    const dateTracker = new Set();

    forecastList.forEach((day) => {
      const date = day.dt_txt.split(' ')[0]; // Extract the date part only
      if (!dateTracker.has(date)) {
        uniqueForecasts.push(day);
        dateTracker.add(date);
      }
    });

    return uniqueForecasts;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        color: '#ffffff',
        padding: 4,
        backgroundImage: 'url("/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h1" gutterBottom align="center" color='Primary' sx={{ mt: 2, mb: 1}}>
            Weatherly
          </Typography>
          <Typography variant="h6" gutterBottom align="center">
            {today}
          </Typography>
        </motion.div>

        <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 0 }}>
          <Grid item>
            <Typography variant="body1" gutterBottom sx={{ml:15}}>
              Created by: Jingwen Lin, Hanwen Zhang
            </Typography>
          </Grid>
          <Grid item>
            <IconButton color="warning" onClick={handleInfoOpen} sx={{mr:10}}>
              <InfoIcon />
            </IconButton>
          </Grid>
        </Grid>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Enter city"
                variant="outlined"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                sx={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: 1, 
                }}
              />
            </Grid>
            <Grid item>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSearch} 
                  disabled={loading}
                  sx={{
                    height: 56,
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: '#0056b3',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Weather'}
                </Button>
              </motion.div>
            </Grid>
            <Grid item>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleLocationSearch} 
                disabled={loading}
                sx={{
                  height: 56,
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: '#d32f2f',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Get Current Location Weather'}
              </Button>
            </Grid>
          </Grid>
        </motion.div>

        {/* Weather Data Display */}
        {weather && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                mt: 4,
                background: 'linear-gradient(135deg, #5c6bc0 30%, #3949ab 90%)',  // Gradient background
                color: '#ffffff',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',  // Box shadow for depth
                overflow: 'hidden',
              }}
            >
              <CardContent>
                <Grid container spacing={3} alignItems="center">
                  {/* Weather Icon */}
                  <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 120, margin: '0 auto' }}
                      image={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} // High-resolution weather icon
                      alt="weather icon"
                    />
                    <Typography variant="h4" sx={{ mt: 2 }}>
                      {weather.name}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, fontStyle: 'italic' }}>
                      {weather.weather[0].main}
                    </Typography>
                  </Grid>

                  {/* Weather Details */}
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {Math.round(weather.main.temp)}°F
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Feels like: {Math.round(weather.main.feels_like)}°C
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Humidity: <strong>{weather.main.humidity}%</strong>
                        </Typography>
                        <Typography variant="body1">
                          Pressure: <strong>{weather.main.pressure} hPa</strong>
                        </Typography>
                        <Typography variant="body1">
                          Visibility: <strong>{weather.visibility / 1000} km</strong>
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Wind Speed: <strong>{weather.wind.speed} m/s</strong>
                        </Typography>
                        <Typography variant="body1">
                          Wind Direction: <strong>{weather.wind.deg}°</strong>
                        </Typography>
                        <Typography variant="body1">
                          Sunrise: <strong>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</strong>
                        </Typography>
                        <Typography variant="body1">
                          Sunset: <strong>{new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</strong>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}


        {/* Forecast Display */}
        {forecast && (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {getUniqueForecasts(forecast.list).slice(0, 5).map((day, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #42a5f5 30%, #1e88e5 90%)', // Gradient background
                      color: '#ffffff',
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)', // Box shadow for depth
                      overflow: 'hidden',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                        <CardMedia
                          component="img"
                          sx={{ width: 80 }}
                          image={`http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`} // High-resolution icon
                          alt="weather icon"
                        />
                      </Box>
                      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
                        {Math.round(day.main.temp)}°F
                      </Typography>
                      <Typography variant="body1" align="center" sx={{ fontStyle: 'italic', mb: 2 }}>
                        {day.weather[0].description}
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" align="center">
                            <strong>Feels Like:</strong> {Math.round(day.main.feels_like)}°C
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" align="center">
                            <strong>Humidity:</strong> {day.main.humidity}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" align="center">
                            <strong>Wind Speed:</strong> {day.wind.speed} m/s
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" align="center">
                            <strong>Pressure:</strong> {day.main.pressure} hPa
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}


        {/* Info Dialog */}
        <Dialog open={infoOpen} onClose={handleInfoClose}>
          <DialogTitle>About PM Accelerator</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              The Product Manager Accelerator Program is designed to support PM professionals through every stage of their career. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped over hundreds of students fulfill their career aspirations.
            </Typography>
            {/* Additional information here */}
          </DialogContent>
        </Dialog>

        {/* Snackbar for Errors */}
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          message={error}
        />
      </Container>
    </Box>
  );
}
