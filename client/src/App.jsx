import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import LoadingAnalysis from "./components/LoadingAnalysis";
import UploadZone from "./components/UploadZone";
import { useResumeContext } from "./context/ResumeContext";
import { useAnalysis } from "./hooks/useAnalysis";

const AnalysisResult = lazy(() => import("./components/AnalysisResult"));

function ToastViewport() {
  const { state } = useResumeContext();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-3 px-4">
      <AnimatePresence>
        {state.toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border px-4 py-3 text-sm shadow-glow ${
              toast.type === "error"
                ? "border-rose-400/25 bg-rose-500/15 text-rose-50"
                : "border-emerald-400/25 bg-emerald-500/15 text-emerald-50"
            }`}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const { state, dispatch } = useResumeContext();
  const { runAnalysis } = useAnalysis();

  function notify(type, message) {
    const id = `${Date.now()}-${Math.random()}`;
    dispatch({ type: "ADD_TOAST", payload: { id, type, message } });
    window.setTimeout(() => {
      dispatch({ type: "REMOVE_TOAST", payload: id });
    }, 3000);
  }

  async function copyText(value) {
    if (!value) {
      notify("error", "There was nothing to copy for this section.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      notify("success", "Copied to clipboard.");
    } catch {
      notify("error", "Clipboard access failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-hero-radial px-4 py-6 text-slate-50 md:px-8 md:py-8">
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-cyan/20 blur-3xl" />
        <div className="absolute bottom-0 right-[-6%] h-80 w-80 rounded-full bg-emerald/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.header
          className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.36em] text-cyan/70">
              Production Resume Intelligence
            </p>
            <h1 className="mt-4 font-heading text-5xl leading-tight text-white md:text-7xl">
              Diagnose what your resume says before a recruiter does.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">
              Upload a resume, compare it against ATS expectations, uncover missing keywords, and leave with stronger rewrite-ready sections.
            </p>
          </div>

          <div className="glass-panel rounded-[1.75rem] p-5 text-sm text-slate-200">
            <p className="uppercase tracking-[0.28em] text-cyan/70">Privacy first</p>
            <p className="mt-3 max-w-sm">
              Files are validated client-side, processed in-memory on the server, and not stored after the request finishes.
            </p>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {state.analysis ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <Suspense fallback={<div className="glass-panel rounded-[2rem] p-8 text-slate-300">Loading your report...</div>}>
                <AnalysisResult
                  analysis={state.analysis}
                  meta={state.meta}
                  loading={state.loading}
                  onReset={() => dispatch({ type: "RESET" })}
                  onCopy={copyText}
                  onNotify={notify}
                  onReanalyzeWithJobDescription={(jobDescription) =>
                    runAnalysis({
                      file: state.file,
                      jobDescription,
                      preserveResults: true,
                    })
                  }
                />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <UploadZone
                onAnalyze={() => runAnalysis()}
                loading={state.loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>{state.loading ? <LoadingAnalysis /> : null}</AnimatePresence>
      <ToastViewport />
    </div>
  );
}
