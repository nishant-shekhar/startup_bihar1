import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {
  RefreshCw,
  Layers,
  CalendarDays,
  Users,
  Bot,
  Star,
  ClipboardList,
  CheckCircle2,
  Clock3,
  Send,
  Eye,
} from "lucide-react";

import { db } from "../../../AdminRedesign/NewApplicationAdmin/firebase";

import BatchManager from "./BatchManager";
import ShortlistRules from "./ShortlistRules";
import SlotManager from "./SlotManager";
import PublishCenter from "./PublishCenter";

import {
  BATCH_COLLECTION,
  calculateBatchCounts,
  formatDate,
  formatDateTime,
  safe,
} from "./shortlistingUtils";

const tabItems = [
  {
    key: "batch",
    label: "Batch Setup",
    shortLabel: "Batch",
    description: "Create batch and assign submitted applications",
  },
  {
    key: "shortlist",
    label: "Shortlisting",
    shortLabel: "Rules",
    description: "Apply AI and expert cutoff rules",
  },
  {
    key: "slots",
    label: "Slots",
    shortLabel: "Slots",
    description: "Create written and PI schedules",
  },
  {
    key: "publish",
    label: "Publish",
    shortLabel: "Publish",
    description: "Publish result or schedule for selected batch",
  },
];

export default function StartupShortlistingMain() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchApplications, setBatchApplications] = useState([]);

  const [activeTab, setActiveTab] = useState("batch");

  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingBatchApplications, setLoadingBatchApplications] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedBatchCounts = useMemo(() => {
    if (selectedBatch?.counts) {
      return {
        ...calculateBatchCounts(batchApplications),
        ...selectedBatch.counts,
      };
    }

    return calculateBatchCounts(batchApplications);
  }, [selectedBatch, batchApplications]);

  const selectedBatchLabel =
    selectedBatch?.batchName || selectedBatch?.batchId || selectedBatchId || "No batch selected";

  const loadBatches = async () => {
    try {
      setLoadingBatches(true);

      const snap = await getDocs(
        query(collection(db, BATCH_COLLECTION), orderBy("createdAt", "desc"))
      );

      const rows = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setBatches(rows);

      if (!selectedBatchId && rows.length) {
        setSelectedBatchId(rows[0].id);
      }
    } catch (error) {
      console.error("Failed to load shortlisting batches", error);
      alert("Failed to load shortlisting batches.");
    } finally {
      setLoadingBatches(false);
    }
  };

  const loadSelectedBatch = async (batchId = selectedBatchId) => {
    if (!batchId) {
      setSelectedBatch(null);
      return;
    }

    try {
      const snap = await getDoc(doc(db, BATCH_COLLECTION, batchId));

      if (snap.exists()) {
        setSelectedBatch({
          id: snap.id,
          ...snap.data(),
        });
      } else {
        setSelectedBatch(null);
      }
    } catch (error) {
      console.error("Failed to load selected batch", error);
      setSelectedBatch(null);
    }
  };

  const loadBatchApplications = async (batchId = selectedBatchId) => {
    if (!batchId) {
      setBatchApplications([]);
      return;
    }

    try {
      setLoadingBatchApplications(true);

      const snap = await getDocs(
        collection(db, BATCH_COLLECTION, batchId, "applications")
      );

      const rows = snap.docs
        .map((item) => ({
          id: item.id,
          ...item.data(),
        }))
        .sort((a, b) =>
          String(a.applicationId || "").localeCompare(
            String(b.applicationId || "")
          )
        );

      setBatchApplications(rows);
    } catch (error) {
      console.error("Failed to load batch applications", error);
      setBatchApplications([]);
      alert("Failed to load applications assigned to selected batch.");
    } finally {
      setLoadingBatchApplications(false);
    }
  };

  const refreshAll = async () => {
    await loadBatches();

    if (selectedBatchId) {
      await Promise.all([
        loadSelectedBatch(selectedBatchId),
        loadBatchApplications(selectedBatchId),
      ]);
    }

    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (!selectedBatchId) {
      setSelectedBatch(null);
      setBatchApplications([]);
      return;
    }

    loadSelectedBatch(selectedBatchId);
    loadBatchApplications(selectedBatchId);
  }, [selectedBatchId]);

  const contextProps = {
    db,
    batches,
    selectedBatchId,
    setSelectedBatchId,
    selectedBatch,
    setSelectedBatch,
    batchApplications,
    setBatchApplications,
    reloadBatches: loadBatches,
    reloadSelectedBatch: loadSelectedBatch,
    reloadBatchApplications: loadBatchApplications,
    refreshAll,
    refreshKey,
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-5 xl:p-6">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                <Layers size={13} />
                Startup Bihar Shortlisting
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Batch-wise Evaluation System
              </h1>

              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
                Select a batch, assign submitted applications, apply AI and expert
                shortlisting, schedule written/PI slots, and publish status for
                applicants. All actions apply only to the selected batch.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-[260px]">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Active Batch
                </label>

                <select
                  value={selectedBatchId}
                  onChange={(event) => setSelectedBatchId(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                >
                  <option value="">Select batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchName || batch.batchId || batch.id}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={refreshAll}
                disabled={loadingBatches || loadingBatchApplications}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={16}
                  className={
                    loadingBatches || loadingBatchApplications ? "animate-spin" : ""
                  }
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Working Batch
              </div>

              <div className="mt-1 text-xl font-bold text-slate-900">
                {selectedBatchLabel}
              </div>

              {selectedBatch ? (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold">
                    <CalendarDays size={13} />
                    {safe(selectedBatch.startDate)} to {safe(selectedBatch.endDate)}
                  </span>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold">
                    Status: {safe(selectedBatch.status || "active")}
                  </span>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold">
                    Created: {formatDateTime(selectedBatch.createdAt)}
                  </span>
                </div>
              ) : (
                <p className="mt-2 text-sm text-rose-600">
                  No batch selected. Create or select a batch to continue.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
              <SmallStat
                label="Assigned"
                value={selectedBatchCounts.assigned}
                icon={Users}
              />
              <SmallStat
                label="AI"
                value={selectedBatchCounts.aiShortlisted}
                icon={Bot}
              />
              <SmallStat
                label="Expert"
                value={selectedBatchCounts.expertShortlisted}
                icon={Star}
              />
              <SmallStat
                label="Written Slot"
                value={selectedBatchCounts.writtenSlotAssigned}
                icon={ClipboardList}
              />
              <SmallStat
                label="Written OK"
                value={selectedBatchCounts.writtenQualified}
                icon={CheckCircle2}
              />
              <SmallStat
                label="PI Slot"
                value={selectedBatchCounts.piSlotAssigned}
                icon={Clock3}
              />
              <SmallStat
                label="PI Selected"
                value={selectedBatchCounts.piSelected}
                icon={Send}
              />
              <SmallStat
                label="Recognised"
                value={selectedBatchCounts.recognised}
                icon={CheckCircle2}
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {tabItems.map((tab) => {
              const active = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-2xl px-3 py-3 text-left transition md:px-4 ${
                    active
                      ? "bg-slate-900 text-white"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="text-sm font-bold">
                    <span className="hidden md:inline">{tab.label}</span>
                    <span className="md:hidden">{tab.shortLabel}</span>
                  </div>

                  <div
                    className={`mt-1 hidden text-xs md:block ${
                      active ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    {tab.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "batch" ? <BatchManager {...contextProps} /> : null}

        {activeTab === "shortlist" ? (
          <ShortlistRules {...contextProps} />
        ) : null}

        {activeTab === "slots" ? <SlotManager {...contextProps} /> : null}

        {activeTab === "publish" ? <PublishCenter {...contextProps} /> : null}

        <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
          <div className="flex items-start gap-3">
            <Eye size={18} className="mt-1 text-slate-500" />
            <div>
              <div className="font-semibold text-slate-900">
                Visibility rule
              </div>
              <div>
                Applicant status is batch-specific. Applicants can see only the
                stages published for the selected batch. Publishing does not affect
                other batches.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SmallStat({ label, value, icon: Icon }) {
  return (
    <div className="min-w-[92px] rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <Icon size={15} className="text-slate-500" />
        <div className="text-lg font-bold text-slate-900">{value || 0}</div>
      </div>

      <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
    </div>
  );
}