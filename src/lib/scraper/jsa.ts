import * as cheerio from "cheerio";

const JSA_BASE = "https://www.sumo.or.jp";

/**
 * Scrapes the JSA English site for rikishi photo URLs by their NSK ID.
 * Falls back gracefully when the page structure changes.
 */
export async function scrapeRikishiPhoto(
  nskId: number
): Promise<string | null> {
  try {
    const url = `${JSA_BASE}/EnRikishiMain/0/0/profile/${nskId}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "sumo-love/1.0 (educational sumo tracker)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    // JSA profile pages put the main photo in .rikishi-photo or similar
    const imgEl = $(".mdl-rikishi-prof__photo img, .rikishi-photo img").first();
    const src = imgEl.attr("src");
    if (!src) return null;

    return src.startsWith("http") ? src : `${JSA_BASE}${src}`;
  } catch {
    return null;
  }
}

/**
 * Fetches a rikishi photo from Wikipedia by their English shikona.
 * Tries the name directly, then with "(sumo)" disambiguation.
 */
export async function fetchWikipediaPhoto(
  shikonaEn: string
): Promise<string | null> {
  const candidates = [shikonaEn, `${shikonaEn}_(sumo)`];
  for (const title of candidates) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { signal: AbortSignal.timeout(6000) }
      );
      if (!res.ok) continue;
      const data = await res.json() as { thumbnail?: { source: string } };
      if (data.thumbnail?.source) return data.thumbnail.source;
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

    // Extract bashoId from canonical link or meta tags
    const canonical = $('link[rel="canonical"]').attr("href") ?? "";
    const match = canonical.match(/(\d{6})/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
