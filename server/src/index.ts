import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { fact_check_withAI } from "./services/factCheck.js";
import { get_youtubetranscript } from "./services/getTranscript.js";
import { find_conclusion, save_conclusion } from "./services/databaseAction.js";
import { youtube_parser } from "./services/ytParser.js";
import { getVideoDetails } from "./services/getVideoDetails.js";
import { cors } from "hono/cors";

const app = new Hono();

// log each request in production
app.use(logger());

// get rid of cors
app.use(
    "/*",
    cors({
        origin: "http://localhost:5173",
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
    // console.log(vid_id)
    if (!vid_id ) {
        // invalid url
        return c.text("Invalid URL");
    } else {
        // valid url
        // check ID against the DB
        const conclusion = await find_conclusion(vid_id);
        console.log("Got data from DB");
        // if result is found
        if (conclusion) {
            return c.json(conclusion);
        }
        // if not found
        // fetch the youtube transcribe

        // try youtube transcript first
        const transcript = await get_youtubetranscript(vid_id);
        if (!transcript) {
            // try youtube caption as fallback (not working for now)
            // const captions = await get_youtubecaption(vid_id);
            // return c.json(captions);
            console.log("no transcript?");
            return c.json(null);
        } else {
            // successfully got transcript
            // send transcript to AI for fact checking

            const conclusion = await fact_check_withAI(transcript);
            console.log("Fact checked from AI");

            // if AI responses right push it to DB and send to user
            if (conclusion) {
                console.log("Saving details to DB");
                await save_conclusion(vid_id, conclusion);
                return c.json(conclusion);
            } else {
                // otherwise return null.
                console.log("is it here wtf");
                return c.json(null);
            }
        }
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
