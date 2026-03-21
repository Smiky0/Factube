import "dotenv/config";
import OpenAI from "openai";
import { SYSTEM_PROMPT, USER_PROMPT } from "./prompt.js";
const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function fact_check_withGroq(transcript: string) {
    const response = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: USER_PROMPT(transcript) },
        ],
    });
    if (response) {
        // console.log(response.choices[0].message.content);
        return response.choices[0].message.content;
    } else {
        // console.log("Groq couldn't fact check.");
        return null;
    }
}
