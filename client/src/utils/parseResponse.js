const EMPTY_ANALYSIS = {
  overallScore: null,
  atsScore: null,
  sections: {
    summary: { score: null, feedback: "", rewrite: "" },
    experience: { score: null, feedback: "", rewrite: "" },
    skills: { score: null, feedback: "", rewrite: "" },
    education: { score: null, feedback: "" },
    formatting: { score: null, feedback: "" },
  },
  strengths: [],
  weaknesses: [],
  missingKeywords: [],
  actionItems: [],
  careerLevel: null,
  industryFit: [],
  jobMatchScore: null,
  toneAnalysis: null,
  improvedResumeSections: {
    summary: "",
    experience: "",
    skills: "",
  },
};

function clamp(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isNaN(number) ? null : Math.max(0, Math.min(100, Math.round(number)));
}

export function normalizeAnalysis(data = {}) {
  return {
    ...EMPTY_ANALYSIS,
    ...data,
    overallScore: clamp(data.overallScore),
    atsScore: clamp(data.atsScore),
    sections: {
      summary: {
        score: clamp(data.sections?.summary?.score),
        feedback: data.sections?.summary?.feedback || "",
        rewrite: data.sections?.summary?.rewrite || "",
      },
      experience: {
        score: clamp(data.sections?.experience?.score),
        feedback: data.sections?.experience?.feedback || "",
        rewrite: data.sections?.experience?.rewrite || "",
      },
      skills: {
        score: clamp(data.sections?.skills?.score),
        feedback: data.sections?.skills?.feedback || "",
        rewrite: data.sections?.skills?.rewrite || "",
      },
      education: {
        score: clamp(data.sections?.education?.score),
        feedback: data.sections?.education?.feedback || "",
      },
      formatting: {
        score: clamp(data.sections?.formatting?.score),
        feedback: data.sections?.formatting?.feedback || "",
      },
    },
    strengths: Array.isArray(data.strengths) ? data.strengths.filter(Boolean) : [],
    weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses.filter(Boolean) : [],
    missingKeywords: Array.isArray(data.missingKeywords)
      ? data.missingKeywords.filter(Boolean)
      : [],
    actionItems: Array.isArray(data.actionItems)
      ? data.actionItems.map((item) => ({
          priority: ["high", "medium", "low"].includes(item.priority)
            ? item.priority
            : "medium",
          section: item.section || "general",
          action: item.action || "",
        }))
      : [],
    careerLevel: data.careerLevel || null,
    industryFit: Array.isArray(data.industryFit) ? data.industryFit.filter(Boolean) : [],
    jobMatchScore: clamp(data.jobMatchScore),
    toneAnalysis: data.toneAnalysis || null,
    improvedResumeSections: {
      summary: data.improvedResumeSections?.summary || "",
      experience: data.improvedResumeSections?.experience || "",
      skills: data.improvedResumeSections?.skills || "",
    },
  };
}

export function normalizeMeta(meta = {}) {
  return {
    wordCount: meta.wordCount || 0,
    charCount: meta.charCount || 0,
    processingTimeMs: meta.processingTimeMs || 0,
    model: meta.model || "",
    quickTips: Array.isArray(meta.quickTips) ? meta.quickTips.filter(Boolean) : [],
    originalSections: meta.originalSections || {},
    hasJobDescription: Boolean(meta.hasJobDescription),
  };
}
