/**
 * Tests for the JSA photo scraper.
 * Mocks fetch so tests run offline — no real network calls made.
 */

import { scrapeRikishiPhoto, fetchWikipediaPhoto } from "./jsa";

function makeFetchResponse(ok: boolean, json: object = {}, text = "") {
  return Promise.resolve({
    ok,
    status: ok ? 200 : 404,
    json: () => Promise.resolve(json),
    text: () => Promise.resolve(text),
  } as Response);
}

describe("scrapeRikishiPhoto", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => jest.restoreAllMocks());

  it("returns the first reachable direct JSA URL", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      await makeFetchResponse(true)
    );
    const result = await scrapeRikishiPhoto(12345);
    expect(result).toMatch(/sumo\.or\.jp\/image\/rikishi/);
  });

  it("returns null when all candidates are unreachable", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      await makeFetchResponse(false)
    );
    const result = await scrapeRikishiPhoto(99999);
    expect(result).toBeNull();
  });
});

describe("fetchWikipediaPhoto", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => jest.restoreAllMocks());

  it("returns thumbnail URL when Wikipedia has one and it is reachable", async () => {
    const thumbnailUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/test.jpg";

    (global.fetch as jest.Mock)
      // First call: Wikipedia API returns thumbnail
      .mockResolvedValueOnce(await makeFetchResponse(true, { thumbnail: { source: thumbnailUrl } }))
      // Second call: HEAD check on thumbnail URL succeeds
      .mockResolvedValueOnce(await makeFetchResponse(true));

    const result = await fetchWikipediaPhoto("Terunofuji");
    expect(result).toBe(thumbnailUrl);
  });

  it("returns null when Wikipedia returns no thumbnail field", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      await makeFetchResponse(true, {})
    );
    const result = await fetchWikipediaPhoto("UnknownRikishi");
    expect(result).toBeNull();
  });

  it("returns null when Wikipedia API returns 404", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(
      await makeFetchResponse(false)
    );
    const result = await fetchWikipediaPhoto("NoSuchRikishi");
    expect(result).toBeNull();
  });
});
