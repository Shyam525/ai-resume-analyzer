import Anthropic from "@anthropic-ai/sdk";
import {
  ANALYSIS_SCHEMA,
  buildAnalysisPrompt,
  buildQuickTipsPrompt,
} from "../prompts/resumePrompt.js";

const MODEL_NAME = "claude-sonnet-4-20250514";
const REQUEST_TIMEOUT_MS = 30_000;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export class ClaudeServiceError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ClaudeServiceError";
    this.statusCode = options.statusCode || 502;
    this.partialData = options.partialData || null;
  }
}

function withTimeout() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeout),
  };
}

function clampScore(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(number)));
}

function normalizeSection(section = {}, includeRewrite = true) {
  return {
    score: clampScore(section.score),
    feedback: section.feedback || "",
    ...(includeRewrite ? { rewrite: section.rewrite || "" } : {}),
  };
}

export function normalizeAnalysisResponse(input = {}) {
  return {
    overallScore: clampScore(input.overallScore),
    atsScore: clampScore(input.atsScore),
    sections: {
      summary: normalizeSection(input.sections?.summary),
      experience: normalizeSection(input.sections?.experience),
      skills: normalizeSection(input.sections?.skills),
      education: normalizeSection(input.sections?.education, false),
      formatting: normalizeSection(input.sections?.formatting, false),
    },
    strengths: Array.isArray(input.strengths)
      ? input.strengths.filter(Boolean).slice(0, 6)
      : [],
    weaknesses: Array.isArray(input.weaknesses)
      ? input.weaknesses.filter(Boolean).slice(0, 6)
      : [],
    missingKeywords: Array.isArray(input.missingKeywords)
      ? input.missingKeywords.filter(Boolean).slice(0, 12)
      : [],
    actionItems: Array.isArray(input.actionItems)
      ? input.actionItems
          .filter(Boolean)
          .map((item) => ({
            priority: ["high", "medium", "low"].includes(item.priority)
              ? item.priority
              : "medium",
            section: item.section || "general",
            action: item.action || "",
          }))
          .filter((item) => item.action)
      : [],
    careerLevel: input.careerLevel || null,
    industryFit: Array.isArray(input.industryFit)
      ? input.industryFit.filter(Boolean).slice(0, 4)
      : [],
    jobMatchScore: clampScore(input.jobMatchScore),
    toneAnalysis: input.toneAnalysis || null,
    improvedResumeSections: {
      summary: input.improvedResumeSections?.summary || "",
      experience: input.improvedResumeSections?.experience || "",
      skills: input.improvedResumeSections?.skills || "",
    },
  };
}

function extractJsonString(rawText = "") {
  const cleaned = rawText.replace(/```json|```/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model response.");
  }

  return cleaned.slice(start, end + 1);
}

function parseAnalysisJson(rawText) {
  const jsonString = extractJsonString(rawText);
  return normalizeAnalysisResponse(JSON.parse(jsonString));
}

async function callClaude({ system, user, maxTokens = 4096 }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new ClaudeServiceError(
      "Missing ANTHROPIC_API_KEY. Add it to the server environment before analyzing resumes.",
      { statusCode: 500 },
    );
  }

  const timer = withTimeout();

  try {
    const message = await client.messages.create({
      model: MODEL_NAME,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
      signal: timer.signal,
    });

    const rawText =
      message.content?.find((item) => item.type === "text")?.text || "";

    return rawText;
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new ClaudeServiceError(
        "AI analysis timed out. Please retry.",
        { statusCode: 504 },
      );
    }

    throw new ClaudeServiceError(
      "AI service temporarily unavailable. Please retry.",
      { statusCode: 502 },
    );
  } finally {
    timer.clear();
  }
}

async function repairAnalysisResponse(rawText) {
  const repairSystem = `You repair malformed resume-analysis output into valid JSON.
Return only raw JSON matching this schema exactly:
${JSON.stringify(ANALYSIS_SCHEMA, null, 2)}`;

  const repairUser = `Convert the following content into valid JSON using the required schema. Preserve the intended meaning. If something is missing, use null, an empty string, or an empty array.

${rawText}`;

  const repairedText = await callClaude({
    system: repairSystem,
    user: repairUser,
    maxTokens: 4096,
  });

  return parseAnalysisJson(repairedText);
}

export async function analyzeResume(resumeText, jobDescription = null) {
  const prompt = buildAnalysisPrompt(resumeText, jobDescription);
  const rawText = await callClaude({
    system: prompt.system,
    user: prompt.user,
  });

  try {
    return parseAnalysisJson(rawText);
  } catch {
    try {
      return await repairAnalysisResponse(rawText);
    } catch (repairError) {
      throw new ClaudeServiceError(
        "The AI returned an unreadable response twice. Please retry.",
        {
          statusCode: 500,
          partialData: normalizeAnalysisResponse({}),
        },
      );
    }
  }
}

export async function generateQuickTips(resumeText) {
  const prompt = buildQuickTipsPrompt(resumeText);
  const rawText = await callClaude({
    system: prompt.system,
    user: prompt.user,
    maxTokens: 512,
  });

  try {
    const cleaned = rawText.replace(/```json|```/gi, "").trim();
    const tips = JSON.parse(cleaned);
    return Array.isArray(tips) ? tips.filter(Boolean).slice(0, 5) : [];
  } catch {
    return [];
  }
}

export { MODEL_NAME };
