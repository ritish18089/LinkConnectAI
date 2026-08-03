import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function main() {
  for await (const model of await ai.models.list()) {
    console.log(model.name);
  }
}

main();