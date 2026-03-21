import { supabase } from "../lib/supabaseClient.js";

// get the youtube conclusion if video id is available.
export async function find_conclusion(video_id: string) {
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

// save AI conclusion to DB
export async function save_conclusion(video_id: string, conclusion: string) {
    const { data, error } = await supabase.from("youtube_facts").insert({
        video_id: video_id,
        conclusion: conclusion,
    });
    console.log("data: ", data);
    console.log("error: ", error);
    return error ? null : data;
}
