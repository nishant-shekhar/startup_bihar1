// src/pages/AIReviewedData.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import {
  Search,
  X,
  Upload,
  Download,
  CheckCircle2,
  ArrowUpDown,
  CalendarDays,
  FolderOpen,
  FileText,
  Info,
  Database,
  TrendingUp,
  Target,
  Calculator,
  BarChart3,
  BrainCircuit,
  ShieldAlert,
  AlertTriangle,
  ClipboardCopy,
  ListChecks,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Gauge,
  Pencil,
  Trash2,
} from "lucide-react";
import { ref, onValue, update } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { rtdb } from "./firebase"; // adjust if needed
import PitchingPanelWindow from "./PitchingPanelWindow";

// ------------------------------------------------------------
// RTDB STRUCTURE
// ------------------------------------------------------------
const REVIEWS_ROOT = "StartupReviews";
const SHORTLIST_ROOT = "ssu_shortlists";
const PANELS_ROOT = "GlobalParameter/Panels";
const AI_HIDDEN_ROOT = "GlobalParameter/AIHidden";

// Reviewed data: StartupReviews/{year}/{month}/{sbNo}
// Pitch deck: StartupReviews/{year}/{month}/{sbNo}/Pitch Deck and PitchDekh
// Panels: GlobalParameter/Panels/{PanelID}/{MemberID}/{Name, designation}
// Pitch review is saved by PitchingPanelWindow.jsx

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

const safeKey = (k) => String(k || "").replace(/[.#$/\[\]]/g, "_");
const clamp010 = (v) => Math.max(0, Math.min(10, Number(v) || 0));
const to2 = (v) => Math.round((Number(v) || 0) * 100) / 100;
const getBatchPath = (year, month) => `${REVIEWS_ROOT}/${year}/${month}`;
const getStartupReviewPath = (year, month, sbNo) =>
  `${REVIEWS_ROOT}/${year}/${month}/${safeKey(sbNo)}`;
const getShortlistPath = (year, month, sbNo) =>
  `${SHORTLIST_ROOT}/${year}/${month}/${safeKey(sbNo)}`;

const readBool = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    return value === "true";
  } catch {
    return fallback;
  }
};

const writeBool = (key, value) => {
  try {
    localStorage.setItem(key, String(Boolean(value)));
  } catch {
    // ignored
  }
};

const passEnum = (val, filter) =>
  filter === "all" ||
  String(val || "").toLowerCase() === String(filter || "").toLowerCase();

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

// ------------------------------------------------------------
// DATA EXTRACTION
// ------------------------------------------------------------
const getApiResponse = (record) =>
  record?.review ||
  record?.api?.response ||
  record?.apiResponse ||
  record?.apiResult?.response ||
  record?.response ||
  {};

const getAnswers = (record) =>
  record?.answers || record?.inputData?.answers || record?.inputData || {};

const getQuick = (record) => record?.quick || {};

const getFinalScore = (record, response) => {
  const q = getQuick(record);
  return Number(
    response?.final_score ??
      response?.overall_score ??
      q?.final_score ??
      q?.overall_score ??
      record?.final_score ??
      record?.overall_score ??
      0
  );
};

const getRubricScore = (record, response) => {
  const q = getQuick(record);
  return Number(
    response?.rubric_score ??
      q?.rubric_score ??
      record?.rubric_score ??
      response?.scores?.overall_llm ??
      0
  );
};

const getReadinessModifier = (record, response) => {
  const q = getQuick(record);
  return Number(
    response?.readiness_modifier ??
      q?.readiness_modifier ??
      record?.readiness_modifier ??
      0
  );
};

const getDecision = (record, response) => {
  const q = getQuick(record);
  return response?.decision || q?.decision || record?.decision || "reject";
};

const getBusinessType = (record, response) => {
  const q = getQuick(record);
  return (
    response?.business_type || q?.business_type || record?.business_type || "traditional"
  );
};

const getQuality = (record, response) => {
  const q = getQuick(record);
  return (
    response?.startup_quality ||
    response?.quality_tier ||
    q?.startup_quality ||
    record?.startup_quality ||
    record?.quality_tier ||
    "weak"
  );
};

const getScoreBand = (record, response) => {
  const q = getQuick(record);
  return response?.score_band || q?.score_band || record?.score_band || "D";
};

const getDecisionReason = (record, response) => {
  const q = getQuick(record);
  return response?.decision_reason || q?.decision_reason || record?.decision_reason || "";
};

const getEvidence = (record, response) => {
  const realism = response?.realism || record?.realism || {};
  return response?.evidence_signals || realism?.evidence_signals || {};
};

const getEvidenceQuality = (record, response) => {
  const q = getQuick(record);
  const realism = response?.realism || record?.realism || {};
  return (
    response?.evidence_signals?.evidence_quality ||
    realism?.evidence_quality ||
    q?.evidence_quality ||
    record?.evidence_quality ||
    ""
  );
};

const getFraudRisk = (record, response) =>
  response?.fraud_risk || response?.realism?.ai_assistance_risk || record?.fraud_risk || {};

const getAiRiskLabel = (record, response) => {
  const q = getQuick(record);
  const fr = getFraudRisk(record, response);
  return fr?.buzzword_risk_label || fr?.label || q?.buzzword_risk_label || record?.ai_risk || "";
};

const getScores = (record, response) => {
  const q = getQuick(record);
  const s = response?.scores || {};
  return {
    innovation: Number(s.innovation ?? s.innovation_depth ?? q.innovation_score ?? 0),
    uniqueness: Number(s.uniqueness ?? q.uniqueness_score ?? 0),
    employment_potential: Number(s.employment_potential ?? q.employment_potential_score ?? 0),
    wealth_potential: Number(s.wealth_potential ?? q.wealth_potential_score ?? 0),
    product_capability: Number(
      s.product_capability ?? s.solution_strength ?? q.product_capability_score ?? 0
    ),
    execution_growth: Number(
      s.execution_growth ?? s.execution_readiness ?? q.execution_score ?? 0
    ),
    team_capability: Number(s.team_capability ?? q.team_score ?? 0),
  };
};

const getPitchDeckUrl = (record) => {
  return (
    record?.["Pitch Deck"] ||
    record?.PitchDekh ||
    record?.PitchDeck ||
    record?.pitchDeckUrl ||
    record?.pitch_deck_url ||
    record?.pitchDeckLink ||
    record?.files?.pitchDeckURL ||
    record?.files?.pitchDeckUrl ||
    record?.answers?.pitchDeckURL ||
    record?.answers?.pitchDeckUrl ||
    ""
  );
};

const getPitchDeckName = (record) => {
  return (
    record?.["Pitch Deck Meta"]?.fileName ||
    record?.PitchDeckMeta?.fileName ||
    record?.pitchDeckFileName ||
    record?.files?.pitchDeckFileName ||
    "Pitch Deck"
  );
};

const getPitchDeckStoragePath = (record) => {
  return (
    record?.["Pitch Deck Meta"]?.storagePath ||
    record?.PitchDeckMeta?.storagePath ||
    record?.pitchDeckStoragePath ||
    record?.files?.pitchDeckStoragePath ||
    ""
  );
};
const normalizePitchQuestion = (q) => {
  if (typeof q === "string") {
    return { question: q, why_it_matters: "", expected_evidence: "" };
  }
  if (q && typeof q === "object") {
    return {
      question: q.question || "",
      why_it_matters: q.why_it_matters || "",
      expected_evidence: q.expected_evidence || "",
    };
  }
  return { question: "", why_it_matters: "", expected_evidence: "" };
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

const scoreDeltaClass = (value) => {
  const v = Number(value) || 0;
  if (v > 0) return "text-emerald-400";
  if (v < 0) return "text-rose-400";
  return "text-gray-400";
};

const getDecisionPill = (decision) => {
  const d = (decision || "").toLowerCase();
  if (d === "pitch_call") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (d === "reserve_band" || d === "hold_need_info") {
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
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
  if (t === "strong") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (t === "promising") return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
  if (t === "average" || t === "moderate") return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-rose-500/10 text-rose-300 border-rose-500/20";
};

const evidenceBadgeClass = (q) => {
  const s = String(q || "").toLowerCase();
  if (s === "high") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (s === "medium") return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-rose-500/10 text-rose-300 border-rose-500/20";
};

const aiRiskBadgeClass = (label) => {
  const s = String(label || "").toLowerCase();
  if (s === "high") return "bg-rose-500/10 text-rose-300 border-rose-500/20";
  if (s === "medium") return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
};

const getBandClass = (band) => {
  const b = String(band || "").toUpperCase();
  if (b === "A") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (b === "B") return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
  if (b === "C") return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-rose-500/10 text-rose-300 border-rose-500/20";
};

const ToggleSwitch = ({ checked, onChange, label, subLabel, iconOn, iconOff }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`inline-flex items-center gap-3 px-3 py-2 rounded-xl border text-left transition ${
      checked
        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
        : "bg-rose-500/10 border-rose-500/20 text-rose-200"
    }`}
  >
    <span
      className={`w-10 h-5 rounded-full relative transition ${
        checked ? "bg-emerald-500/50" : "bg-rose-500/50"
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </span>
    <span className="flex items-center gap-2">
      {checked ? iconOn : iconOff}
      <span>
        <span className="block text-xs font-semibold">{label}</span>
        {subLabel ? <span className="block text-[10px] opacity-70">{subLabel}</span> : null}
      </span>
    </span>
  </button>
);

const Th = ({ label, children, onClick, className = "" }) => (
  <th
    onClick={onClick}
    className={`px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16] cursor-pointer select-none ${className}`}
    title="Click to sort"
  >
    <div className="flex items-center gap-2">
      <span>{label}</span>
      {children}
    </div>
  </th>
);

const Select = ({ label, value, onChange, options }) => (
  <label className="flex flex-col gap-1">
    <span className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-[#0f0f16] border border-[#2d2d3f] rounded-xl px-3 py-2 text-xs text-gray-200 outline-none focus:border-indigo-500/50"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o === "all" ? "All" : String(o)}
        </option>
      ))}
    </select>
  </label>
);

const Meta = ({ label, value }) => (
  <div>
    <div className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</div>
    <div className="text-sm text-gray-200 mt-1">{value || "—"}</div>
  </div>
);

const DataBlock = ({ title, text }) => (
  <div>
    <span className="text-xs text-indigo-400 block mb-1">{title}</span>
    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
      {text || "N/A"}
    </p>
  </div>
);

const MetricCard = ({ label, value, delta, plain }) => {
  const n = Number(value || 0);
  const prefix = delta && n > 0 ? "+" : "";
  const cls = delta ? scoreDeltaClass(n) : "text-white";

  return (
    <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-lg font-mono mt-1 ${plain ? "text-white" : cls}`}>
        {prefix}
        {Number(n).toFixed(plain ? 0 : 2)}
      </div>
    </div>
  );
};

const ListSection = ({ icon: Icon, title, titleClass, items, itemClass, iconClass }) => (
  <section>
    <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2 ${titleClass}`}>
      <Icon size={16} /> {title}
    </h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className={`flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border ${itemClass}`}>
          <AlertTriangle size={16} className={`${iconClass} shrink-0 mt-0.5`} />
          {item}
        </li>
      ))}
    </ul>
  </section>
);

const BreakdownGrid = ({ title, data, type }) => {
  const entries = Object.entries(data || {});
  if (!entries.length) return null;

  return (
    <div>
      <div
        className={`text-xs font-semibold mb-2 ${
          type === "positive" ? "text-emerald-300" : type === "negative" ? "text-rose-300" : "text-indigo-300"
        }`}
      >
        {title}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entries.map(([k, v]) => (
          <div key={k} className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
            <div className="text-xs text-gray-500 font-mono">{k}</div>

            {type === "weighted" ? (
              <>
                <div className="text-sm text-white mt-1">
                  Score {Number(v?.score || 0).toFixed(1)} × Weight {Number(v?.weight || 0).toFixed(2)}
                </div>
                <div className="text-sm font-mono text-indigo-300 mt-1">
                  = {Number(v?.contribution || 0).toFixed(2)}
                </div>
              </>
            ) : (
              <div className={`text-sm font-mono mt-1 ${type === "positive" ? "text-emerald-400" : "text-rose-400"}`}>
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

const BatchSelector = ({ selectedMonth, setSelectedMonth, selectedYear, setSelectedYear, disabled }) => (
  <div className="rounded-2xl border border-[#2d2d3f] bg-[#13131f]/70 p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <CalendarDays size={18} className="text-emerald-300" />
      </div>

      <div>
        <div className="text-sm font-bold text-white">Reviewed Batch</div>
        <div className="text-xs text-gray-500 mt-1">
          Reading from <span className="font-mono text-indigo-300">{REVIEWS_ROOT}/{selectedYear}/{selectedMonth}</span>
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
            <option key={m} value={m}>{m}</option>
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
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </label>

      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs">
        <FolderOpen size={14} />
        {selectedMonth} {selectedYear}
      </div>
    </div>
  </div>
);

const SelectionActions = ({ selectedCount, allVisibleSelected, selectVisible, deselectVisible, shortlistSelectedToRTDB, exportSelectedExcel, clearSelection }) => (
  <div className="rounded-xl border border-[#2d2d3f] bg-[#0f0f16] p-3 flex flex-col justify-between">
    <div className="flex items-center justify-between">
      <div className="text-xs text-gray-500 uppercase tracking-wider">Selection</div>
      <div className="text-xs text-gray-400 font-mono">{selectedCount} selected</div>
    </div>

    <div className="mt-2 flex flex-wrap gap-2">
      <button
        onClick={allVisibleSelected ? deselectVisible : selectVisible}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2d2d3f] text-gray-300 hover:bg-white/5 text-xs"
      >
        <ListChecks size={14} />
        {allVisibleSelected ? "Deselect Visible" : "Select Visible"}
      </button>

      <button
        onClick={shortlistSelectedToRTDB}
        disabled={!selectedCount}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
          selectedCount
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-[#1e1e2d] text-gray-500 cursor-not-allowed border border-[#2d2d3f]"
        }`}
      >
        <CheckCircle2 size={14} />
        Shortlist
      </button>

      <button
        onClick={exportSelectedExcel}
        disabled={!selectedCount}
        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
          selectedCount
            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
            : "bg-[#1e1e2d] text-gray-500 cursor-not-allowed border border-[#2d2d3f]"
        }`}
      >
        <Download size={14} />
        Export Selected
      </button>

      {selectedCount ? (
        <button
          onClick={clearSelection}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2d2d3f] text-gray-300 hover:bg-white/5 text-xs"
        >
          <X size={14} />
          Clear
        </button>
      ) : null}
    </div>
  </div>
);

// ------------------------------------------------------------
// DETAIL MODAL
// ------------------------------------------------------------
const DetailModal = ({
  entry,
  selectedMonth,
  selectedYear,
  panels,
  hideAiEvaluation,
  setHideAiEvaluation,
  globalAiHidden,
  onClose,
}) => {  if (!entry) return null;
const effectiveHideAiEvaluation = globalAiHidden || hideAiEvaluation;

  const raw = entry?._raw || entry;
  const entityName = entry?.entity_name || raw?.entityName || "Unknown Startup";
  const regNo = entry?.sb_no || raw?.sbNo || raw?.sb_no || "—";
  const stage = entry?.stage || raw?.stage || raw?.input?.stage || "—";

  const answers = getAnswers(raw);
  const apiResponse = getApiResponse(raw);

  const decision = getDecision(raw, apiResponse);
  const businessType = getBusinessType(raw, apiResponse);
  const qTier = getQuality(raw, apiResponse);
  const scoreBand = getScoreBand(raw, apiResponse);
  const decisionReason = getDecisionReason(raw, apiResponse);

  const finalScore = getFinalScore(raw, apiResponse);
  const rubricScore = getRubricScore(raw, apiResponse);
  const readinessModifier = getReadinessModifier(raw, apiResponse);

  const evidence = getEvidence(raw, apiResponse);
  const evidenceQuality = getEvidenceQuality(raw, apiResponse);
  const fraud = getFraudRisk(raw, apiResponse);
  const aiRiskLabel = getAiRiskLabel(raw, apiResponse);

  const calc = apiResponse?.calculation_breakdown || {};
  const weighted = calc.weighted_contributions || {};
  const positive = calc.positive_signals || {};
  const negative = calc.negative_signals || {};

  const pitchDeckUrl = getPitchDeckUrl(raw) || entry?.pitchDeckUrl || "";
  const pitchDeckName = getPitchDeckName(raw) || entry?.pitchDeckName || "Pitch Deck";

  const isRegisteredEntity = raw?.isRegisteredEntity || raw?.isRegistered || answers?.isRegistered || "";
  const founderQualification = raw?.founderQualification || answers?.qualification || "";
  const natureOfEntity = raw?.natureOfEntity || answers?.natureOfEntity || "";
  const dateOfRegistration = raw?.dateOfRegistration || answers?.dateOfRegistration || "";
  const roc = raw?.roc || answers?.roc || "";

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        className="w-full h-full bg-[#0f0f16] border border-[#2d2d3f] shadow-2xl flex flex-col"
      >
        <div className="px-6 py-4 border-b border-[#2d2d3f] flex items-center justify-between bg-[#13131f]">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              {effectiveHideAiEvaluation ? <Lock className="text-white" size={23} /> : <Unlock className="text-white" size={23} />}
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 truncate">
                {entityName}
                <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30 shrink-0">
                  {regNo}
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-gray-400 text-sm">
                  Stage: <span className="text-emerald-400">{String(stage)}</span>
                </span>

                {effectiveHideAiEvaluation ? (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-rose-500/10 text-rose-300 border-rose-500/20">
                      <Lock size={13} /> AI hidden for panel
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDecisionPill(decision)}`}>
                      {prettifyDecision(decision)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${String(businessType || "").toLowerCase() === "startup" ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>
                      {prettifyBusinessType(businessType)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${qualityBadgeClass(qTier)}`}>
                      {prettifyQualityTier(qTier)}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBandClass(scoreBand)}`}>
                      Band {scoreBand}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400 text-sm">
                      Final: <span className={`${getScoreColor(finalScore)} font-bold font-mono`}>{Number(finalScore).toFixed(1)}/10</span>
                    </span>
                  </>
                )}

                {pitchDeckUrl ? (
                  <>
                    <span className="text-gray-600">•</span>
                    <a
                      href={pitchDeckUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20"
                      title={pitchDeckName}
                    >
                      <FileText size={13} /> Pitch Deck
                    </a>
                  </>
                ) : null}
              </div>

              {!effectiveHideAiEvaluation && decisionReason ? (
                <p className="mt-2 text-sm text-gray-300 max-w-5xl">{decisionReason}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {globalAiHidden ? (
  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-rose-500/10 border-rose-500/20 text-rose-200">
    <Lock size={15} />
    <span>
      <span className="block text-xs font-semibold">AI Locked Hidden</span>
      <span className="block text-[10px] opacity-70">
        Controlled by GlobalParameter/AIHidden
      </span>
    </span>
  </div>
) : (
  <ToggleSwitch
    checked={!effectiveHideAiEvaluation}
    onChange={(show) => setHideAiEvaluation(!show)}
    label={effectiveHideAiEvaluation ? "AI Hidden" : "AI Visible"}
    subLabel="Control panel bias"
    iconOn={<Unlock size={15} />}
    iconOff={<Lock size={15} />}
  />
)}

            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col xl:flex-row">
          <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar p-6 md:p-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-8">
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Info size={16} /> Entity Profile
                  </h3>

                  <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Meta label="Registered Entity" value={isRegisteredEntity || "—"} />
                    <Meta label="Founder Qualification" value={founderQualification || "—"} />
                    <Meta label="Nature Of Entity" value={natureOfEntity || "—"} />
                    <Meta label="Date Of Registration" value={dateOfRegistration || "—"} />
                    <Meta label="ROC" value={roc || "—"} />
                    <Meta label="Review Batch" value={`${selectedMonth} ${selectedYear}`} />
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Database size={16} /> Input Data / Answers
                  </h3>

                  <div className="space-y-4 bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50">
                    <DataBlock title="Innovation Note" text={answers?.innovation_note || answers?.innovation} />
                    <DataBlock title="Uniqueness Note" text={answers?.uniqueness_note || answers?.uniqueness} />
                    <DataBlock title="Employment Potential" text={answers?.employment_potential_note || answers?.employmentPotential} />
                    <DataBlock title="Wealth Potential" text={answers?.wealth_potential_note || answers?.wealthPotential} />
                    <DataBlock title="Product Development Capability" text={answers?.product_development_capability_note || answers?.productCapability} />
                    <DataBlock title="Success Stories / Prototype & Growth Plan" text={answers?.success_stories_and_growth_plan || answers?.executionGrowth} />
                  </div>
                </section>

                {!effectiveHideAiEvaluation ? (
                  <>
                    <section>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Calculator size={16} /> AI Score Breakdown
                      </h3>

                      <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <MetricCard label="Rubric Score" value={rubricScore} />
                          <MetricCard label="Readiness Modifier" value={readinessModifier} delta />
                          <MetricCard label="Final Score" value={finalScore} />
                        </div>
                        <BreakdownGrid title="Weighted Contributions" data={weighted} type="weighted" />
                        <BreakdownGrid title="Positive Signals" data={positive} type="positive" />
                        <BreakdownGrid title="Negative Signals" data={negative} type="negative" />
                      </div>
                    </section>

                    {apiResponse?.missing_flags ? (
                      <section>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <ShieldAlert size={16} /> AI Missing Flags
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.entries(apiResponse.missing_flags).map(([k, v]) => (
                            <div key={k} className={`p-3 rounded-xl border ${v ? "bg-rose-500/10 border-rose-500/20" : "bg-[#1a1a2e] border-[#2d2d3f]"}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-300 font-mono">{k}</span>
                                <span className={`text-xs font-bold ${v ? "text-rose-400" : "text-gray-500"}`}>{v ? "MISSING" : "OK"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    ) : null}
                  </>
                ) : (
                  <section className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5">
                    <div className="flex items-start gap-3">
                      <Lock size={18} className="text-rose-300 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-rose-200">AI evaluation is hidden</div>
                        <div className="text-xs text-rose-100/70 mt-1">
                          Scores, decision, risks, strengths, and detailed AI reasoning are hidden to reduce panel bias.
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              <div className="space-y-8">
                <section className="bg-gradient-to-br from-[#1a1a2e] to-[#13131f] p-6 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-900/10">
                  <h3 className="text-indigo-300 font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp size={18} /> Executive Summary
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm italic">
                    "{apiResponse?.summary || entry?.summary || "No summary available."}"
                  </p>
                </section>

                {apiResponse?.pitch_questions?.length ? (
                  <section>
                    <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Target size={16} /> Pitch Questions
                    </h3>

                    <div className="bg-[#1a1a2e] rounded-xl border border-amber-500/10 overflow-hidden">
                      {apiResponse.pitch_questions.map((rawQ, i) => {
                        const q = normalizePitchQuestion(rawQ);
                        return (
                          <div key={i} className="flex gap-4 p-4 border-b border-[#2d2d3f] last:border-0 hover:bg-[#202030] transition-colors">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold shrink-0">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-sm text-gray-200 font-medium">{q.question}</p>
                              {q.why_it_matters ? <p className="text-xs text-gray-500 mt-2">Why it matters: {q.why_it_matters}</p> : null}
                              {q.expected_evidence ? <p className="text-xs text-emerald-400/80 mt-1">Expected evidence: {q.expected_evidence}</p> : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {!effectiveHideAiEvaluation ? (
                  <>
                    <section>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BarChart3 size={16} /> Detailed AI Evaluation
                      </h3>

                      <div className="space-y-3">
                        {(apiResponse?.ratings || []).map((rating, idx) => (
                          <div key={idx} className="bg-[#1a1a2e] p-4 rounded-xl border border-[#2d2d3f] hover:border-indigo-500/30 transition-colors">
                            <div className="flex justify-between items-center mb-2 gap-4">
                              <span className="font-semibold text-white">{rating.criterion_label}</span>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400" style={{ width: `${(Number(rating.score) / 10) * 100}%` }} />
                                </div>
                                <span className="text-emerald-400 font-bold font-mono">{Number(rating.score || 0).toFixed(1)}/10</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-indigo-500/20 pl-3">{rating.reason}</p>
                          </div>
                        ))}

                        {!((apiResponse?.ratings || []).length) ? (
                          <div className="text-sm text-gray-500 bg-[#1a1a2e] p-4 rounded-xl border border-[#2d2d3f]">
                            No detailed ratings found in this record.
                          </div>
                        ) : null}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <BrainCircuit size={16} /> AI Evidence & Risk
                      </h3>

                      <div className="bg-[#1a1a2e] rounded-2xl border border-[#2d2d3f]/50 overflow-hidden">
                        <div className="p-4 border-b border-[#2d2d3f] flex flex-wrap items-center gap-2">
                          {evidenceQuality ? <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${evidenceBadgeClass(evidenceQuality)}`}>Evidence: {String(evidenceQuality).toUpperCase()}</span> : null}
                          {aiRiskLabel ? <span className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${aiRiskBadgeClass(aiRiskLabel)}`}><BrainCircuit size={14} />Risk: {String(aiRiskLabel).toUpperCase()}</span> : null}
                        </div>

                        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <MetricCard label="Evidence Score" value={evidence.evidence_score} plain />
                          <MetricCard label="Proof Strength" value={evidence.proof_strength} plain />
                          <MetricCard label="Numbers Count" value={evidence.numbers_count} plain />
                          <MetricCard label="Currency Mentions" value={evidence.currency_mentions} plain />
                          <MetricCard label="Dates Count" value={evidence.dates_count} plain />
                          <MetricCard label="Buzzword Count" value={fraud?.buzzword_count ?? fraud?.score ?? 0} plain />
                        </div>
                      </div>
                    </section>

                    {apiResponse?.strengths?.length ? (
                      <ListSection icon={CheckCircle2} title="AI Key Strengths" titleClass="text-emerald-500" items={apiResponse.strengths} itemClass="border-emerald-500/10" iconClass="text-emerald-500" />
                    ) : null}

                    {apiResponse?.risks_and_gaps?.length ? (
                      <ListSection icon={ShieldAlert} title="AI Risks & Gaps" titleClass="text-rose-500" items={apiResponse.risks_and_gaps} itemClass="border-rose-500/10" iconClass="text-rose-500" />
                    ) : null}
                  </>
                ) : null}

                <section className="rounded-2xl border border-[#2d2d3f] bg-[#13131f]/40 p-4 flex items-center justify-between gap-3">
                  <div className="text-sm text-gray-300 flex items-center gap-2">
                    <ClipboardCopy size={16} className="text-indigo-300" />
                    Copy visible summary + pitch questions
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard?.writeText(
                        [
                          `SB: ${regNo}`,
                          `Entity: ${entityName}`,
                          `Stage: ${stage}`,
                          `Pitch Deck: ${pitchDeckUrl || "Not uploaded"}`,
                          "",
                          "Summary:",
                          apiResponse?.summary || "",
                          "",
                          "Pitch Questions:",
                          (apiResponse?.pitch_questions || [])
                            .map((q, i) => `${i + 1}. ${normalizePitchQuestion(q).question}`)
                            .join("\n"),
                          "",
                         effectiveHideAiEvaluation
                            ? "AI evaluation hidden for unbiased panel review."
                            : `AI Decision: ${prettifyDecision(decision)} | Final Score: ${Number(finalScore).toFixed(1)}`,
                        ].join("\n")
                      )
                    }
                    className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-[#2d2d3f] text-gray-300 hover:bg-white/5"
                  >
                    <ClipboardCopy size={14} /> Copy
                  </button>
                </section>
              </div>
            </div>
          </div>

          <PitchingPanelWindow
            entry={entry}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            panels={panels}
          />
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// ------------------------------------------------------------
// MAIN PAGE
// ------------------------------------------------------------
const PIAIReviewedData = () => {
  const shortlistInputRef = useRef(null);

  const [selectedMonth, setSelectedMonth] = useState("December");
  const [selectedYear, setSelectedYear] = useState("2025");

  const [loading, setLoading] = useState(true);
  const [allRows, setAllRows] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [uploadingDeckId, setUploadingDeckId] = useState("");
  const [panels, setPanels] = useState({});

 
const [hideAiEvaluation, setHideAiEvaluationState] = useState(() =>
  readBool("aiReviewedData.hideAiEvaluation", true)
);
const [globalAiHidden, setGlobalAiHidden] = useState(false);
const setHideAiEvaluation = (value) => {
  if (globalAiHidden) {
    setHideAiEvaluationState(true);
    writeBool("aiReviewedData.hideAiEvaluation", true);
    return;
  }

  setHideAiEvaluationState(value);
  writeBool("aiReviewedData.hideAiEvaluation", value);
};
const effectiveHideAiEvaluation = globalAiHidden || hideAiEvaluation;

  const [q, setQ] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [evidenceFilter, setEvidenceFilter] = useState("all");
  const [aiRiskFilter, setAiRiskFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [registeredEntityFilter, setRegisteredEntityFilter] = useState("all");
  const [founderQualFilter, setFounderQualFilter] = useState("all");
  const [natureFilter, setNatureFilter] = useState("all");
  const [bandFilter, setBandFilter] = useState("all");
  const [minFinal, setMinFinal] = useState(0);
  const [maxFinal, setMaxFinal] = useState(10);
  const [minQualifiers, setMinQualifiers] = useState(0);
  const [sortKey, setSortKey] = useState("final_score");
  const [sortDir, setSortDir] = useState("desc");
  const [shortlistUploadBusy, setShortlistUploadBusy] = useState(false);

  useEffect(() => {
    const r = ref(rtdb, PANELS_ROOT);
    const unsub = onValue(r, (snap) => {
      const val = snap.val() || {};
      const parsed = {};

      Object.entries(val).forEach(([panelId, panelObj]) => {
        const members = {};
        Object.entries(panelObj || {}).forEach(([memberId, memberObj]) => {
          if (memberId === "panelName" || memberId === "createdAt") return;
          if (memberObj && typeof memberObj === "object") {
            members[memberId] = {
              memberId,
              Name: memberObj.Name || memberObj.name || "",
              designation: memberObj.designation || "",
            };
          }
        });
        parsed[panelId] = {
          panelId,
          panelName: panelObj?.panelName || panelId,
          members,
        };
      });

      setPanels(parsed);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    setLoading(true);
    setSelectedIds(new Set());

    const r = ref(rtdb, getBatchPath(selectedYear, selectedMonth));
    const unsub = onValue(
      r,
      (snap) => {
        const val = snap.val() || {};
        const rows = [];

        Object.entries(val).forEach(([k, v]) => {
          if (!v || typeof v !== "object") return;

          const apiResponse = getApiResponse(v);
          const answers = getAnswers(v);
          const evidence = getEvidence(v, apiResponse);
          const scores = getScores(v, apiResponse);

          const sbNo = String(v.sbNo || v.sb_no || apiResponse.sb_no || k);
          const entityName =
            v.entityName || v.entity_name || answers.startupName || answers.entityName || "Unknown Startup";
          const stage = v.stage || answers.startupStage || answers.stage || "";

          rows.push({
            _key: k,
            sb_no: sbNo,
            entity_name: entityName,
            stage,
            pitchDeckUrl: getPitchDeckUrl(v),
  pitchDeckName: getPitchDeckName(v),
  pitchDeckStoragePath: getPitchDeckStoragePath(v),

            reviewMonth: v.reviewMonth || selectedMonth,
            reviewYear: v.reviewYear || selectedYear,
            batchLabel: v.batchLabel || `${selectedMonth} ${selectedYear}`,
            batchPath: v.batchPath || getBatchPath(selectedYear, selectedMonth),
            isRegisteredEntity:
              v.isRegisteredEntity || v.isRegistered || answers.isRegistered || answers.hasRegisteredEntity || "",
            founderQualification:
              v.founderQualification || answers.qualification || answers.founderQualification || "",
            natureOfEntity: v.natureOfEntity || answers.natureOfEntity || "",
            dateOfRegistration: v.dateOfRegistration || answers.dateOfRegistration || "",
            roc: v.roc || answers.roc || "",
            decision: getDecision(v, apiResponse),
            decision_reason: getDecisionReason(v, apiResponse),
            business_type: getBusinessType(v, apiResponse),
            startup_quality: getQuality(v, apiResponse),
            score_band: getScoreBand(v, apiResponse),
            final_score: getFinalScore(v, apiResponse),
            rubric_score: getRubricScore(v, apiResponse),
            readiness_modifier: getReadinessModifier(v, apiResponse),
            innovation_score: Number(scores.innovation || scores.innovation_depth || 0),
            product_capability_score: Number(scores.product_capability || scores.solution_strength || 0),
            execution_score: Number(scores.execution_growth || scores.execution_readiness || 0),
            team_score: Number(scores.team_capability || 0),
            qualifier_count: Number(apiResponse?.qualifier_count ?? 0),
            missing_flag_count: Number(apiResponse?.missing_flag_count ?? 0),
            evidence_quality: getEvidenceQuality(v, apiResponse),
            evidence_score: Number(evidence?.evidence_score ?? 0),
            proof_strength: Number(evidence?.proof_strength ?? 0),
            ai_risk: getAiRiskLabel(v, apiResponse),
            summary: apiResponse?.summary || v?.summary || "",
            updatedAt: v?.updatedAt || v?.apiMeta?.reviewedAt || v?.createdAt || null,
            _raw: v,
          });
        });

        setAllRows(rows);
        setLoading(false);
      },
      (err) => {
        console.error("RTDB read failed:", err);
        setAllRows([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
  const r = ref(rtdb, AI_HIDDEN_ROOT);

  const unsub = onValue(r, (snap) => {
    const value = snap.val();

    const isHidden =
      value === true ||
      value === "true" ||
      value === 1 ||
      value === "1" ||
      value === "yes";

    setGlobalAiHidden(isHidden);

    if (isHidden) {
      setHideAiEvaluationState(true);
      writeBool("aiReviewedData.hideAiEvaluation", true);
    }
  });

  return () => unsub();
}, []);

const handlePitchDeckUpload = async (row, file) => {
  if (!row?.sb_no || !file) return;

  const sbNo = String(row.sb_no);
  const cleanFileName = file.name.replace(/[^\w.\-() ]+/g, "_");

  const oldStoragePath =
    row.pitchDeckStoragePath || getPitchDeckStoragePath(row?._raw || row);

  setUploadingDeckId(sbNo);

  try {
    const storage = getStorage();

    // Delete old storage file if replacing and storage path is available
    if (oldStoragePath) {
      try {
        await deleteObject(storageRef(storage, oldStoragePath));
      } catch (deleteError) {
        console.warn("Old pitch deck storage delete skipped/failed:", deleteError);
      }
    }

    const filePath = `StartupReviews/${selectedYear}/${selectedMonth}/${safeKey(
      sbNo
    )}/Pitch Deck/${Date.now()}_${cleanFileName}`;

    const fileRef = storageRef(storage, filePath);

    await uploadBytes(fileRef, file, {
      contentType: file.type || "application/octet-stream",
    });

    const downloadUrl = await getDownloadURL(fileRef);

    const basePath = getStartupReviewPath(selectedYear, selectedMonth, sbNo);
    const updates = {};

    updates[`${basePath}/Pitch Deck`] = downloadUrl;
    updates[`${basePath}/PitchDekh`] = downloadUrl;
    updates[`${basePath}/Pitch Deck Meta`] = {
      fileName: file.name,
      fileType: file.type || "",
      fileSize: file.size || 0,
      storagePath: filePath,
      uploadedAt: Date.now(),
      replacedAt: row.pitchDeckUrl ? Date.now() : null,
      reviewYear: selectedYear,
      reviewMonth: selectedMonth,
    };

    // Compatibility aliases
    updates[`${basePath}/PitchDeck`] = downloadUrl;
    updates[`${basePath}/PitchDeckMeta`] = {
      fileName: file.name,
      fileType: file.type || "",
      fileSize: file.size || 0,
      storagePath: filePath,
      uploadedAt: Date.now(),
      replacedAt: row.pitchDeckUrl ? Date.now() : null,
      reviewYear: selectedYear,
      reviewMonth: selectedMonth,
    };

    await update(ref(rtdb), updates);
  } catch (error) {
    console.error("Pitch deck upload failed:", error);
    alert("Pitch deck upload failed. Check console.");
  } finally {
    setUploadingDeckId("");
  }
};

const handlePitchDeckDelete = async (row) => {
  if (!row?.sb_no) return;

  const sbNo = String(row.sb_no);
  const storagePath =
    row.pitchDeckStoragePath || getPitchDeckStoragePath(row?._raw || row);

  const ok = window.confirm(
    `Delete Pitch Deck for ${row.entity_name || sbNo}?\n\nThis will clear the RTDB link and delete the Firebase Storage file if storage path is available.`
  );

  if (!ok) return;

  setUploadingDeckId(sbNo);

  try {
    const storage = getStorage();

    if (storagePath) {
      try {
        await deleteObject(storageRef(storage, storagePath));
      } catch (deleteError) {
        console.warn("Pitch deck storage delete skipped/failed:", deleteError);
      }
    }

    const basePath = getStartupReviewPath(selectedYear, selectedMonth, sbNo);
    const updates = {};

    updates[`${basePath}/Pitch Deck`] = null;
    updates[`${basePath}/PitchDekh`] = null;
    updates[`${basePath}/Pitch Deck Meta`] = null;

    // Compatibility aliases
    updates[`${basePath}/PitchDeck`] = null;
    updates[`${basePath}/PitchDeckMeta`] = null;
    updates[`${basePath}/pitchDeckUrl`] = null;
    updates[`${basePath}/pitch_deck_url`] = null;
    updates[`${basePath}/pitchDeckLink`] = null;

    await update(ref(rtdb), updates);
  } catch (error) {
    console.error("Pitch deck delete failed:", error);
    alert("Pitch deck delete failed. Check console.");
  } finally {
    setUploadingDeckId("");
  }
};

  const founderQualOptions = useMemo(() => {
    const setx = new Set();
    allRows.forEach((r) => {
      const v = String(r.founderQualification || "").trim();
      if (v) setx.add(v);
    });
    return ["all", ...Array.from(setx).sort()];
  }, [allRows]);

  const natureOptions = useMemo(() => {
    const setx = new Set();
    allRows.forEach((r) => {
      const v = String(r.natureOfEntity || "").trim();
      if (v) setx.add(v);
    });
    return ["all", ...Array.from(setx).sort()];
  }, [allRows]);

  const stageOptions = useMemo(() => {
    const setx = new Set();
    allRows.forEach((r) => {
      const v = String(r.stage || "").trim();
      if (v) setx.add(v);
    });
    return ["all", ...Array.from(setx).sort()];
  }, [allRows]);

  const viewRows = useMemo(() => {
    const query = String(q || "").trim().toLowerCase();

    const passText = (row) => {
      if (!query) return true;
      const hay = [
        row.sb_no,
        row.entity_name,
        row.stage,
        row.decision,
        row.decision_reason,
        row.business_type,
        row.startup_quality,
        row.score_band,
        row.evidence_quality,
        row.ai_risk,
        row.summary,
        row.isRegisteredEntity,
        row.founderQualification,
        row.natureOfEntity,
        row.dateOfRegistration,
        row.roc,
      ]
        .map((x) => String(x || "").toLowerCase())
        .join(" | ");
      return hay.includes(query);
    };

    const passRegistered = (row) => {
      if (registeredEntityFilter === "all") return true;
      const v = String(row.isRegisteredEntity || "").trim().toLowerCase();
      const yes = ["yes", "y", "true", "1", "registered"].includes(v);
      const no = ["no", "n", "false", "0", "unregistered", ""].includes(v);
      if (registeredEntityFilter === "yes") return yes;
      if (registeredEntityFilter === "no") return no;
      return true;
    };

    const filtered = allRows.filter((row) => {
      if (!passText(row)) return false;
      if (!effectiveHideAiEvaluation) {
        if (!passEnum(row.decision, decisionFilter)) return false;
        if (!passEnum(row.startup_quality, qualityFilter)) return false;
        if (!passEnum(row.evidence_quality, evidenceFilter)) return false;
        if (!passEnum(row.ai_risk, aiRiskFilter)) return false;
        if (!passEnum(row.score_band, bandFilter)) return false;
        const f = Number(row.final_score || 0);
        if (f < Number(minFinal)) return false;
        if (f > Number(maxFinal)) return false;
        if (Number(row.qualifier_count || 0) < Number(minQualifiers)) return false;
      }
      if (!passEnum(row.stage, stageFilter)) return false;
      if (!passRegistered(row)) return false;
      if (!passEnum(row.founderQualification, founderQualFilter)) return false;
      if (!passEnum(row.natureOfEntity, natureFilter)) return false;
      return true;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a?.[sortKey];
      const bv = b?.[sortKey];
      const an = Number(av);
      const bn = Number(bv);
      const aNumOk = !Number.isNaN(an) && av !== "" && av != null;
      const bNumOk = !Number.isNaN(bn) && bv !== "" && bv != null;
      if (aNumOk && bNumOk) return (an - bn) * dir;
      const as = String(av ?? "").toLowerCase();
      const bs = String(bv ?? "").toLowerCase();
      if (as < bs) return -1 * dir;
      if (as > bs) return 1 * dir;
      return 0;
    });
  }, [
    allRows,
    q,
    decisionFilter,
    qualityFilter,
    evidenceFilter,
    aiRiskFilter,
    stageFilter,
    registeredEntityFilter,
    founderQualFilter,
    natureFilter,
    bandFilter,
    minFinal,
    maxFinal,
    minQualifiers,
    sortKey,
    sortDir,
    effectiveHideAiEvaluation,
  ]);

  const selectedCount = selectedIds.size;
  const isSelected = (sb) => selectedIds.has(String(sb));
  const toggleSelected = (sb) => {
    const key = String(sb);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const clearSelection = () => setSelectedIds(new Set());
  const selectVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      viewRows.forEach((r) => next.add(String(r.sb_no)));
      return next;
    });
  };
  const deselectVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      viewRows.forEach((r) => next.delete(String(r.sb_no)));
      return next;
    });
  };

  const allVisibleSelected = useMemo(() => {
    if (!viewRows.length) return false;
    return viewRows.every((r) => selectedIds.has(String(r.sb_no)));
  }, [viewRows, selectedIds]);

  const toggleSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
      return;
    }
    setSortDir((d) => (d === "desc" ? "asc" : "desc"));
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown size={14} className="opacity-50" />;
    return <ArrowUpDown size={14} className={sortDir === "desc" ? "text-indigo-300" : "text-emerald-300"} />;
  };

  const resetFilters = () => {
    setQ("");
    setDecisionFilter("all");
    setQualityFilter("all");
    setEvidenceFilter("all");
    setAiRiskFilter("all");
    setStageFilter("all");
    setRegisteredEntityFilter("all");
    setFounderQualFilter("all");
    setNatureFilter("all");
    setBandFilter("all");
    setMinFinal(0);
    setMaxFinal(10);
    setMinQualifiers(0);
    setSortKey("final_score");
    setSortDir("desc");
  };

  const exportSelectedExcel = () => {
    const picked = viewRows.filter((r) => selectedIds.has(String(r.sb_no)));
    if (!picked.length) return;

    const rows = picked.map((row, idx) => {
      const raw = row._raw || {};
      const apiResponse = getApiResponse(raw);
      const answers = getAnswers(raw);
      const evidence = getEvidence(raw, apiResponse);
      const fraud = getFraudRisk(raw, apiResponse);
      const scores = getScores(raw, apiResponse);
      const calc = apiResponse?.calculation_breakdown || {};

      return {
        "S. No": idx + 1,
        "Registration No": row.sb_no,
        "Entity Name": row.entity_name,
        "Review Month": selectedMonth,
        "Review Year": selectedYear,
        "RTDB Path": getStartupReviewPath(selectedYear, selectedMonth, row.sb_no),
        Stage: row.stage,
        "Pitch Deck": row.pitchDeckUrl || "",
        "Is Registered Entity": row.isRegisteredEntity || "",
        "Founder Qualification": row.founderQualification || "",
        "Nature Of Entity": row.natureOfEntity || "",
        "Date Of Registration": row.dateOfRegistration || "",
        ROC: row.roc || "",
        Decision: prettifyDecision(row.decision),
        "Decision Raw": row.decision,
        "Decision Reason": row.decision_reason,
        "Business Type": prettifyBusinessType(row.business_type),
        "Startup Quality": prettifyQualityTier(row.startup_quality),
        "Score Band": row.score_band,
        "Final Score": Number(row.final_score ?? 0),
        "Rubric Score": Number(row.rubric_score ?? 0),
        "Readiness Modifier": Number(row.readiness_modifier ?? 0),
        "Innovation Score": Number(scores.innovation || scores.innovation_depth || 0),
        "Product/Solution Score": Number(scores.product_capability || scores.solution_strength || 0),
        "Execution Score": Number(scores.execution_growth || scores.execution_readiness || 0),
        "Team Score": Number(scores.team_capability || 0),
        "Qualifier Count": Number(apiResponse?.qualifier_count ?? 0),
        "Missing Flag Count": Number(apiResponse?.missing_flag_count ?? 0),
        "Evidence Quality": row.evidence_quality || "",
        "Evidence Score": Number(evidence?.evidence_score ?? 0),
        "Proof Strength": Number(evidence?.proof_strength ?? 0),
        "Traction Hits": joinArr(evidence?.traction_hits),
        "AI/Buzzword Risk": row.ai_risk || "",
        "Buzzword Risk": Number(fraud?.buzzword_risk ?? fraud?.score ?? 0),
        Summary: apiResponse?.summary || row.summary || "",
        Strengths: joinArr(apiResponse?.strengths),
        "Risks & Gaps": joinArr(apiResponse?.risks_and_gaps),
        "Pitch Questions": joinArr(apiResponse?.pitch_questions),
        "Input - Innovation Note": asText(answers?.innovation_note || answers?.innovation),
        "Input - Uniqueness Note": asText(answers?.uniqueness_note || answers?.uniqueness),
        "Input - Employment Potential Note": asText(answers?.employment_potential_note || answers?.employmentPotential),
        "Input - Wealth Potential Note": asText(answers?.wealth_potential_note || answers?.wealthPotential),
        "Input - Product Capability Note": asText(answers?.product_development_capability_note || answers?.productCapability),
        "Input - Success/Growth": asText(answers?.success_stories_and_growth_plan || answers?.executionGrowth),
        "Positive Total": Number(calc?.positive_total ?? 0),
        "Negative Total": Number(calc?.negative_total ?? 0),
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Selected");
    XLSX.writeFile(wb, `SSU_Selected_Startups_${selectedMonth}_${selectedYear}_${Date.now()}.xlsx`);
  };

  const shortlistSelectedToRTDB = async () => {
    const picked = viewRows.filter((r) => selectedIds.has(String(r.sb_no)));
    if (!picked.length) return;

    const now = Date.now();
    const batch = {};
    picked.forEach((r) => {
      const sb = String(r.sb_no);
      batch[getShortlistPath(selectedYear, selectedMonth, sb)] = {
        sb_no: sb,
        entity_name: r.entity_name || "",
        decision: r.decision || "",
        final_score: Number(r.final_score || 0),
        score_band: r.score_band || "",
        startup_quality: r.startup_quality || "",
        reviewMonth: selectedMonth,
        reviewYear: selectedYear,
        sourceBatchPath: getStartupReviewPath(selectedYear, selectedMonth, sb),
        taggedAt: now,
      };
    });

    try {
      await update(ref(rtdb), batch);
      clearSelection();
      alert(`Shortlisted: ${picked.length}`);
    } catch (e) {
      console.error("Shortlist update failed:", e);
      alert("Failed to shortlist. Check console.");
    }
  };

  const handleShortlistUpload = async (file) => {
    if (!file) return;
    setShortlistUploadBusy(true);
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);
      const sbList = [];
      for (const row of json) {
        const sb = row["Acknowledgment No"] || row["sb_no"] || row["SB No"] || row["Registration No"] || row["Reg No"] || row["SBNO"];
        if (sb) sbList.push(String(sb).trim());
      }
      const unique = Array.from(new Set(sbList.filter(Boolean)));
      if (!unique.length) {
        alert("No SB numbers found in sheet. Use column: Acknowledgment No / sb_no / Registration No.");
        return;
      }
      const now = Date.now();
      const batch = {};
      unique.forEach((sb) => {
        batch[getShortlistPath(selectedYear, selectedMonth, sb)] = {
          sb_no: sb,
          reviewMonth: selectedMonth,
          reviewYear: selectedYear,
          taggedAt: now,
          source: "xlsx_upload",
        };
      });
      await update(ref(rtdb), batch);
      alert(`Uploaded shortlist: ${unique.length}`);
    } catch (e) {
      console.error("Shortlist upload failed:", e);
      alert("Upload failed. Check console.");
    } finally {
      setShortlistUploadBusy(false);
      if (shortlistInputRef.current) shortlistInputRef.current.value = "";
    }
  };

  const tableColSpan = effectiveHideAiEvaluation ? 6 : 21;

  return (
    <div className="mt-6 mb-8 relative overflow-hidden rounded-3xl bg-[#0a0a12] border border-[#2d2d3f] shadow-2xl min-h-[650px] flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[520px] h-[520px] bg-purple-600/10 rounded-full blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[520px] h-[520px] bg-blue-600/10 rounded-full blur-[110px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
      </div>

      <div className="relative z-10 p-8 flex flex-col flex-1 min-h-0">
        <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ListChecks className="text-white" size={20} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex flex-wrap items-center gap-2">
                SSU Startup Selection
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-semibold">Panel Mode</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase tracking-widest font-semibold">{selectedMonth} {selectedYear}</span>
              </h2>
              <p className="text-gray-400 text-sm">Review startups, hide/unhide AI evaluation, and record panel ratings.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
           {globalAiHidden ? (
  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-rose-500/10 border-rose-500/20 text-rose-200">
    <Lock size={15} />
    <span>
      <span className="block text-xs font-semibold">AI Locked Hidden</span>
      <span className="block text-[10px] opacity-70">
        GlobalParameter/AIHidden = true
      </span>
    </span>
  </div>
) : (
  <ToggleSwitch
    checked={!effectiveHideAiEvaluation}
    onChange={(show) => setHideAiEvaluation(!show)}
    label={effectiveHideAiEvaluation ? "AI Hidden" : "AI Visible"}
    subLabel="Table + dialog"
    iconOn={<Eye size={15} />}
    iconOff={<EyeOff size={15} />}
  />
)}

            <button onClick={resetFilters} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2d2d3f] bg-[#13131f] hover:bg-white/5 text-gray-300 text-xs">
              Reset
            </button>

            <button onClick={() => shortlistInputRef.current?.click()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2d2d3f] bg-[#13131f] hover:bg-white/5 text-gray-300 text-xs" disabled={shortlistUploadBusy}>
              <Upload size={16} /> {shortlistUploadBusy ? "Uploading..." : "Upload Shortlist"}
            </button>
            <input ref={shortlistInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => handleShortlistUpload(e.target.files?.[0])} />
          </div>
        </div>

        <div className="mb-5">
          <BatchSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} selectedYear={selectedYear} setSelectedYear={setSelectedYear} disabled={loading} />
        </div>

        <div className="rounded-2xl border border-[#2d2d3f] bg-[#13131f]/60 p-4 mb-5">
          <div className="flex flex-col 2xl:flex-row gap-3 2xl:items-center 2xl:justify-between">
            <div className="flex items-center gap-2 rounded-xl border border-[#2d2d3f] bg-[#0f0f16] px-3 py-2 flex-1">
              <Search size={16} className="text-gray-500" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search SB No, startup, summary, qualification, nature..." className="w-full bg-transparent outline-none text-sm text-gray-200 placeholder:text-gray-600" />
              {q ? <button onClick={() => setQ("")} className="p-1 rounded hover:bg-white/5"><X size={16} className="text-gray-500" /></button> : null}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 xl:flex xl:flex-wrap gap-2">
              {!effectiveHideAiEvaluation ? (
                <>
                  <Select label="Decision" value={decisionFilter} onChange={setDecisionFilter} options={["all", "pitch_call", "reserve_band", "reject"]} />
                  <Select label="Band" value={bandFilter} onChange={setBandFilter} options={["all", "A", "B", "C", "D"]} />
                  <Select label="Quality" value={qualityFilter} onChange={setQualityFilter} options={["all", "strong", "promising", "average", "weak"]} />
                  <Select label="Evidence" value={evidenceFilter} onChange={setEvidenceFilter} options={["all", "high", "medium", "low"]} />
                  <Select label="AI-risk" value={aiRiskFilter} onChange={setAiRiskFilter} options={["all", "low", "medium", "high"]} />
                </>
              ) : null}
              <Select label="Stage" value={stageFilter} onChange={setStageFilter} options={stageOptions} />
              <Select label="Registered" value={registeredEntityFilter} onChange={setRegisteredEntityFilter} options={["all", "yes", "no"]} />
              <Select label="Founder Qualification" value={founderQualFilter} onChange={setFounderQualFilter} options={founderQualOptions} />
              <Select label="Nature Of Entity" value={natureFilter} onChange={setNatureFilter} options={natureOptions} />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 xl:grid-cols-3 gap-3">
            {!effectiveHideAiEvaluation ? (
              <>
                <div className="rounded-xl border border-[#2d2d3f] bg-[#0f0f16] p-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-2"><Gauge size={16} /> Final Score Range</span>
                    <span>{to2(minFinal)} – {to2(maxFinal)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max="10" step="0.1" value={minFinal} onChange={(e) => setMinFinal(clamp010(e.target.value))} className="flex-1 accent-indigo-500" />
                    <input type="range" min="0" max="10" step="0.1" value={maxFinal} onChange={(e) => setMaxFinal(clamp010(e.target.value))} className="flex-1 accent-emerald-500" />
                  </div>
                </div>

                <div className="rounded-xl border border-[#2d2d3f] bg-[#0f0f16] p-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>Minimum Qualifiers</span>
                    <span>≥ {minQualifiers}</span>
                  </div>
                  <input type="range" min="0" max="8" step="1" value={minQualifiers} onChange={(e) => setMinQualifiers(Number(e.target.value))} className="w-full accent-indigo-500" />
                </div>
              </>
            ) : (
              <div className="xl:col-span-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 flex items-start gap-3">
                <Lock size={17} className="text-rose-300 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-rose-200">AI columns are hidden from the table.</div>
                  <div className="text-[11px] text-rose-100/70 mt-1">Panel sees startup name, stage, pitch deck, profile context, and summary without AI scoring influence.</div>
                </div>
              </div>
            )}

            <SelectionActions selectedCount={selectedCount} allVisibleSelected={allVisibleSelected} selectVisible={selectVisible} deselectVisible={deselectVisible} shortlistSelectedToRTDB={shortlistSelectedToRTDB} exportSelectedExcel={exportSelectedExcel} clearSelection={clearSelection} />
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-[#13131f] border border-[#2d2d3f] rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="overflow-x-auto custom-scrollbar flex-1">
            <table className="w-full text-left text-sm text-gray-400 relative">
              <thead className="text-xs uppercase bg-[#0f0f16] text-gray-500 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">
                    <input type="checkbox" checked={allVisibleSelected && viewRows.length > 0} onChange={() => (allVisibleSelected ? deselectVisible() : selectVisible())} />
                  </th>
                  <Th label="SB No" onClick={() => toggleSort("sb_no")}><SortIcon col="sb_no" /></Th>
                  <Th label="Startup" onClick={() => toggleSort("entity_name")}><SortIcon col="entity_name" /></Th>
                  <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Pitch Deck</th>
                  <Th label="Stage" onClick={() => toggleSort("stage")}><SortIcon col="stage" /></Th>
                  {!effectiveHideAiEvaluation ? (
                    <>
                      <Th label="Decision" onClick={() => toggleSort("decision")}><SortIcon col="decision" /></Th>
                      <Th label="Band" onClick={() => toggleSort("score_band")}><SortIcon col="score_band" /></Th>
                      <Th label="Final" onClick={() => toggleSort("final_score")} className="text-indigo-300"><SortIcon col="final_score" /></Th>
                      <Th label="Rubric" onClick={() => toggleSort("rubric_score")}><SortIcon col="rubric_score" /></Th>
                      <Th label="Modifier" onClick={() => toggleSort("readiness_modifier")}><SortIcon col="readiness_modifier" /></Th>
                      <Th label="Type" onClick={() => toggleSort("business_type")}><SortIcon col="business_type" /></Th>
                      <Th label="Quality" onClick={() => toggleSort("startup_quality")}><SortIcon col="startup_quality" /></Th>
                      <Th label="Evidence" onClick={() => toggleSort("evidence_quality")}><SortIcon col="evidence_quality" /></Th>
                      <Th label="Proof" onClick={() => toggleSort("proof_strength")}><SortIcon col="proof_strength" /></Th>
                      <Th label="AI-risk" onClick={() => toggleSort("ai_risk")}><SortIcon col="ai_risk" /></Th>
                      <Th label="Innovation" onClick={() => toggleSort("innovation_score")}><SortIcon col="innovation_score" /></Th>
                      <Th label="Product" onClick={() => toggleSort("product_capability_score")}><SortIcon col="product_capability_score" /></Th>
                      <Th label="Execution" onClick={() => toggleSort("execution_score")}><SortIcon col="execution_score" /></Th>
                    </>
                  ) : null}
                  <Th label="Registered" onClick={() => toggleSort("isRegisteredEntity")}><SortIcon col="isRegisteredEntity" /></Th>
                  <Th label="Qualification" onClick={() => toggleSort("founderQualification")}><SortIcon col="founderQualification" /></Th>
                  <Th label={effectiveHideAiEvaluation ? "Summary" : "Decision Reason"} onClick={() => toggleSort("decision_reason")}><SortIcon col="decision_reason" /></Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#2d2d3f]">
                {loading ? (
                  <tr>
                    <td colSpan={tableColSpan} className="px-6 py-10">
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="h-4 w-4 rounded-full border-2 border-[#2d2d3f] border-t-indigo-500 animate-spin" />
                        Loading reviewed data from {getBatchPath(selectedYear, selectedMonth)}...
                      </div>
                    </td>
                  </tr>
                ) : viewRows.length ? (
                  viewRows.map((row, idx) => (
                    <motion.tr
                      key={row._key || row.sb_no || idx}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-[#1a1a2e] cursor-pointer group"
                      onClick={(e) => {
                        const tag = e?.target?.tagName?.toLowerCase();
                        if (["input", "button", "svg", "path", "a", "label"].includes(tag)) return;
                        setSelectedEntry(row._raw ? { ...row._raw, ...row } : row);
                      }}
                    >
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isSelected(row.sb_no)} onChange={() => toggleSelected(row.sb_no)} />
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-300 group-hover:text-indigo-400 transition-colors">{row.sb_no}</td>
                      <td className="px-6 py-4 font-medium text-white max-w-[280px] truncate">{row.entity_name}</td>
                    <td
  className="px-6 py-4 whitespace-nowrap"
  onClick={(e) => e.stopPropagation()}
>
  {row.pitchDeckUrl ? (
    <div className="flex items-center gap-2">
      <a
        href={row.pitchDeckUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold"
        title={row.pitchDeckName || "View Pitch Deck"}
      >
        <Eye size={14} />
        View
      </a>

      <label
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
          uploadingDeckId === row.sb_no
            ? "border-gray-500/20 bg-gray-500/10 text-gray-500 cursor-not-allowed"
            : "border-indigo-500/20 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
        }`}
        title="Replace Pitch Deck"
      >
        <Pencil size={14} />
        {uploadingDeckId === row.sb_no ? "Replacing..." : "Replace"}
        <input
          type="file"
          accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          className="hidden"
          disabled={uploadingDeckId === row.sb_no}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePitchDeckUpload(row, file);
            e.target.value = "";
          }}
        />
      </label>

      <button
        type="button"
        onClick={() => handlePitchDeckDelete(row)}
        disabled={uploadingDeckId === row.sb_no}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
          uploadingDeckId === row.sb_no
            ? "border-gray-500/20 bg-gray-500/10 text-gray-500 cursor-not-allowed"
            : "border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
        }`}
        title="Delete Pitch Deck"
      >
        <Trash2 size={14} />
        Delete
      </button>
    </div>
  ) : (
    <label
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
        uploadingDeckId === row.sb_no
          ? "border-gray-500/20 bg-gray-500/10 text-gray-500 cursor-not-allowed"
          : "border-indigo-500/20 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
      }`}
      title="Upload Pitch Deck"
    >
      <Upload size={14} />
      {uploadingDeckId === row.sb_no ? "Uploading..." : "Upload"}
      <input
        type="file"
        accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        disabled={uploadingDeckId === row.sb_no}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePitchDeckUpload(row, file);
          e.target.value = "";
        }}
      />
    </label>
  )}
</td>
                      <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{row.stage || "—"}</span></td>

                      {!effectiveHideAiEvaluation ? (
                        <>
                          <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDecisionPill(row.decision)}`}>{prettifyDecision(row.decision)}</span></td>
                          <td className="px-6 py-4"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getBandClass(row.score_band)}`}>{row.score_band}</span></td>
                          <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.final_score)}`}>{Number(row.final_score).toFixed(1)}</td>
                          <td className="px-6 py-4 text-center font-mono text-indigo-300">{Number(row.rubric_score).toFixed(1)}</td>
                          <td className={`px-6 py-4 text-center font-mono ${scoreDeltaClass(row.readiness_modifier)}`}>{Number(row.readiness_modifier) > 0 ? "+" : ""}{Number(row.readiness_modifier).toFixed(1)}</td>
                          <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${String(row.business_type || "").toLowerCase() === "startup" ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}>{prettifyBusinessType(row.business_type)}</span></td>
                          <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${qualityBadgeClass(row.startup_quality)}`}>{prettifyQualityTier(row.startup_quality)}</span></td>
                          <td className="px-6 py-4">{row.evidence_quality ? <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${evidenceBadgeClass(row.evidence_quality)}`}>{String(row.evidence_quality).toUpperCase()}</span> : <span className="text-gray-600">—</span>}</td>
                          <td className="px-6 py-4 text-center font-mono text-gray-300">{Number(row.proof_strength || 0).toFixed(1)}</td>
                          <td className="px-6 py-4">{row.ai_risk ? <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${aiRiskBadgeClass(row.ai_risk)}`}>{String(row.ai_risk).toUpperCase()}</span> : <span className="text-gray-600">—</span>}</td>
                          <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.innovation_score)}`}>{Number(row.innovation_score || 0).toFixed(1)}</td>
                          <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.product_capability_score)}`}>{Number(row.product_capability_score || 0).toFixed(1)}</td>
                          <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.execution_score)}`}>{Number(row.execution_score || 0).toFixed(1)}</td>
                        </>
                      ) : null}

                      <td className="px-6 py-4"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${String(row.isRegisteredEntity || "").toLowerCase() === "yes" || String(row.isRegisteredEntity || "").toLowerCase() === "true" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" : "bg-gray-500/10 text-gray-300 border-gray-500/20"}`}>{String(row.isRegisteredEntity || "—")}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-[220px] truncate">{row.founderQualification || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-md truncate">{effectiveHideAiEvaluation ? row.summary || "—" : row.decision_reason || row.summary || "—"}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableColSpan} className="px-6 py-10">
                      <div className="text-gray-500">No results for current filters in {selectedMonth} {selectedYear}.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-[#2d2d3f] bg-[#0f0f16] text-xs text-gray-500 flex items-center justify-between">
            <div>
              Showing <span className="text-gray-300 font-mono">{viewRows.length}</span> / <span className="text-gray-300 font-mono">{allRows.length}</span> entries from <span className="text-indigo-300 font-mono">{REVIEWS_ROOT}/{selectedYear}/{selectedMonth}</span>
            </div>
            <div className="text-gray-500 flex items-center gap-2">
              {effectiveHideAiEvaluation ? <span className="inline-flex items-center gap-1 text-rose-300"><Lock size={13} /> AI hidden</span> : <span className="inline-flex items-center gap-1 text-emerald-300"><Unlock size={13} /> AI visible</span>}
              <span>Sort: <span className="text-gray-300 font-mono">{sortKey}</span> ({sortDir})</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedEntry && (
            <DetailModal
  entry={selectedEntry}
  selectedMonth={selectedMonth}
  selectedYear={selectedYear}
  panels={panels}
  hideAiEvaluation={effectiveHideAiEvaluation}
  setHideAiEvaluation={setHideAiEvaluation}
  globalAiHidden={globalAiHidden}
  onClose={() => setSelectedEntry(null)}
/>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f0f16; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2d2d3f; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f5a; }
      `}</style>
    </div>
  );
};

export default PIAIReviewedData;
