import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const tabs = [
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "skills", label: "Skills" },
];

function tokenize(text = "") {
  return text.split(/(\s+)/).filter(Boolean);
}

function buildDiff(original = "", improved = "") {
  const left = tokenize(original);
  const right = tokenize(improved);
  const matrix = Array.from({ length: left.length + 1 }, () =>
    Array(right.length + 1).fill(0),
  );

  for (let i = left.length - 1; i >= 0; i -= 1) {
    for (let j = right.length - 1; j >= 0; j -= 1) {
      if (left[i] === right[j]) {
        matrix[i][j] = matrix[i + 1][j + 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i + 1][j], matrix[i][j + 1]);
      }
    }
  }

  const removed = [];
  const added = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      i += 1;
      j += 1;
    } else if (matrix[i + 1][j] >= matrix[i][j + 1]) {
      removed.push(left[i]);
      i += 1;
    } else {
      added.push(right[j]);
      j += 1;
    }
  }

  while (i < left.length) {
    removed.push(left[i]);
    i += 1;
  }

  while (j < right.length) {
    added.push(right[j]);
    j += 1;
  }

  return {
    removed,
    added,
  };
}

function HighlightBlock({ text, tone }) {
  return (
    <div
      className={`rounded-[1.5rem] border px-4 py-4 text-sm leading-7 ${
        tone === "added"
          ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-50"
          : "border-rose-400/20 bg-rose-500/10 text-rose-50"
      }`}
    >
      {text || "No detected changes for this section."}
    </div>
  );
}

export default function RewritePanel({ originalSections, improvedSections, onCopy }) {
  const [activeTab, setActiveTab] = useState("summary");

  const activeOriginal = originalSections?.[activeTab] || "";
  const activeImproved = improvedSections?.[activeTab] || "";

  const diff = useMemo(
    () => buildDiff(activeOriginal, activeImproved),
    [activeOriginal, activeImproved],
  );

  return (
    <motion.section
      className="glass-panel rounded-[2rem] p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.16 }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan/75">Rewrite studio</p>
          <h3 className="mt-2 font-heading text-2xl text-white">Before and after</h3>
        </div>

        <div className="flex flex-wrap gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-sm transition ${
                activeTab === tab.key
                  ? "bg-cyan text-slate-950"
                  : "text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Original</p>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">
              Source section
            </span>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {activeOriginal || "No original section text could be isolated from the uploaded resume."}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-cyan/20 bg-cyan/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan/80">AI rewrite</p>
            <button
              type="button"
              onClick={() => onCopy(activeImproved || "")}
              className="rounded-full border border-cyan/20 bg-cyan/15 px-3 py-1 text-xs text-cyan"
            >
              Copy to Clipboard
            </button>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-white">
            {activeImproved || "No rewrite was returned for this section."}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-rose-300/80">Removed or replaced</p>
          <HighlightBlock text={diff.removed.join("").trim()} tone="removed" />
        </div>
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-emerald-300/80">Added or improved</p>
          <HighlightBlock text={diff.added.join("").trim()} tone="added" />
        </div>
      </div>
    </motion.section>
  );
}
