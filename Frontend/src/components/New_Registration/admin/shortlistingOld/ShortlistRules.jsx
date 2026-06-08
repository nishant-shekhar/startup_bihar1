import React, { useMemo, useState } from "react";
import {
  doc,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  Bot,
  Star,
  Save,
  Eye,
  Settings2,
  AlertTriangle,
  FilePenLine,
  UserCheck,
  ExternalLink,
} from "lucide-react";

import {
  BATCH_COLLECTION,
  SHORTLIST_STATUS,
  buildAIShortlistPayload,
  buildExpertShortlistPayload,
  calculateBatchCounts,
  safe,
} from "./shortlistingUtils";

import {
  SectionCard,
  Field,
  ScoreBadge,
  StatusBadge,
  SearchBox,
  PaginationBar,
  usePagination,
  MiniCount,
  inputClass,
  buttonBase,
  SlotText,
} from "./ShortlistingUI";

const stageTabs = [
  {
    key: "ai",
    label: "AI Screening",
  },
  {
    key: "expert",
    label: "Expert Review",
  },
  {
    key: "written",
    label: "Written",
  },
  {
    key: "pi",
    label: "PI / Final",
  },
];

export default function ShortlistRules({
  db,
  selectedBatchId,
  selectedBatch,
  batchApplications,
  setBatchApplications,
  reloadSelectedBatch,
  reloadBatchApplications,
  reloadBatches,
}) {
  const [activeStage, setActiveStage] = useState("ai");

  const [aiCutoff, setAiCutoff] = useState("7.7");
  const [expertCutoff, setExpertCutoff] = useState("7.5");

  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const batchLabel =
    selectedBatch?.batchName || selectedBatch?.batchId || selectedBatchId || "-";

  const aiRows = useMemo(() => {
    const cutoff = Number(aiCutoff);

    return batchApplications.map((item) => {
      const score = Number(item.aiScore);
      const hasScore = Number.isFinite(score);

      const nextStatus =
        Number.isFinite(cutoff) && hasScore && score >= cutoff
          ? SHORTLIST_STATUS.SHORTLISTED
          : SHORTLIST_STATUS.NOT_SHORTLISTED;

      return {
        ...item,
        hasScore,
        nextStatus,
      };
    });
  }, [batchApplications, aiCutoff]);

  const expertRows = useMemo(() => {
    const cutoff = Number(expertCutoff);

    return batchApplications
      .filter((item) => item?.aiShortlisting?.status === SHORTLIST_STATUS.SHORTLISTED)
      .map((item) => {
        const score = Number(item.expertScore);
        const hasScore = Number.isFinite(score);

        const nextStatus =
          Number.isFinite(cutoff) && hasScore && score >= cutoff
            ? SHORTLIST_STATUS.SHORTLISTED
            : SHORTLIST_STATUS.NOT_SHORTLISTED;

        return {
          ...item,
          hasScore,
          nextStatus,
        };
      });
  }, [batchApplications, expertCutoff]);

  const writtenRows = useMemo(() => {
    return batchApplications.filter(
      (item) => item?.expertShortlisting?.status === SHORTLIST_STATUS.SHORTLISTED
    );
  }, [batchApplications]);

  const piRows = useMemo(() => {
    return batchApplications.filter(
      (item) =>
        item?.written?.status === SHORTLIST_STATUS.QUALIFIED ||
        item?.piSlot?.slotId ||
        item?.pi?.selected !== null ||
        item?.finalDecision?.status !== "pending"
    );
  }, [batchApplications]);

  const currentRows = useMemo(() => {
    if (activeStage === "ai") return aiRows;
    if (activeStage === "expert") return expertRows;
    if (activeStage === "written") return writtenRows;
    if (activeStage === "pi") return piRows;
    return [];
  }, [activeStage, aiRows, expertRows, writtenRows, piRows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return currentRows;

    return currentRows.filter((item) =>
      [
        item.applicationId,
        item.startupName,
        item.founderName,
        item.email,
        item.phone,
        item.aiShortlisting?.status,
        item.expertShortlisting?.status,
        item.written?.status,
        item.pi?.selected === true ? "selected" : "",
        item.pi?.selected === false ? "not selected" : "",
        item.finalDecision?.status,
        item.writtenSlot?.title,
        item.piSlot?.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [currentRows, search]);

  const pager = usePagination(filteredRows, 15);

  const aiStats = useMemo(() => {
    return {
      eligible: aiRows.length,
      shortlisted: aiRows.filter((item) => item.nextStatus === SHORTLIST_STATUS.SHORTLISTED).length,
      notShortlisted: aiRows.filter((item) => item.nextStatus === SHORTLIST_STATUS.NOT_SHORTLISTED).length,
      noScore: aiRows.filter((item) => !item.hasScore).length,
      currentShortlisted: batchApplications.filter(
        (item) => item?.aiShortlisting?.status === SHORTLIST_STATUS.SHORTLISTED
      ).length,
    };
  }, [aiRows, batchApplications]);

  const expertStats = useMemo(() => {
    return {
      eligible: expertRows.length,
      shortlisted: expertRows.filter((item) => item.nextStatus === SHORTLIST_STATUS.SHORTLISTED).length,
      notShortlisted: expertRows.filter((item) => item.nextStatus === SHORTLIST_STATUS.NOT_SHORTLISTED).length,
      noScore: expertRows.filter((item) => !item.hasScore).length,
      currentShortlisted: batchApplications.filter(
        (item) => item?.expertShortlisting?.status === SHORTLIST_STATUS.SHORTLISTED
      ).length,
    };
  }, [expertRows, batchApplications]);

  const writtenStats = useMemo(() => {
    return {
      eligible: writtenRows.length,
      slotAssigned: writtenRows.filter((item) => item?.writtenSlot?.slotId).length,
      qualified: writtenRows.filter((item) => item?.written?.status === SHORTLIST_STATUS.QUALIFIED).length,
      notQualified: writtenRows.filter((item) => item?.written?.status === SHORTLIST_STATUS.NOT_QUALIFIED).length,
      pending: writtenRows.filter(
        (item) => !item?.written?.status || item?.written?.status === SHORTLIST_STATUS.PENDING
      ).length,
    };
  }, [writtenRows]);

  const piStats = useMemo(() => {
    return {
      eligible: piRows.length,
      slotAssigned: piRows.filter((item) => item?.piSlot?.slotId).length,
      selected: piRows.filter((item) => item?.pi?.selected === true).length,
      notSelected: piRows.filter((item) => item?.pi?.selected === false).length,
      recognised: piRows.filter((item) => item?.finalDecision?.status === SHORTLIST_STATUS.RECOGNISED).length,
    };
  }, [piRows]);

  const ensureBatchSelected = () => {
    if (!selectedBatchId || !selectedBatch) {
      alert("Select a batch first.");
      return false;
    }

    if (!batchApplications.length) {
      alert("No applications assigned to this batch.");
      return false;
    }

    return true;
  };

  const updateBatchCounts = async (rows) => {
    const counts = calculateBatchCounts(rows);

    await updateDoc(doc(db, BATCH_COLLECTION, selectedBatchId), {
      counts,
      totalApplications: counts.assigned,
      aiShortlistedCount: counts.aiShortlisted,
      expertShortlistedCount: counts.expertShortlisted,
      writtenQualifiedCount: counts.writtenQualified,
      piSelectedCount: counts.piSelected,
      recognisedCount: counts.recognised,
      updatedAt: serverTimestamp(),
    });
  };

  const applyAiShortlist = async () => {
    if (!ensureBatchSelected()) return;

    const cutoff = Number(aiCutoff);

    if (!Number.isFinite(cutoff)) {
      alert("Enter a valid AI cutoff.");
      return;
    }

    const confirmMessage = [
      `Apply AI shortlist for batch ${batchLabel}?`,
      "",
      `Cutoff: ${cutoff}`,
      `Applications in batch: ${aiStats.eligible}`,
      `Will be shortlisted: ${aiStats.shortlisted}`,
      `Will not be shortlisted: ${aiStats.notShortlisted}`,
      `Without AI score: ${aiStats.noScore}`,
      "",
      "Applicants will not see this until Application Screening Result is published.",
    ].join("\n");

    if (!window.confirm(confirmMessage)) return;

    try {
      setSaving(true);

      const nowValue = serverTimestamp();

      const updatedRows = batchApplications.map((item) => {
        const payload = buildAIShortlistPayload({
          item,
          cutoff,
          serverTimestampValue: nowValue,
        });

        return {
          ...item,
          ...payload,
        };
      });

      for (let index = 0; index < batchApplications.length; index += 300) {
        const chunk = batchApplications.slice(index, index + 300);
        const batch = writeBatch(db);

        chunk.forEach((item) => {
          const payload = buildAIShortlistPayload({
            item,
            cutoff,
            serverTimestampValue: nowValue,
          });

          batch.set(
            doc(
              db,
              BATCH_COLLECTION,
              selectedBatchId,
              "applications",
              item.applicationId
            ),
            payload,
            { merge: true }
          );
        });

        await batch.commit();
      }

      setBatchApplications(updatedRows);

      await updateBatchCounts(updatedRows);

      await Promise.all([
        reloadSelectedBatch(selectedBatchId),
        reloadBatchApplications(selectedBatchId),
        reloadBatches(),
      ]);

      alert(`AI shortlist applied for ${batchLabel}.`);
    } catch (error) {
      console.error("AI shortlist failed", error);
      alert("Failed to apply AI shortlist.");
    } finally {
      setSaving(false);
    }
  };

  const applyExpertShortlist = async () => {
    if (!ensureBatchSelected()) return;

    const cutoff = Number(expertCutoff);

    if (!Number.isFinite(cutoff)) {
      alert("Enter a valid expert cutoff.");
      return;
    }

    if (!expertRows.length) {
      alert("No AI-shortlisted applications found. Apply AI shortlist first.");
      return;
    }

    const confirmMessage = [
      `Apply Expert shortlist for batch ${batchLabel}?`,
      "",
      `Cutoff: ${cutoff}`,
      `Eligible AI-shortlisted applications: ${expertStats.eligible}`,
      `Will be shortlisted: ${expertStats.shortlisted}`,
      `Will not be shortlisted: ${expertStats.notShortlisted}`,
      `Without expert score: ${expertStats.noScore}`,
      "",
      "Applicants will not see this until Expert Review Result is published.",
    ].join("\n");

    if (!window.confirm(confirmMessage)) return;

    try {
      setSaving(true);

      const nowValue = serverTimestamp();

      const updatedRows = batchApplications.map((item) => {
        if (item?.aiShortlisting?.status !== SHORTLIST_STATUS.SHORTLISTED) {
          return item;
        }

        const payload = buildExpertShortlistPayload({
          item,
          cutoff,
          serverTimestampValue: nowValue,
        });

        return {
          ...item,
          ...payload,
        };
      });

      const rowsToWrite = batchApplications.filter(
        (item) => item?.aiShortlisting?.status === SHORTLIST_STATUS.SHORTLISTED
      );

      for (let index = 0; index < rowsToWrite.length; index += 300) {
        const chunk = rowsToWrite.slice(index, index + 300);
        const batch = writeBatch(db);

        chunk.forEach((item) => {
          const payload = buildExpertShortlistPayload({
            item,
            cutoff,
            serverTimestampValue: nowValue,
          });

          batch.set(
            doc(
              db,
              BATCH_COLLECTION,
              selectedBatchId,
              "applications",
              item.applicationId
            ),
            payload,
            { merge: true }
          );
        });

        await batch.commit();
      }

      setBatchApplications(updatedRows);

      await updateBatchCounts(updatedRows);

      await Promise.all([
        reloadSelectedBatch(selectedBatchId),
        reloadBatchApplications(selectedBatchId),
        reloadBatches(),
      ]);

      alert(`Expert shortlist applied for ${batchLabel}.`);
    } catch (error) {
      console.error("Expert shortlist failed", error);
      alert("Failed to apply expert shortlist.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <SectionCard
        title="Shortlisting Workspace"
        subtitle={`Working batch: ${batchLabel}. Select a stage below and review actual applications.`}
        icon={Settings2}
      >
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {stageTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveStage(tab.key);
                setSearch("");
                pager.setPage(1);
              }}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                activeStage === tab.key
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </SectionCard>

      {activeStage === "ai" ? (
        <StageActionCard
          icon={Bot}
          title="AI Screening"
          subtitle="Apply AI cutoff to all applications in the selected batch."
          cutoffLabel="AI Cutoff"
          cutoffValue={aiCutoff}
          setCutoffValue={setAiCutoff}
          buttonLabel={`Apply AI Shortlist to ${batchLabel}`}
          onApply={applyAiShortlist}
          saving={saving}
          stats={[
            ["Eligible", aiStats.eligible, "slate"],
            ["Will Shortlist", aiStats.shortlisted, "emerald"],
            ["Will Not Shortlist", aiStats.notShortlisted, "rose"],
            ["No Score", aiStats.noScore, "amber"],
            ["Currently Shortlisted", aiStats.currentShortlisted, "sky"],
          ]}
        />
      ) : null}

      {activeStage === "expert" ? (
        <StageActionCard
          icon={Star}
          title="Expert Review"
          subtitle="Apply expert cutoff only to AI-shortlisted applications."
          cutoffLabel="Expert Cutoff"
          cutoffValue={expertCutoff}
          setCutoffValue={setExpertCutoff}
          buttonLabel={`Apply Expert Shortlist to ${batchLabel}`}
          onApply={applyExpertShortlist}
          saving={saving}
          stats={[
            ["Eligible", expertStats.eligible, "slate"],
            ["Will Shortlist", expertStats.shortlisted, "emerald"],
            ["Will Not Shortlist", expertStats.notShortlisted, "rose"],
            ["No Score", expertStats.noScore, "amber"],
            ["Currently Shortlisted", expertStats.currentShortlisted, "sky"],
          ]}
        />
      ) : null}

      {activeStage === "written" ? (
        <SectionCard
          title="Written Assessment View"
          subtitle="This shows expert-shortlisted applications. Enter marks in writtenMarks.jsx."
          icon={FilePenLine}
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <MiniCount label="Eligible" value={writtenStats.eligible} />
            <MiniCount label="Slot Assigned" value={writtenStats.slotAssigned} tone="sky" />
            <MiniCount label="Qualified" value={writtenStats.qualified} tone="emerald" />
            <MiniCount label="Not Qualified" value={writtenStats.notQualified} tone="rose" />
            <MiniCount label="Pending" value={writtenStats.pending} tone="amber" />
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Written marks and qualification should be managed in{" "}
            <strong>writtenMarks.jsx</strong>. This screen is for monitoring stage
            status inside the batch.
          </div>
        </SectionCard>
      ) : null}

      {activeStage === "pi" ? (
        <SectionCard
          title="PI / Final View"
          subtitle="This shows written-qualified or PI-stage applications. Enter PI result in piMarks.jsx."
          icon={UserCheck}
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <MiniCount label="Eligible / In Stage" value={piStats.eligible} />
            <MiniCount label="PI Slot" value={piStats.slotAssigned} tone="sky" />
            <MiniCount label="Selected" value={piStats.selected} tone="emerald" />
            <MiniCount label="Not Selected" value={piStats.notSelected} tone="rose" />
            <MiniCount label="Recognised" value={piStats.recognised} tone="violet" />
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            PI marks, PI selection and final decision should be managed in{" "}
            <strong>piMarks.jsx</strong>. This screen is for monitoring final-stage
            applications.
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title={`${stageTabs.find((item) => item.key === activeStage)?.label || "Stage"} Applications`}
        subtitle="15 applications per page. Search by application ID, startup name, founder, or status."
        icon={Eye}
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <SearchBox
            value={search}
            onChange={(value) => {
              setSearch(value);
              pager.setPage(1);
            }}
            placeholder="Search applications..."
          />

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
            Total: {filteredRows.length}
          </span>
        </div>

        <StageApplicationTable
          activeStage={activeStage}
          rows={pager.pagedRows}
        />

        <PaginationBar
          page={pager.page}
          setPage={pager.setPage}
          pageSize={pager.pageSize}
          total={pager.total}
        />
      </SectionCard>

      <SectionCard
        title="Important"
        subtitle="Applicant visibility is controlled separately."
        icon={AlertTriangle}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <InfoBox
            title="Batch-specific"
            text="Changes apply only to the selected batch."
          />
          <InfoBox
            title="Not auto-published"
            text="Applicants cannot see these results until published from Publish Center."
          />
          <InfoBox
            title="Stage order"
            text="Expert works after AI. Written works after expert. PI works after written."
          />
        </div>
      </SectionCard>
    </div>
  );
}

function StageActionCard({
  icon: Icon,
  title,
  subtitle,
  cutoffLabel,
  cutoffValue,
  setCutoffValue,
  buttonLabel,
  onApply,
  saving,
  stats,
}) {
  return (
    <SectionCard title={title} subtitle={subtitle} icon={Icon}>
      <div className="grid gap-4 lg:grid-cols-[240px_1fr_auto]">
        <Field label={cutoffLabel}>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={cutoffValue}
            onChange={(event) => setCutoffValue(event.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {stats.map(([label, value, tone]) => (
            <MiniCount key={label} label={label} value={value} tone={tone} />
          ))}
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onApply}
            disabled={saving}
            className={`${buttonBase} w-full bg-slate-900 text-white hover:bg-slate-800 lg:w-auto`}
          >
            <Save size={16} />
            {buttonLabel}
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

function StageApplicationTable({ activeStage, rows }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-[1200px] w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Application</th>
            <th className="px-4 py-3">Startup</th>
            <th className="px-4 py-3">Founder</th>

            {activeStage === "ai" ? (
              <>
                <th className="px-4 py-3">AI Score</th>
                <th className="px-4 py-3">Current AI</th>
                <th className="px-4 py-3">Next AI</th>
              </>
            ) : null}

            {activeStage === "expert" ? (
              <>
                <th className="px-4 py-3">AI Status</th>
                <th className="px-4 py-3">Expert Score</th>
                <th className="px-4 py-3">Current Expert</th>
                <th className="px-4 py-3">Next Expert</th>
              </>
            ) : null}

            {activeStage === "written" ? (
              <>
                <th className="px-4 py-3">Expert Status</th>
                <th className="px-4 py-3">Written Slot</th>
                <th className="px-4 py-3">Written Marks</th>
                <th className="px-4 py-3">Written Status</th>
              </>
            ) : null}

            {activeStage === "pi" ? (
              <>
                <th className="px-4 py-3">Written Status</th>
                <th className="px-4 py-3">PI Slot</th>
                <th className="px-4 py-3">PI Status</th>
                <th className="px-4 py-3">Final</th>
              </>
            ) : null}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                No applications found for this stage.
              </td>
            </tr>
          ) : (
            rows.map((item) => (
              <tr key={item.applicationId} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3 font-semibold text-slate-900">
                  {safe(item.applicationId)}
                </td>

                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-800">
                    {safe(item.startupName)}
                  </div>
                  <div className="text-xs text-slate-500">{safe(item.email)}</div>
                </td>

                <td className="px-4 py-3">{safe(item.founderName)}</td>

                {activeStage === "ai" ? (
                  <>
                    <td className="px-4 py-3">
                      <ScoreBadge value={item.aiScore} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={item?.aiShortlisting?.status} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={item.nextStatus} />
                    </td>
                  </>
                ) : null}

                {activeStage === "expert" ? (
                  <>
                    <td className="px-4 py-3">
                      <StatusBadge value={item?.aiShortlisting?.status} />
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBadge value={item.expertScore} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={item?.expertShortlisting?.status} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={item.nextStatus} />
                    </td>
                  </>
                ) : null}

                {activeStage === "written" ? (
                  <>
                    <td className="px-4 py-3">
                      <StatusBadge value={item?.expertShortlisting?.status} />
                    </td>
                    <td className="px-4 py-3">
                      <SlotText slot={item.writtenSlot} />
                    </td>
                    <td className="px-4 py-3">
                      {item?.written?.marks ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={item?.written?.status} />
                    </td>
                  </>
                ) : null}

                {activeStage === "pi" ? (
                  <>
                    <td className="px-4 py-3">
                      <StatusBadge value={item?.written?.status} />
                    </td>
                    <td className="px-4 py-3">
                      <SlotText slot={item.piSlot} />
                    </td>
                    <td className="px-4 py-3">
                      {item?.pi?.selected === true ? (
                        <StatusBadge value="selected" />
                      ) : item?.pi?.selected === false ? (
                        <StatusBadge value="not_selected" />
                      ) : (
                        <StatusBadge value="pending" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge value={item?.finalDecision?.status} />
                    </td>
                  </>
                ) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function InfoBox({ title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm leading-6 text-slate-500">{text}</div>
    </div>
  );
}