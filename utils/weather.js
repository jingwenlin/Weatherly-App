import axios from 'axios';

const API_KEY = '2e4c3802589f6bf148c542837df6dce2';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getCurrentWeather = async (city) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'imperial',  
    },
  });
  return response.data;
};

export const getFiveDayForecast = async (city) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: API_KEY,
      units: 'imperial',  
    },
  });
  return response.data;
};

export const getCurrentWeatherByCoords = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/weather`, {
    params: {
      lat: lat,
      lon: lon,
      appid: API_KEY,
      units: 'imperial',
    },
  });
  return response.data;
};

export const getFiveDayForecastByCoords = async (lat, lon) => {
  const response = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      lat: lat,
      lon: lon,
      appid: API_KEY,
      units: 'imperial',
    },
  });
  return response.data;
};
