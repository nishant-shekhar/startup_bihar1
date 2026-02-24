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
  Rocket,
  Wrench,
  Megaphone,
  BadgeDollarSign,
  Users,
  ShieldCheck,
  ClipboardCopy,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThinkingIndicator from "./ThinkingIndicator";
import "./AIReviewSection.css";

// ---------- UI helpers ----------
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

const clamp01 = (v) => Math.max(0, Math.min(1, Number(v) || 0));
const clamp010 = (v) => Math.max(0, Math.min(10, Number(v) || 0));
const to2 = (v) => Math.round((Number(v) || 0) * 100) / 100;

// ---------- Compact Settings Modal ----------
const RowSlider = ({ label, value, onChange, hint }) => {
  const v = clamp01(value);
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-[170px]">
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
      <div className="w-[170px]">
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
              <div className="text-sm font-bold text-white">Old Prompt Settings</div>
              <div className="text-xs text-gray-500">6-point screening strictness & thresholds.</div>
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
              label="Innovation"
              value={strict.innovation}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, innovation: v } })}
              hint="Penalize low innovation notes"
            />
            <RowSlider
              label="Product Capability"
              value={strict.product_capability}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, product_capability: v } })}
              hint="Ability to build real product"
            />
            <RowSlider
              label="Execution & Growth"
              value={strict.execution_growth}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, execution_growth: v } })}
              hint="Prototype + growth plan realism"
            />
            <RowSlider
              label="Evidence"
              value={strict.evidence}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, evidence: v } })}
              hint="Pilot/traction/validation"
            />
            <RowSlider
              label="Clarity"
              value={strict.clarity}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, clarity: v } })}
              hint="Reduce buzzwords/copy-paste"
            />
            <RowSlider
              label="Traditional Filter"
              value={strict.traditional_filter}
              onChange={(v) => onChange({ ...value, strictness: { ...strict, traditional_filter: v } })}
              hint="Penalize shop/reseller"
            />
          </div>

          <div className="text-xs text-gray-500 uppercase tracking-wider mt-4 mb-2">Thresholds (0..10)</div>

          <div className="bg-[#13131f] border border-[#2d2d3f] rounded-xl px-4 py-3">
            <RowNumber
              label="Pitch Call"
              value={thr.pitch_call}
              onChange={(v) => onChange({ ...value, thresholds: { ...thr, pitch_call: v } })}
              hint="Min overall for pitch"
            />
            <RowNumber
              label="Hold"
              value={thr.hold_need_info}
              onChange={(v) => onChange({ ...value, thresholds: { ...thr, hold_need_info: v } })}
              hint="Min overall to hold"
            />

            <div className="mt-2 text-[11px] text-gray-500">Note: Pitch threshold should be ≥ Hold. Server auto-corrects if reversed.</div>
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

// ---------- Detail Modal (6-point fields + old response keys) ----------
const DetailModal = ({ entry, onClose }) => {
  if (!entry) return null;

  const { apiResponse, inputData, timeTaken, entityName, regNo, stage } = entry;

  const decision = apiResponse?.decision;
  const businessType = apiResponse?.business_type;
  const overall = apiResponse?.overall_score ?? 0;
  const qTier = apiResponse?.quality_tier;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0f0f16] border border-[#2d2d3f] w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-[#2d2d3f] flex items-center justify-between bg-[#13131f]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {entityName}{" "}
                <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                  {regNo}
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-gray-400 text-sm">
                  Stage: <span className="text-emerald-400">{stage}</span>
                </span>

                <span className="text-gray-600">•</span>

                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDecisionPill(decision)}`}>
                  {prettifyDecision(decision)}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    businessType === "startup"
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

                <span className="text-gray-600">•</span>

                <span className="text-gray-400 text-sm">
                  Overall: <span className={`${getScoreColor(overall)} font-bold font-mono`}>{Number(overall).toFixed(1)}/10</span>
                </span>

                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">Time: {timeTaken}s</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

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
                    <p className="text-sm text-gray-300 leading-relaxed">{inputData.innovation_note || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Uniqueness Note</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{inputData.uniqueness_note || "N/A"}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-indigo-400 block mb-1">Employment Potential</span>
                      <p className="text-sm text-gray-300 leading-relaxed">{inputData.employment_potential_note || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-indigo-400 block mb-1">Wealth Potential</span>
                      <p className="text-sm text-gray-300 leading-relaxed">{inputData.wealth_potential_note || "N/A"}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Product Development Capability</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{inputData.product_development_capability_note || "N/A"}</p>
                  </div>

                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Success Stories / Prototype & Growth Plan</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{inputData.success_stories_and_growth_plan || "N/A"}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp size={16} /> Detailed Evaluation
                </h3>

                <div className="space-y-3">
                  {apiResponse?.ratings?.map((rating, idx) => (
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
  {apiResponse?.missing_flags && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldAlert size={16} /> Missing Flags
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(apiResponse.missing_flags).map(([k, v]) => (
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
              )}
            </div>

            {/* RIGHT */}
            <div className="space-y-8">
              <section className="bg-gradient-to-br from-[#1a1a2e] to-[#13131f] p-6 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-900/10">
                <h3 className="text-indigo-300 font-semibold mb-3 flex items-center gap-2">
                  <Sparkles size={18} /> Executive Summary
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm italic">"{apiResponse?.summary || "No summary available."}"</p>
              </section>

              {apiResponse?.strengths?.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ArrowUpRight size={16} /> Key Strengths
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
              )}

              {apiResponse?.risks_and_gaps?.length > 0 && (
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
              )}

              {apiResponse?.pitch_questions?.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Lightbulb size={16} /> Pitch Questions
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
              )}

              {apiResponse?.qualifiers && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp size={16} /> Qualifiers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(apiResponse.qualifiers).map(([k, v]) => (
                      <div
                        key={k}
                        className={`p-3 rounded-xl border ${v ? "bg-emerald-500/10 border-emerald-500/20" : "bg-[#1a1a2e] border-[#2d2d3f]"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300 font-mono">{k}</span>
                          <span className={`text-xs font-bold ${v ? "text-emerald-400" : "text-gray-500"}`}>{v ? "YES" : "NO"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            

              
            </div>
          </div>
          {apiResponse?.recommendation_path ? (
  <RecommendationPathCard rp={apiResponse.recommendation_path} />
) : null}
        </div>
      </motion.div>
    </div>
  );
};

// Drop-in UI block for DetailModal (replace your current Recommendation Path section with this)
// Requires: lucide-react icons already imported (TrendingUp, ArrowUpRight, Download, CheckCircle2)

// Replace your current RecommendationPathCard with this NEW one.
// This matches the NEW backend structure:
// recommendation_path: {
//   market_readiness_level: "early_validation" | "prototype_ready" | "scale_ready",
//   priority_actions: [],
//   product_actions: [],
//   market_actions: [],
//   business_model_actions: [],
//   team_actions: [],
//   risk_mitigation_actions: []
// }
//
// NOTE: Add these icons to your lucide imports in the parent file if not present:
// Target, Rocket, Wrench, Megaphone, BadgeDollarSign, Users, ShieldCheck, ClipboardCopy

const RecommendationPathCard = ({ rp }) => {
  if (!rp) return null;

  const level = String(rp.market_readiness_level || "early_validation");

  const priority = Array.isArray(rp.priority_actions) ? rp.priority_actions : [];
  const product = Array.isArray(rp.product_actions) ? rp.product_actions : [];
  const market = Array.isArray(rp.market_actions) ? rp.market_actions : [];
  const biz = Array.isArray(rp.business_model_actions) ? rp.business_model_actions : [];
  const team = Array.isArray(rp.team_actions) ? rp.team_actions : [];
  const risk = Array.isArray(rp.risk_mitigation_actions) ? rp.risk_mitigation_actions : [];

  const readinessMeta = (() => {
    if (level === "scale_ready") {
      return {
        label: "Scale Ready",
        sub: "Execution and product are strong. Focus on repeatable growth.",
        pill: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        dot: "bg-emerald-400",
      };
    }
    if (level === "prototype_ready") {
      return {
        label: "Prototype Ready",
        sub: "Core build is feasible. Validate customers + pricing next.",
        pill: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
        dot: "bg-indigo-400",
      };
    }
    return {
      label: "Early Validation",
      sub: "Clarify buyer, problem, and proof before building big.",
      pill: "bg-amber-500/10 text-amber-300 border-amber-500/20",
      dot: "bg-amber-400",
    };
  })();

  const sections = [
    {
      key: "priority",
      title: "Priority Fixes",
      desc: "High-impact changes to unlock market readiness.",
      icon: Target,
      tone: "border-rose-500/20 bg-rose-500/5",
      badge: "text-rose-300 bg-rose-500/10 border-rose-500/20",
      items: priority,
    },
    {
      key: "product",
      title: "Product Actions",
      desc: "MVP scope, build plan, feasibility, delivery.",
      icon: Wrench,
      tone: "border-indigo-500/20 bg-indigo-500/5",
      badge: "text-indigo-200 bg-indigo-500/10 border-indigo-500/20",
      items: product,
    },
    {
      key: "market",
      title: "Market Actions",
      desc: "Customer, segment, GTM, pilots, distribution.",
      icon: Megaphone,
      tone: "border-sky-500/20 bg-sky-500/5",
      badge: "text-sky-200 bg-sky-500/10 border-sky-500/20",
      items: market,
    },
    {
      key: "biz",
      title: "Business Model",
      desc: "Pricing, unit economics, revenue model, margins.",
      icon: BadgeDollarSign,
      tone: "border-emerald-500/20 bg-emerald-500/5",
      badge: "text-emerald-200 bg-emerald-500/10 border-emerald-500/20",
      items: biz,
    },
    {
      key: "team",
      title: "Team & Capability",
      desc: "Roles needed, hiring, partnerships, execution strength.",
      icon: Users,
      tone: "border-violet-500/20 bg-violet-500/5",
      badge: "text-violet-200 bg-violet-500/10 border-violet-500/20",
      items: team,
    },
    {
      key: "risk",
      title: "Risk Mitigation",
      desc: "Defensibility, evidence, compliance, major risks.",
      icon: ShieldCheck,
      tone: "border-amber-500/20 bg-amber-500/5",
      badge: "text-amber-200 bg-amber-500/10 border-amber-500/20",
      items: risk,
    },
  ];

  const totalItems =
    priority.length + product.length + market.length + biz.length + team.length + risk.length;

  const buildChecklistText = () => {
    const lines = [];
    lines.push(`Market Readiness: ${readinessMeta.label}`);
    const pushGroup = (name, arr) => {
      if (!arr.length) return;
      lines.push("");
      lines.push(`${name}:`);
      for (const x of arr) lines.push(`- ${x}`);
    };
    pushGroup("Priority Fixes", priority);
    pushGroup("Product Actions", product);
    pushGroup("Market Actions", market);
    pushGroup("Business Model", biz);
    pushGroup("Team & Capability", team);
    pushGroup("Risk Mitigation", risk);
    return lines.join("\n");
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border mt-8 border-indigo-500/20 bg-gradient-to-br from-[#1a1a2e] via-[#13131f] to-[#0f0f16] shadow-lg shadow-indigo-900/10">
      {/* soft glows */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-600/10 blur-[80px]" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[#2d2d3f] bg-[#13131f]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Rocket size={18} className="text-indigo-300" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">Founder Action Plan</div>
            <div className="text-xs text-gray-500">Fix gaps, become market-ready, and scale execution.</div>
          </div>
        </div>

        {/* Readiness pill */}
        <span className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${readinessMeta.pill}`}>
          <span className={`h-2 w-2 rounded-full ${readinessMeta.dot}`} />
          {readinessMeta.label}
        </span>
      </div>

      {/* Readiness strip */}
      <div className="px-5 pt-4">
        <div className="rounded-xl border border-[#2d2d3f] bg-[#0f0f16]/60 px-4 py-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Market Readiness</div>
            <div className="text-sm text-gray-200 font-semibold mt-0.5">{readinessMeta.label}</div>
            <div className="text-xs text-gray-500 mt-1">{readinessMeta.sub}</div>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wider">Actions</div>
            <div className="text-sm font-mono text-indigo-300 mt-0.5">{totalItems}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sections.map((sec) => {
            const Icon = sec.icon;
            const items = sec.items || [];
            const shown = items.slice(0, 6);

            return (
              <div
                key={sec.key}
                className={`rounded-xl border overflow-hidden ${sec.tone} border-[#2d2d3f]`}
              >
                <div className="px-4 py-3 border-b border-[#2d2d3f] flex items-center justify-between bg-[#0f0f16]/40">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg border border-[#2d2d3f] bg-[#13131f] flex items-center justify-center">
                      <Icon size={16} className="text-gray-200" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-white truncate">{sec.title}</div>
                      <div className="text-[11px] text-gray-500">{sec.desc}</div>
                    </div>
                  </div>

                  <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${sec.badge}`}>
                    {items.length || 0} items
                  </span>
                </div>

                {items.length ? (
                  <div className="divide-y divide-[#2d2d3f]">
                    {shown.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors">
                        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/5 border border-[#2d2d3f] text-gray-200 text-xs font-bold">
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-300 leading-relaxed">{s}</p>
                      </div>
                    ))}
                    {items.length > shown.length ? (
                      <div className="px-4 py-3 text-[11px] text-gray-500">
                        +{items.length - shown.length} more items in this section
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="px-4 py-4 text-sm text-gray-500">No actions suggested.</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#2d2d3f] bg-[#13131f]/40 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="font-medium">Use as founder checklist for the next 2–4 weeks.</span>
          </div>

          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(buildChecklistText())}
            className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-[#2d2d3f] text-gray-300 hover:bg-white/5"
          >
            <ClipboardCopy size={14} />
            Copy Action Plan
          </button>
        </div>
      </div>
    </section>
  );
};

// ---------- Main ----------
const AIReviewOldStyle = () => {
  const [file, setFile] = useState(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [processedData, setProcessedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Old prompt config defaults (matches OldPrompt.route.js defaults)
  const DEFAULT_REVIEW_CONFIG = useMemo(
    () => ({
      strictness: {
        innovation: 0.65,
        product_capability: 0.7,
        execution_growth: 0.7,
        evidence: 0.6,
        clarity: 0.6,
        traditional_filter: 0.55,
      },
      thresholds: {
        pitch_call: 6.2,
        hold_need_info: 5.4,
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

      const regNo =
        row["Registration No"] ||
        row["Reg No"] ||
        row["Registration Number"] ||
        row["RegNumber"] ||
        row["SB No"] ||
        row["SB_NO"] ||
        `REG-${new Date().getFullYear()}-${String(i + 1).padStart(4, "0")}`;

      const entityName = row["Entity Name"] || row["Startup Name"] || row["Name"] || "Unknown Entity";
      const stage = row["Stage"] || "Ideation";

      // Accept flexible column names for old 6-point format
      const innovation_note =
        row["A Brief Note on innovation in idea"] ||
        row["Innovation Note"] ||
        row["Innovation"] ||
        "";
      const uniqueness_note =
        row["A Brief Note on Uniqueness in idea"] ||
        row["Uniqueness Note"] ||
        row["Uniqueness"] ||
        "";
      const employment_potential_note =
        row["A Brief Note on Potential of high employment through Startup"] ||
        row["Employment Potential"] ||
        row["Employment"] ||
        "";
      const wealth_potential_note =
        row["A Brief Note on Potential of generating wealth through Startup"] ||
        row["Wealth Potential"] ||
        row["Wealth"] ||
        "";
      const product_development_capability_note =
        row["A Brief Note on Capability of development of products"] ||
        row["Capability of development of products"] ||
        row["Product Development Capability"] ||
        row["Product Capability"] ||
        "";
      const success_stories_and_growth_plan =
        row["Success Stories of Idea prototype and Growth plan"] ||
        row["Prototype and Growth plan"] ||
        row["Execution & Growth"] ||
        row["Success Stories"] ||
        "";

      let apiResponseFull = null;
      let isError = false;
      let serverMeta = null;

      try {
        const response = await fetch("https://nsbot.online/prompt-old", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sbNo: String(regNo),
            answers: {
              innovation_note: String(innovation_note || ""),
              uniqueness_note: String(uniqueness_note || ""),
              employment_potential_note: String(employment_potential_note || ""),
              wealth_potential_note: String(wealth_potential_note || ""),
              product_development_capability_note: String(product_development_capability_note || ""),
              success_stories_and_growth_plan: String(success_stories_and_growth_plan || ""),
            },
            review_config: reviewConfig,
          }),
        });

        if (!response.ok) {
          isError = true;
        } else {
          const apiResult = await response.json();
          if (apiResult?.response?.ratings && Array.isArray(apiResult.response.ratings)) {
            apiResponseFull = apiResult.response;
            serverMeta = apiResult.meta || null;
            console.log("API response for", regNo, apiResponseFull);
          } else {
            isError = true;
          }
        }
      } catch (err) {
        console.error("Fetch error", err);
        isError = true;
      }

      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      const overall = apiResponseFull?.overall_score ?? 0;
      const decision = apiResponseFull?.decision ?? "reject";
      const businessType = apiResponseFull?.business_type ?? "traditional";
      const qualityTier = apiResponseFull?.quality_tier ?? "weak";

      const innovationScore = apiResponseFull?.innovation_score ?? 0;
      const productCapabilityScore = apiResponseFull?.product_capability_score ?? 0;

      const newEntry = {
        sNo: i + 1,
        regNo: String(regNo),
        entityName,
        stage,

        decision,
        business_type: businessType,
        quality_tier: qualityTier,

        overall_score: overall,
        innovation_score: innovationScore,
        product_capability_score: productCapabilityScore,
        qualifier_count: apiResponseFull?.qualifier_count ?? 0,

        comment: apiResponseFull?.summary || (isError ? "AI Service Unavailable" : "No summary provided."),
        timeTaken: duration,
        isError,

        apiResponse: apiResponseFull,
        inputData: {
          innovation_note,
          uniqueness_note,
          employment_potential_note,
          wealth_potential_note,
          product_development_capability_note,
          success_stories_and_growth_plan,
        },

        serverMeta,
      };

      setProcessedData((prev) => [...prev, newEntry]);
      setProcessedCount(i + 1);

      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
      }
    }

    setIsProcessing(false);
    setIsComplete(true);
  };

  const downloadReport = () => {
    if (processedData.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(
      processedData.map((item) => ({
        "S. No": item.sNo,
        "Reg No": item.regNo,
        "Entity Name": item.entityName,
        Stage: item.stage,
        Decision: prettifyDecision(item.decision),
        "Business Type": prettifyBusinessType(item.business_type),
        "Quality Tier": prettifyQualityTier(item.quality_tier),
        "Overall Score (/10)": Number(item.overall_score).toFixed(1),
        "Innovation (/10)": Number(item.innovation_score).toFixed(1),
        "Product Capability (/10)": Number(item.product_capability_score).toFixed(1),
        "Qualifier Count": item.qualifier_count,
        "Time Taken (s)": item.timeTaken,
        "NSBot Summary": item.comment,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Startup_Review_Report_Old");
    XLSX.writeFile(wb, `NSBot_Startup_Review_Old_${Date.now()}.xlsx`);
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                NSBot First Screening (Old Prompt){" "}
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-semibold">
                  6-Point
                </span>
              </h2>
              <p className="text-gray-400 text-sm">6 answers: Innovation • Uniqueness • Jobs • Wealth • Product • Growth</p>
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
              <h3 className="text-xl font-semibold text-white mb-3">Upload Old Prompt Excel</h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Upload .xlsx with columns matching old 6-point format (Innovation/Uniqueness/Employment/Wealth/Product/Growth).
              </p>
              <button className="mt-8 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/20">
                Browse Files
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
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
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Reg No</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Entity Name</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Stage</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Decision</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Type</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Quality</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16] text-indigo-400">Overall</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16] text-indigo-400">Innovation</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16] text-indigo-400">Product</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">Qualifiers</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16] text-blue-400">Time</th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16] text-gray-300">Summary</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#2d2d3f]">
                    {processedData.map((row, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-[#1a1a2e] cursor-pointer group"
                        onClick={() => setSelectedEntry(row)}
                        title="Click to view detailed analysis"
                      >
                        <td className="px-6 py-4 font-mono text-gray-500">{row.sNo}</td>
                        <td className="px-6 py-4 font-mono text-gray-300 group-hover:text-indigo-400 transition-colors">{row.regNo}</td>
                        <td className="px-6 py-4 font-medium text-white">{row.entityName}</td>
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${qualityBadgeClass(row.quality_tier)}`}>
                            {prettifyQualityTier(row.quality_tier)}
                          </span>
                        </td>

                        <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.overall_score)}`}>{Number(row.overall_score).toFixed(1)}</td>
                        <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.innovation_score)}`}>{Number(row.innovation_score).toFixed(1)}</td>
                        <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.product_capability_score)}`}>{Number(row.product_capability_score).toFixed(1)}</td>
                        <td className="px-6 py-4 text-center font-mono text-gray-300">{row.qualifier_count}</td>
                        <td className="px-6 py-4 text-center font-mono text-blue-400 text-xs">{row.timeTaken}s</td>
                        <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{row.comment}</td>
                      </motion.tr>
                    ))}
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

export default AIReviewOldStyle;