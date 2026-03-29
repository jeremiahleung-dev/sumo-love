const YT_API_BASE = "https://www.googleapis.com/youtube/v3";
const JSA_CHANNEL_ID = "UCkBSqGbm6IQ2sGIBMQbJx0Q"; // Official JSA YouTube channel

export interface HighlightResult {
  videoId: string;
  url: string;
  title: string;
}

/**
 * Searches the JSA YouTube channel for a match highlight.
 * Requires YOUTUBE_API_KEY env var.
 * Returns null when no API key is configured (falls back gracefully).
 */
export async function findMatchHighlight(
  eastShikona: string,
  westShikona: string,
  bashoId: string
): Promise<HighlightResult | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const year = bashoId.slice(0, 4);
  const query = `${eastShikona} ${westShikona} ${year}`;

  try {
    const params = new URLSearchParams({
      key: apiKey,
      channelId: JSA_CHANNEL_ID,
      q: query,
      type: "video",
      maxResults: "1",
      order: "relevance",
      part: "snippet",
    });

    const res = await fetch(`${YT_API_BASE}/search?${params}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      items?: Array<{ id: { videoId: string }; snippet: { title: string } }>;
    };

    const item = data.items?.[0];
    if (!item) return null;

    return {
      videoId: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      title: item.snippet.title,
    };
  } catch {
    return null;
  }
}
