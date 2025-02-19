// import { useLoaderData } from "@remix-run/react";
// import { json } from "@remix-run/node";
// import { prisma } from "~/db.server";
// import { requireUserSession } from "~/utils/session.server";
// import { fetchWeather } from "~/utils/weather.server";
// import { Card, CardContent, Typography, Container, Grid } from "@mui/material";

// export async function loader({ request }: { request: Request }) {
//   const userId = await requireUserSession(request);
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     include: { cities: true },
//   });

//   if (!user) return json({ error: "User not found" }, { status: 404 });

//   const weatherData = await Promise.all(user.cities.map((city) => fetchWeather(city.name)));

//   return json({ cities: user.cities, weatherData });
// }

// export default function WeatherPage() {
//   const { cities, weatherData } = useLoaderData<typeof loader>();

//   return (
//     <Container>
//       <Typography variant="h4">Your Favorite Cities' Weather</Typography>
//       <Grid container spacing={2}>
//         {cities.map((city, index) => (
//           <Grid item xs={12} md={6} key={city.id}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h5">{city.name}</Typography>
//                 <Typography>{weatherData[index].current.condition.text}</Typography>
//                 <img src={weatherData[index].current.condition.icon} alt="Weather" />
//                 <Typography>Temp: {weatherData[index].current.temp_c}°C</Typography>
//                 <Typography>Humidity: {weatherData[index].current.humidity}%</Typography>
//                 <Typography>Precipitation: {weatherData[index].current.precip_mm}mm</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// }
