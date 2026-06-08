import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  Circle,
} from "lucide-react";

import {
  FUNNEL_STAGES,
  STATUS_LABELS,
  STATUS_TONE,
  safe,
  scoreText,
  formatSlotDateTime,
} from "./ShortlistingFunnelUtils";

export const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100";

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

export function SectionCard({ title, subtitle, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
        ) : null}
      </div>

      {children}
    </section>
  );
}

export function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

export function StatusBadge({ value }) {
  const status = value || "pending";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        STATUS_TONE[status] || STATUS_TONE.pending
      }`}
    >
      {STATUS_LABELS[status] || safe(status)}
    </span>
  );
}

export function ScoreBadge({ value }) {
  if (value === null || value === undefined || value === "") {
    return (
      <span className="inline-flex min-w-[78px] justify-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        —
      </span>
    );
  }

  const n = Number(value);

  const tone =
    Number.isFinite(n) && n >= 8
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : Number.isFinite(n) && n >= 6
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <span
      className={`inline-flex min-w-[78px] justify-center rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}
    >
      {scoreText(value)}
    </span>
  );
}

export function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full md:max-w-md">
      <Search
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${inputClass} pl-11`}
      />
    </div>
  );
}

export function PaginationBar({ page, setPage, pageSize, total }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
      <div className="text-slate-500">
        Showing <strong className="text-slate-800">{start}</strong>-
        <strong className="text-slate-800">{end}</strong> of{" "}
        <strong className="text-slate-800">{total}</strong>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <ChevronLeft size={14} />
          Prev
        </button>

        <span className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function usePagination(rows, pageSize = 15) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, safePage, pageSize]);

  return {
    page: safePage,
    setPage,
    pageSize,
    total: rows.length,
    pagedRows,
  };
}

export function MiniCount({ label, value, tone = "slate" }) {
  const tones = {
    slate: "border-slate-200 bg-slate-50 text-slate-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    rose: "border-rose-200 bg-rose-50 text-rose-900",
    sky: "border-sky-200 bg-sky-50 text-sky-900",
    violet: "border-violet-200 bg-violet-50 text-violet-900",
  };

  return (
    <div className={`rounded-2xl border p-3 ${tones[tone] || tones.slate}`}>
      <div className="text-lg font-bold">{value || 0}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide opacity-70">
        {label}
      </div>
    </div>
  );
}

export function ScheduleText({ schedule }) {
  if (!schedule?.date) {
    return <span className="text-slate-400">Not assigned</span>;
  }

  return (
    <div>
      <div className="font-semibold text-slate-900">
        {formatSlotDateTime(schedule)}
      </div>
      <div className="mt-1 text-xs text-slate-500">{schedule.mode || "-"}</div>
      {schedule.venue ? (
        <div className="mt-1 max-w-[240px] truncate text-xs text-slate-500">
          {schedule.venue}
        </div>
      ) : null}
    </div>
  );
}

export function FunnelBar({ activeStage, setActiveStage, counts }) {
  const stages = [
    {
      key: FUNNEL_STAGES.ALL,
      label: "Applications",
      value: counts.total,
    },
    {
      key: FUNNEL_STAGES.AI,
      label: "AI Screening",
      value: counts.aiShortlisted,
    },
    {
      key: FUNNEL_STAGES.EXPERT,
      label: "Expert Review",
      value: counts.expertShortlisted,
    },
    {
      key: FUNNEL_STAGES.WRITTEN,
      label: "Written",
      value: counts.writtenSelected,
    },
    {
      key: FUNNEL_STAGES.PI,
      label: "PI / Pitch",
      value: counts.piSelected,
    },
    {
      key: FUNNEL_STAGES.FINAL,
      label: "Recognised",
      value: counts.recognised,
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
      {stages.map((stage, index) => {
        const active = activeStage === stage.key;

        return (
          <button
            key={stage.key}
            type="button"
            onClick={() => setActiveStage(stage.key)}
            className={`relative rounded-3xl border p-4 text-left transition ${
              active
                ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  active ? "bg-white text-slate-900" : "bg-slate-100 text-slate-500"
                }`}
              >
                {index === 0 ? <Circle size={15} /> : <CheckCircle2 size={15} />}
              </div>

              <div className="text-2xl font-bold">{stage.value || 0}</div>
            </div>

            <div
              className={`mt-3 text-sm font-bold ${
                active ? "text-white" : "text-slate-900"
              }`}
            >
              {stage.label}
            </div>

            <div
              className={`mt-1 text-xs ${
                active ? "text-white/70" : "text-slate-400"
              }`}
            >
              Step {index + 1}
            </div>
          </button>
        );
      })}
    </div>
  );
}