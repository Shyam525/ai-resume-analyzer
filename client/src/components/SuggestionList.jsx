import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const priorities = [
  { key: "high", label: "High priority", badge: "bg-rose-500/12 text-rose-200 border-rose-400/20" },
  { key: "medium", label: "Medium priority", badge: "bg-amber-500/12 text-amber-100 border-amber-400/20" },
  { key: "low", label: "Low priority", badge: "bg-emerald-500/12 text-emerald-100 border-emerald-400/20" },
];

export default function SuggestionList({ items, onCopy }) {
  const [openKey, setOpenKey] = useState("");

  const groupedItems = useMemo(
    () =>
      priorities.map((priority) => ({
        ...priority,
        items: items.filter((item) => item.priority === priority.key),
      })),
    [items],
  );

  return (
    <motion.section
      className="glass-panel rounded-[2rem] p-6 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.12 }}
    >
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan/75">Action plan</p>
        <h3 className="mt-2 font-heading text-2xl text-white">Priority-ranked fixes</h3>
      </div>

      <div className="space-y-5">
        {groupedItems.map((group) => (
          <div key={group.key}>
            <div className="mb-3 inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/90">
              <span className={`rounded-full border px-3 py-1 ${group.badge}`}>{group.label}</span>
            </div>

            <div className="space-y-3">
              {group.items.length ? (
                group.items.map((item, index) => {
                  const key = `${group.key}-${index}`;
                  const isOpen = openKey === key;

                  return (
                    <div
                      key={key}
                      className="rounded-[1.5rem] border border-white/10 bg-white/[0.03]"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenKey(isOpen ? "" : key)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        aria-expanded={isOpen}
                      >
                        <div>
                          <div className="mb-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                            {item.section}
                          </div>
                          <p className="text-base font-medium text-white">{item.action}</p>
                        </div>
                        <span className="text-xl text-slate-400">{isOpen ? "-" : "+"}</span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-white/8 px-5 py-4">
                              <p className="text-sm text-slate-300">
                                This change targets the {item.section} section and should be handled as a {item.priority} priority update.
                              </p>
                              <button
                                type="button"
                                onClick={() => onCopy(item.action)}
                                className="mt-4 rounded-full border border-cyan/20 bg-cyan/10 px-4 py-2 text-sm text-cyan transition hover:bg-cyan/15"
                              >
                                Copy Suggestion
                              </button>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-slate-400">
                  No {group.key} priority fixes were returned.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
