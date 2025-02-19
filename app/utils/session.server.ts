import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secrets: [process.env.SESSION_SECRET!],
    secure: true,
    sameSite: "lax",
    httpOnly: true,
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function requireUserSession(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  if (!userId) throw new Response("Unauthorized", { status: 401 });
  return userId;
}
