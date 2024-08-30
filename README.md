# WeatherCheck App

## Overview

WeatherCheck is a responsive web application that allows users to check the current weather and a 5-day forecast for any city. It also provides weather information based on the user's current location. Additionally, the app generates an AI-powered weather summary using OpenAI's API.

## Features

- **Search Weather by City**: Enter a city name to get current weather details and a 5-day forecast.
- **Location-Based Weather**: Get weather information for your current location city.
- **AI-Powered Weather Summary**: Receive a detailed summary of the current weather conditions generated by OpenAI's GPT model.
- **User-Friendly Interface**: Built using Material-UI for a polished, responsive design.

## Tech Stack

- **Frontend**: React, Next.js, Material-UI, JavaScript (ES6+)
- **APIs**: OpenWeatherMap API, Google Maps Geocoding API, OpenAI API
- **Backend**: Next.js API Routes (for API requests)
- **Utilities**: Custom utility functions for API interactions
- **Development Tools**: Browser Developer Tools, VS Code
- **Version Control**: Git
  
# How to use this application 
## Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

### Steps

1. **Clone the repository**:
   git clone https://github.com/your-username/weather-check.git
   cd weather-check
2. ## Install dependencies:

### Using npm: npm install

3. ## Set up environment variables:
- Create a .env.local file in the root directory and add your API keys:
OPENAI_API_KEY=your_openai_api_key

- Go to weather.js file:
Change the variable const API_KEY in line 3 to your_weatherapi_key

4. ## Run the development server:
npm run dev

5. ## Open the app:
Open http://localhost:3000 in your browser to see the application in action.

# What I Did
- **Weather Data Integration**: Integrated with the OpenWeatherMap API to fetch real-time weather data and a 5-day forecast based on the user's input or location.

- **Location Services**: Utilized the browser's geolocation API to retrieve the user's coordinates and fetch corresponding weather data. Used the Google Maps Geocoding API to get the city.

- **AI-Generated Summaries**: Implemented an AI-powered weather summary feature using the OpenAI API to provide insightful and intelligent summaries of the current weather conditions.

- **Responsive UI Design**: Designed the user interface with Material-UI components to ensure a clean, responsive, and user-friendly experience across devices.

- **Custom Utility Functions**: Created utility functions to handle API requests, data processing, and error handling, ensuring smooth data flow and robust performance.
