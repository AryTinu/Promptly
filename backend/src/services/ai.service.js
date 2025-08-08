require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.G_API);

// Helper: delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getAIResponse(prompt) {
  const models = ["gemini-2.0-flash", "gemini-1.5-pro"]; // ✅ Valid fallbacks
  let lastError = null;

  for (const modelName of models) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🔹 Using model: ${modelName}, attempt ${attempt}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);

        return result.response.text(); // ✅ Return text

      } catch (error) {
        lastError = error;
        const status = error.status || error.code || "";
        const msg = error.message || "";

        // Detect rate limit / quota / overload
        if (
          status === 429 ||
          msg.includes("Too Many Requests") ||
          msg.includes("overloaded") ||
          msg.includes("quota")
        ) {
          const waitTime = attempt * 2000; // exponential-ish backoff
          console.warn(`⚠️ ${msg || status} — retrying in ${waitTime / 1000}s...`);
          await delay(waitTime);
          continue; // retry same model
        }

        console.error(`❌ Failed with model: ${modelName} — ${msg}`);

        // If last attempt for this model, move to next
        if (attempt === 3) break;
      }
    }
  }

  // Throw with original error for debugging
  throw new Error(
    `AI service unavailable after retries. Last error: ${lastError?.message || "Unknown error"}`
  );
}

module.exports = { getAIResponse };
