const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.G_API);

async function aiService(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return { reply: text };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { error: "Something went wrong with Gemini API" };
  }
}

module.exports = aiService;