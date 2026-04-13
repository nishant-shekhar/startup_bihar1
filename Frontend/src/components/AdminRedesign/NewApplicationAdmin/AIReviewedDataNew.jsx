// src/pages/AIReviewedDataNew.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { motion, AnimatePresence } from "framer-motion";
import ReactDOM from "react-dom";
import {
  Search,
  X,
  Download,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  ListChecks,
  ClipboardCopy,
  AlertTriangle,
  Bot,
  TrendingUp,
  ShieldAlert,
  BarChart3,
  BrainCircuit,
  Info,
  Gauge,
  Building2,
  Users,
  Lightbulb,
  Target,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import { ref, onValue, update } from "firebase/database";
import { rtdb } from "./firebase";

// new reviewed data is being saved under startupAIReview/April with full
// result + answers + api payload shape like the sample object you shared :contentReference[oaicite:0]{index=0}
// existing reviewed data page style reference came from AIReviewedData.jsx :contentReference[oaicite:1]{index=1}

// -------------------------
// CONFIG
// -------------------------
const REVIEWED_BASE_PATH = "startupAIReview";
const REVIEWED_INDEX_BASE_PATH = "startupAIReviewIndex";
const SHORTLIST_PATH = "ssu_shortlists_new";

// -------------------------
// HELPERS
// -------------------------
const safeKey = (k) => String(k || "").replace(/[.#$/\[\]]/g, "_");
const to2 = (v) => Math.round((Number(v) || 0) * 100) / 100;
const clamp010 = (v) => Math.max(0, Math.min(10, Number(v) || 0));
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

const passEnum = (val, f) =>
  f === "all" ? true : String(val || "").toLowerCase() === String(f).toLowerCase();

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

const prettifyBusinessType = (t) =>
  (t || "").toLowerCase() === "startup" ? "Startup" : "Traditional";

const prettifyQualityTier = (tier) => {
  const t = (tier || "").toLowerCase();
  if (t === "strong") return "Strong";
  if (t === "promising") return "Promising";
  if (t === "average") return "Average";
  return "Weak";
};

const qualityBadgeClass = (tier) => {
  const t = (tier || "").toLowerCase();
  if (t === "strong") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (t === "promising") return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
  if (t === "average") return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-rose-500/10 text-rose-300 border-rose-500/20";
};

const evidenceBadgeClass = (q) => {
  const s = String(q || "").toLowerCase();
  if (s === "high") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (s === "medium") return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-rose-500/10 text-rose-300 border-rose-500/20";
};

const institutionSignalClass = (signal) => {
  const s = String(signal || "").toLowerCase();
  if (s === "strong_relevant") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (s === "moderate_relevant") return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
  if (s === "weak_or_irrelevant") return "bg-rose-500/10 text-rose-300 border-rose-500/20";
  return "bg-gray-500/10 text-gray-300 border-gray-500/20";
};

const boolYesNo = (v) => {
  const s = String(v ?? "").trim().toLowerCase();
  if (["yes", "true", "1"].includes(s)) return "Yes";
  if (["no", "false", "0"].includes(s)) return "No";
  return String(v ?? "").trim();
};

const buildMonthOptions = () => {
  return [
    "April",
    "March",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
  ];
};

// -------------------------
// NORMALIZE NEW PROMPT REVIEW NODE
// -------------------------
function normalizeNewReviewNode(key, v, monthKey) {
  const result = v?.result || {};
  const apiResponse = v?.api?.response || result || {};
  const apiMeta = v?.api?.meta || v?.meta || {};
  const scores = result?.scores || apiResponse?.scores || {};
  const teamAssessment = result?.team_assessment || apiResponse?.team_assessment || {};
  const evidenceSignals = result?.evidence_signals || apiResponse?.evidence_signals || {};
  const derivedTeamSignals = teamAssessment?.derived_team_signals || {};

  return {
    _key: key,
    _month: monthKey,
    _raw: v,

    applicationId: v?.applicationId || key,
    startupName: v?.startupName || "Unknown Startup",
    founderName: v?.founderName || "",
    email: v?.email || "",
    phone: v?.phone || "",
    status: v?.status || "",
    applicationType: v?.applicationType || "",
    sectorCategory: v?.sectorCategory || "",
    stage: v?.stage || "",
    teamSize: Number(v?.teamSize || 0),
    website: v?.website || "",
    district: v?.district || "",
    state: v?.state || "",
    blockName: v?.blockName || "",
    pincode: v?.pincode || "",
    applicantAddress: v?.applicantAddress || "",
    gender: v?.gender || "",
    category: v?.category || "",
    dateOfBirth: v?.dateOfBirth || "",
    qualification: v?.qualification || "",
    institution: v?.institution || "",
    linkedinProfile: v?.linkedinProfile || "",
    hasRegisteredEntity: boolYesNo(v?.hasRegisteredEntity),
    entityName: v?.entityName || "",
    entityType: v?.entityType || "",
    entityRegistrationNumber: v?.entityRegistrationNumber || "",
    dateOfRegistration: v?.dateOfRegistration || "",
    businessAddress: v?.businessAddress || "",
    pitchDeckFileName: v?.pitchDeckFileName || "",
    pitchDeckURL: v?.pitchDeckURL || "",
    profilePhotoFileName: v?.profilePhotoFileName || "",
    profilePhotoURL: v?.profilePhotoURL || "",
    entityCertificateFileName: v?.entityCertificateFileName || "",
    entityCertificateURL: v?.entityCertificateURL || "",
    coFounderCount: Number(v?.coFounderCount || 0),
    isSoleFounder: Boolean(v?.isSoleFounder),
    coFounders: v?.coFounders || "",

    answers: v?.answers || {},
    api: v?.api || null,
    result,

    decision: result?.decision || "",
    business_type: result?.business_type || "",
    startup_quality: result?.startup_quality || "",
    differentiation_flag: result?.differentiation_flag || "",
    overall_score: Number(result?.overall_score || 0),
    qualifier_count: Number(result?.qualifier_count || 0),

    problem_clarity: Number(scores?.problem_clarity || 0),
    solution_strength: Number(scores?.solution_strength || 0),
    innovation_depth: Number(scores?.innovation_depth || 0),
    business_model_clarity: Number(scores?.business_model_clarity || 0),
    execution_readiness: Number(scores?.execution_readiness || 0),
    team_capability: Number(scores?.team_capability || 0),

    institution_signal: teamAssessment?.institution_signal || "",
    institution_reason: teamAssessment?.institution_reason || "",
    founder_relevance_score: Number(teamAssessment?.founder_relevance_score || 0),
    cofounder_strength_score: Number(teamAssessment?.cofounder_strength_score || 0),
    team_completeness_score: Number(teamAssessment?.team_completeness_score || 0),
    execution_adjustment_applied: Number(teamAssessment?.execution_adjustment_applied || 0),
    derived_team_signal: Number(derivedTeamSignals?.teamCapabilityScore || 0),

    evidence_score: Number(evidenceSignals?.evidence_score || 0),
    evidence_quality: evidenceSignals?.evidence_quality || "",
    numbers_count: Number(evidenceSignals?.numbers_count || 0),
    currency_mentions: Number(evidenceSignals?.currency_mentions || 0),
    dates_count: Number(evidenceSignals?.dates_count || 0),
    traction_hits: Array.isArray(evidenceSignals?.traction_hits) ? evidenceSignals.traction_hits : [],

    strengths: Array.isArray(result?.strengths) ? result.strengths : [],
    risks_and_gaps: Array.isArray(result?.risks_and_gaps) ? result.risks_and_gaps : [],
    pitch_questions: Array.isArray(result?.pitch_questions) ? result.pitch_questions : [],
    improvement_suggestions: Array.isArray(result?.improvement_suggestions)
      ? result.improvement_suggestions
      : [],
    qualifiers: result?.qualifiers || {},
    missing_flags: result?.missing_flags || {},
    ratings: Array.isArray(result?.ratings) ? result.ratings : [],
    summary: result?.summary || "",

    updatedAt: v?.updatedAt_ms || v?.updatedAt || 0,
    model: apiMeta?.model || "",
    elapsed_ms: Number(apiMeta?.elapsed_ms || 0),
  };
}

// -------------------------
// DETAIL MODAL
// -------------------------
const Meta = ({ label, value }) => (
  <div>
    <div className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</div>
    <div className="text-sm text-gray-200 mt-1 break-words">{value || "—"}</div>
  </div>
);

const DetailModal = ({ entry, onClose }) => {
  if (!entry) return null;
  const r = entry.result || {};
  const answers = entry.answers || {};
  const ratings = entry.ratings || [];
  const qualifiers = entry.qualifiers || {};
  const missingFlags = entry.missing_flags || {};
  const strengths = entry.strengths || [];
  const risksAndGaps = entry.risks_and_gaps || [];
  const pitchQuestions = entry.pitch_questions || [];
  const improvementSuggestions = entry.improvement_suggestions || [];
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">




  
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 18 }}
        className="bg-[#0f0f16] border border-[#2d2d3f] w-full max-w-7xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-[#2d2d3f] flex items-center justify-between bg-[#13131f]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white" size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {entry.startupName}
                <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                  {entry.applicationId}
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDecisionPill(entry.decision)}`}>
                  {prettifyDecision(entry.decision)}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    String(entry.business_type || "").toLowerCase() === "startup"
                      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {prettifyBusinessType(entry.business_type)}
                </span>

                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${qualityBadgeClass(entry.startup_quality)}`}>
                  {prettifyQualityTier(entry.startup_quality)}
                </span>

                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${evidenceBadgeClass(entry.evidence_quality)}`}>
                  Evidence: {String(entry.evidence_quality || "unknown").toUpperCase()}
                </span>

                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${institutionSignalClass(entry.institution_signal)}`}>
                  Institution: {String(entry.institution_signal || "unknown").replaceAll("_", " ")}
                </span>

                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">
                  Overall: <span className={`${getScoreColor(entry.overall_score)} font-mono`}>{Number(entry.overall_score || 0).toFixed(1)}/10</span>
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">
                  Month: <span className="text-indigo-300">{entry._month}</span>
                </span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={22} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="space-y-8 xl:col-span-1">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 size={16} /> Startup Profile
                </h3>

                <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
                  <Meta label="Startup Name" value={entry.startupName} />
                  <Meta label="Founder Name" value={entry.founderName} />
                  <Meta label="Sector" value={entry.sectorCategory} />
                  <Meta label="Application Type" value={entry.applicationType} />
                  <Meta label="Stage" value={entry.stage} />
                  <Meta label="Registered Entity" value={entry.hasRegisteredEntity} />
                  <Meta label="Entity Type" value={entry.entityType} />
                  <Meta label="Entity Name" value={entry.entityName} />
                  <Meta label="Entity Reg. No." value={entry.entityRegistrationNumber} />
                  <Meta label="Date Of Registration" value={entry.dateOfRegistration} />
                  <Meta label="Qualification" value={entry.qualification} />
                  <Meta label="Institution" value={entry.institution} />
                  <Meta label="LinkedIn" value={entry.linkedinProfile} />
                  <Meta label="Team Size" value={entry.teamSize} />
                  <Meta label="Co-Founder Count" value={entry.coFounderCount} />
                  <Meta label="Is Sole Founder" value={entry.isSoleFounder ? "Yes" : "No"} />
                  <Meta label="District" value={entry.district} />
                  <Meta label="State" value={entry.state} />
                </div>
              </section>

              <section className="bg-gradient-to-br from-[#1a1a2e] to-[#13131f] p-6 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-900/10">
                <h3 className="text-indigo-300 font-semibold mb-3 flex items-center gap-2">
                  <Sparkles size={18} /> Executive Summary
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm italic">"{entry.summary || "No summary available."}"</p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BrainCircuit size={16} /> Evidence Signals
                </h3>

                <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 grid grid-cols-2 gap-3">
                  <SignalCard label="Evidence Score" value={Number(entry.evidence_score || 0).toFixed(1)} />
                  <SignalCard label="Evidence Quality" value={entry.evidence_quality || "—"} />
                  <SignalCard label="Numbers Count" value={entry.numbers_count} />
                  <SignalCard label="Currency Mentions" value={entry.currency_mentions} />
                  <SignalCard label="Dates Count" value={entry.dates_count} />
                  <SignalCard label="Traction Hits" value={joinArr(entry.traction_hits, ", ") || "—"} />
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users size={16} /> Team Assessment
                </h3>

                <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${institutionSignalClass(entry.institution_signal)}`}>
                      {String(entry.institution_signal || "unknown").replaceAll("_", " ")}
                    </span>

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
                      Team Score: {Number(entry.team_capability || 0).toFixed(1)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-300 leading-relaxed">
                    {entry.institution_reason || "No institution assessment available."}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SignalCard label="Founder Relevance" value={Number(entry.founder_relevance_score || 0).toFixed(1)} />
                    <SignalCard label="Cofounder Strength" value={Number(entry.cofounder_strength_score || 0).toFixed(1)} />
                    <SignalCard label="Team Completeness" value={Number(entry.team_completeness_score || 0).toFixed(1)} />
                    <SignalCard label="Derived Team Signal" value={Number(entry.derived_team_signal || 0).toFixed(1)} />
                  </div>
                </div>
              </section>
            </div>

            {/* MIDDLE */}
            <div className="space-y-8 xl:col-span-1">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Info size={16} /> Submitted Answers
                </h3>

                <div className="space-y-4 bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50">
                  <AnswerBlock label="Problem Statement" value={answers.problemStatement} />
                  <AnswerBlock label="Solution" value={answers.solution} />
                  <AnswerBlock label="Innovation" value={answers.innovation} />
                  <AnswerBlock label="Business Model" value={answers.businessModel} />
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Gauge size={16} /> Score Breakdown
                </h3>

                <div className="space-y-3">
                  <ScoreRow label="Overall Score" value={entry.overall_score} />
                  <ScoreRow label="Problem Clarity" value={entry.problem_clarity} />
                  <ScoreRow label="Solution Strength" value={entry.solution_strength} />
                  <ScoreRow label="Innovation Depth" value={entry.innovation_depth} />
                  <ScoreRow label="Business Model Clarity" value={entry.business_model_clarity} />
                  <ScoreRow label="Execution Readiness" value={entry.execution_readiness} />
                  <ScoreRow label="Team Capability" value={entry.team_capability} />
                </div>
              </section>

              {ratings.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BarChart3 size={16} /> Detailed Evaluation
                  </h3>

                  <div className="space-y-3">
                    {ratings.map((rating, idx) => (
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
              )}
            </div>

            {/* RIGHT */}
            <div className="space-y-8 xl:col-span-1">
              {strengths.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {strengths.map((str, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-emerald-500/10">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        {str}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {risksAndGaps.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldAlert size={16} /> Risks & Gaps
                  </h3>
                  <ul className="space-y-2">
                    {risksAndGaps.map((risk, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-rose-500/10">
                        <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {improvementSuggestions.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Lightbulb size={16} /> Improvement Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {improvementSuggestions.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-amber-500/10">
                        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {pitchQuestions.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Target size={16} /> Pitch Questions
                  </h3>
                  <div className="bg-[#1a1a2e] rounded-xl border border-indigo-500/10 overflow-hidden">
                    {pitchQuestions.map((q, i) => (
                      <div key={i} className="flex gap-4 p-4 border-b border-[#2d2d3f] last:border-0 hover:bg-[#202030] transition-colors">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-300">{q}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Filter size={16} /> Qualifiers & Missing Flags
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Qualifiers</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(qualifiers).map(([k, v]) => (
                        <FlagCard key={k} name={k} active={Boolean(v)} positive />
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Missing Flags</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(missingFlags).map(([k, v]) => (
                        <FlagCard key={k} name={k} active={Boolean(v)} positive={false} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

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
                        `Application ID: ${entry.applicationId}`,
                        `Startup: ${entry.startupName}`,
                        `Decision: ${prettifyDecision(entry.decision)}`,
                        `Overall: ${Number(entry.overall_score).toFixed(1)}`,
                        "",
                        "Summary:",
                        entry.summary || "",
                        "",
                        "Strengths:",
                        strengths.length ? `- ${strengths.join("\n- ")}` : "-",
                        "",
                        "Risks & Gaps:",
                        risksAndGaps.length ? `- ${risksAndGaps.join("\n- ")}` : "-",
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

</div>,
    document.body
  );
};

// -------------------------
// MAIN PAGE
// -------------------------
const AIReviewedDataNew = () => {
  const tableRef = useRef(null);

  const monthOptions = useMemo(() => buildMonthOptions(), []);
  const [monthFilter, setMonthFilter] = useState("April");

  const [loading, setLoading] = useState(true);
  const [allRows, setAllRows] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const [q, setQ] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [evidenceFilter, setEvidenceFilter] = useState("all");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [registeredEntityFilter, setRegisteredEntityFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  const [minOverall, setMinOverall] = useState(0);
  const [maxOverall, setMaxOverall] = useState(10);
  const [minInnovation, setMinInnovation] = useState(0);
  const [minTeam, setMinTeam] = useState(0);
  const [minQualifiers, setMinQualifiers] = useState(0);

  const [sortKey, setSortKey] = useState("overall_score");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    setLoading(true);
    const reviewsRef = ref(rtdb, `${REVIEWED_BASE_PATH}/${monthFilter}`);

    const unsub = onValue(
      reviewsRef,
      (snap) => {
        const val = snap.val() || {};
        const rows = Object.entries(val).map(([k, v]) => normalizeNewReviewNode(k, v, monthFilter));
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
  }, [monthFilter]);

  const entityTypeOptions = useMemo(() => {
    const setx = new Set();
    allRows.forEach((r) => {
      const v = String(r.entityType || "").trim();
      if (v) setx.add(v);
    });
    return ["all", ...Array.from(setx).sort()];
  }, [allRows]);

  const sectorOptions = useMemo(() => {
    const setx = new Set();
    allRows.forEach((r) => {
      const v = String(r.sectorCategory || "").trim();
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

    const passRegistered = (row) => {
      if (registeredEntityFilter === "all") return true;
      const val = String(row.hasRegisteredEntity || "").toLowerCase();
      if (registeredEntityFilter === "yes") return val === "yes";
      if (registeredEntityFilter === "no") return val === "no";
      return true;
    };

    const filtered = allRows.filter((row) => {
      if (query) {
        const hay = [
          row.applicationId,
          row.startupName,
          row.founderName,
          row.email,
          row.phone,
          row.stage,
          row.decision,
          row.business_type,
          row.startup_quality,
          row.summary,
          row.sectorCategory,
          row.entityType,
          row.entityName,
          row.entityRegistrationNumber,
          row.district,
          row.institution,
          joinArr(row.strengths),
          joinArr(row.risks_and_gaps),
          joinArr(row.improvement_suggestions),
        ]
          .map((x) => String(x || "").toLowerCase())
          .join(" | ");

        if (!hay.includes(query)) return false;
      }

      if (!passEnum(row.decision, decisionFilter)) return false;
      if (!passEnum(row.startup_quality, qualityFilter)) return false;
      if (!passEnum(row.evidence_quality, evidenceFilter)) return false;
      if (!passEnum(row.institution_signal, institutionFilter)) return false;
      if (!passEnum(row.stage, stageFilter)) return false;
      if (!passEnum(row.entityType, entityTypeFilter)) return false;
      if (!passEnum(row.sectorCategory, sectorFilter)) return false;
      if (!passRegistered(row)) return false;

      if (Number(row.overall_score || 0) < Number(minOverall)) return false;
      if (Number(row.overall_score || 0) > Number(maxOverall)) return false;
      if (Number(row.innovation_depth || 0) < Number(minInnovation)) return false;
      if (Number(row.team_capability || 0) < Number(minTeam)) return false;
      if (Number(row.qualifier_count || 0) < Number(minQualifiers)) return false;

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
    institutionFilter,
    stageFilter,
    registeredEntityFilter,
    entityTypeFilter,
    sectorFilter,
    minOverall,
    maxOverall,
    minInnovation,
    minTeam,
    minQualifiers,
    sortKey,
    sortDir,
  ]);

  const selectedCount = selectedIds.size;

  const isSelected = (id) => selectedIds.has(String(id));

  const toggleSelected = (id) => {
    const key = String(id);
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
      viewRows.forEach((r) => next.add(String(r.applicationId)));
      return next;
    });
  };

  const deselectVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      viewRows.forEach((r) => next.delete(String(r.applicationId)));
      return next;
    });
  };

  const allVisibleSelected = useMemo(() => {
    if (!viewRows.length) return false;
    return viewRows.every((r) => selectedIds.has(String(r.applicationId)));
  }, [viewRows, selectedIds]);

  const toggleSort = (key) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
      return;
    }
    setSortDir((d) => (d === "desc" ? "asc" : "desc"));
  };

  const exportSelectedExcel = () => {
    const picked = viewRows.filter((r) => selectedIds.has(String(r.applicationId)));
    if (!picked.length) return;

    const rows = picked.map((row, idx) => ({
      "S. No.": idx + 1,
      "Application ID": row.applicationId,
      "Startup Name": row.startupName,
      "Founder Name": row.founderName,
      "Stage": row.stage,
      "Decision": prettifyDecision(row.decision),
      "Business Type": prettifyBusinessType(row.business_type),
      "Startup Quality": prettifyQualityTier(row.startup_quality),
      "Differentiation Flag": row.differentiation_flag,

      "Overall Score": row.overall_score,
      "Problem Clarity": row.problem_clarity,
      "Solution Strength": row.solution_strength,
      "Innovation Depth": row.innovation_depth,
      "Business Model Clarity": row.business_model_clarity,
      "Execution Readiness": row.execution_readiness,
      "Team Capability": row.team_capability,

      "Qualifier Count": row.qualifier_count,
      "Institution Signal": row.institution_signal,
      "Founder Relevance Score": row.founder_relevance_score,
      "Cofounder Strength Score": row.cofounder_strength_score,
      "Team Completeness Score": row.team_completeness_score,
      "Derived Team Signal": row.derived_team_signal,

      "Evidence Score": row.evidence_score,
      "Evidence Quality": row.evidence_quality,
      "Numbers Count": row.numbers_count,
      "Currency Mentions": row.currency_mentions,
      "Dates Count": row.dates_count,
      "Traction Hits": joinArr(row.traction_hits),

      "Registered Entity": row.hasRegisteredEntity,
      "Entity Type": row.entityType,
      "Entity Name": row.entityName,
      "Entity Registration Number": row.entityRegistrationNumber,
      "Date Of Registration": row.dateOfRegistration,

      "Qualification": row.qualification,
      "Institution": row.institution,
      "LinkedIn": row.linkedinProfile,
      "Team Size": row.teamSize,
      "Co-Founder Count": row.coFounderCount,
      "Co-Founders": row.coFounders,

      "Sector": row.sectorCategory,
      "District": row.district,
      "State": row.state,

      "Problem Statement": row.answers?.problemStatement || "",
      "Solution": row.answers?.solution || "",
      "Innovation": row.answers?.innovation || "",
      "Business Model": row.answers?.businessModel || "",

      "Strengths": joinArr(row.strengths),
      "Risks & Gaps": joinArr(row.risks_and_gaps),
      "Improvement Suggestions": joinArr(row.improvement_suggestions),
      "Pitch Questions": joinArr(row.pitch_questions),
      "Summary": row.summary || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AIReviewedDataNew");
    XLSX.writeFile(wb, `AIReviewedDataNew_${monthFilter}_${Date.now()}.xlsx`);
  };

  const shortlistSelectedToRTDB = async () => {
    const picked = viewRows.filter((r) => selectedIds.has(String(r.applicationId)));
    if (!picked.length) return;

    const now = Date.now();
    const batch = {};
    picked.forEach((r) => {
      const id = String(r.applicationId);
      batch[`${SHORTLIST_PATH}/${safeKey(id)}`] = {
        applicationId: id,
        startupName: r.startupName || "",
        founderName: r.founderName || "",
        decision: r.decision || "",
        overall_score: Number(r.overall_score || 0),
        startup_quality: r.startup_quality || "",
        stage: r.stage || "",
        sectorCategory: r.sectorCategory || "",
        district: r.district || "",
        hasRegisteredEntity: r.hasRegisteredEntity || "",
        month: r._month,
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

  const resetFilters = () => {
    setQ("");
    setDecisionFilter("all");
    setQualityFilter("all");
    setEvidenceFilter("all");
    setInstitutionFilter("all");
    setStageFilter("all");
    setRegisteredEntityFilter("all");
    setEntityTypeFilter("all");
    setSectorFilter("all");
    setMinOverall(0);
    setMaxOverall(10);
    setMinInnovation(0);
    setMinTeam(0);
    setMinQualifiers(0);
    setSortKey("overall_score");
    setSortDir("desc");
    clearSelection();
  };

  const stats = useMemo(() => {
    const total = viewRows.length;
    const pitch = viewRows.filter((r) => r.decision === "pitch_call").length;
    const hold = viewRows.filter((r) => r.decision === "hold_need_info").length;
    const reject = viewRows.filter((r) => r.decision === "reject").length;
    const strong = viewRows.filter((r) => r.startup_quality === "strong").length;
    const avg = total ? to2(viewRows.reduce((a, b) => a + Number(b.overall_score || 0), 0) / total) : 0;

    return { total, pitch, hold, reject, strong, avg };
  }, [viewRows]);

  return (
    <div className="mt-6 mb-8 relative overflow-hidden rounded-3xl bg-[#0a0a12] border border-[#2d2d3f] shadow-2xl min-h-[700px] flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[520px] h-[520px] bg-purple-600/10 rounded-full blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[520px] h-[520px] bg-blue-600/10 rounded-full blur-[110px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
      </div>

      <div className="relative z-10 p-8 flex flex-col flex-1 min-h-0">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ListChecks className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                AI Reviewed Data New
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-semibold">
                  New Prompt
                </span>
              </h2>
              <p className="text-gray-400 text-sm">
                Better reviewed data view for the new prompt dataset saved at <span className="font-mono text-indigo-300">startupAIReview/Month</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2d2d3f] bg-[#13131f] hover:bg-white/5 text-gray-300 text-xs"
            >
              <RefreshCw size={14} />
              Reset
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
          </div>
        </div>

        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
          <StatCard label="Visible" value={stats.total} tone="indigo" />
          <StatCard label="Pitch Call" value={stats.pitch} tone="emerald" />
          <StatCard label="Hold" value={stats.hold} tone="amber" />
          <StatCard label="Strong" value={stats.strong} tone="purple" />
          <StatCard label="Avg Score" value={stats.avg} tone="blue" />
        </div>

        {/* filters */}
        <div className="rounded-2xl border border-[#2d2d3f] bg-[#13131f]/60 p-4 mb-5">
          <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 rounded-xl border border-[#2d2d3f] bg-[#0f0f16] px-3 py-2 flex-1">
              <Search size={16} className="text-gray-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search application, startup, founder, sector, summary, strengths, gaps..."
                className="w-full bg-transparent outline-none text-sm text-gray-200 placeholder:text-gray-600"
              />
              {q ? (
                <button onClick={() => setQ("")} className="p-1 rounded hover:bg-white/5">
                  <X size={16} className="text-gray-500" />
                </button>
              ) : null}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 xl:flex xl:flex-wrap gap-2">
              <Select label="Month" value={monthFilter} onChange={setMonthFilter} options={monthOptions} />
              <Select label="Decision" value={decisionFilter} onChange={setDecisionFilter} options={["all", "pitch_call", "hold_need_info", "reject"]} />
              <Select label="Quality" value={qualityFilter} onChange={setQualityFilter} options={["all", "strong", "promising", "average", "weak"]} />
              <Select label="Evidence" value={evidenceFilter} onChange={setEvidenceFilter} options={["all", "high", "medium", "low"]} />
              <Select
                label="Institution"
                value={institutionFilter}
                onChange={setInstitutionFilter}
                options={["all", "strong_relevant", "moderate_relevant", "weak_or_irrelevant", "unknown"]}
              />
              <Select label="Stage" value={stageFilter} onChange={setStageFilter} options={stageOptions} />
              <Select label="Registered" value={registeredEntityFilter} onChange={setRegisteredEntityFilter} options={["all", "yes", "no"]} />
              <Select label="Entity Type" value={entityTypeFilter} onChange={setEntityTypeFilter} options={entityTypeOptions} />
              <Select label="Sector" value={sectorFilter} onChange={setSectorFilter} options={sectorOptions} />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 xl:grid-cols-4 gap-3">
            <Range
              icon={<Gauge size={16} className="text-indigo-300" />}
              title="Overall Score Range"
              leftLabel={`Min: ${to2(minOverall)}`}
              rightLabel={`Max: ${to2(maxOverall)}`}
            >
              <div className="flex items-center gap-3">
                <input type="range" min="0" max="10" step="0.1" value={minOverall} onChange={(e) => setMinOverall(clamp010(e.target.value))} className="flex-1 accent-indigo-500" />
                <input type="range" min="0" max="10" step="0.1" value={maxOverall} onChange={(e) => setMaxOverall(clamp010(e.target.value))} className="flex-1 accent-emerald-500" />
              </div>
            </Range>

            <Range
              icon={<TrendingUp size={16} className="text-indigo-300" />}
              title="Minimum Innovation"
              leftLabel={`≥ ${to2(minInnovation)}`}
              rightLabel={`${viewRows.length} results`}
            >
              <input type="range" min="0" max="10" step="0.1" value={minInnovation} onChange={(e) => setMinInnovation(clamp010(e.target.value))} className="w-full accent-indigo-500" />
            </Range>

            <Range
              icon={<Users size={16} className="text-indigo-300" />}
              title="Minimum Team Score"
              leftLabel={`≥ ${to2(minTeam)}`}
              rightLabel={`${selectedCount} selected`}
            >
              <input type="range" min="0" max="10" step="0.1" value={minTeam} onChange={(e) => setMinTeam(clamp010(e.target.value))} className="w-full accent-indigo-500" />
            </Range>

            <Range
              icon={<Filter size={16} className="text-indigo-300" />}
              title="Minimum Qualifiers"
              leftLabel={`≥ ${minQualifiers}`}
              rightLabel="Selection"
            >
              <div className="flex items-center gap-3">
                <input type="range" min="0" max="8" step="1" value={minQualifiers} onChange={(e) => setMinQualifiers(Number(e.target.value))} className="flex-1 accent-indigo-500" />
                <input
                  value={String(minQualifiers)}
                  onChange={(e) => setMinQualifiers(Number(e.target.value || 0))}
                  className="w-[72px] bg-[#0f0f16] border border-[#2d2d3f] rounded-lg px-2 py-1 text-xs text-gray-200 font-mono outline-none focus:border-indigo-500/50"
                />
              </div>
            </Range>
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

                  <Th label="Application ID" onClick={() => toggleSort("applicationId")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="applicationId" />
                  </Th>

                  <Th label="Startup Name" onClick={() => toggleSort("startupName")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="startupName" />
                  </Th>

                  <Th label="Founder" onClick={() => toggleSort("founderName")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="founderName" />
                  </Th>

                  <Th label="Stage" onClick={() => toggleSort("stage")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="stage" />
                  </Th>

                  <Th label="Decision" onClick={() => toggleSort("decision")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="decision" />
                  </Th>

                  <Th label="Type" onClick={() => toggleSort("business_type")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="business_type" />
                  </Th>

                  <Th label="Quality" onClick={() => toggleSort("startup_quality")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="startup_quality" />
                  </Th>

                  <Th label="Overall" onClick={() => toggleSort("overall_score")} className="text-indigo-300">
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="overall_score" />
                  </Th>

                  <Th label="Innovation" onClick={() => toggleSort("innovation_depth")} className="text-indigo-300">
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="innovation_depth" />
                  </Th>

                  <Th label="Execution" onClick={() => toggleSort("execution_readiness")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="execution_readiness" />
                  </Th>

                  <Th label="Team" onClick={() => toggleSort("team_capability")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="team_capability" />
                  </Th>

                  <Th label="Qualifiers" onClick={() => toggleSort("qualifier_count")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="qualifier_count" />
                  </Th>

                  <Th label="Evidence" onClick={() => toggleSort("evidence_quality")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="evidence_quality" />
                  </Th>

                  <Th label="Institution" onClick={() => toggleSort("institution_signal")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="institution_signal" />
                  </Th>

                  <Th label="Registered" onClick={() => toggleSort("hasRegisteredEntity")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="hasRegisteredEntity" />
                  </Th>

                  <Th label="Sector" onClick={() => toggleSort("sectorCategory")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="sectorCategory" />
                  </Th>

                  <Th label="Summary" onClick={() => toggleSort("summary")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="summary" />
                  </Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#2d2d3f]">
                {loading ? (
                  <tr>
                    <td colSpan={18} className="px-6 py-10">
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="h-4 w-4 rounded-full border-2 border-[#2d2d3f] border-t-indigo-500 animate-spin" />
                        Loading reviewed data from RTDB...
                      </div>
                    </td>
                  </tr>
                ) : viewRows.length ? (
                  viewRows.map((row, idx) => (
                    <motion.tr
                      key={row._key || row.applicationId || idx}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-[#1a1a2e] cursor-pointer group"
                      onClick={(e) => {
                        const tag = e?.target?.tagName?.toLowerCase();
                        if (tag === "input" || tag === "button" || tag === "svg" || tag === "path") return;
                        setSelectedEntry(row);
                      }}
                    >
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={isSelected(row.applicationId)} onChange={() => toggleSelected(row.applicationId)} />
                      </td>

                      <td className="px-6 py-4 font-mono text-gray-300 group-hover:text-indigo-400 transition-colors">{row.applicationId}</td>
                      <td className="px-6 py-4 font-medium text-white">{row.startupName}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{row.founderName || "—"}</td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {row.stage || "—"}
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${qualityBadgeClass(row.startup_quality)}`}>
                          {prettifyQualityTier(row.startup_quality)}
                        </span>
                      </td>

                      <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.overall_score)}`}>
                        {Number(row.overall_score || 0).toFixed(1)}
                      </td>

                      <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.innovation_depth)}`}>
                        {Number(row.innovation_depth || 0).toFixed(1)}
                      </td>

                      <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.execution_readiness)}`}>
                        {Number(row.execution_readiness || 0).toFixed(1)}
                      </td>

                      <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.team_capability)}`}>
                        {Number(row.team_capability || 0).toFixed(1)}
                      </td>

                      <td className="px-6 py-4 text-center font-mono text-gray-300">{row.qualifier_count}</td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${evidenceBadgeClass(row.evidence_quality)}`}>
                          {String(row.evidence_quality || "—").toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${institutionSignalClass(row.institution_signal)}`}>
                          {String(row.institution_signal || "unknown").replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            String(row.hasRegisteredEntity || "").toLowerCase() === "yes"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                              : "bg-gray-500/10 text-gray-300 border-gray-500/20"
                          }`}
                        >
                          {row.hasRegisteredEntity || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-300 max-w-[220px] truncate">{row.sectorCategory || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{row.summary || "—"}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={18} className="px-6 py-10">
                      <div className="text-gray-500">No results for current filters.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-[#2d2d3f] bg-[#0f0f16] text-xs text-gray-500 flex items-center justify-between">
            <div>
              Showing <span className="text-gray-300 font-mono">{viewRows.length}</span> / <span className="text-gray-300 font-mono">{allRows.length}</span> reviewed entries
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
// SMALL UI
// -------------------------
const StatCard = ({ label, value, tone = "indigo" }) => {
  const tones = {
    indigo: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 text-indigo-300",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-300",
    amber: "from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-300",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-300",
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-300",
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 ${tones[tone] || tones.indigo}`}>
      <div className="text-[11px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
    </div>
  );
};

const AnswerBlock = ({ label, value }) => (
  <div>
    <span className="text-xs text-indigo-400 block mb-1">{label}</span>
    <p className="text-sm text-gray-300 leading-relaxed">{value || "N/A"}</p>
  </div>
);

const SignalCard = ({ label, value }) => (
  <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-sm text-white mt-1 break-words">{value}</div>
  </div>
);

const ScoreRow = ({ label, value }) => (
  <div className="bg-[#1a1a2e] p-4 rounded-xl border border-[#2d2d3f]">
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold text-white">{label}</span>
      <div className="flex items-center gap-2">
        <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
            style={{ width: `${(Number(value) / 10) * 100}%` }}
          />
        </div>
        <span className={`font-bold font-mono ${getScoreColor(value)}`}>{Number(value || 0).toFixed(1)}/10</span>
      </div>
    </div>
  </div>
);

const FlagCard = ({ name, active, positive = true }) => {
  const onClass = positive
    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
    : "bg-rose-500/10 border-rose-500/20 text-rose-400";

  const offClass = "bg-[#1a1a2e] border-[#2d2d3f] text-gray-500";

  return (
    <div className={`p-3 rounded-xl border ${active ? onClass : offClass}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-300 font-mono">{name}</span>
        <span className={`text-xs font-bold ${active ? "" : "text-gray-500"}`}>{active ? "YES" : "NO"}</span>
      </div>
    </div>
  );
};

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

const SortIcon = ({ sortKey, sortDir, col }) => {
  if (sortKey !== col) return <ArrowUpDown size={14} className="opacity-50" />;
  return <ArrowUpDown size={14} className={sortDir === "desc" ? "text-indigo-300" : "text-emerald-300"} />;
};

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

export default AIReviewedDataNew;