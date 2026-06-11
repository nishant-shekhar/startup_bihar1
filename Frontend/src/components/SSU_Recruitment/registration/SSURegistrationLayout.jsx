import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaBars,
  FaCheck,
  FaChartBar,
  FaClipboardCheck,
  FaClipboardList,
  FaCreditCard,
  FaEye,
  FaHome,
  FaInfoCircle,
  FaLock,
  FaShieldAlt,
  FaSignOutAlt,
  FaTimes,
  FaUserCheck,
  FaUserCircle,
  FaWallet,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

import {
  get,
  ref as rtdbRef,
  remove,
  serverTimestamp as rtdbServerTimestamp,
  set,
} from "firebase/database";

import {
  db,
  rtdb,
  storage,
} from "../../AdminRedesign/NewApplicationAdmin/firebase";

import { LanguageProvider } from "../shared/SSULanguageContext";
import SSULanguageToggle from "../shared/SSULanguageToggle";

import Notice from "./Notice";
import SSUUserSignup from "./SSUUserSignup";
import SSUPersonalDetailsStep from "./FormSteps/SSUPersonalDetailsStep";
import SSUEducationalQualificationsStep from "./FormSteps/SSUEducationalQualificationsStep";
import SSUWorkExperienceStep from "./FormSteps/SSUWorkExperienceStep";
import SSUStartupExposureStep from "./FormSteps/SSUStartupExposureStep";
import SSUReferencesAndDocsStep from "./FormSteps/SSUReferencesAndDocsStep";
import SSUPaymentStep from "./FormSteps/SSUPaymentStep";
import SSUPreview from "./SSUPreview";
import SSUPrintAcknowledgement from "./SSUPrintAcknowledgement";
import SSUFormStatus from "./SSUFormStatus";
import SSUPhoneVerificationModal from "./modals/SSUPhoneVerificationModal";
import SSUWorkingDialog from "./SSUWorkingDialog";

import {
  SSU_APPLICATION_STATUS,
  SSU_TIMELINE_KEYS,
  buildSearchFields,
  buildSSUApplicationId,
  normalizeAadhaar,
  normalizeApplicationId,
  normalizeEmail,
  normalizePhone,
  ssuCollectionPath,
  ssuDocPath,
  ssuStoragePath,
} from "./ssuFirebasePaths";

import ToR from "../shared/ToR";

const STORAGE_KEY = "ssuRecruitmentDraft";
const AUTH_KEY = "ssuRecruitmentAuth";

const stepLabels = [
  "Register",
  "Personal Details",
  "Education",
  "Work Experience",
  "Startup Exposure",
  "Reference & Document Upload",
  "Payment",
  "Preview",
  "Acknowledgement",
  "Status",
];

const icons = [
  <FaUserCheck />,
  <FaHome />,
  <FaClipboardList />,
  <FaInfoCircle />,
  <FaChartBar />,
  <FaWallet />,
  <FaCreditCard />,
  <FaEye />,
  <FaClipboardCheck />,
  <FaClipboardCheck />,
];

const initialFormData = {
  applicationId: "",
  applicationNo: "",
  formType: "ssu_recruitment",
  source: "web",
  status: SSU_APPLICATION_STATUS.draft,
  currentStep: 1,
  currentStage: "registration_started",
  statusLabel: "Draft",
  statusMessage: "Complete the application step by step.",
  adminRemarks: "",
  userSignup: null,
  duplicateIdentifierWarning: null,
  personalDetails: null,
  educationalQualifications: null,
  workExperience: null,
  startupExposure: null,
  referencesAndDocs: null,
  paymentDetails: null,
  search: {},
  flags: {
    isDeleted: false,
    isLocked: false,
    duplicateChecked: false,
    documentsVerified: false,
    paymentVerified: false,
  },
  createdAt: null,
  updatedAt: null,
  submittedAt: null,
};

const formatDeadline = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(Number(timestamp));
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const buildYearMonthFromTimestamp = (timestamp) => {
  const date = new Date(Number(timestamp));

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid server timestamp received.");
  }

  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
};

const uniqueArray = (items = []) => {
  return Array.from(
    new Set(
      items
        .filter(Boolean)
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    )
  );
};

async function sha256(text) {
  const encoded = new TextEncoder().encode(String(text || ""));
  const buffer = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const getServerNowFromRTDB = async () => {
  const tempKey = `ssu_ts_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;

  const tempRef = rtdbRef(rtdb, `SSURecruitment/tempServerTime/${tempKey}`);

  await set(tempRef, { ts: rtdbServerTimestamp() });

  const snap = await get(tempRef);
  const serverNow = snap.exists() ? snap.val()?.ts : null;

  try {
    await remove(tempRef);
  } catch (error) {
    console.warn("Could not remove temporary server time node", error);
  }

  if (!serverNow || Number.isNaN(Number(serverNow))) {
    throw new Error("Could not fetch trusted server time.");
  }

  return Number(serverNow);
};

async function generateIncrementalApplicationId() {
  const serverNow = await getServerNowFromRTDB();
  const yearMonth = buildYearMonthFromTimestamp(serverNow);

  const counterRef = doc(db, ...ssuDocPath.counter(yearMonth));

  const nextNumber = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef);

    if (!snap.exists()) {
      transaction.set(counterRef, {
        yearMonth,
        lastNumber: 1,
        serverNow,
        updatedAt: serverTimestamp(),
      });

      return 1;
    }

    const current = Number(snap.data()?.lastNumber || 0);
    const updated = current + 1;

    transaction.update(counterRef, {
      lastNumber: updated,
      serverNow,
      updatedAt: serverTimestamp(),
    });

    return updated;
  });

  return buildSSUApplicationId(yearMonth, nextNumber);
}

const removeFileObjects = (value) => {
  if (value instanceof File) return null;

  if (Array.isArray(value)) {
    return value.map((item) => removeFileObjects(item));
  }

  if (value && typeof value === "object") {
    const clean = {};

    Object.entries(value).forEach(([key, item]) => {
      clean[key] = removeFileObjects(item);
    });

    return clean;
  }

  return value;
};

function RegistrationLayoutInner() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [submissionWindow, setSubmissionWindow] = useState({
    checked: false,
    isOpen: true,
    close: false,
    lastDate: null,
    serverNow: null,
    message: "",
  });

  const [workingDialog, setWorkingDialog] = useState({
    open: false,
    title: "",
    message: "",
  });

  const [authState, setAuthState] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [showForgotPhoneModal, setShowForgotPhoneModal] = useState(false);
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);

  const [showResetOtpModal, setShowResetOtpModal] = useState(false);
  const [resetAccount, setResetAccount] = useState(null);

  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [resetPasswordError, setResetPasswordError] = useState("");
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);

  const appId = formData.applicationId;
  const isSubmitted = formData.status === SSU_APPLICATION_STATUS.submitted;
  const isLoggedIn = !!authState?.applicationId;

  const openWorkingDialog = useCallback((title, message) => {
    setWorkingDialog({ open: true, title, message });
  }, []);

  const closeWorkingDialog = useCallback(() => {
    setWorkingDialog({ open: false, title: "", message: "" });
  }, []);

  const persistLocalDraft = useCallback((data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(removeFileObjects(data)));
  }, []);

  const persistAuth = useCallback((auth) => {
    if (!auth) {
      localStorage.removeItem(AUTH_KEY);
      setAuthState(null);
      return;
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    setAuthState(auth);
  }, []);

  const createOrGetApplicationId = useCallback(async () => {
    if (formData.applicationId) return formData.applicationId;
    return await generateIncrementalApplicationId();
  }, [formData.applicationId]);

  const uploadFileAndGetMeta = useCallback(async (file, path) => {
    if (!file) return null;

    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    return {
      fileName: file.name,
      contentType: file.type || "",
      size: file.size || 0,
      storagePath: path,
      downloadURL,
      uploadedAt: new Date().toISOString(),
    };
  }, []);

  const getStepFromData = useCallback((data) => {
    if (!data) return 1;
    if (data.status === SSU_APPLICATION_STATUS.submitted) return 9;
    if (data.paymentDetails) return 8;
    if (data.referencesAndDocs) return 7;
    if (data.startupExposure) return 6;
    if (data.workExperience) return 5;
    if (data.educationalQualifications) return 4;
    if (data.personalDetails) return 3;
    if (data.userSignup) return 2;
    return 1;
  }, []);

  const refreshSubmissionWindow = useCallback(async () => {
    try {
      const snap = await getDoc(doc(db, ...ssuDocPath.settingFormOpen()));
      const value = snap.exists() ? snap.data() : null;

      const serverNow = await getServerNowFromRTDB();

      const isManuallyClosed = value?.close === true || value?.isOpen === false;
      const lastDate = Number(value?.lastDate || 0);
      const hasDeadline = lastDate > 0;
      const deadlinePassed = hasDeadline ? serverNow > lastDate : false;

      let allowed = true;
      let message = "";

      if (isManuallyClosed) {
        allowed = false;
        message = value?.message || "Form submission is closed.";
      } else if (deadlinePassed) {
        allowed = false;
        message = `Submission closed on ${formatDeadline(lastDate)}.`;
      }

      const state = {
        checked: true,
        isOpen: allowed,
        close: isManuallyClosed,
        lastDate: lastDate || null,
        serverNow,
        message,
      };

      setSubmissionWindow(state);
      return state;
    } catch (error) {
      console.error("Failed to verify SSU form window", error);

      const state = {
        checked: true,
        isOpen: false,
        close: true,
        lastDate: null,
        serverNow: null,
        message: "Unable to verify submission window right now.",
      };

      setSubmissionWindow(state);
      return state;
    }
  }, []);

  const checkSubmissionWindow = useCallback(async () => {
    const state = await refreshSubmissionWindow();

    if (!state.isOpen) {
      return {
        allowed: false,
        message: state.message || "Submission is currently closed.",
      };
    }

    return { allowed: true };
  }, [refreshSubmissionWindow]);

  const loadApplicationById = useCallback(
    async (applicationId) => {
      if (!applicationId) return null;

      const snap = await getDoc(
        doc(db, ...ssuDocPath.application(applicationId))
      );

      if (!snap.exists()) return null;

      const data = {
        ...initialFormData,
        ...snap.data(),
        applicationId: snap.data()?.applicationId || snap.id,
      };

      setFormData(data);
      setCurrentStep(getStepFromData(data));
      persistLocalDraft(data);

      return data;
    },
    [getStepFromData, persistLocalDraft]
  );

  useEffect(() => {
    refreshSubmissionWindow();
  }, [refreshSubmissionWindow]);

  useEffect(() => {
    const loadDraft = async () => {
      setIsInitialLoading(true);

      try {
        const savedAuthRaw = localStorage.getItem(AUTH_KEY);
        const savedAuth = savedAuthRaw ? JSON.parse(savedAuthRaw) : null;

        if (savedAuth?.applicationId) {
          try {
            openWorkingDialog(
              "Loading your application",
              "Please wait while we restore your saved details."
            );

            const loaded = await loadApplicationById(savedAuth.applicationId);
            if (loaded) return;
          } finally {
            closeWorkingDialog();
          }
        }

        const savedDraftRaw = localStorage.getItem(STORAGE_KEY);
        const savedDraft = savedDraftRaw ? JSON.parse(savedDraftRaw) : null;

        if (savedDraft) {
          const merged = { ...initialFormData, ...savedDraft };
          setFormData(merged);
          setCurrentStep(getStepFromData(merged));
        }
      } catch (error) {
        console.error("Failed to restore SSU draft", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadDraft();
  }, [
    closeWorkingDialog,
    getStepFromData,
    loadApplicationById,
    openWorkingDialog,
  ]);

  const savePaymentAudit = useCallback(
    async ({ applicationId, paymentDetails }) => {
      if (!applicationId) return;

      const paymentDocId =
        paymentDetails?.transactionId ||
        paymentDetails?.utrNumber ||
        `manual_${applicationId}_${Date.now()}`;

      await setDoc(
        doc(db, ...ssuDocPath.payment(paymentDocId)),
        {
          applicationId,
          applicationNo: applicationId,
          applicantName:
            formData?.personalDetails?.fullName ||
            formData?.userSignup?.fullName ||
            "",
          phoneNumber:
            formData?.personalDetails?.phoneNumber ||
            formData?.userSignup?.phoneNumber ||
            "",
          email:
            formData?.personalDetails?.email ||
            formData?.userSignup?.email ||
            "",

          status: paymentDetails?.status || "submitted_for_verification",
          verificationStatus: paymentDetails?.verificationStatus || "pending",
          amount: Number(paymentDetails?.amount || 1000),
          currency: paymentDetails?.currency || "INR",
          paymentMode: paymentDetails?.paymentMode || "SBI_COLLECT",

          sbiCollectLink: paymentDetails?.sbiCollectLink || "",
          utrNumber: paymentDetails?.utrNumber || "",
          paymentDate: paymentDetails?.paymentDate || "",
          paymentScreenshotMeta: paymentDetails?.paymentScreenshotMeta || null,

          applicantDeclaration: paymentDetails?.applicantDeclaration === true,
          verified: false,

          adminVerification: paymentDetails?.adminVerification || {
            status: "pending",
            verifiedBy: "",
            verifiedAt: null,
            remarks: "",
            utrVerified: false,
          },

          createdAt: serverTimestamp(),
          submittedAt: paymentDetails?.submittedAt || new Date().toISOString(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    [formData]
  );

  const saveTimelineEvent = useCallback(
    async ({ applicationId, eventId, data }) => {
      if (!applicationId || !eventId) return;

      await setDoc(
        doc(db, ...ssuDocPath.timelineEvent(applicationId, eventId)),
        {
          applicationId,
          ...data,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    []
  );

  const saveSectionToFirestore = useCallback(
    async ({ applicationId, sectionKey, payload, nextStep, preserveStatus }) => {
      if (!applicationId || !sectionKey) return;

      setIsSaving(true);
      setSaveMessage("Saving...");
      openWorkingDialog(
        "Saving your details",
        "Please wait while we securely save this step."
      );

      try {
        const existingStatus = preserveStatus || SSU_APPLICATION_STATUS.draft;

        const nextSearch = buildSearchFields({
          applicationId,
          userSignup:
            sectionKey === "userSignup" ? payload : formData.userSignup || {},
          personalDetails:
            sectionKey === "personalDetails"
              ? payload
              : formData.personalDetails || {},
          status: existingStatus,
        });

        const basePayload = {
          applicationId,
          applicationNo: applicationId,
          formType: "ssu_recruitment",
          source: "web",
          status: existingStatus,
          currentStep: nextStep ?? currentStep,
          currentStage:
            existingStatus === SSU_APPLICATION_STATUS.submitted
              ? "submitted"
              : "draft",
          statusLabel:
            existingStatus === SSU_APPLICATION_STATUS.submitted
              ? "Application Submitted"
              : "Draft",
          statusMessage:
            existingStatus === SSU_APPLICATION_STATUS.submitted
              ? "Your application has been submitted successfully and is awaiting review."
              : "Complete the application step by step.",
          [sectionKey]: payload,
          search: nextSearch,
          updatedAt: serverTimestamp(),
        };

        if (sectionKey === "userSignup") {
          basePayload.createdAt = serverTimestamp();
          basePayload.flags = {
            isDeleted: false,
            isLocked: false,
            duplicateChecked: true,
            documentsVerified: false,
            paymentVerified: false,
          };

          if (payload?.duplicateIdentifierWarning) {
            basePayload.duplicateIdentifierWarning =
              payload.duplicateIdentifierWarning;
          }
        }

        if (sectionKey === "paymentDetails") {
          basePayload.status = SSU_APPLICATION_STATUS.paymentPending;
          basePayload.currentStage = "payment_submitted_for_verification";
          basePayload.statusLabel = "Payment Verification Pending";
          basePayload.statusMessage =
            "Your payment proof has been submitted and is pending verification.";
          basePayload.flags = {
            ...(formData.flags || {}),
            paymentVerified: false,
          };
        }

        await setDoc(
          doc(db, ...ssuDocPath.application(applicationId)),
          basePayload,
          { merge: true }
        );

        if (sectionKey === "paymentDetails") {
          await savePaymentAudit({ applicationId, paymentDetails: payload });

          await saveTimelineEvent({
            applicationId,
            eventId: SSU_TIMELINE_KEYS.paymentCompleted,
            data: {
              key: SSU_TIMELINE_KEYS.paymentCompleted,
              title: "Payment Proof Submitted",
              description:
                "Payment screenshot and transaction details have been submitted for verification.",
              completed: true,
              visibleToApplicant: true,
              createdBy: "system",
              createdAt: serverTimestamp(),
            },
          });
        }

        setSaveMessage("Saved");
      } catch (error) {
        console.error(`Failed to save ${sectionKey}`, error);
        setSaveMessage("Save failed");
      } finally {
        closeWorkingDialog();
        setIsSaving(false);
        setTimeout(() => setSaveMessage(""), 1500);
      }
    },
    [
      currentStep,
      formData,
      openWorkingDialog,
      closeWorkingDialog,
      savePaymentAudit,
      saveTimelineEvent,
    ]
  );

  const checkIdentifierExists = useCallback(
    async ({ email, phoneNumber, aadharNumber, currentApplicationId = "" }) => {
      const currentId = normalizeApplicationId(currentApplicationId);
      const normalizedEmail = normalizeEmail(email);
      const normalizedPhone = normalizePhone(phoneNumber);
      const normalizedAadhaar = normalizeAadhaar(aadharNumber);

      const readIds = async (pathParts) => {
        const snap = await getDoc(doc(db, ...pathParts));

        if (!snap.exists()) return [];

        const data = snap.data() || {};

        return uniqueArray([
          ...(Array.isArray(data.applicationIds) ? data.applicationIds : []),
          data.applicationId,
          data.latestApplicationId,
        ])
          .map((id) => normalizeApplicationId(id))
          .filter((id) => id && id !== currentId);
      };

      const matches = [];

      if (normalizedEmail) {
        const ids = await readIds(ssuDocPath.blockedEmail(normalizedEmail));
        if (ids.length) {
          matches.push({
            field: "email",
            label: "Email ID",
            existingApplicationIds: ids,
            count: ids.length,
          });
        }
      }

      if (normalizedPhone) {
        const ids = await readIds(ssuDocPath.blockedPhone(normalizedPhone));
        if (ids.length) {
          matches.push({
            field: "mobile",
            label: "Mobile Number",
            existingApplicationIds: ids,
            count: ids.length,
          });
        }
      }

      if (normalizedAadhaar) {
        const ids = await readIds(ssuDocPath.blockedAadhaar(normalizedAadhaar));
        if (ids.length) {
          matches.push({
            field: "aadhaar",
            label: "Aadhaar Number",
            existingApplicationIds: ids,
            count: ids.length,
          });
        }
      }

      return {
        hasDuplicate: matches.length > 0,
        matchedFields: matches.map((item) => item.field),
        existingApplicationIds: uniqueArray(
          matches.flatMap((item) => item.existingApplicationIds)
        ),
        matches,
      };
    },
    []
  );

  const blockIdentifiersAfterRegistration = useCallback(
    async ({ userSignup, applicationId }) => {
      if (!applicationId || !userSignup) return;

      const email = normalizeEmail(userSignup.email);
      const phone = normalizePhone(userSignup.phoneNumber);
      const aadhaar = normalizeAadhaar(
        userSignup.aadharNumber || userSignup.aadhaarNumber
      );

      const upsertIdentifierIndex = async ({ pathParts, type, value }) => {
        if (!value) return;

        const ref = doc(db, ...pathParts);
        const snap = await getDoc(ref);
        const existing = snap.exists() ? snap.data() || {} : {};

        const applicationIds = uniqueArray([
          ...(Array.isArray(existing.applicationIds)
            ? existing.applicationIds
            : []),
          existing.applicationId,
          existing.latestApplicationId,
          applicationId,
        ]).map((id) => normalizeApplicationId(id));

        await setDoc(
          ref,
          {
            identifierType: type,
            type,
            identifierValue: value,
            value,

            applicationIds,
            count: applicationIds.length,
            latestApplicationId: applicationId,
            latestFullName: userSignup.fullName || "",
            latestEmail: email,
            latestPhoneNumber: phone,

            reason: "application_created",
            updatedAt: serverTimestamp(),
            blockedAt: existing.blockedAt || serverTimestamp(),
          },
          { merge: true }
        );
      };

      await Promise.all([
        upsertIdentifierIndex({
          pathParts: ssuDocPath.blockedEmail(email),
          type: "email",
          value: email,
        }),
        upsertIdentifierIndex({
          pathParts: ssuDocPath.blockedPhone(phone),
          type: "phone",
          value: phone,
        }),
        upsertIdentifierIndex({
          pathParts: ssuDocPath.blockedAadhaar(aadhaar),
          type: "aadhaar",
          value: aadhaar,
        }),
      ]);
    },
    []
  );

  const transformStepDataForStorage = useCallback(
    async (stepData, step, applicationId) => {
      if (![2, 6, 7].includes(step)) {
        return removeFileObjects(stepData);
      }

      if (step === 2) {
        const next = {
          ...stepData,
        };

        if (stepData.profilePhotoFile instanceof File) {
          if (stepData.profilePhotoFile.size > 1 * 1024 * 1024) {
            throw new Error("Profile photo must be 1 MB or less.");
          }

          if (!stepData.profilePhotoFile.type?.startsWith("image/")) {
            throw new Error("Profile photo must be an image file.");
          }

          openWorkingDialog(
            "Uploading profile photo",
            "Please wait while we upload your profile photo."
          );

          next.profilePhotoMeta = await uploadFileAndGetMeta(
            stepData.profilePhotoFile,
            ssuStoragePath.generic(
              applicationId,
              "profile/photo",
              `${Date.now()}-${stepData.profilePhotoFile.name}`
            )
          );
        }

        delete next.profilePhotoFile;
        return removeFileObjects(next);
      }

      if (step === 6) {
        const next = {
          ...stepData,
          documents: { ...(stepData.documents || {}) },
        };

        const documentFiles = stepData.documentFiles || {};

        for (const [key, file] of Object.entries(documentFiles)) {
          if (file instanceof File) {
            openWorkingDialog(
              "Uploading document",
              `Please wait while we upload ${file.name}.`
            );

            const meta = await uploadFileAndGetMeta(
              file,
              ssuStoragePath.generic(
                applicationId,
                `documents/${key}`,
                `${Date.now()}-${file.name}`
              )
            );

            next.documents[key] = meta;
          }
        }

        if (stepData.signatureFile instanceof File) {
          if (stepData.signatureFile.size > 200 * 1024) {
            throw new Error("Signature file must be 200 KB or less.");
          }

          openWorkingDialog(
            "Uploading signature",
            "Please wait while we upload your signature."
          );

          next.signatureMeta = await uploadFileAndGetMeta(
            stepData.signatureFile,
            ssuStoragePath.generic(
              applicationId,
              "documents/signature",
              `${Date.now()}-${stepData.signatureFile.name}`
            )
          );
        }

        delete next.documentFiles;
        delete next.signatureFile;

        return removeFileObjects(next);
      }

      if (step === 7) {
        const next = {
          ...stepData,
          status: "submitted_for_verification",
          verificationStatus: "pending",
          amount: Number(stepData?.amount || 1000),
          currency: stepData?.currency || "INR",
          paymentMode: stepData?.paymentMode || "SBI_COLLECT",
          verified: false,
          submittedAt: stepData?.submittedAt || new Date().toISOString(),
          adminVerification: stepData?.adminVerification || {
            status: "pending",
            verifiedBy: "",
            verifiedAt: null,
            remarks: "",
            utrVerified: false,
          },
        };

        if (stepData.paymentScreenshotFile instanceof File) {
          openWorkingDialog(
            "Uploading payment proof",
            "Please wait while we upload your payment screenshot."
          );

          const file = stepData.paymentScreenshotFile;

          next.paymentScreenshotMeta = await uploadFileAndGetMeta(
            file,
            ssuStoragePath.generic(
              applicationId,
              "payment/screenshots",
              `${Date.now()}-${file.name}`
            )
          );
        }

        delete next.paymentScreenshotFile;

        return removeFileObjects(next);
      }

      return removeFileObjects(stepData);
    },
    [openWorkingDialog, uploadFileAndGetMeta]
  );

  const handleStepSubmit = useCallback(
    async (rawStepData, step) => {
      if (isSubmitted) {
        return { ok: false, error: "Application already submitted." };
      }

      let nextFormData = { ...formData };
      let sectionKey = "";
      let nextStep = step + 1;

      try {
        if (step === 1 && rawStepData?.type === "skipToNext") {
          setCurrentStep(2);
          return { ok: true };
        }

        if (step === 1) {
          if (isLoggedIn && formData.applicationId && formData.userSignup) {
            setCurrentStep(2);
            return { ok: true };
          }

          openWorkingDialog(
            "Checking your details",
            "Please wait while we validate your registration information."
          );

          const duplicateInfo = await checkIdentifierExists({
            email: rawStepData.email,
            phoneNumber: rawStepData.phoneNumber,
            aadharNumber: rawStepData.aadharNumber,
          });

          const duplicateAccepted =
            rawStepData?.duplicateIdentifierWarning?.accepted === true;

          if (duplicateInfo.hasDuplicate && !duplicateAccepted) {
            closeWorkingDialog();

            return {
              ok: false,
              error:
                "An existing application was found with the same mobile, Aadhaar, or email. Please confirm the duplicate warning before continuing.",
              duplicateInfo,
            };
          }

          const duplicateIdentifierWarning = duplicateInfo.hasDuplicate
            ? {
                shown: true,
                accepted: true,
                acceptedAt:
                  rawStepData?.duplicateIdentifierWarning?.acceptedAt ||
                  new Date().toISOString(),
                matchedFields: duplicateInfo.matchedFields,
                existingApplicationIds: duplicateInfo.existingApplicationIds,
                matches: duplicateInfo.matches,
              }
            : null;

          const applicationId = await createOrGetApplicationId();
          const passwordHash = await sha256(rawStepData.password);

          sectionKey = "userSignup";

          nextFormData = {
            ...nextFormData,
            applicationId,
            applicationNo: applicationId,
            userSignup: {
              fullName: rawStepData.fullName || "",
              email: normalizeEmail(rawStepData.email),
              phoneNumber: normalizePhone(rawStepData.phoneNumber),
              aadharNumber: normalizeAadhaar(rawStepData.aadharNumber),
              phoneVerified: true,
              registrationType: rawStepData.type || "registration",
              registeredAt:
                rawStepData.registeredAt || new Date().toISOString(),
              passwordHash,
              duplicateIdentifierWarning,
            },
            duplicateIdentifierWarning,
          };

          persistAuth({
            applicationId,
            fullName: nextFormData.userSignup.fullName,
            email: nextFormData.userSignup.email,
            phoneNumber: nextFormData.userSignup.phoneNumber,
          });
        } else {
          const applicationId =
            nextFormData.applicationId || (await createOrGetApplicationId());

          nextFormData.applicationId = applicationId;
          nextFormData.applicationNo = applicationId;

          const stepData = await transformStepDataForStorage(
            rawStepData,
            step,
            applicationId
          );

          if (step === 2) {
            sectionKey = "personalDetails";
            nextFormData.personalDetails = stepData;
          } else if (step === 3) {
            sectionKey = "educationalQualifications";
            nextFormData.educationalQualifications = stepData;
          } else if (step === 4) {
            sectionKey = "workExperience";
            nextFormData.workExperience = stepData;
          } else if (step === 5) {
            sectionKey = "startupExposure";
            nextFormData.startupExposure = stepData;
          } else if (step === 6) {
            sectionKey = "referencesAndDocs";
            nextFormData.referencesAndDocs = stepData;
            nextStep = 7;
          } else if (step === 7) {
            sectionKey = "paymentDetails";
            nextFormData.paymentDetails = {
              status: "submitted_for_verification",
              verificationStatus: "pending",
              amount: Number(stepData?.amount || 1000),
              currency: stepData?.currency || "INR",
              paymentMode: stepData?.paymentMode || "SBI_COLLECT",
              verified: false,
              adminVerification: {
                status: "pending",
                verifiedBy: "",
                verifiedAt: null,
                remarks: "",
                utrVerified: false,
              },
              ...stepData,
            };
            nextStep = 8;
          }
        }

        nextFormData = {
          ...nextFormData,
          currentStep: nextStep,
          search: buildSearchFields({
            applicationId: nextFormData.applicationId,
            userSignup: nextFormData.userSignup || {},
            personalDetails: nextFormData.personalDetails || {},
            status: nextFormData.status,
          }),
        };

        setFormData(nextFormData);
        persistLocalDraft(nextFormData);

        if (sectionKey) {
          await saveSectionToFirestore({
            applicationId: nextFormData.applicationId,
            sectionKey,
            payload: nextFormData[sectionKey],
            nextStep,
            preserveStatus: SSU_APPLICATION_STATUS.draft,
          });
        }

        if (
          step === 1 &&
          !isLoggedIn &&
          nextFormData?.applicationId &&
          nextFormData?.userSignup
        ) {
          await blockIdentifiersAfterRegistration({
            userSignup: nextFormData.userSignup,
            applicationId: nextFormData.applicationId,
          });

          await saveTimelineEvent({
            applicationId: nextFormData.applicationId,
            eventId: SSU_TIMELINE_KEYS.registrationStarted,
            data: {
              key: SSU_TIMELINE_KEYS.registrationStarted,
              title: "Registration Started",
              description: "Your SSU recruitment application has been created.",
              completed: true,
              visibleToApplicant: true,
              createdBy: "system",
              createdAt: serverTimestamp(),
            },
          });
        }

        closeWorkingDialog();
        setCurrentStep(nextStep);

        return { ok: true };
      } catch (error) {
        console.error("Step submission failed", error);
        closeWorkingDialog();

        return {
          ok: false,
          error: error.message || "Could not save this step. Please try again.",
        };
      }
    },
    [
      blockIdentifiersAfterRegistration,
      checkIdentifierExists,
      closeWorkingDialog,
      createOrGetApplicationId,
      formData,
      isLoggedIn,
      isSubmitted,
      openWorkingDialog,
      persistAuth,
      persistLocalDraft,
      saveSectionToFirestore,
      saveTimelineEvent,
      transformStepDataForStorage,
    ]
  );

  const handleFinalSubmit = useCallback(async () => {
    if (!formData.applicationId || isSubmitted) return;

    const windowCheck = await checkSubmissionWindow();

    if (!windowCheck.allowed) {
      setSaveMessage(windowCheck.message || "Submission is currently closed.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("Submitting...");
    openWorkingDialog(
      "Submitting your application",
      "Please wait while we finalize and submit your application."
    );

    try {
      await setDoc(
        doc(db, ...ssuDocPath.application(formData.applicationId)),
        {
          applicationId: formData.applicationId,
          applicationNo: formData.applicationId,
          status: SSU_APPLICATION_STATUS.submitted,
          statusLabel: "Application Submitted",
          statusMessage:
            "Your application has been submitted successfully. Payment proof is subject to admin verification.",
          currentStage: "submitted_payment_verification_pending",
          currentStep: 9,
          search: buildSearchFields({
            applicationId: formData.applicationId,
            userSignup: formData.userSignup || {},
            personalDetails: formData.personalDetails || {},
            status: SSU_APPLICATION_STATUS.submitted,
          }),
          submittedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await saveTimelineEvent({
        applicationId: formData.applicationId,
        eventId: SSU_TIMELINE_KEYS.formSubmitted,
        data: {
          key: SSU_TIMELINE_KEYS.formSubmitted,
          title: "Application Submitted",
          description:
            "Your SSU recruitment application has been submitted successfully. Payment verification is pending.",
          completed: true,
          visibleToApplicant: true,
          createdBy: "system",
          createdAt: serverTimestamp(),
        },
      });

      await refreshSubmissionWindow();

      const updated = {
        ...formData,
        status: SSU_APPLICATION_STATUS.submitted,
        statusLabel: "Application Submitted",
        statusMessage:
          "Your application has been submitted successfully. Payment proof is subject to admin verification.",
        currentStage: "submitted_payment_verification_pending",
        currentStep: 9,
      };

      setFormData(updated);
      persistLocalDraft(updated);
      setCurrentStep(9);
      setSaveMessage("Submitted");
    } catch (error) {
      console.error("Final submit failed", error);
      setSaveMessage("Submit failed");
    } finally {
      closeWorkingDialog();
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 1800);
    }
  }, [
    checkSubmissionWindow,
    closeWorkingDialog,
    formData,
    isSubmitted,
    openWorkingDialog,
    persistLocalDraft,
    refreshSubmissionWindow,
    saveTimelineEvent,
  ]);

  const handlePrevious = (step) => {
    if (step <= 1) return;

    if (isSubmitted) {
      if (step === 10) setCurrentStep(9);
      else if (step === 9) setCurrentStep(8);
      return;
    }

    setCurrentStep(step - 1);
  };

  const resetForgotPasswordFlow = () => {
    setShowForgotPhoneModal(false);
    setForgotPhone("");
    setForgotPasswordError("");
    setForgotPasswordLoading(false);
    setShowResetOtpModal(false);
    setResetAccount(null);
    setShowResetPasswordModal(false);
    setNewPassword("");
    setConfirmNewPassword("");
    setResetPasswordError("");
    setResetPasswordLoading(false);
  };

  const handleLogout = () => {
    persistAuth(null);
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
    setCurrentStep(1);
    setMobileNavOpen(false);
    setShowLoginModal(false);
    resetForgotPasswordFlow();
  };

  const findApplicationForLogin = async (identifier, passwordHash = "") => {
    const trimmed = String(identifier || "").trim();
    const applicationsRef = collection(db, ...ssuCollectionPath.applications);

    if (/^SSU\d{10}$/i.test(trimmed)) {
      const applicationId = normalizeApplicationId(trimmed);
      const snap = await getDoc(
        doc(db, ...ssuDocPath.application(applicationId))
      );

      if (!snap.exists()) return null;

      const data = { id: snap.id, ...snap.data() };

      if (passwordHash && data?.userSignup?.passwordHash !== passwordHash) {
        return null;
      }

      return data;
    }

    const queries = [];

    if (/^\d{10}$/.test(trimmed)) {
      queries.push(
        query(
          applicationsRef,
          where("userSignup.phoneNumber", "==", normalizePhone(trimmed)),
          limit(20)
        )
      );
    } else {
      queries.push(
        query(
          applicationsRef,
          where("userSignup.email", "==", normalizeEmail(trimmed)),
          limit(20)
        )
      );
    }

    for (const q of queries) {
      const result = await getDocs(q);

      if (!result.empty) {
        const rows = result.docs.map((d) => ({ id: d.id, ...d.data() }));

        if (passwordHash) {
          const exact = rows.find(
            (item) => item?.userSignup?.passwordHash === passwordHash
          );
          if (exact) return exact;
        } else {
          return rows[0];
        }
      }
    }

    return null;
  };

  const handleInlineLogin = async () => {
    setLoginError("");

    if (!loginIdentifier.trim()) {
      setLoginError("Enter registration number, email or mobile number.");
      return;
    }

    if (!loginPassword) {
      setLoginError("Enter password.");
      return;
    }

    try {
      setLoginLoading(true);

      const passwordHash = await sha256(loginPassword);
      const application = await findApplicationForLogin(
        loginIdentifier,
        passwordHash
      );

      if (!application) {
        setLoginError("Invalid login details.");
        return;
      }

      const applicationId = normalizeApplicationId(
        application.applicationId || application.id
      );

      persistAuth({
        applicationId,
        fullName: application?.userSignup?.fullName || "",
        email: application?.userSignup?.email || "",
        phoneNumber: application?.userSignup?.phoneNumber || "",
      });

      setShowLoginModal(false);
      setLoginIdentifier("");
      setLoginPassword("");
      await loadApplicationById(applicationId);
    } catch (error) {
      console.error("Login failed", error);
      setLoginError("Could not login. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotPasswordSendOtp = async () => {
    setForgotPasswordError("");

    const phone = normalizePhone(forgotPhone);

    if (phone.length !== 10) {
      setForgotPasswordError("Enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setForgotPasswordLoading(true);

      const applicationsRef = collection(db, ...ssuCollectionPath.applications);
      const q = query(
        applicationsRef,
        where("userSignup.phoneNumber", "==", phone),
        limit(1)
      );

      const result = await getDocs(q);

      if (result.empty) {
        setForgotPasswordError(
          "No application found with this mobile number."
        );
        return;
      }

      const d = result.docs[0];
      const account = { id: d.id, ...d.data() };

      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE || "https://startup.bihar.gov.in/newapi"
        }/otp-auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile: phone }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setForgotPasswordError(data.message || "Could not send OTP.");
        return;
      }

      setResetAccount(account);
      setShowForgotPhoneModal(false);
      setShowResetOtpModal(true);
    } catch (error) {
      console.error("Forgot password OTP failed", error);
      setForgotPasswordError("Could not send OTP. Please try again.");
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetOtpVerified = () => {
    setShowResetOtpModal(false);
    setShowResetPasswordModal(true);
  };

  const handleResetPasswordSubmit = async () => {
    setResetPasswordError("");

    if (!newPassword || newPassword.length < 6) {
      setResetPasswordError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setResetPasswordError("Passwords do not match.");
      return;
    }

    if (!resetAccount) {
      setResetPasswordError("Reset account not found.");
      return;
    }

    try {
      setResetPasswordLoading(true);

      const applicationId = normalizeApplicationId(
        resetAccount.applicationId || resetAccount.id
      );

      const passwordHash = await sha256(newPassword);

      await setDoc(
        doc(db, ...ssuDocPath.application(applicationId)),
        {
          "userSignup.passwordHash": passwordHash,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      resetForgotPasswordFlow();
      setShowLoginModal(true);
      setLoginIdentifier(
        resetAccount?.userSignup?.email ||
          resetAccount?.userSignup?.phoneNumber ||
          applicationId
      );
      setLoginPassword("");
      setLoginError("Password updated. Please login with the new password.");
    } catch (error) {
      console.error("Reset password failed", error);
      setResetPasswordError("Could not update password.");
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const isStepCompleted = useCallback(
    (n) => {
      if (n === 1) return !!formData.userSignup;
      if (n === 2) return !!formData.personalDetails;
      if (n === 3) return !!formData.educationalQualifications;
      if (n === 4) return !!formData.workExperience;
      if (n === 5) return !!formData.startupExposure;
      if (n === 6) return !!formData.referencesAndDocs;
      if (n === 7) return !!formData.paymentDetails;
      if (n === 8) return isSubmitted;
      if (n === 9) return isSubmitted;
      if (n === 10) return isSubmitted;
      return false;
    },
    [formData, isSubmitted]
  );

  const isLocked = (n) => {
    const hasRegisteredOrLoggedIn =
      !!formData.userSignup || !!authState?.applicationId || isLoggedIn;

    if (isSubmitted) {
      if (n >= 1 && n <= 7) return true;
      if (n === 8 || n === 9 || n === 10) return false;
      return true;
    }

    if (!hasRegisteredOrLoggedIn) {
      return n !== 1;
    }

    if (hasRegisteredOrLoggedIn) {
      if (n >= 1 && n <= 8) return false;
      if (n === 9 || n === 10) return true;
    }

    return true;
  };

  const handleTabClick = (stepIndex) => {
    const stepNumber = stepIndex + 1;

    if (isLocked(stepNumber)) return;

    setCurrentStep(stepNumber);
    setMobileNavOpen(false);
  };

  const progressPercent = useMemo(() => {
    const completedSteps = [1, 2, 3, 4, 5, 6, 7].filter((n) =>
      isStepCompleted(n)
    ).length;

    const finalSubmitDone =
      formData.status === SSU_APPLICATION_STATUS.submitted ? 1 : 0;

    return Math.round(((completedSteps + finalSubmitDone) / 8) * 100);
  }, [formData, isStepCompleted]);

  const renderStep = () => {
    const commonProps = {
      onSubmit: (values) => handleStepSubmit(values, currentStep),
      onPrevious: () => handlePrevious(currentStep),
      isReadOnly: isSubmitted,
    };

    switch (currentStep) {
      case 1:
        return (
          <SSUUserSignup
            {...commonProps}
            initialValues={formData.userSignup}
            isLoggedIn={isLoggedIn}
            loginIdentity={
              authState?.applicationId ||
              authState?.email ||
              authState?.phoneNumber ||
              ""
            }
            onRequestLogin={() => setShowLoginModal(true)}
          />
        );

      case 2:
        return (
          <SSUPersonalDetailsStep
            {...commonProps}
            initialValues={formData.personalDetails}
            userSignupData={formData.userSignup}
          />
        );

      case 3:
        return (
          <SSUEducationalQualificationsStep
            {...commonProps}
            initialValues={formData.educationalQualifications}
            formData={formData}
          />
        );

      case 4:
        return (
          <SSUWorkExperienceStep
            {...commonProps}
            initialValues={formData.workExperience}
            formData={formData}
          />
        );

      case 5:
        return (
          <SSUStartupExposureStep
            {...commonProps}
            initialValues={formData.startupExposure}
          />
        );

      case 6:
        return (
          <SSUReferencesAndDocsStep
            {...commonProps}
            initialValues={formData.referencesAndDocs}
          />
        );

      case 7:
        return (
          <SSUPaymentStep
            {...commonProps}
            initialValues={formData.paymentDetails}
            formData={formData}
          />
        );

      case 8:
        return (
          <SSUPreview
            formData={formData}
            isSubmitted={isSubmitted}
            submissionWindow={submissionWindow}
            onPrevious={() => handlePrevious(8)}
            onFormSubmit={handleFinalSubmit}
            onNavigateToStep={(step) => {
              if (isSubmitted && step <= 7) return;
              setCurrentStep(step);
            }}
          />
        );

      case 9:
        return (
          <SSUPrintAcknowledgement
            formData={formData}
            onNext={() => setCurrentStep(10)}
          />
        );

      case 10:
        return (
          <SSUFormStatus
            applicationId={formData.applicationId}
            formData={formData}
            onPrevious={() => handlePrevious(10)}
          />
        );

      default:
        return null;
    }
  };

  if (isInitialLoading) {
    return (
      <div
        className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg1.jpg')" }}
      >
        <div className="absolute inset-0 bg-[rgba(247,244,238,0.68)] backdrop-blur-[3px]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="rounded-[32px] border border-white/80 bg-white/75 px-10 py-8 text-center shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div className="text-lg font-semibold text-slate-800">
              Loading application...
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Restoring your saved details
            </div>
          </div>
        </div>
      </div>
    );
  }

  const gray = "#94A3B8";

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg1.jpg')" }}
    >
      <div className="absolute inset-0 bg-[rgba(247,244,238,0.58)] backdrop-blur-[3px]" />

      <div className="relative z-10">
        <div className="flex items-center justify-between border-b border-white/60 bg-white/40 px-4 py-3 backdrop-blur-xl md:hidden">
          <div>
            <div className="text-lg font-semibold text-slate-800">
              SSU Recruitment
            </div>
            <div className="text-xs text-slate-500">Application Form</div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-slate-700 shadow-sm"
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
                title="Login"
              >
                <FaUserCircle />
                <span>Login</span>
              </button>
            )}

            <button
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-slate-700 shadow-sm"
            >
              <FaBars />
            </button>
          </div>
        </div>

        <div className="px-4 py-4 md:px-8 md:py-8">
          <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[34px] border border-white/80 bg-white/58 shadow-[0_30px_90px_rgba(15,23,42,0.13)] backdrop-blur-xl">
            <aside className="hidden w-[315px] shrink-0 border-r border-white/70 bg-white/62 p-5 md:flex md:flex-col">
              <div className="mb-6">
                <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Startup Bihar
                </div>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  SSU Recruitment
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Complete the application step by step.
                </p>
              </div>

              <div className="mb-5 rounded-3xl border border-slate-200 bg-white/70 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-slate-900 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {appId ? (
                  <div className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    Application ID:
                    <div className="mt-1 font-mono font-bold text-slate-900">
                      {appId}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex-1 space-y-2 overflow-auto pr-1">
                {stepLabels.map((label, index) => {
                  const n = index + 1;
                  const active = currentStep === n;
                  const completed = isStepCompleted(n);
                  const locked = isLocked(n);

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handleTabClick(index)}
                      disabled={locked}
                      className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : locked
                            ? "border-slate-200 bg-slate-50 text-slate-400"
                            : "border-white/70 bg-white/70 text-slate-700 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          active
                            ? "bg-white/15 text-white"
                            : completed
                              ? "bg-emerald-50 text-emerald-600"
                              : locked
                                ? "bg-slate-100 text-slate-400"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {completed ? <FaCheck /> : locked ? <FaLock /> : icons[index]}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          {label}
                        </span>
                        <span
                          className={`mt-0.5 block text-xs ${
                            active ? "text-white/65" : "text-slate-400"
                          }`}
                        >
                          Step {n}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-200 pt-5">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <FaUserCircle />
                    Login Existing Application
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <FaHome />
                  Back to Home
                </button>
              </div>
            </aside>

            {mobileNavOpen ? (
              <div className="fixed inset-0 z-[55] md:hidden">
                <div
                  className="absolute inset-0 bg-black/35"
                  onClick={() => setMobileNavOpen(false)}
                />

                <div className="absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-auto rounded-t-[30px] bg-white p-4 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-slate-900">
                        Steps
                      </div>
                      <div className="text-sm text-slate-500">
                        Select an available section
                      </div>
                    </div>

                    <button
                      onClick={() => setMobileNavOpen(false)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {stepLabels.map((label, index) => {
                      const n = index + 1;
                      const active = currentStep === n;
                      const completed = isStepCompleted(n);
                      const locked = isLocked(n);

                      return (
                        <button
                          key={label}
                          type="button"
                          disabled={locked}
                          onClick={() => handleTabClick(index)}
                          className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left ${
                            active
                              ? "border-slate-900 bg-slate-900 text-white"
                              : locked
                                ? "border-slate-200 bg-slate-50 text-slate-400"
                                : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                              active
                                ? "bg-white/15"
                                : completed
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-slate-100"
                            }`}
                          >
                            {completed ? <FaCheck /> : locked ? <FaLock /> : icons[index]}
                          </span>
                          <span className="text-sm font-semibold">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            <main className="flex min-w-0 flex-1 flex-col">
              <div className="hidden border-b border-slate-200/60 bg-white/55 px-8 py-5 backdrop-blur-xl md:block">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      SSU Recruitment
                    </div>
                    <div className="mt-1 text-2xl font-bold text-slate-900">
                      {stepLabels[currentStep - 1]}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {isSubmitted
                        ? "Application submitted. You may print acknowledgement and check status."
                        : "Fill accurate details and save each step before proceeding."}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {saveMessage ? (
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {saveMessage}
                      </span>
                    ) : null}

                    {isSaving ? (
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                        Saving...
                      </span>
                    ) : null}

                    {isLoggedIn ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowLoginModal(true)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <FaUserCircle />
                        Login
                      </button>
                    )}

                    <SSULanguageToggle />
                  </div>
                </div>
              </div>

              <div className="border-b border-slate-200/60 px-3 py-2 md:hidden">
                <div className="flex gap-2 overflow-x-auto">
                  {stepLabels.map((label, index) => {
                    const n = index + 1;
                    const active = currentStep === n;
                    const locked = isLocked(n);

                    return (
                      <button
                        key={label}
                        onClick={() => !locked && handleTabClick(index)}
                        disabled={locked}
                        className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white"
                            : locked
                              ? "border-slate-200 text-slate-400"
                              : "border-slate-300 text-slate-700"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!isSubmitted && submissionWindow.message ? (
                <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 md:px-8">
                  {submissionWindow.message}
                </div>
              ) : null}

              <div className="px-4 pt-3 md:hidden">
                <Notice />
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                {currentStep === 1 ? (
                  <div className="mb-5">
                    <Notice />
                  </div>
                ) : null}

                {renderStep()}
              </div>
            </main>
          </div>

          <div className="mx-auto mt-5 max-w-7xl">
            <ToR />
          </div>
        </div>
      </div>

      {showLoginModal ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 p-4">
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!loginLoading) setShowLoginModal(false);
            }}
          />

          <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  <FaShieldAlt />
                  Applicant Login
                </div>

                <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  Continue application
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Login using registration number, email or mobile number.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!loginLoading) setShowLoginModal(false);
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Registration No. / Email / Mobile
                </label>
                <input
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="SSU2026050001 / email / mobile"
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loginLoading) {
                      handleInlineLogin();
                    }
                  }}
                />
              </div>

              {loginError ? (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    loginError.includes("updated")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {loginError}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  setShowLoginModal(false);
                  setShowForgotPhoneModal(true);
                }}
                className="text-sm font-semibold text-slate-700 underline"
              >
                Forgot password?
              </button>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleInlineLogin}
                  disabled={loginLoading}
                  className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                >
                  {loginLoading ? "Checking..." : "Login"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {showForgotPhoneModal ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 p-4">
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!forgotPasswordLoading) {
                resetForgotPasswordFlow();
                setShowLoginModal(true);
              }
            }}
          />

          <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  <FaShieldAlt />
                  Reset Password
                </div>

                <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  Verify mobile number
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Enter the mobile number used during registration.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!forgotPasswordLoading) {
                    resetForgotPasswordFlow();
                    setShowLoginModal(true);
                  }
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Mobile Number
                </label>
                <input
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(normalizePhone(e.target.value))}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              {forgotPasswordError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {forgotPasswordError}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForgotPasswordFlow();
                    setShowLoginModal(true);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleForgotPasswordSendOtp}
                  disabled={forgotPasswordLoading}
                  className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                >
                  {forgotPasswordLoading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <SSUPhoneVerificationModal
        isOpen={showResetOtpModal}
        onClose={() => {
          setShowResetOtpModal(false);
          setShowForgotPhoneModal(true);
        }}
        onVerified={handleResetOtpVerified}
        phoneNumber={forgotPhone}
        title="Verify Mobile Number"
        subtitle="We sent a password reset code to"
        verifyButtonText="Verify OTP"
        verifyingText="Verifying OTP"
        resendingText="Sending OTP"
        successMessage="Mobile verified successfully."
      />

      {showResetPasswordModal ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/35 p-4">
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!resetPasswordLoading) {
                setShowResetPasswordModal(false);
                setShowLoginModal(true);
              }
            }}
          />

          <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/80 bg-white/90 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <FaShieldAlt />
                  New Password
                </div>

                <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  Set a new password
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Your mobile number is verified. Create a new password to
                  continue.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!resetPasswordLoading) {
                    setShowResetPasswordModal(false);
                    setShowLoginModal(true);
                  }
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !resetPasswordLoading) {
                      handleResetPasswordSubmit();
                    }
                  }}
                />
              </div>

              {resetPasswordError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {resetPasswordError}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPasswordModal(false);
                    setShowLoginModal(true);
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleResetPasswordSubmit}
                  disabled={resetPasswordLoading}
                  className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                >
                  {resetPasswordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <SSUWorkingDialog
        open={workingDialog.open}
        title={workingDialog.title}
        message={workingDialog.message}
      />
    </div>
  );
}

export default function SSURegistrationLayout() {
  return (
    <LanguageProvider>
      <RegistrationLayoutInner />
    </LanguageProvider>
  );
}