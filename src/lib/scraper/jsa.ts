import * as cheerio from "cheerio";
import { createHash } from "crypto";

const JSA_BASE = "https://www.sumo.or.jp";

// MD5 hash of JSA's "NO PHOTO" placeholder (15,931 bytes, same file for all wrestlers without photos)
const JSA_PLACEHOLDER_HASH = "726a2354b01656601eb866b2c7191e14";

async function isPlaceholder(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return true;
    const buf = await res.arrayBuffer();
    const hash = createHash("md5").update(Buffer.from(buf)).digest("hex");
    return hash === JSA_PLACEHOLDER_HASH;
  } catch {
    return true;
  }
}

/**
 * Scrapes the JSA English data profile page for a rikishi photo.
 * The correct URL pattern is EnSumoDataRikishi/profile/{nskId}/
 * Photos live at /img/sumo_data/rikishi/270x474/{photo_id}.jpg —
 * the photo_id differs from nskId, so we must scrape to find it.
 */
async function scrapeJSADataProfile(nskId: number): Promise<string | null> {
  try {
    const url = `${JSA_BASE}/EnSumoDataRikishi/profile/${nskId}/`;
    const res = await fetch(url, {
      headers: { "User-Agent": "sumo-love/1.0 (educational sumo tracker)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    // Find any img whose src contains the sumo_data rikishi path
    const selectors = [
      'img[src*="sumo_data/rikishi"]',
      'img[src*="/img/rikishi"]',
      'img[src*="rikishi"]',
      'meta[property="og:image"]',
    ];

    for (const selector of selectors) {
      const el = $(selector).first();
      const src = el.attr("src") ?? el.attr("content");
      if (src) {
        const resolved = src.startsWith("http") ? src : `${JSA_BASE}${src}`;
        // Reject JSA's placeholder — download and hash-check
        if (await isPlaceholder(resolved)) return null;
        return resolved;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Main entry point for JSA photos.
 * Scrapes the full-res data profile page. Returns null if JSA has no real photo.
 */
export async function scrapeRikishiPhoto(nskId: number): Promise<string | null> {
  return scrapeJSADataProfile(nskId);
}

/**
 * Fetches a rikishi photo from Wikipedia by their English shikona.
 * Used as a last resort when JSA has no photo.
 */
export async function fetchWikipediaPhoto(shikonaEn: string): Promise<string | null> {
  const candidates = [shikonaEn, `${shikonaEn}_(sumo)`];
  for (const title of candidates) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { signal: AbortSignal.timeout(6000) }
      );
      if (!res.ok) continue;
      const data = (await res.json()) as { thumbnail?: { source: string } };
      const src = data.thumbnail?.source;
      if (src) return src;
    } catch {
      // try next candidate
    }
  }
  return null;
}

/**
 * Scrapes the JSA site for the current active basho ID in "YYYYMM" format.
 */
export async function scrapeCurrentBashoId(): Promise<string | null> {
  try {
    const url = `${JSA_BASE}/EnHonbashoMain/`;
    const res = await fetch(url, {
      headers: { "User-Agent": "sumo-love/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    const canonical = $('link[rel="canonical"]').attr("href") ?? "";
    const match = canonical.match(/(\d{6})/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
