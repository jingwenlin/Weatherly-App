'use client';
import { getCurrentWeather, getFiveDayForecast, getCurrentWeatherByCoords, getFiveDayForecastByCoords } from '../utils/weather';
import { getWeatherSummary } from '../utils/openai'; 
import { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Button, TextField, Container, Box } from '@mui/material';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [summary, setSummary] = useState(''); 

  const today = new Date().toLocaleDateString(); 

  const handleSearch = async () => {
    try {
      const currentWeather = await getCurrentWeather(city);
      setWeather(currentWeather);

      const weatherSummary = await getWeatherSummary(currentWeather); 
      setSummary(weatherSummary); 

      const weatherForecast = await getFiveDayForecast(city);
      console.log('Forecast Data:', weatherForecast); 
      setForecast(weatherForecast);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleLocationSearch = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const currentWeather = await getCurrentWeatherByCoords(latitude, longitude);
          setWeather(currentWeather);

          const weatherSummary = await getWeatherSummary(currentWeather);
          setSummary(weatherSummary); 

          const weatherForecast = await getFiveDayForecastByCoords(latitude, longitude);
          console.log('Forecast Data:', weatherForecast); 
          setForecast(weatherForecast);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }, (error) => {
        console.error("Error getting location:", error);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
        color: '#ffffff',
        padding: 4,
      }}
    >
      <Container>
        <Typography variant="h3" gutterBottom align="center">
          WeatherCheck
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
          {today} 
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Enter city"
              variant="outlined"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleSearch}>
              Get Weather
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={handleLocationSearch}>
              Get Weather by Location
            </Button>
          </Grid>
        </Grid>

        {weather && (
          <Card sx={{ mt: 4, backgroundColor: '#303f9f', color: '#ffffff' }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Current Weather in {weather.name}
              </Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <CardMedia
                    component="img"
                    sx={{ width: 100 }}
                    image={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body1">Temperature: {weather.main.temp}°F</Typography>
                  <Typography variant="body1">Feels Like: {weather.main.feels_like}°F</Typography>
                  <Typography variant="body1">Weather: {weather.weather[0].description}</Typography>
                  <Typography variant="body1">Humidity: {weather.main.humidity}%</Typography>
                  <Typography variant="body1">Wind Speed: {weather.wind.speed} mph</Typography>
                  <Typography variant="body1">Pressure: {weather.main.pressure} hPa</Typography>
                  <Typography variant="body1">Visibility: {weather.visibility / 1000} km</Typography>
                  <Typography variant="body1">Summary: {summary} </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {forecast && (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {(() => {
              const uniqueForecasts = [];
              const dateTracker = new Set();

              forecast.list.forEach((day) => {
                const date = day.dt_txt.split(' ')[0]; 
                if (!dateTracker.has(date)) {
                  uniqueForecasts.push(day);
                  dateTracker.add(date);
                }
              });

              return uniqueForecasts.slice(0, 5).map((day, index) => {
                console.log(`Unique Date for day ${index + 1}: ${day.dt_txt}`);
                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ backgroundColor: '#303f9f', color: '#ffffff' }}>
                      <CardContent>
                        <Typography variant="h6">
                          {new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </Typography>
                        <CardMedia
                          component="img"
                          sx={{ width: 100 }}
                          image={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                          alt="weather icon"
                        />
                        <Typography variant="body1">Temperature: {day.main.temp}°F</Typography>
                        <Typography variant="body1">Feels Like: {day.main.feels_like}°F</Typography>
                        <Typography variant="body1">Weather: {day.weather[0].description}</Typography>
                        <Typography variant="body1">Humidity: {day.main.humidity}%</Typography>
                        <Typography variant="body1">Wind Speed: {day.wind.speed} mph</Typography>
                        <Typography variant="body1">Pressure: {day.main.pressure} hPa</Typography>
                        <Typography variant="body1">Visibility: {day.visibility / 1000} km</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              });
            })()}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
