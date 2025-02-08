import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET || "default_secret";

const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return storage.getSession(cookie);
}

export async function requireUserSession(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  if (!userId) throw redirect("/login");
  return userId;
}

export function commitSession(session: any) {
  return storage.commitSession(session);
}

export function destroySession(session: any) {
  return storage.destroySession(session);
}
