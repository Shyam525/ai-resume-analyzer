import { useState } from "react";

export default function JobMatchInput({ onSubmit, loading }) {
  const [value, setValue] = useState("");

  return (
    <section className="glass-panel rounded-[2rem] p-6 md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
        <div className="flex-1">
          <p className="text-sm uppercase tracking-[0.28em] text-cyan/75">Job match</p>
          <h3 className="mt-2 font-heading text-2xl text-white">
            Add a job description to get a match score
          </h3>
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Paste the target role, required skills, and preferred experience here."
            className="mt-4 h-40 w-full rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan/50"
          />
        </div>

        <button
          type="button"
          onClick={() => onSubmit(value)}
          disabled={!value.trim() || loading}
          className="inline-flex h-12 items-center justify-center rounded-full bg-cyan px-6 text-base font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Updating..." : "Re-analyze with JD"}
        </button>
      </div>
    </section>
  );
}
