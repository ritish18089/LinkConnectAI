import express from "express";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import multer from "multer";
import mammoth from "mammoth";
import path from "path";
import fs from "fs";
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import Tesseract from 'tesseract.js';
import { parseResume } from './src/services/resumeParser.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail Authentication Failed", error);
  } else {
    console.log("✓ Gmail Connected");
  }
});

const app = express();
const upload = multer({ dest: 'uploads/' });

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log("📁 Created 'uploads/' directory for multer");
}
console.log("🔥 STARTING SERVER.TS WITH PROPER LOGGING AND NO FALLBACKS");
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://link-connect-ai.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());

if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ ERROR: OPENROUTER_API_KEY is missing from your .env file!");
  process.exit(1);
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "LinkConnect AI",
  }
});

const OPENROUTER_MODEL = "google/gemini-2.5-flash";

app.get("/", (_req, res) => {
  res.json({ message: "LinkConnect AI Backend Running (OpenRouter) 🚀" });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running."
  });
});

app.post("/test", (req, res) => {
  console.log("✅ TEST ROUTE HIT");
  res.json({ success: true, message: "Test route working!" });
});

app.get("/api/models", async (_req, res) => {
  try {
    const modelsResponse = await openai.models.list();
    const availableModels = modelsResponse.data.map((m: any) => m.id);
    res.json({ success: true, models: availableModels });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || "Unknown error" });
  }
});

const activeRequests = new Set<string>();

app.post("/api/generate", async (req, res) => {
  const reqId = Math.random().toString(36).substring(2, 9).toUpperCase();
  const timestamp = new Date().toISOString();

  console.log(`\n======================================`);
  console.log(`🔥 [${timestamp}] [REQ: ${reqId}] /api/generate ROUTE HIT`);
  console.log(`Body:`, JSON.stringify(req.body, null, 2));
  console.log(`======================================\n`);

  const requestIdentifier = req.body.profileUrl || req.ip;
  if (activeRequests.has(requestIdentifier)) {
    console.warn(`[${timestamp}] [REQ: ${reqId}] Duplicate request blocked for: ${requestIdentifier}`);
    return res.status(429).json({
      success: false,
      error: "You already have a message generation in progress. Please wait.",
    });
  }

  activeRequests.add(requestIdentifier);

  try {
    const { profileUrl, connected, purpose, tone, length, details } = req.body;

    if (!profileUrl || !purpose || !tone) {
      return res.status(400).json({ success: false, error: "Missing required fields (profileUrl, purpose, tone)." });
    }

    const prompt = `You are an expert LinkedIn networking assistant.
Generate 3 personalized LinkedIn messages AND 1 short connection note.
Profile URL: ${profileUrl}
Already Connected: ${connected}
Purpose: ${purpose}
Tone: ${tone}
Length for messages: ${length}
Extra Details: ${details}

Requirements for Connection Note:
- Must be extremely professional and natural.
- Mention the user's selected purpose.
- NEVER exceed 200 characters.

Return ONLY a valid JSON object matching this exact format, with no markdown formatting or extra text:
{
  "messages": ["Message 1", "Message 2", "Message 3"],
  "connectionNote": "Hi [Name], ...",
  "recommendedMessageIndex": 0,
  "scores": {
    "professionalism": 95,
    "personalization": 93,
    "clarity": 98,
    "replyProbability": 89,
    "spamRisk": "Very Low"
  },
  "icebreaker": "I recently came across your work on...",
  "tips": [
    "Mention one common technology.",
    "Keep below 150 words.",
    "Ask one question."
  ]
}`;

    console.log(`[${timestamp}] [REQ: ${reqId}] Generated Prompt:\n${prompt}\n`);

    console.log(`[${timestamp}] [REQ: ${reqId}] Selected OpenRouter model: ${OPENROUTER_MODEL}`);
    console.log(`[${timestamp}] [REQ: ${reqId}] SDK: openai, Calling OpenRouter API...`);

    let response: any;
    const startTime = Date.now();
    try {
      response = await openai.chat.completions.create({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 2048,
        temperature: 0.7
      });
    } catch (apiError: any) {
      console.error(`\n❌ [${timestamp}] [REQ: ${reqId}] OPENROUTER API ERROR`);
      console.error(`Request:`, { model: OPENROUTER_MODEL, prompt });
      console.error(`Selected model:`, OPENROUTER_MODEL);
      console.error(`SDK version: openai`);
      console.error(`API response:`, apiError?.response || "None");
      console.error(`Full stack trace:`, apiError?.stack || apiError);
      console.error(`---------------------------------------------------\n`);

      return res.status(500).json({
        success: false,
        error: `OpenRouter API Error: ${apiError?.message || JSON.stringify(apiError)}`,
      });
    }

    const duration = Date.now() - startTime;
    console.log(`[${timestamp}] [REQ: ${reqId}] Response Time: ${duration}ms`);

    let text = response.choices[0]?.message?.content || "";
    console.log(`[${timestamp}] [REQ: ${reqId}] Raw OpenRouter Response:\n${text}\n`);

    if (!text || text.trim() === "") {
      return res.status(500).json({ success: false, error: "OpenRouter returned an empty response" });
    }

    let parsed: any;
    try {
      // Remove markdown code blocks safely
      const cleanText = text.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleanText);
      console.log(`[${timestamp}] [REQ: ${reqId}] Successfully parsed JSON:`, JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      console.error(`[${timestamp}] [REQ: ${reqId}] Failed to parse JSON. Cleaned response body was:\n${text}`);
      return res.status(500).json({ success: false, error: "Failed to parse OpenRouter response as JSON. The model may have returned invalid JSON." });
    }

    if (!parsed.messages || !Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      return res.status(500).json({ success: false, error: "OpenRouter response did not contain the expected 'messages' array." });
    }

    const options = parsed.messages;
    const connectionNote = parsed.connectionNote || "I'd love to connect with you to discuss our industry further.";
    const recommendedMessageIndex = parsed.recommendedMessageIndex || 0;
    const scores = parsed.scores || {};
    const icebreaker = parsed.icebreaker || "";
    const tips = parsed.tips || [];

    console.log(`[${timestamp}] [REQ: ${reqId}] ✅ Successfully returning valid AI messages to client.`);

    res.json({
      success: true,
      options,
      connectionNote,
      recommendedMessageIndex,
      scores,
      icebreaker,
      tips
    });
  } catch (error: any) {
    console.error(`\n💥 [${new Date().toISOString()}] [REQ: ${reqId}] UNHANDLED ROUTE ERROR`, error);
    res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error"
    });
  } finally {
    activeRequests.delete(requestIdentifier);
  }
});

app.post("/api/generate-note", async (req, res) => {
  const reqId = Math.random().toString(36).substring(2, 9).toUpperCase();

  try {
    const { profileUrl, connected, purpose, tone, details } = req.body;

    const prompt = `You are an expert LinkedIn networking assistant.
Generate ONLY 1 short connection note (max 200 chars).
Profile URL: ${profileUrl}
Already Connected: ${connected}
Purpose: ${purpose}
Tone: ${tone}
Extra Details: ${details}

Requirements:
- Must be extremely professional and natural.
- Mention the purpose.
- NEVER exceed 200 characters.
- Return ONLY the raw string text, no JSON, no quotes.`;

    let response: any;
    try {
      response = await openai.chat.completions.create({
        model: OPENROUTER_MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048,
        temperature: 0.7
      });
    } catch (apiError: any) {
      console.error(`\n❌ [REQ: ${reqId}] OPENROUTER API ERROR in /api/generate-note`);
      console.error(`Request:`, { model: OPENROUTER_MODEL, prompt });
      console.error(`Selected model:`, OPENROUTER_MODEL);
      console.error(`SDK version: openai`);
      console.error(`API response:`, apiError?.response || "None");
      console.error(`Full stack trace:`, apiError?.stack || apiError);
      console.error(`---------------------------------------------------\n`);
      return res.status(500).json({ success: false, error: `OpenRouter API Error: ${apiError?.message || JSON.stringify(apiError)}` });
    }

    let text = response.choices[0]?.message?.content || "";
    text = text.replace(/`/g, "").replace(/^"|"$/g, "").trim();

    if (!text) {
      return res.status(500).json({ success: false, error: "Generated note is empty" });
    }

    res.json({ success: true, connectionNote: text });
  } catch (error: any) {
    console.error(`[REQ: ${reqId}] Error generating note:`, error);
    res.status(500).json({ success: false, error: error?.message || "Internal Server Error" });
  }
});

// -------------------------------------------------------------
// AI CHAT ENDPOINTS (OPENROUTER)
// -------------------------------------------------------------

app.post("/api/ai/parse-resume", upload.single('resume'), async (req, res) => {
  const reqId = Math.random().toString(36).substring(2, 9).toUpperCase();
  console.log(`\n======================================`);
  console.log(`📄 [REQ: ${reqId}] /api/ai/parse-resume ROUTE HIT`);

  const fileReq = req as any;
  if (!fileReq.file) {
    console.error(`[REQ: ${reqId}] No file uploaded in request.`);
    return res.status(400).json({ success: false, error: "No file uploaded." });
  }

  const filePath = fileReq.file.path;
  const originalName = fileReq.file.originalname;
  const ext = path.extname(originalName).toLowerCase();
  const fileSize = fileReq.file.size;

  console.log(`[REQ: ${reqId}] Uploaded filename: ${originalName}`);
  console.log(`[REQ: ${reqId}] File type: ${fileReq.file.mimetype} (ext: ${ext})`);
  console.log(`[REQ: ${reqId}] File size: ${fileSize} bytes`);
  console.log(`[REQ: ${reqId}] Upload path: ${filePath}`);

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Uploaded file not found on disk at ${filePath}`);
    }

    if (fileSize === 0) {
      throw new Error(`Uploaded file is empty (0 bytes).`);
    }

    const text = await parseResume(filePath, originalName, reqId);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    if (!text || text === "") {
      console.warn(`[REQ: ${reqId}] Parsing result: Empty text extracted.`);
      return res.status(400).json({ success: false, error: "Could not extract any readable text from this file. Ensure it contains text, not just decorative graphics." });
    }

    console.log(`[REQ: ${reqId}] Parsing result: Successfully extracted ${text.length} characters.`);
    res.json({ success: true, text });
  } catch (error: any) {
    console.error(`\n❌ [REQ: ${reqId}] RESUME PARSING ERROR`);
    console.error(`File: ${originalName}`);
    console.error(`Error message: ${error?.message || "Unknown error"}`);
    console.error(`Full stack trace:`, error?.stack || error);
    console.error(`---------------------------------------------------\n`);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    let errorMsg = "Failed to parse file.";
    const lowerMsg = (error.message || "").toLowerCase();

    if (lowerMsg.includes("empty") || lowerMsg.includes("0 bytes")) {
      errorMsg = "PDF is empty.";
    } else if (lowerMsg.includes("password") || lowerMsg.includes("encrypt")) {
      errorMsg = "PDF is password protected.";
    } else if (lowerMsg.includes("invalid pdf") || lowerMsg.includes("corrupt") || lowerMsg.includes("damaged")) {
      errorMsg = "PDF is damaged.";
    } else if (lowerMsg.includes("unzip") || lowerMsg.includes("docx")) {
      errorMsg = "The uploaded DOCX file is invalid or corrupted.";
    } else if (lowerMsg.includes("enoent") || lowerMsg.includes("read")) {
      errorMsg = "Failed to read uploaded file.";
    } else {
      errorMsg = `Failed to parse file: ${error.message}`;
    }

    res.status(500).json({ success: false, error: errorMsg });
  }
});

app.post("/api/ai/generate-title", async (req, res) => {
  const { message } = req.body;
  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ success: false, error: "OPENROUTER_API_KEY is missing." });
  }

  try {
    const prompt = `Generate a very short, maximum 4 word title summarizing this message: "${message}". Do not use quotes in your response.`;
    const response = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 0.7
    });

    const title = response.choices[0]?.message?.content?.trim() || "New Conversation";
    res.json({ success: true, title });
  } catch (error) {
    console.error("Title generation error:", error);
    res.json({ success: true, title: "New Conversation" });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  console.log("\n--------------------------------------------------");
  console.log("➡️ [BACKEND] Received request at /api/ai/chat");

  const { messages, userContext, aiMode = '🌐 Career Advisor' } = req.body;

  if (!process.env.OPENROUTER_API_KEY) {
    console.error("❌ [BACKEND] Missing API key (OPENROUTER_API_KEY).");
    return res.status(500).json({ success: false, error: "OpenRouter API key is missing on the server." });
  }

  // Construct context string
  console.log("ℹ️ [BACKEND] Constructing user context for mode:", aiMode);
  let contextStr = "User is anonymous.";
  if (userContext) {
    contextStr = `User Information:
Name: ${userContext.full_name || 'N/A'}
Job Title: ${userContext.job_title || 'N/A'}
Company: ${userContext.company || 'N/A'}
Industry: ${userContext.industry || 'N/A'}
Headline: ${userContext.headline || 'N/A'}
Skills: ${userContext.skills?.join(', ') || 'N/A'}
`;
  }

  const systemInstruction = `You are an expert ${aiMode}.
You specialize in LinkedIn networking, resume review, career guidance, recruiter outreach, and professional communication.
You MUST ONLY answer questions related to professional networking, careers, resumes, and LinkedIn. If the user asks about other topics, politely refuse.

${contextStr}

Format your responses beautifully using Markdown. Use lists, bold text, and headers where appropriate.`;

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log("ℹ️ [BACKEND] Formatting messages for OpenRouter memory...");
    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content || (m.parts && m.parts[0]?.text) || ""
    }));

    console.log("🚀 [BACKEND] Starting OpenRouter streaming request...");
    const responseStream = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        ...formattedMessages
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 2048
    });

    for await (const chunk of responseStream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        res.write(`data: ${JSON.stringify({ chunk: content })}\n\n`);
      }
    }

    console.log("✅ [BACKEND] OpenRouter streaming complete.");
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (apiError: any) {
    console.error(`\n❌ [BACKEND] OPENROUTER STREAMING API ERROR`);
    console.error(`Request:`, { model: OPENROUTER_MODEL, aiMode });
    console.error(`Selected model:`, OPENROUTER_MODEL);
    console.error(`SDK version: openai`);
    console.error(`API response:`, apiError?.response || "None");
    console.error(`Full stack trace:`, apiError?.stack || apiError);
    console.error(`---------------------------------------------------\n`);
    res.write(`data: ${JSON.stringify({ error: `OpenRouter API Error: ${apiError?.message || JSON.stringify(apiError)}` })}\n\n`);
    res.end();
  }
});
app.post("/api/gd-chat", async (req, res) => {
  try {
    const { topic, messages, nextSpeaker } = req.body;
    const prompt = `You are participating in a group discussion.
Topic: ${topic.title}
Context: ${topic.background}

Participants:
- Moderator: Guides discussion.
- AI Supporter: Argues FOR the topic.
- AI Opposer: Argues AGAINST the topic.
- AI Neutral: Balances views.
- You (Candidate): The human user.

The current transcript is:
${messages.map((m: any) => `${m.speaker}: ${m.content}`).join('\\n')}

It is now ${nextSpeaker}'s turn to speak. 
Generate ONLY the exact words ${nextSpeaker} would say. Do not add quotes around it. Stay in character. Respond directly to the previous speaker. Since this will be spoken aloud using Text-to-Speech, use natural, conversational language. Avoid complex lists, formatting, or extremely long paragraphs. Keep it concise (2-3 spoken sentences).`;

    const response = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.8
    });

    res.json({ success: true, reply: response.choices[0]?.message?.content?.trim() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/gd-evaluate", async (req, res) => {
  try {
    const { topic, messages } = req.body;
    const prompt = `You are an expert HR Moderator evaluating the "You (Candidate)" participant in a Voice-Based Group Discussion.
Topic: ${topic.title}
Transcript (Generated via Speech-to-Text):
${messages.map((m: any) => `${m.speaker}: ${m.content}`).join('\\n')}

Evaluate "You (Candidate)" on Communication Skills, Fluency, Pronunciation (based on transcript accuracy/flow), Confidence, Grammar, Vocabulary, Logical Thinking, Subject Knowledge, Leadership, and Listening Skills. 

Return a JSON object STRICTLY matching this format:
{
  "score": 85,
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "improvementAreas": ["string", "string"],
  "modelAnswer": "string"
}`;

    const response = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.7
    });

    const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
    res.json({ success: true, evaluation: parsed });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/parse-resume", upload.single("resume"), async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded." });
    }
    const filePath = req.file.path;
    const { originalname, mimetype, size } = req.file;
    const ext = path.extname(originalname);

    const text = await parseResume(filePath, originalname, 'SYS');

    fs.unlinkSync(filePath); // Cleanup
    res.json({ success: true, text });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Internal server error during parsing: " + err.message });
  }
});

app.post("/api/analyze-resume", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ success: false, error: "Missing resumeText or jobDescription." });
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) and Senior Tech Recruiter.
Analyze the following resume against the provided job description.

Job Description:
${jobDescription.substring(0, 10000)}

Resume Text:
${resumeText.substring(0, 15000)}

IMPORTANT: Return ONLY a valid JSON object. Do NOT include any markdown formatting, no \`\`\`json or \`\`\` blocks, no explanations, no headers, no comments, and no plain text. Return STRICTLY the JSON object.
Ensure all JSON brackets and commas are valid.

Return a JSON object STRICTLY matching this format:
{
  "atsScore": 85,
  "overallMatch": 80,
  "technicalMatch": 85,
  "softSkillsMatch": 75,
  "experienceMatch": 90,
  "educationMatch": 100,
  "keywordMatch": 70,
  "missingKeywords": ["string"],
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "suggestions": ["string", "string"],
  "checklist": [
    { "item": "string (e.g., Professional Summary)", "passed": true }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1500,
      temperature: 0.7
    });

    const rawContent = response.choices[0]?.message?.content || "{}";
    console.log("Raw AI Response:", rawContent);

    // Clean up response if it contains markdown formatting or extra text
    let cleanText = rawContent.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();

    // Attempt to extract json from text if still mixed
    const jsonStart = cleanText.indexOf("{");
    const jsonEnd = cleanText.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
    }

    console.log("Cleaned Response:", cleanText);

    let parsed: any = {};
    try {
      parsed = JSON.parse(cleanText);
    } catch (parseError: any) {
      console.error("JSON Parse Error in Analyze Resume:", parseError.message);
      console.error("Attempted to parse:", cleanText);
      // Return a graceful error instead of throwing a 500
      return res.json({
        success: false,
        error: "The AI returned an invalid response format. Please try analyzing again.",
        partialData: null
      });
    }

    // Validate required fields and provide defaults
    const safeParsed = {
      atsScore: typeof parsed.atsScore === 'number' ? parsed.atsScore : 0,
      overallMatch: typeof parsed.overallMatch === 'number' ? parsed.overallMatch : 0,
      technicalMatch: typeof parsed.technicalMatch === 'number' ? parsed.technicalMatch : 0,
      softSkillsMatch: typeof parsed.softSkillsMatch === 'number' ? parsed.softSkillsMatch : 0,
      experienceMatch: typeof parsed.experienceMatch === 'number' ? parsed.experienceMatch : 0,
      educationMatch: typeof parsed.educationMatch === 'number' ? parsed.educationMatch : 0,
      keywordMatch: typeof parsed.keywordMatch === 'number' ? parsed.keywordMatch : 0,
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist : []
    };

    res.json({ success: true, data: safeParsed });
  } catch (err: any) {
    console.error("Error in Analyze Resume API:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/hr-chat", async (req, res) => {
  try {
    const { resumeText, messages } = req.body;

    // Only send the last 10 messages to save context/tokens, plus the system prompt
    const recentMessages = messages.slice(-10);

    const prompt = `You are an expert HR Recruiter conducting a 45-minute behavioral interview with a candidate.
Candidate's Resume Text (Use this to personalize questions, but DO NOT mention you are reading it):
${resumeText.substring(0, 3000)} // Truncated to save tokens if it's too long

Rules:
1. Ask ONLY ONE behavioral, situational, or career-oriented HR question at a time.
2. NEVER ask technical coding questions (e.g., Java, SQL, React syntax).
3. The conversation is spoken out loud. Keep your responses conversational, natural, and concise (2-3 sentences max). No bullet points.
4. Listen carefully to the candidate's complete answer and ask relevant follow-up questions based on their response or resume.
5. Do not repeat questions. Maintain a natural, engaging conversation for a 45-minute flow.

Current Transcript:
${recentMessages.map((m: any) => `${m.speaker}: ${m.content}`).join('\\n')}

It is now your turn to speak. Generate ONLY your exact spoken words.`;

    const response = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7
    });

    res.json({ success: true, reply: response.choices[0]?.message?.content?.trim() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/hr-evaluate", async (req, res) => {
  try {
    const { messages } = req.body;

    // Evaluate based on the full transcript
    const prompt = `You are an expert HR Manager evaluating a candidate's performance in a Voice-Based HR Interview.
Transcript (Generated via Speech-to-Text):
${messages.map((m: any) => `${m.speaker}: ${m.content}`).join('\\n')}

Evaluate the candidate on: Communication Skills, Confidence, Fluency, Grammar, Vocabulary, Professionalism, Leadership, Behavioural Responses, Problem Solving, Teamwork, Adaptability, Positive Attitude, and Career Clarity.

Return a JSON object STRICTLY matching this format:
{
  "score": 85,
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "improvementAreas": ["string", "string"],
  "recommendedAnswers": ["string"],
  "interviewReadinessLevel": "Hire Ready" // or "Needs Improvement"
}`;

    const response = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7
    });

    const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
    res.json({ success: true, evaluation: parsed });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// Mock Interview Endpoints
// ==========================================
app.post("/api/mock-interview-chat", async (req, res) => {
  try {
    const {
      candidateDetails,
      messages,
      isInitial
    } = req.body;

    const {
      fullName,
      jobRole,
      experienceLevel,
      interviewType,
      difficulty,
      durationMins,
      resumeText
    } = candidateDetails;

    const prompt = `You are an expert Interviewer conducting a ${difficulty} ${interviewType} for a candidate named ${fullName}.
  The candidate is applying for the role of ${jobRole} and has ${experienceLevel} of experience.
  The interview duration is set for ${durationMins} minutes.
  Candidate's Resume Text (Use this to personalize questions, but DO NOT mention you are reading it):
  ${resumeText ? resumeText.substring(0, 3000) : "No resume provided."}
  
  Instructions:
  1. This is a VOICE-BASED interview. Keep your responses conversational, natural, and concise (under 30 words).
  2. Ask ONE question at a time. Wait for the candidate's answer.
  3. Base your questions on their chosen Job Role (${jobRole}), Experience (${experienceLevel}), Interview Type (${interviewType}), and their Resume.
  ${isInitial
        ? "4. This is the initial greeting. Introduce yourself as the AI Interviewer and ask the first question. DO NOT evaluate anything yet."
        : "4. The candidate has answered. Evaluate their answer subtly in your mind, then ask a relevant follow-up question or move to the next topic. DO NOT introduce yourself again."
      }
  5. Do not repeat questions.
  6. Do not provide a long critique of their answer during the interview; save that for the evaluation report.`;

    const aiMessages = [
      { role: "system", content: prompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    const response = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: aiMessages,
      max_tokens: 200,
      temperature: 0.7
    });

    res.json({ success: true, text: response.choices[0]?.message?.content });
  } catch (err: any) {
    console.error("Mock Interview Chat Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/mock-interview-evaluate", async (req, res) => {
  try {
    const { messages, candidateDetails } = req.body;

    const prompt = `You are an expert Interview Assessor evaluating a candidate's performance in a Voice-Based Mock Interview.
  Candidate Details: Role: ${candidateDetails.jobRole}, Experience: ${candidateDetails.experienceLevel}, Type: ${candidateDetails.interviewType}, Difficulty: ${candidateDetails.difficulty}.
  
  Transcript (Generated via Speech-to-Text):
  ${messages.map((m: any) => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n')}
  
  Evaluate the candidate on: Communication Skills, Confidence, Grammar, Fluency, Vocabulary, Leadership, Problem Solving, Professionalism, Subject Knowledge, Behavioral Skills, and HR Skills.
  
  Return a JSON object STRICTLY matching this format:
  {
    "score": 85,
    "strengths": ["string", "string"],
    "weaknesses": ["string", "string"],
    "improvementAreas": ["string", "string"],
    "recommendedAnswers": ["string"],
    "interviewReadinessLevel": "Hire Ready" // or "Needs Practice", "Excellent"
  }`;

    const response = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7
    });

    const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");
    res.json({ success: true, evaluation: parsed });
  } catch (err: any) {
    console.error("Mock Interview Evaluate Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/generate-readme", async (req, res) => {
  try {
    const { type, data } = req.body;

    let prompt = '';
    if (type === 'profile') {
      prompt = `You are an expert developer helping to write a professional GitHub Profile README.
Generate a stunning, ATS-friendly markdown README based on the following details:
Name: ${data.name}
Tagline: ${data.tagline}
About: ${data.about}
Tech Stack: ${data.skills}
Currently Learning: ${data.learning}
Looking For: ${data.lookingFor}
LinkedIn: ${data.linkedin}
GitHub: ${data.github}
Portfolio: ${data.portfolio}
Achievements: ${data.achievements}

Include:
- A great header with emojis.
- About me section.
- Tech Stack section with badges (using shields.io if possible).
- Connect with me section.
- GitHub stats cards (using github-readme-stats formatting).
Make it look modern, structured, and visually appealing. Output ONLY valid Markdown text, without enclosing it in triple backticks or any other wrapping JSON/text.`;
    } else {
      prompt = `You are an expert developer helping to write a professional GitHub Project README.
Generate a comprehensive, ATS-friendly markdown README based on the following details:
Project Name: ${data.projectName}
Description: ${data.description}
Features: ${data.features}
Tech Stack: ${data.techStack}
Installation: ${data.installation}
Usage: ${data.usage}
API Info: ${data.apiInfo}
Env Vars: ${data.envVars}
License: ${data.license}
Author: ${data.author}
Live Demo: ${data.liveDemo}

Include:
- A great header/banner section.
- Badges for version, license, etc.
- Clear sections for Overview, Features, Tech Stack, Installation, Usage, API documentation, Environment Variables.
- Use emojis and tables where appropriate.
Make it look highly professional and ready to be pushed to GitHub. Output ONLY valid Markdown text, without enclosing it in triple backticks or any other wrapping JSON/text.`;
    }

    const response = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000,
      temperature: 0.7
    });

    let markdownContent = response.choices[0]?.message?.content || "";

    res.json({ success: true, content: markdownContent });
  } catch (err: any) {
    console.error("Readme Generator Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/generate-cover-letter", async (req, res) => {
  try {
    const { data } = req.body;

    const prompt = `You are an expert career coach and professional copywriter.
Generate a highly professional, personalized, and ATS-friendly cover letter based on the following details:

Candidate Details:
- Name: ${data.name || 'Not provided'}
- Phone: ${data.phone || 'Not provided'}
- Email: ${data.email || 'Not provided'}
- LinkedIn: ${data.linkedin || 'Not provided'}
- GitHub: ${data.github || 'Not provided'}
- Portfolio: ${data.portfolio || 'Not provided'}
- Location: ${data.location || 'Not provided'}
- Highest Qualification: ${data.qualification || 'Not provided'}

Target Role:
- Company Name: ${data.companyName || 'Not provided'}
- Job Role / Position: ${data.jobRole || 'Not provided'}

Experience & Skills:
- Years of Experience: ${data.experience || 'Not provided'}
- Key Skills: ${data.skills || 'Not provided'}

Motivation & Additional Info:
- Why interested: ${data.interest || 'Not provided'}
- Additional Information: ${data.additionalInfo || 'Not provided'}

Instructions:
1. Include a professional header with the candidate's contact info, date, and hiring manager greeting.
2. Write a strong opening paragraph that immediately grabs attention and states the position applied for.
3. Write a professional introduction and detail the candidate's skills and experience, directly relating them to the role.
4. Explain why the candidate is a great fit for the role and why they specifically want to join this company.
5. Provide a strong closing paragraph with a call to action.
6. End with a professional sign-off ("Sincerely," etc.) and the candidate's name.
7. Tone should be professional, human-like, engaging, and confident. Avoid generic, robotic language.
8. Output ONLY valid Markdown text, without enclosing it in triple backticks or any other wrapping JSON/text.`;

    const response = await openai.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    });

    let markdownContent = response.choices[0]?.message?.content || "";

    res.json({ success: true, content: markdownContent });
  } catch (err: any) {
    console.error("Cover Letter Generator Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.post("/api/contact", async (req, res) => {
  console.log("✓ Request received");
  try {
    const { name, email, subject, message } = req.body;
    console.log("✓ Request body:", { name, email, subject, message });
    console.log("✓ EMAIL_USER loaded:", process.env.EMAIL_USER);

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ success: false, message: "Missing EMAIL_USER or EMAIL_PASS" });
    }

    // Plain text format as requested
    const emailBody = `----------------------------------------

Name:
${name.trim()}

Email:
${email.trim()}

Subject:
${subject.trim()}

Message:
${message.trim()}

Submitted At:
${new Date().toISOString()}

----------------------------------------`;

    try {
      await transporter.sendMail({
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: "ritish1808@gmail.com",
        replyTo: email,
        subject: `New Contact Form Submission - LinkConnect AI`,
        text: emailBody,
      });
      console.log("✓ sendMail result: Email Sent Successfully");
      res.json({ success: true, message: "Your message has been sent successfully." });
    } catch (emailError: any) {
      console.error("✓ Full error stack:", emailError);
      let errorMessage = "Failed to send email.";
      if (emailError.responseCode === 535) {
        errorMessage = "SMTP Authentication Failed / Invalid App Password";
        console.error("SMTP Authentication Failed", emailError);
      } else if (emailError.code === 'ECONNREFUSED') {
        errorMessage = "Gmail Connection Refused";
        console.error("Email Delivery Failed", emailError);
      } else {
        errorMessage = emailError.message || errorMessage;
        console.error("Email Delivery Failed", emailError);
      }
      return res.status(500).json({ success: false, message: errorMessage });
    }
  } catch (err: any) {
    console.error("✓ Full error stack:", err);
    res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`\n====================================`);
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
  console.log(`Node Version: ${process.version}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'Development'}`);
  console.log(`AI SDK: openai (OpenRouter)`);
  console.log(`====================================\n`);
});
