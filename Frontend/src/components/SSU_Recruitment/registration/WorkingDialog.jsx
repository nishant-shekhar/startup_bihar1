import React from "react";

export default function WorkingDialog({
  open,
  title = "Please wait",
  message = "We are processing your request.",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/80 bg-white px-6 py-7 shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-slate-900 border-t-transparent" />
          </div>

          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}