import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompt.js";
import { USER_PROMPT } from "./prompt.js";
import { webSearch } from "./webSearch.js";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export async function fact_check_withGemini(transcript: string) {
    try {
        // Extract key claims for web search
        const claimsPattern =
            /(?:claims?|states?|says?|according to|reportedly)[\s:]*([^.!?]+[.!?])/gi;
        const matches = transcript.match(claimsPattern) || [];
        let searchContext = "";

        // Search for the first 3-5 major claims to get context
        const keyClaims = matches.slice(0, 5);
        if (keyClaims.length > 0) {
            console.log(
                `Searching web for context on ${keyClaims.length} claims...`,
            );
            const searchResults: string[] = [];

            for (const claim of keyClaims) {
                const cleanClaim = claim
                    .replace(
                        /^(?:claims?|states?|says?|according to|reportedly)\s*:?\s*/i,
                        "",
                    )
                    .slice(0, 100); // Limit length

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

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                temperature: 0.1,
                thinkingConfig: {
                    thinkingBudget: 1024,
                },
                tools: [{ googleSearch: {} }],
            },
            contents: USER_PROMPT(transcript, searchContext),
        });

        if (response) {
            return response.text;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Gemini fact-checking error:", error);
        throw error;
    }
}
