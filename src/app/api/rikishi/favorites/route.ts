import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("ids") ?? "";
  const ids = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json([]);
  }

  const rikishi = await db.rikishi.findMany({
    where: { id: { in: ids } },
    include: {
      bashoEntries: {
        orderBy: { basho: { sumoApiId: "desc" } },
        take: 1,
        include: { basho: true },
      },
    },
  });

  return NextResponse.json(rikishi, {
    headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
  });
}
