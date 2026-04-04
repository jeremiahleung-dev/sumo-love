import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { syncAll } from "@/lib/sync";

export const maxDuration = 300; // 5 min — needed for full sync on Vercel

export async function POST(req: Request) {
  // Verify cron secret to prevent unauthorized syncs
  const secret = req.headers.get("x-cron-secret");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncAll();
    revalidatePath("/");
    revalidatePath("/rikishi");
    revalidatePath("/basho");
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("Sync failed:", err);
    return NextResponse.json(
      { error: "Sync failed", detail: String(err) },
      { status: 500 }
    );
  }
}
