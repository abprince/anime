import { Hono } from "hono";
import { HiAnime } from "aniwatch";
import { cache } from "../config/cache.js";
import type { ServerContext } from "../config/context.js";

const hianime = new HiAnime.Scraper();
const hianimeRouter = new Hono<ServerContext>();

// /api/v2/hianime
hianimeRouter.get("/", (c) => c.redirect("/", 301));

// /api/v2/hianime/home
hianimeRouter.get("/home", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");

    const data = await cache.getOrSet<HiAnime.ScrapedHomePage>(
        hianime.getHomePage,
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/azlist/{sortOption}?page={page}
hianimeRouter.get("/azlist/:sortOption", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");

    const sortOption = decodeURIComponent(
        c.req.param("sortOption").trim().toLowerCase()
    ) as HiAnime.AZListSortOptions;
    const page: number =
        Number(decodeURIComponent(c.req.query("page") || "")) || 1;

    const data = await cache.getOrSet<HiAnime.ScrapedAnimeAZList>(
        async () => hianime.getAZList(sortOption, page),
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/qtip/{animeId}
hianimeRouter.get("/qtip/:animeId", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");
    const animeId = decodeURIComponent(c.req.param("animeId").trim());

    const data = await cache.getOrSet<HiAnime.ScrapedAnimeQtipInfo>(
        async () => hianime.getQtipInfo(animeId),
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/category/{name}?page={page}
hianimeRouter.get("/category/:name", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");
    const categoryName = decodeURIComponent(
        c.req.param("name").trim()
    ) as HiAnime.AnimeCategories;
    const page: number =
        Number(decodeURIComponent(c.req.query("page") || "")) || 1;

    const data = await cache.getOrSet<HiAnime.ScrapedAnimeCategory>(
        async () => hianime.getCategoryAnime(categoryName, page),
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/genre/{name}?page={page}
hianimeRouter.get("/genre/:name", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");
    const genreName = decodeURIComponent(c.req.param("name").trim());
    const page: number =
        Number(decodeURIComponent(c.req.query("page") || "")) || 1;

    const data = await cache.getOrSet<HiAnime.ScrapedGenreAnime>(
        async () => hianime.getGenreAnime(genreName, page),
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/producer/{name}?page={page}
hianimeRouter.get("/producer/:name", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");
    const producerName = decodeURIComponent(c.req.param("name").trim());
    const page: number =
        Number(decodeURIComponent(c.req.query("page") || "")) || 1;

    const data = await cache.getOrSet<HiAnime.ScrapedProducerAnime>(
        async () => hianime.getProducerAnimes(producerName, page),
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/schedule?date={date}&tzOffset={tzOffset}
hianimeRouter.get("/schedule", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");

    const date = decodeURIComponent(c.req.query("date") || "");
    let tzOffset = Number(
        decodeURIComponent(c.req.query("tzOffset") || "-330")
    );
    tzOffset = isNaN(tzOffset) ? -330 : tzOffset;

    const data = await cache.getOrSet<HiAnime.ScrapedEstimatedSchedule>(
        async () => hianime.getEstimatedSchedule(date, tzOffset),
        `${cacheConfig.key}_${tzOffset}`,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/search?q={query}&page={page}&filters={...filters}
hianimeRouter.get("/search", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");
    let { q: query, page, ...filters } = c.req.query();

    query = decodeURIComponent(query || "");
    const pageNo = Number(decodeURIComponent(page || "")) || 1;

    const data = await cache.getOrSet<HiAnime.ScrapedAnimeSearchResult>(
        async () => hianime.search(query, pageNo, filters),
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/search/suggestion?q={query}
hianimeRouter.get("/search/suggestion", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");
    const query = decodeURIComponent(c.req.query("q") || "");

    const data = await cache.getOrSet<HiAnime.ScrapedAnimeSearchSuggestion>(
        async () => hianime.searchSuggestions(query),
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/anime/{animeId}
hianimeRouter.get("/anime/:animeId", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");
    const animeId = decodeURIComponent(c.req.param("animeId").trim());

    const data = await cache.getOrSet<HiAnime.ScrapedAnimeAboutInfo>(
        async () => hianime.getInfo(animeId),
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/episode/servers?animeEpisodeId={id}
hianimeRouter.get("/episode/servers", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");
    const animeEpisodeId = decodeURIComponent(
        c.req.query("animeEpisodeId") || ""
    );

    const data = await cache.getOrSet<HiAnime.ScrapedEpisodeServers>(
        async () => hianime.getEpisodeServers(animeEpisodeId),
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/episode/sources?animeEpisodeId={episodeId}&server={server}&category={category}
hianimeRouter.get("/episode/sources", async (c) => {
  const cacheConfig = c.get("CACHE_CONFIG");
  const animeEpisodeId = decodeURIComponent(c.req.query("animeEpisodeId") || "");
  const server = decodeURIComponent(c.req.query("server") || HiAnime.Servers.VidStreaming) as HiAnime.AnimeServers;
  const category = decodeURIComponent(c.req.query("category") || "sub") as "sub" | "dub" | "raw";

  const data = await cache.getOrSet<HiAnime.ScrapedAnimeEpisodesSources>(
    async () => {
      // Fetch original sources
      const sources = await hianime.getEpisodeSources(animeEpisodeId, server, category);

      // Add proxied URLs for HLS streams
      if (sources?.sources) {
        sources.sources = sources.sources.map((source) => ({
          ...source,
          // Only proxy HLS streams
          proxiedUrl: source.type === "hls" 
            ? `/api/v2/hianime/proxy-m3u8?url=${encodeURIComponent(source.url)}&referer=${encodeURIComponent(sources.headers?.Referer || "https://megaplay.buzz")}`
            : source.url,
        }));
      }

      return sources;
    },
    cacheConfig.key,
    cacheConfig.duration
  );

  return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/anime/{anime-id}/episodes
hianimeRouter.get("/anime/:animeId/episodes", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");
    const animeId = decodeURIComponent(c.req.param("animeId").trim());

    const data = await cache.getOrSet<HiAnime.ScrapedAnimeEpisodes>(
        async () => hianime.getEpisodes(animeId),
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/anime/{anime-id}/next-episode-schedule
hianimeRouter.get("/anime/:animeId/next-episode-schedule", async (c) => {
    const cacheConfig = c.get("CACHE_CONFIG");
    const animeId = decodeURIComponent(c.req.param("animeId").trim());

    const data = await cache.getOrSet<HiAnime.ScrapedNextEpisodeSchedule>(
        async () => hianime.getNextEpisodeSchedule(animeId),
        cacheConfig.key,
        cacheConfig.duration
    );

    return c.json({ status: 200, data }, { status: 200 });
});

// /api/v2/hianime/proxy-m3u8?url={encodedUrl}&referer={encodedReferer}
hianimeRouter.get("/proxy-m3u8", async (c) => {
  const url = decodeURIComponent(c.req.query("url") || "";
  const referer = decodeURIComponent(c.req.query("referer") || "https://megaplay.buzz");

  if (!url) {
    return c.json({ status: 400, error: "Missing URL parameter" }, 400);
  }

  try {
    const response = await fetch(url, {
      headers: {
        "Referer": referer,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch M3U8: ${response.statusText}`);
    }

    const m3u8Content = await response.text();

    return c.body(m3u8Content, 200, {
      "Content-Type": "application/vnd.apple.mpegurl",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    });
  } catch (error) {
    return c.json(
      { status: 502, error: "Proxy failed (blocked by origin)" },
      502,
    );
  }
});

export { hianimeRouter };
