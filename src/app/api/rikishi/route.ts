import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const division = searchParams.get("division");
  const search = searchParams.get("q");

  const rikishi = await db.rikishi.findMany({
    where: {
      ...(division ? { division } : {}),
      ...(search
        ? {
            OR: [
              { shikonaEn: { contains: search, mode: "insensitive" } },
              { shikona: { contains: search } },
              { heya: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { currentRank: "asc" },
    include: {
      bashoEntries: {
        orderBy: { basho: { sumoApiId: "desc" } },
        take: 1,
        include: { basho: true },
      },
    },
  });

  return NextResponse.json(rikishi);
}
