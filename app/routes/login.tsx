import { Form, redirect } from "@remix-run/react";
import { json } from "@remix-run/node";
import { prisma } from "~/db.server";
import { sessionStorage } from "~/utils/session.server";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || user.password !== password) {
    return json({ error: "Invalid login" }, { status: 401 });
  }

  const session = await sessionStorage.getSession();
  session.set("userId", user.id);
  return redirect("/home", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export default function LoginPage() {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 3, border: '1px solid #ccc', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>Login</Typography>
        <Form method="post">
          <TextField fullWidth label="Username" name="username" margin="normal" required />
          <TextField fullWidth label="Password" name="password" type="password" margin="normal" required />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Login</Button>
        </Form>
      </Box>
    </Container>
  );
}