// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env");
  process.exit(1);
}

// 🔐 CORS: update these origins with your actual frontend URLs
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local frontend
      // "https://YOUR-USERNAME.github.io",
      // "https://YOUR-USERNAME.github.io/student-assistant-ai",
    ],
  })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Student Assistant AI backend running" });
});

// Main AI endpoint
app.post("/api/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "prompt is required" });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({ error: "Prompt too long" });
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini error:", errText);
      return res.status(500).json({ error: "Gemini API error", details: errText });
    }

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I could not generate a response. Please try again.";

    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
