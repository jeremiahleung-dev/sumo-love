import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { email, password, name } = await req.json() as {
    email?: string;
    password?: string;
    name?: string;
  };

  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "An account with that email already exists" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 12);
  await db.user.create({ data: { email, password: hashed, name: name ?? null } });

  return Response.json({ ok: true });
}
