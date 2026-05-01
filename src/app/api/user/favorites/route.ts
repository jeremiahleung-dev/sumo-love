import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ ids: [] });

  const favs = await db.favorite.findMany({
    where: { userId: session.user.id },
    select: { rikishiId: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ids: favs.map((f) => f.rikishiId) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rikishiId } = await req.json();
  if (!rikishiId) return NextResponse.json({ error: "Missing rikishiId" }, { status: 400 });

  await db.favorite.upsert({
    where: { userId_rikishiId: { userId: session.user.id, rikishiId } },
    update: {},
    create: { userId: session.user.id, rikishiId },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { rikishiId } = await req.json();
  if (!rikishiId) return NextResponse.json({ error: "Missing rikishiId" }, { status: 400 });

  await db.favorite.deleteMany({
    where: { userId: session.user.id, rikishiId },
  });
  return NextResponse.json({ ok: true });
}
