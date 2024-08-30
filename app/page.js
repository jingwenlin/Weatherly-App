'use client';
import { getCurrentWeather, getFiveDayForecast, getCurrentWeatherByCoords, getFiveDayForecastByCoords } from '../utils/weather';
import { getWeatherSummary } from '../utils/openai'; 
import { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Button, TextField, Container, Box, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export default function Home() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [summary, setSummary] = useState(''); 
  const [infoOpen, setInfoOpen] = useState(false);

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

  const handleInfoOpen = () => {
    setInfoOpen(true);
  };

  const handleInfoClose = () => {
    setInfoOpen(false);
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

        {/* Displaying Name and Info Button */}
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Grid item>
            <Typography variant="body1" gutterBottom>
              Created by: Jingwen Lin
            </Typography>
          </Grid>
          <Grid item>
            <IconButton color="primary" onClick={handleInfoOpen}>
              <InfoIcon />
            </IconButton>
          </Grid>
        </Grid>

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

        {/* Weather Data Display */}
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

        {/* Forecast Display */}
        {forecast && (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {forecast.list.slice(0, 5).map((day, index) => (
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
            <Typography variant="body1">
              Our Product Manager Accelerator community is ambitious and committed. Through our program, they have learned, honed, and developed new PM and leadership skills, giving them a strong foundation for their future endeavors.
            </Typography>
            <Typography variant="body1">
              Learn product management for free today on our YouTube channel: <a href="https://www.youtube.com/c/drnancyli?sub_confirmation=1" target="_blank" rel="noopener noreferrer">Product Manager Accelerator YouTube Channel</a>.
            </Typography>
            <Typography variant="body1">
              Interested in PM Accelerator Pro? 
              Step 1️⃣: Attend the Product Masterclass to learn more about the program details, price, different packages, and stay until the end to get a FREE AI Course. 
            </Typography>
            <Typography variant="body1">
              Learn how to create a killer product portfolio in two weeks that will help you land any PM job (traditional or AI), even if you were laid off or have zero PM experience.
            </Typography>
            <Typography variant="body1">
              Step 2️⃣: Reserve your early bird ticket and submit an application to talk to our Head of Admission.
            </Typography>
            <Typography variant="body1">
              Step 3️⃣: Successful applicants join our PMA Pro community to receive customized coaching!
            </Typography>
            <Typography variant="body1">
              Website: <a href="http://www.drnancyli.com" target="_blank" rel="noopener noreferrer">www.drnancyli.com</a>
            </Typography>
            <Typography variant="body1">
              Phone: +1 6176106855
            </Typography>
            <Typography variant="body1">
              Industry: E-Learning Providers
            </Typography>
            <Typography variant="body1">
              Headquarters: Boston, MA
            </Typography>
            <Typography variant="body1">
              Founded: 2020
            </Typography>
            <Typography variant="body1">
              Specialties: Product Management, Product Manager, Product Management Training, Product Management Certification, Product Lead, Product Executive, Associate Product Manager, product management coaching, product manager resume, Product Management Interview, VP of Product, Director of Product, Chief Product Officer.
            </Typography>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
