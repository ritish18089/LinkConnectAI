import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: 'Say hi'
    });
    console.log('SUCCESS:', response.text);
  } catch (e: any) {
    console.log('ERROR STATUS:', e.status);
    console.log('ERROR MSG:', e.message);
  }
}
test();
