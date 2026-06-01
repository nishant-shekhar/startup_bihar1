import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import {
  RefreshCw,
  Plus,
  Search,
  Eye,
  UploadCloud,
  Save,
  Download,
  CalendarDays,
  Bot,
  Star,
  Users,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Settings2,
  Send,
} from "lucide-react";

import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";

const BATCH_COLLECTION = "startupShortlistingBatches";
const APP_COLLECTION = "startupApplications";

const DEFAULT_WRITTEN_INSTRUCTION =
  "Please be available before the scheduled time and follow the instructions shared by Startup Bihar.";

const DEFAULT_PI_INSTRUCTION =
  "Please keep your pitch deck and relevant documents ready before the scheduled interaction.";

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const toDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (value?.seconds) return new Date(value.seconds * 1000);

  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDate = (value) => {
  const d = toDate(value);
  if (!d) return "-";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  const d = toDate(value);
  if (!d) return "-";

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getApplicationId = (item, docId) =>
  item?.applicationId ||
  item?.applicationNo ||
  item?.registrationNumber ||
  item?.registration_no ||
  docId;

const getStartupName = (item) =>
  item?.userSignup?.startupName ||
  item?.startupName ||
  item?.startup_name ||
  item?.company_name ||
  item?.companyName ||
  "-";

const getFounderName = (item) =>
  item?.userSignup?.founderName ||
  item?.basicDetails?.fullName ||
  item?.founderName ||
  item?.founder_name ||
  item?.name ||
  "-";

const getEmail = (item) =>
  item?.userSignup?.email || item?.email || item?.basicDetails?.email || "-";

const getPhone = (item) =>
  item?.userSignup?.phoneNumber || item?.phoneNumber || item?.mobile || "-";

const getStatus = (item) =>
  item?.status ||
  item?.applicationStatus ||
  item?.reviewStatus ||
  item?.documentStatus ||
  "";

const isSubmittedApplication = (item) => {
  const status = String(getStatus(item) || "").trim().toLowerCase();

  if (status === "draft") return false;
  if (!item?.submittedAt) return false;

  return true;
};

const getSubmittedAt = (item) => item?.submittedAt || null;

const getAIScore = (item) => {
  const score =
    item?.aiEvaluation?.finalScore ??
    item?.Evaluation?.AI?.finalScore ??
    item?.aiScore ??
    null;

  if (score === null || score === undefined || score === "") return null;

  const n = Number(score);
  return Number.isFinite(n) ? n : null;
};

const getExpertReview = (item) =>
  item?._expertReview || item?.review?.expert || null;

const getExpertScore = (item) => {
  const review = getExpertReview(item);

  const score =
    item?.expertScore ??
    review?.score ??
    review?.finalScore ??
    review?.initialScore ??
    review?.firstScore ??
    null;

  if (score === null || score === undefined || score === "") return null;

  const n = Number(score);
  return Number.isFinite(n) ? n : null;
};

const scoreText = (score) => {
  if (score === null || score === undefined || score === "") return "—";
  const n = Number(score);
  return Number.isFinite(n) ? `${n.toFixed(1)}/10` : "—";
};

const statusLabel = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  not_shortlisted: "Not Shortlisted",
  qualified: "Qualified",
  not_qualified: "Not Qualified",
  selected: "Selected",
  not_selected: "Not Selected",
  recognised: "Recognised",
  not_recognised: "Not Recognised",
  hold: "Hold",
};

const statusTone = {
  pending: "border-slate-200 bg-slate-100 text-slate-700",
  shortlisted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  qualified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  selected: "border-emerald-200 bg-emerald-50 text-emerald-700",
  recognised: "border-emerald-200 bg-emerald-50 text-emerald-700",
  not_shortlisted: "border-rose-200 bg-rose-50 text-rose-700",
  not_qualified: "border-rose-200 bg-rose-50 text-rose-700",
  not_selected: "border-rose-200 bg-rose-50 text-rose-700",
  not_recognised: "border-rose-200 bg-rose-50 text-rose-700",
  hold: "border-amber-200 bg-amber-50 text-amber-700",
};

function StatusChip({ value }) {
  const status = value || "pending";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        statusTone[status] || statusTone.pending
      }`}
    >
      {statusLabel[status] || safe(status)}
    </span>
  );
}

function ScoreChip({ value }) {
  const n = Number(value);

  const tone =
    Number.isFinite(n) && n >= 8
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : Number.isFinite(n) && n >= 6
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-slate-200 bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex min-w-[78px] justify-center rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}
    >
      {scoreText(value)}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, tone = "slate" }) {
  const tones = {
    slate: "border-slate-200 bg-white text-slate-900",
    blue: "border-sky-200 bg-sky-50 text-sky-900",
    violet: "border-violet-200 bg-violet-50 text-violet-900",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
  };

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${tones[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
            {label}
          </div>
          <div className="mt-2 text-2xl font-bold">{value}</div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/75 shadow-sm">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, icon: Icon }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-4 flex items-start gap-3">
        {Icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Icon size={18} />
          </div>
        ) : null}

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

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

export default function Shortlist() {
  const [activeTab, setActiveTab] = useState("batch");

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);

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

  const [batchApps, setBatchApps] = useState([]);
  const [selectedBatchAppIds, setSelectedBatchAppIds] = useState({});

  const [search, setSearch] = useState("");

  const [aiCutoff, setAiCutoff] = useState("7.7");
  const [expertCutoff, setExpertCutoff] = useState("7.5");

  const [writtenSlots, setWrittenSlots] = useState([]);
  const [piSlots, setPiSlots] = useState([]);

  const [writtenSlotForm, setWrittenSlotForm] = useState({
    slotId: "",
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    mode: "Online",
    venue: "",
    instruction: "",
  });

  const [piSlotForm, setPiSlotForm] = useState({
    slotId: "",
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    mode: "Online",
    venue: "",
    instruction: "",
  });

  const [selectedWrittenSlotId, setSelectedWrittenSlotId] = useState("");
  const [selectedPiSlotId, setSelectedPiSlotId] = useState("");

  const [loadingBatches, setLoadingBatches] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingBatchApps, setLoadingBatchApps] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedPreviewCount = useMemo(
    () => Object.values(selectedPreviewIds).filter(Boolean).length,
    [selectedPreviewIds]
  );

  const selectedBatchAppCount = useMemo(
    () => Object.values(selectedBatchAppIds).filter(Boolean).length,
    [selectedBatchAppIds]
  );

  const stats = useMemo(() => {
    return {
      total: batchApps.length,
      ai: batchApps.filter((x) => x?.aiShortlisting?.status === "shortlisted")
        .length,
      expert: batchApps.filter(
        (x) => x?.expertShortlisting?.status === "shortlisted"
      ).length,
      writtenSlot: batchApps.filter((x) => !!x?.writtenSlot?.slotId).length,
      writtenQualified: batchApps.filter(
        (x) => x?.written?.status === "qualified"
      ).length,
      piSlot: batchApps.filter((x) => !!x?.piSlot?.slotId).length,
      piSelected: batchApps.filter((x) => x?.pi?.selected === true).length,
      recognised: batchApps.filter(
        (x) => x?.finalDecision?.status === "recognised"
      ).length,
    };
  }, [batchApps]);

  const filteredBatchApps = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return batchApps;

    return batchApps.filter((item) =>
      [
        item.applicationId,
        item.startupName,
        item.founderName,
        item.email,
        item.phone,
        item.aiShortlisting?.status,
        item.expertShortlisting?.status,
        item.written?.status,
        item.writtenSlot?.title,
        item.piSlot?.title,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [batchApps, search]);

  const allPreviewSelected =
    previewRows.length > 0 && selectedPreviewCount === previewRows.length;

  const allFilteredBatchSelected =
    filteredBatchApps.length > 0 &&
    filteredBatchApps.every((row) => selectedBatchAppIds[row.applicationId]);

  const loadBatches = async () => {
    try {
      setLoadingBatches(true);

      const snap = await getDocs(
        query(collection(db, BATCH_COLLECTION), orderBy("createdAt", "desc"))
      );

      const rows = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setBatches(rows);

      if (!selectedBatchId && rows.length) {
        setSelectedBatchId(rows[0].id);
      }
    } catch (error) {
      console.error("Failed to load batches", error);
      alert("Failed to load batches.");
    } finally {
      setLoadingBatches(false);
    }
  };

  const loadSelectedBatch = async (batchId) => {
    if (!batchId) {
      setSelectedBatch(null);
      return;
    }

    const snap = await getDoc(doc(db, BATCH_COLLECTION, batchId));
    setSelectedBatch(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  };

  const loadBatchApplications = async (batchId = selectedBatchId) => {
    if (!batchId) {
      setBatchApps([]);
      return;
    }

    try {
      setLoadingBatchApps(true);

      const snap = await getDocs(
        collection(db, BATCH_COLLECTION, batchId, "applications")
      );

      const rows = snap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        .sort((a, b) =>
          String(a.applicationId || "").localeCompare(
            String(b.applicationId || "")
          )
        );

      setBatchApps(rows);

      const selectedMap = {};
      rows.forEach((row) => {
        selectedMap[row.applicationId] = false;
      });
      setSelectedBatchAppIds(selectedMap);
    } catch (error) {
      console.error("Failed to load batch applications", error);
      alert("Failed to load batch applications.");
    } finally {
      setLoadingBatchApps(false);
    }
  };

  const loadSlots = async (batchId = selectedBatchId) => {
    if (!batchId) {
      setWrittenSlots([]);
      setPiSlots([]);
      return;
    }

    try {
      const writtenSnap = await getDocs(
        query(
          collection(db, BATCH_COLLECTION, batchId, "writtenSlots"),
          orderBy("date", "asc")
        )
      );

      const piSnap = await getDocs(
        query(
          collection(db, BATCH_COLLECTION, batchId, "piSlots"),
          orderBy("date", "asc")
        )
      );

      setWrittenSlots(
        writtenSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      setPiSlots(
        piSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } catch (error) {
      console.error("Failed to load slots", error);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  useEffect(() => {
    if (!selectedBatchId) return;

    loadSelectedBatch(selectedBatchId);
    loadBatchApplications(selectedBatchId);
    loadSlots(selectedBatchId);
  }, [selectedBatchId]);

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

          totalApplications: 0,
          aiShortlistedCount: 0,
          expertShortlistedCount: 0,
          writtenQualifiedCount: 0,
          piSelectedCount: 0,
          recognisedCount: 0,

          publish: {
            aiResult: false,
            expertResult: false,
            writtenSlot: false,
            writtenResult: false,
            piSlot: false,
            piResult: false,
            finalResult: false,
          },

          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: "admin",
        },
        { merge: true }
      );

      setSelectedBatchId(batchId);
      setBatchForm({
        batchId: "",
        batchName: "",
        startDate: "",
        endDate: "",
      });

      await loadBatches();
      alert("Batch created.");
    } catch (error) {
      console.error("Create batch failed", error);
      alert("Failed to create batch.");
    } finally {
      setSaving(false);
    }
  };

  const previewApplicationsByDate = async () => {
    const fromDate = previewDateRange.from || selectedBatch?.startDate;
    const toDate = previewDateRange.to || selectedBatch?.endDate;

    if (!fromDate || !toDate) {
      alert("Select submitted from and submitted to date.");
      return;
    }

    try {
      setLoadingPreview(true);

      const start = new Date(`${fromDate}T00:00:00`);
      const end = new Date(`${toDate}T23:59:59`);

      const appSnap = await getDocs(
        query(collection(db, APP_COLLECTION), orderBy("submittedAt", "desc"))
      );

      const submittedRows = appSnap.docs
        .map((docItem) => {
          const data = docItem.data();
          const submittedAt = getSubmittedAt(data);
          const submittedDate = toDate(submittedAt);

          return {
            id: docItem.id,
            ...data,
            _submittedDate: submittedDate,
            applicationDocId: docItem.id,
            applicationId: getApplicationId(data, docItem.id),
            startupName: getStartupName(data),
            founderName: getFounderName(data),
            email: getEmail(data),
            phone: getPhone(data),
            submittedAt,
            status: getStatus(data),
            aiScore: getAIScore(data),
          };
        })
        .filter((item) => {
          if (!isSubmittedApplication(item)) return false;
          if (!item._submittedDate) return false;
          return item._submittedDate >= start && item._submittedDate <= end;
        });

      const enrichedRows = await Promise.all(
        submittedRows.map(async (item) => {
          try {
            const expertSnap = await getDoc(
              doc(db, APP_COLLECTION, item.applicationDocId, "review", "expert")
            );

            const expertReview = expertSnap.exists() ? expertSnap.data() : null;

            return {
              ...item,
              _expertReview: expertReview,
              expertScore: getExpertScore({
                ...item,
                _expertReview: expertReview,
              }),
            };
          } catch {
            return {
              ...item,
              _expertReview: null,
              expertScore: null,
            };
          }
        })
      );

      setPreviewRows(enrichedRows);

      const map = {};
      enrichedRows.forEach((row) => {
        map[row.applicationId] = true;
      });
      setSelectedPreviewIds(map);
    } catch (error) {
      console.error("Preview applications failed", error);
      alert(
        "Failed to preview submitted applications. Check if submittedAt exists on submitted records."
      );
    } finally {
      setLoadingPreview(false);
    }
  };

  const assignSelectedToBatch = async () => {
    if (!selectedBatchId || !selectedBatch) {
      alert("Select a batch.");
      return;
    }

    const rows = previewRows.filter(
      (row) => selectedPreviewIds[row.applicationId]
    );

    if (!rows.length) {
      alert("Select applications to assign.");
      return;
    }

    try {
      setSaving(true);

      for (let i = 0; i < rows.length; i += 250) {
        const chunk = rows.slice(i, i + 250);
        const batch = writeBatch(db);

        chunk.forEach((item) => {
          const batchAppRef = doc(
            db,
            BATCH_COLLECTION,
            selectedBatchId,
            "applications",
            item.applicationId
          );

          batch.set(
            batchAppRef,
            {
              applicationId: item.applicationId,
              applicationDocId: item.applicationDocId,
              startupName: item.startupName,
              founderName: item.founderName,
              email: item.email,
              phone: item.phone,
              submittedAt: item.submittedAt || null,
              status: item.status || "submitted",

              aiScore: item.aiScore,
              expertScore: item.expertScore,

              aiShortlisting: {
                status: "pending",
                cutoffUsed: null,
                remarks: "",
                updatedAt: null,
              },

              expertShortlisting: {
                status: "pending",
                cutoffUsed: null,
                remarks: "",
                updatedAt: null,
              },

              written: {
                marks: null,
                maxMarks: 100,
                status: "pending",
                remarks: "",
                updatedAt: null,
              },

              pi: {
                selected: null,
                marks: null,
                remarks: "",
                updatedAt: null,
              },

              finalDecision: {
                status: "pending",
                remarks: "",
                updatedAt: null,
              },

              writtenSlot: null,
              piSlot: null,

              currentStage: "batch_assigned",

              publicStatus: {
                visibleStage: "applicationSubmitted",
                message:
                  "Your application has been received and will be evaluated as per the Startup Bihar review process.",
                updatedAt: serverTimestamp(),
              },

              batchId: selectedBatchId,
              batchName: selectedBatch.batchName || selectedBatchId,
              assignedAt: serverTimestamp(),
              lastUpdatedAt: serverTimestamp(),
            },
            { merge: true }
          );

          batch.set(
            doc(db, APP_COLLECTION, item.applicationDocId),
            {
              shortlistingBatch: {
                batchId: selectedBatchId,
                batchName: selectedBatch.batchName || selectedBatchId,
                assignedAt: serverTimestamp(),
              },
              firestoreUpdatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        });

        await batch.commit();
      }

      await updateDoc(doc(db, BATCH_COLLECTION, selectedBatchId), {
        totalApplications: rows.length,
        updatedAt: serverTimestamp(),
      });

      await loadBatchApplications(selectedBatchId);
      await loadSelectedBatch(selectedBatchId);

      alert(`${rows.length} submitted applications assigned to ${selectedBatchId}.`);
    } catch (error) {
      console.error("Assign to batch failed", error);
      alert("Failed to assign applications to batch.");
    } finally {
      setSaving(false);
    }
  };

  const updateCounts = async (rows) => {
    await updateDoc(doc(db, BATCH_COLLECTION, selectedBatchId), {
      totalApplications: rows.length,
      aiShortlistedCount: rows.filter(
        (x) => x?.aiShortlisting?.status === "shortlisted"
      ).length,
      expertShortlistedCount: rows.filter(
        (x) => x?.expertShortlisting?.status === "shortlisted"
      ).length,
      writtenQualifiedCount: rows.filter(
        (x) => x?.written?.status === "qualified"
      ).length,
      piSelectedCount: rows.filter((x) => x?.pi?.selected === true).length,
      recognisedCount: rows.filter(
        (x) => x?.finalDecision?.status === "recognised"
      ).length,
      updatedAt: serverTimestamp(),
    });
  };

  const applyAiShortlist = async () => {
    const cutoff = Number(aiCutoff);

    if (!selectedBatchId || !Number.isFinite(cutoff)) {
      alert("Enter valid AI cutoff.");
      return;
    }

    if (!batchApps.length) {
      alert("No applications in selected batch.");
      return;
    }

    try {
      setSaving(true);

      const updatedRows = batchApps.map((item) => {
        const score = Number(item.aiScore);
        const status =
          Number.isFinite(score) && score >= cutoff
            ? "shortlisted"
            : "not_shortlisted";

        return {
          ...item,
          aiShortlisting: {
            ...(item.aiShortlisting || {}),
            status,
            cutoffUsed: cutoff,
            remarks:
              status === "shortlisted"
                ? `Application screened through AI score cutoff ${cutoff}.`
                : `Application did not meet AI screening cutoff ${cutoff}.`,
            updatedAt: new Date().toISOString(),
          },
          currentStage: "aiShortlisting",
          publicStatus: {
            visibleStage: "aiShortlisting",
            message:
              status === "shortlisted"
                ? "Your application has cleared the initial screening stage and has moved to the next level of review."
                : "Your application could not be shortlisted at the initial screening stage. We encourage you to strengthen your startup idea, improve your product readiness, and apply again in future opportunities.",
            updatedAt: new Date().toISOString(),
          },
        };
      });

      for (let i = 0; i < updatedRows.length; i += 300) {
        const batch = writeBatch(db);

        updatedRows.slice(i, i + 300).forEach((item) => {
          batch.set(
            doc(
              db,
              BATCH_COLLECTION,
              selectedBatchId,
              "applications",
              item.applicationId
            ),
            {
              aiShortlisting: {
                ...(item.aiShortlisting || {}),
                updatedAt: serverTimestamp(),
              },
              currentStage: "aiShortlisting",
              publicStatus: {
                ...(item.publicStatus || {}),
                updatedAt: serverTimestamp(),
              },
              lastUpdatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        });

        await batch.commit();
      }

      setBatchApps(updatedRows);
      await updateCounts(updatedRows);
      await loadSelectedBatch(selectedBatchId);

      alert("AI shortlist applied.");
    } catch (error) {
      console.error("AI shortlist failed", error);
      alert("Failed to apply AI shortlist.");
    } finally {
      setSaving(false);
    }
  };

  const applyExpertShortlist = async () => {
    const cutoff = Number(expertCutoff);

    if (!selectedBatchId || !Number.isFinite(cutoff)) {
      alert("Enter valid expert cutoff.");
      return;
    }

    if (!batchApps.length) {
      alert("No applications in selected batch.");
      return;
    }

    try {
      setSaving(true);

      const eligibleRows = batchApps.filter(
        (item) => item?.aiShortlisting?.status === "shortlisted"
      );

      if (!eligibleRows.length) {
        alert("No AI shortlisted applications available for expert shortlisting.");
        return;
      }

      const updatedRows = batchApps.map((item) => {
        if (item?.aiShortlisting?.status !== "shortlisted") return item;

        const score = Number(item.expertScore);
        const status =
          Number.isFinite(score) && score >= cutoff
            ? "shortlisted"
            : "not_shortlisted";

        return {
          ...item,
          expertShortlisting: {
            ...(item.expertShortlisting || {}),
            status,
            cutoffUsed: cutoff,
            remarks:
              status === "shortlisted"
                ? `Expert score matched cutoff ${cutoff}.`
                : `Expert score did not meet cutoff ${cutoff}.`,
            updatedAt: new Date().toISOString(),
          },
          currentStage: "expertShortlisting",
          publicStatus: {
            visibleStage: "expertShortlisting",
            message:
              status === "shortlisted"
                ? "Your application has cleared the Expert Review stage and is eligible for the next step in the evaluation process."
                : "Your application could not be shortlisted after Expert Review. Please continue improving your startup model, innovation strength, and execution plan. You may apply again in future opportunities.",
            updatedAt: new Date().toISOString(),
          },
        };
      });

      for (let i = 0; i < updatedRows.length; i += 300) {
        const batch = writeBatch(db);

        updatedRows.slice(i, i + 300).forEach((item) => {
          batch.set(
            doc(
              db,
              BATCH_COLLECTION,
              selectedBatchId,
              "applications",
              item.applicationId
            ),
            {
              expertShortlisting: {
                ...(item.expertShortlisting || {}),
                updatedAt: serverTimestamp(),
              },
              currentStage: item.currentStage || "expertShortlisting",
              publicStatus: {
                ...(item.publicStatus || {}),
                updatedAt: serverTimestamp(),
              },
              lastUpdatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        });

        await batch.commit();
      }

      setBatchApps(updatedRows);
      await updateCounts(updatedRows);
      await loadSelectedBatch(selectedBatchId);

      alert("Expert shortlist applied.");
    } catch (error) {
      console.error("Expert shortlist failed", error);
      alert("Failed to apply expert shortlist.");
    } finally {
      setSaving(false);
    }
  };

  const updatePublishFlag = async (flag, value) => {
    if (!selectedBatchId || !selectedBatch) return;

    try {
      setSaving(true);

      const nextPublish = {
        ...(selectedBatch.publish || {}),
        [flag]: value,
      };

      await setDoc(
        doc(db, BATCH_COLLECTION, selectedBatchId),
        {
          publish: nextPublish,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSelectedBatch((prev) => ({
        ...(prev || {}),
        publish: nextPublish,
      }));

      await loadBatches();
    } catch (error) {
      console.error("Publish update failed", error);
      alert("Failed to update publish setting.");
    } finally {
      setSaving(false);
    }
  };

  const createWrittenSlot = async () => {
    if (!selectedBatchId) {
      alert("Select batch first.");
      return;
    }

    const slotId =
      writtenSlotForm.slotId.trim() ||
      `WRITTEN_${selectedBatchId}_${Date.now()}`;

    if (
      !writtenSlotForm.date ||
      !writtenSlotForm.startTime ||
      !writtenSlotForm.endTime
    ) {
      alert("Enter written test date, start time and end time.");
      return;
    }

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
          instruction:
            writtenSlotForm.instruction || DEFAULT_WRITTEN_INSTRUCTION,
          assignedCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setWrittenSlotForm({
        slotId: "",
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        mode: "Online",
        venue: "",
        instruction: "",
      });

      await loadSlots(selectedBatchId);
      alert("Written slot created.");
    } catch (error) {
      console.error("Create written slot failed", error);
      alert("Failed to create written slot.");
    } finally {
      setSaving(false);
    }
  };

  const createPiSlot = async () => {
    if (!selectedBatchId) {
      alert("Select batch first.");
      return;
    }

    const slotId =
      piSlotForm.slotId.trim() || `PI_${selectedBatchId}_${Date.now()}`;

    if (!piSlotForm.date || !piSlotForm.startTime || !piSlotForm.endTime) {
      alert("Enter PI date, start time and end time.");
      return;
    }

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

      setPiSlotForm({
        slotId: "",
        title: "",
        date: "",
        startTime: "",
        endTime: "",
        mode: "Online",
        venue: "",
        instruction: "",
      });

      await loadSlots(selectedBatchId);
      alert("PI slot created.");
    } catch (error) {
      console.error("Create PI slot failed", error);
      alert("Failed to create PI slot.");
    } finally {
      setSaving(false);
    }
  };

  const assignWrittenSlotToSelected = async () => {
    if (!selectedBatchId || !selectedWrittenSlotId) {
      alert("Select batch and written slot.");
      return;
    }

    const slot = writtenSlots.find((s) => s.id === selectedWrittenSlotId);

    if (!slot) {
      alert("Written slot not found.");
      return;
    }

    const selectedRows = batchApps.filter(
      (item) =>
        selectedBatchAppIds[item.applicationId] &&
        item?.expertShortlisting?.status === "shortlisted"
    );

    if (!selectedRows.length) {
      alert("Select expert-shortlisted applicants.");
      return;
    }

    try {
      setSaving(true);

      for (let i = 0; i < selectedRows.length; i += 300) {
        const batch = writeBatch(db);

        selectedRows.slice(i, i + 300).forEach((item) => {
          batch.set(
            doc(
              db,
              BATCH_COLLECTION,
              selectedBatchId,
              "applications",
              item.applicationId
            ),
            {
              writtenSlot: {
                slotId: slot.id,
                title: slot.title,
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime,
                mode: slot.mode,
                venue: slot.venue || "",
                instruction: slot.instruction || "",
                assignedAt: serverTimestamp(),
              },
              currentStage: "writtenSlotAssigned",
              publicStatus: {
                visibleStage: "written",
                message:
                  "Your Written Assessment schedule has been assigned. Please check the date, time and instructions carefully.",
                updatedAt: serverTimestamp(),
              },
              lastUpdatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        });

        await batch.commit();
      }

      await setDoc(
        doc(db, BATCH_COLLECTION, selectedBatchId, "writtenSlots", slot.id),
        {
          assignedCount: selectedRows.length,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await loadBatchApplications(selectedBatchId);
      await loadSlots(selectedBatchId);

      alert(`Written slot assigned to ${selectedRows.length} applicants.`);
    } catch (error) {
      console.error("Assign written slot failed", error);
      alert("Failed to assign written slot.");
    } finally {
      setSaving(false);
    }
  };

  const assignPiSlotToSelected = async () => {
    if (!selectedBatchId || !selectedPiSlotId) {
      alert("Select batch and PI slot.");
      return;
    }

    const slot = piSlots.find((s) => s.id === selectedPiSlotId);

    if (!slot) {
      alert("PI slot not found.");
      return;
    }

    const selectedRows = batchApps.filter(
      (item) =>
        selectedBatchAppIds[item.applicationId] &&
        item?.written?.status === "qualified"
    );

    if (!selectedRows.length) {
      alert("Select written-qualified applicants.");
      return;
    }

    try {
      setSaving(true);

      for (let i = 0; i < selectedRows.length; i += 300) {
        const batch = writeBatch(db);

        selectedRows.slice(i, i + 300).forEach((item) => {
          batch.set(
            doc(
              db,
              BATCH_COLLECTION,
              selectedBatchId,
              "applications",
              item.applicationId
            ),
            {
              piSlot: {
                slotId: slot.id,
                title: slot.title,
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime,
                mode: slot.mode,
                venue: slot.venue || "",
                instruction: slot.instruction || "",
                assignedAt: serverTimestamp(),
              },
              currentStage: "piSlotAssigned",
              publicStatus: {
                visibleStage: "pi",
                message:
                  "Your Pitch / Personal Interaction schedule has been assigned. Please check the date, time and instructions carefully.",
                updatedAt: serverTimestamp(),
              },
              lastUpdatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        });

        await batch.commit();
      }

      await setDoc(
        doc(db, BATCH_COLLECTION, selectedBatchId, "piSlots", slot.id),
        {
          assignedCount: selectedRows.length,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await loadBatchApplications(selectedBatchId);
      await loadSlots(selectedBatchId);

      alert(`PI slot assigned to ${selectedRows.length} applicants.`);
    } catch (error) {
      console.error("Assign PI slot failed", error);
      alert("Failed to assign PI slot.");
    } finally {
      setSaving(false);
    }
  };

  const exportBatchExcel = () => {
    if (!filteredBatchApps.length) {
      alert("No data to export.");
      return;
    }

    const rows = filteredBatchApps.map((item, index) => ({
      "S. No.": index + 1,
      "Batch ID": selectedBatchId,
      "Application ID": item.applicationId,
      "Startup Name": item.startupName,
      "Founder Name": item.founderName,
      Email: item.email,
      Phone: item.phone,
      "Submitted At": formatDate(item.submittedAt),
      "AI Score": item.aiScore ?? "-",
      "AI Shortlisting": item.aiShortlisting?.status || "pending",
      "Expert Score": item.expertScore ?? "-",
      "Expert Shortlisting": item.expertShortlisting?.status || "pending",
      "Written Slot": item.writtenSlot?.title || "-",
      "Written Date": item.writtenSlot?.date || "-",
      "Written Time": item.writtenSlot?.startTime
        ? `${item.writtenSlot.startTime}-${item.writtenSlot.endTime || ""}`
        : "-",
      "Written Status": item.written?.status || "pending",
      "PI Slot": item.piSlot?.title || "-",
      "PI Date": item.piSlot?.date || "-",
      "PI Time": item.piSlot?.startTime
        ? `${item.piSlot.startTime}-${item.piSlot.endTime || ""}`
        : "-",
      "PI Selected":
        item.pi?.selected === true
          ? "Yes"
          : item.pi?.selected === false
          ? "No"
          : "-",
      "Final Decision": item.finalDecision?.status || "pending",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Shortlisting");
    XLSX.writeFile(wb, `${selectedBatchId || "batch"}_shortlisting.xlsx`);
  };

  const tabs = [
    { key: "batch", label: "Batch & Preview" },
    { key: "shortlist", label: "AI / Expert" },
    { key: "slots", label: "Slots" },
    { key: "publish", label: "Publish" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-6">
      <div className="mx-auto max-w-[1500px] space-y-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                Startup Bihar Shortlisting
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Batch-wise Shortlisting
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Work batch-wise. Preview only submitted applications, apply AI
                and expert cutoffs, create written/PI slots, and publish stages
                for applicants.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={loadBatches}
                disabled={loadingBatches}
                className={`${buttonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
              >
                <RefreshCw size={16} />
                Refresh
              </button>

              <button
                onClick={exportBatchExcel}
                disabled={!filteredBatchApps.length}
                className={`${buttonBase} border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
              >
                <Download size={16} />
                Excel
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
          <StatCard label="Total" value={stats.total} icon={Users} />
          <StatCard label="AI" value={stats.ai} icon={Bot} tone="blue" />
          <StatCard
            label="Expert"
            value={stats.expert}
            icon={Star}
            tone="violet"
          />
          <StatCard
            label="Written Slot"
            value={stats.writtenSlot}
            icon={ClipboardList}
            tone="emerald"
          />
          <StatCard
            label="Written OK"
            value={stats.writtenQualified}
            icon={CheckCircle2}
            tone="emerald"
          />
          <StatCard
            label="PI Slot"
            value={stats.piSlot}
            icon={Clock3}
            tone="amber"
          />
          <StatCard
            label="PI Selected"
            value={stats.piSelected}
            icon={Send}
            tone="amber"
          />
          <StatCard
            label="Recognised"
            value={stats.recognised}
            icon={CheckCircle2}
            tone="emerald"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  activeTab === tab.key
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "batch" ? (
          <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
            <div className="space-y-5">
              <SectionCard
                title="Create Batch"
                subtitle="Example: April2026, Dec2025."
                icon={Plus}
              >
                <div className="space-y-3">
                  <Field label="Batch ID">
                    <input
                      value={batchForm.batchId}
                      onChange={(e) =>
                        setBatchForm((p) => ({
                          ...p,
                          batchId: e.target.value,
                        }))
                      }
                      placeholder="April2026"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Batch Name">
                    <input
                      value={batchForm.batchName}
                      onChange={(e) =>
                        setBatchForm((p) => ({
                          ...p,
                          batchName: e.target.value,
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
                        onChange={(e) =>
                          setBatchForm((p) => ({
                            ...p,
                            startDate: e.target.value,
                          }))
                        }
                        className={inputClass}
                      />
                    </Field>

                    <Field label="End Date">
                      <input
                        type="date"
                        value={batchForm.endDate}
                        onChange={(e) =>
                          setBatchForm((p) => ({
                            ...p,
                            endDate: e.target.value,
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
                title="Select Batch"
                subtitle="All actions work inside selected batch."
                icon={CalendarDays}
              >
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchName || batch.id}
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
                      Created: {formatDateTime(selectedBatch.createdAt)}
                    </div>
                  </div>
                ) : null}
              </SectionCard>
            </div>

            <SectionCard
              title="Preview Submitted Applications"
              subtitle="This preview uses submittedAt only. Drafts and records without submittedAt are excluded."
              icon={Eye}
            >
              <div className="grid gap-3 md:grid-cols-4">
                <Field label="Submitted From">
                  <input
                    type="date"
                    value={previewDateRange.from}
                    onChange={(e) =>
                      setPreviewDateRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Submitted To">
                  <input
                    type="date"
                    value={previewDateRange.to}
                    onChange={(e) =>
                      setPreviewDateRange((prev) => ({
                        ...prev,
                        to: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </Field>

                <div className="flex items-end">
                  <button
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
                    onClick={previewApplicationsByDate}
                    disabled={!selectedBatchId || loadingPreview}
                    className={`${buttonBase} w-full bg-sky-600 text-white hover:bg-sky-700`}
                  >
                    <Eye size={16} />
                    {loadingPreview ? "Loading..." : "Preview"}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={assignSelectedToBatch}
                  disabled={!selectedPreviewCount || saving}
                  className={`${buttonBase} bg-violet-600 text-white hover:bg-violet-700`}
                >
                  <UploadCloud size={16} />
                  Assign Selected ({selectedPreviewCount})
                </button>

                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  Preview: {previewRows.length}
                </span>
              </div>

              <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-[900px] w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={allPreviewSelected}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const next = {};
                            previewRows.forEach((row) => {
                              next[row.applicationId] = checked;
                            });
                            setSelectedPreviewIds(next);
                          }}
                        />
                      </th>
                      <th className="px-4 py-3">Application</th>
                      <th className="px-4 py-3">Startup</th>
                      <th className="px-4 py-3">Founder</th>
                      <th className="px-4 py-3">Submitted</th>
                      <th className="px-4 py-3">AI</th>
                      <th className="px-4 py-3">Expert</th>
                    </tr>
                  </thead>

                  <tbody>
                    {previewRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-10 text-center text-slate-500"
                        >
                          No submitted applications previewed yet.
                        </td>
                      </tr>
                    ) : (
                      previewRows.map((item) => (
                        <tr
                          key={item.applicationId}
                          className="border-t border-slate-100"
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={!!selectedPreviewIds[item.applicationId]}
                              onChange={(e) =>
                                setSelectedPreviewIds((prev) => ({
                                  ...prev,
                                  [item.applicationId]: e.target.checked,
                                }))
                              }
                            />
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {item.applicationId}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-800">
                              {item.startupName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {item.email}
                            </div>
                          </td>
                          <td className="px-4 py-3">{item.founderName}</td>
                          <td className="px-4 py-3">
                            {formatDate(item.submittedAt)}
                          </td>
                          <td className="px-4 py-3">
                            <ScoreChip value={item.aiScore} />
                          </td>
                          <td className="px-4 py-3">
                            <ScoreChip value={item.expertScore} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          </div>
        ) : null}

        {activeTab === "shortlist" ? (
          <SectionCard
            title="AI & Expert Shortlisting"
            subtitle="AI cutoff applies to all batch applicants. Expert cutoff applies only to AI-shortlisted applicants."
            icon={Settings2}
          >
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="AI Cutoff">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={aiCutoff}
                  onChange={(e) => setAiCutoff(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <div className="flex items-end">
                <button
                  onClick={applyAiShortlist}
                  disabled={!selectedBatchId || saving || !batchApps.length}
                  className={`${buttonBase} w-full bg-sky-600 text-white hover:bg-sky-700`}
                >
                  <Bot size={16} />
                  Apply AI
                </button>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
                AI shortlisted: <strong>{stats.ai}</strong>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Field label="Expert Cutoff">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={expertCutoff}
                  onChange={(e) => setExpertCutoff(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <div className="flex items-end">
                <button
                  onClick={applyExpertShortlist}
                  disabled={!selectedBatchId || saving || !batchApps.length}
                  className={`${buttonBase} w-full bg-violet-600 text-white hover:bg-violet-700`}
                >
                  <Star size={16} />
                  Apply Expert
                </button>
              </div>

              <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-800">
                Expert shortlisted: <strong>{stats.expert}</strong>
              </div>
            </div>
          </SectionCard>
        ) : null}

        {activeTab === "slots" ? (
          <div className="grid gap-5 xl:grid-cols-2">
            <SectionCard
              title="Written Test Slot"
              subtitle="Create a written test batch/slot and assign selected expert-shortlisted applicants."
              icon={ClipboardList}
            >
              <SlotForm
                type="written"
                form={writtenSlotForm}
                setForm={setWrittenSlotForm}
                onCreate={createWrittenSlot}
                saving={saving}
              />

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                <select
                  value={selectedWrittenSlotId}
                  onChange={(e) => setSelectedWrittenSlotId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select written slot</option>
                  {writtenSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.title} | {slot.date} {slot.startTime}-{slot.endTime}
                    </option>
                  ))}
                </select>

                <button
                  onClick={assignWrittenSlotToSelected}
                  disabled={!selectedWrittenSlotId || saving}
                  className={`${buttonBase} bg-slate-900 text-white hover:bg-slate-800`}
                >
                  Assign Written
                </button>
              </div>
            </SectionCard>

            <SectionCard
              title="PI Slot"
              subtitle="Create a PI batch/slot and assign selected written-qualified applicants."
              icon={Clock3}
            >
              <SlotForm
                type="pi"
                form={piSlotForm}
                setForm={setPiSlotForm}
                onCreate={createPiSlot}
                saving={saving}
              />

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                <select
                  value={selectedPiSlotId}
                  onChange={(e) => setSelectedPiSlotId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select PI slot</option>
                  {piSlots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.title} | {slot.date} {slot.startTime}-{slot.endTime}
                    </option>
                  ))}
                </select>

                <button
                  onClick={assignPiSlotToSelected}
                  disabled={!selectedPiSlotId || saving}
                  className={`${buttonBase} bg-slate-900 text-white hover:bg-slate-800`}
                >
                  Assign PI
                </button>
              </div>
            </SectionCard>
          </div>
        ) : null}

        {activeTab === "publish" ? (
          <SectionCard
            title="Publish Controls"
            subtitle="Applicants will see only the stages that are published."
            icon={Send}
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["aiResult", "Application Screening Result"],
                ["expertResult", "Expert Review Result"],
                ["writtenSlot", "Written Test Schedule"],
                ["writtenResult", "Written Assessment Result"],
                ["piSlot", "PI Schedule"],
                ["piResult", "PI Result"],
                ["finalResult", "Final Recognition Result"],
              ].map(([flag, label]) => {
                const active = selectedBatch?.publish?.[flag] === true;

                return (
                  <button
                    key={flag}
                    disabled={!selectedBatchId || saving}
                    onClick={() => updatePublishFlag(flag, !active)}
                    className={`${buttonBase} justify-between border ${
                      active
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{label}</span>
                    <span>{active ? "Published" : "Hidden"}</span>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        ) : null}

        <SectionCard
          title="Batch Applications"
          subtitle="Select rows here for assigning written or PI slots."
          icon={Users}
        >
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search application, startup, founder..."
                className={`${inputClass} pl-11`}
              />
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-semibold text-slate-600">
                Showing {filteredBatchApps.length}
              </span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 font-semibold text-violet-700">
                Selected {selectedBatchAppCount}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-[1150px] w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allFilteredBatchSelected}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedBatchAppIds((prev) => {
                          const next = { ...prev };
                          filteredBatchApps.forEach((row) => {
                            next[row.applicationId] = checked;
                          });
                          return next;
                        });
                      }}
                    />
                  </th>
                  <th className="px-4 py-3">Application</th>
                  <th className="px-4 py-3">Startup</th>
                  <th className="px-4 py-3">AI</th>
                  <th className="px-4 py-3">Expert</th>
                  <th className="px-4 py-3">Written Slot</th>
                  <th className="px-4 py-3">Written</th>
                  <th className="px-4 py-3">PI Slot</th>
                  <th className="px-4 py-3">PI</th>
                  <th className="px-4 py-3">Final</th>
                </tr>
              </thead>

              <tbody>
                {loadingBatchApps ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      Loading batch applications...
                    </td>
                  </tr>
                ) : filteredBatchApps.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No applications assigned to this batch.
                    </td>
                  </tr>
                ) : (
                  filteredBatchApps.map((item) => (
                    <tr
                      key={item.applicationId}
                      className="border-t border-slate-100 align-top"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={!!selectedBatchAppIds[item.applicationId]}
                          onChange={(e) =>
                            setSelectedBatchAppIds((prev) => ({
                              ...prev,
                              [item.applicationId]: e.target.checked,
                            }))
                          }
                        />
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {item.applicationId}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">
                          {item.startupName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.founderName}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <ScoreChip value={item.aiScore} />
                          <StatusChip value={item.aiShortlisting?.status} />
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <ScoreChip value={item.expertScore} />
                          <StatusChip value={item.expertShortlisting?.status} />
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {item?.writtenSlot?.slotId ? (
                          <SlotCell slot={item.writtenSlot} />
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StatusChip value={item.written?.status} />
                      </td>

                      <td className="px-4 py-3">
                        {item?.piSlot?.slotId ? (
                          <SlotCell slot={item.piSlot} />
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {item.pi?.selected === true ? (
                          <StatusChip value="selected" />
                        ) : item.pi?.selected === false ? (
                          <StatusChip value="not_selected" />
                        ) : (
                          <StatusChip value="pending" />
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StatusChip value={item.finalDecision?.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function SlotForm({ form, setForm, onCreate, saving }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <input
        value={form.slotId}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            slotId: e.target.value,
          }))
        }
        placeholder="Slot ID optional"
        className={inputClass}
      />

      <input
        value={form.title}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            title: e.target.value,
          }))
        }
        placeholder="Slot title"
        className={inputClass}
      />

      <input
        type="date"
        value={form.date}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            date: e.target.value,
          }))
        }
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-2">
        <input
          type="time"
          value={form.startTime}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              startTime: e.target.value,
            }))
          }
          className={inputClass}
        />

        <input
          type="time"
          value={form.endTime}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              endTime: e.target.value,
            }))
          }
          className={inputClass}
        />
      </div>

      <select
        value={form.mode}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            mode: e.target.value,
          }))
        }
        className={inputClass}
      >
        <option value="Online">Online</option>
        <option value="Offline">Offline</option>
        <option value="Hybrid">Hybrid</option>
      </select>

      <input
        value={form.venue}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            venue: e.target.value,
          }))
        }
        placeholder="Venue / link"
        className={inputClass}
      />

      <textarea
        value={form.instruction}
        onChange={(e) =>
          setForm((p) => ({
            ...p,
            instruction: e.target.value,
          }))
        }
        placeholder="One line instruction"
        className={`${inputClass} md:col-span-2`}
      />

      <button
        onClick={onCreate}
        disabled={saving}
        className={`${buttonBase} bg-slate-900 text-white hover:bg-slate-800 md:col-span-2`}
      >
        <Plus size={16} />
        Create Slot
      </button>
    </div>
  );
}

function SlotCell({ slot }) {
  return (
    <div>
      <div className="font-semibold text-slate-900">{slot.title}</div>
      <div className="mt-1 text-xs text-slate-500">
        {slot.date} | {slot.startTime}-{slot.endTime}
      </div>
      <div className="mt-1 text-xs text-slate-500">{slot.mode}</div>
    </div>
  );
}