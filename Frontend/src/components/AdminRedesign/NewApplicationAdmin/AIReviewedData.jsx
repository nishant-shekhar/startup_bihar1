// src/pages/AIReviewedData.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Download,
  Upload,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  ListChecks,
  ClipboardCopy,
  SlidersHorizontal,
  AlertTriangle,
  Bot,
  Database,
  TrendingUp,
  ShieldAlert,
  BarChart3,
  BrainCircuit,
  Info,
  Gauge,
} from "lucide-react";

import { ref, onValue, update, set } from "firebase/database";
import { rtdb } from "./firebase"; // adjust if your firebase export is elsewhere

// -------------------------
// CONFIG (SET THESE)
// -------------------------
// 1) This should match where saveStartupReviewToRTDB() writes.
// Example possibilities: "startup_reviews_old", "StartupReviews", "AIReviews/old", etc.
const REVIEWS_PATH = "StartupReviews";

// 2) Where SSU shortlist selections should be stored.
const SHORTLIST_PATH = "ssu_shortlists";

// -------------------------
// UI helpers (match OldStyle look)
// -------------------------
const clamp010 = (v) => Math.max(0, Math.min(10, Number(v) || 0));
const to2 = (v) => Math.round((Number(v) || 0) * 100) / 100;

const getScoreColor = (score) => {
  const s = Number(score) || 0;
  if (s >= 8) return "text-emerald-400 font-bold";
  if (s >= 6.5) return "text-emerald-300";
  if (s >= 5.5) return "text-yellow-400";
  return "text-rose-400";
};

const getDecisionPill = (decision) => {
  const d = (decision || "").toLowerCase();
  if (d === "pitch_call") return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (d === "hold_need_info") return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  return "bg-rose-500/10 text-rose-400 border-rose-500/20";
};

const prettifyDecision = (decision) => {
  const d = (decision || "").toLowerCase();
  if (d === "pitch_call") return "Call for Pitch";
  if (d === "hold_need_info") return "Hold (Need Info)";
  return "Reject";
};

const prettifyBusinessType = (t) => ((t || "").toLowerCase() === "startup" ? "Startup" : "Traditional");

const prettifyQualityTier = (tier) => {
  const t = (tier || "").toLowerCase();
  if (t === "strong") return "Strong";
  if (t === "moderate") return "Moderate";
  return "Weak";
};

const qualityBadgeClass = (tier) => {
  const t = (tier || "").toLowerCase();
  if (t === "strong") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (t === "moderate") return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
  return "bg-gray-500/10 text-gray-300 border-gray-500/20";
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

const joinArr = (v, sep = " | ") => (Array.isArray(v) ? v.filter(Boolean).join(sep) : "");
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

const safeKey = (k) => String(k || "").replace(/[.#$/\[\]]/g, "_");

// -------------------------
// Detail Modal (OldStyle-like, but reads RTDB reviewed objects)
// -------------------------
const DetailModal = ({ entry, onClose }) => {
  if (!entry) return null;

  const entityName = entry?.entity_name || entry?.entityName || "Unknown Startup";
  const regNo = entry?.sb_no || entry?.regNo || "—";
  const stage = entry?.stage || entry?.input?.stage || "—";

  // Your RTDB objects often look like: { answers: {...}, api: { response: {...}, meta: {...} }, ... } :contentReference[oaicite:1]{index=1}
  const answers = entry?.answers || entry?.inputData?.answers || entry?.inputData || {};
  const apiResponse = entry?.api?.response || entry?.apiResponse || entry?.apiResult?.response || {};

  const decision = apiResponse?.decision || entry?.decision;
  const businessType = apiResponse?.business_type || entry?.business_type;
  const qTier = apiResponse?.quality_tier || entry?.quality_tier;

  const scores = apiResponse?.scores || {};
  const overallFinal = scores?.overall_final ?? apiResponse?.overall_score ?? entry?.overall_final ?? entry?.overall_score ?? 0;
  const overallLLM = scores?.overall_llm ?? entry?.overall_llm ?? null;
  const penalties = scores?.penalties || {};
  const caps = scores?.stage_caps || {};

  const realism = apiResponse?.realism || entry?.realism || {};
  const evidenceQuality = realism?.evidence_quality || entry?.evidence_quality;
  const specificity = realism?.specificity_score ?? entry?.specificity_score;
  const aiRisk = realism?.ai_assistance_risk || {};
  const ev = realism?.evidence_signals || {};

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 18 }}
        className="bg-[#0f0f16] border border-[#2d2d3f] w-full max-w-6xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2d2d3f] flex items-center justify-between bg-[#13131f]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white" size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {entityName}
                <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                  {regNo}
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-gray-400 text-sm">
                  Stage: <span className="text-emerald-400">{String(stage)}</span>
                </span>
                <span className="text-gray-600">•</span>

                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDecisionPill(decision)}`}>
                  {prettifyDecision(decision)}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    String(businessType || "").toLowerCase() === "startup"
                      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {prettifyBusinessType(businessType)}
                </span>

                {qTier ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${qualityBadgeClass(qTier)}`}>
                    {prettifyQualityTier(qTier)}
                  </span>
                ) : null}

                {evidenceQuality ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${evidenceBadgeClass(evidenceQuality)}`}>
                    Evidence: {String(evidenceQuality).toUpperCase()}
                  </span>
                ) : null}

                {aiRisk?.label ? (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${aiRiskBadgeClass(aiRisk.label)}`}>
                    <BrainCircuit size={14} className="mr-1" />
                    AI-risk: {String(aiRisk.label).toUpperCase()}
                  </span>
                ) : null}

                <span className="text-gray-600">•</span>

                <span className="text-gray-400 text-sm">
                  Final: <span className={`${getScoreColor(overallFinal)} font-bold font-mono`}>{Number(overallFinal).toFixed(1)}/10</span>
                  {overallLLM != null ? (
                    <span className="text-gray-500 font-mono text-xs ml-2">(LLM: {Number(overallLLM).toFixed(1)})</span>
                  ) : null}
                </span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={22} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT */}
            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Database size={16} /> Data Analyzed (6-point)
                </h3>

                <div className="space-y-4 bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50">
                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Innovation Note</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{answers?.innovation_note || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Uniqueness Note</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{answers?.uniqueness_note || "N/A"}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-indigo-400 block mb-1">Employment Potential</span>
                      <p className="text-sm text-gray-300 leading-relaxed">{answers?.employment_potential_note || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-indigo-400 block mb-1">Wealth Potential</span>
                      <p className="text-sm text-gray-300 leading-relaxed">{answers?.wealth_potential_note || "N/A"}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Product Development Capability</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{answers?.product_development_capability_note || "N/A"}</p>
                  </div>

                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Success Stories / Prototype & Growth Plan</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{answers?.success_stories_and_growth_plan || "N/A"}</p>
                  </div>
                </div>
              </section>

            

              {/* Scores & penalties */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Gauge size={16} /> Scoring Breakdown
                </h3>

                <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">Overall (Final)</div>
                    <div className={`text-sm font-mono ${getScoreColor(overallFinal)}`}>{Number(overallFinal).toFixed(1)}/10</div>
                  </div>

                  {overallLLM != null ? (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">Overall (LLM before penalties)</div>
                      <div className="text-sm font-mono text-gray-400">{Number(overallLLM).toFixed(1)}/10</div>
                    </div>
                  ) : null}

                  <div className="pt-2 border-t border-[#2d2d3f]">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Info size={14} /> Penalties Applied
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(penalties || {}).map(([k, v]) => (
                        <div key={k} className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-300 font-mono">{k}</span>
                            <span className="text-xs font-bold text-rose-300 font-mono">{Number(v || 0).toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                      {!Object.keys(penalties || {}).length ? (
                        <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f] text-xs text-gray-500">
                          No penalties available.
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#2d2d3f]">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Stage Caps</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300 font-mono">cap_overall_final</span>
                          <span className="text-xs font-bold text-gray-200 font-mono">{caps?.cap_overall_final ?? "—"}</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300 font-mono">cap_execution_growth</span>
                          <span className="text-xs font-bold text-gray-200 font-mono">{caps?.cap_execution_growth ?? "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
                {(apiResponse?.pitch_questions || []).length ? (
                <section>
                  <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp size={16} /> Pitch Questions
                  </h3>
                  <div className="bg-[#1a1a2e] rounded-xl border border-amber-500/10 overflow-hidden">
                    {apiResponse.pitch_questions.map((q, i) => (
                      <div key={i} className="flex gap-4 p-4 border-b border-[#2d2d3f] last:border-0 hover:bg-[#202030] transition-colors">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-300">{q}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

            </div>

            {/* RIGHT */}
            <div className="space-y-8">
              <section className="bg-gradient-to-br from-[#1a1a2e] to-[#13131f] p-6 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-900/10">
                <h3 className="text-indigo-300 font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp size={18} /> Executive Summary
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm italic">"{apiResponse?.summary || entry?.summary || "No summary available."}"</p>
              </section>

              {/* Realism */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BarChart3 size={16} /> Realism & Evidence
                </h3>

                <div className="bg-[#1a1a2e] rounded-2xl border border-[#2d2d3f]/50 overflow-hidden">
                  <div className="p-4 border-b border-[#2d2d3f] flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${evidenceBadgeClass(evidenceQuality)}`}>
                        Evidence: {String(evidenceQuality || "unknown").toUpperCase()}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
                        Specificity: {specificity != null ? Number(specificity).toFixed(2) : "—"}
                      </span>
                    </div>

                    {aiRisk?.label ? (
                      <span className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${aiRiskBadgeClass(aiRisk.label)}`}>
                        <BrainCircuit size={14} />
                        AI-risk: {String(aiRisk.label).toUpperCase()} ({Number(aiRisk.score || 0).toFixed(2)})
                      </span>
                    ) : null}
                  </div>

                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      ["numbers_count", ev?.numbers_count],
                      ["currency_mentions", ev?.currency_mentions],
                      ["dates_count", ev?.dates_count],
                      ["urls_count", ev?.urls_count],
                      ["named_customers_or_partners", ev?.named_customers_or_partners],
                    ].map(([k, v]) => (
                      <div key={k} className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300 font-mono">{k}</span>
                          <span className="text-xs font-bold text-gray-200 font-mono">{Number(v || 0)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 pb-4 grid grid-cols-1 gap-3">
                    <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                      <div className="text-xs text-gray-300 font-mono mb-1">pilot_keywords_hits</div>
                      <div className="text-xs text-gray-400">{(ev?.pilot_keywords_hits || []).length ? ev.pilot_keywords_hits.join(", ") : "—"}</div>
                    </div>

                    <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                      <div className="text-xs text-gray-300 font-mono mb-1">metrics_keywords_hits</div>
                      <div className="text-xs text-gray-400">{(ev?.metrics_keywords_hits || []).length ? ev.metrics_keywords_hits.join(", ") : "—"}</div>
                    </div>
                  </div>
                </div>
              </section>

              {(apiResponse?.strengths || []).length ? (
                <section>
                  <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {apiResponse.strengths.map((str, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-emerald-500/10">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        {str}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {(apiResponse?.risks_and_gaps || []).length ? (
                <section>
                  <h3 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldAlert size={16} /> Risks & Gaps
                  </h3>
                  <ul className="space-y-2">
                    {apiResponse.risks_and_gaps.map((risk, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-rose-500/10">
                        <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

                <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp size={16} /> Detailed Evaluation
                </h3>

                <div className="space-y-3">
                  {(apiResponse?.ratings || []).map((rating, idx) => (
                    <div key={idx} className="bg-[#1a1a2e] p-4 rounded-xl border border-[#2d2d3f] hover:border-indigo-500/30 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white">{rating.criterion_label}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                              style={{ width: `${(Number(rating.score) / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-emerald-400 font-bold font-mono">{Number(rating.score).toFixed(1)}/10</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-indigo-500/20 pl-3">{rating.reason}</p>
                    </div>
                  ))}
                </div>
              </section>

            
              {/* Quick actions */}
              <section className="rounded-2xl border border-[#2d2d3f] bg-[#13131f]/40 p-4 flex items-center justify-between gap-3">
                <div className="text-sm text-gray-300 flex items-center gap-2">
                  <ClipboardCopy size={16} className="text-indigo-300" />
                  Copy summary + strengths + gaps
                </div>
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard?.writeText(
                      [
                        `SB: ${regNo}`,
                        `Entity: ${entityName}`,
                        `Decision: ${prettifyDecision(decision)}`,
                        `Overall Final: ${Number(overallFinal).toFixed(1)}`,
                        "",
                        "Summary:",
                        apiResponse?.summary || "",
                        "",
                        "Strengths:",
                        joinArr(apiResponse?.strengths, "\n- "),
                        "",
                        "Risks & Gaps:",
                        joinArr(apiResponse?.risks_and_gaps, "\n- "),
                      ].join("\n")
                    )
                  }
                  className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-[#2d2d3f] text-gray-300 hover:bg-white/5"
                >
                  <ClipboardCopy size={14} />
                  Copy
                </button>
              </section>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// -------------------------
// Main Page
// -------------------------
const AIReviewedData = () => {
  const tableRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [allRows, setAllRows] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // selection
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  // filters
  const [q, setQ] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [evidenceFilter, setEvidenceFilter] = useState("all");
  const [aiRiskFilter, setAiRiskFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [registeredEntityFilter, setRegisteredEntityFilter] = useState("all"); // yes/no/all
  const [minFinal, setMinFinal] = useState(0);
  const [maxFinal, setMaxFinal] = useState(10);
  const [minQualifiers, setMinQualifiers] = useState(0);

  // sort
  const [sortKey, setSortKey] = useState("overall_final");
  const [sortDir, setSortDir] = useState("desc");

  // upload shortlist xlsx
  const shortlistInputRef = useRef(null);
  const [shortlistUploadBusy, setShortlistUploadBusy] = useState(false);

  // -------------------------
  // Load reviewed data from RTDB
  // -------------------------
  useEffect(() => {
    const r = ref(rtdb, REVIEWS_PATH);
    const unsub = onValue(
      r,
      (snap) => {
        const val = snap.val() || {};
        const rows = [];

        // supports both { sb: {...} } or nested objects
        Object.entries(val).forEach(([k, v]) => {
          if (!v || typeof v !== "object") return;

          // normalize shape
          const sbNo = v.sb_no || v.sbNo || k;
          const entityName = v.entity_name || v.entityName || "Unknown Startup";
          const stage = v.stage || v.input?.stage || v.api?.stage_norm || v.api?.response?.stage || "";

          const apiResponse = v?.api?.response || v?.apiResponse || v?.apiResult?.response || {};
          const scores = apiResponse?.scores || {};
          const realism = apiResponse?.realism || {};
          const aiRisk = realism?.ai_assistance_risk || {};

          const overallFinal = scores?.overall_final ?? apiResponse?.overall_score ?? 0;
          const overallLLM = scores?.overall_llm ?? null;

          // IMPORTANT: You said registered entity isn't in reviewed data yet, but you will store it.
          // Keep both possible placements:
          const isRegisteredEntity =
            v?.isRegisteredEntity ??
            v?.inputData?.isRegisteredEntity ??
            v?.input?.isRegisteredEntity ??
            v?.meta?.isRegisteredEntity ??
            "";

          rows.push({
            _key: k,
            sb_no: String(sbNo),
            entity_name: entityName,
            stage: stage,

            isRegisteredEntity: isRegisteredEntity,

            decision: apiResponse?.decision || "",
            business_type: apiResponse?.business_type || "",
            quality_tier: apiResponse?.quality_tier || "",

            overall_final: Number(overallFinal || 0),
            overall_llm: overallLLM == null ? null : Number(overallLLM),

            innovation_score: Number(apiResponse?.innovation_score ?? 0),
            product_capability_score: Number(apiResponse?.product_capability_score ?? 0),
            qualifier_count: Number(apiResponse?.qualifier_count ?? 0),

            evidence_quality: realism?.evidence_quality || "",
            specificity_score: realism?.specificity_score ?? null,
            ai_risk: aiRisk?.label || "",

            summary: apiResponse?.summary || v?.comment || "",
            updatedAt: v?.updatedAt || v?.updatedAt_ms || null,

            // keep full object for modal
            _raw: v,
          });
        });

        // default sort: final desc
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
  }, []);

  // -------------------------
  // Derived: filtered + sorted
  // -------------------------
  const viewRows = useMemo(() => {
    const query = String(q || "").trim().toLowerCase();

    const passText = (row) => {
      if (!query) return true;
      const hay = [
        row.sb_no,
        row.entity_name,
        row.stage,
        row.decision,
        row.business_type,
        row.quality_tier,
        row.evidence_quality,
        row.ai_risk,
        row.summary,
        row.isRegisteredEntity,
      ]
        .map((x) => String(x || "").toLowerCase())
        .join(" | ");
      return hay.includes(query);
    };

    const passEnum = (val, f) => (f === "all" ? true : String(val || "").toLowerCase() === String(f).toLowerCase());

    const passRegistered = (row) => {
      if (registeredEntityFilter === "all") return true;
      const v = String(row.isRegisteredEntity || "").trim().toLowerCase();

      const yes = v === "yes" || v === "y" || v === "true" || v === "1" || v === "registered";
      const no = v === "no" || v === "n" || v === "false" || v === "0" || v === "unregistered" || v === "";

      if (registeredEntityFilter === "yes") return yes;
      if (registeredEntityFilter === "no") return no;
      return true;
    };

    const filtered = allRows.filter((row) => {
      if (!passText(row)) return false;

      if (!passEnum(row.decision, decisionFilter)) return false;
      if (!passEnum(row.quality_tier, qualityFilter)) return false;
      if (!passEnum(row.evidence_quality, evidenceFilter)) return false;
      if (!passEnum(row.ai_risk, aiRiskFilter)) return false;
      if (!passEnum(row.stage, stageFilter)) return false;

      if (!passRegistered(row)) return false;

      const f = Number(row.overall_final || 0);
      if (f < Number(minFinal)) return false;
      if (f > Number(maxFinal)) return false;

      if (Number(row.qualifier_count || 0) < Number(minQualifiers)) return false;

      return true;
    });

    const dir = sortDir === "asc" ? 1 : -1;
    const sorted = [...filtered].sort((a, b) => {
      const av = a?.[sortKey];
      const bv = b?.[sortKey];

      // numeric preferred
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

    return sorted;
  }, [
    allRows,
    q,
    decisionFilter,
    qualityFilter,
    evidenceFilter,
    aiRiskFilter,
    stageFilter,
    registeredEntityFilter,
    minFinal,
    maxFinal,
    minQualifiers,
    sortKey,
    sortDir,
  ]);

  // -------------------------
  // Selection helpers
  // -------------------------
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

  // -------------------------
  // Sorting UI
  // -------------------------
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

  // -------------------------
  // Bulk actions
  // -------------------------
  const exportSelectedExcel = () => {
    const picked = viewRows.filter((r) => selectedIds.has(String(r.sb_no)));
    if (!picked.length) return;

    const rows = picked.map((row, idx) => {
      const raw = row._raw || {};
      const apiResponse = raw?.api?.response || {};
      const s = apiResponse?.scores || {};
      const penalties = s.penalties || {};
      const realism = apiResponse?.realism || {};
      const ev = realism?.evidence_signals || {};
      const aiRisk = realism?.ai_assistance_risk || {};
      const answers = raw?.answers || {};

      return {
        "S. No": idx + 1,
        "Registration No": row.sb_no,
        "Entity Name": row.entity_name,
        "Stage": row.stage,
        "Is Registered Entity": row.isRegisteredEntity || "",

        "Decision": prettifyDecision(row.decision),
        "Business Type": prettifyBusinessType(row.business_type),
        "Quality Tier": prettifyQualityTier(row.quality_tier),

        "Overall (Final)": Number(row.overall_final ?? 0),
        "Overall (LLM)": row.overall_llm == null ? "" : Number(row.overall_llm),
        "Innovation Score": Number(row.innovation_score ?? 0),
        "Product Capability Score": Number(row.product_capability_score ?? 0),
        "Qualifier Count": Number(row.qualifier_count ?? 0),

        "Evidence Quality": realism?.evidence_quality || "",
        "Specificity (0..1)": realism?.specificity_score ?? "",
        "AI Risk": aiRisk?.label || "",
        "AI Risk Score": aiRisk?.score ?? "",

        "Penalty - Traditional": penalties?.traditional_penalty ?? "",
        "Penalty - Low Evidence": penalties?.low_evidence_penalty ?? "",
        "Penalty - AI Risk": penalties?.ai_risk_penalty ?? "",

        "Evidence Signals - Numbers": ev?.numbers_count ?? "",
        "Evidence Signals - Currency": ev?.currency_mentions ?? "",
        "Evidence Signals - Dates": ev?.dates_count ?? "",
        "Evidence Signals - URLs": ev?.urls_count ?? "",

        "Summary": apiResponse?.summary || row.summary || "",

        "Input - Innovation Note": asText(answers?.innovation_note),
        "Input - Uniqueness Note": asText(answers?.uniqueness_note),
        "Input - Employment Potential Note": asText(answers?.employment_potential_note),
        "Input - Wealth Potential Note": asText(answers?.wealth_potential_note),
        "Input - Product Capability Note": asText(answers?.product_development_capability_note),
        "Input - Success/Growth": asText(answers?.success_stories_and_growth_plan),
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Selected");
    XLSX.writeFile(wb, `SSU_Selected_Startups_${Date.now()}.xlsx`);
  };

  // Writes shortlist markers for selected sb_nos
  const shortlistSelectedToRTDB = async () => {
    const picked = viewRows.filter((r) => selectedIds.has(String(r.sb_no)));
    if (!picked.length) return;

    const now = Date.now();
    const batch = {};
    picked.forEach((r) => {
      const sb = String(r.sb_no);
      batch[`${SHORTLIST_PATH}/${safeKey(sb)}`] = {
        sb_no: sb,
        entity_name: r.entity_name || "",
        decision: r.decision || "",
        overall_final: Number(r.overall_final || 0),
        isRegisteredEntity: r.isRegisteredEntity || "",
        taggedAt: now,
      };
    });

    try {
      await update(ref(rtdb), batch);
      // optional: keep selection, but usually SSU wants it cleared after tagging
      clearSelection();
      alert(`Shortlisted: ${picked.length}`);
    } catch (e) {
      console.error("Shortlist update failed:", e);
      alert("Failed to shortlist. Check console.");
    }
  };

  // Upload shortlist Excel and push to SHORTLIST_PATH.
  // Accepted columns (any one works): "Acknowledgment No" OR "sb_no" OR "Registration No"
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
        const sb =
          row["Acknowledgment No"] ||
          row["sb_no"] ||
          row["SB No"] ||
          row["Registration No"] ||
          row["Reg No"] ||
          row["SBNO"];
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
        batch[`${SHORTLIST_PATH}/${safeKey(sb)}`] = {
          sb_no: sb,
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

  // -------------------------
  // UI rendering
  // -------------------------
  const resetFilters = () => {
    setQ("");
    setDecisionFilter("all");
    setQualityFilter("all");
    setEvidenceFilter("all");
    setAiRiskFilter("all");
    setStageFilter("all");
    setRegisteredEntityFilter("all");
    setMinFinal(0);
    setMaxFinal(10);
    setMinQualifiers(0);
    setSortKey("overall_final");
    setSortDir("desc");
  };

  return (
    <div className="mt-6 mb-8 relative overflow-hidden rounded-3xl bg-[#0a0a12] border border-[#2d2d3f] shadow-2xl min-h-[650px] flex flex-col">
      {/* background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[520px] h-[520px] bg-purple-600/10 rounded-full blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[520px] h-[520px] bg-blue-600/10 rounded-full blur-[110px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
      </div>

      <div className="relative z-10 p-8 flex flex-col flex-1 min-h-0">
        {/* header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ListChecks className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                SSU Startup Selection (Reviewed Data)
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-semibold">
                  RTDB
                </span>
              </h2>
              <p className="text-gray-400 text-sm">
                Filter + sort reviewed startups, select, shortlist, and export. Click any row for full AI evaluation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2d2d3f] bg-[#13131f] hover:bg-white/5 text-gray-300 text-xs"
              title="Reset filters"
            >
              <SlidersHorizontal size={16} />
              Reset
            </button>

            <button
              onClick={() => shortlistInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2d2d3f] bg-[#13131f] hover:bg-white/5 text-gray-300 text-xs"
              title="Upload shortlist list (Excel)"
              disabled={shortlistUploadBusy}
            >
              <Upload size={16} />
              {shortlistUploadBusy ? "Uploading..." : "Upload Shortlist"}
            </button>
            <input
              ref={shortlistInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => handleShortlistUpload(e.target.files?.[0])}
            />
          </div>
        </div>

        {/* filter bar */}
        <div className="rounded-2xl border border-[#2d2d3f] bg-[#13131f]/60 p-4 mb-5">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            {/* search */}
            <div className="flex items-center gap-2 rounded-xl border border-[#2d2d3f] bg-[#0f0f16] px-3 py-2 flex-1">
              <Search size={16} className="text-gray-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search SB No, Entity, summary, stage, evidence, AI-risk..."
                className="w-full bg-transparent outline-none text-sm text-gray-200 placeholder:text-gray-600"
              />
              {q ? (
                <button onClick={() => setQ("")} className="p-1 rounded hover:bg-white/5">
                  <X size={16} className="text-gray-500" />
                </button>
              ) : null}
            </div>

            {/* quick dropdowns */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-wrap gap-2">
              <Select label="Decision" value={decisionFilter} onChange={setDecisionFilter} options={["all", "pitch_call", "hold_need_info", "reject"]} />
              <Select label="Quality" value={qualityFilter} onChange={setQualityFilter} options={["all", "strong", "moderate", "weak"]} />
              <Select label="Evidence" value={evidenceFilter} onChange={setEvidenceFilter} options={["all", "high", "medium", "low"]} />
              <Select label="AI-risk" value={aiRiskFilter} onChange={setAiRiskFilter} options={["all", "low", "medium", "high"]} />
              <Select label="Stage" value={stageFilter} onChange={setStageFilter} options={["all", "IDEATION", "PROTOTYPE", "MVP", "VALIDATION", "REVENUE", "SCALE", "validation", "mvp"]} />
              <Select label="Registered" value={registeredEntityFilter} onChange={setRegisteredEntityFilter} options={["all", "yes", "no"]} />
            </div>
          </div>

          {/* numeric filters */}
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
            <Range
              icon={<Gauge size={16} className="text-indigo-300" />}
              title="Final Score Range"
              leftLabel={`Min: ${to2(minFinal)}`}
              rightLabel={`Max: ${to2(maxFinal)}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={minFinal}
                  onChange={(e) => setMinFinal(clamp010(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={maxFinal}
                  onChange={(e) => setMaxFinal(clamp010(e.target.value))}
                  className="flex-1 accent-emerald-500"
                />
              </div>
            </Range>

            <Range
              icon={<Filter size={16} className="text-indigo-300" />}
              title="Minimum Qualifiers"
              leftLabel={`≥ ${minQualifiers}`}
              rightLabel={`${viewRows.length} results`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="1"
                  value={minQualifiers}
                  onChange={(e) => setMinQualifiers(Number(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <input
                  value={String(minQualifiers)}
                  onChange={(e) => setMinQualifiers(Number(e.target.value || 0))}
                  className="w-[72px] bg-[#0f0f16] border border-[#2d2d3f] rounded-lg px-2 py-1 text-xs text-gray-200 font-mono outline-none focus:border-indigo-500/50"
                />
              </div>
            </Range>

            {/* bulk actions */}
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
                  <button onClick={clearSelection} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2d2d3f] text-gray-300 hover:bg-white/5 text-xs">
                    <X size={14} />
                    Clear
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* table */}
        <div className="flex-1 min-h-0 bg-[#13131f] border border-[#2d2d3f] rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="overflow-x-auto custom-scrollbar flex-1" ref={tableRef}>
            <table className="w-full text-left text-sm text-gray-400 relative">
              <thead className="text-xs uppercase bg-[#0f0f16] text-gray-500 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected && viewRows.length > 0}
                      onChange={() => (allVisibleSelected ? deselectVisible() : selectVisible())}
                    />
                  </th>

                  <Th label="SB No" onClick={() => toggleSort("sb_no")}>
                    <SortIcon col="sb_no" />
                  </Th>

                  <Th label="Entity Name" onClick={() => toggleSort("entity_name")}>
                    <SortIcon col="entity_name" />
                  </Th>

                  <Th label="Stage" onClick={() => toggleSort("stage")}>
                    <SortIcon col="stage" />
                  </Th>

                  <Th label="Registered" onClick={() => toggleSort("isRegisteredEntity")}>
                    <SortIcon col="isRegisteredEntity" />
                  </Th>

                  <Th label="Decision" onClick={() => toggleSort("decision")}>
                    <SortIcon col="decision" />
                  </Th>

                  <Th label="Type" onClick={() => toggleSort("business_type")}>
                    <SortIcon col="business_type" />
                  </Th>

                  <Th label="Quality" onClick={() => toggleSort("quality_tier")}>
                    <SortIcon col="quality_tier" />
                  </Th>

                  <Th label="Final" onClick={() => toggleSort("overall_final")} className="text-indigo-300">
                    <SortIcon col="overall_final" />
                  </Th>

                  <Th label="LLM" onClick={() => toggleSort("overall_llm")}>
                    <SortIcon col="overall_llm" />
                  </Th>

                  <Th label="Evidence" onClick={() => toggleSort("evidence_quality")}>
                    <SortIcon col="evidence_quality" />
                  </Th>

                  <Th label="Specificity" onClick={() => toggleSort("specificity_score")}>
                    <SortIcon col="specificity_score" />
                  </Th>

                  <Th label="AI-risk" onClick={() => toggleSort("ai_risk")}>
                    <SortIcon col="ai_risk" />
                  </Th>

                  <Th label="Innovation" onClick={() => toggleSort("innovation_score")} className="text-indigo-300">
                    <SortIcon col="innovation_score" />
                  </Th>

                  <Th label="Product" onClick={() => toggleSort("product_capability_score")} className="text-indigo-300">
                    <SortIcon col="product_capability_score" />
                  </Th>

                  <Th label="Qualifiers" onClick={() => toggleSort("qualifier_count")}>
                    <SortIcon col="qualifier_count" />
                  </Th>

                  <Th label="Summary" onClick={() => toggleSort("summary")} className="text-gray-300">
                    <SortIcon col="summary" />
                  </Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#2d2d3f]">
                {loading ? (
                  <tr>
                    <td colSpan={16} className="px-6 py-10">
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="h-4 w-4 rounded-full border-2 border-[#2d2d3f] border-t-indigo-500 animate-spin" />
                        Loading reviewed data from RTDB...
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
                        // prevent row-open when clicking checkbox
                        const tag = e?.target?.tagName?.toLowerCase();
                        if (tag === "input" || tag === "button" || tag === "svg" || tag === "path") return;
                        setSelectedEntry(row._raw ? { ...row._raw, sb_no: row.sb_no, entity_name: row.entity_name, stage: row.stage } : row);
                      }}
                      title="Click to view detailed analysis"
                    >
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isSelected(row.sb_no)} onChange={() => toggleSelected(row.sb_no)} />
                      </td>

                      <td className="px-6 py-4 font-mono text-gray-300 group-hover:text-indigo-400 transition-colors">{row.sb_no}</td>
                      <td className="px-6 py-4 font-medium text-white">{row.entity_name}</td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {row.stage || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            String(row.isRegisteredEntity || "").toLowerCase() === "yes"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                              : "bg-gray-500/10 text-gray-300 border-gray-500/20"
                          }`}
                        >
                          {String(row.isRegisteredEntity || "—")}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDecisionPill(row.decision)}`}>
                          {prettifyDecision(row.decision)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            String(row.business_type || "").toLowerCase() === "startup"
                              ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {prettifyBusinessType(row.business_type)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${qualityBadgeClass(row.quality_tier)}`}>
                          {prettifyQualityTier(row.quality_tier)}
                        </span>
                      </td>

                      <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.overall_final)}`}>{Number(row.overall_final).toFixed(1)}</td>
                      <td className="px-6 py-4 text-center font-mono text-gray-500">{row.overall_llm == null ? "—" : Number(row.overall_llm).toFixed(1)}</td>

                      <td className="px-6 py-4">
                        {row.evidence_quality ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${evidenceBadgeClass(row.evidence_quality)}`}>
                            {String(row.evidence_quality).toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center font-mono text-gray-300">
                        {row.specificity_score == null ? "—" : Number(row.specificity_score).toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        {row.ai_risk ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${aiRiskBadgeClass(row.ai_risk)}`}>
                            {String(row.ai_risk).toUpperCase()}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>

                      <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.innovation_score)}`}>{Number(row.innovation_score).toFixed(1)}</td>
                      <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.product_capability_score)}`}>{Number(row.product_capability_score).toFixed(1)}</td>
                      <td className="px-6 py-4 text-center font-mono text-gray-300">{row.qualifier_count}</td>

                      <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{row.summary || "—"}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={16} className="px-6 py-10">
                      <div className="text-gray-500">No results for current filters.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* footer stats */}
          <div className="px-5 py-3 border-t border-[#2d2d3f] bg-[#0f0f16] text-xs text-gray-500 flex items-center justify-between">
            <div>
              Showing <span className="text-gray-300 font-mono">{viewRows.length}</span> /{" "}
              <span className="text-gray-300 font-mono">{allRows.length}</span> reviewed entries
            </div>
            <div className="text-gray-500">
              Sort: <span className="text-gray-300 font-mono">{sortKey}</span> ({sortDir})
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedEntry && <DetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
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

// -------------------------
// small UI components
// -------------------------
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

const Range = ({ icon, title, leftLabel, rightLabel, children }) => (
  <div className="rounded-xl border border-[#2d2d3f] bg-[#0f0f16] p-3">
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-xs text-gray-300 font-semibold">{title}</div>
      </div>
      <div className="text-[11px] text-gray-500 flex items-center gap-2">
        <span>{leftLabel}</span>
        <span className="opacity-40">•</span>
        <span>{rightLabel}</span>
      </div>
    </div>
    <div className="mt-2">{children}</div>
  </div>
);

export default AIReviewedData;