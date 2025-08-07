// gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Replace with your actual Gemini API Key
const G_API = "AIzaSyCn_S5gKWSO2X0Hp6opx3YGSnLvmTl2muA";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(G_API);

// Create a function to run a prompt
async function runGemini(promptText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(promptText);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Response:\n", text);
    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}

// Example usage
runGemini("Explain black holes in simple terms.");
