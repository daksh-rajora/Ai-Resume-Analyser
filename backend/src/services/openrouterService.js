const env = require("../config/env");
const ApiError = require("../utils/ApiError");

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

function extractJson(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Empty response from AI");
  }

  let cleaned = text.trim();
  // Strip markdown code blocks like ```json ... ```
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

async function callOpenRouter({ systemPrompt, userPrompt, temperature = 0.3, maxTokens }) {
  const apiKey = env.openrouterApiKey;
  if (!apiKey) {
    throw ApiError.internal("OPENROUTER_API_KEY (or GEMINI_API_KEY) is not configured on the server.");
  }

  const model = env.openrouterModel;

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: userPrompt });

  const bodyPayload = {
    model,
    messages,
    temperature,
    response_format: { type: "json_object" },
  };

  if (maxTokens) {
    bodyPayload.max_tokens = maxTokens;
  }

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "AI Resume Analyser",
    },
    body: JSON.stringify(bodyPayload),
    signal: AbortSignal.timeout(90000),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg =
      data?.error?.message ||
      data?.message ||
      `OpenRouter request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content received from OpenRouter");
  }

  const parsed = extractJson(content);
  return {
    rawText: content,
    data: parsed,
    usage: data.usage || {},
    model: data.model || model,
  };
}

module.exports = {
  callOpenRouter,
  extractJson,
};
