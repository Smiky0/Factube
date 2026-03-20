import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { supabase } from "./lib/supabaseClient.js";
import { fetchTranscript } from "youtube-transcript-plus";
import { fact_check_withGemini } from "./lib/geminiClient.js";
import { fact_check_withGroq } from "./lib/groqClient.js";
import { fact_check_withOpenRouter } from "./lib/openRouterClient.js";

const app = new Hono();

// log each request in production
app.use(logger());

// health check
app.get("/health", (c) => {
    return c.text("Service is UP and RUNNING.");
});

// get video ID from youtube URL
function youtube_parser(url: string) {
    var regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
}

// get the youtube conclusion if video id is available.
async function find_conclusion(video_id: string) {
    const { data, error } = await supabase
        .from("youtube_facts")
        .select("conclusion")
        .eq("video_id", video_id)
        .single();
    if (error) {
        return null;
    }
    return data;
}

async function save_conclusion(video_id: string, conclusion: string) {
    const { data, error } = await supabase.from("youtube_facts").insert({
        video_id: video_id,
        conclusion: conclusion,
    });
    console.log("data: ", data);
    console.log("error: ", error);
    return error ? null : data;
}

// get the youtube transcript
async function get_youtubetranscript(video_id: string) {
    try {
        const transcript = await fetchTranscript(video_id);
        const text = transcript.map((t) => t.text).join(" ");
        // console.log(text);
        return text;
    } catch (err) {
        console.error("Caption fetch failed:", err);
        return null;
    }
}

// third party libraries are cooked none of them can fetch data rn.
// async function get_youtubecaption(video_id: string) {
//     const yt = await Innertube.create();
//     const info = await yt.getInfo(video_id);
//     const transcriptData = await info.getTranscript();

//     const segments =
//         transcriptData?.transcript?.content?.body?.initial_segments;
//     if (!segments) return null;

//     const text = segments.map((s: any) => s.snippet.text).join(" ");
//     return text;
// }

// send the text transcript to AI agent along with video URL and ask to fact check
async function fact_check_withAI(transcript: string) {
    const geminiResponse = await fact_check_withGemini(transcript);
    if (!geminiResponse) {
        const groqResponse = await fact_check_withGroq(transcript);
        if (!groqResponse) {
            const openrouterResponse =
                await fact_check_withOpenRouter(transcript);
            if (!openrouterResponse) {
                return null;
            } else {
                return openrouterResponse;
            }
        } else {
            return groqResponse;
        }
    } else {
        return geminiResponse;
    }
}

// check in DB for result.
app.post("/url", async (c) => {
    const query = c.req.query("q");
    const vid_id = query ? youtube_parser(query) : undefined;
    // console.log(vid_id)
    if (!vid_id || !query) {
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
