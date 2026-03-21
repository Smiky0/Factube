import { fetchTranscript } from "youtube-transcript-plus";

// get the youtube transcript
export async function get_youtubetranscript(video_id: string) {
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

// fallback method
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
