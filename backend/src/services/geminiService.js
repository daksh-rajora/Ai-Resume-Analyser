const { z } = require("zod");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const { callOpenRouter } = require("./openrouterService");

const analysisValidator = z.object({
  atsScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    keywords: z.number().min(0).max(25),
    formatting: z.number().min(0).max(25),
    impact: z.number().min(0).max(25),
    clarity: z.number().min(0).max(25),
  }),
  issues: z
    .array(
      z.object({
        title: z.string(),
        severity: z.enum(["low", "medium", "high"]).default("medium"),
        explanation: z.string(),
        fix: z.string(),
      })
    )
    .min(1),
  strengths: z
    .array(z.object({ title: z.string(), evidence: z.string() }))
    .min(1),
  bulletRewrites: z
    .array(
      z.object({
        section: z.string().default("experience"),
        original: z.string(),
        rewritten: z.string(),
        rationale: z.string().default(""),
      })
    )
    .default([]),
  keywordsPresent: z.array(z.string()).default([]),
  keywordsMissing: z.array(z.string()).default([]),
  summary: z.string(),
});

const systemPrompt = `You are a senior technical recruiter and ATS expert reviewing a resume.
You must respond with valid JSON ONLY. Do not include any explanations, markdown code blocks, or extra text.

Return a JSON object with this EXACT structure:
{
  "atsScore": <number between 0 and 100>,
  "scoreBreakdown": {
    "keywords": <number 0-25>,
    "formatting": <number 0-25>,
    "impact": <number 0-25>,
    "clarity": <number 0-25>
  },
  "issues": [
    {
      "title": "<short issue title>",
      "severity": "<low|medium|high>",
      "explanation": "<specific explanation>",
      "fix": "<specific actionable recommendation>"
    }
  ],
  "strengths": [
    {
      "title": "<short strength title>",
      "evidence": "<evidence from resume>"
    }
  ],
  "bulletRewrites": [
    {
      "section": "<e.g. experience>",
      "original": "<original bullet point>",
      "rewritten": "<stronger, quantified ATS-friendly rewrite>",
      "rationale": "<brief explanation of improvement>"
    }
  ],
  "keywordsPresent": ["<keyword1>", "<keyword2>"],
  "keywordsMissing": ["<keyword1>", "<keyword2>"],
  "summary": "<overall verdict paragraph>"
}`;

function buildPrompt({ rawText, targetRole }) {
  return [
    targetRole
      ? `Target role: ${targetRole}.`
      : "No specific target role was provided - assess for the role the candidate appears to be aiming for.",
    "",
    "Score the resume from 0-100 based on ATS readiness (keyword match, parseable formatting, quantified impact, clarity).",
    "Return 3-5 prioritized issues, 3-5 standout strengths, and 3-10 weak bullets rewritten to be stronger, quantified, and ATS-friendly.",
    "Rewrites must preserve the original meaning. Each rewrite needs a one-line rationale.",
    "Identify keywords clearly present and notable keywords missing for the apparent target role.",
    "Be specific and evidence-based - cite phrasing from the resume in explanations.",
    "",
    "RESUME TEXT:",
    "------------",
    rawText,
    "------------",
  ].join("\n");
}

async function analyzeResume({ rawText, targetRole }) {
  if (!env.openrouterApiKey) {
    throw ApiError.internal(
      "OPENROUTER_API_KEY (or GEMINI_API_KEY) is not configured on the server."
    );
  }

  const userPrompt = buildPrompt({ rawText, targetRole });

  let lastErr;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { data, usage, model } = await callOpenRouter({
        systemPrompt,
        userPrompt,
        temperature: 0.3,
      });

      const validated = analysisValidator.parse(data);
      return {
        analysis: validated,
        model: model || env.openrouterModel,
        promptTokens: usage.prompt_tokens || usage.promptTokenCount || 0,
        responseTokens: usage.completion_tokens || usage.candidatesTokenCount || 0,
      };
    } catch (err) {
      lastErr = err;
      if (attempt === 2) break;
    }
  }

  throw ApiError.internal(
    `AI analysis failed: ${lastErr?.message || "unknown error"}`
  );
}

module.exports = { analyzeResume };
