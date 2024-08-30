import axios from 'axios';

export const getWeatherSummary = async (weatherData) => {
  try {
    const response = await axios.post('/api/route', { weatherData });
    return response.data.summary;
  } catch (error) {
    console.error('Error fetching weather summary:', error);
    return 'Unable to generate summary.';
  }
};
