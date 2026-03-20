import "dotenv/config";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "../prompt.js";
import { USER_PROMPT } from "../prompt.js";

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export async function fact_check_withOpenRouter(
    transcript: string,
) {
    const response = await client.chat.completions.create({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: USER_PROMPT(transcript) },
        ],
    });
    if (response) {
        console.log(response.choices[0].message.content);
        return response.choices[0].message.content;
    } else {
        console.log("Open Router couldn't fact check.");
        return null;
    }
}
