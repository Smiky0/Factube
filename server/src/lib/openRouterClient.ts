import "dotenv/config";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./prompt.js";
import { USER_PROMPT } from "./prompt.js";
import { webSearch } from "./webSearch.js";

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export async function fact_check_withOpenRouter(transcript: string) {
    try {
        // Extract key claims for web search
        const claimsPattern =
            /(?:claims?|states?|says?|according to|reportedly)[\s:]*([^.!?]+[.!?])/gi;
        const matches = transcript.match(claimsPattern) || [];
        let searchContext = "";

        // Search for the first 3-5 major claims
        const keyClaims = matches.slice(0, 5);
        if (keyClaims.length > 0) {
            console.log(
                `[OpenRouter] Searching web for context on ${keyClaims.length} claims...`,
            );
            const searchResults: string[] = [];

            for (const claim of keyClaims) {
                const cleanClaim = claim
                    .replace(
                        /^(?:claims?|states?|says?|according to|reportedly)\s*:?\s*/i,
                        "",
                    )
                    .slice(0, 100);

                try {
                    const results = await webSearch(cleanClaim);
                    if (results.length > 0) {
                        searchResults.push(
                            `Claim: "${cleanClaim}"\n` +
                                results
                                    .map(
                                        (r) =>
                                            `- ${r.title}: ${r.snippet.slice(0, 150)}`,
                                    )
                                    .join("\n"),
                        );
                    }
                } catch (err) {
                    console.warn(`Search failed for claim: ${cleanClaim}`, err);
                }
            }

            searchContext = searchResults.join("\n\n");
        }

        const response = await client.chat.completions.create({
            model: "meta-llama/llama-3.1-70b-instruct",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                    role: "user",
                    content: USER_PROMPT(transcript, searchContext),
                },
            ],
        });
        if (response) {
            return response.choices[0].message.content;
        } else {
            return null;
        }
    } catch (error) {
        console.error("OpenRouter fact-checking error:", error);
        throw error;
    }
}
