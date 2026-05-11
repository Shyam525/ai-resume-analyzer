export function formatScore(score) {
  return score ?? "--";
}

export function getScoreTone(score) {
  if (score === null || score === undefined) {
    return {
      label: "Pending",
      textClass: "text-slate-200",
      strokeClass: "stroke-slate-400",
      barClass: "from-slate-500 to-slate-300",
      badgeClass: "bg-slate-500/15 text-slate-200 border-slate-400/20",
    };
  }

  if (score < 50) {
    return {
      label: "Needs Work",
      textClass: "text-rose-400",
      strokeClass: "stroke-rose-400",
      barClass: "from-rose-500 to-amber-400",
      badgeClass: "bg-rose-500/12 text-rose-300 border-rose-400/20",
    };
  }

  if (score < 75) {
    return {
      label: "Competitive",
      textClass: "text-amber-300",
      strokeClass: "stroke-amber-300",
      barClass: "from-amber-400 to-yellow-300",
      badgeClass: "bg-amber-500/12 text-amber-200 border-amber-400/20",
    };
  }

  return {
    label: "Strong",
    textClass: "text-emerald-400",
    strokeClass: "stroke-emerald-400",
    barClass: "from-cyan-400 to-emerald-400",
    badgeClass: "bg-emerald-500/12 text-emerald-200 border-emerald-400/20",
  };
}
