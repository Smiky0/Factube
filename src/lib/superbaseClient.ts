import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// assuming both will be present
// write edge case later.
if (!supabaseURL && !supabaseAnonKey) {
    throw new Error("Missing supabase environment keys.");
}

export const superbase = createClient(supabaseURL!, supabaseAnonKey!);
