import React, { useEffect, useMemo, useState } from "react";
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
  ClipboardList,
  Clock3,
  Plus,
  Search,
  Send,
  Users,
} from "lucide-react";

import {
  BATCH_COLLECTION,
  DEFAULT_PI_INSTRUCTION,
  DEFAULT_WRITTEN_INSTRUCTION,
  SHORTLIST_STATUS,
  buildPiSlotAssignmentPayload,
  buildWrittenSlotAssignmentPayload,
  calculateBatchCounts,
  formatSlotDateTime,
  safe,
} from "./shortlistingUtils";

import {
  SectionCard,
  Field,
  StatusBadge,
  SlotText,
  SearchBox,
  PaginationBar,
  usePagination,
  MiniCount,
  inputClass,
  buttonBase,
} from "./ShortlistingUI";

const emptyWrittenSlot = {
  slotId: "",
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  mode: "Online",
  venue: "",
  instruction: "",
};

const emptyPiSlot = {
  slotId: "",
  title: "",
  date: "",
  startTime: "",
  endTime: "",
  mode: "Online",
  venue: "",
  instruction: "",
};

export default function SlotManager({
  db,
  selectedBatchId,
  selectedBatch,
  batchApplications,
  setBatchApplications,
  reloadSelectedBatch,
  reloadBatchApplications,
  reloadBatches,
}) {
  const [activeSlotTab, setActiveSlotTab] = useState("written");

  const [writtenSlots, setWrittenSlots] = useState([]);
  const [piSlots, setPiSlots] = useState([]);

  const [writtenSlotForm, setWrittenSlotForm] = useState(emptyWrittenSlot);
  const [piSlotForm, setPiSlotForm] = useState(emptyPiSlot);

  const [selectedWrittenSlotId, setSelectedWrittenSlotId] = useState("");
  const [selectedPiSlotId, setSelectedPiSlotId] = useState("");

  const [writtenSearch, setWrittenSearch] = useState("");
  const [piSearch, setPiSearch] = useState("");

  const [selectedWrittenApplicantIds, setSelectedWrittenApplicantIds] = useState({});
  const [selectedPiApplicantIds, setSelectedPiApplicantIds] = useState({});

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);

  const batchLabel =
    selectedBatch?.batchName || selectedBatch?.batchId || selectedBatchId || "-";

  const writtenEligibleRows = useMemo(() => {
    const q = writtenSearch.trim().toLowerCase();

    const rows = batchApplications.filter(
      (item) => item?.expertShortlisting?.status === SHORTLIST_STATUS.SHORTLISTED
    );

    if (!q) return rows;

    return rows.filter((item) =>
      [
        item.applicationId,
        item.startupName,
        item.founderName,
        item.email,
        item.phone,
        item.writtenSlot?.title,
        item.writtenSlot?.date,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [batchApplications, writtenSearch]);

  const piEligibleRows = useMemo(() => {
    const q = piSearch.trim().toLowerCase();

    const rows = batchApplications.filter(
      (item) => item?.written?.status === SHORTLIST_STATUS.QUALIFIED
    );

    if (!q) return rows;

    return rows.filter((item) =>
      [
        item.applicationId,
        item.startupName,
        item.founderName,
        item.email,
        item.phone,
        item.piSlot?.title,
        item.piSlot?.date,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [batchApplications, piSearch]);

  const writtenPager = usePagination(writtenEligibleRows, 15);
  const piPager = usePagination(piEligibleRows, 15);

  const selectedWrittenCount = useMemo(
    () => Object.values(selectedWrittenApplicantIds).filter(Boolean).length,
    [selectedWrittenApplicantIds]
  );

  const selectedPiCount = useMemo(
    () => Object.values(selectedPiApplicantIds).filter(Boolean).length,
    [selectedPiApplicantIds]
  );

  const allWrittenSelected =
    writtenEligibleRows.length > 0 &&
    writtenEligibleRows.every(
      (item) => selectedWrittenApplicantIds[item.applicationId]
    );

  const allPiSelected =
    piEligibleRows.length > 0 &&
    piEligibleRows.every((item) => selectedPiApplicantIds[item.applicationId]);

  const selectedWrittenSlot = useMemo(
    () => writtenSlots.find((slot) => slot.id === selectedWrittenSlotId),
    [writtenSlots, selectedWrittenSlotId]
  );

  const selectedPiSlot = useMemo(
    () => piSlots.find((slot) => slot.id === selectedPiSlotId),
    [piSlots, selectedPiSlotId]
  );

  const writtenStats = useMemo(() => {
    return {
      eligible: writtenEligibleRows.length,
      slotAssigned: writtenEligibleRows.filter((item) => item?.writtenSlot?.slotId).length,
      notAssigned: writtenEligibleRows.filter((item) => !item?.writtenSlot?.slotId).length,
    };
  }, [writtenEligibleRows]);

  const piStats = useMemo(() => {
    return {
      eligible: piEligibleRows.length,
      slotAssigned: piEligibleRows.filter((item) => item?.piSlot?.slotId).length,
      notAssigned: piEligibleRows.filter((item) => !item?.piSlot?.slotId).length,
    };
  }, [piEligibleRows]);

  const loadSlots = async () => {
    if (!selectedBatchId) {
      setWrittenSlots([]);
      setPiSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);

      const writtenSnap = await getDocs(
        query(
          collection(db, BATCH_COLLECTION, selectedBatchId, "writtenSlots"),
          orderBy("date", "asc")
        )
      );

      const piSnap = await getDocs(
        query(
          collection(db, BATCH_COLLECTION, selectedBatchId, "piSlots"),
          orderBy("date", "asc")
        )
      );

      setWrittenSlots(
        writtenSnap.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );

      setPiSlots(
        piSnap.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    } catch (error) {
      console.error("Failed to load slots", error);
      alert("Failed to load written/PI slots.");
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, [selectedBatchId]);

  const ensureBatchSelected = () => {
    if (!selectedBatchId || !selectedBatch) {
      alert("Select a batch first.");
      return false;
    }

    return true;
  };

  const createWrittenSlot = async () => {
    if (!ensureBatchSelected()) return;

    if (
      !writtenSlotForm.date ||
      !writtenSlotForm.startTime ||
      !writtenSlotForm.endTime
    ) {
      alert("Enter written test date, start time and end time.");
      return;
    }

    const slotId =
      writtenSlotForm.slotId.trim() || `WRITTEN_${selectedBatchId}_${Date.now()}`;

    try {
      setSaving(true);

      await setDoc(
        doc(db, BATCH_COLLECTION, selectedBatchId, "writtenSlots", slotId),
        {
          slotId,
          title: writtenSlotForm.title || `Written Test - ${slotId}`,
          date: writtenSlotForm.date,
          startTime: writtenSlotForm.startTime,
          endTime: writtenSlotForm.endTime,
          mode: writtenSlotForm.mode || "Online",
          venue: writtenSlotForm.venue || "",
          instruction: writtenSlotForm.instruction || DEFAULT_WRITTEN_INSTRUCTION,
          assignedCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setWrittenSlotForm(emptyWrittenSlot);
      await loadSlots();

      alert("Written test slot created.");
    } catch (error) {
      console.error("Create written slot failed", error);
      alert("Failed to create written slot.");
    } finally {
      setSaving(false);
    }
  };

  const createPiSlot = async () => {
    if (!ensureBatchSelected()) return;

    if (!piSlotForm.date || !piSlotForm.startTime || !piSlotForm.endTime) {
      alert("Enter PI date, start time and end time.");
      return;
    }

    const slotId =
      piSlotForm.slotId.trim() || `PI_${selectedBatchId}_${Date.now()}`;

    try {
      setSaving(true);

      await setDoc(
        doc(db, BATCH_COLLECTION, selectedBatchId, "piSlots", slotId),
        {
          slotId,
          title: piSlotForm.title || `PI Slot - ${slotId}`,
          date: piSlotForm.date,
          startTime: piSlotForm.startTime,
          endTime: piSlotForm.endTime,
          mode: piSlotForm.mode || "Online",
          venue: piSlotForm.venue || "",
          instruction: piSlotForm.instruction || DEFAULT_PI_INSTRUCTION,
          assignedCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setPiSlotForm(emptyPiSlot);
      await loadSlots();

      alert("PI slot created.");
    } catch (error) {
      console.error("Create PI slot failed", error);
      alert("Failed to create PI slot.");
    } finally {
      setSaving(false);
    }
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

  const assignWrittenSlot = async () => {
    if (!ensureBatchSelected()) return;

    if (!selectedWrittenSlot) {
      alert("Select written slot.");
      return;
    }

    const selectedRows = writtenEligibleRows.filter(
      (item) => selectedWrittenApplicantIds[item.applicationId]
    );

    if (!selectedRows.length) {
      alert("Select expert-shortlisted applicants.");
      return;
    }

    const confirmMessage = [
      `Assign written slot for batch ${batchLabel}?`,
      "",
      `Slot: ${selectedWrittenSlot.title}`,
      `Date/Time: ${formatSlotDateTime(selectedWrittenSlot)}`,
      `Applicants selected: ${selectedRows.length}`,
    ].join("\n");

    if (!window.confirm(confirmMessage)) return;

    try {
      setSaving(true);

      const nowValue = serverTimestamp();

      const updatedRows = batchApplications.map((item) => {
        const selected = selectedRows.some(
          (row) => row.applicationId === item.applicationId
        );

        if (!selected) return item;

        const payload = buildWrittenSlotAssignmentPayload({
          slot: selectedWrittenSlot,
          serverTimestampValue: nowValue,
        });

        return {
          ...item,
          ...payload,
        };
      });

      for (let index = 0; index < selectedRows.length; index += 300) {
        const chunk = selectedRows.slice(index, index + 300);
        const batch = writeBatch(db);

        chunk.forEach((item) => {
          const payload = buildWrittenSlotAssignmentPayload({
            slot: selectedWrittenSlot,
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

      await setDoc(
        doc(
          db,
          BATCH_COLLECTION,
          selectedBatchId,
          "writtenSlots",
          selectedWrittenSlot.id
        ),
        {
          assignedCount: selectedRows.length,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setBatchApplications(updatedRows);
      await updateBatchCounts(updatedRows);

      await Promise.all([
        reloadSelectedBatch(selectedBatchId),
        reloadBatchApplications(selectedBatchId),
        reloadBatches(),
        loadSlots(),
      ]);

      setSelectedWrittenApplicantIds({});

      alert(`Written slot assigned to ${selectedRows.length} applicants.`);
    } catch (error) {
      console.error("Assign written slot failed", error);
      alert("Failed to assign written slot.");
    } finally {
      setSaving(false);
    }
  };

  const assignPiSlot = async () => {
    if (!ensureBatchSelected()) return;

    if (!selectedPiSlot) {
      alert("Select PI slot.");
      return;
    }

    const selectedRows = piEligibleRows.filter(
      (item) => selectedPiApplicantIds[item.applicationId]
    );

    if (!selectedRows.length) {
      alert("Select written-qualified applicants.");
      return;
    }

    const confirmMessage = [
      `Assign PI slot for batch ${batchLabel}?`,
      "",
      `Slot: ${selectedPiSlot.title}`,
      `Date/Time: ${formatSlotDateTime(selectedPiSlot)}`,
      `Applicants selected: ${selectedRows.length}`,
    ].join("\n");

    if (!window.confirm(confirmMessage)) return;

    try {
      setSaving(true);

      const nowValue = serverTimestamp();

      const updatedRows = batchApplications.map((item) => {
        const selected = selectedRows.some(
          (row) => row.applicationId === item.applicationId
        );

        if (!selected) return item;

        const payload = buildPiSlotAssignmentPayload({
          slot: selectedPiSlot,
          serverTimestampValue: nowValue,
        });

        return {
          ...item,
          ...payload,
        };
      });

      for (let index = 0; index < selectedRows.length; index += 300) {
        const chunk = selectedRows.slice(index, index + 300);
        const batch = writeBatch(db);

        chunk.forEach((item) => {
          const payload = buildPiSlotAssignmentPayload({
            slot: selectedPiSlot,
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

      await setDoc(
        doc(db, BATCH_COLLECTION, selectedBatchId, "piSlots", selectedPiSlot.id),
        {
          assignedCount: selectedRows.length,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setBatchApplications(updatedRows);
      await updateBatchCounts(updatedRows);

      await Promise.all([
        reloadSelectedBatch(selectedBatchId),
        reloadBatchApplications(selectedBatchId),
        reloadBatches(),
        loadSlots(),
      ]);

      setSelectedPiApplicantIds({});

      alert(`PI slot assigned to ${selectedRows.length} applicants.`);
    } catch (error) {
      console.error("Assign PI slot failed", error);
      alert("Failed to assign PI slot.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <SectionCard
        title="Slot Manager"
        subtitle={`Working batch: ${batchLabel}. Create written and PI slots, then assign eligible applicants.`}
        icon={CalendarClockIcon}
      >
        <div className="grid grid-cols-2 gap-2 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveSlotTab("written")}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              activeSlotTab === "written"
                ? "bg-slate-900 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Written Test Slot
          </button>

          <button
            type="button"
            onClick={() => setActiveSlotTab("pi")}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              activeSlotTab === "pi"
                ? "bg-slate-900 text-white"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            PI Slot
          </button>
        </div>
      </SectionCard>

      {activeSlotTab === "written" ? (
        <SlotStage
          title="Written Test Slot"
          subtitle="Create written test slots and assign expert-shortlisted applicants."
          icon={ClipboardList}
          form={writtenSlotForm}
          setForm={setWrittenSlotForm}
          onCreate={createWrittenSlot}
          createLabel="Create Written Slot"
          slots={writtenSlots}
          loadingSlots={loadingSlots}
          selectedSlotId={selectedWrittenSlotId}
          setSelectedSlotId={setSelectedWrittenSlotId}
          selectedSlot={selectedWrittenSlot}
          assignLabel={`Assign Written (${selectedWrittenCount})`}
          onAssign={assignWrittenSlot}
          assignDisabled={!selectedWrittenSlotId || !selectedWrittenCount || saving}
          rows={writtenPager.pagedRows}
          totalRows={writtenPager.total}
          pager={writtenPager}
          search={writtenSearch}
          setSearch={(value) => {
            setWrittenSearch(value);
            writtenPager.setPage(1);
          }}
          selectedMap={selectedWrittenApplicantIds}
          setSelectedMap={setSelectedWrittenApplicantIds}
          allSelected={allWrittenSelected}
          emptyText="No expert-shortlisted applicants found."
          statusColumnLabel="Expert Status"
          getStatus={(item) => item?.expertShortlisting?.status}
          getSlot={(item) => item?.writtenSlot}
          stats={[
            ["Eligible", writtenStats.eligible, "slate"],
            ["Slot Assigned", writtenStats.slotAssigned, "emerald"],
            ["Not Assigned", writtenStats.notAssigned, "amber"],
          ]}
        />
      ) : null}

      {activeSlotTab === "pi" ? (
        <SlotStage
          title="PI Slot"
          subtitle="Create PI slots and assign written-qualified applicants."
          icon={Clock3}
          form={piSlotForm}
          setForm={setPiSlotForm}
          onCreate={createPiSlot}
          createLabel="Create PI Slot"
          slots={piSlots}
          loadingSlots={loadingSlots}
          selectedSlotId={selectedPiSlotId}
          setSelectedSlotId={setSelectedPiSlotId}
          selectedSlot={selectedPiSlot}
          assignLabel={`Assign PI (${selectedPiCount})`}
          onAssign={assignPiSlot}
          assignDisabled={!selectedPiSlotId || !selectedPiCount || saving}
          rows={piPager.pagedRows}
          totalRows={piPager.total}
          pager={piPager}
          search={piSearch}
          setSearch={(value) => {
            setPiSearch(value);
            piPager.setPage(1);
          }}
          selectedMap={selectedPiApplicantIds}
          setSelectedMap={setSelectedPiApplicantIds}
          allSelected={allPiSelected}
          emptyText="No written-qualified applicants found."
          statusColumnLabel="Written Status"
          getStatus={(item) => item?.written?.status}
          getSlot={(item) => item?.piSlot}
          stats={[
            ["Eligible", piStats.eligible, "slate"],
            ["Slot Assigned", piStats.slotAssigned, "emerald"],
            ["Not Assigned", piStats.notAssigned, "amber"],
          ]}
        />
      ) : null}
    </div>
  );
}

function CalendarClockIcon(props) {
  return <Clock3 {...props} />;
}

function SlotStage({
  title,
  subtitle,
  icon,
  form,
  setForm,
  onCreate,
  createLabel,
  slots,
  loadingSlots,
  selectedSlotId,
  setSelectedSlotId,
  selectedSlot,
  assignLabel,
  onAssign,
  assignDisabled,
  rows,
  totalRows,
  pager,
  search,
  setSearch,
  selectedMap,
  setSelectedMap,
  allSelected,
  emptyText,
  statusColumnLabel,
  getStatus,
  getSlot,
  stats,
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <div className="space-y-5">
        <SectionCard title={title} subtitle={subtitle} icon={icon}>
          <SlotForm
            form={form}
            setForm={setForm}
            onCreate={onCreate}
            createLabel={createLabel}
          />
        </SectionCard>

        <SectionCard title="Existing Slots" subtitle="Created slots for this batch." icon={Clock3}>
          <SlotList slots={slots} loading={loadingSlots} />

          <div className="mt-4 space-y-3">
            <Field label="Select Slot for Assignment">
              <select
                value={selectedSlotId}
                onChange={(event) => setSelectedSlotId(event.target.value)}
                className={inputClass}
              >
                <option value="">Select slot</option>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.title} | {slot.date} {slot.startTime}-{slot.endTime}
                  </option>
                ))}
              </select>
            </Field>

            {selectedSlot ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
                <div className="font-semibold text-slate-900">
                  {selectedSlot.title}
                </div>
                <div className="mt-1 text-slate-500">
                  {formatSlotDateTime(selectedSlot)}
                </div>
                <div className="mt-1 text-slate-500">
                  {selectedSlot.mode || "-"}
                </div>
                {selectedSlot.venue ? (
                  <div className="mt-1 break-all text-slate-500">
                    {selectedSlot.venue}
                  </div>
                ) : null}
              </div>
            ) : null}

            <button
              type="button"
              onClick={onAssign}
              disabled={assignDisabled}
              className={`${buttonBase} w-full bg-slate-900 text-white hover:bg-slate-800`}
            >
              <Send size={16} />
              {assignLabel}
            </button>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Eligible Applicants"
        subtitle="Select applicants and assign the selected slot. 15 applications per page."
        icon={Users}
      >
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {stats.map(([label, value, tone]) => (
            <MiniCount key={label} label={label} value={value} tone={tone} />
          ))}
        </div>

        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search eligible applicants..."
          />

          <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
            Selected: {Object.values(selectedMap).filter(Boolean).length}
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-[950px] w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setSelectedMap((prev) => {
                        const next = { ...prev };
                        rows.forEach((item) => {
                          next[item.applicationId] = checked;
                        });
                        return next;
                      });
                    }}
                  />
                </th>
                <th className="px-4 py-3">Application</th>
                <th className="px-4 py-3">Startup</th>
                <th className="px-4 py-3">Founder</th>
                <th className="px-4 py-3">{statusColumnLabel}</th>
                <th className="px-4 py-3">Current Slot</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    {emptyText}
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item.applicationId} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={!!selectedMap[item.applicationId]}
                        onChange={(event) =>
                          setSelectedMap((prev) => ({
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
                      <StatusBadge value={getStatus(item)} />
                    </td>

                    <td className="px-4 py-3">
                      <SlotText slot={getSlot(item)} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <PaginationBar
            page={pager.page}
            setPage={pager.setPage}
            pageSize={pager.pageSize}
            total={totalRows}
          />
        </div>
      </SectionCard>
    </div>
  );
}

function SlotForm({ form, setForm, onCreate, createLabel }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <Field label="Slot ID">
        <input
          value={form.slotId}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              slotId: event.target.value,
            }))
          }
          placeholder="Optional"
          className={inputClass}
        />
      </Field>

      <Field label="Title">
        <input
          value={form.title}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              title: event.target.value,
            }))
          }
          placeholder="Slot title"
          className={inputClass}
        />
      </Field>

      <Field label="Date">
        <input
          type="date"
          value={form.date}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              date: event.target.value,
            }))
          }
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-2">
        <Field label="Start Time">
          <input
            type="time"
            value={form.startTime}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                startTime: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>

        <Field label="End Time">
          <input
            type="time"
            value={form.endTime}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                endTime: event.target.value,
              }))
            }
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Mode">
        <select
          value={form.mode}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              mode: event.target.value,
            }))
          }
          className={inputClass}
        >
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </Field>

      <Field label="Venue / Link">
        <input
          value={form.venue}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              venue: event.target.value,
            }))
          }
          placeholder="Venue or meeting link"
          className={inputClass}
        />
      </Field>

      <div className="md:col-span-2">
        <Field label="One-line instruction">
          <textarea
            rows={2}
            value={form.instruction}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                instruction: event.target.value,
              }))
            }
            placeholder="Instruction visible to applicant after schedule is published"
            className={inputClass}
          />
        </Field>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className={`${buttonBase} bg-slate-900 text-white hover:bg-slate-800 md:col-span-2`}
      >
        <Plus size={16} />
        {createLabel}
      </button>
    </div>
  );
}

function SlotList({ slots, loading }) {
  if (loading) {
    return <div className="text-sm text-slate-500">Loading slots...</div>;
  }

  if (!slots.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        No slots created yet.
      </div>
    );
  }

  return (
    <div className="max-h-[340px] space-y-3 overflow-auto pr-1">
      {slots.map((slot) => (
        <div
          key={slot.id}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
        >
          <div className="font-semibold text-slate-900">{slot.title}</div>
          <div className="mt-1 text-xs text-slate-500">
            {formatSlotDateTime(slot)}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 font-semibold text-slate-600">
              {slot.mode || "-"}
            </span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
              Assigned: {slot.assignedCount || 0}
            </span>
          </div>
          {slot.venue ? (
            <div className="mt-2 break-all text-xs text-slate-500">
              {slot.venue}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}