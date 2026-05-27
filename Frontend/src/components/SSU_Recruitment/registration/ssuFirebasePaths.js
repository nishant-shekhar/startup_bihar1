export const SSU_ROOT_COLLECTION = "SSURecruitment";
export const SSU_ROOT_DOC = "main";

export const SSU_COLLECTIONS = {
  applications: "Applications",
  counters: "Counters",
  settings: "Settings",
  payments: "Payments",
  feedback: "Feedback",
  blockedIdentifiers: "BlockedIdentifiers",
  timeline: "Timeline",
  documents: "Documents",
  review: "Review",
  evaluation: "Evaluation",
};

export const SSU_SETTINGS_DOCS = {
  formOpen: "FormOpen",
  notice: "Notice",
  fee: "Fee",
  posts: "Posts",
  stages: "Stages",
  resultAnnouncement: "ResultAnnouncement",
  paymentVerification: "PaymentVerification",
};

export const SSU_BLOCKED_TYPES = {
  email: "Email",
  phone: "Phone",
  aadhaar: "Aadhaar",
};

export const SSU_APPLICATION_STATUS = {
  draft: "draft",
  paymentPending: "payment_pending",
  paymentCompleted: "payment_completed",
  submitted: "submitted",
  underReview: "under_review",
  shortlisted: "shortlisted",
  rejected: "rejected",
  selected: "selected",
  waitlisted: "waitlisted",
};

export const SSU_PAYMENT_STATUS = {
  submittedForVerification: "submitted_for_verification",
  pending: "pending",
  verified: "verified",
  rejected: "rejected",
};

export const SSU_PAYMENT_MODE = {
  sbiCollect: "SBI_COLLECT",
};

export const SSU_TIMELINE_KEYS = {
  registrationStarted: "registrationStarted",
  paymentCompleted: "paymentCompleted",
  formSubmitted: "formSubmitted",
  stageOneScreening: "stageOneScreening",
  documentVerification: "documentVerification",
  writtenExam: "writtenExam",
  interview: "interview",
  finalSelection: "finalSelection",
  rejected: "rejected",
  waitlisted: "waitlisted",
};

export const ssuCollectionPath = {
  applications: [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.applications,
  ],

  counters: [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.counters,
  ],

  settings: [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.settings,
  ],

  payments: [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.payments,
  ],

  feedback: [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.feedback,
  ],

  blockedEmailItems: [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.blockedIdentifiers,
    SSU_BLOCKED_TYPES.email,
    "items",
  ],

  blockedPhoneItems: [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.blockedIdentifiers,
    SSU_BLOCKED_TYPES.phone,
    "items",
  ],

  blockedAadhaarItems: [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.blockedIdentifiers,
    SSU_BLOCKED_TYPES.aadhaar,
    "items",
  ],

  timeline: (applicationId) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.applications,
    applicationId,
    SSU_COLLECTIONS.timeline,
  ],

  documents: (applicationId) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.applications,
    applicationId,
    SSU_COLLECTIONS.documents,
  ],

  review: (applicationId) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.applications,
    applicationId,
    SSU_COLLECTIONS.review,
  ],

  evaluation: (applicationId) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.applications,
    applicationId,
    SSU_COLLECTIONS.evaluation,
  ],
};

export const ssuDocPath = {
  application: (applicationId) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.applications,
    applicationId,
  ],

  counter: (yearMonth) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.counters,
    yearMonth,
  ],

  settingFormOpen: () => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.settings,
    SSU_SETTINGS_DOCS.formOpen,
  ],

  settingNotice: () => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.settings,
    SSU_SETTINGS_DOCS.notice,
  ],

  settingFee: () => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.settings,
    SSU_SETTINGS_DOCS.fee,
  ],

  settingPosts: () => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.settings,
    SSU_SETTINGS_DOCS.posts,
  ],

  settingStages: () => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.settings,
    SSU_SETTINGS_DOCS.stages,
  ],

  settingResultAnnouncement: () => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.settings,
    SSU_SETTINGS_DOCS.resultAnnouncement,
  ],

  settingPaymentVerification: () => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.settings,
    SSU_SETTINGS_DOCS.paymentVerification,
  ],

  blockedEmail: (emailLower) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.blockedIdentifiers,
    SSU_BLOCKED_TYPES.email,
    "items",
    emailLower,
  ],

  blockedPhone: (phone) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.blockedIdentifiers,
    SSU_BLOCKED_TYPES.phone,
    "items",
    phone,
  ],

  blockedAadhaar: (aadhaar) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.blockedIdentifiers,
    SSU_BLOCKED_TYPES.aadhaar,
    "items",
    aadhaar,
  ],

  payment: (transactionId) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.payments,
    transactionId,
  ],

  feedback: (applicationId) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.feedback,
    applicationId,
  ],

  timelineEvent: (applicationId, eventId) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.applications,
    applicationId,
    SSU_COLLECTIONS.timeline,
    eventId,
  ],

  document: (applicationId, documentId) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.applications,
    applicationId,
    SSU_COLLECTIONS.documents,
    documentId,
  ],

  review: (applicationId, reviewId) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.applications,
    applicationId,
    SSU_COLLECTIONS.review,
    reviewId,
  ],

  evaluation: (applicationId, evaluationId) => [
    SSU_ROOT_COLLECTION,
    SSU_ROOT_DOC,
    SSU_COLLECTIONS.applications,
    applicationId,
    SSU_COLLECTIONS.evaluation,
    evaluationId,
  ],
};

export const ssuStoragePath = {
  profilePhoto: (applicationId, fileName) =>
    `ssuRecruitment/${applicationId}/profile/photo/${fileName}`,

  resume: (applicationId, fileName) =>
    `ssuRecruitment/${applicationId}/documents/resume/${fileName}`,

  qualification: (applicationId, fileName) =>
    `ssuRecruitment/${applicationId}/documents/qualification/${fileName}`,

  experience: (applicationId, fileName) =>
    `ssuRecruitment/${applicationId}/documents/experience/${fileName}`,

  identity: (applicationId, fileName) =>
    `ssuRecruitment/${applicationId}/documents/identity/${fileName}`,

  caste: (applicationId, fileName) =>
    `ssuRecruitment/${applicationId}/documents/caste/${fileName}`,

  other: (applicationId, fileName) =>
    `ssuRecruitment/${applicationId}/documents/other/${fileName}`,

  signature: (applicationId, fileName) =>
    `ssuRecruitment/${applicationId}/documents/signature/${fileName}`,

  paymentScreenshot: (applicationId, fileName) =>
    `ssuRecruitment/${applicationId}/payment/sbiCollect/screenshots/${fileName}`,

  generic: (applicationId, folder, fileName) =>
    `ssuRecruitment/${applicationId}/${folder}/${fileName}`,
};

export const normalizeEmail = (value = "") => {
  return String(value || "").trim().toLowerCase();
};

export const normalizePhone = (value = "") => {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
};

export const normalizeAadhaar = (value = "") => {
  return String(value || "").replace(/\D/g, "").slice(0, 12);
};

export const normalizeApplicationId = (value = "") => {
  return String(value || "").trim().toUpperCase();
};

export const normalizeUtr = (value = "") => {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
};

export const isValidSSUApplicationId = (value = "") => {
  return /^SSU\d{10}$/i.test(String(value || "").trim());
};

export const isValidSSUDevApplicationId = (value = "") => {
  return /^SSUDEV\d{10}$/i.test(String(value || "").trim());
};

export const isValidAnySSUApplicationId = (value = "") => {
  return isValidSSUApplicationId(value) || isValidSSUDevApplicationId(value);
};

export const buildSSUApplicationId = (yearMonth, nextNumber) => {
  return `SSU${yearMonth}${String(nextNumber).padStart(4, "0")}`;
};

export const isSafeSbiCollectLink = (value = "") => {
  if (!value) return true;

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();

    return (
      url.protocol === "https:" &&
      (host === "www.onlinesbi.sbi" ||
        host === "onlinesbi.sbi" ||
        host.endsWith(".onlinesbi.sbi"))
    );
  } catch {
    return false;
  }
};

export const buildSearchFields = ({
  applicationId = "",
  userSignup = {},
  personalDetails = {},
  paymentDetails = {},
  status = "draft",
} = {}) => {
  const fullName =
    userSignup?.fullName ||
    personalDetails?.fullName ||
    personalDetails?.applicantName ||
    "";

  const email = normalizeEmail(userSignup?.email || personalDetails?.email || "");
  const phoneNumber = normalizePhone(
    userSignup?.phoneNumber || personalDetails?.phoneNumber || ""
  );

  const aadhaar = normalizeAadhaar(
    userSignup?.aadharNumber ||
      userSignup?.aadhaarNumber ||
      personalDetails?.aadharNumber ||
      personalDetails?.aadhaarNumber ||
      ""
  );

  return {
    applicationId: normalizeApplicationId(applicationId),
    applicationIdLower: normalizeApplicationId(applicationId).toLowerCase(),
    nameLower: String(fullName || "").trim().toLowerCase(),
    emailLower: email,
    phoneNumber,
    aadhaarLast4: aadhaar ? aadhaar.slice(-4) : "",
    postAppliedFor: personalDetails?.postAppliedFor || "",
    status,
    paymentStatus: paymentDetails?.status || "",
    paymentVerificationStatus:
      paymentDetails?.verificationStatus ||
      paymentDetails?.adminVerification?.status ||
      "",
    paymentMode: paymentDetails?.paymentMode || "",
    utrNumber: normalizeUtr(paymentDetails?.utrNumber || ""),
  };
};

export const buildInitialTimelineEvent = ({
  applicationId,
  title,
  description,
}) => {
  return {
    applicationId,
    key: SSU_TIMELINE_KEYS.registrationStarted,
    title: title || "Registration Started",
    description:
      description || "Your SSU recruitment application has been created.",
    completed: true,
    visibleToApplicant: true,
    createdBy: "system",
  };
};