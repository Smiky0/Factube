import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../prompt.js";
import { USER_PROMPT } from "../prompt.js";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

export async function fact_check_withGemini(transcript: string) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: "application/json",
            temperature: 0.8,
            thinkingConfig: {
                thinkingBudget: 0,
            },
        },
        contents: USER_PROMPT(transcript),
    });
    if (response) {
        console.log(response.text);
        return response.text;
    } else {
        return null;
    }
}
