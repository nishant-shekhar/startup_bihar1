import React, { useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  Plus,
  Save,
  UploadCloud,
  XCircle,
  Users,
} from "lucide-react";

import {
  APP_COLLECTION,
  BATCH_COLLECTION,
  EMPTY_COUNTS,
  EMPTY_PUBLISH_STATE,
  buildBatchApplicationPayload,
  calculateBatchCounts,
  formatDate,
  getAIScore,
  getApplicationId,
  getEffectiveSubmittedDate,
  getEmail,
  getExpertScore,
  getFounderName,
  getPhone,
  getStartupName,
  getStatus,
  isFinalSubmittedStatus,
  readExpertReviewForApplication,
  safe,
  toDate,
} from "./shortlistingUtils";

import {
  SectionCard,
  Field,
  ScoreBadge,
  StatusBadge,
  SlotText,
  SearchBox,
  PaginationBar,
  usePagination,
  MiniCount,
  inputClass,
  buttonBase,
} from "./ShortlistingUI";

export default function BatchManager({
  db,
  batches,
  selectedBatchId,
  setSelectedBatchId,
  selectedBatch,
  batchApplications,
  setBatchApplications,
  reloadBatches,
  reloadSelectedBatch,
  reloadBatchApplications,
}) {
  const [batchForm, setBatchForm] = useState({
    batchId: "",
    batchName: "",
    startDate: "",
    endDate: "",
  });

  const [previewDateRange, setPreviewDateRange] = useState({
    from: "",
    to: "",
  });

  const [previewRows, setPreviewRows] = useState([]);
  const [selectedPreviewIds, setSelectedPreviewIds] = useState({});

  const [previewStats, setPreviewStats] = useState({
    totalScanned: 0,
    submittedFound: 0,
    draftExcluded: 0,
    noDateExcluded: 0,
    outsideDateExcluded: 0,
    withinRange: 0,
    alreadyInBatch: 0,
  });

  const [previewSearch, setPreviewSearch] = useState("");
  const [batchSearch, setBatchSearch] = useState("");

  const [loadingPreview, setLoadingPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const assignedApplicationIds = useMemo(() => {
    const set = new Set();
    batchApplications.forEach((item) => {
      if (item?.applicationId) set.add(String(item.applicationId));
    });
    return set;
  }, [batchApplications]);

  const selectedPreviewCount = useMemo(
    () => Object.values(selectedPreviewIds).filter(Boolean).length,
    [selectedPreviewIds]
  );

  const filteredPreviewRows = useMemo(() => {
    const q = previewSearch.trim().toLowerCase();
    if (!q) return previewRows;

    return previewRows.filter((item) =>
      [
        item.applicationId,
        item.startupName,
        item.founderName,
        item.email,
        item.phone,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [previewRows, previewSearch]);

  const filteredBatchApplications = useMemo(() => {
    const q = batchSearch.trim().toLowerCase();
    if (!q) return batchApplications;

    return batchApplications.filter((item) =>
      [
        item.applicationId,
        item.startupName,
        item.founderName,
        item.email,
        item.phone,
        item.aiShortlisting?.status,
        item.expertShortlisting?.status,
        item.written?.status,
        item.finalDecision?.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [batchApplications, batchSearch]);

  const previewPager = usePagination(filteredPreviewRows, 15);
  const batchPager = usePagination(filteredBatchApplications, 15);

  const allPreviewSelected =
    filteredPreviewRows.length > 0 &&
    filteredPreviewRows.every(
      (row) => row.alreadyInBatch || selectedPreviewIds[row.applicationId]
    );

  const createBatch = async () => {
    const batchId = batchForm.batchId.trim();
    const batchName = batchForm.batchName.trim() || batchId;

    if (!batchId || !batchForm.startDate || !batchForm.endDate) {
      alert("Enter batch ID, start date and end date.");
      return;
    }

    try {
      setSaving(true);

      await setDoc(
        doc(db, BATCH_COLLECTION, batchId),
        {
          batchId,
          batchName,
          startDate: batchForm.startDate,
          endDate: batchForm.endDate,
          status: "active",
          publish: EMPTY_PUBLISH_STATE,
          counts: EMPTY_COUNTS,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: "admin",
        },
        { merge: true }
      );

      setBatchForm({
        batchId: "",
        batchName: "",
        startDate: "",
        endDate: "",
      });

      setSelectedBatchId(batchId);

      await reloadBatches();
      await reloadSelectedBatch(batchId);

      alert(`Batch ${batchId} created.`);
    } catch (error) {
      console.error("Create batch failed", error);
      alert("Failed to create batch.");
    } finally {
      setSaving(false);
    }
  };

  const resetPreviewSelection = (rows) => {
    const next = {};
    rows.forEach((row) => {
      next[row.applicationId] = !row.alreadyInBatch;
    });
    setSelectedPreviewIds(next);
  };

  const previewApplications = async () => {
    const fromDate = previewDateRange.from || selectedBatch?.startDate;
    const toDateValue = previewDateRange.to || selectedBatch?.endDate;

    if (!selectedBatchId || !selectedBatch) {
      alert("Select or create a batch first.");
      return;
    }

    if (!fromDate || !toDateValue) {
      alert("Select submitted from and submitted to date.");
      return;
    }

    try {
      setLoadingPreview(true);

      const start = new Date(`${fromDate}T00:00:00`);
      const end = new Date(`${toDateValue}T23:59:59`);

      const appSnap = await getDocs(
        query(collection(db, APP_COLLECTION), orderBy("createdAt", "desc"))
      );

      let totalScanned = 0;
      let submittedFound = 0;
      let draftExcluded = 0;
      let noDateExcluded = 0;
      let outsideDateExcluded = 0;
      let alreadyInBatch = 0;

      const rawRows = [];

      appSnap.docs.forEach((docItem) => {
        totalScanned += 1;

        const data = docItem.data();
        const finalSubmitted = isFinalSubmittedStatus(data);

        if (!finalSubmitted) {
          draftExcluded += 1;
          return;
        }

        submittedFound += 1;

        const effectiveSubmittedDateRaw = getEffectiveSubmittedDate(data);
        const effectiveSubmittedDate = toDate(effectiveSubmittedDateRaw);

        if (!effectiveSubmittedDate) {
          noDateExcluded += 1;
          return;
        }

        if (effectiveSubmittedDate < start || effectiveSubmittedDate > end) {
          outsideDateExcluded += 1;
          return;
        }

        const applicationId = getApplicationId(data, docItem.id);
        const alreadyAssigned = assignedApplicationIds.has(String(applicationId));

        if (alreadyAssigned) {
          alreadyInBatch += 1;
        }

        rawRows.push({
          id: docItem.id,
          ...data,
          applicationDocId: docItem.id,
          applicationId,
          startupName: getStartupName(data),
          founderName: getFounderName(data),
          email: getEmail(data),
          phone: getPhone(data),
          status: getStatus(data) || "submitted",
          submittedAt: effectiveSubmittedDateRaw,
          submittedAtDisplay: formatDate(effectiveSubmittedDateRaw),
          aiScore: getAIScore(data),
          expertScore: null,
          alreadyInBatch: alreadyAssigned,
        });
      });

      const enrichedRows = await Promise.all(
        rawRows.map(async (item) => {
          const expertReview = await readExpertReviewForApplication({
            db,
            applicationDocId: item.applicationDocId,
          });

          return {
            ...item,
            _expertReview: expertReview,
            expertScore: getExpertScore({
              ...item,
              _expertReview: expertReview,
            }),
          };
        })
      );

      setPreviewRows(enrichedRows);

      setPreviewStats({
        totalScanned,
        submittedFound,
        draftExcluded,
        noDateExcluded,
        outsideDateExcluded,
        withinRange: enrichedRows.length,
        alreadyInBatch,
      });

      resetPreviewSelection(enrichedRows);
      previewPager.setPage(1);
    } catch (error) {
      console.error("Preview submitted applications failed", error);
      alert("Failed to preview submitted applications.");
    } finally {
      setLoadingPreview(false);
    }
  };

  const assignSelectedToBatch = async () => {
    if (!selectedBatchId || !selectedBatch) {
      alert("Select a batch first.");
      return;
    }

    const rows = previewRows.filter(
      (row) => selectedPreviewIds[row.applicationId] && !row.alreadyInBatch
    );

    if (!rows.length) {
      alert("No new applications selected for assignment.");
      return;
    }

    try {
      setSaving(true);

      const nowValue = serverTimestamp();

      for (let index = 0; index < rows.length; index += 250) {
        const chunk = rows.slice(index, index + 250);
        const batch = writeBatch(db);

        chunk.forEach((item) => {
          const batchAppRef = doc(
            db,
            BATCH_COLLECTION,
            selectedBatchId,
            "applications",
            item.applicationId
          );

          const payload = buildBatchApplicationPayload({
            item,
            selectedBatchId,
            selectedBatch,
            serverTimestampValue: nowValue,
          });

          batch.set(batchAppRef, payload, { merge: true });

          batch.set(
            doc(db, APP_COLLECTION, item.applicationDocId),
            {
              shortlistingBatch: {
                batchId: selectedBatchId,
                batchName: selectedBatch.batchName || selectedBatchId,
                assignedAt: nowValue,
              },
              firestoreUpdatedAt: nowValue,
            },
            { merge: true }
          );
        });

        await batch.commit();
      }

      const updatedSnap = await getDocs(
        collection(db, BATCH_COLLECTION, selectedBatchId, "applications")
      );

      const updatedRows = updatedSnap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      const counts = calculateBatchCounts(updatedRows);

      await updateDoc(doc(db, BATCH_COLLECTION, selectedBatchId), {
        counts,
        totalApplications: counts.assigned,
        updatedAt: serverTimestamp(),
      });

      setBatchApplications(updatedRows);

      await Promise.all([
        reloadBatchApplications(selectedBatchId),
        reloadSelectedBatch(selectedBatchId),
        reloadBatches(),
      ]);

      setPreviewRows((prev) =>
        prev.map((row) =>
          rows.some((assigned) => assigned.applicationId === row.applicationId)
            ? { ...row, alreadyInBatch: true }
            : row
        )
      );

      alert(`${rows.length} applications assigned to ${selectedBatchId}.`);
    } catch (error) {
      console.error("Assign selected applications failed", error);
      alert("Failed to assign selected applications.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <div className="space-y-5">
          <SectionCard
            title="Create Batch"
            subtitle="Example: April2026 or Dec2025."
            icon={Plus}
          >
            <div className="space-y-3">
              <Field label="Batch ID">
                <input
                  value={batchForm.batchId}
                  onChange={(event) =>
                    setBatchForm((prev) => ({
                      ...prev,
                      batchId: event.target.value,
                    }))
                  }
                  placeholder="April2026"
                  className={inputClass}
                />
              </Field>

              <Field label="Batch Name">
                <input
                  value={batchForm.batchName}
                  onChange={(event) =>
                    setBatchForm((prev) => ({
                      ...prev,
                      batchName: event.target.value,
                    }))
                  }
                  placeholder="April 2026"
                  className={inputClass}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Start Date">
                  <input
                    type="date"
                    value={batchForm.startDate}
                    onChange={(event) =>
                      setBatchForm((prev) => ({
                        ...prev,
                        startDate: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="End Date">
                  <input
                    type="date"
                    value={batchForm.endDate}
                    onChange={(event) =>
                      setBatchForm((prev) => ({
                        ...prev,
                        endDate: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <button
                onClick={createBatch}
                disabled={saving}
                className={`${buttonBase} w-full bg-slate-900 text-white hover:bg-slate-800`}
              >
                <Save size={16} />
                Save Batch
              </button>
            </div>
          </SectionCard>

          <SectionCard
            title="Active Batch"
            subtitle="Assignment will happen only in this batch."
            icon={CalendarDays}
          >
            <select
              value={selectedBatchId}
              onChange={(event) => setSelectedBatchId(event.target.value)}
              className={inputClass}
            >
              <option value="">Select batch</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.batchName || batch.batchId || batch.id}
                </option>
              ))}
            </select>

            {selectedBatch ? (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">
                  {selectedBatch.batchName || selectedBatch.id}
                </div>
                <div className="mt-1">
                  {safe(selectedBatch.startDate)} to{" "}
                  {safe(selectedBatch.endDate)}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Assigned: {selectedBatch?.counts?.assigned || 0}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Select a batch to preview and assign applications.
              </div>
            )}
          </SectionCard>
        </div>

        <SectionCard
          title="Preview Submitted Applications"
          subtitle="Only submitted applications are included. Drafts are excluded."
          icon={Eye}
        >
          <div className="grid gap-3 md:grid-cols-4">
            <Field label="Submitted From">
              <input
                type="date"
                value={previewDateRange.from}
                onChange={(event) =>
                  setPreviewDateRange((prev) => ({
                    ...prev,
                    from: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>

            <Field label="Submitted To">
              <input
                type="date"
                value={previewDateRange.to}
                onChange={(event) =>
                  setPreviewDateRange((prev) => ({
                    ...prev,
                    to: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() =>
                  setPreviewDateRange({
                    from: selectedBatch?.startDate || "",
                    to: selectedBatch?.endDate || "",
                  })
                }
                disabled={!selectedBatch}
                className={`${buttonBase} w-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
              >
                Use Batch Dates
              </button>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={previewApplications}
                disabled={!selectedBatchId || loadingPreview}
                className={`${buttonBase} w-full bg-sky-600 text-white hover:bg-sky-700`}
              >
                <Eye size={16} />
                {loadingPreview ? "Scanning..." : "Preview"}
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            <MiniCount label="Scanned" value={previewStats.totalScanned} />
            <MiniCount
              label="Submitted"
              value={previewStats.submittedFound}
              tone="emerald"
            />
            <MiniCount
              label="Draft Excluded"
              value={previewStats.draftExcluded}
              tone="rose"
            />
            <MiniCount
              label="No Date"
              value={previewStats.noDateExcluded}
              tone="amber"
            />
            <MiniCount
              label="Outside Date"
              value={previewStats.outsideDateExcluded}
            />
            <MiniCount
              label="Within Range"
              value={previewStats.withinRange}
              tone="sky"
            />
            <MiniCount
              label="Already Added"
              value={previewStats.alreadyInBatch}
              tone="violet"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              onClick={assignSelectedToBatch}
              disabled={!selectedPreviewCount || saving}
              className={`${buttonBase} bg-violet-600 text-white hover:bg-violet-700`}
            >
              <UploadCloud size={16} />
              Assign Selected ({selectedPreviewCount})
            </button>

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Preview Rows: {previewRows.length}
            </span>

            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              New Selected:{" "}
              {
                previewRows.filter(
                  (row) =>
                    selectedPreviewIds[row.applicationId] && !row.alreadyInBatch
                ).length
              }
            </span>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Preview List"
        subtitle="15 applications per page. Already added applications cannot be assigned again."
        icon={FileText}
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <SearchBox
            value={previewSearch}
            onChange={(value) => {
              setPreviewSearch(value);
              previewPager.setPage(1);
            }}
            placeholder="Search preview applications..."
          />

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
            Selected: {selectedPreviewCount}
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-[1050px] w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allPreviewSelected}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      const next = { ...selectedPreviewIds };

                      filteredPreviewRows.forEach((row) => {
                        next[row.applicationId] = row.alreadyInBatch
                          ? false
                          : checked;
                      });

                      setSelectedPreviewIds(next);
                    }}
                  />
                </th>
                <th className="px-4 py-3">Application</th>
                <th className="px-4 py-3">Startup</th>
                <th className="px-4 py-3">Founder</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">AI</th>
                <th className="px-4 py-3">Expert</th>
                <th className="px-4 py-3">Batch</th>
              </tr>
            </thead>

            <tbody>
              {loadingPreview ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    Scanning submitted applications...
                  </td>
                </tr>
              ) : previewPager.pagedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    No preview generated yet.
                  </td>
                </tr>
              ) : (
                previewPager.pagedRows.map((item) => (
                  <tr
                    key={item.applicationId}
                    className={`border-t border-slate-100 ${
                      item.alreadyInBatch ? "bg-slate-50/70" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        disabled={item.alreadyInBatch}
                        checked={!!selectedPreviewIds[item.applicationId]}
                        onChange={(event) =>
                          setSelectedPreviewIds((prev) => ({
                            ...prev,
                            [item.applicationId]: event.target.checked,
                          }))
                        }
                      />
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {safe(item.applicationId)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">
                        {safe(item.startupName)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {safe(item.email)}
                      </div>
                    </td>

                    <td className="px-4 py-3">{safe(item.founderName)}</td>

                    <td className="px-4 py-3">
                      <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                        {safe(item.status)}
                      </span>
                    </td>

                    <td className="px-4 py-3">{safe(item.submittedAtDisplay)}</td>

                    <td className="px-4 py-3">
                      <ScoreBadge value={item.aiScore} />
                    </td>

                    <td className="px-4 py-3">
                      <ScoreBadge value={item.expertScore} />
                    </td>

                    <td className="px-4 py-3">
                      {item.alreadyInBatch ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 size={12} />
                          Added
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          <XCircle size={12} />
                          New
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <PaginationBar
            page={previewPager.page}
            setPage={previewPager.setPage}
            pageSize={previewPager.pageSize}
            total={previewPager.total}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Batch Applicants"
        subtitle="Applications already assigned to the active batch. 15 applications per page."
        icon={Users}
      >
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <SearchBox
            value={batchSearch}
            onChange={(value) => {
              setBatchSearch(value);
              batchPager.setPage(1);
            }}
            placeholder="Search batch applicants..."
          />

          <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
            Total in batch: {batchApplications.length}
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-[1250px] w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Application</th>
                <th className="px-4 py-3">Startup</th>
                <th className="px-4 py-3">Founder</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">AI</th>
                <th className="px-4 py-3">Expert</th>
                <th className="px-4 py-3">Written</th>
                <th className="px-4 py-3">PI</th>
                <th className="px-4 py-3">Slots</th>
                <th className="px-4 py-3">Final</th>
              </tr>
            </thead>

            <tbody>
              {batchPager.pagedRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    No applications assigned to this batch.
                  </td>
                </tr>
              ) : (
                batchPager.pagedRows.map((item) => (
                  <tr key={item.applicationId} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {safe(item.applicationId)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">
                        {safe(item.startupName)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {safe(item.email)}
                      </div>
                    </td>

                    <td className="px-4 py-3">{safe(item.founderName)}</td>

                    <td className="px-4 py-3">{formatDate(item.submittedAt)}</td>

                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <ScoreBadge value={item.aiScore} />
                        <StatusBadge value={item.aiShortlisting?.status} />
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <ScoreBadge value={item.expertScore} />
                        <StatusBadge value={item.expertShortlisting?.status} />
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge value={item.written?.status} />
                    </td>

                    <td className="px-4 py-3">
                      {item.pi?.selected === true ? (
                        <StatusBadge value="selected" />
                      ) : item.pi?.selected === false ? (
                        <StatusBadge value="not_selected" />
                      ) : (
                        <StatusBadge value="pending" />
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="space-y-3">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Written
                          </div>
                          <SlotText slot={item.writtenSlot} />
                        </div>

                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            PI
                          </div>
                          <SlotText slot={item.piSlot} />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge value={item.finalDecision?.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <PaginationBar
            page={batchPager.page}
            setPage={batchPager.setPage}
            pageSize={batchPager.pageSize}
            total={batchPager.total}
          />
        </div>
      </SectionCard>
    </div>
  );
}