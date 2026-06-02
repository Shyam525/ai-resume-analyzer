import { motion } from "framer-motion";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function buildChartData(analysis) {
  return [
    {
      section: "Summary",
      score: analysis.sections.summary.score ?? 0,
      benchmark: 85,
      feedback: analysis.sections.summary.feedback,
    },
    {
      section: "Experience",
      score: analysis.sections.experience.score ?? 0,
      benchmark: 85,
      feedback: analysis.sections.experience.feedback,
    },
    {
      section: "Skills",
      score: analysis.sections.skills.score ?? 0,
      benchmark: 85,
      feedback: analysis.sections.skills.feedback,
    },
    {
      section: "Education",
      score: analysis.sections.education.score ?? 0,
      benchmark: 85,
      feedback: analysis.sections.education.feedback,
    },
    {
      section: "Formatting",
      score: analysis.sections.formatting.score ?? 0,
      benchmark: 85,
      feedback: analysis.sections.formatting.feedback,
    },
  ];
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="max-w-xs rounded-2xl border border-white/10 bg-panel/95 p-4 text-sm text-slate-200 shadow-glow">
      <p className="font-semibold text-white">{item.section}</p>
      <p className="mt-2 text-slate-300">{item.feedback || "No feedback returned."}</p>
    </div>
  );
}

export default function SkillsGapChart({ analysis }) {
  const data = buildChartData(analysis);

  return (
    <motion.section
      className="glass-panel rounded-[2rem] p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.08 }}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan/75">Section benchmark</p>
          <h3 className="mt-2 font-heading text-2xl text-white">Skills gap radar</h3>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="inline-flex items-center gap-2 text-slate-300">
            <span className="h-3 w-3 rounded-full bg-cyan" />
            Your score
          </span>
          <span className="inline-flex items-center gap-2 text-slate-300">
            <span className="h-3 w-3 rounded-full bg-amber" />
            Benchmark
          </span>
        </div>
      </div>

      <div className="h-[340px] w-full">
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="section" tick={{ fill: "#CBD5E1", fontSize: 12 }} />
            <Radar
              name="Your Score"
              dataKey="score"
              stroke="#00D9FF"
              fill="#00D9FF"
              fillOpacity={0.35}
            />
            <Radar
              name="Benchmark"
              dataKey="benchmark"
              stroke="#F59E0B"
              fill="#F59E0B"
              fillOpacity={0.15}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
