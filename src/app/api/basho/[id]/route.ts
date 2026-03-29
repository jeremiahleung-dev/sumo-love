import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const basho = await db.basho.findFirst({
    where: { OR: [{ id }, { sumoApiId: id }] },
    include: {
      entries: {
        include: { rikishi: true },
        orderBy: { wins: "desc" },
      },
      matches: {
        include: {
          eastRikishi: true,
          westRikishi: true,
          winner: true,
          kimarite: true,
        },
        orderBy: [{ day: "asc" }],
      },
    },
  });

  if (!basho) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(basho);
}
