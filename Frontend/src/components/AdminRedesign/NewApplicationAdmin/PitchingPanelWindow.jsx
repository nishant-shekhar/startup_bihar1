// src/pages/PitchingPanelWindow.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ref, get, update } from "firebase/database";
import {
  PanelRightOpen,
  UsersRound,
  Save,
  RefreshCw,
  Star,
  MessageSquareText,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  Lock,
} from "lucide-react";
import { rtdb } from "./firebase"; // adjust path if needed

const PITCH_REVIEWS_ROOT = "StartupReviews";

const safeKey = (k) => String(k || "").replace(/[.#$/\[\]]/g, "_");
const clamp010 = (v) => Math.max(0, Math.min(10, Number(v) || 0));
const to2 = (v) => Math.round((Number(v) || 0) * 100) / 100;

const SCORE_OPTIONS = Array.from({ length: 21 }, (_, i) => i * 0.5);

const getPitchReviewPanelPath = (year, month, sbNo, panelId) =>
  `${PITCH_REVIEWS_ROOT}/${year}/${month}/${safeKey(sbNo)}/Panels/${safeKey(
    panelId
  )}`;

const getSavedPanelKey = (year, month) =>
  `pitchingPanelWindow.selectedPanel.${year}.${month}`;

const loadSavedPanelId = (year, month) => {
  try {
    return localStorage.getItem(getSavedPanelKey(year, month)) || "";
  } catch {
    return "";
  }
};

const saveSelectedPanelId = (year, month, panelId) => {
  try {
    if (panelId) localStorage.setItem(getSavedPanelKey(year, month), panelId);
    else localStorage.removeItem(getSavedPanelKey(year, month));
  } catch {
    // ignore localStorage errors
  }
};

const getSbNo = (entry) => entry?.sb_no || entry?.sbNo || entry?.regNo || "";
const getEntityName = (entry) =>
  entry?.entity_name || entry?.entityName || entry?.startupName || "Unknown Startup";

const normalizePanelList = (panels) => {
  return Object.values(panels || {})
    .filter(Boolean)
    .map((p) => ({
      panelId: p.panelId,
      panelName: p.panelName || p.panelId,
      members: Object.values(p.members || {}).filter(Boolean),
    }))
    .sort((a, b) => String(a.panelName).localeCompare(String(b.panelName)));
};

const decisionOptions = [
  { value: "pending", label: "Pending", cls: "border-gray-500/20 text-gray-300 bg-gray-500/10" },
  { value: "selected", label: "Selected", cls: "border-emerald-500/20 text-emerald-300 bg-emerald-500/10" },
  { value: "waitlist", label: "Waitlist", cls: "border-amber-500/20 text-amber-300 bg-amber-500/10" },
  { value: "rejected", label: "Rejected", cls: "border-rose-500/20 text-rose-300 bg-rose-500/10" },
  { value: "needs_more_review", label: "More Review", cls: "border-indigo-500/20 text-indigo-300 bg-indigo-500/10" },
];

const ScorePill = ({ score, active, onClick }) => {
  const s = Number(score);
  let activeClass = "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-900/20";
  if (s >= 8) activeClass = "bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/20";
  else if (s >= 6) activeClass = "bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-900/20";
  else if (s > 0) activeClass = "bg-rose-600 border-rose-400 text-white shadow-lg shadow-rose-900/20";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 rounded-lg border text-[11px] font-semibold font-mono transition ${
        active
          ? activeClass
          : "bg-[#0f0f16] border-[#2d2d3f] text-gray-400 hover:border-indigo-500/50 hover:text-white"
      }`}
    >
      {s.toFixed(s % 1 === 0 ? 0 : 1)}
    </button>
  );
};

const DecisionButton = ({ option, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2 rounded-xl border text-xs font-semibold transition ${
      active ? option.cls : "border-[#2d2d3f] bg-[#0f0f16] text-gray-400 hover:text-white"
    }`}
  >
    {option.label}
  </button>
);

const PitchingPanelWindow = ({ entry, selectedMonth, selectedYear, panels }) => {
  const sbNo = getSbNo(entry);
  const entityName = getEntityName(entry);

  const panelList = useMemo(() => normalizePanelList(panels), [panels]);

  const [selectedPanelId, setSelectedPanelId] = useState(() =>
    loadSavedPanelId(selectedYear, selectedMonth)
  );
  const [memberRatings, setMemberRatings] = useState({});
  const [comment, setComment] = useState("");
  const [finalDecision, setFinalDecision] = useState("pending");
  const [saving, setSaving] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [saveState, setSaveState] = useState(null);

  useEffect(() => {
    const remembered = loadSavedPanelId(selectedYear, selectedMonth);
    if (remembered) setSelectedPanelId(remembered);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (!selectedPanelId && panelList.length === 1) {
      setSelectedPanelId(panelList[0].panelId);
      saveSelectedPanelId(selectedYear, selectedMonth, panelList[0].panelId);
    }
  }, [panelList, selectedPanelId, selectedMonth, selectedYear]);

  const selectedPanel = useMemo(() => {
    return panelList.find((p) => String(p.panelId) === String(selectedPanelId)) || null;
  }, [panelList, selectedPanelId]);

  const selectedMembers = useMemo(() => selectedPanel?.members || [], [selectedPanel]);

  useEffect(() => {
    if (!selectedPanelId || !sbNo) return;

    let mounted = true;

    const loadSaved = async () => {
      setLoadingSaved(true);
      setSaveState(null);

      try {
        const snap = await get(
          ref(rtdb, getPitchReviewPanelPath(selectedYear, selectedMonth, sbNo, selectedPanelId))
        );

        const val = snap.val();

        if (!mounted) return;

        if (val) {
          setMemberRatings(val.memberRatings || {});
          setComment(val.comment || "");
          setFinalDecision(val.finalDecision || "pending");
        } else {
          const fresh = {};
          selectedMembers.forEach((m) => {
            fresh[m.memberId] = {
              memberId: m.memberId,
              name: m.Name || m.name || "",
              designation: m.designation || "",
              score: "",
            };
          });
          setMemberRatings(fresh);
          setComment("");
          setFinalDecision("pending");
        }
      } catch (error) {
        console.error("Panel review load failed:", error);
        if (mounted) setSaveState({ type: "error", text: "Failed to load saved panel review." });
      } finally {
        if (mounted) setLoadingSaved(false);
      }
    };

    loadSaved();

    return () => {
      mounted = false;
    };
  }, [selectedPanelId, selectedMonth, selectedYear, sbNo, selectedMembers]);

  const averagePanelScore = useMemo(() => {
    const nums = Object.values(memberRatings || {})
      .map((m) => Number(m.score))
      .filter((n) => Number.isFinite(n) && n >= 0);

    if (!nums.length) return 0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  }, [memberRatings]);

  const ratedCount = useMemo(() => {
    return Object.values(memberRatings || {}).filter(
      (m) => m.score !== "" && m.score !== null && m.score !== undefined
    ).length;
  }, [memberRatings]);

  const updateMemberScore = (member, score) => {
    setMemberRatings((prev) => ({
      ...prev,
      [member.memberId]: {
        ...(prev?.[member.memberId] || {}),
        memberId: member.memberId,
        name: member.Name || member.name || "",
        designation: member.designation || "",
        score: score === "" ? "" : clamp010(score),
      },
    }));
  };

  const handlePanelChange = (panelId) => {
    setSelectedPanelId(panelId);
    saveSelectedPanelId(selectedYear, selectedMonth, panelId);
  };

  const savePanelReview = async () => {
    if (!sbNo || !selectedPanelId) {
      setSaveState({ type: "error", text: "Select a panel first." });
      return;
    }

    setSaving(true);
    setSaveState(null);

    try {
      const payload = {
        sbNo,
        entityName,
        reviewYear: selectedYear,
        reviewMonth: selectedMonth,
        batchLabel: `${selectedMonth} ${selectedYear}`,
        panelId: selectedPanelId,
        panelName: selectedPanel?.panelName || selectedPanelId,
        memberRatings,
        ratedCount,
        totalMembers: selectedMembers.length,
        averagePanelScore: to2(averagePanelScore),
        comment,
        finalDecision,
        updatedAt: Date.now(),
      };

      const updates = {};

      updates[
        getPitchReviewPanelPath(selectedYear, selectedMonth, sbNo, selectedPanelId)
      ] = payload;

      updates[
        `${PITCH_REVIEWS_ROOT}Index/${safeKey(sbNo)}/${selectedYear}_${selectedMonth}_${safeKey(
          selectedPanelId
        )}`
      ] = {
        sbNo,
        entityName,
        panelId: selectedPanelId,
        panelName: selectedPanel?.panelName || selectedPanelId,
        averagePanelScore: to2(averagePanelScore),
        ratedCount,
        totalMembers: selectedMembers.length,
        finalDecision,
        reviewYear: selectedYear,
        reviewMonth: selectedMonth,
        updatedAt: Date.now(),
        path: getPitchReviewPanelPath(
          selectedYear,
          selectedMonth,
          sbNo,
          selectedPanelId
        ),
      };

      await update(ref(rtdb), updates);
      setSaveState({ type: "success", text: "Panel review saved." });
    } catch (error) {
      console.error("Save panel review failed:", error);
      setSaveState({ type: "error", text: "Failed to save panel review. Check console." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="w-full xl:w-[480px] shrink-0 border-t xl:border-t-0 xl:border-l border-[#2d2d3f] bg-[#0b0b13] flex flex-col min-h-[440px] xl:h-full">
      <div className="p-4 border-b border-[#2d2d3f] bg-[#10101a]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <PanelRightOpen size={19} className="text-amber-300" />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-bold text-white">Pitching Panel Review</div>
            <div className="text-xs text-gray-500 truncate">
              Saved panel is remembered locally for {selectedMonth} {selectedYear}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
        <div className="rounded-2xl border border-[#2d2d3f] bg-[#13131f] p-4">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <UsersRound size={14} /> Select Review Panel
          </div>

          <select
            value={selectedPanelId}
            onChange={(e) => handlePanelChange(e.target.value)}
            className="w-full bg-[#0f0f16] border border-[#2d2d3f] rounded-xl px-3 py-3 text-sm text-gray-200 outline-none focus:border-indigo-500/50"
          >
            <option value="">Select Panel</option>
            {panelList.map((p) => (
              <option key={p.panelId} value={p.panelId}>
                {p.panelName || p.panelId}
              </option>
            ))}
          </select>

          <div className="mt-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 flex items-start gap-2">
            <Lock size={15} className="text-indigo-300 mt-0.5 shrink-0" />
            <p className="text-xs text-indigo-100/80 leading-relaxed">
              Panel creation and member management are intentionally disabled here. Create/edit panels separately under GlobalParameter/Panels.
            </p>
          </div>
        </div>

        {selectedPanelId ? (
          <div className="rounded-2xl border border-[#2d2d3f] bg-[#13131f] p-4">
            <div className="flex items-center justify-between mb-3 gap-3">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  Member Ratings
                </div>
                <div className="text-sm text-white font-semibold mt-1">
                  {selectedPanel?.panelName || selectedPanelId}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-gray-500 uppercase tracking-wider">
                  Average
                </div>
                <div className="text-xl text-emerald-300 font-mono font-bold">
                  {Number(averagePanelScore || 0).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="rounded-xl border border-[#2d2d3f] bg-[#0f0f16] p-3">
                <div className="text-[11px] text-gray-500 uppercase tracking-wider">Rated</div>
                <div className="text-lg font-mono text-white mt-1">
                  {ratedCount}/{selectedMembers.length}
                </div>
              </div>
              <div className="rounded-xl border border-[#2d2d3f] bg-[#0f0f16] p-3">
                <div className="text-[11px] text-gray-500 uppercase tracking-wider">Scale</div>
                <div className="text-lg font-mono text-white mt-1">0–10</div>
              </div>
            </div>

            {loadingSaved ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <RefreshCw size={16} className="animate-spin text-indigo-400" />
                Loading saved panel review...
              </div>
            ) : selectedMembers.length ? (
              <div className="space-y-4">
                {selectedMembers.map((m, idx) => {
                  const mr = memberRatings?.[m.memberId] || {};
                  const currentScore = mr.score === "" || mr.score === undefined ? "" : Number(mr.score);

                  return (
                    <div
                      key={m.memberId}
                      className="p-4 rounded-2xl border border-[#2d2d3f] bg-[#0f0f16]"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="text-sm text-white font-semibold">
                            {idx + 1}. {m.Name || m.name || "Unnamed Member"}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {m.designation || "—"}
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#2d2d3f] bg-[#13131f]">
                          <Star size={14} className="text-amber-300" />
                          <span className="text-sm font-mono text-white">
                            {currentScore === "" ? "—" : Number(currentScore).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1.5">
                        {SCORE_OPTIONS.map((s) => (
                          <ScorePill
                            key={s}
                            score={s}
                            active={currentScore !== "" && Number(currentScore) === Number(s)}
                            onClick={() => updateMemberScore(m, s)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#2d2d3f] p-5 text-center text-sm text-gray-500">
                No members found in this panel. Add members from the separate panel management screen.
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#2d2d3f] bg-[#13131f]/50 p-6 text-center">
            <UsersRound size={26} className="mx-auto text-gray-600 mb-2" />
            <div className="text-sm text-gray-400 font-semibold">Select a panel to start scoring</div>
            <div className="text-xs text-gray-600 mt-1">Panel selection will be remembered locally.</div>
          </div>
        )}

        {selectedPanelId ? (
          <div className="rounded-2xl border border-[#2d2d3f] bg-[#13131f] p-4 space-y-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <ClipboardList size={14} /> Panel Decision
            </div>

            <div className="grid grid-cols-2 gap-2">
              {decisionOptions.map((opt) => (
                <DecisionButton
                  key={opt.value}
                  option={opt}
                  active={finalDecision === opt.value}
                  onClick={() => setFinalDecision(opt.value)}
                />
              ))}
            </div>

            <label className="text-xs text-gray-400 block">
              Common Panel Comment
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                placeholder="Panel observation, proof asked, founder response, key concern, final view..."
                className="mt-2 w-full bg-[#0f0f16] border border-[#2d2d3f] rounded-xl px-3 py-3 text-sm text-gray-200 outline-none focus:border-indigo-500/50 resize-none"
              />
            </label>
          </div>
        ) : null}

        {saveState ? (
          <div
            className={`rounded-xl border p-3 flex items-start gap-2 ${
              saveState.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                : "border-rose-500/20 bg-rose-500/10 text-rose-200"
            }`}
          >
            {saveState.type === "success" ? (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            ) : (
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            )}
            <div className="text-xs leading-relaxed">{saveState.text}</div>
          </div>
        ) : null}
      </div>

      <div className="p-4 border-t border-[#2d2d3f] bg-[#10101a]">
        <button
          onClick={savePanelReview}
          disabled={saving || !selectedPanelId}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
            saving || !selectedPanelId
              ? "bg-[#1e1e2d] text-gray-500 cursor-not-allowed border border-[#2d2d3f]"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Panel Review"}
        </button>
      </div>
    </aside>
  );
};

export default PitchingPanelWindow;
