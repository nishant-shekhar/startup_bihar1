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
  Users2,
  Lightbulb,
  Target,
  Sparkles,
  RefreshCw,
  BadgeAlert,
  FlaskConical,
  GraduationCap,
  Calculator,
  BadgeInfo,
} from "lucide-react";

import { ref, onValue, update } from "firebase/database";
import { rtdb } from "./firebase";

// -------------------------
// CONFIG
// -------------------------
const REVIEWED_BASE_PATH = "startupAIReview";
const SHORTLIST_PATH = "ssu_shortlists_new";

// -------------------------
// HELPERS
// -------------------------
const safeKey = (k) => String(k || "").replace(/[.#$/[\]]/g, "_");
const to2 = (v) => Math.round((Number(v) || 0) * 100) / 100;
const clamp010 = (v) => Math.max(0, Math.min(10, Number(v) || 0));
const clampScore = (v) => {
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10));
};
const joinArr = (v, sep = " | ") =>
  Array.isArray(v) ? v.filter(Boolean).join(sep) : "";

const passEnum = (val, f) =>
  f === "all" ? true : String(val || "").toLowerCase() === String(f).toLowerCase();

const getScoreColor = (score) => {
  const s = Number(score) || 0;
  if (s >= 8) return "text-emerald-400 font-bold";
  if (s >= 7.2) return "text-indigo-300 font-semibold";
  if (s >= 5.8) return "text-amber-400";
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
  if (d === "reserve_band") return "Reserve Band";
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
  if (t === "strong")
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (t === "promising")
    return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
  if (t === "average")
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

const institutionSignalClass = (signal) => {
  const s = String(signal || "").toLowerCase();
  if (s === "strong_relevant")
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (s === "moderate_relevant")
    return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
  if (s === "weak_or_irrelevant")
    return "bg-rose-500/10 text-rose-300 border-rose-500/20";
  return "bg-gray-500/10 text-gray-300 border-gray-500/20";
};

const fraudRiskClass = (label) => {
  const s = String(label || "").toLowerCase();
  if (s === "high")
    return "bg-rose-500/10 text-rose-300 border-rose-500/20";
  if (s === "medium")
    return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
};

const qualificationBucketClass = (bucket) => {
  const s = String(bucket || "").toLowerCase();
  if (s === "strong_technical")
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (s === "sector_science")
    return "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";
  if (s === "moderate_business")
    return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
  if (s === "basic_schooling")
    return "bg-rose-500/10 text-rose-300 border-rose-500/20";
  if (s === "generic")
    return "bg-amber-500/10 text-amber-300 border-amber-500/20";
  return "bg-gray-500/10 text-gray-300 border-gray-500/20";
};

const prettifyQualificationBucket = (bucket) =>
  String(bucket || "unknown").replaceAll("_", " ");

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

const buildMonthOptions = () => [
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

const boolToYesNo = (v) => (v === true ? "Yes" : v === false ? "No" : "—");

const humanizeFlag = (key = "") =>
  String(key)
    .replace(/([A-Z])/g, " $1")
    .replaceAll("_", " ")
    .replace(/\s+/g, " ")
    .trim();

// -------------------------
// NORMALIZE NEW NODE
// -------------------------
function normalizeNewReviewNode(key, v, monthKey) {
  const application = v?.application || {};
  const founderProfile = v?.founderProfile || {};
  const entityDetails = v?.entityDetails || {};
  const files = v?.files || {};
  const answers = v?.answers || {};
  const evaluation = v?.evaluation || {};
  const meta = v?.meta || {};
  const raw = v?.raw || {};
  const ratings = evaluation?.ratings || {};
  const teamAssessment = evaluation?.teamAssessment || {};
  const evidence = evaluation?.evidence || {};
  const fraudRisk = evaluation?.fraudRisk || {};
  const calc = evaluation?.calculationBreakdown || {};
  const derivedSignals = teamAssessment?.derivedSignals || {};

  const ratingsArray = [
    {
      criterion_key: "problem_clarity",
      criterion_label: "Problem Clarity",
      score: ratings?.problemClarity?.score ?? 0,
      reason: ratings?.problemClarity?.reason || "",
    },
    {
      criterion_key: "solution_strength",
      criterion_label: "Solution Strength",
      score: ratings?.solutionStrength?.score ?? 0,
      reason: ratings?.solutionStrength?.reason || "",
    },
    {
      criterion_key: "innovation_depth",
      criterion_label: "Innovation Depth",
      score: ratings?.innovationDepth?.score ?? 0,
      reason: ratings?.innovationDepth?.reason || "",
    },
    {
      criterion_key: "business_model_clarity",
      criterion_label: "Business Model Clarity",
      score: ratings?.businessModelClarity?.score ?? 0,
      reason: ratings?.businessModelClarity?.reason || "",
    },
    {
      criterion_key: "execution_readiness",
      criterion_label: "Execution Readiness",
      score: ratings?.executionReadiness?.score ?? 0,
      reason: ratings?.executionReadiness?.reason || "",
    },
    {
      criterion_key: "team_capability",
      criterion_label: "Team Capability",
      score: ratings?.teamCapability?.score ?? 0,
      reason: ratings?.teamCapability?.reason || "",
    },
  ];

  return {
    _key: key,
    _month: monthKey,
    _raw: v,

    applicationId: application?.applicationId || key,
    startupName: application?.startupName || "Unknown Startup",
    founderName: application?.founderName || "",
    email: application?.email || "",
    phone: application?.phone || "",
    status: application?.status || "",
    applicationType: application?.applicationType || "",
    sectorCategory: application?.sectorCategory || "",
    stage: application?.stage || "",
    teamSize:
      Number(application?.teamSize) ||
      Number(derivedSignals?.teamSize) ||
      Number(founderProfile?.coFounderCount || 0) + 1 ||
      0,
    website: application?.website || "",
    district: application?.district || "",
    state: application?.state || "",
    blockName: application?.blockName || "",
    pincode: application?.pincode || "",
    applicantAddress: application?.applicantAddress || "",
    gender: application?.gender || "",
    category: application?.category || "",
    dateOfBirth: application?.dateOfBirth || "",

    qualification: founderProfile?.qualification || "",
    institution: founderProfile?.institution || "",
    linkedinProfile: founderProfile?.linkedinProfile || "",
    hasRegisteredEntityBool: entityDetails?.hasRegisteredEntity,
    hasRegisteredEntity: boolToYesNo(entityDetails?.hasRegisteredEntity),
    entityName: entityDetails?.entityName || "",
    entityType: entityDetails?.entityType || "",
    entityRegistrationNumber: entityDetails?.entityRegistrationNumber || "",
    dateOfRegistration: entityDetails?.dateOfRegistration || "",
    businessAddress: entityDetails?.businessAddress || "",

    pitchDeckFileName: files?.pitchDeck?.fileName || "",
    pitchDeckURL: files?.pitchDeck?.url || "",
    profilePhotoFileName: files?.profilePhoto?.fileName || "",
    profilePhotoURL: files?.profilePhoto?.url || "",
    entityCertificateFileName: files?.entityCertificate?.fileName || "",
    entityCertificateURL: files?.entityCertificate?.url || "",

    coFounderCount: Number(founderProfile?.coFounderCount || 0),
    isSoleFounder: Boolean(founderProfile?.isSoleFounder),
    coFounders: founderProfile?.coFoundersRaw || "",

    answers,
    evaluation,
    meta,
    apiResponse: raw?.apiResponse?.response || null,
    rawApi: raw?.apiResponse || null,

    decision: evaluation?.decision || "",
    decisionReason: evaluation?.decisionReason || "",
    business_type: evaluation?.businessType || "",
    startup_quality: evaluation?.startupQuality || "",
    differentiation_flag: evaluation?.differentiationFlag || "",

    final_score: Number(evaluation?.finalScore || 0),
    rubric_score: Number(evaluation?.rubricScore || 0),
    readiness_modifier: Number(evaluation?.readinessModifier || 0),
    score_band: evaluation?.scoreBand || "",

    problem_clarity: Number(ratings?.problemClarity?.score || 0),
    solution_strength: Number(ratings?.solutionStrength?.score || 0),
    innovation_depth: Number(ratings?.innovationDepth?.score || 0),
    business_model_clarity: Number(ratings?.businessModelClarity?.score || 0),
    execution_readiness: Number(ratings?.executionReadiness?.score || 0),
    team_capability: Number(ratings?.teamCapability?.score || 0),

    qualifier_count: Number(evaluation?.qualifierCount || 0),
    summary: evaluation?.summary || "",

    institution_signal: teamAssessment?.institutionSignal || "",
    institution_reason: teamAssessment?.institutionReason || "",
    founder_relevance_score: Number(teamAssessment?.founderRelevanceScore || 0),
    cofounder_strength_score: Number(teamAssessment?.cofounderStrengthScore || 0),
    team_completeness_score: Number(teamAssessment?.teamCompletenessScore || 0),
    execution_adjustment_applied: Number(
      teamAssessment?.executionAdjustmentApplied || 0
    ),
    derived_team_signal: Number(derivedSignals?.teamCapabilityScore || 0),
    qualification_bucket: teamAssessment?.qualificationBucket || "",
    founder_qualification: teamAssessment?.founderQualification || "",
    founder_institution: teamAssessment?.founderInstitution || "",
    parsed_cofounders: Array.isArray(teamAssessment?.parsedCofounders)
      ? teamAssessment.parsedCofounders
      : [],

    evidence_score: Number(evidence?.evidenceScore || 0),
    evidence_quality: evidence?.evidenceQuality || "",
    proof_strength: Number(evidence?.proofStrength || 0),
    numbers_count: Number(evidence?.numbersCount || 0),
    currency_mentions: Number(evidence?.currencyMentions || 0),
    dates_count: Number(evidence?.datesCount || 0),
    traction_hits: Array.isArray(evidence?.tractionHits) ? evidence.tractionHits : [],

    fraud_risk_score: Number(fraudRisk?.buzzwordRisk || 0),
    fraud_risk_label: fraudRisk?.buzzwordRiskLabel || "",
    possible_claim_inflation: Boolean(fraudRisk?.possibleClaimInflation),
    buzzword_count: Number(fraudRisk?.buzzwordCount || 0),
    proof_count: Number(fraudRisk?.proofCount || 0),
    strong_proof_count: Number(fraudRisk?.strongProofCount || 0),
    weak_generic_count: Number(fraudRisk?.weakGenericCount || 0),

    strengths: Array.isArray(evaluation?.strengths) ? evaluation.strengths : [],
    risks_and_gaps: Array.isArray(evaluation?.risksAndGaps)
      ? evaluation.risksAndGaps
      : [],
    pitch_questions: Array.isArray(evaluation?.pitchQuestions)
      ? evaluation.pitchQuestions
      : [],
    improvement_suggestions: Array.isArray(evaluation?.improvementSuggestions)
      ? evaluation.improvementSuggestions
      : [],
    qualifiers: evaluation?.qualifiers || {},
    missing_flags: evaluation?.missingFlags || {},
    ratings: ratingsArray.filter(
      (r) => r.score || r.reason || r.criterion_label
    ),

    calculation_breakdown: {
      weighted_contributions: calc?.weightedContributions || {},
      positive_signals: calc?.positiveSignals || {},
      negative_signals: calc?.negativeSignals || {},
      positive_total: Number(calc?.positiveTotal || 0),
      negative_total: Number(calc?.negativeTotal || 0),
      formula: calc?.formula || {},
    },

    updatedAt: meta?.updatedAt_ms || 0,
    model: meta?.model || "",
    elapsed_ms: Number(meta?.elapsedMs || 0),
  };
}

// -------------------------
// DETAIL UI
// -------------------------
const Meta = ({ label, value }) => (
  <div>
    <div className="text-[11px] text-gray-500 uppercase tracking-wider">{label}</div>
    <div className="text-sm text-gray-200 mt-1 break-words">{value || "—"}</div>
  </div>
);

const BadgePill = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${className}`}
  >
    {children}
  </span>
);

const SignalCard = ({ label, value }) => (
  <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
    <div className="text-xs text-gray-500">{label}</div>
    <div className="text-sm text-white mt-1 break-words">{value}</div>
  </div>
);

const AnswerBlock = ({ label, value }) => (
  <div>
    <span className="text-xs text-indigo-400 block mb-1">{label}</span>
    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
      {value || "N/A"}
    </p>
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
        <span className={`font-bold font-mono ${getScoreColor(value)}`}>
          {Number(value || 0).toFixed(1)}/10
        </span>
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
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-gray-300 font-mono">
          {humanizeFlag(name)}
        </span>
        <span className={`text-xs font-bold ${active ? "" : "text-gray-500"}`}>
          {active ? "YES" : "NO"}
        </span>
      </div>
    </div>
  );
};

const DetailModal = ({ entry, onClose }) => {
  if (!entry) return null;

  const answers = entry.answers || {};
  const ratings = entry.ratings || [];
  const qualifiers = entry.qualifiers || {};
  const missingFlags = entry.missing_flags || {};
  const strengths = entry.strengths || [];
  const risksAndGaps = entry.risks_and_gaps || [];
  const pitchQuestions = entry.pitch_questions || [];
  const improvementSuggestions = entry.improvement_suggestions || [];
  const parsedCofounders = entry.parsed_cofounders || [];
  const calc = entry.calculation_breakdown || {};
  const weightedContrib = calc?.weighted_contributions || {};
  const positiveSignals = calc?.positive_signals || {};
  const negativeSignals = calc?.negative_signals || {};

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0f0f16] border border-[#2d2d3f] w-full max-w-7xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-[#2d2d3f] flex items-center justify-between bg-[#13131f]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white" size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {entry.startupName || "Unknown Startup"}
                <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                  {entry.applicationId}
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <BadgePill className={getDecisionPill(entry.decision)}>
                  {prettifyDecision(entry.decision)}
                </BadgePill>

                <BadgePill
                  className={
                    String(entry.business_type || "").toLowerCase() === "startup"
                      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }
                >
                  {prettifyBusinessType(entry.business_type)}
                </BadgePill>

                <BadgePill className={qualityBadgeClass(entry.startup_quality)}>
                  {prettifyQualityTier(entry.startup_quality)}
                </BadgePill>

                <BadgePill className={getBandClass(entry.score_band)}>
                  Band {entry.score_band || "D"}
                </BadgePill>

                <BadgePill className={evidenceBadgeClass(entry.evidence_quality)}>
                  Evidence: {String(entry.evidence_quality || "unknown").toUpperCase()}
                </BadgePill>

                <BadgePill className={institutionSignalClass(entry.institution_signal)}>
                  Institution:{" "}
                  {String(entry.institution_signal || "unknown").replaceAll("_", " ")}
                </BadgePill>

                <BadgePill className={qualificationBucketClass(entry.qualification_bucket)}>
                  Qualification: {prettifyQualificationBucket(entry.qualification_bucket)}
                </BadgePill>

                <BadgePill className={fraudRiskClass(entry.fraud_risk_label)}>
                  Fraud Risk: {entry.fraud_risk_label || "low"}
                </BadgePill>

                {entry.possible_claim_inflation ? (
                  <BadgePill className="bg-rose-500/10 text-rose-300 border-rose-500/20">
                    Claim inflation risk
                  </BadgePill>
                ) : null}

                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">
                  Final:{" "}
                  <span className={`${getScoreColor(entry.final_score)} font-mono`}>
                    {Number(entry.final_score || 0).toFixed(1)}/10
                  </span>
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">
                  Rubric:{" "}
                  <span className="text-indigo-300 font-mono">
                    {Number(entry.rubric_score || 0).toFixed(1)}
                  </span>
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">
                  Time: {Math.round(Number(entry.elapsed_ms || 0) / 1000)}s
                </span>
              </div>

              {entry.decisionReason ? (
                <p className="mt-2 text-sm text-gray-300 max-w-3xl">
                  {entry.decisionReason}
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
                  <Info size={16} /> Input Data
                </h3>

                <div className="space-y-4 bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50">
                  <AnswerBlock
                    label="Problem Statement"
                    value={answers.problemStatement}
                  />
                  <AnswerBlock label="Solution" value={answers.solution} />
                  <AnswerBlock label="Innovation" value={answers.innovation} />
                  <AnswerBlock
                    label="Business Model"
                    value={answers.businessModel}
                  />
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BarChart3 size={16} /> Detailed Scores
                </h3>

                <div className="space-y-3">
                  {ratings.map((rating, idx) => (
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
                              style={{
                                width: `${(Number(rating.score) / 10) * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-emerald-400 font-bold font-mono">
                            {Number(rating.score).toFixed(1)}/10
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-indigo-500/20 pl-3">
                        {rating.reason || "—"}
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
                    <SignalCard
                      label="Rubric Score"
                      value={Number(entry.rubric_score || 0).toFixed(2)}
                    />
                    <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                      <div className="text-xs text-gray-500">Readiness Modifier</div>
                      <div
                        className={`text-lg font-mono mt-1 ${scoreDeltaClass(
                          entry.readiness_modifier
                        )}`}
                      >
                        {Number(entry.readiness_modifier || 0) > 0 ? "+" : ""}
                        {Number(entry.readiness_modifier || 0).toFixed(2)}
                      </div>
                    </div>
                    <SignalCard
                      label="Final Score"
                      value={Number(entry.final_score || 0).toFixed(2)}
                    />
                  </div>

                  <div>
                    <div className="text-xs text-indigo-300 font-semibold mb-2">
                      Weighted Contributions
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(weightedContrib).map(([k, v]) => (
                        <div
                          key={k}
                          className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]"
                        >
                          <div className="text-xs text-gray-500 font-mono">
                            {humanizeFlag(k)}
                          </div>
                          <div className="text-sm text-white mt-1">
                            Score {Number(v?.score || 0).toFixed(1)} × Weight{" "}
                            {Number(v?.weight || 0).toFixed(2)}
                          </div>
                          <div className="text-sm font-mono text-indigo-300 mt-1">
                            = {Number(v?.contribution || 0).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-emerald-300 font-semibold mb-2">
                      Positive Readiness Signals
                    </div>
                    <div className="space-y-2">
                      {Object.entries(positiveSignals).map(([k, v]) => (
                        <div
                          key={k}
                          className="flex items-center justify-between p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]"
                        >
                          <span className="text-xs text-gray-300 font-mono">
                            {humanizeFlag(k)}
                          </span>
                          <span className="text-sm font-mono text-emerald-400">
                            +{Number(v || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/20">
                        <span className="text-xs text-emerald-200 font-semibold">
                          Positive Total
                        </span>
                        <span className="text-sm font-mono text-emerald-300">
                          +{Number(calc.positive_total || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-rose-300 font-semibold mb-2">
                      Negative Readiness Signals
                    </div>
                    <div className="space-y-2">
                      {Object.entries(negativeSignals).map(([k, v]) => (
                        <div
                          key={k}
                          className="flex items-center justify-between p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]"
                        >
                          <span className="text-xs text-gray-300 font-mono">
                            {humanizeFlag(k)}
                          </span>
                          <span className="text-sm font-mono text-rose-400">
                            -{Number(v || 0).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-3 rounded-xl border bg-rose-500/10 border-rose-500/20">
                        <span className="text-xs text-rose-200 font-semibold">
                          Negative Total
                        </span>
                        <span className="text-sm font-mono text-rose-300">
                          -{Number(calc.negative_total || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShieldAlert size={16} /> Missing Flags
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(missingFlags).map(([k, v]) => (
                    <div
                      key={k}
                      className={`p-3 rounded-xl border ${
                        v
                          ? "bg-rose-500/10 border-rose-500/20"
                          : "bg-[#1a1a2e] border-[#2d2d3f]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300 font-mono">
                          {humanizeFlag(k)}
                        </span>
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
            </div>

            <div className="space-y-8">
              <section className="bg-gradient-to-br from-[#1a1a2e] to-[#13131f] p-6 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-900/10">
                <h3 className="text-indigo-300 font-semibold mb-3 flex items-center gap-2">
                  <Sparkles size={18} /> Executive Summary
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm italic">
                  "{entry.summary || "No summary available."}"
                </p>
              </section>

              <section className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BadgeInfo size={16} /> Decision Notes
                </h3>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                    <div className="text-xs text-gray-500">Decision Reason</div>
                    <div className="text-sm text-white mt-1">
                      {entry.decisionReason || "—"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <SignalCard
                      label="Decision"
                      value={prettifyDecision(entry.decision)}
                    />
                    <SignalCard label="Score Band" value={entry.score_band || "D"} />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 size={16} /> Team Assessment
                </h3>

                <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <BadgePill className={institutionSignalClass(entry.institution_signal)}>
                      Institution:{" "}
                      {String(entry.institution_signal || "unknown").replaceAll(
                        "_",
                        " "
                      )}
                    </BadgePill>

                    <BadgePill className={qualificationBucketClass(entry.qualification_bucket)}>
                      {prettifyQualificationBucket(entry.qualification_bucket)}
                    </BadgePill>

                    <BadgePill className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
                      Team Score: {Number(entry.team_capability || 0).toFixed(1)}
                    </BadgePill>
                  </div>

                  <div className="text-sm text-gray-300 leading-relaxed">
                    {entry.institution_reason || "No institution assessment available."}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SignalCard
                      label="Founder Relevance"
                      value={Number(entry.founder_relevance_score || 0).toFixed(1)}
                    />
                    <SignalCard
                      label="Cofounder Strength"
                      value={Number(entry.cofounder_strength_score || 0).toFixed(1)}
                    />
                    <SignalCard
                      label="Team Completeness"
                      value={Number(entry.team_completeness_score || 0).toFixed(1)}
                    />
                    <SignalCard
                      label="Derived Team Signal"
                      value={Number(entry.derived_team_signal || 0).toFixed(1)}
                    />
                    <SignalCard
                      label="Founder Qualification"
                      value={entry.founder_qualification || "—"}
                    />
                    <SignalCard
                      label="Founder Institution"
                      value={entry.founder_institution || "—"}
                    />
                  </div>

                  {(parsedCofounders || []).length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Users2 size={14} /> Parsed Cofounders
                      </div>
                      <div className="space-y-2">
                        {parsedCofounders.map((cf, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">Name:</span>{" "}
                                <span className="text-gray-200">{cf?.name || "—"}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Qualification:</span>{" "}
                                <span className="text-gray-200">
                                  {cf?.qualification || "—"}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-500">Email:</span>{" "}
                                <span className="text-gray-200">{cf?.email || "—"}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Phone:</span>{" "}
                                <span className="text-gray-200">{cf?.phone || "—"}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BrainCircuit size={16} /> Evidence Signals
                </h3>

                <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 grid grid-cols-2 gap-3">
                  <SignalCard
                    label="Evidence Score"
                    value={Number(entry.evidence_score || 0).toFixed(1)}
                  />
                  <SignalCard
                    label="Evidence Quality"
                    value={entry.evidence_quality || "—"}
                  />
                  <SignalCard
                    label="Proof Strength"
                    value={Number(entry.proof_strength || 0).toFixed(1)}
                  />
                  <SignalCard label="Numbers Count" value={entry.numbers_count} />
                  <SignalCard
                    label="Currency Mentions"
                    value={entry.currency_mentions}
                  />
                  <SignalCard label="Dates Count" value={entry.dates_count} />
                  <SignalCard
                    label="Traction Hits"
                    value={joinArr(entry.traction_hits, ", ") || "—"}
                  />
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BadgeAlert size={16} /> Fraud / Buzzword Filter
                </h3>

                <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <BadgePill className={fraudRiskClass(entry.fraud_risk_label)}>
                      Risk: {entry.fraud_risk_label || "low"}
                    </BadgePill>

                    {entry.possible_claim_inflation ? (
                      <BadgePill className="bg-rose-500/10 text-rose-300 border-rose-500/20">
                        Proof-light / buzzword-heavy
                      </BadgePill>
                    ) : (
                      <BadgePill className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                        No claim inflation flag
                      </BadgePill>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SignalCard
                      label="Buzzword Risk Score"
                      value={Number(entry.fraud_risk_score || 0).toFixed(2)}
                    />
                    <SignalCard label="Buzzword Count" value={entry.buzzword_count} />
                    <SignalCard label="Proof Count" value={entry.proof_count} />
                    <SignalCard
                      label="Strong Proof Count"
                      value={entry.strong_proof_count}
                    />
                    <SignalCard
                      label="Weak Generic Count"
                      value={entry.weak_generic_count}
                    />
                    <SignalCard
                      label="Claim Inflation"
                      value={entry.possible_claim_inflation ? "Yes" : "No"}
                    />
                  </div>
                </div>
              </section>

              {strengths.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {strengths.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-emerald-500/10"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-emerald-400 shrink-0 mt-0.5"
                        />
                        {item}
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
                    {risksAndGaps.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-rose-500/10"
                      >
                        <AlertTriangle
                          size={16}
                          className="text-rose-400 shrink-0 mt-0.5"
                        />
                        {item}
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
                      <li
                        key={i}
                        className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-amber-500/10"
                      >
                        <AlertTriangle
                          size={16}
                          className="text-amber-400 shrink-0 mt-0.5"
                        />
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
                      <div
                        key={i}
                        className="flex gap-4 p-4 border-b border-[#2d2d3f] last:border-0 hover:bg-[#202030] transition-colors"
                      >
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
                  <CheckCircle2 size={16} /> Qualifiers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(qualifiers).map(([k, v]) => (
                    <FlagCard key={k} name={k} active={Boolean(v)} positive />
                  ))}
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
                        `Final Score: ${Number(entry.final_score || 0).toFixed(1)}`,
                        `Proof Strength: ${Number(entry.proof_strength || 0).toFixed(1)}`,
                        `Fraud Risk: ${entry.fraud_risk_label || "low"}`,
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
  const [qualificationFilter, setQualificationFilter] = useState("all");
  const [fraudFilter, setFraudFilter] = useState("all");
  const [claimInflationFilter, setClaimInflationFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [registeredEntityFilter, setRegisteredEntityFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  const [minOverall, setMinOverall] = useState(0);
  const [maxOverall, setMaxOverall] = useState(10);
  const [minInnovation, setMinInnovation] = useState(0);
  const [minTeam, setMinTeam] = useState(0);
  const [minQualifiers, setMinQualifiers] = useState(0);
  const [minProofStrength, setMinProofStrength] = useState(0);

  const [sortKey, setSortKey] = useState("final_score");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    setLoading(true);
    const reviewsRef = ref(rtdb, `${REVIEWED_BASE_PATH}/${monthFilter}`);

    const unsub = onValue(
      reviewsRef,
      (snap) => {
        const val = snap.val() || {};
        const rows = Object.entries(val).map(([k, v]) =>
          normalizeNewReviewNode(k, v, monthFilter)
        );
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

    const passClaimInflation = (row) => {
      if (claimInflationFilter === "all") return true;
      if (claimInflationFilter === "yes") return Boolean(row.possible_claim_inflation);
      if (claimInflationFilter === "no") return !Boolean(row.possible_claim_inflation);
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
          row.qualification,
          row.qualification_bucket,
          row.fraud_risk_label,
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
      if (!passEnum(row.qualification_bucket, qualificationFilter)) return false;
      if (!passEnum(row.fraud_risk_label, fraudFilter)) return false;
      if (!passEnum(row.stage, stageFilter)) return false;
      if (!passEnum(row.entityType, entityTypeFilter)) return false;
      if (!passEnum(row.sectorCategory, sectorFilter)) return false;
      if (!passRegistered(row)) return false;
      if (!passClaimInflation(row)) return false;

      if (Number(row.final_score || 0) < Number(minOverall)) return false;
      if (Number(row.final_score || 0) > Number(maxOverall)) return false;
      if (Number(row.innovation_depth || 0) < Number(minInnovation)) return false;
      if (Number(row.team_capability || 0) < Number(minTeam)) return false;
      if (Number(row.qualifier_count || 0) < Number(minQualifiers)) return false;
      if (Number(row.proof_strength || 0) < Number(minProofStrength)) return false;

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
    qualificationFilter,
    fraudFilter,
    claimInflationFilter,
    stageFilter,
    registeredEntityFilter,
    entityTypeFilter,
    sectorFilter,
    minOverall,
    maxOverall,
    minInnovation,
    minTeam,
    minQualifiers,
    minProofStrength,
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
      Stage: row.stage,
      Decision: prettifyDecision(row.decision),
      "Decision Reason": row.decisionReason,
      "Business Type": prettifyBusinessType(row.business_type),
      "Startup Quality": prettifyQualityTier(row.startup_quality),
      "Differentiation Flag": row.differentiation_flag,

      "Final Score": row.final_score,
      "Rubric Score": row.rubric_score,
      "Readiness Modifier": row.readiness_modifier,
      "Score Band": row.score_band,

      "Problem Clarity": row.problem_clarity,
      "Solution Strength": row.solution_strength,
      "Innovation Depth": row.innovation_depth,
      "Business Model Clarity": row.business_model_clarity,
      "Execution Readiness": row.execution_readiness,
      "Team Capability": row.team_capability,
      "Proof Strength": row.proof_strength,

      "Qualifier Count": row.qualifier_count,
      "Institution Signal": row.institution_signal,
      "Qualification Bucket": row.qualification_bucket,
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

      "Fraud Risk Score": row.fraud_risk_score,
      "Fraud Risk Label": row.fraud_risk_label,
      "Possible Claim Inflation": row.possible_claim_inflation ? "Yes" : "No",
      "Buzzword Count": row.buzzword_count,
      "Proof Count": row.proof_count,
      "Strong Proof Count": row.strong_proof_count,
      "Weak Generic Count": row.weak_generic_count,

      "Registered Entity": row.hasRegisteredEntity,
      "Entity Type": row.entityType,
      "Entity Name": row.entityName,
      "Entity Registration Number": row.entityRegistrationNumber,
      "Date Of Registration": row.dateOfRegistration,

      Qualification: row.qualification,
      Institution: row.institution,
      LinkedIn: row.linkedinProfile,
      "Team Size": row.teamSize,
      "Co-Founder Count": row.coFounderCount,
      "Co-Founders": row.coFounders,
      "Parsed Cofounders": JSON.stringify(row.parsed_cofounders || []),

      Sector: row.sectorCategory,
      District: row.district,
      State: row.state,

      "Problem Statement": row.answers?.problemStatement || "",
      Solution: row.answers?.solution || "",
      Innovation: row.answers?.innovation || "",
      "Business Model": row.answers?.businessModel || "",

      Strengths: joinArr(row.strengths),
      "Risks & Gaps": joinArr(row.risks_and_gaps),
      "Improvement Suggestions": joinArr(row.improvement_suggestions),
      "Pitch Questions": joinArr(row.pitch_questions),
      Summary: row.summary || "",
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
        final_score: Number(r.final_score || 0),
        rubric_score: Number(r.rubric_score || 0),
        readiness_modifier: Number(r.readiness_modifier || 0),
        score_band: r.score_band || "",
        startup_quality: r.startup_quality || "",
        stage: r.stage || "",
        sectorCategory: r.sectorCategory || "",
        district: r.district || "",
        hasRegisteredEntity: r.hasRegisteredEntity || "",
        month: r._month,
        proof_strength: Number(r.proof_strength || 0),
        fraud_risk_label: r.fraud_risk_label || "",
        qualification_bucket: r.qualification_bucket || "",
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
    setQualificationFilter("all");
    setFraudFilter("all");
    setClaimInflationFilter("all");
    setStageFilter("all");
    setRegisteredEntityFilter("all");
    setEntityTypeFilter("all");
    setSectorFilter("all");
    setMinOverall(0);
    setMaxOverall(10);
    setMinInnovation(0);
    setMinTeam(0);
    setMinQualifiers(0);
    setMinProofStrength(0);
    setSortKey("final_score");
    setSortDir("desc");
    clearSelection();
  };

  const stats = useMemo(() => {
    const total = viewRows.length;
    const pitch = viewRows.filter((r) => r.decision === "pitch_call").length;
    const hold = viewRows.filter(
      (r) => r.decision === "hold_need_info" || r.decision === "reserve_band"
    ).length;
    const reject = viewRows.filter((r) => r.decision === "reject").length;
    const strong = viewRows.filter((r) => r.startup_quality === "strong").length;
    const inflation = viewRows.filter((r) => r.possible_claim_inflation).length;
    const avg = total
      ? to2(viewRows.reduce((a, b) => a + Number(b.final_score || 0), 0) / total)
      : 0;

    return { total, pitch, hold, reject, strong, inflation, avg };
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
                  Strict Prompt
                </span>
              </h2>
              <p className="text-gray-400 text-sm">
                Reads reviewed data from{" "}
                <span className="font-mono text-indigo-300">startupAIReview/Month</span>.
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

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-5">
          <StatCard label="Visible" value={stats.total} tone="indigo" />
          <StatCard label="Pitch Call" value={stats.pitch} tone="emerald" />
          <StatCard label="Hold / Reserve" value={stats.hold} tone="amber" />
          <StatCard label="Strong" value={stats.strong} tone="purple" />
          <StatCard label="Inflation Risk" value={stats.inflation} tone="rose" />
          <StatCard label="Avg Score" value={stats.avg} tone="blue" />
        </div>

        <div className="rounded-2xl border border-[#2d2d3f] bg-[#13131f]/60 p-4 mb-5">
          <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
            <div className="flex items-center gap-2 rounded-xl border border-[#2d2d3f] bg-[#0f0f16] px-3 py-2 flex-1">
              <Search size={16} className="text-gray-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search application, startup, founder, sector, summary, qualification, fraud, strengths..."
                className="w-full bg-transparent outline-none text-sm text-gray-200 placeholder:text-gray-600"
              />
              {q ? (
                <button onClick={() => setQ("")} className="p-1 rounded hover:bg-white/5">
                  <X size={16} className="text-gray-500" />
                </button>
              ) : null}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 xl:flex xl:flex-wrap gap-2">
              <Select
                label="Month"
                value={monthFilter}
                onChange={setMonthFilter}
                options={monthOptions}
              />
              <Select
                label="Decision"
                value={decisionFilter}
                onChange={setDecisionFilter}
                options={["all", "pitch_call", "reserve_band", "hold_need_info", "reject"]}
              />
              <Select
                label="Quality"
                value={qualityFilter}
                onChange={setQualityFilter}
                options={["all", "strong", "promising", "average", "weak"]}
              />
              <Select
                label="Evidence"
                value={evidenceFilter}
                onChange={setEvidenceFilter}
                options={["all", "high", "medium", "low"]}
              />
              <Select
                label="Institution"
                value={institutionFilter}
                onChange={setInstitutionFilter}
                options={[
                  "all",
                  "strong_relevant",
                  "moderate_relevant",
                  "weak_or_irrelevant",
                  "unknown",
                ]}
              />
              <Select
                label="Qualification"
                value={qualificationFilter}
                onChange={setQualificationFilter}
                options={[
                  "all",
                  "strong_technical",
                  "sector_science",
                  "moderate_business",
                  "basic_schooling",
                  "generic",
                  "unknown",
                ]}
              />
              <Select
                label="Fraud Risk"
                value={fraudFilter}
                onChange={setFraudFilter}
                options={["all", "low", "medium", "high"]}
              />
              <Select
                label="Claim Inflation"
                value={claimInflationFilter}
                onChange={setClaimInflationFilter}
                options={["all", "yes", "no"]}
              />
              <Select
                label="Stage"
                value={stageFilter}
                onChange={setStageFilter}
                options={stageOptions}
              />
              <Select
                label="Registered"
                value={registeredEntityFilter}
                onChange={setRegisteredEntityFilter}
                options={["all", "yes", "no"]}
              />
              <Select
                label="Entity Type"
                value={entityTypeFilter}
                onChange={setEntityTypeFilter}
                options={entityTypeOptions}
              />
              <Select
                label="Sector"
                value={sectorFilter}
                onChange={setSectorFilter}
                options={sectorOptions}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 xl:grid-cols-5 gap-3">
            <Range
              icon={<Gauge size={16} className="text-indigo-300" />}
              title="Final Score Range"
              leftLabel={`Min: ${to2(minOverall)}`}
              rightLabel={`Max: ${to2(maxOverall)}`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={minOverall}
                  onChange={(e) => setMinOverall(clamp010(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={maxOverall}
                  onChange={(e) => setMaxOverall(clamp010(e.target.value))}
                  className="flex-1 accent-emerald-500"
                />
              </div>
            </Range>

            <Range
              icon={<TrendingUp size={16} className="text-indigo-300" />}
              title="Minimum Innovation"
              leftLabel={`≥ ${to2(minInnovation)}`}
              rightLabel={`${viewRows.length} results`}
            >
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={minInnovation}
                onChange={(e) => setMinInnovation(clamp010(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </Range>

            <Range
              icon={<Users size={16} className="text-indigo-300" />}
              title="Minimum Team Score"
              leftLabel={`≥ ${to2(minTeam)}`}
              rightLabel={`${selectedCount} selected`}
            >
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={minTeam}
                onChange={(e) => setMinTeam(clamp010(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </Range>

            <Range
              icon={<FlaskConical size={16} className="text-indigo-300" />}
              title="Minimum Proof Strength"
              leftLabel={`≥ ${to2(minProofStrength)}`}
              rightLabel="Proof"
            >
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={minProofStrength}
                onChange={(e) => setMinProofStrength(clamp010(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </Range>

            <Range
              icon={<Filter size={16} className="text-indigo-300" />}
              title="Minimum Qualifiers"
              leftLabel={`≥ ${minQualifiers}`}
              rightLabel="Selection"
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
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-[#13131f] border border-[#2d2d3f] rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="overflow-x-auto custom-scrollbar flex-1" ref={tableRef}>
            <table className="w-full text-left text-sm text-gray-400 relative">
              <thead className="text-xs uppercase bg-[#0f0f16] text-gray-500 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected && viewRows.length > 0}
                      onChange={() =>
                        allVisibleSelected ? deselectVisible() : selectVisible()
                      }
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

                  <Th label="Band" onClick={() => toggleSort("score_band")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="score_band" />
                  </Th>

                  <Th label="Final" onClick={() => toggleSort("final_score")} className="text-indigo-300">
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="final_score" />
                  </Th>

                  <Th label="Rubric" onClick={() => toggleSort("rubric_score")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="rubric_score" />
                  </Th>

                  <Th label="Modifier" onClick={() => toggleSort("readiness_modifier")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="readiness_modifier" />
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

                  <Th label="Proof" onClick={() => toggleSort("proof_strength")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="proof_strength" />
                  </Th>

                  <Th label="Fraud" onClick={() => toggleSort("fraud_risk_label")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="fraud_risk_label" />
                  </Th>

                  <Th label="Qualification" onClick={() => toggleSort("qualification_bucket")}>
                    <SortIcon sortKey={sortKey} sortDir={sortDir} col="qualification_bucket" />
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
                    <td colSpan={22} className="px-6 py-10">
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
                        <input
                          type="checkbox"
                          checked={isSelected(row.applicationId)}
                          onChange={() => toggleSelected(row.applicationId)}
                        />
                      </td>

                      <td className="px-6 py-4 font-mono text-gray-300 group-hover:text-indigo-400 transition-colors">
                        {row.applicationId}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        {row.startupName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {row.founderName || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <BadgePill className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
                          {row.stage || "—"}
                        </BadgePill>
                      </td>

                      <td className="px-6 py-4">
                        <BadgePill className={getDecisionPill(row.decision)}>
                          {prettifyDecision(row.decision)}
                        </BadgePill>
                      </td>

                      <td className="px-6 py-4">
                        <BadgePill className={getBandClass(row.score_band)}>
                          {row.score_band || "D"}
                        </BadgePill>
                      </td>

                      <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.final_score)}`}>
                        {Number(row.final_score || 0).toFixed(1)}
                      </td>

                      <td className="px-6 py-4 text-center font-mono text-indigo-300">
                        {Number(row.rubric_score || 0).toFixed(1)}
                      </td>

                      <td className={`px-6 py-4 text-center font-mono ${scoreDeltaClass(row.readiness_modifier)}`}>
                        {Number(row.readiness_modifier || 0) > 0 ? "+" : ""}
                        {Number(row.readiness_modifier || 0).toFixed(1)}
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

                      <td className="px-6 py-4 text-center font-mono text-indigo-300">
                        {Number(row.proof_strength || 0).toFixed(1)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <BadgePill className={fraudRiskClass(row.fraud_risk_label)}>
                            {row.fraud_risk_label || "low"}
                          </BadgePill>
                          {row.possible_claim_inflation ? (
                            <span className="text-[11px] text-rose-300">
                              claim inflation
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <BadgePill className={qualificationBucketClass(row.qualification_bucket)}>
                          {prettifyQualificationBucket(row.qualification_bucket)}
                        </BadgePill>
                      </td>

                      <td className="px-6 py-4 text-center font-mono text-gray-300">
                        {row.qualifier_count}
                      </td>

                      <td className="px-6 py-4">
                        <BadgePill className={evidenceBadgeClass(row.evidence_quality)}>
                          {String(row.evidence_quality || "—").toUpperCase()}
                        </BadgePill>
                      </td>

                      <td className="px-6 py-4">
                        <BadgePill className={institutionSignalClass(row.institution_signal)}>
                          {String(row.institution_signal || "unknown").replaceAll("_", " ")}
                        </BadgePill>
                      </td>

                      <td className="px-6 py-4">
                        <BadgePill
                          className={
                            String(row.hasRegisteredEntity || "").toLowerCase() === "yes"
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                              : "bg-gray-500/10 text-gray-300 border-gray-500/20"
                          }
                        >
                          {row.hasRegisteredEntity || "—"}
                        </BadgePill>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-300 max-w-[220px] truncate">
                        {row.sectorCategory || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">
                        {row.summary || "—"}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={22} className="px-6 py-10">
                      <div className="text-gray-500">
                        No results for current filters.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-[#2d2d3f] bg-[#0f0f16] text-xs text-gray-500 flex items-center justify-between">
            <div>
              Showing <span className="text-gray-300 font-mono">{viewRows.length}</span>{" "}
              / <span className="text-gray-300 font-mono">{allRows.length}</span>{" "}
              reviewed entries
            </div>
            <div className="text-gray-500">
              Sort: <span className="text-gray-300 font-mono">{sortKey}</span> (
              {sortDir})
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedEntry && (
            <DetailModal
              entry={selectedEntry}
              onClose={() => setSelectedEntry(null)}
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

// -------------------------
// SMALL UI
// -------------------------
const StatCard = ({ label, value, tone = "indigo" }) => {
  const tones = {
    indigo:
      "from-indigo-500/20 to-indigo-600/5 border-indigo-500/20 text-indigo-300",
    emerald:
      "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 text-emerald-300",
    amber:
      "from-amber-500/20 to-amber-600/5 border-amber-500/20 text-amber-300",
    purple:
      "from-purple-500/20 to-purple-600/5 border-purple-500/20 text-purple-300",
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20 text-blue-300",
    rose: "from-rose-500/20 to-rose-600/5 border-rose-500/20 text-rose-300",
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 ${tones[tone] || tones.indigo}`}>
      <div className="text-[11px] uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-2 text-2xl font-bold text-white">{value}</div>
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
  return (
    <ArrowUpDown
      size={14}
      className={sortDir === "desc" ? "text-indigo-300" : "text-emerald-300"}
    />
  );
};

const Select = ({ label, value, onChange, options }) => (
  <label className="flex flex-col gap-1">
    <span className="text-[11px] text-gray-500 uppercase tracking-wider">
      {label}
    </span>
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