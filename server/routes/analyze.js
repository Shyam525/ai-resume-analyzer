import { Router } from "express";
import { upload } from "../middleware/upload.js";
import {
  analyzeResume,
  ClaudeServiceError,
  generateQuickTips,
  MODEL_NAME,
} from "../services/claudeService.js";
import { extractText, FileParseError } from "../services/fileParser.js";

const router = Router();

router.post("/", upload.single("file"), async (req, res, next) => {
  const startedAt = Date.now();

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a resume file before starting analysis.",
      });
    }

    const jobDescription =
      typeof req.body?.jobDescription === "string"
        ? req.body.jobDescription.trim()
        : "";

    const parsedFile = await extractText(req.file);
    const aiStartedAt = Date.now();

    const [analysis, quickTips] = await Promise.all([
      analyzeResume(parsedFile.text, jobDescription || null),
      generateQuickTips(parsedFile.text).catch(() => []),
    ]);

    const aiDuration = Date.now() - aiStartedAt;
    const processingTimeMs = Date.now() - startedAt;

    console.log(
      `[analyze] ${req.file.originalname} analyzed in ${processingTimeMs}ms (Claude ${aiDuration}ms)`,
    );

    return res.status(200).json({
      success: true,
      data: analysis,
      meta: {
        wordCount: parsedFile.wordCount,
        charCount: parsedFile.charCount,
        processingTimeMs,
        model: MODEL_NAME,
        quickTips,
        originalSections: parsedFile.sections,
        hasJobDescription: Boolean(jobDescription),
      },
    });
  } catch (error) {
    if (error instanceof FileParseError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    }

    if (error instanceof ClaudeServiceError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
        ...(error.partialData ? { partialData: error.partialData } : {}),
      });
    }

    next(error);
  }
});

export default router;
