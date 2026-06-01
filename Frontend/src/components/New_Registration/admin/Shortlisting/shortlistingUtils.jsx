import { doc, getDoc } from "firebase/firestore";

export const BATCH_COLLECTION = "startupShortlistingBatches";
export const APP_COLLECTION = "startupApplications";

export const DEFAULT_WRITTEN_INSTRUCTION =
  "Please be available before the scheduled time and follow the instructions shared by Startup Bihar.";

export const DEFAULT_PI_INSTRUCTION =
  "Please keep your pitch deck and relevant documents ready before the scheduled interaction.";

export const EMPTY_PUBLISH_STATE = {
  aiResult: false,
  expertResult: false,
  writtenSlot: false,
  writtenResult: false,
  piSlot: false,
  piResult: false,
  finalResult: false,
};

export const EMPTY_COUNTS = {
  assigned: 0,
  aiShortlisted: 0,
  expertShortlisted: 0,
  writtenSlotAssigned: 0,
  writtenQualified: 0,
  piSlotAssigned: 0,
  piSelected: 0,
  recognised: 0,
};

export const SHORTLIST_STATUS = {
  PENDING: "pending",
  SHORTLISTED: "shortlisted",
  NOT_SHORTLISTED: "not_shortlisted",
  HOLD: "hold",
  QUALIFIED: "qualified",
  NOT_QUALIFIED: "not_qualified",
  SELECTED: "selected",
  NOT_SELECTED: "not_selected",
  RECOGNISED: "recognised",
  NOT_RECOGNISED: "not_recognised",
};

export const PUBLIC_STAGE_LABELS = {
  aiResult: "Application Screening Result",
  expertResult: "Expert Review Result",
  writtenSlot: "Written Test Schedule",
  writtenResult: "Written Assessment Result",
  piSlot: "Pitch / PI Schedule",
  piResult: "Pitch / PI Result",
  finalResult: "Final Recognition Result",
};

export const STATUS_LABELS = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  not_shortlisted: "Not Shortlisted",
  hold: "Hold",
  qualified: "Qualified",
  not_qualified: "Not Qualified",
  selected: "Selected",
  not_selected: "Not Selected",
  recognised: "Recognised",
  not_recognised: "Not Recognised",
  clarification_required: "Clarification Required",
};

export const STATUS_TONE = {
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
  clarification_required: "border-amber-200 bg-amber-50 text-amber-700",
};

export const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

export const toDate = (value) => {
  if (!value) return null;

  if (typeof value?.toDate === "function") {
    return value.toDate();
  }

  if (value?.seconds) {
    return new Date(value.seconds * 1000);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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

export const formatLongDate = (value) => {
  const date = toDate(value);
  if (!date) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatDateTime = (value) => {
  const date = toDate(value);
  if (!date) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

export const isFinalSubmittedStatus = (item) => {
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
  const isSubmitted = isFinalSubmittedStatus(item);

  if (!isSubmitted) return null;

  return (
    item?.submittedAt ||
    item?.finalSubmittedAt ||
    item?.submissionDate ||
    item?.submittedOn ||
    item?.createdAt ||
    null
  );
};

export const isEligibleForBatchPreview = (item) => {
  if (!isFinalSubmittedStatus(item)) return false;

  const effectiveDate = getEffectiveSubmittedDate(item);
  if (!effectiveDate) return false;

  return true;
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

export const getExpertReview = (item) =>
  item?._expertReview || item?.review?.expert || null;

export const getExpertScore = (item) => {
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

export const scoreText = (score) => {
  if (score === null || score === undefined || score === "") return "—";

  const n = Number(score);
  return Number.isFinite(n) ? `${n.toFixed(1)}/10` : "—";
};

export const calculateBatchCounts = (rows = []) => {
  return {
    assigned: rows.length,

    aiShortlisted: rows.filter(
      (item) => item?.aiShortlisting?.status === SHORTLIST_STATUS.SHORTLISTED
    ).length,

    expertShortlisted: rows.filter(
      (item) =>
        item?.expertShortlisting?.status === SHORTLIST_STATUS.SHORTLISTED
    ).length,

    writtenSlotAssigned: rows.filter((item) => !!item?.writtenSlot?.slotId)
      .length,

    writtenQualified: rows.filter(
      (item) => item?.written?.status === SHORTLIST_STATUS.QUALIFIED
    ).length,

    piSlotAssigned: rows.filter((item) => !!item?.piSlot?.slotId).length,

    piSelected: rows.filter((item) => item?.pi?.selected === true).length,

    recognised: rows.filter(
      (item) => item?.finalDecision?.status === SHORTLIST_STATUS.RECOGNISED
    ).length,
  };
};

export const buildBatchApplicationPayload = ({
  item,
  selectedBatchId,
  selectedBatch,
  serverTimestampValue,
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
      updatedAt: serverTimestampValue,
    },

    batchId: selectedBatchId,
    batchName: selectedBatch?.batchName || selectedBatchId,
    assignedAt: serverTimestampValue,
    lastUpdatedAt: serverTimestampValue,
  };
};

export const buildAIShortlistPayload = ({ item, cutoff, serverTimestampValue }) => {
  const score = Number(item.aiScore);

  const status =
    Number.isFinite(score) && score >= Number(cutoff)
      ? SHORTLIST_STATUS.SHORTLISTED
      : SHORTLIST_STATUS.NOT_SHORTLISTED;

  return {
    aiShortlisting: {
      ...(item.aiShortlisting || {}),
      status,
      cutoffUsed: Number(cutoff),
      remarks:
        status === SHORTLIST_STATUS.SHORTLISTED
          ? `Application screened through AI score cutoff ${cutoff}.`
          : `Application did not meet AI screening cutoff ${cutoff}.`,
      updatedAt: serverTimestampValue,
    },

    currentStage: "aiShortlisting",

    publicStatus: {
      visibleStage: "aiShortlisting",
      message:
        status === SHORTLIST_STATUS.SHORTLISTED
          ? "Your application has cleared the initial screening stage and has moved to the next level of review."
          : "Your application could not be shortlisted at the initial screening stage. We encourage you to strengthen your startup idea, improve your product readiness, and apply again in future opportunities.",
      updatedAt: serverTimestampValue,
    },

    lastUpdatedAt: serverTimestampValue,
  };
};

export const buildExpertShortlistPayload = ({
  item,
  cutoff,
  serverTimestampValue,
}) => {
  const score = Number(item.expertScore);

  const status =
    Number.isFinite(score) && score >= Number(cutoff)
      ? SHORTLIST_STATUS.SHORTLISTED
      : SHORTLIST_STATUS.NOT_SHORTLISTED;

  return {
    expertShortlisting: {
      ...(item.expertShortlisting || {}),
      status,
      cutoffUsed: Number(cutoff),
      remarks:
        status === SHORTLIST_STATUS.SHORTLISTED
          ? `Expert score matched cutoff ${cutoff}.`
          : `Expert score did not meet cutoff ${cutoff}.`,
      updatedAt: serverTimestampValue,
    },

    currentStage: "expertShortlisting",

    publicStatus: {
      visibleStage: "expertShortlisting",
      message:
        status === SHORTLIST_STATUS.SHORTLISTED
          ? "Your application has cleared the Expert Review stage and is eligible for the next step in the evaluation process."
          : "Your application could not be shortlisted after Expert Review. Please continue improving your startup model, innovation strength, and execution plan. You may apply again in future opportunities.",
      updatedAt: serverTimestampValue,
    },

    lastUpdatedAt: serverTimestampValue,
  };
};

export const buildWrittenSlotAssignmentPayload = ({
  slot,
  serverTimestampValue,
}) => {
  return {
    writtenSlot: {
      slotId: slot.id || slot.slotId,
      title: slot.title,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      mode: slot.mode,
      venue: slot.venue || "",
      instruction: slot.instruction || "",
      assignedAt: serverTimestampValue,
    },

    currentStage: "writtenSlotAssigned",

    publicStatus: {
      visibleStage: "written",
      message:
        "Your Written Assessment schedule has been assigned. Please check the date, time and instructions carefully.",
      updatedAt: serverTimestampValue,
    },

    lastUpdatedAt: serverTimestampValue,
  };
};

export const buildPiSlotAssignmentPayload = ({ slot, serverTimestampValue }) => {
  return {
    piSlot: {
      slotId: slot.id || slot.slotId,
      title: slot.title,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      mode: slot.mode,
      venue: slot.venue || "",
      instruction: slot.instruction || "",
      assignedAt: serverTimestampValue,
    },

    currentStage: "piSlotAssigned",

    publicStatus: {
      visibleStage: "pi",
      message:
        "Your Pitch / Personal Interaction schedule has been assigned. Please check the date, time and instructions carefully.",
      updatedAt: serverTimestampValue,
    },

    lastUpdatedAt: serverTimestampValue,
  };
};

export const getApplicantPublicMessage = ({ batchApplication, publish }) => {
  if (!batchApplication) {
    return "Your application has been submitted and will be reviewed by Startup Bihar.";
  }

  if (
    publish?.finalResult &&
    batchApplication?.finalDecision?.status === SHORTLIST_STATUS.RECOGNISED
  ) {
    return "Congratulations. Your startup has been recognised under the Startup Bihar initiative.";
  }

  if (
    publish?.finalResult &&
    batchApplication?.finalDecision?.status === SHORTLIST_STATUS.NOT_RECOGNISED
  ) {
    return "Your startup could not be recognised in this batch. We encourage you to continue building, improve your readiness, and apply again in a future batch.";
  }

  if (publish?.piResult && batchApplication?.pi?.selected === true) {
    return "Your startup has been selected after the Pitch / Personal Interaction stage.";
  }

  if (publish?.piResult && batchApplication?.pi?.selected === false) {
    return "Your startup could not be selected after the Pitch / Personal Interaction stage. We encourage you to keep building, improving your product, and apply again in future opportunities.";
  }

  if (
    publish?.writtenResult &&
    batchApplication?.written?.status === SHORTLIST_STATUS.QUALIFIED
  ) {
    return "You have qualified the Written Assessment stage and are eligible for the next stage.";
  }

  if (
    publish?.writtenResult &&
    batchApplication?.written?.status === SHORTLIST_STATUS.NOT_QUALIFIED
  ) {
    return "You could not qualify the Written Assessment stage this time. Please continue preparing and strengthening your startup understanding. You may apply again in future opportunities.";
  }

  if (
    publish?.expertResult &&
    batchApplication?.expertShortlisting?.status === SHORTLIST_STATUS.SHORTLISTED
  ) {
    return "Your application has cleared the Expert Review stage and is eligible for the next step in the evaluation process.";
  }

  if (
    publish?.expertResult &&
    batchApplication?.expertShortlisting?.status ===
      SHORTLIST_STATUS.NOT_SHORTLISTED
  ) {
    return "Your application could not be shortlisted after Expert Review. Please continue improving your startup model, innovation strength, and execution plan. You may apply again in future opportunities.";
  }

  if (
    publish?.aiResult &&
    batchApplication?.aiShortlisting?.status === SHORTLIST_STATUS.SHORTLISTED
  ) {
    return "Your application has cleared the initial screening stage and has moved to the next level of review.";
  }

  if (
    publish?.aiResult &&
    batchApplication?.aiShortlisting?.status ===
      SHORTLIST_STATUS.NOT_SHORTLISTED
  ) {
    return "Your application could not be shortlisted at the initial screening stage. We encourage you to strengthen your startup idea, improve your product readiness, and apply again in future opportunities.";
  }

  return "Your application is under review. Please keep checking the portal for further updates.";
};

export const readExpertReviewForApplication = async ({ db, applicationDocId }) => {
  try {
    const expertSnap = await getDoc(
      doc(db, APP_COLLECTION, applicationDocId, "review", "expert")
    );

    return expertSnap.exists() ? expertSnap.data() : null;
  } catch {
    return null;
  }
};

export const serverNow = () => serverTimestamp();