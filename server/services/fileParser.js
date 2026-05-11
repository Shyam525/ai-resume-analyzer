import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export class FileParseError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "FileParseError";
    this.statusCode = options.statusCode || 400;
  }
}

function normalizeText(text = "") {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function countWords(text) {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

const SECTION_PATTERNS = {
  summary: /^(summary|professional summary|profile|about|objective)$/i,
  experience: /^(experience|work experience|professional experience|employment|career history)$/i,
  skills: /^(skills|technical skills|core competencies|competencies|tools)$/i,
  education: /^(education|academic background|qualifications|certifications)$/i,
};

export function extractStructuredSections(text) {
  const sections = {
    summary: "",
    experience: "",
    skills: "",
    education: "",
  };

  const lines = normalizeText(text).split("\n");
  let currentSection = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const matchedSection = Object.entries(SECTION_PATTERNS).find(([, pattern]) =>
      pattern.test(line.replace(/[:\-]+$/, "")),
    );

    if (matchedSection) {
      currentSection = matchedSection[0];
      continue;
    }

    if (currentSection) {
      sections[currentSection] = `${sections[currentSection]}${line}\n`.trim();
    }
  }

  if (!sections.summary) {
    sections.summary = lines.slice(0, 5).join(" ").trim();
  }

  return sections;
}

export async function extractText(file) {
  if (!file?.buffer || !file?.mimetype) {
    throw new FileParseError("No valid file was provided.");
  }

  try {
    let text = "";

    if (file.mimetype === "application/pdf") {
      const parsed = await pdfParse(file.buffer);
      text = parsed.text || "";
    } else if (
      file.mimetype.includes("word") ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value || "";
    } else if (file.mimetype === "text/plain") {
      text = file.buffer.toString("utf-8");
    } else {
      throw new FileParseError(
        "Invalid file type. Please upload PDF, DOCX, or TXT.",
      );
    }

    const normalized = normalizeText(text);
    const wordCount = countWords(normalized);
    const charCount = normalized.length;

    if (!normalized) {
      throw new FileParseError(
        "Resume appears to be empty or image-only (scanned). Please use a text-based PDF.",
      );
    }

    return {
      text: normalized,
      wordCount,
      charCount,
      sections: extractStructuredSections(normalized),
    };
  } catch (error) {
    if (error instanceof FileParseError) {
      throw error;
    }

    throw new FileParseError(
      "Could not read file. Please try a different file.",
    );
  }
}
