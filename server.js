// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load Gemini Key
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ Missing GEMINI_API_KEY in environment variables!");
}

const genAI = new GoogleGenerativeAI(apiKey);

// ---------------------------
//  MAIN AI ROUTE
// ---------------------------
app.post("/api/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("🔍 Incoming Prompt:", prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);

    const text = result.response.text();
    return res.json({ reply: text });
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    return res.status(500).json({ error: "Gemini backend failure" });
  }
});

// ---------------------------
//  ROOT TEST ENDPOINT
// ---------------------------
app.get("/", (req, res) => {
  res.send("Backend OK — Gemini API Connected 🚀");
});

// ---------------------------
//  START SERVER
// ---------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
