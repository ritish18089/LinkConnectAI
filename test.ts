import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Hello",
    });

    console.log("SUCCESS");
    console.log(response.text);
  } catch (err) {
    console.error("ERROR");
    console.error(err);
  }
}

test();