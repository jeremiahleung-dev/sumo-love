import * as cheerio from "cheerio";

const JSA_BASE = "https://www.sumo.or.jp";

/**
 * Checks whether a URL actually returns an image (HEAD request).
 * Prevents storing broken URLs in the database.
 */
async function isReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Tries to resolve a JSA photo by constructing the URL directly from nskId.
 * JSA serves wrestler photos at predictable paths — no HTML scraping needed.
 * Tries known URL patterns and HEAD-checks each before returning.
 */
async function tryDirectJSAPhoto(nskId: number): Promise<string | null> {
  const candidates = [
    `${JSA_BASE}/img/rikishi/${nskId}.jpg`,
    `${JSA_BASE}/image/rikishi/scaled/200/${nskId}.jpg`,
    `${JSA_BASE}/image/rikishi/${nskId}.jpg`,
  ];
  for (const url of candidates) {
    if (await isReachable(url)) return url;
  }
  return null;
}

/**
 * Falls back to HTML scraping of the JSA English profile page.
 * Tries a broad set of selectors to handle JSA site redesigns.
 */
async function scrapeJSAProfilePage(nskId: number): Promise<string | null> {
  try {
    const url = `${JSA_BASE}/EnRikishiMain/0/0/profile/${nskId}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "sumo-love/1.0 (educational sumo tracker)" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const html = await res.text();
    const $ = cheerio.load(html);

    // Try multiple selectors across JSA site versions
    const selectors = [
      ".mdl-rikishi-prof__photo img",
      ".rikishi-photo img",
      ".rikishiPhoto img",
      ".js-prof-photo img",
      'img[src*="rikishi"]',
      'meta[property="og:image"]',
    ];

    for (const selector of selectors) {
      const el = $(selector).first();
      const src = el.attr("src") ?? el.attr("content");
      if (src) {
        const resolved = src.startsWith("http") ? src : `${JSA_BASE}${src}`;
        if (await isReachable(resolved)) return resolved;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Main entry point for JSA photos.
 * Tries direct URL construction first (faster, no scraping), then falls back to HTML scraping.
 */
export async function scrapeRikishiPhoto(nskId: number): Promise<string | null> {
  return (await tryDirectJSAPhoto(nskId)) ?? (await scrapeJSAProfilePage(nskId));
}

/**
 * Fetches a rikishi photo from Wikipedia by their English shikona.
 * Tries the name directly, then with "(sumo)" disambiguation.
 * HEAD-checks the returned URL before returning it.
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
      if (src && (await isReachable(src))) return src;
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
