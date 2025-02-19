import axios from "axios";

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

export async function fetchWeather(city: string) {
  if (!WEATHER_API_KEY) throw new Error("Missing WEATHER_API_KEY in .env");

  const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Weather API Error:", error.response?.data || error.message);
    throw new Response("Failed to fetch weather data", { status: error.response?.status || 500 });
  }
}
