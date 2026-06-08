import React, { useMemo, useState } from "react";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Send,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  BATCH_COLLECTION,
  PUBLIC_STAGE_LABELS,
  safe,
} from "./shortlistingUtils";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

const publishItems = [
  {
    key: "aiResult",
    title: "Application Screening Result",
    visibleText:
      "Applicant will see whether the application cleared initial screening.",
    hiddenText:
      "Applicant will see this stage as under review or result not published.",
  },
  {
    key: "expertResult",
    title: "Expert Review Result",
    visibleText:
      "Applicant will see whether the application cleared Expert Review.",
    hiddenText:
      "Applicant will not see Expert Review result yet.",
  },
  {
    key: "writtenSlot",
    title: "Written Test Schedule",
    visibleText:
      "Applicant will see written test date, time, mode, venue/link and instruction.",
    hiddenText:
      "Applicant will not see written test schedule yet.",
  },
  {
    key: "writtenResult",
    title: "Written Assessment Result",
    visibleText:
      "Applicant will see written assessment qualification status.",
    hiddenText:
      "Applicant will not see written assessment result yet.",
  },
  {
    key: "piSlot",
    title: "Pitch / PI Schedule",
    visibleText:
      "Applicant will see PI date, time, mode, venue/link and instruction.",
    hiddenText:
      "Applicant will not see PI schedule yet.",
  },
  {
    key: "piResult",
    title: "Pitch / PI Result",
    visibleText:
      "Applicant will see PI selection status.",
    hiddenText:
      "Applicant will not see PI result yet.",
  },
  {
    key: "finalResult",
    title: "Final Recognition Result",
    visibleText:
      "Applicant will see final recognised / not recognised status.",
    hiddenText:
      "Applicant will not see final recognition result yet.",
  },
];

export default function PublishCenter({
  db,
  selectedBatchId,
  selectedBatch,
  batchApplications,
  reloadSelectedBatch,
  reloadBatches,
}) {
  const [savingKey, setSavingKey] = useState("");

  const publishState = selectedBatch?.publish || {};

  const batchLabel =
    selectedBatch?.batchName || selectedBatch?.batchId || selectedBatchId || "-";

  const publishedCount = useMemo(() => {
    return publishItems.filter((item) => publishState?.[item.key] === true)
      .length;
  }, [publishState]);

  const hiddenCount = publishItems.length - publishedCount;

  const batchCounts = selectedBatch?.counts || {};

  const updatePublishFlag = async (flag, value) => {
    if (!selectedBatchId || !selectedBatch) {
      alert("Select a batch first.");
      return;
    }

    const stageLabel = PUBLIC_STAGE_LABELS[flag] || flag;

    const confirmMessage = [
      `${value ? "Publish" : "Hide"} ${stageLabel}?`,
      "",
      `Batch: ${batchLabel}`,
      `Assigned applications: ${batchApplications.length || batchCounts.assigned || 0}`,
      "",
      value
        ? "Applicants assigned to this batch will be able to see this stage."
        : "Applicants assigned to this batch will no longer see this stage.",
      "",
      "This action applies only to the selected batch.",
    ].join("\n");

    if (!window.confirm(confirmMessage)) return;

    try {
      setSavingKey(flag);

      const nextPublish = {
        ...(selectedBatch.publish || {}),
        [flag]: value,
      };

      await setDoc(
        doc(db, BATCH_COLLECTION, selectedBatchId),
        {
          publish: nextPublish,
          updatedAt: serverTimestamp(),
          publishUpdatedAt: serverTimestamp(),
          publishUpdatedBy: "admin",
        },
        { merge: true }
      );

      await Promise.all([
        reloadSelectedBatch(selectedBatchId),
        reloadBatches(),
      ]);

      alert(`${stageLabel} ${value ? "published" : "hidden"} for ${batchLabel}.`);
    } catch (error) {
      console.error("Publish update failed", error);
      alert("Failed to update publish status.");
    } finally {
      setSavingKey("");
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <div className="space-y-5">
        <SectionCard
          title="Working Batch"
          subtitle="Publishing is always batch-specific."
          icon={ShieldCheck}
        >
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-violet-700">
              Selected Batch
            </div>
            <div className="mt-1 text-2xl font-bold text-violet-950">
              {batchLabel}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <InfoPill label="Batch ID" value={selectedBatchId || "-"} />
              <InfoPill
                label="Applications"
                value={batchApplications.length || batchCounts.assigned || 0}
              />
              <InfoPill label="Published" value={publishedCount} />
              <InfoPill label="Hidden" value={hiddenCount} />
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <div className="flex items-start gap-2">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div>
                Publishing here affects only applicants assigned to{" "}
                <strong>{batchLabel}</strong>. Other batches are not affected.
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Batch Counts"
          subtitle="Current count snapshot for this batch."
          icon={Users}
        >
          <div className="space-y-2">
            <CountRow label="Assigned" value={batchCounts.assigned || batchApplications.length || 0} />
            <CountRow label="AI Shortlisted" value={batchCounts.aiShortlisted || 0} />
            <CountRow label="Expert Shortlisted" value={batchCounts.expertShortlisted || 0} />
            <CountRow label="Written Slot Assigned" value={batchCounts.writtenSlotAssigned || 0} />
            <CountRow label="Written Qualified" value={batchCounts.writtenQualified || 0} />
            <CountRow label="PI Slot Assigned" value={batchCounts.piSlotAssigned || 0} />
            <CountRow label="PI Selected" value={batchCounts.piSelected || 0} />
            <CountRow label="Recognised" value={batchCounts.recognised || 0} />
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Publish Actions"
        subtitle="Choose which stage should be visible to applicants for the selected batch."
        icon={Send}
      >
        <div className="grid gap-3">
          {publishItems.map((item) => {
            const active = publishState?.[item.key] === true;
            const saving = savingKey === item.key;

            return (
              <div
                key={item.key}
                className={`rounded-2xl border p-4 transition ${
                  active
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${
                          active
                            ? "border-emerald-200 bg-white text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {active ? <Eye size={12} /> : <EyeOff size={12} />}
                        {active ? "Published" : "Hidden"}
                      </span>

                      <h3 className="text-base font-bold text-slate-900">
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {active ? item.visibleText : item.hiddenText}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => updatePublishFlag(item.key, !active)}
                    disabled={!!savingKey}
                    className={`${buttonBase} min-w-[170px] ${
                      active
                        ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {active ? <EyeOff size={16} /> : <CheckCircle2 size={16} />}
                    {saving
                      ? "Updating..."
                      : active
                      ? "Hide"
                      : "Publish"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({ title, subtitle, icon: Icon, children }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <Icon size={18} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white/80 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-violet-500">
        {label}
      </div>
      <div className="mt-1 font-bold text-violet-950">{safe(value)}</div>
    </div>
  );
}

function CountRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-sm font-bold text-slate-900">{value || 0}</div>
    </div>
  );
}