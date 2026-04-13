import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ref, get } from "firebase/database";
import {
  X,
  Bot,
  Info,
  BarChart3,
  ShieldAlert,
  Sparkles,
  Building2,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  Lightbulb,
  Target,
  RefreshCw,
} from "lucide-react";
import { rtdb } from "../../AdminRedesign/NewApplicationAdmin/firebase";

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

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
  if (d === "reject") return "Reject";
  return decision || "-";
};

const prettifyBusinessType = (t) =>
  (t || "").toLowerCase() === "startup" ? "Startup" : "Traditional";

const prettifyQualityTier = (tier) => {
  const t = (tier || "").toLowerCase();
  if (t === "strong") return "Strong";
  if (t === "promising") return "Promising";
  if (t === "average") return "Average";
  if (t === "weak") return "Weak";
  return tier || "-";
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

export default function AIEvaluationModal({
  open,
  onClose,
  startupId,
  startupName,
  application,
}) {
  const [loading, setLoading] = useState(true);
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState("");

  const resolvedStartupId = useMemo(() => {
    return (
      startupId ||
      application?._applicationId ||
      application?.applicationId ||
      application?.id ||
      application?.userId ||
      application?.startupId ||
      ""
    );
  }, [startupId, application]);

  const loadData = async () => {
    if (!resolvedStartupId) {
      setError("Startup ID not found.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const snapshot = await get(ref(rtdb, `/startupAIReview/April/${resolvedStartupId}`));

      if (!snapshot.exists()) {
        setEntry(null);
        setError("No AI evaluation found for this startup.");
        return;
      }

      const v = snapshot.val() || {};
      const r = v?.result || v?.api?.response || {};
      const scores = r?.scores || {};
      const teamAssessment = r?.team_assessment || {};
      const derivedSignals = teamAssessment?.derived_team_signals || {};
      const evidenceSignals = r?.evidence_signals || {};

      setEntry({
        startupName: v?.startupName || startupName || "Unknown Startup",
        applicationId: v?.applicationId || resolvedStartupId,
        timeTaken: v?.api?.meta?.elapsed_ms
          ? Math.round(Number(v.api.meta.elapsed_ms) / 1000)
          : "",
        inputData: {
          problemStatement:
            v?.answers?.problemStatement ||
            application?.businessIdea?.problemStatement ||
            "",
          solution:
            v?.answers?.solution ||
            application?.businessIdea?.solution ||
            "",
          innovation:
            v?.answers?.innovation ||
            application?.businessIdea?.innovation ||
            "",
          businessModel:
            v?.answers?.businessModel ||
            application?.businessIdea?.businessModel ||
            "",
        },
        apiResponse: {
          ...r,
          scores,
          team_assessment: {
            ...teamAssessment,
            derived_team_signals: derivedSignals,
          },
          evidence_signals: evidenceSignals,
          strengths: Array.isArray(r?.strengths) ? r.strengths : [],
          risks_and_gaps: Array.isArray(r?.risks_and_gaps) ? r.risks_and_gaps : [],
          improvement_suggestions: Array.isArray(r?.improvement_suggestions)
            ? r.improvement_suggestions
            : [],
          pitch_questions: Array.isArray(r?.pitch_questions) ? r.pitch_questions : [],
          qualifiers: r?.qualifiers || {},
          missing_flags: r?.missing_flags || {},
          ratings: Array.isArray(r?.ratings) ? r.ratings : [],
        },
      });
    } catch (e) {
      setEntry(null);
      setError(e?.message || "Failed to load AI evaluation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    loadData();
  }, [open, resolvedStartupId]);

  if (!open) return null;

  const r = entry?.apiResponse || {};
  const scores = r.scores || {};
  const teamAssessment = r.team_assessment || {};
  const derivedSignals = teamAssessment?.derived_team_signals || {};
  const evidenceSignals = r.evidence_signals || {};

  return ReactDOM.createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
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
                  {entry?.startupName || startupName || "Unknown Startup"}
                  <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                    {entry?.applicationId || resolvedStartupId}
                  </span>
                </h2>

                {!loading && !error && entry ? (
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

                    {entry?.timeTaken ? (
                      <>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400 text-sm">Time: {entry.timeTaken}s</span>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            {loading ? (
              <div className="rounded-2xl border border-[#2d2d3f] bg-[#13131f] p-10 text-center text-gray-300">
                Loading AI evaluation...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-10 text-center text-rose-300">
                {error}
              </div>
            ) : (
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
                          <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-indigo-500/20 pl-3">
                            {rating.reason}
                          </p>
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
                            <span className={`text-xs font-bold ${v ? "text-rose-400" : "text-gray-500"}`}>
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
                      "{r.summary || "No summary available."}"
                    </p>
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
                          <li
                            key={i}
                            className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-amber-500/10"
                          >
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
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}