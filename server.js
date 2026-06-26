const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors({
  origin: ["https://flameburni.github.io", "http://localhost:8158"]
}));
app.use(express.json());

app.post("/suggest", async function(req, res) {
  const taskText = req.body.task;
  console.log("Received request for task:", taskText);

  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "identity"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful productivity assistant. Give exactly 3 short, numbered, practical steps to complete this specific task: "${taskText}". Be specific to the task, not generic. Keep each step under 15 words.`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Gemini response received");
    const suggestion = data.candidates[0].content.parts[0].text;
    res.json({ suggestion });

  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Server running on port " + PORT);
});

