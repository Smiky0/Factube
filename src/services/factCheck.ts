import { fact_check_withGemini } from "../lib/geminiClient.js";
import { fact_check_withGroq } from "../lib/groqClient.js";
import { fact_check_withOpenRouter } from "../lib/openRouterClient.js";

// send the text transcript to AI agent along with video URL and ask to fact check
export async function fact_check_withAI(transcript: string) {
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
