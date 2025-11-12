import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(bodyParser.json());

// ✅ Replace this with your real Gemini API key
const GEMINI_API_KEY = "AIzaSyDEs7R4JEws5i2QW-xxNk9sfflrCvDlcLY";
const GEMINI_MODEL = "gemini-2.5-flash"; // or gemini-1.5-pro

// __dirname replacement in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve index.html
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Chatbot API route
app.post("/api/message", async (req, res) => {
  const userMsg = req.body.message;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: GEMINI_MODEL,
          contents: [{ role: "user", parts: [{ text: userMsg }] }]
        })
      }
    );

    const data = await response.json();

    // 👇 Print EVERYTHING Gemini sends
    console.log("🔍 FULL Gemini API Response:");
    console.dir(data, { depth: null });

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ Sorry, I couldn’t understand.";

    res.json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ reply: "❌ Error connecting to Gemini API." });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
