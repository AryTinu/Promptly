const { getAIResponse } = require("../services/ai.service");

module.exports.getResponse = async (req, res) => {
  try {
    const { code } = req.body; // This can now be *actual code* or a *request*

    // Validate input
    if (!code || typeof code !== "string" || code.trim() === "") {
      return res.status(400).json({ error: "Code or request is required" });
    }

    const trimmed = code.trim();
    const safeInput = trimmed.replace(/```/g, ""); // Remove accidental backticks

    // --- Smart mode detection ---
    const looksLikeCode =
      safeInput.includes("{") ||
      safeInput.includes(";") ||
      /^function\s|\s=>\s|\bconst\b|\blet\b|\bvar\b/.test(safeInput);

    let prompt = "";

    if (looksLikeCode) {
      // REVIEW MODE (your exact 4-point format)
      prompt = `
You are a senior JavaScript code reviewer.
Review the following code and:
1. Point out issues or improvements.
2. Suggest better practices.
3. Format your answer in Markdown.
4. Include syntax-highlighted code examples inside triple backticks.

Code to review:
\`\`\`javascript
${safeInput}
\`\`\`
`;
    } else {
      // CODE GENERATION MODE
      prompt = `
You are an expert JavaScript developer.
Write the requested code in full.
**Your task:**
1. Write the requested code in full — return ONLY the code first inside triple backticks (\`\`\`javascript ... \`\`\`).
2. After the code block, provide a **"Suggestions & Use Cases"** section:
   - Explain why you structured the code this way.
   - Mention practical applications in small points.

Request:
${safeInput}
`;
    }

    const aiResponse = await getAIResponse(prompt);
    res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error("AI Controller Error:", error.message);

    if (error.message.includes("overloaded")) {
      return res.status(503).json({
        error: "The AI service is overloaded. Please try again in a moment.",
      });
    }

    if (error.message.includes("unavailable")) {
      return res.status(503).json({
        error: "The AI service is currently unavailable. Please try again later.",
      });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
};
