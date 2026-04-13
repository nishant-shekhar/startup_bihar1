// src/components/AIReviewSection.jsx
import React, { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  X,
  Bot,
  Loader,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  Settings,
  SlidersHorizontal,
  Info,
  Users,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  BrainCircuit,
  Building2,
  GraduationCap,
  Target,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThinkingIndicator from "./ThinkingIndicator";
import "./AIReviewSection.css";
import { saveStartupReviewToRTDBNew } from "./Utils/saveReviewToRTDB";
// based on your old component structure and flow :contentReference[oaicite:0]{index=0}

// -------------------------
// UI HELPERS
// -------------------------
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

const institutionSignalClass = (signal) => {
  const s = String(signal || "").toLowerCase();
  if (s === "strong_relevant") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (s === "moderate_relevant") return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
  if (s === "weak_or_irrelevant") return "bg-rose-500/10 text-rose-300 border-rose-500/20";
  return "bg-gray-500/10 text-gray-300 border-gray-500/20";
};

// -------------------------
// EXACT EXCEL TITLES
// -------------------------
const STD_COLS = {
  sNo: "S. No.",
  applicationId: "Application ID",
  startupName: "Startup Name",
  founderName: "Founder Name",
  email: "Email",
  phone: "Phone",
  status: "Status",
  registeredCompany: "Registered Company",
  applicationType: "Application Type",
  sectorCategory: "Sector / Category",
  stage: "Stage",
  teamSize: "Team Size",
  website: "Website",
  district: "District",
  state: "State",
  blockName: "Block Name",
  pincode: "Pincode",
  applicantAddress: "Applicant Address",
  gender: "Gender",
  category: "Category",
  dateOfBirth: "Date of Birth",
  qualification: "Qualification",
  institution: "Institution",
  linkedinProfile: "LinkedIn Profile",
  hasRegisteredEntity: "Has Registered Entity",
  entityName: "Entity Name",
  entityType: "Entity Type",
  entityRegistrationNumber: "Entity Registration Number",
  dateOfRegistration: "Date of Registration",
  businessAddress: "Business Address",
  problemStatement: "Problem Statement",
  solution: "Solution",
  innovation: "Innovation",
  businessModel: "Business Model",
  pitchDeckFileName: "Pitch Deck File Name",
  pitchDeckURL: "Pitch Deck URL",
  profilePhotoFileName: "Profile Photo File Name",
  profilePhotoURL: "Profile Photo URL",
  entityCertificateFileName: "Entity Certificate File Name",
  entityCertificateURL: "Entity Certificate URL",
  coFounderCount: "Co-Founder Count",
  isSoleFounder: "Is Sole Founder",
  coFounders: "Co-Founders",
};

const pick = (row, key) => row?.[key] ?? "";
const asStr = (v) => String(v ?? "").trim();

const normalizeBoolean = (v) => {
  const s = String(v ?? "").trim().toLowerCase();
  if (["true", "yes", "1", "registered"].includes(s)) return true;
  if (["false", "no", "0", "not registered", "unregistered"].includes(s)) return false;
  return Boolean(v);
};

const to2 = (v) => Math.round((Number(v) || 0) * 100) / 100;
const clamp01 = (v) => Math.max(0, Math.min(1, Number(v) || 0));
const clamp010 = (v) => Math.max(0, Math.min(10, Number(v) || 0));

// -------------------------
// SETTINGS MODAL
// -------------------------
const RowSlider = ({ label, value, onChange, hint }) => {
  const v = clamp01(value);
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-[190px]">
        <div className="text-xs text-gray-300 font-semibold">{label}</div>
        {hint ? <div className="text-[11px] text-gray-500 leading-tight">{hint}</div> : null}
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
      <div className="w-[190px]">
        <div className="text-xs text-gray-300 font-semibold">{label}</div>
        {hint ? <div className="text-[11px] text-gray-500 leading-tight">{hint}</div> : null}
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
              <div className="text-sm font-bold text-white">New Prompt Settings</div>
              <div className="text-xs text-gray-500">Problem, solution, innovation, business model, team-based review.</div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-[#2d2d3f]">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Strictness (0..1)</div>

          <div className="bg-[#13131f] border border-[#2d2d3f] rounded-xl px-4 py-3">
            <RowSlider
              label="Problem Clarity"
              value={strict.problem_clarity}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, problem_clarity: v } })}
              hint="Penalty for vague problem definition"
            />
            <RowSlider
              label="Solution Strength"
              value={strict.solution_strength}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, solution_strength: v } })}
              hint="Penalty for weak or impractical solution"
            />
            <RowSlider
              label="Innovation Depth"
              value={strict.innovation_depth}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, innovation_depth: v } })}
              hint="Reward real differentiation only"
            />
            <RowSlider
              label="Business Model"
              value={strict.business_model_clarity}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, business_model_clarity: v } })}
              hint="Pricing and revenue clarity"
            />
            <RowSlider
              label="Execution"
              value={strict.execution_readiness}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, execution_readiness: v } })}
              hint="Stage, seriousness, launch readiness"
            />
            <RowSlider
              label="Team Capability"
              value={strict.team_capability}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, team_capability: v } })}
              hint="Qualification, institution relevance, cofounders"
            />
            <RowSlider
              label="Evidence"
              value={strict.evidence}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, evidence: v } })}
              hint="Numbers, signals, proof, specificity"
            />
            <RowSlider
              label="Traditional Filter"
              value={strict.traditional_filter}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, traditional_filter: v } })}
              hint="Penalty for ordinary non-startup businesses"
            />
            <RowSlider
              label="Score Separation"
              value={strict.score_separation}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, score_separation: v } })}
              hint="Reduce medium-score clustering"
            />
          </div>

          <div className="text-xs text-gray-500 uppercase tracking-wider mt-4 mb-2">Thresholds (0..10)</div>

          <div className="bg-[#13131f] border border-[#2d2d3f] rounded-xl px-4 py-3">
            <RowNumber
              label="Pitch Call"
              value={thr.pitch_call}
              onChange={(v) => onChange({ ...value, thresholds: { ...thr, pitch_call: v } })}
              hint="Minimum overall score for pitch"
            />
            <RowNumber
              label="Hold"
              value={thr.hold_need_info}
              onChange={(v) => onChange({ ...value, thresholds: { ...thr, hold_need_info: v } })}
              hint="Minimum overall score for hold"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={onReset}
              className="text-xs px-3 py-2 rounded-lg border border-[#2d2d3f] text-gray-300 hover:bg-white/5"
            >
              Reset Defaults
            </button>

            <button onClick={onClose} className="text-xs px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
              Done
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// -------------------------
// DETAIL MODAL
// -------------------------
const DetailModal = ({ entry, onClose }) => {
  if (!entry) return null;

  const r = entry.apiResponse || {};
  const scores = r.scores || {};
  const teamAssessment = r.team_assessment || {};
  const derivedSignals = teamAssessment?.derived_team_signals || {};
  const evidenceSignals = r.evidence_signals || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-[#0f0f16] border border-[#2d2d3f] w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDecisionPill(r.decision)}`}>
                  {prettifyDecision(r.decision)}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    (r.business_type || "").toLowerCase() === "startup"
                      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {prettifyBusinessType(r.business_type)}
                </span>

                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${qualityBadgeClass(r.startup_quality)}`}>
                  {prettifyQualityTier(r.startup_quality)}
                </span>

                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">
                  Overall: <span className={`${getScoreColor(r.overall_score)} font-mono`}>{Number(r.overall_score || 0).toFixed(1)}/10</span>
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">Time: {entry.timeTaken}s</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
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
                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Problem Statement</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{entry.inputData.problemStatement || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Solution</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{entry.inputData.solution || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Innovation</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{entry.inputData.innovation || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Business Model</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{entry.inputData.businessModel || "N/A"}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BarChart3 size={16} /> Detailed Scores
                </h3>

                <div className="space-y-3">
                  {(r.ratings || []).map((rating, idx) => (
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

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ShieldAlert size={16} /> Missing Flags
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(r.missing_flags || {}).map(([k, v]) => (
                    <div
                      key={k}
                      className={`p-3 rounded-xl border ${v ? "bg-rose-500/10 border-rose-500/20" : "bg-[#1a1a2e] border-[#2d2d3f]"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-300 font-mono">{k}</span>
                        <span className={`text-xs font-bold ${v ? "text-rose-400" : "text-gray-500"}`}>{v ? "MISSING" : "OK"}</span>
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
                <p className="text-gray-300 leading-relaxed text-sm italic">"{r.summary || "No summary available."}"</p>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 size={16} /> Team Assessment
                </h3>

                <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${institutionSignalClass(teamAssessment.institution_signal)}`}>
                      Institution: {String(teamAssessment.institution_signal || "unknown").replaceAll("_", " ")}
                    </span>

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
                      Team Score: {Number(scores.team_capability || 0).toFixed(1)}
                    </span>
                  </div>

                  <div className="text-sm text-gray-300 leading-relaxed">
                    {teamAssessment.institution_reason || "No institution assessment available."}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                      <div className="text-xs text-gray-500">Founder Relevance</div>
                      <div className="text-sm font-mono text-white mt-1">{Number(teamAssessment.founder_relevance_score || 0).toFixed(1)}</div>
                    </div>
                    <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                      <div className="text-xs text-gray-500">Cofounder Strength</div>
                      <div className="text-sm font-mono text-white mt-1">{Number(teamAssessment.cofounder_strength_score || 0).toFixed(1)}</div>
                    </div>
                    <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                      <div className="text-xs text-gray-500">Team Completeness</div>
                      <div className="text-sm font-mono text-white mt-1">{Number(teamAssessment.team_completeness_score || 0).toFixed(1)}</div>
                    </div>
                    <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                      <div className="text-xs text-gray-500">Derived Team Signal</div>
                      <div className="text-sm font-mono text-white mt-1">{Number(derivedSignals.teamCapabilityScore || 0).toFixed(1)}</div>
                    </div>
                  </div>
                </div>
              </section>
              {(r.strengths || []).length > 0 && (
  <section>
    <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
      <CheckCircle2 size={16} /> Key Strengths
    </h3>
    <ul className="space-y-2">
      {(r.strengths || []).map((item, i) => (
        <li
          key={i}
          className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-emerald-500/10"
        >
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          {item}
        </li>
      ))}
    </ul>
  </section>
)}

{(r.risks_and_gaps || []).length > 0 && (
  <section>
    <h3 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-4 flex items-center gap-2">
      <ShieldAlert size={16} /> Risks & Gaps
    </h3>
    <ul className="space-y-2">
      {(r.risks_and_gaps || []).map((item, i) => (
        <li
          key={i}
          className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-rose-500/10"
        >
          <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
          {item}
        </li>
      ))}
    </ul>
  </section>
)}

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <BrainCircuit size={16} /> Evidence Signals
                </h3>

                <div className="bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                    <div className="text-xs text-gray-500">Evidence Score</div>
                    <div className="text-sm font-mono text-white mt-1">{Number(evidenceSignals.evidence_score || 0).toFixed(1)}</div>
                  </div>
                  <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                    <div className="text-xs text-gray-500">Evidence Quality</div>
                    <div className="text-sm text-white mt-1">{evidenceSignals.evidence_quality || "—"}</div>
                  </div>
                  <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                    <div className="text-xs text-gray-500">Numbers Count</div>
                    <div className="text-sm font-mono text-white mt-1">{Number(evidenceSignals.numbers_count || 0)}</div>
                  </div>
                  <div className="p-3 rounded-xl border bg-[#0f0f16] border-[#2d2d3f]">
                    <div className="text-xs text-gray-500">Currency Mentions</div>
                    <div className="text-sm font-mono text-white mt-1">{Number(evidenceSignals.currency_mentions || 0)}</div>
                  </div>
                </div>
              </section>

              {(r.improvement_suggestions || []).length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Lightbulb size={16} /> Improvement Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {(r.improvement_suggestions || []).map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-amber-500/10">
                        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {(r.pitch_questions || []).length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Target size={16} /> Pitch Questions
                  </h3>
                  <div className="bg-[#1a1a2e] rounded-xl border border-indigo-500/10 overflow-hidden">
                    {(r.pitch_questions || []).map((q, i) => (
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

              {(r.qualifiers || {}) && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} /> Qualifiers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(r.qualifiers || {}).map(([k, v]) => (
                      <div
                        key={k}
                        className={`p-3 rounded-xl border ${v ? "bg-emerald-500/10 border-emerald-500/20" : "bg-[#1a1a2e] border-[#2d2d3f]"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300 font-mono">{k}</span>
                          <span className={`text-xs font-bold ${v ? "text-emerald-400" : "text-gray-500"}`}>
                            {v ? "YES" : "NO"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// -------------------------
// MAIN COMPONENT
// -------------------------
const AIReviewSection = () => {
  const [file, setFile] = useState(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [processedData, setProcessedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const DEFAULT_REVIEW_CONFIG = useMemo(
    () => ({
      strictness: {
        problem_clarity: 0.65,
        solution_strength: 0.7,
        innovation_depth: 0.75,
        business_model_clarity: 0.72,
        execution_readiness: 0.72,
        team_capability: 0.68,
        evidence: 0.68,
        clarity: 0.68,
        traditional_filter: 0.62,
        score_separation: 0.8,
      },
      thresholds: {
        pitch_call: 7.2,
        hold_need_info: 6.1,
      },
    }),
    []
  );

  const [reviewConfig, setReviewConfig] = useState(DEFAULT_REVIEW_CONFIG);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const fileInputRef = useRef(null);
  const tableContainerRef = useRef(null);

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
      setIsProcessing(true);
      setIsComplete(false);

      processQueue(jsonData);
    };
    reader.readAsBinaryString(f);
  };

  const processQueue = async (rows) => {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const startTime = performance.now();

      const applicationId = asStr(pick(row, STD_COLS.applicationId));
      const startupName = asStr(pick(row, STD_COLS.startupName)) || "Unknown Startup";
      const founderName = asStr(pick(row, STD_COLS.founderName));
      const email = asStr(pick(row, STD_COLS.email));
      const phone = asStr(pick(row, STD_COLS.phone));
      const status = asStr(pick(row, STD_COLS.status));
      const applicationType = asStr(pick(row, STD_COLS.applicationType));
      const sectorCategory = asStr(pick(row, STD_COLS.sectorCategory));
      const stage = asStr(pick(row, STD_COLS.stage)) || "Ideation";
      const teamSize = Number(pick(row, STD_COLS.teamSize) || 0);
      const website = asStr(pick(row, STD_COLS.website));
      const district = asStr(pick(row, STD_COLS.district));
      const state = asStr(pick(row, STD_COLS.state));
      const blockName = asStr(pick(row, STD_COLS.blockName));
      const pincode = asStr(pick(row, STD_COLS.pincode));
      const applicantAddress = asStr(pick(row, STD_COLS.applicantAddress));
      const gender = asStr(pick(row, STD_COLS.gender));
      const category = asStr(pick(row, STD_COLS.category));
      const dateOfBirth = asStr(pick(row, STD_COLS.dateOfBirth));
      const qualification = asStr(pick(row, STD_COLS.qualification));
      const institution = asStr(pick(row, STD_COLS.institution));
      const linkedinProfile = asStr(pick(row, STD_COLS.linkedinProfile));
      const hasRegisteredEntity = normalizeBoolean(pick(row, STD_COLS.hasRegisteredEntity));
      const entityName = asStr(pick(row, STD_COLS.entityName));
      const entityType = asStr(pick(row, STD_COLS.entityType));
      const entityRegistrationNumber = asStr(pick(row, STD_COLS.entityRegistrationNumber));
      const dateOfRegistration = asStr(pick(row, STD_COLS.dateOfRegistration));
      const businessAddress = asStr(pick(row, STD_COLS.businessAddress));
      const problemStatement = asStr(pick(row, STD_COLS.problemStatement));
      const solution = asStr(pick(row, STD_COLS.solution));
      const innovation = asStr(pick(row, STD_COLS.innovation));
      const businessModel = asStr(pick(row, STD_COLS.businessModel));
      const pitchDeckFileName = asStr(pick(row, STD_COLS.pitchDeckFileName));
      const pitchDeckURL = asStr(pick(row, STD_COLS.pitchDeckURL));
      const profilePhotoFileName = asStr(pick(row, STD_COLS.profilePhotoFileName));
      const profilePhotoURL = asStr(pick(row, STD_COLS.profilePhotoURL));
      const entityCertificateFileName = asStr(pick(row, STD_COLS.entityCertificateFileName));
      const entityCertificateURL = asStr(pick(row, STD_COLS.entityCertificateURL));
      const coFounderCount = Number(pick(row, STD_COLS.coFounderCount) || 0);
      const isSoleFounder = normalizeBoolean(pick(row, STD_COLS.isSoleFounder));
      const coFounders = asStr(pick(row, STD_COLS.coFounders));

      if (!applicationId) {
        console.warn("Skipping row: missing Application ID");
        setProcessedCount(i + 1);
        continue;
      }

      const anyAnswerPresent = problemStatement || solution || innovation || businessModel;
      if (!anyAnswerPresent) {
        console.warn("Skipping row:", applicationId, "no new prompt answers");
        setProcessedCount(i + 1);
        continue;
      }

      let apiResponseFull = null;
      let isError = false;
      let serverMeta = null;

      try {
  const response = await fetch("https://nsbot.online/prompt-new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sbNo: String(applicationId),
      answers: {
        problemStatement,
        solution,
        innovation,
        businessModel,
        isRegistered: Boolean(hasRegisteredEntity),
        startupStage: stage,
        teamSize,
        qualification,
        institution,
        linkedinProfile,
        coFounderCount,
        isSoleFounder,
        coFounders,
      },
      review_config: reviewConfig,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("prompt-new failed:", response.status, errText);
    isError = true;
  } else {
    const apiResult = await response.json();
    console.log("API result for", applicationId, apiResult);

    if (apiResult?.response?.ratings) {
      apiResponseFull = apiResult.response;
      serverMeta = apiResult.meta || null;

      await saveStartupReviewToRTDBNew({
        applicationId: String(applicationId),
        startupName,
        founderName,
        email,
        phone,
        status,
        applicationType,
        sectorCategory,
        stage,
        teamSize,
        website,
        district,
        state,
        blockName,
        pincode,
        applicantAddress,
        gender,
        category,
        dateOfBirth,
        qualification,
        institution,
        linkedinProfile,
        hasRegisteredEntity,
        entityName,
        entityType,
        entityRegistrationNumber,
        dateOfRegistration,
        businessAddress,
        pitchDeckFileName,
        pitchDeckURL,
        profilePhotoFileName,
        profilePhotoURL,
        entityCertificateFileName,
        entityCertificateURL,
        coFounderCount,
        isSoleFounder,
        coFounders,
        answers: {
          problemStatement,
          solution,
          innovation,
          businessModel,
        },
        apiResult,
        reviewMonth: "April",
      });
    } else {
      console.error("prompt-new invalid payload:", apiResult);
      isError = true;
    }
  }
} catch (err) {
  console.error("Fetch error:", err);
  isError = true;
}

      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      const newEntry = {
        sNo: i + 1,
        applicationId,
        startupName,
        founderName,
        stage,
        status,
        qualification,
        institution,
        hasRegisteredEntity,
        teamSize,
        coFounderCount,
        isSoleFounder,
        decision: apiResponseFull?.decision ?? "reject",
        business_type: apiResponseFull?.business_type ?? "traditional",
        startup_quality: apiResponseFull?.startup_quality ?? "weak",
        overall_score: apiResponseFull?.overall_score ?? 0,
        timeTaken: duration,
        isError,
        apiResponse: apiResponseFull,
        serverMeta,
        inputData: {
          problemStatement,
          solution,
          innovation,
          businessModel,
          linkedinProfile,
          coFounders,
        },
      };

      setProcessedData((prev) => [...prev, newEntry]);
      setProcessedCount(i + 1);
    }

    setIsProcessing(false);
    setIsComplete(true);
  };

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

  const joinArr = (v, sep = " | ") => (Array.isArray(v) ? v.filter(Boolean).join(sep) : "");

  const downloadReport = () => {
    if (processedData.length === 0) return;

    const rows = processedData.map((item) => {
      const r = item.apiResponse || {};
      const scores = r.scores || {};
      const teamAssessment = r.team_assessment || {};
      const derivedSignals = teamAssessment?.derived_team_signals || {};
      const evidence = r.evidence_signals || {};

      return {
        "S. No.": item.sNo,
        "Application ID": item.applicationId,
        "Startup Name": item.startupName,
        "Founder Name": item.founderName,
        "Stage": item.stage,
        "Has Registered Entity": item.hasRegisteredEntity ? "Yes" : "No",
        "Qualification": item.qualification,
        "Institution": item.institution,
        "Team Size": item.teamSize,
        "Co-Founder Count": item.coFounderCount,
        "Is Sole Founder": item.isSoleFounder ? "Yes" : "No",

        "Decision": prettifyDecision(r.decision),
        "Business Type": prettifyBusinessType(r.business_type),
        "Startup Quality": prettifyQualityTier(r.startup_quality),
        "Differentiation Flag": r.differentiation_flag || "",

        "Overall Score": Number(r.overall_score ?? 0),
        "Score - Problem Clarity": Number(scores.problem_clarity ?? 0),
        "Score - Solution Strength": Number(scores.solution_strength ?? 0),
        "Score - Innovation Depth": Number(scores.innovation_depth ?? 0),
        "Score - Business Model Clarity": Number(scores.business_model_clarity ?? 0),
        "Score - Execution Readiness": Number(scores.execution_readiness ?? 0),
        "Score - Team Capability": Number(scores.team_capability ?? 0),

        "Institution Signal": teamAssessment.institution_signal || "",
        "Institution Reason": teamAssessment.institution_reason || "",
        "Founder Relevance Score": Number(teamAssessment.founder_relevance_score ?? 0),
        "Cofounder Strength Score": Number(teamAssessment.cofounder_strength_score ?? 0),
        "Team Completeness Score": Number(teamAssessment.team_completeness_score ?? 0),
        "Derived Team Capability Score": Number(derivedSignals.teamCapabilityScore ?? 0),
        "Execution Adjustment Applied": Number(teamAssessment.execution_adjustment_applied ?? 0),

        "Evidence Score": Number(evidence.evidence_score ?? 0),
        "Evidence Quality": evidence.evidence_quality || "",
        "Numbers Count": Number(evidence.numbers_count ?? 0),
        "Currency Mentions": Number(evidence.currency_mentions ?? 0),
        "Dates Count": Number(evidence.dates_count ?? 0),
        "Traction Hits": joinArr(evidence.traction_hits),

        "Qualifiers": joinArr(Object.keys(r.qualifiers || {}).filter((k) => r.qualifiers?.[k])),
        "Missing Flags": joinArr(Object.keys(r.missing_flags || {}).filter((k) => r.missing_flags?.[k])),
        "Improvement Suggestions": joinArr(r.improvement_suggestions),
        "Pitch Questions": joinArr(r.pitch_questions),
        "Summary": r.summary || "",
        "Time Taken (s)": Number(item.timeTaken ?? 0),
        "Server Total Duration": item.serverMeta?.total_duration || "",

        "Input - Problem Statement": item.inputData?.problemStatement || "",
        "Input - Solution": item.inputData?.solution || "",
        "Input - Innovation": item.inputData?.innovation || "",
        "Input - Business Model": item.inputData?.businessModel || "",
        "Input - Co-Founders": item.inputData?.coFounders || "",
      };
    });

    const rowsWithRatings = rows.map((row, idx) => {
      const r = processedData[idx]?.apiResponse || {};
      return { ...row, ...ratingsToCols(r.ratings) };
    });

    const ws = XLSX.utils.json_to_sheet(rowsWithRatings);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Startup_Review_New");
    XLSX.writeFile(wb, `NSBot_Startup_Review_New_${Date.now()}.xlsx`);
  };

  const resetUpload = () => {
    setFile(null);
    setProcessedData([]);
    setTotalEntries(0);
    setProcessedCount(0);
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
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                NSBot First Screening
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-semibold">
                  New Prompt
                </span>
              </h2>
              <p className="text-gray-400 text-sm">
                Reads your exact Excel columns and sends data to <span className="font-mono text-indigo-300">/prompt-new</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg border border-[#2d2d3f] bg-[#13131f] hover:bg-white/5 text-gray-300"
              title="Review Settings"
            >
              <Settings size={18} />
            </button>

            {(isProcessing || isComplete) && (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a2e] border border-[#2d2d3f] rounded-lg">
                  <FileSpreadsheet size={14} className="text-emerald-500" />
                  <span className="text-xs text-gray-400 font-mono truncate max-w-[150px]">{file?.name}</span>
                </div>

                <div className="flex flex-col items-end">
                  <span className={`text-sm font-semibold ${isComplete ? "text-emerald-400" : "text-indigo-400"}`}>
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
                      className={`${isComplete ? "text-emerald-500" : "text-indigo-500"} transition-all duration-500 ease-out`}
                      strokeDasharray={`${(processedCount / Math.max(totalEntries, 1)) * 100}, 100`}
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

        {!file ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div
              className="border-2 border-dashed border-[#2d2d3f] bg-[#13131f]/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center hover:border-indigo-500/50 hover:bg-[#1a1a2e] transition-all group cursor-pointer w-full max-w-2xl"
              onClick={() => fileInputRef.current.click()}
            >
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" ref={fileInputRef} />

              <div className="w-24 h-24 rounded-full bg-[#1e1e2d] group-hover:bg-[#252538] flex items-center justify-center mb-8 transition-all shadow-xl shadow-black/20 group-hover:scale-110 duration-300 border border-[#2d2d3f]">
                <Upload className="text-indigo-400" size={40} />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">Upload Excel for New Prompt Review</h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Excel must include the exact column titles you shared earlier, including Problem Statement, Solution, Innovation, Business Model, Qualification, Institution, and Co-Founders.
              </p>

              <button className="mt-8 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/20">
                Browse Files
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4 gap-4">
              <div className="flex items-center gap-4">
                {isProcessing && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1a2e] border border-[#2d2d3f] rounded-lg">
                    <ThinkingIndicator elapsedLabel="NSBot" />
                    <span className="text-sm text-gray-300 animate-pulse">Evaluating Entry #{processedCount + 1}...</span>
                  </div>
                )}

                {isComplete && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-medium">Evaluation Completed Successfully</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadReport}
                  disabled={processedData.length === 0}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg
                    ${
                      processedData.length > 0
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                        : "bg-[#1e1e2d] text-gray-500 cursor-not-allowed border border-[#2d2d3f]"
                    }
                  `}
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
              <div className="overflow-x-auto custom-scrollbar flex-1" ref={tableContainerRef}>
                <table className="w-full text-left text-sm text-gray-400 relative">
                  <thead className="text-xs uppercase bg-[#0f0f16] text-gray-500 sticky top-0 z-10 box-decoration-clone">
                    <tr>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">S. No</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Application ID</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Startup Name</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Stage</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Decision</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Type</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Quality</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Overall</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Problem</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Innovation</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Team</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Institution</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Time</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Summary</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#2d2d3f]">
                    {processedData.map((row, idx) => {
                      const r = row.apiResponse || {};
                      const scores = r.scores || {};
                      const teamAssessment = r.team_assessment || {};

                      return (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-[#1a1a2e] cursor-pointer group"
                          onClick={() => setSelectedEntry(row)}
                        >
                          <td className="px-6 py-4 font-mono text-gray-500">{row.sNo}</td>
                          <td className="px-6 py-4 font-mono text-gray-300 group-hover:text-indigo-400 transition-colors">{row.applicationId}</td>
                          <td className="px-6 py-4 font-medium text-white">{row.startupName}</td>

                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              {row.stage}
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
                                row.business_type === "startup"
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

                          <td className={`px-6 py-4 text-center font-mono ${getScoreColor(scores.problem_clarity)}`}>
                            {Number(scores.problem_clarity || 0).toFixed(1)}
                          </td>

                          <td className={`px-6 py-4 text-center font-mono ${getScoreColor(scores.innovation_depth)}`}>
                            {Number(scores.innovation_depth || 0).toFixed(1)}
                          </td>

                          <td className={`px-6 py-4 text-center font-mono ${getScoreColor(scores.team_capability)}`}>
                            {Number(scores.team_capability || 0).toFixed(1)}
                          </td>

                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${institutionSignalClass(teamAssessment.institution_signal)}`}>
                              {String(teamAssessment.institution_signal || "unknown").replaceAll("_", " ")}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-center font-mono text-blue-400 text-xs">{row.timeTaken}s</td>
                          <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{r.summary || "—"}</td>
                        </motion.tr>
                      );
                    })}
                    <tr className="h-4"></tr>
                  </tbody>
                </table>

                {processedData.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Loader className="animate-spin mb-4 text-indigo-500 opacity-50" size={32} />
                    <p>NSBot is ready to start evaluation...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>{selectedEntry && <DetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}</AnimatePresence>

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

export default AIReviewSection;