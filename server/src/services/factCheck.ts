import { fact_check_withGemini } from "../lib/geminiClient.js";
import { fact_check_withGroq } from "../lib/groqClient.js";
import { fact_check_withOpenRouter } from "../lib/openRouterClient.js";

// send the text transcript to AI agent along with video URL and ask to fact check
export async function fact_check_withAI(transcript: string) {
    // Try Gemini first
    try {
        const geminiResponse = await fact_check_withGemini(transcript);
        if (geminiResponse) {
            console.log("✓ Fact-checking with Gemini succeeded");
            return geminiResponse;
        }
    } catch (error) {
        console.warn("✗ Gemini failed, trying Groq...", error);
    }

    // Fallback to Groq
    try {
        const groqResponse = await fact_check_withGroq(transcript);
        if (groqResponse) {
            console.log("✓ Fact-checking with Groq succeeded");
            return groqResponse;
        }
    } catch (error) {
        console.warn("✗ Groq failed, trying OpenRouter...", error);
    }

    // Final fallback to OpenRouter
    try {
        const openrouterResponse = await fact_check_withOpenRouter(transcript);
        if (openrouterResponse) {
            console.log("✓ Fact-checking with OpenRouter succeeded");
            return openrouterResponse;
        }
    } catch (error) {
        console.error("✗ OpenRouter failed", error);
    }

    // All providers failed
    console.error("✗ All AI providers failed for fact-checking");
    return null;
}
