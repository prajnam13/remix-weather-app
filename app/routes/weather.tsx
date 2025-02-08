import { json } from "@remix-run/node";
import { prisma } from "~/utils/db.server";
import { getSession } from "~/utils/session.server";
import { fetchWeather } from "~/utils/weather.server";

export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { cities: true },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  const weatherData = await Promise.all(
    user.cities.map((city) => fetchWeather(city.name))
  );

  return json({ username: user.username, cities: user.cities, weatherData });
};
