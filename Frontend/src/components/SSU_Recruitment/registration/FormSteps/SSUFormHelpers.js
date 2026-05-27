export function inputClass(hasError, disabled) {
  return `block w-full uppercase rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${
    disabled
      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
      : hasError
      ? "border-red-400 bg-red-50"
      : "border-slate-200 bg-white/85 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
  }`;
}

export function selectClass(hasError, disabled) {
  return `block w-full uppercase rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${
    disabled
      ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
      : hasError
      ? "border-red-400 bg-red-50"
      : "border-slate-200 bg-white/85 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
  }`;
}
