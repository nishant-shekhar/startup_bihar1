// src/components/AIReviewOldStyle.jsx
import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  X,
  Bot,
  Loader,
  Sparkles,
  Database,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  ShieldAlert,
  ArrowUpRight,
  Settings,
  SlidersHorizontal,
  ClipboardCopy,
  Target,
  Gauge,
  Info,
  BrainCircuit,
  BarChart3,
  CalendarDays,
  FolderOpen,
  Calculator,
  BadgeInfo,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ref, get, update } from "firebase/database";
import ThinkingIndicator from "./ThinkingIndicator";
import "./AIReviewSection.css";
import { rtdb } from "./firebase"; // adjust path if your firebase config is elsewhere

// ------------------------------------------------------------
// RTDB SAVE STRUCTURE
// ------------------------------------------------------------
// This component saves each evaluated startup here:
// StartupReviews/{selectedYear}/{selectedMonth}/{safeSbNo}
//
// Example:
// StartupReviews/2026/May/SB2026040004
//
// This lets you run separate evaluation batches by month + year.
// ------------------------------------------------------------
const REVIEWS_ROOT = "StartupReviews";

// ------------------------------------------------------------
// EXCEL COLUMNS: OLD FORM
// ------------------------------------------------------------
const STD_COLS = {
  sbNo: "Acknowledgment No",
  entityName: "Name Of StartUp",
  stage: "Current Stage",
  isRegisteredEntity: "Is Registered Entity",
  founderQualification: "Higher Education",
  natureOfEntity: "Nature Of Entity",
  dateOfRegistration: "Date Of Registration",
  roc: "roc",

  innovation_note: "A Brief Note on innovation in idea",
  uniqueness_note: "A Brief Note on Uniqueness in idea",
  employment_potential_note:
    "A Brief Note on Potential of high employment through Startup",
  wealth_potential_note:
    "A Brief Note on Potential of generating wealth through Startup",
  product_development_capability_note:
    "A Brief Note on Capability of development of products",
  success_stories_and_growth_plan:
    "Success Stories of Idea prototype and Growth plan",
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = MONTHS[new Date().getMonth()];
const YEARS = Array.from(
  { length: Math.max(1, CURRENT_YEAR - 2025 + 1) },
  (_, i) => 2025 + i
);

// ------------------------------------------------------------
// BASIC HELPERS
// ------------------------------------------------------------
const pick = (row, key) => row?.[key] ?? "";
const asStr = (v) => String(v ?? "").trim();
const to2 = (v) => Math.round((Number(v) || 0) * 100) / 100;
const clamp01 = (v) => Math.max(0, Math.min(1, Number(v) || 0));
const clamp010 = (v) => Math.max(0, Math.min(10, Number(v) || 0));

const safeKey = (k) => String(k || "").replace(/[.#$/\[\]]/g, "_");

const getBatchPath = (year, month) => `${REVIEWS_ROOT}/${year}/${month}`;

const getStartupReviewPath = (year, month, sbNo) =>
  `${getBatchPath(year, month)}/${safeKey(sbNo)}`;

const normalizeBoolean = (value) => {
  const s = String(value ?? "").trim().toLowerCase();
  if (["true", "yes", "1", "registered", "हाँ", "ha", "haan"].includes(s)) {
    return true;
  }
  if (
    ["false", "no", "0", "not registered", "unregistered", "नहीं", "nahi"].includes(
      s
    )
  ) {
    return false;
  }
  return Boolean(value);
};

const joinArr = (v, sep = " | ") => {
  if (!Array.isArray(v)) return "";
  return v
    .map((item) => {
      if (typeof item === "string") return item;
      if (item?.question) return item.question;
      try {
        return JSON.stringify(item);
      } catch {
        return String(item);
      }
    })
    .filter(Boolean)
    .join(sep);
};

const asText = (v) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

// ------------------------------------------------------------
// UI HELPERS
// ------------------------------------------------------------
const getScoreColor = (score) => {
  const s = Number(score) || 0;
  if (s >= 8) return "text-emerald-400 font-bold";
  if (s >= 7.1) return "text-indigo-300 font-semibold";
  if (s >= 6) return "text-amber-400";
  return "text-rose-400";
};

const getDecisionPill = (decision) => {
  const d = (decision || "").toLowerCase();
  if (d === "pitch_call")
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (d === "reserve_band" || d === "hold_need_info")
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-rose-500/10 text-rose-400 border-rose-500/20";
};

const prettifyDecision = (decision) => {
  const d = (decision || "").toLowerCase();
  if (d === "pitch_call") return "Call for Pitch";
  if (d === "reserve_band" || d === "hold_need_info") return "Reserve Band";
  return "Reject";
};

const prettifyBusinessType = (t) =>
  (t || "").toLowerCase() === "startup" ? "Startup" : "Traditional";

const prettifyQualityTier = (tier) => {
  const t = (tier || "").toLowerCase();
  if (t === "strong") return "Strong";
  if (t === "promising") return "Promising";
  if (t === "average" || t === "moderate") return "Average";
  return "Weak";
};

const qualityBadgeClass = (tier) => {
  const t = (tier || "").toLowerCase();
  if (t === "strong")
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (t === "promising")
    return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
  if (t === "average" || t === "moderate")
    return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-rose-500/10 text-rose-300 border-rose-500/20";
};

const evidenceBadgeClass = (q) => {
  const s = String(q || "").toLowerCase();
  if (s === "high")
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (s === "medium")
    return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-rose-500/10 text-rose-300 border-rose-500/20";
};

const aiRiskBadgeClass = (label) => {
  const s = String(label || "").toLowerCase();
  if (s === "high") return "bg-rose-500/10 text-rose-300 border-rose-500/20";
  if (s === "medium")
    return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
};

const getBandClass = (band) => {
  const b = String(band || "").toUpperCase();
  if (b === "A")
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (b === "B")
    return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
  if (b === "C")
    return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-rose-500/10 text-rose-300 border-rose-500/20";
};

const scoreDeltaClass = (value) => {
  const v = Number(value) || 0;
  if (v > 0) return "text-emerald-400";
  if (v < 0) return "text-rose-400";
  return "text-gray-400";
};

// ------------------------------------------------------------
// SETTINGS MODAL
// ------------------------------------------------------------
const RowSlider = ({ label, value, onChange, hint }) => {
  const v = clamp01(value);
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-[180px]">
        <div className="text-xs text-gray-300 font-semibold">{label}</div>
        {hint ? (
          <div className="text-[11px] text-gray-500 leading-tight">{hint}</div>
        ) : null}
      </div>

      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={v}
        onChange={(e) => onChange(clamp01(e.target.value))}
        className="flex-1 accent-indigo-500"
      />

      <input
        value={String(v)}
        onChange={(e) => onChange(clamp01(e.target.value))}
        className="w-[72px] bg-[#0f0f16] border border-[#2d2d3f] rounded-lg px-2 py-1 text-xs text-gray-200 font-mono outline-none focus:border-indigo-500/50"
      />
    </div>
  );
};

const RowNumber = ({ label, value, onChange, hint }) => {
  const v = clamp010(value);
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-[180px]">
        <div className="text-xs text-gray-300 font-semibold">{label}</div>
        {hint ? (
          <div className="text-[11px] text-gray-500 leading-tight">{hint}</div>
        ) : null}
      </div>

      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={v}
        onChange={(e) => onChange(clamp010(e.target.value))}
        className="flex-1 accent-indigo-500"
      />

      <input
        value={String(to2(v))}
        onChange={(e) => onChange(clamp010(e.target.value))}
        className="w-[72px] bg-[#0f0f16] border border-[#2d2d3f] rounded-lg px-2 py-1 text-xs text-gray-200 font-mono outline-none focus:border-indigo-500/50"
      />
    </div>
  );
};

const SettingsModal = ({ open, onClose, value, onChange, onReset }) => {
  if (!open) return null;

  const strict = value?.strictness || {};
  const thr = value?.thresholds || {};

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-xl rounded-2xl overflow-hidden border border-[#2d2d3f] bg-[#0f0f16] shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2d2d3f] bg-[#13131f]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <SlidersHorizontal size={18} className="text-indigo-300" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Old Prompt Settings
              </div>
              <div className="text-xs text-gray-500">
                Old-form scoring strictness and thresholds.
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-[#2d2d3f]"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
            Strictness (0..1)
          </div>

          <div className="bg-[#13131f] border border-[#2d2d3f] rounded-xl px-4 py-3">
            <RowSlider
              label="Innovation"
              value={strict.innovation}
              onChange={(v) =>
                onChange({ ...value, strictness: { ...strict, innovation: v } })
              }
              hint="Penalize weak innovation claims"
            />
            <RowSlider
              label="Uniqueness"
              value={strict.uniqueness}
              onChange={(v) =>
                onChange({ ...value, strictness: { ...strict, uniqueness: v } })
              }
              hint="Differentiate from existing alternatives"
            />
            <RowSlider
              label="Employment Potential"
              value={strict.employment_potential}
              onChange={(v) =>
                onChange({
                  ...value,
                  strictness: { ...strict, employment_potential: v },
                })
              }
              hint="Job creation clarity"
            />
            <RowSlider
              label="Wealth Potential"
              value={strict.wealth_potential}
              onChange={(v) =>
                onChange({
                  ...value,
                  strictness: { ...strict, wealth_potential: v },
                })
              }
              hint="Revenue and market clarity"
            />
            <RowSlider
              label="Product Capability"
              value={strict.product_capability}
              onChange={(v) =>
                onChange({
                  ...value,
                  strictness: { ...strict, product_capability: v },
                })
              }
              hint="Ability to build real product"
            />
            <RowSlider
              label="Execution & Growth"
              value={strict.execution_growth}
              onChange={(v) =>
                onChange({
                  ...value,
                  strictness: { ...strict, execution_growth: v },
                })
              }
              hint="Prototype + growth plan realism"
            />
            <RowSlider
              label="Evidence"
              value={strict.evidence}
              onChange={(v) =>
                onChange({ ...value, strictness: { ...strict, evidence: v } })
              }
              hint="Pilot, traction, validation"
            />
            <RowSlider
              label="Clarity"
              value={strict.clarity}
              onChange={(v) =>
                onChange({ ...value, strictness: { ...strict, clarity: v } })
              }
              hint="Reduce vague statements"
            />
            <RowSlider
              label="Traditional Filter"
              value={strict.traditional_filter}
              onChange={(v) =>
                onChange({
                  ...value,
                  strictness: { ...strict, traditional_filter: v },
                })
              }
              hint="Penalize ordinary businesses"
            />
          </div>

          <div className="text-xs text-gray-500 uppercase tracking-wider mt-4 mb-2">
            Thresholds (0..10)
          </div>

          <div className="bg-[#13131f] border border-[#2d2d3f] rounded-xl px-4 py-3">
            <RowNumber
              label="Pitch Call"
              value={thr.pitch_call}
              onChange={(v) =>
                onChange({ ...value, thresholds: { ...thr, pitch_call: v } })
              }
              hint="Minimum final score for direct pitch"
            />
            <RowNumber
              label="Reserve Band"
              value={thr.reserve_band}
              onChange={(v) =>
                onChange({ ...value, thresholds: { ...thr, reserve_band: v } })
              }
              hint="Minimum final score for reserve list"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={onReset}
              className="text-xs px-3 py-2 rounded-lg border border-[#2d2d3f] text-gray-300 hover:bg-white/5"
            >
              Reset Defaults
            </button>

            <button
              onClick={onClose}
              className="text-xs px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ------------------------------------------------------------
// BATCH SELECTOR
// ------------------------------------------------------------
const BatchSelector = ({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  disabled,
}) => {
  return (
    <div className="rounded-2xl border border-[#2d2d3f] bg-[#13131f]/70 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CalendarDays size={18} className="text-emerald-300" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">
            Evaluation Batch Selection
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Data will be saved to{" "}
            <span className="font-mono text-indigo-300">
              {REVIEWS_ROOT}/{selectedYear}/{selectedMonth}/{"{sbNo}"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-xs text-gray-400">
          Month
          <select
            disabled={disabled}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="ml-2 min-w-[140px] bg-[#0f0f16] border border-[#2d2d3f] text-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 disabled:opacity-50"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs text-gray-400">
          Year
          <select
            disabled={disabled}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="ml-2 min-w-[110px] bg-[#0f0f16] border border-[#2d2d3f] text-gray-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500/50 disabled:opacity-50"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs">
          <FolderOpen size={14} />
          Batch: {selectedMonth} {selectedYear}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// DETAIL MODAL
// ------------------------------------------------------------
const DetailModal = ({ entry, onClose }) => {
  if (!entry) return null;

  const r = entry.apiResponse || {};
  const scores = r.scores || {};
  const calc = r.calculation_breakdown || {};
  const evidence = r.evidence_signals || {};
  const fraud = r.fraud_risk || {};
  const weighted = calc.weighted_contributions || {};
  const positive = calc.positive_signals || {};
  const negative = calc.negative_signals || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0f0f16] border border-[#2d2d3f] w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-[#2d2d3f] flex items-center justify-between bg-[#13131f]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white" size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {entry.entityName || "Unknown Startup"}
                <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                  {entry.regNo}
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-gray-400 text-sm">
                  Stage: <span className="text-emerald-400">{entry.stage}</span>
                </span>

                <span className="text-gray-600">•</span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDecisionPill(
                    r.decision
                  )}`}
                >
                  {prettifyDecision(r.decision)}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    r.business_type === "startup"
                      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {prettifyBusinessType(r.business_type)}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${qualityBadgeClass(
                    r.startup_quality
                  )}`}
                >
                  {prettifyQualityTier(r.startup_quality)}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBandClass(
                    r.score_band
                  )}`}
                >
                  Band {r.score_band || "D"}
                </span>

                <span className="text-gray-600">•</span>

                <span className="text-gray-400 text-sm">
                  Final:{" "}
                  <span className={`${getScoreColor(r.final_score)} font-bold font-mono`}>
                    {Number(r.final_score || 0).toFixed(1)}/10
                  </span>
                </span>

                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">Time: {entry.timeTaken}s</span>
              </div>

              {r.decision_reason ? (
                <p className="mt-2 text-sm text-gray-300 max-w-4xl">
                  {r.decision_reason}
                </p>
              ) : null}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Database size={16} /> Data Analyzed
                </h3>

                <div className="space-y-4 bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50">
                  <DataBlock title="Innovation Note" text={entry.inputData?.innovation_note} />
                  <DataBlock title="Uniqueness Note" text={entry.inputData?.uniqueness_note} />
                  <DataBlock
                    title="Employment Potential"
                    text={entry.inputData?.employment_potential_note}
                  />
                  <DataBlock
                    title="Wealth Potential"
                    text={entry.inputData?.wealth_potential_note}
                  />
                  <DataBlock
                    title="Product Development Capability"
                    text={entry.inputData?.product_development_capability_note}
                  />
                  <DataBlock
                    title="Success Stories / Prototype & Growth Plan"
                    text={entry.inputData?.success_stories_and_growth_plan}
                  />
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp size={16} /> Detailed Evaluation
                </h3>

                <div className="space-y-3">
                  {(r.ratings || []).map((rating, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1a1a2e] p-4 rounded-xl border border-[#2d2d3f] hover:border-indigo-500/30 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white">
                          {rating.criterion_label}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                              style={{ width: `${(Number(rating.score) / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-emerald-400 font-bold font-mono">
                            {Number(rating.score || 0).toFixed(1)}/10
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-indigo-500/20 pl-3">
                        {rating.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Calculator size={16} /> Score Breakdown
                </h3>

                <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <MetricCard label="Rubric Score" value={r.rubric_score} />
                    <MetricCard
                      label="Readiness Modifier"
                      value={r.readiness_modifier}
                      delta
                    />
                    <MetricCard label="Final Score" value={r.final_score} />
                  </div>

                  <BreakdownGrid title="Weighted Contributions" data={weighted} type="weighted" />
                  <BreakdownGrid title="Positive Signals" data={positive} type="positive" />
                  <BreakdownGrid title="Negative Signals" data={negative} type="negative" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <MetricCard label="Positive Total" value={calc.positive_total} positive />
                    <MetricCard label="Negative Total" value={calc.negative_total} negative />
                  </div>
                </div>
              </section>

              {r.missing_flags ? (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldAlert size={16} /> Missing Flags
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(r.missing_flags).map(([k, v]) => (
                      <div
                        key={k}
                        className={`p-3 rounded-xl border ${
                          v
                            ? "bg-rose-500/10 border-rose-500/20"
                            : "bg-[#1a1a2e] border-[#2d2d3f]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300 font-mono">{k}</span>
                          <span
                            className={`text-xs font-bold ${
                              v ? "text-rose-400" : "text-gray-500"
                            }`}
                          >
                            {v ? "MISSING" : "OK"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <div className="space-y-8">
              <section className="bg-gradient-to-br from-[#1a1a2e] to-[#13131f] p-6 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-900/10">
                <h3 className="text-indigo-300 font-semibold mb-3 flex items-center gap-2">
                  <Sparkles size={18} /> Executive Summary
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm italic">
                  "{r.summary || "No summary available."}"
                </p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BadgeInfo size={16} /> Decision
                </h3>
                <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 space-y-3">
                  <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                    <div className="text-xs text-gray-500">Decision Reason</div>
                    <div className="text-sm text-white mt-1">
                      {r.decision_reason || "—"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <MetricCard label="Qualifier Count" value={r.qualifier_count} plain />
                    <MetricCard label="Missing Flags" value={r.missing_flag_count} plain />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BarChart3 size={16} /> Evidence & Risk
                </h3>

                <div className="bg-[#1a1a2e] rounded-2xl border border-[#2d2d3f]/50 overflow-hidden">
                  <div className="p-4 border-b border-[#2d2d3f] flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${evidenceBadgeClass(
                        evidence.evidence_quality
                      )}`}
                    >
                      Evidence: {String(evidence.evidence_quality || "unknown").toUpperCase()}
                    </span>

                    <span
                      className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${aiRiskBadgeClass(
                        fraud.buzzword_risk_label
                      )}`}
                    >
                      <BrainCircuit size={14} />
                      Buzzword Risk:{" "}
                      {String(fraud.buzzword_risk_label || "low").toUpperCase()}
                    </span>
                  </div>

                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <MetricCard label="Evidence Score" value={evidence.evidence_score} plain />
                    <MetricCard label="Proof Strength" value={evidence.proof_strength} plain />
                    <MetricCard label="Numbers Count" value={evidence.numbers_count} plain />
                    <MetricCard label="Currency Mentions" value={evidence.currency_mentions} plain />
                    <MetricCard label="Dates Count" value={evidence.dates_count} plain />
                    <MetricCard label="Buzzword Count" value={fraud.buzzword_count} plain />
                  </div>

                  <div className="px-4 pb-4">
                    <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                      <div className="text-xs text-gray-300 font-mono mb-1">
                        traction_hits
                      </div>
                      <div className="text-xs text-gray-400">
                        {(evidence.traction_hits || []).length
                          ? evidence.traction_hits.join(", ")
                          : "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {r.strengths?.length ? (
                <ListSection
                  icon={ArrowUpRight}
                  title="Key Strengths"
                  titleClass="text-emerald-500"
                  items={r.strengths}
                  itemClass="border-emerald-500/10"
                  iconClass="text-emerald-500"
                />
              ) : null}

              {r.risks_and_gaps?.length ? (
                <ListSection
                  icon={ShieldAlert}
                  title="Risks & Gaps"
                  titleClass="text-rose-500"
                  items={r.risks_and_gaps}
                  itemClass="border-rose-500/10"
                  iconClass="text-rose-500"
                />
              ) : null}

              {r.pitch_questions?.length ? (
                <section>
                  <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Lightbulb size={16} /> Pitch Questions
                  </h3>
                  <div className="bg-[#1a1a2e] rounded-xl border border-amber-500/10 overflow-hidden">
                    {r.pitch_questions.map((q, i) => {
                      const question = typeof q === "string" ? q : q.question;
                      const why = typeof q === "string" ? "" : q.why_it_matters;
                      const evidenceExpected =
                        typeof q === "string" ? "" : q.expected_evidence;

                      return (
                        <div
                          key={i}
                          className="flex gap-4 p-4 border-b border-[#2d2d3f] last:border-0 hover:bg-[#202030] transition-colors"
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold shrink-0">
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-sm text-gray-200 font-medium">
                              {question}
                            </p>
                            {why ? (
                              <p className="text-xs text-gray-500 mt-2">
                                Why it matters: {why}
                              </p>
                            ) : null}
                            {evidenceExpected ? (
                              <p className="text-xs text-emerald-400/80 mt-1">
                                Expected evidence: {evidenceExpected}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {r.qualifiers ? (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp size={16} /> Qualifiers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(r.qualifiers).map(([k, v]) => (
                      <div
                        key={k}
                        className={`p-3 rounded-xl border ${
                          v
                            ? "bg-emerald-500/10 border-emerald-500/20"
                            : "bg-[#1a1a2e] border-[#2d2d3f]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300 font-mono">{k}</span>
                          <span
                            className={`text-xs font-bold ${
                              v ? "text-emerald-400" : "text-gray-500"
                            }`}
                          >
                            {v ? "YES" : "NO"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DataBlock = ({ title, text }) => (
  <div>
    <span className="text-xs text-indigo-400 block mb-1">{title}</span>
    <p className="text-sm text-gray-300 leading-relaxed">{text || "N/A"}</p>
  </div>
);

const MetricCard = ({ label, value, delta, positive, negative, plain }) => {
  let cls = "text-white";
  if (delta) cls = scoreDeltaClass(value);
  if (positive) cls = "text-emerald-400";
  if (negative) cls = "text-rose-400";

  const prefix = delta && Number(value) > 0 ? "+" : "";

  return (
    <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-lg font-mono mt-1 ${plain ? "text-white" : cls}`}>
        {prefix}
        {Number(value || 0).toFixed(plain ? 0 : 2)}
      </div>
    </div>
  );
};

const BreakdownGrid = ({ title, data, type }) => {
  const entries = Object.entries(data || {});
  if (!entries.length) return null;

  return (
    <div>
      <div
        className={`text-xs font-semibold mb-2 ${
          type === "positive"
            ? "text-emerald-300"
            : type === "negative"
            ? "text-rose-300"
            : "text-indigo-300"
        }`}
      >
        {title}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entries.map(([k, v]) => (
          <div
            key={k}
            className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]"
          >
            <div className="text-xs text-gray-500 font-mono">{k}</div>
            {type === "weighted" ? (
              <>
                <div className="text-sm text-white mt-1">
                  Score {Number(v?.score || 0).toFixed(1)} × Weight{" "}
                  {Number(v?.weight || 0).toFixed(2)}
                </div>
                <div className="text-sm font-mono text-indigo-300 mt-1">
                  = {Number(v?.contribution || 0).toFixed(2)}
                </div>
              </>
            ) : (
              <div
                className={`text-sm font-mono mt-1 ${
                  type === "positive" ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {type === "positive" ? "+" : "-"}
                {Number(v || 0).toFixed(2)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ListSection = ({ icon: Icon, title, titleClass, items, itemClass, iconClass }) => (
  <section>
    <h3
      className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${titleClass}`}
    >
      <Icon size={16} /> {title}
    </h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li
          key={i}
          className={`flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border ${itemClass}`}
        >
          <AlertTriangle size={16} className={`${iconClass} shrink-0 mt-0.5`} />
          {item}
        </li>
      ))}
    </ul>
  </section>
);

// ------------------------------------------------------------
// MAIN COMPONENT
// ------------------------------------------------------------
const AIReviewOldStyle = () => {
  const [file, setFile] = useState(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [processedData, setProcessedData] = useState([]);
  const [skippedCount, setSkippedCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(CURRENT_MONTH);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);

  const DEFAULT_REVIEW_CONFIG = useMemo(
    () => ({
      strictness: {
        innovation: 0.72,
        uniqueness: 0.72,
        employment_potential: 0.62,
        wealth_potential: 0.72,
        product_capability: 0.75,
        execution_growth: 0.75,
        evidence: 0.75,
        clarity: 0.7,
        traditional_filter: 0.68,
      },
      thresholds: {
        pitch_call: 7.1,
        reserve_band: 6.0,
      },
    }),
    []
  );

  const [reviewConfig, setReviewConfig] = useState(DEFAULT_REVIEW_CONFIG);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    readExcel(uploadedFile);
  };

  const readExcel = (f) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      setTotalEntries(jsonData.length);
      setProcessedCount(0);
      setProcessedData([]);
      setSkippedCount(0);
      setErrorCount(0);
      setIsProcessing(true);
      setIsComplete(false);

      processQueue(jsonData);
    };

    reader.readAsBinaryString(f);
  };

  const checkDataExists = async (sbNo) => {
    try {
      const path = getStartupReviewPath(selectedYear, selectedMonth, sbNo);
      const snap = await get(ref(rtdb, path));
      return snap.exists();
    } catch (error) {
      console.error("checkDataExists failed:", sbNo, error);
      return false;
    }
  };

  const saveEvaluationToRTDB = async ({
    regNo,
    entityName,
    stage,
    isRegisteredEntity,
    founderQualification,
    natureOfEntity,
    dateOfRegistration,
    roc,
    inputData,
    apiResult,
    apiResponseFull,
    serverMeta,
    timeTaken,
  }) => {
    const key = safeKey(regNo);
    const basePath = getStartupReviewPath(selectedYear, selectedMonth, key);
    const quick = buildQuickFields(apiResponseFull);

    const payload = {
      sbNo: regNo,
      entityName,
      stage,
      isRegisteredEntity,
      founderQualification,
      natureOfEntity,
      dateOfRegistration,
      roc,

      reviewYear: selectedYear,
      reviewMonth: selectedMonth,
      batchLabel: `${selectedMonth} ${selectedYear}`,
      batchPath: getBatchPath(selectedYear, selectedMonth),

      answers: inputData,
      api: apiResult,
      apiMeta: {
        ...(serverMeta || {}),
        reviewedMonth: selectedMonth,
        reviewedYear: selectedYear,
        batchLabel: `${selectedMonth} ${selectedYear}`,
        reviewedAt: Date.now(),
      },
      review: apiResponseFull,
      quick,

      createdAt: Date.now(),
      updatedAt: Date.now(),
      timeTaken,
    };

    const updates = {};
    updates[basePath] = payload;

    // Optional lightweight index for navigation across batches.
    updates[`${REVIEWS_ROOT}Index/${key}/${selectedYear}_${selectedMonth}`] = {
      sbNo: regNo,
      entityName,
      decision: apiResponseFull?.decision || "reject",
      final_score: apiResponseFull?.final_score ?? apiResponseFull?.overall_score ?? 0,
      score_band: apiResponseFull?.score_band || "",
      reviewYear: selectedYear,
      reviewMonth: selectedMonth,
      batchPath: basePath,
      updatedAt: Date.now(),
    };

    await update(ref(rtdb), updates);
  };

  const processQueue = async (rows) => {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const startTime = performance.now();

      const regNo =
        asStr(pick(row, STD_COLS.sbNo)) ||
        `SB${new Date().getFullYear()}${String(i + 1).padStart(6, "0")}`;

      const entityName = asStr(pick(row, STD_COLS.entityName)) || "Unknown Startup";
      const stage = asStr(pick(row, STD_COLS.stage)) || "Ideation";
      const isRegisteredEntity = asStr(pick(row, STD_COLS.isRegisteredEntity));
      const founderQualification = asStr(pick(row, STD_COLS.founderQualification));
      const natureOfEntity = asStr(pick(row, STD_COLS.natureOfEntity));
      const dateOfRegistration = asStr(pick(row, STD_COLS.dateOfRegistration));
      const roc = asStr(pick(row, STD_COLS.roc));

      const innovation_note = asStr(pick(row, STD_COLS.innovation_note));
      const uniqueness_note = asStr(pick(row, STD_COLS.uniqueness_note));
      const employment_potential_note = asStr(
        pick(row, STD_COLS.employment_potential_note)
      );
      const wealth_potential_note = asStr(pick(row, STD_COLS.wealth_potential_note));
      const product_development_capability_note = asStr(
        pick(row, STD_COLS.product_development_capability_note)
      );
      const success_stories_and_growth_plan = asStr(
        pick(row, STD_COLS.success_stories_and_growth_plan)
      );

      const inputData = {
        innovation_note,
        uniqueness_note,
        employment_potential_note,
        wealth_potential_note,
        product_development_capability_note,
        success_stories_and_growth_plan,
      };

      const anyAnswerPresent = Object.values(inputData).some((v) => asStr(v));

      if (!regNo || !anyAnswerPresent) {
        setProcessedCount(i + 1);
        setSkippedCount((prev) => prev + 1);
        continue;
      }

      const exists = await checkDataExists(regNo);
      if (exists) {
        console.log(`Skipped existing ${selectedMonth} ${selectedYear}:`, regNo);
        setProcessedCount(i + 1);
        setSkippedCount((prev) => prev + 1);
        continue;
      }

      let apiResponseFull = null;
      let isError = false;
      let serverMeta = null;
      let apiResult = null;

      try {
        const response = await fetch("https://nsbot.online/prompt-old", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sbNo: String(regNo),
            answers: {
              // Identity and metadata
              startupName: entityName,
              sectorCategory: "",
              startupStage: stage,

              // Old form aliases expected by upgraded backend
              innovation: innovation_note,
              uniqueness: uniqueness_note,
              employmentPotential: employment_potential_note,
              wealthPotential: wealth_potential_note,
              productCapability: product_development_capability_note,
              executionGrowth: success_stories_and_growth_plan,

              // Additional metadata
              isRegistered: normalizeBoolean(isRegisteredEntity),
              hasRegisteredEntity: normalizeBoolean(isRegisteredEntity),
              teamSize: 0,
              qualification: founderQualification,
              institution: "",
              coFounderCount: 0,
              isSoleFounder: false,
              coFounders: "",

              // Keep raw old headers also for audit compatibility
              innovation_note,
              uniqueness_note,
              employment_potential_note,
              wealth_potential_note,
              product_development_capability_note,
              success_stories_and_growth_plan,

              natureOfEntity,
              dateOfRegistration,
              roc,
            },
            review_config: reviewConfig,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error("prompt-old failed:", response.status, errText);
          isError = true;
          setErrorCount((prev) => prev + 1);
        } else {
          apiResult = await response.json();

          if (apiResult?.response?.ratings) {
            apiResponseFull = apiResult.response;
            serverMeta = apiResult.meta || null;

            const endTime = performance.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);

            await saveEvaluationToRTDB({
              regNo,
              entityName,
              stage,
              isRegisteredEntity,
              founderQualification,
              natureOfEntity,
              dateOfRegistration,
              roc,
              inputData,
              apiResult,
              apiResponseFull,
              serverMeta,
              timeTaken: duration,
            });
          } else {
            console.error("prompt-old invalid payload:", apiResult);
            isError = true;
            setErrorCount((prev) => prev + 1);
          }
        }
      } catch (err) {
        console.error("Fetch/save error:", err);
        isError = true;
        setErrorCount((prev) => prev + 1);
      }

      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      const newEntry = {
        sNo: i + 1,
        regNo,
        entityName,
        stage,
        isRegisteredEntity,
        founderQualification,
        natureOfEntity,
        dateOfRegistration,
        roc,
        reviewMonth: selectedMonth,
        reviewYear: selectedYear,
        batchLabel: `${selectedMonth} ${selectedYear}`,
        decision: apiResponseFull?.decision ?? "reject",
        business_type: apiResponseFull?.business_type ?? "traditional",
        startup_quality: apiResponseFull?.startup_quality ?? "weak",
        final_score:
          apiResponseFull?.final_score ?? apiResponseFull?.overall_score ?? 0,
        rubric_score: apiResponseFull?.rubric_score ?? 0,
        readiness_modifier: apiResponseFull?.readiness_modifier ?? 0,
        score_band: apiResponseFull?.score_band ?? "D",
        decision_reason: apiResponseFull?.decision_reason ?? "",
        timeTaken: duration,
        isError,
        apiResponse: apiResponseFull,
        serverMeta,
        inputData,
      };

      setProcessedData((prev) => [...prev, newEntry]);
      setProcessedCount(i + 1);
    }

    setIsProcessing(false);
    setIsComplete(true);
  };

  const buildQuickFields = (r = {}) => ({
    decision: r.decision || "reject",
    decision_reason: r.decision_reason || "",
    business_type: r.business_type || "traditional",
    startup_quality: r.startup_quality || "weak",
    score_band: r.score_band || "D",
    final_score: r.final_score ?? r.overall_score ?? 0,
    rubric_score: r.rubric_score ?? 0,
    readiness_modifier: r.readiness_modifier ?? 0,
    qualifier_count: r.qualifier_count ?? 0,
    missing_flag_count: r.missing_flag_count ?? 0,

    innovation_score: r.scores?.innovation ?? 0,
    uniqueness_score: r.scores?.uniqueness ?? 0,
    employment_potential_score: r.scores?.employment_potential ?? 0,
    wealth_potential_score: r.scores?.wealth_potential ?? 0,
    product_capability_score: r.scores?.product_capability ?? 0,
    execution_growth_score: r.scores?.execution_growth ?? 0,

    evidence_quality: r.evidence_signals?.evidence_quality || "",
    evidence_score: r.evidence_signals?.evidence_score ?? 0,
    proof_strength: r.evidence_signals?.proof_strength ?? 0,
    buzzword_risk: r.fraud_risk?.buzzword_risk ?? 0,
    buzzword_risk_label: r.fraud_risk?.buzzword_risk_label || "",
  });

  const ratingsToCols = (ratings) => {
    const map = {};
    (ratings || []).forEach((r) => {
      const key = r?.criterion_key || r?.criterion_label || "unknown";
      const label = r?.criterion_label || key;
      map[`Score - ${label}`] = Number(r?.score ?? 0);
      map[`Reason - ${label}`] = r?.reason || "";
    });
    return map;
  };

  const breakdownToCols = (calc = {}) => {
    const out = {};
    const weighted = calc.weighted_contributions || {};
    const positive = calc.positive_signals || {};
    const negative = calc.negative_signals || {};

    Object.entries(weighted).forEach(([k, v]) => {
      out[`Weighted - ${k} Score`] = Number(v?.score ?? 0);
      out[`Weighted - ${k} Weight`] = Number(v?.weight ?? 0);
      out[`Weighted - ${k} Contribution`] = Number(v?.contribution ?? 0);
    });

    Object.entries(positive).forEach(([k, v]) => {
      out[`Positive - ${k}`] = Number(v ?? 0);
    });

    Object.entries(negative).forEach(([k, v]) => {
      out[`Negative - ${k}`] = Number(v ?? 0);
    });

    out["Positive Total"] = Number(calc.positive_total ?? 0);
    out["Negative Total"] = Number(calc.negative_total ?? 0);
    return out;
  };

  const downloadReport = () => {
    if (processedData.length === 0) return;

    const rows = processedData.map((item) => {
      const r = item.apiResponse || {};
      const s = r.scores || {};
      const ev = r.evidence_signals || {};
      const fr = r.fraud_risk || {};
      const calc = r.calculation_breakdown || {};

      return {
        "S. No": item.sNo,
        "Registration No": item.regNo,
        "Entity Name": item.entityName,
        "Evaluation Month": item.reviewMonth,
        "Evaluation Year": item.reviewYear,
        "Batch Label": item.batchLabel,
        "RTDB Path": getStartupReviewPath(item.reviewYear, item.reviewMonth, item.regNo),

        "Stage": item.stage,
        "Is Registered Entity": item.isRegisteredEntity || "",
        "Founder Qualification": item.founderQualification || "",
        "Nature Of Entity": item.natureOfEntity || "",
        "Date Of Registration": item.dateOfRegistration || "",
        "ROC": item.roc || "",

        "Decision": prettifyDecision(r.decision || item.decision),
        "Decision Raw": r.decision || item.decision,
        "Decision Reason": r.decision_reason || item.decision_reason || "",
        "Business Type": prettifyBusinessType(r.business_type || item.business_type),
        "Startup Quality": prettifyQualityTier(r.startup_quality || item.startup_quality),
        "Score Band": r.score_band || item.score_band,

        "Final Score": Number(r.final_score ?? item.final_score ?? 0),
        "Rubric Score": Number(r.rubric_score ?? item.rubric_score ?? 0),
        "Readiness Modifier": Number(
          r.readiness_modifier ?? item.readiness_modifier ?? 0
        ),

        "Innovation Score": Number(s.innovation ?? 0),
        "Uniqueness Score": Number(s.uniqueness ?? 0),
        "Employment Potential Score": Number(s.employment_potential ?? 0),
        "Wealth Potential Score": Number(s.wealth_potential ?? 0),
        "Product Capability Score": Number(s.product_capability ?? 0),
        "Execution Growth Score": Number(s.execution_growth ?? 0),

        "Qualifier Count": Number(r.qualifier_count ?? 0),
        "Missing Flag Count": Number(r.missing_flag_count ?? 0),

        "Evidence Quality": ev.evidence_quality || "",
        "Evidence Score": Number(ev.evidence_score ?? 0),
        "Proof Strength": Number(ev.proof_strength ?? 0),
        "Numbers Count": Number(ev.numbers_count ?? 0),
        "Currency Mentions": Number(ev.currency_mentions ?? 0),
        "Dates Count": Number(ev.dates_count ?? 0),
        "Traction Hits": joinArr(ev.traction_hits),

        "Buzzword Risk Label": fr.buzzword_risk_label || "",
        "Buzzword Risk": Number(fr.buzzword_risk ?? 0),
        "Buzzword Count": Number(fr.buzzword_count ?? 0),
        "Proof Count": Number(fr.proof_count ?? 0),
        "Strong Proof Count": Number(fr.strong_proof_count ?? 0),
        "Possible Claim Inflation": Boolean(fr.possible_claim_inflation),

        "Strengths": joinArr(r.strengths),
        "Risks & Gaps": joinArr(r.risks_and_gaps),
        "Pitch Questions": joinArr(r.pitch_questions),
        "Summary": r.summary || "",

        "Input - Innovation Note": asText(item.inputData?.innovation_note),
        "Input - Uniqueness Note": asText(item.inputData?.uniqueness_note),
        "Input - Employment Potential Note": asText(
          item.inputData?.employment_potential_note
        ),
        "Input - Wealth Potential Note": asText(item.inputData?.wealth_potential_note),
        "Input - Product Development Capability Note": asText(
          item.inputData?.product_development_capability_note
        ),
        "Input - Success Stories / Growth Plan": asText(
          item.inputData?.success_stories_and_growth_plan
        ),

        "Time Taken (s)": Number(item.timeTaken ?? 0),
        "Server Total Duration": item.serverMeta?.total_duration || "",

        ...breakdownToCols(calc),
        ...ratingsToCols(r.ratings),
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Startup_Review_Old");
    XLSX.writeFile(
      wb,
      `NSBot_Old_Form_Review_${selectedMonth}_${selectedYear}_${Date.now()}.xlsx`
    );
  };

  const resetUpload = () => {
    setFile(null);
    setProcessedData([]);
    setTotalEntries(0);
    setProcessedCount(0);
    setSkippedCount(0);
    setErrorCount(0);
    setIsProcessing(false);
    setIsComplete(false);
    setSelectedEntry(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetSettings = () => setReviewConfig(DEFAULT_REVIEW_CONFIG);

  return (
    <div className="mt-6 mb-8 relative overflow-hidden rounded-3xl bg-[#0a0a12] border border-[#2d2d3f] shadow-2xl min-h-[600px] flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
      </div>

      <div className="relative z-10 p-8 flex flex-col flex-1">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex flex-wrap items-center gap-2">
                NSBot First Screening
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-semibold">
                  Old Form
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase tracking-widest font-semibold">
                  Batch: {selectedMonth} {selectedYear}
                </span>
              </h2>
              <p className="text-gray-400 text-sm">
                Upload old 6-point Excel and save results month-wise in RTDB.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg border border-[#2d2d3f] bg-[#13131f] hover:bg-white/5 text-gray-300"
              title="Old Prompt Settings"
            >
              <Settings size={18} />
            </button>

            {(isProcessing || isComplete) && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a2e] border border-[#2d2d3f] rounded-lg">
                  <FileSpreadsheet size={14} className="text-emerald-500" />
                  <span className="text-xs text-gray-400 font-mono truncate max-w-[150px]">
                    {file?.name}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`text-sm font-semibold ${
                      isComplete ? "text-emerald-400" : "text-indigo-400"
                    }`}
                  >
                    {isComplete ? "Evaluation Complete" : "NSBot is evaluating..."}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {processedCount} / {totalEntries} Entries
                  </span>
                </div>

                <div className="w-12 h-12 rounded-full bg-[#1e1e2d] border border-[#2d2d3f] flex items-center justify-center relative">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#2d2d3f]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className={`${
                        isComplete ? "text-emerald-500" : "text-indigo-500"
                      } transition-all duration-500 ease-out`}
                      strokeDasharray={`${
                        (processedCount / Math.max(totalEntries, 1)) * 100
                      }, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                  {isComplete ? (
                    <CheckCircle2 size={16} className="text-emerald-500 absolute" />
                  ) : (
                    <Loader size={16} className="text-indigo-500 absolute animate-spin" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <BatchSelector
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            disabled={isProcessing}
          />
        </div>

        {!file ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div
              className="border-2 border-dashed border-[#2d2d3f] bg-[#13131f]/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center hover:border-indigo-500/50 hover:bg-[#1a1a2e] transition-all group cursor-pointer w-full max-w-2xl"
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="hidden"
                ref={fileInputRef}
              />

              <div className="w-24 h-24 rounded-full bg-[#1e1e2d] group-hover:bg-[#252538] flex items-center justify-center mb-8 transition-all shadow-xl shadow-black/20 group-hover:scale-110 duration-300 border border-[#2d2d3f]">
                <Upload className="text-indigo-400" size={40} />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                Upload Old Prompt Excel
              </h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Evaluation batch:{" "}
                <span className="text-indigo-300 font-semibold">
                  {selectedMonth} {selectedYear}
                </span>
                . Results will be saved month-wise in RTDB.
              </p>

              <button className="mt-8 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/20">
                Browse Files
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4 gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {isProcessing && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1a2e] border border-[#2d2d3f] rounded-lg">
                    <ThinkingIndicator elapsedLabel="NSBot" />
                    <span className="text-sm text-gray-300 animate-pulse">
                      Evaluating Entry #{processedCount + 1}...
                    </span>
                  </div>
                )}

                {isComplete && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-medium">
                      Evaluation Completed
                    </span>
                  </div>
                )}

                <div className="text-xs text-gray-500 font-mono px-3 py-2 rounded-lg border border-[#2d2d3f] bg-[#13131f]">
                  Saved: {processedData.length} | Skipped: {skippedCount} | Errors:{" "}
                  {errorCount}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadReport}
                  disabled={processedData.length === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg ${
                    processedData.length > 0
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                      : "bg-[#1e1e2d] text-gray-500 cursor-not-allowed border border-[#2d2d3f]"
                  }`}
                >
                  <Download size={16} />
                  Download Report
                </button>

                <button
                  onClick={resetUpload}
                  className="p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-[#2d2d3f]"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#13131f] border border-[#2d2d3f] rounded-2xl overflow-hidden shadow-xl flex flex-col">
              <div className="overflow-x-auto custom-scrollbar flex-1">
                <table className="w-full text-left text-sm text-gray-400 relative">
                  <thead className="text-xs uppercase bg-[#0f0f16] text-gray-500 sticky top-0 z-10">
                    <tr>
                      <TableHead>S. No</TableHead>
                      <TableHead>Registration No</TableHead>
                      <TableHead>Startup Name</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Decision</TableHead>
                      <TableHead>Band</TableHead>
                      <TableHead>Final</TableHead>
                      <TableHead>Rubric</TableHead>
                      <TableHead>Modifier</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quality</TableHead>
                      <TableHead>Innovation</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Execution</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Time</TableHead>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#2d2d3f]">
                    {processedData.map((row, idx) => {
                      const r = row.apiResponse || {};
                      const s = r.scores || {};

                      return (
                        <motion.tr
                          key={`${row.regNo}-${idx}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-[#1a1a2e] cursor-pointer group"
                          onClick={() => setSelectedEntry(row)}
                        >
                          <TableCell mono muted>{row.sNo}</TableCell>
                          <TableCell mono highlight>{row.regNo}</TableCell>
                          <TableCell strong>{row.entityName}</TableCell>
                          <TableCell>
                            {row.reviewMonth} {row.reviewYear}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              {row.stage}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDecisionPill(
                                row.decision
                              )}`}
                            >
                              {prettifyDecision(row.decision)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBandClass(
                                row.score_band
                              )}`}
                            >
                              {row.score_band || "D"}
                            </span>
                          </TableCell>
                          <TableCell center className={getScoreColor(row.final_score)}>
                            {Number(row.final_score || 0).toFixed(1)}
                          </TableCell>
                          <TableCell center className="text-indigo-300">
                            {Number(row.rubric_score || 0).toFixed(1)}
                          </TableCell>
                          <TableCell
                            center
                            className={scoreDeltaClass(row.readiness_modifier)}
                          >
                            {Number(row.readiness_modifier || 0) > 0 ? "+" : ""}
                            {Number(row.readiness_modifier || 0).toFixed(1)}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                row.business_type === "startup"
                                  ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              }`}
                            >
                              {prettifyBusinessType(row.business_type)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${qualityBadgeClass(
                                row.startup_quality
                              )}`}
                            >
                              {prettifyQualityTier(row.startup_quality)}
                            </span>
                          </TableCell>
                          <TableCell center className={getScoreColor(s.innovation)}>
                            {Number(s.innovation || 0).toFixed(1)}
                          </TableCell>
                          <TableCell center className={getScoreColor(s.product_capability)}>
                            {Number(s.product_capability || 0).toFixed(1)}
                          </TableCell>
                          <TableCell center className={getScoreColor(s.execution_growth)}>
                            {Number(s.execution_growth || 0).toFixed(1)}
                          </TableCell>
                          <TableCell className="max-w-sm truncate">
                            {r.decision_reason || "—"}
                          </TableCell>
                          <TableCell center className="text-blue-400 text-xs">
                            {row.timeTaken}s
                          </TableCell>
                        </motion.tr>
                      );
                    })}

                    <tr className="h-4"></tr>
                  </tbody>
                </table>

                {processedData.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    {isProcessing ? (
                      <Loader
                        className="animate-spin mb-4 text-indigo-500 opacity-50"
                        size={32}
                      />
                    ) : (
                      <FileSpreadsheet className="mb-4 text-indigo-500 opacity-50" size={32} />
                    )}
                    <p>
                      {isProcessing
                        ? "Evaluating or skipping already-existing records..."
                        : "No evaluated records yet."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {selectedEntry && (
            <DetailModal
              entry={selectedEntry}
              onClose={() => setSelectedEntry(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {settingsOpen && (
            <SettingsModal
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              value={reviewConfig}
              onChange={setReviewConfig}
              onReset={resetSettings}
            />
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f0f16;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2d2d3f;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f5a;
        }
      `}</style>
    </div>
  );
};

const TableHead = ({ children }) => (
  <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">
    {children}
  </th>
);

const TableCell = ({
  children,
  mono,
  muted,
  highlight,
  strong,
  center,
  className = "",
}) => {
  const cls = [
    "px-6 py-4 whitespace-nowrap",
    mono ? "font-mono" : "",
    muted ? "text-gray-500" : "",
    highlight ? "text-gray-300 group-hover:text-indigo-400 transition-colors" : "",
    strong ? "font-medium text-white" : "",
    center ? "text-center font-mono" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <td className={cls}>{children}</td>;
};

export default AIReviewOldStyle;
