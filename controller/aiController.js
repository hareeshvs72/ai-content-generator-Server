require("dotenv").config();
const OpenAI = require("openai");

console.log("Loaded Key:", process.env.GEMINI_API_KEY);

const Ai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

exports.generateArticle = async (req, res) => {
  console.log("Inside generateArticle controller");
  
  try {
    const { prompt, length } = req.body;

    const response = await Ai.chat.completions.create({
      model: "gemini-2.0-flash",   // ⭐ Best model for article generation
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: Math.min(length, 900), // Prevent rate-limit
    });

    const article = response.choices[0].message.content;

    res.status(200).json({ article });

  } catch (error) {
    console.error("AI ERROR:", error);
    res.status(500).json({ error: "AI request failed", details: error.message });
  }
};
