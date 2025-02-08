import { useLoaderData, Form } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";
import { requireUserSession, getSession } from "~/utils/session.server";
import { fetchWeather } from "~/utils/weather.server";
import { Button, TextField, Typography, Card, CardContent, Container, Grid } from "@mui/material";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserSession(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { cities: true },
  });

  const weatherData = await Promise.all(user?.cities.map((city) => fetchWeather(city.name)) || []);

  return json({ username: user?.username, cities: user?.cities || [], weatherData });
}

export async function action({ request }: { request: Request }) {
  const userId = await requireUserSession(request);
  const formData = await request.formData();
  const cityName = formData.get("city") as string;

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { cities: true } });
  if (!user || user.cities.length >= 5) return json({ error: "Max 5 cities allowed" });

  await prisma.city.create({ data: { name: cityName, userId } });

  return redirect("/home");
}

export default function HomePage() {
  const { username, cities, weatherData } = useLoaderData();

  return (
    <Container>
      <Typography variant="h4">Welcome to the weather app, {username}!</Typography>
      <Form method="post">
        <TextField name="city" label="Add City" required />
        <Button type="submit">Add</Button>
      </Form>

      <Grid container spacing={2}>
        {cities.map((city, index) => (
          <Grid item xs={12} md={6} key={city.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{city.name}</Typography>
                <Typography>{weatherData[index].current.condition.text}</Typography>
                <img src={weatherData[index].current.condition.icon} alt="Weather" />
                <Typography>Temp: {weatherData[index].current.temp_c}°C</Typography>
                <Typography>Humidity: {weatherData[index].current.humidity}%</Typography>
                <Typography>Precipitation: {weatherData[index].current.precip_mm}mm</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
