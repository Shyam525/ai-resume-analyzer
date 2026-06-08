import { motion } from "framer-motion";
import { useState } from "react";
import { useResumeContext } from "../context/ResumeContext";
import { useFileUpload } from "../hooks/useFileUpload";

function formatFileSize(bytes = 0) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const fileTypeBadges = [
  { label: "PDF", icon: "PDF" },
  { label: "DOCX", icon: "DOC" },
  { label: "TXT", icon: "TXT" },
];

export default function UploadZone({ onAnalyze, loading }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const { state, dispatch } = useResumeContext();
  const { inputRef, file, openFilePicker, handleFileChange, handleDrop } =
    useFileUpload();

  return (
    <section className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <motion.div
        className="glass-panel rounded-[2rem] p-6 md:p-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="mb-6 flex flex-wrap gap-3">
          {fileTypeBadges.map((type) => (
            <span
              key={type.label}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.24em] text-slate-200"
            >
              <span className="rounded-full bg-cyan/10 px-2 py-1 text-cyan">
                {type.icon}
              </span>
              {type.label}
            </span>
          ))}
        </div>

        <button
          type="button"
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragActive(false);
            handleDrop(event);
          }}
          onClick={openFilePicker}
          className={`relative flex min-h-[320px] w-full flex-col items-center justify-center rounded-[1.75rem] border px-6 py-10 text-center transition ${
            isDragActive
              ? "border-cyan bg-cyan/8 shadow-glow"
              : "border-white/10 bg-white/[0.03] hover:border-cyan/50 hover:bg-white/[0.05]"
          }`}
          aria-label="Upload resume file"
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-cyan/25 bg-cyan/10 text-2xl text-cyan shadow-glow">
            <span aria-hidden="true">+</span>
          </div>

          <p className="font-heading text-3xl text-white md:text-4xl">
            Drop your resume here
          </p>
          <p className="mt-3 max-w-xl text-base text-slate-300">
            Click to browse or drag a PDF, DOCX, or TXT file. Everything is
            processed in-memory for privacy.
          </p>

          <div className="mt-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            Max upload size: 5MB
          </div>
        </button>

        {file ? (
          <div className="mt-5 rounded-3xl border border-emerald/20 bg-emerald/10 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-emerald/80">
                  Selected file
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {file.name}
                </p>
              </div>
              <p className="text-sm text-emerald-100">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="jobDescription"
              className="text-sm font-medium text-slate-100"
            >
              Paste Job Description (optional)
            </label>
            <span className="text-xs text-slate-400">
              {state.jobDescription.length} / 4000
            </span>
          </div>
          <textarea
            id="jobDescription"
            value={state.jobDescription}
            maxLength={4000}
            onChange={(event) =>
              dispatch({
                type: "SET_JOB_DESCRIPTION",
                payload: event.target.value,
              })
            }
            placeholder="Add a target role description to get a deeper keyword match score."
            className="h-44 w-full rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan/50 focus:bg-white/[0.06]"
          />
        </div>

        {state.error ? (
          <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {state.error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => onAnalyze()}
            disabled={!file || loading}
            className="inline-flex items-center justify-center rounded-full bg-cyan px-6 py-3 text-base font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "RESET" })}
            className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-base font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            Start Over
          </button>
        </div>
      </motion.div>

      <motion.aside
        className="grid gap-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
      >
        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan/70">
            What you get
          </p>
          <ul className="mt-5 space-y-4 text-slate-200">
            <li className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
              ATS scorecards with section-by-section grading and benchmark
              context.
            </li>
            <li className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
              Skill gap analysis, missing keywords, and role-fit scoring against
              a job description.
            </li>
            <li className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
              Rewrite-ready improvements for summary, experience, and skills
              plus a downloadable report.
            </li>
          </ul>
        </div>

        <div className="glass-panel rounded-[2rem] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald/75">
            Previous analyses
          </p>
          <div className="mt-5 space-y-3">
            {state.history.length ? (
              state.history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-3xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-slate-100">
                      {entry.fileName}
                    </p>
                    <span className="rounded-full bg-cyan/10 px-3 py-1 text-xs text-cyan">
                      {entry.overallScore ?? "--"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-slate-400">
                Your recent analyses will appear here for quick reference on
                this device.
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </section>
  );
}
