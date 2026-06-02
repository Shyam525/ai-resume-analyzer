interface ResumeFeedbackCategory {
  score: number;
  tips: Array<{
    type?: "good" | "improve";
    tip: string;
    explanation?: string;
  }>;
}

interface Resume {
  id: string;
  companyName: string;
  jobTitle: string;
  imagePath: string;
  resumePath: string;
  feedback: {
    overallScore: number;
    ATS: ResumeFeedbackCategory;
    toneAndStyle: ResumeFeedbackCategory;
    content: ResumeFeedbackCategory;
    structure: ResumeFeedbackCategory;
    skills: ResumeFeedbackCategory;
  };
}
