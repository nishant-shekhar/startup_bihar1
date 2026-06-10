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
  RECOGNISED: "recognised",
  NOT_RECOGNISED: "not_recognised",
};

export const APPLICATION_STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const STATUS_LABELS = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  not_shortlisted: "Not Shortlisted",
  selected: "Cleared",
  not_selected: "Not Cleared",
  recognised: "Recognised",
  not_recognised: "Not Recognised",

  draft: "Draft",
  submitted: "Submitted",
  "Under Review": "Under Review",
  Approved: "Approved",
  Rejected: "Rejected",

  all: "Applications",
  ai: "AI Screening",
  expert: "Expert Review",
  written: "Written Assessment",
  pi: "Pitch / PI",
  final: "Recognition",
};

export const STATUS_TONE = {
  pending: "border-slate-200 bg-slate-100 text-slate-600",

  shortlisted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  selected: "border-emerald-200 bg-emerald-50 text-emerald-700",
  recognised: "border-emerald-200 bg-emerald-50 text-emerald-700",

  not_shortlisted: "border-rose-200 bg-rose-50 text-rose-700",
  not_selected: "border-rose-200 bg-rose-50 text-rose-700",
  not_recognised: "border-rose-200 bg-rose-50 text-rose-700",

  draft: "border-slate-200 bg-slate-100 text-slate-700",
  submitted: "border-sky-200 bg-sky-50 text-sky-700",
  "Under Review": "border-amber-200 bg-amber-50 text-amber-700",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700",
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
  aiNotShortlisted: 0,

  expertShortlisted: 0,
  expertNotShortlisted: 0,

  writtenSelected: 0,
  writtenNotSelected: 0,

  piSelected: 0,
  piNotSelected: 0,

  recognised: 0,
  notRecognised: 0,
};

export const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

export const toDate = (value) => {
  if (!value) return null;

  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (value?.seconds) {
    const date = new Date(value.seconds * 1000);
    return Number.isNaN(date.getTime()) ? null : date;
  }

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

export const formatSlotDateTime = (schedule) => {
  if (!schedule?.date) return "-";

  const date = new Date(`${schedule.date}T00:00:00`);

  const dateText = Number.isNaN(date.getTime())
    ? schedule.date
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const start = schedule.startTime || "-";
  const end = schedule.endTime || "-";

  return `${dateText}, ${start} - ${end}`;
};

export const scoreText = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  const number = Number(value);

  if (!Number.isFinite(number)) return "—";

  return `${number.toFixed(1)}/10`;
};

export const normalizeId = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9]/g, "");

export const normalizeStatus = (value) => {
  const status = String(value || "").trim();

  if (!status) return "";
  if (status.toLowerCase() === "draft") return APPLICATION_STATUS.DRAFT;
  if (status.toLowerCase() === "submitted") return APPLICATION_STATUS.SUBMITTED;
  if (status.toLowerCase() === "under review") {
    return APPLICATION_STATUS.UNDER_REVIEW;
  }
  if (status.toLowerCase() === "approved") return APPLICATION_STATUS.APPROVED;
  if (status.toLowerCase() === "rejected") return APPLICATION_STATUS.REJECTED;

  return status;
};

export const getStatus = (item) => {
  return normalizeStatus(
    item?.status ||
      item?.applicationStatus ||
      item?.reviewStatus ||
      item?.documentStatus ||
      ""
  );
};

export const isDraftStatus = (item) => {
  return getStatus(item).toLowerCase() === "draft";
};

export const isSubmittedStatus = (item) => {
  const status = getStatus(item);

  return (
    status === APPLICATION_STATUS.SUBMITTED ||
    status === APPLICATION_STATUS.UNDER_REVIEW ||
    status === APPLICATION_STATUS.APPROVED ||
    status === APPLICATION_STATUS.REJECTED
  );
};

export const getApplicationId = (item, docId = "") => {
  return (
    item?.applicationId ||
    item?.applicationNo ||
    item?.registrationNumber ||
    item?.registration_no ||
    item?.userSignup?.applicationId ||
    docId ||
    ""
  );
};

export const getStartupName = (item) => {
  return (
    item?.userSignup?.startupName ||
    item?.startupName ||
    item?.startup_name ||
    item?.company_name ||
    item?.companyName ||
    item?.entityDetails?.entityName ||
    "-"
  );
};

export const getFounderName = (item) => {
  return (
    item?.userSignup?.founderName ||
    item?.basicDetails?.fullName ||
    item?.founderName ||
    item?.founder_name ||
    item?.name ||
    "-"
  );
};

export const getEmail = (item) => {
  return item?.userSignup?.email || item?.email || item?.basicDetails?.email || "-";
};

export const getPhone = (item) => {
  return (
    item?.userSignup?.phoneNumber ||
    item?.phoneNumber ||
    item?.mobile ||
    item?.basicDetails?.phoneNumber ||
    "-"
  );
};

export const getDistrict = (item) => {
  return (
    item?.basicDetails?.district ||
    item?.district ||
    item?.registeredDistrict ||
    item?.districtRoc ||
    item?.startupDistrict ||
    item?.entityDetails?.district ||
    "-"
  );
};

export const getSector = (item) => {
  return (
    item?.startupDetails?.sector ||
    item?.sector ||
    item?.startupCategory ||
    item?.category ||
    "-"
  );
};

export const getStage = (item) => {
  return item?.startupDetails?.stage || item?.stage || "-";
};

export const getEffectiveSubmittedDate = (item) => {
  return (
    item?.submittedAt ||
    item?.finalSubmittedAt ||
    item?.formSubmittedAt ||
    item?.createdAt ||
    item?.firestoreUpdatedAt ||
    null
  );
};

export const getAIScore = (item) => {
  const value =
    item?.aiEvaluation?.finalScore ??
    item?.aiEvaluation?.score ??
    item?.aiScore ??
    item?.finalScore ??
    null;

  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const readExpertReview = async ({ db, applicationDocId }) => {
  if (!db || !applicationDocId) return null;

  try {
    const { doc, getDoc } = await import("firebase/firestore");

    const snap = await getDoc(
      doc(db, APP_COLLECTION, applicationDocId, "review", "expert")
    );

    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.warn("Failed to read expert review", error);
    return null;
  }
};

export const getExpertReview = (item) => {
  return item?._expertReview || item?.review?.expert || item?.expertReview || null;
};

export const getExpertScore = (item) => {
  const review = getExpertReview(item);

  const value =
    review?.score ??
    review?.finalScore ??
    review?.initialScore ??
    review?.firstScore ??
    item?.expertScore ??
    null;

  if (value === null || value === undefined || value === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const buildSchedule = (form) => {
  return {
    date: form?.date || "",
    startTime: form?.startTime || "",
    endTime: form?.endTime || "",
    mode: form?.mode || "Online",
    venue: form?.venue || "",
    instruction: form?.instruction || "",
  };
};

export const calculateCounts = (rows = []) => {
  const counts = { ...DEFAULT_COUNTS };

  counts.total = rows.length;

  rows.forEach((item) => {
    if (item?.ai?.status === STATUS.SHORTLISTED) counts.aiShortlisted += 1;
    if (item?.ai?.status === STATUS.NOT_SHORTLISTED) {
      counts.aiNotShortlisted += 1;
    }

    if (item?.expert?.status === STATUS.SHORTLISTED) {
      counts.expertShortlisted += 1;
    }
    if (item?.expert?.status === STATUS.NOT_SHORTLISTED) {
      counts.expertNotShortlisted += 1;
    }

    if (item?.written?.status === STATUS.SELECTED) {
      counts.writtenSelected += 1;
    }
    if (item?.written?.status === STATUS.NOT_SELECTED) {
      counts.writtenNotSelected += 1;
    }

    if (item?.pi?.selected === true) counts.piSelected += 1;
    if (item?.pi?.selected === false) counts.piNotSelected += 1;

    if (
      item?.final?.status === STATUS.RECOGNISED ||
      item?.pi?.selected === true
    ) {
      counts.recognised += 1;
    }

    if (
      item?.final?.status === STATUS.NOT_RECOGNISED ||
      item?.pi?.selected === false
    ) {
      counts.notRecognised += 1;
    }
  });

  return counts;
};

export const getRowsForStage = (stage, rows = []) => {
  if (stage === FUNNEL_STAGES.ALL) return rows;

  if (stage === FUNNEL_STAGES.AI) {
    return rows;
  }

  if (stage === FUNNEL_STAGES.EXPERT) {
    return rows.filter((item) => item?.ai?.status === STATUS.SHORTLISTED);
  }

  if (stage === FUNNEL_STAGES.WRITTEN) {
    return rows.filter((item) => item?.expert?.status === STATUS.SHORTLISTED);
  }

  if (stage === FUNNEL_STAGES.PI) {
    return rows.filter((item) => item?.written?.status === STATUS.SELECTED);
  }

  if (stage === FUNNEL_STAGES.FINAL) {
    return rows.filter(
      (item) =>
        item?.pi?.selected === true ||
        item?.pi?.selected === false ||
        item?.final?.status === STATUS.RECOGNISED ||
        item?.final?.status === STATUS.NOT_RECOGNISED
    );
  }

  return rows;
};

export const getPiStatusText = (batchApplication) => {
  if (batchApplication?.pi?.selected === true) return STATUS.SELECTED;
  if (batchApplication?.pi?.selected === false) return STATUS.NOT_SELECTED;
  return STATUS.PENDING;
};

export const getFinalStatusText = (batchApplication) => {
  if (batchApplication?.final?.status) return batchApplication.final.status;
  if (batchApplication?.pi?.selected === true) return STATUS.RECOGNISED;
  if (batchApplication?.pi?.selected === false) return STATUS.NOT_RECOGNISED;
  return STATUS.PENDING;
};

export const getShortlistingCurrentStatus = (batchApplication) => {
  if (!batchApplication) return "Not Assigned";

  if (
    batchApplication?.final?.status === STATUS.RECOGNISED ||
    batchApplication?.pi?.selected === true
  ) {
    return "Recognised";
  }

  if (
    batchApplication?.final?.status === STATUS.NOT_RECOGNISED ||
    batchApplication?.pi?.selected === false
  ) {
    return "Pitch / PI Not Cleared";
  }

  if (batchApplication?.pi?.schedule?.date) {
    return "Pitch / PI Pending";
  }

  if (batchApplication?.written?.status === STATUS.SELECTED) {
    return "Written Assessment Cleared";
  }

  if (batchApplication?.written?.status === STATUS.NOT_SELECTED) {
    return "Written Assessment Not Cleared";
  }

  if (batchApplication?.written?.schedule?.date) {
    return "Written Assessment Scheduled";
  }

  if (batchApplication?.expert?.status === STATUS.SHORTLISTED) {
    return "Expert Review Qualified";
  }

  if (batchApplication?.expert?.status === STATUS.NOT_SHORTLISTED) {
    return "Expert Review Not Shortlisted";
  }

  if (batchApplication?.ai?.status === STATUS.SHORTLISTED) {
    return "Application Screening Qualified";
  }

  if (batchApplication?.ai?.status === STATUS.NOT_SHORTLISTED) {
    return "Application Screening Not Shortlisted";
  }

  return "Assigned - Pending";
};

export const getUpdatedPitchDeckFromBatchApplication = (batchApplication) => {
  return batchApplication?.UpdatedPitchDeck || null;
};

export const getUpdatedPitchDeckType = (deck) => {
  if (!deck) return "";
  if (deck?.type === "canva") return "canva";
  if (deck?.downloadURL || deck?.storagePath) return "file";
  return "";
};

export const getUpdatedPitchDeckUrl = (deck) => {
  if (!deck) return "";
  if (deck?.type === "canva") return deck?.canvaLink || "";
  return deck?.downloadURL || "";
};

export const buildBatchApplication = ({ item, selectedBatchId, selectedBatch }) => {
  const applicationId = getApplicationId(item, item?.id);

  return {
    applicationId,
    applicationDocId: item?.applicationDocId || item?.id || "",
    startupName: getStartupName(item),
    founderName: getFounderName(item),
    email: getEmail(item),
    phone: getPhone(item),
    district: getDistrict(item),
    sector: getSector(item),
    status: getStatus(item) || APPLICATION_STATUS.SUBMITTED,
    submittedAt: getEffectiveSubmittedDate(item),

    batchId: selectedBatchId,
    batchName: selectedBatch?.batchName || selectedBatch?.batchId || selectedBatchId,

    aiScore: getAIScore(item),
    expertScore: getExpertScore(item),

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

    UpdatedPitchDeck: item?.UpdatedPitchDeck || null,

    currentStage: FUNNEL_STAGES.ALL,
    createdAt: null,
    lastUpdatedAt: null,
  };
};

export const buildShortlistingSummary = ({
  batchId,
  batchName,
  batchApplication,
  existingSummary = {},
  updatedPitchDeck = null,
}) => {
  const deck = updatedPitchDeck || batchApplication?.UpdatedPitchDeck || null;

  const resolvedBatchId =
    batchId || batchApplication?.batchId || existingSummary?.batchId || "";

  const resolvedBatchName =
    batchName ||
    batchApplication?.batchName ||
    existingSummary?.batchName ||
    resolvedBatchId ||
    "";

  return {
    ...(existingSummary || {}),

    batchId: resolvedBatchId,
    batchName: resolvedBatchName,

    applicationId:
      batchApplication?.applicationId || existingSummary?.applicationId || "",

    aiStatus: batchApplication?.ai?.status || STATUS.PENDING,
    aiCutoffUsed: batchApplication?.ai?.cutoffUsed ?? null,

    expertStatus: batchApplication?.expert?.status || STATUS.PENDING,
    expertCutoffUsed: batchApplication?.expert?.cutoffUsed ?? null,

    writtenStatus: batchApplication?.written?.status || STATUS.PENDING,
    writtenMarks: batchApplication?.written?.marks ?? null,
    writtenSchedule: batchApplication?.written?.schedule || null,

    piSelected:
      batchApplication?.pi?.selected === true
        ? true
        : batchApplication?.pi?.selected === false
        ? false
        : null,
    piMarks: batchApplication?.pi?.marks ?? null,
    piSchedule: batchApplication?.pi?.schedule || null,

    finalStatus: getFinalStatusText(batchApplication),

    currentStage: batchApplication?.currentStage || FUNNEL_STAGES.ALL,
    currentStatus: getShortlistingCurrentStatus(batchApplication),

    updatedPitchDeckType: getUpdatedPitchDeckType(deck),
    updatedPitchDeckUrl: getUpdatedPitchDeckUrl(deck),
    updatedPitchDeckStoragePath: deck?.storagePath || "",
    updatedPitchDeckFileName: deck?.fileName || "",
    updatedPitchDeckSubmittedAt: deck?.submittedAt || null,

    lastUpdatedAt: batchApplication?.lastUpdatedAt || null,
  };
};

export const buildApplicationShortlistingPatch = ({
  batchId,
  batchName,
  batchApplication,
  existingSummary = {},
  updatedPitchDeck = null,
  serverTimestampValue = null,
}) => {
  const summary = buildShortlistingSummary({
    batchId,
    batchName,
    batchApplication,
    existingSummary,
    updatedPitchDeck,
  });

  return {
    shortlistingBatch: {
      batchId: summary.batchId,
      batchName: summary.batchName,
      assignedAt: existingSummary?.assignedAt || null,
    },

    shortlistingSummary: {
      ...summary,
      updatedAt: serverTimestampValue,
    },

    firestoreUpdatedAt: serverTimestampValue,
  };
};

export const buildUnassignedShortlistingSummary = ({
  existingSummary = {},
  serverTimestampValue = null,
}) => {
  return {
    ...(existingSummary || {}),

    batchId: "",
    batchName: "",

    aiStatus: STATUS.PENDING,
    expertStatus: STATUS.PENDING,
    writtenStatus: STATUS.PENDING,
    writtenMarks: null,
    writtenSchedule: null,

    piSelected: null,
    piMarks: null,
    piSchedule: null,

    finalStatus: STATUS.PENDING,

    currentStage: "",
    currentStatus: "Not Assigned",

    updatedAt: serverTimestampValue,
  };
};

export const getStageLabel = (stage) => {
  if (stage === FUNNEL_STAGES.AI) return "AI Screening";
  if (stage === FUNNEL_STAGES.EXPERT) return "Expert Review";
  if (stage === FUNNEL_STAGES.WRITTEN) return "Written Assessment";
  if (stage === FUNNEL_STAGES.PI) return "Pitch / PI";
  if (stage === FUNNEL_STAGES.FINAL) return "Recognition";
  return "Applications";
};

export const getStatusLabel = (status) => {
  if (STATUS_LABELS[status]) return STATUS_LABELS[status];
  return safe(status);
};

export const getApplicationShortlistingSummary = (application) => {
  return application?.shortlistingSummary || null;
};

export const getApplicationShortlistingStatus = (application) => {
  const summary = getApplicationShortlistingSummary(application);

  if (!summary?.batchId) return "Not Assigned";

  return summary?.currentStatus || "Assigned - Pending";
};

export const getApplicationUpdatedPitchDeck = (application) => {
  if (application?.UpdatedPitchDeck) return application.UpdatedPitchDeck;

  const summary = getApplicationShortlistingSummary(application);

  if (summary?.updatedPitchDeckUrl) {
    return {
      type: summary.updatedPitchDeckType || "file",
      downloadURL:
        summary.updatedPitchDeckType === "canva"
          ? ""
          : summary.updatedPitchDeckUrl,
      canvaLink:
        summary.updatedPitchDeckType === "canva"
          ? summary.updatedPitchDeckUrl
          : "",
      storagePath: summary.updatedPitchDeckStoragePath || "",
      fileName: summary.updatedPitchDeckFileName || "",
      submittedAt: summary.updatedPitchDeckSubmittedAt || null,
    };
  }

  return null;
};