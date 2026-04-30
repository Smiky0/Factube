import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { fact_check_withAI } from "./services/factCheck.js";
import { get_youtubetranscript } from "./services/getTranscript.js";
import { find_conclusion, save_conclusion } from "./services/databaseAction.js";
import { getVideoDetails } from "./services/getVideoDetails.js";
import { cors } from "hono/cors";
import { rateLimiter } from "hono-rate-limiter";
const CLIENT_URL = process.env.CLIENT_URL;

const app = new Hono();

// middlewares
// log each request in production
app.use(logger());

// rate limit users by ip
app.use(
    rateLimiter({
        windowMs: 1 * 60 * 1000, // 1 min
        limit: 10, // 10 req/min
        keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "",
    }),
);

// get rid of cors
app.use(
    "/*",
    cors({
        origin: CLIENT_URL || "http://localhost:5173",
        allowMethods: ["GET", "POST", "PUT", "DELETE"],
    }),
);

// health check
app.get("/health", (c) => {
    return c.text("Service is UP and RUNNING.");
});

// home page
app.get("/", (c) => {
    return c.text("Heyooo...");
});

// check video details
app.get("/api/video_details", async (c) => {
    const vid_id = c.req.query("q");
    if (!vid_id) return c.json({ error: "Invalid URL" }, 400);
    try {
        const info = await getVideoDetails(vid_id);
        return c.json(info);
    } catch {
        return c.json({ error: "failed to details" }, 500);
    }
});

// get AI fact check.
app.post("/url", async (c) => {
    const vid_id = c.req.query("q");
    if (!vid_id) {
        return c.json({ error: "Invalid URL" }, 400);
    }

    try {
        // check ID against the DB
        const conclusion = await find_conclusion(vid_id);
        if (conclusion) {
            return c.json(conclusion);
        }

        // fetch the youtube transcript
        const transcript = await get_youtubetranscript(vid_id);
        if (!transcript) {
            return c.json({ error: "No transcript available" }, 404);
        }

        // send transcript to AI for fact checking
        const aiConclusion = await fact_check_withAI(transcript);
        if (!aiConclusion) {
            return c.json({ error: "AI fact-checking failed" }, 500);
        }

        // save to DB and return
        await save_conclusion(vid_id, aiConclusion);
        return c.json({ conclusion: aiConclusion });
    } catch (error) {
        console.error("Error in fact-checking endpoint:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});

// wrong url
app.notFound((c) => {
    return c.text("Page not found", 404);
});

app.onError((err, c) => {
    console.log(err);
    return c.text("Caused an uncaught error.", 500);
});

serve(
    {
        fetch: app.fetch,
        port: 3000,
    },
    (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
    },
);
