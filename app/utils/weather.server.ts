const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

export async function fetchWeather(city: string) {
  const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}`);
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}
