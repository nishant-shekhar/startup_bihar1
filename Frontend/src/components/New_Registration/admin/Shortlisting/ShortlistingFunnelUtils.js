import { doc, getDoc, serverTimestamp } from "firebase/firestore";

export const APP_COLLECTION = "startupApplications";
export const BATCH_COLLECTION = "startupShortlistingBatches";

export const FUNNEL_STAGES = {
  ALL: "all",
  AI: "ai",
  EXPERT: "expert",
  WRITTEN: "written",
  PI: "pi",
  FINAL: "final",
};

export const STATUS = {
  PENDING: "pending",
  SHORTLISTED: "shortlisted",
  NOT_SHORTLISTED: "not_shortlisted",
  SELECTED: "selected",
  NOT_SELECTED: "not_selected",
  QUALIFIED: "qualified",
  NOT_QUALIFIED: "not_qualified",
  RECOGNISED: "recognised",
  NOT_RECOGNISED: "not_recognised",
};

export const DEFAULT_PUBLISH = {
  aiResult: false,
  expertResult: false,
  writtenSchedule: false,
  writtenResult: false,
  piSchedule: false,
  piResult: false,
  finalResult: false,
};

export const DEFAULT_COUNTS = {
  total: 0,
  aiShortlisted: 0,
  expertShortlisted: 0,
  writtenSelected: 0,
  piSelected: 0,
  recognised: 0,
};

export const STATUS_LABELS = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  not_shortlisted: "Not Shortlisted",
  selected: "Selected",
  not_selected: "Not Selected",
  qualified: "Qualified",
  not_qualified: "Not Qualified",
  recognised: "Recognised",
  not_recognised: "Not Recognised",
};

export const STATUS_TONE = {
  pending: "border-slate-200 bg-slate-100 text-slate-700",
  shortlisted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  selected: "border-emerald-200 bg-emerald-50 text-emerald-700",
  qualified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  recognised: "border-emerald-200 bg-emerald-50 text-emerald-700",
  not_shortlisted: "border-rose-200 bg-rose-50 text-rose-700",
  not_selected: "border-rose-200 bg-rose-50 text-rose-700",
  not_qualified: "border-rose-200 bg-rose-50 text-rose-700",
  not_recognised: "border-rose-200 bg-rose-50 text-rose-700",
};

export const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

export const toDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  if (value?.seconds) return new Date(value.seconds * 1000);

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (value) => {
  const date = toDate(value);
  if (!date) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatSlotDateTime = (slot) => {
  if (!slot?.date) return "-";

  const date = new Date(`${slot.date}T00:00:00`);
  const dateText = Number.isNaN(date.getTime())
    ? slot.date
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

  return `${dateText}, ${slot.startTime || "-"} - ${slot.endTime || "-"}`;
};

export const scoreText = (score) => {
  if (score === null || score === undefined || score === "") return "—";

  const n = Number(score);
  return Number.isFinite(n) ? `${n.toFixed(1)}/10` : "—";
};

export const getApplicationId = (item, docId) =>
  item?.applicationId ||
  item?.applicationNo ||
  item?.registrationNumber ||
  item?.registration_no ||
  docId;

export const getStartupName = (item) =>
  item?.userSignup?.startupName ||
  item?.startupName ||
  item?.startup_name ||
  item?.company_name ||
  item?.companyName ||
  "-";

export const getFounderName = (item) =>
  item?.userSignup?.founderName ||
  item?.basicDetails?.fullName ||
  item?.founderName ||
  item?.founder_name ||
  item?.name ||
  "-";

export const getEmail = (item) =>
  item?.userSignup?.email || item?.email || item?.basicDetails?.email || "-";

export const getPhone = (item) =>
  item?.userSignup?.phoneNumber || item?.phoneNumber || item?.mobile || "-";

export const getStatus = (item) =>
  item?.status ||
  item?.applicationStatus ||
  item?.reviewStatus ||
  item?.documentStatus ||
  "";

export const isSubmittedStatus = (item) => {
  const status = String(getStatus(item) || "")
    .trim()
    .toLowerCase();

  return (
    status === "submitted" ||
    status === "under review" ||
    status === "approved" ||
    status === "rejected"
  );
};

export const getEffectiveSubmittedDate = (item) => {
  if (!isSubmittedStatus(item)) return null;

  return (
    item?.submittedAt ||
    item?.finalSubmittedAt ||
    item?.submissionDate ||
    item?.submittedOn ||
    item?.createdAt ||
    null
  );
};

export const getAIScore = (item) => {
  const score =
    item?.aiEvaluation?.finalScore ??
    item?.Evaluation?.AI?.finalScore ??
    item?.aiScore ??
    null;

  if (score === null || score === undefined || score === "") return null;

  const n = Number(score);
  return Number.isFinite(n) ? n : null;
};

export const getExpertScore = (item) => {
  const review = item?._expertReview || item?.review?.expert || null;

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

export const readExpertReview = async ({ db, applicationDocId }) => {
  try {
    const snap = await getDoc(
      doc(db, APP_COLLECTION, applicationDocId, "review", "expert")
    );

    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
};

export const calculateCounts = (rows = []) => {
  return {
    total: rows.length,
    aiShortlisted: rows.filter((x) => x?.ai?.status === STATUS.SHORTLISTED)
      .length,
    expertShortlisted: rows.filter(
      (x) => x?.expert?.status === STATUS.SHORTLISTED
    ).length,
    writtenSelected: rows.filter((x) => x?.written?.status === STATUS.SELECTED)
      .length,
    piSelected: rows.filter((x) => x?.pi?.selected === true).length,
    recognised: rows.filter((x) => x?.final?.status === STATUS.RECOGNISED)
      .length,
  };
};

export const buildBatchApplication = ({
  item,
  selectedBatchId,
  selectedBatch,
}) => {
  return {
    applicationId: item.applicationId,
    applicationDocId: item.applicationDocId,

    startupName: item.startupName,
    founderName: item.founderName,
    email: item.email,
    phone: item.phone,

    status: item.status || "submitted",
    submittedAt: item.submittedAt || null,

    currentStage: FUNNEL_STAGES.ALL,

    aiScore: item.aiScore,
    expertScore: item.expertScore,

    ai: {
      status: STATUS.PENDING,
      cutoffUsed: null,
      updatedAt: null,
    },

    expert: {
      status: STATUS.PENDING,
      cutoffUsed: null,
      updatedAt: null,
    },

    written: {
      schedule: null,
      marks: null,
      maxMarks: 100,
      status: STATUS.PENDING,
      remarks: "",
      updatedAt: null,
    },

    pi: {
      schedule: null,
      selected: null,
      marks: null,
      remarks: "",
      updatedAt: null,
    },

    final: {
      status: STATUS.PENDING,
      remarks: "",
      updatedAt: null,
    },

    batchId: selectedBatchId,
    batchName: selectedBatch?.batchName || selectedBatchId,

    assignedAt: serverTimestamp(),
    lastUpdatedAt: serverTimestamp(),
  };
};

export const buildSchedule = (form) => ({
  date: form.date || "",
  startTime: form.startTime || "",
  endTime: form.endTime || "",
  mode: form.mode || "Online",
  venue: form.venue || "",
  instruction: form.instruction || "",
  assignedAt: serverTimestamp(),
});

export const getRowsForStage = (stage, rows) => {
  if (stage === FUNNEL_STAGES.ALL) return rows;

  if (stage === FUNNEL_STAGES.AI) {
    return rows;
  }

  if (stage === FUNNEL_STAGES.EXPERT) {
    return rows.filter((x) => x?.ai?.status === STATUS.SHORTLISTED);
  }

  if (stage === FUNNEL_STAGES.WRITTEN) {
    return rows.filter((x) => x?.expert?.status === STATUS.SHORTLISTED);
  }

  if (stage === FUNNEL_STAGES.PI) {
    return rows.filter((x) => x?.written?.status === STATUS.SELECTED);
  }

  if (stage === FUNNEL_STAGES.FINAL) {
    return rows.filter(
      (x) =>
        x?.pi?.selected === true ||
        x?.pi?.selected === false ||
        x?.final?.status !== STATUS.PENDING
    );
  }

  return rows;
};