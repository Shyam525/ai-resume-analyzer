import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatScore, getScoreTone } from "../utils/formatScore";

function useAnimatedNumber(target) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const endValue = target ?? 0;
    let start = 0;
    let frameId = 0;
    const startedAt = performance.now();

    const animate = (timestamp) => {
      const progress = Math.min((timestamp - startedAt) / 1500, 1);
      start = Math.round(endValue * progress);
      setValue(start);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [isInView, target]);

  return { value, ref };
}

function MiniBar({ label, score }) {
  const tone = getScoreTone(score);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span>{formatScore(score)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${tone.barClass}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${score ?? 0}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function ScoreCard({ analysis }) {
  const overallTone = getScoreTone(analysis.overallScore);
  const { value, ref } = useAnimatedNumber(analysis.overallScore);

  const contentScore = useMemo(() => {
    const values = [
      analysis.sections.summary.score,
      analysis.sections.experience.score,
      analysis.sections.skills.score,
      analysis.sections.education.score,
    ].filter((score) => typeof score === "number");

    if (!values.length) {
      return null;
    }

    return Math.round(values.reduce((sum, score) => sum + score, 0) / values.length);
  }, [analysis.sections]);

  const circumference = 2 * Math.PI * 58;
  const dashOffset = circumference - ((analysis.overallScore ?? 0) / 100) * circumference;

  return (
    <motion.section
      className="glass-panel rounded-[2rem] p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-5">
          <div ref={ref} className="relative h-36 w-36">
            <svg className="h-full w-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="58"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="72"
                cy="72"
                r="58"
                fill="none"
                strokeWidth="12"
                strokeLinecap="round"
                className={overallTone.strokeClass}
                initial={{ strokeDashoffset: circumference }}
                whileInView={{ strokeDashoffset: dashOffset }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: "easeOut" }}
                strokeDasharray={circumference}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className={`text-4xl font-bold ${overallTone.textClass}`}>{value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.28em] text-slate-400">
                Overall
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-cyan/75">Resume health</p>
            <h2 className="mt-3 font-heading text-3xl text-white">
              {overallTone.label} candidate profile
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-sm ${overallTone.badgeClass}`}
              >
                {analysis.careerLevel || "Career level pending"}
              </span>
              <span className="rounded-full border border-cyan/20 bg-cyan/10 px-3 py-1 text-sm text-cyan">
                ATS {formatScore(analysis.atsScore)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-slate-200">
                Match {formatScore(analysis.jobMatchScore)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid flex-1 gap-4">
          <MiniBar label="ATS score" score={analysis.atsScore} />
          <MiniBar label="Content score" score={contentScore} />
          <MiniBar label="Format score" score={analysis.sections.formatting.score} />
        </div>
      </div>
    </motion.section>
  );
}
