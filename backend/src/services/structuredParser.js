const { z } = require("zod");
const env = require("../config/env");
const { callOpenRouter } = require("./openrouterService");

const validator = z.object({
  basics: z
    .object({
      name: z.string().default(""),
      title: z.string().default(""),
      location: z.string().default(""),
      email: z.string().default(""),
      phone: z.string().default(""),
      links: z
        .array(
          z.object({
            label: z.string().default("Link"),
            url: z.string().default(""),
          })
        )
        .default([]),
    })
    .default({}),

  summary: z.string().default(""),

  experience: z
    .array(
      z.object({
        company: z.string().default(""),
        role: z.string().default(""),
        location: z.string().default(""),
        period: z.string().default(""),
        bullets: z.array(z.string()).default([]),
      })
    )
    .default([]),

  education: z
    .array(
      z.object({
        degree: z.string().default(""),
        school: z.string().default(""),
        location: z.string().default(""),
        period: z.string().default(""),
        details: z.string().default(""),
      })
    )
    .default([]),

  skills: z.array(z.string()).default([]),

  projects: z
    .array(
      z.object({
        name: z.string().default(""),
        description: z.string().default(""),
        tech: z.array(z.string()).default([]),
        links: z
          .array(
            z.object({
              label: z.string().default("Link"),
              url: z.string().default(""),
            })
          )
          .default([]),
      })
    )
    .default([]),

  certifications: z
    .array(
      z.object({
        name: z.string().default(""),
        issuer: z.string().default(""),
        year: z.string().default(""),
      })
    )
    .default([]),

  languages: z.array(z.string()).default([]),

  interests: z.array(z.string()).default([]),
});

const systemPrompt = `You are an expert resume parser. The input is text extracted from a resume PDF.
You must extract the data and return it as a valid JSON object ONLY.
Do not wrap in markdown or add explanations.

Return a JSON object matching this EXACT structure:
{
  "basics": {
    "name": "<candidate name>",
    "title": "<candidate job title / headline>",
    "location": "<city, state/country>",
    "email": "<email>",
    "phone": "<phone>",
    "links": [
      { "label": "<e.g. LinkedIn, GitHub, Portfolio>", "url": "<url>" }
    ]
  },
  "summary": "<professional summary>",
  "experience": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "location": "<location>",
      "period": "<dates e.g. Jan 2022 - Present>",
      "bullets": ["<bullet 1>", "<bullet 2>"]
    }
  ],
  "education": [
    {
      "degree": "<degree/field of study>",
      "school": "<university/institution>",
      "location": "<location>",
      "period": "<dates>",
      "details": "<gpa, honors, etc.>"
    }
  ],
  "skills": ["<skill 1>", "<skill 2>"],
  "projects": [
    {
      "name": "<project title>",
      "description": "<one-sentence description>",
      "tech": ["<tech 1>", "<tech 2>"],
      "links": [{ "label": "<label>", "url": "<url>" }]
    }
  ],
  "certifications": [
    {
      "name": "<certification title>",
      "issuer": "<issuing org>",
      "year": "<year>"
    }
  ],
  "languages": ["<language 1>"],
  "interests": ["<interest 1>"]
}`;

const EMPTY = {
  basics: {
    name: "",
    title: "",
    location: "",
    email: "",
    phone: "",
    links: [],
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  interests: [],
};

async function parseResume(rawText) {
  if (!env.openrouterApiKey || !rawText?.trim()) return EMPTY;

  const userPrompt = [
    "Extract structured data from the following resume text:",
    "Rules:",
    "- Be conservative: omit fields that are not clearly present. Use empty strings/arrays where missing.",
    "- Do not invent or paraphrase — extract verbatim where possible.",
    "- Each experience bullet should read as a complete sentence.",
    "- Preserve original date formats (e.g. 'Jan 2022 – Dec 2023').",
    "",
    "RESUME TEXT:",
    "__________",
    rawText,
    "__________",
  ].join("\n");

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { data } = await callOpenRouter({
        systemPrompt,
        userPrompt,
        temperature: 0.1,
      });

      return validator.parse(data);
    } catch (err) {
      if (attempt === 2) {
        console.error("Structured parse failed:", err.message);
        return EMPTY;
      }
    }
  }

  return EMPTY;
}

module.exports = { parseResume };
