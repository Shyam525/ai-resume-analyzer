import { motion } from "framer-motion";
import ExportButton from "./ExportButton";
import JobMatchInput from "./JobMatchInput";
import RewritePanel from "./RewritePanel";
import ScoreCard from "./ScoreCard";
import SkillsGapChart from "./SkillsGapChart";
import SuggestionList from "./SuggestionList";

function InsightCard({ title, items, tone }) {
  const toneClasses = {
    strength: "border-emerald-400/15 bg-emerald-500/10 text-emerald-50",
    weakness: "border-rose-400/15 bg-rose-500/10 text-rose-50",
    keyword: "border-amber-400/15 bg-amber-500/10 text-amber-50",
  };

  return (
    <div className="glass-panel rounded-[2rem] p-6">
      <p className="text-sm uppercase tracking-[0.28em] text-cyan/75">{title}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {items.length ? (
          items.map((item) => (
            <span
              key={item}
              className={`inline-flex rounded-full border px-4 py-2 text-sm ${toneClasses[tone]}`}
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-400">No insights returned for this category.</p>
        )}
      </div>
    </div>
  );
}

function InfoGrid({ analysis, meta }) {
  const cards = [
    { label: "Words parsed", value: meta.wordCount },
    { label: "Processing time", value: `${(meta.processingTimeMs / 1000).toFixed(1)}s` },
    { label: "Tone analysis", value: analysis.toneAnalysis || "Not provided" },
    {
      label: "Industry fit",
      value: analysis.industryFit.length ? analysis.industryFit.join(", ") : "General market fit",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          className="glass-panel rounded-[1.6rem] p-5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 * index }}
        >
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{card.label}</p>
          <p className="mt-3 text-base text-white">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function AnalysisResult({
  analysis,
  meta,
  loading,
  onReset,
  onCopy,
  onNotify,
  onReanalyzeWithJobDescription,
}) {
  return (
    <section id="analysis-report" className="space-y-6 pb-16">
      <motion.div
        className="glass-panel rounded-[2rem] p-6 md:p-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan/75">Analysis complete</p>
            <h2 className="mt-3 font-heading text-4xl text-white md:text-5xl">
              A sharper, ATS-ready version of your resume is mapped out.
            </h2>
            <p className="mt-4 max-w-2xl text-slate-300">
              Review the score breakdown, fix the high-priority gaps, and export the report once you are ready to apply.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <ExportButton targetId="analysis-report" onNotify={onNotify} />
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-5 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/[0.06]"
            >
              Start Over
            </button>
          </div>
        </div>
      </motion.div>

      <InfoGrid analysis={analysis} meta={meta} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ScoreCard analysis={analysis} />
        <SkillsGapChart analysis={analysis} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <InsightCard title="Strengths" items={analysis.strengths} tone="strength" />
        <InsightCard title="Weaknesses" items={analysis.weaknesses} tone="weakness" />
        <InsightCard title="Missing keywords" items={analysis.missingKeywords} tone="keyword" />
      </div>

      <SuggestionList items={analysis.actionItems} onCopy={onCopy} />

      <RewritePanel
        originalSections={meta.originalSections}
        improvedSections={analysis.improvedResumeSections}
        onCopy={onCopy}
      />

      {!meta.hasJobDescription ? (
        <JobMatchInput onSubmit={onReanalyzeWithJobDescription} loading={loading} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan/75">Quick wins</p>
          <h3 className="mt-2 font-heading text-2xl text-white">Do these in under 10 minutes</h3>
          <div className="mt-5 space-y-3">
            {meta.quickTips.length ? (
              meta.quickTips.map((tip, index) => (
                <motion.div
                  key={tip}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4 text-slate-200"
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                >
                  {tip}
                </motion.div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-slate-400">
                The AI did not return quick-win tips for this run.
              </div>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan/75">Section notes</p>
          <h3 className="mt-2 font-heading text-2xl text-white">Detailed feedback</h3>
          <div className="mt-5 space-y-4">
            {Object.entries(analysis.sections).map(([sectionName, sectionData], index) => (
              <motion.div
                key={sectionName}
                className="rounded-3xl border border-white/10 bg-white/[0.03] px-4 py-4"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
              >
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-300">{sectionName}</p>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    {sectionData.score ?? "--"}
                  </span>
                </div>
                <p className="text-sm text-slate-300">{sectionData.feedback || "No feedback."}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
