import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
  "Parsing your resume...",
  "Checking ATS compatibility...",
  "Identifying skill gaps...",
  "Generating rewrites...",
  "Calculating your score...",
];

export default function LoadingAnalysis() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 2500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-surface/86 px-6 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="glass-panel w-full max-w-xl rounded-[2rem] p-8 text-center md:p-10">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-cyan/30 bg-cyan/10 shadow-glow">
          <div className="brain-orb" aria-hidden="true">
            <span className="text-4xl">AI</span>
          </div>
        </div>

        <p className="text-sm uppercase tracking-[0.32em] text-cyan/70">
          Deep analysis in progress
        </p>

        <div className="relative mt-5 h-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={messages[index]}
              className="absolute inset-0 text-2xl font-semibold text-white"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45 }}
            >
              {messages[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-8 overflow-hidden rounded-full border border-white/10 bg-white/5">
          <motion.div
            className="h-2 rounded-full bg-gradient-to-r from-cyan via-cyan/80 to-emerald"
            initial={{ width: "12%" }}
            animate={{ width: ["20%", "62%", "88%", "74%", "96%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
