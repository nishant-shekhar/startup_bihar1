import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  FaCheck,
  FaHome,
  FaClipboardList,
  FaInfoCircle,
  FaChartBar,
  FaWallet,
  FaUserCheck,
  FaEye,
  FaClipboardCheck,
  FaLock,
  FaPrint,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserCircle,
  FaShieldAlt,
} from "react-icons/fa";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  runTransaction,
  collection,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import { LanguageProvider } from "../shared/LanguageContext";
import LanguageToggle from "../shared/LanguageToggle";

import UserSignup from "./UserSignup";
import BasicDetailsStep from "./FormSteps/BasicDetailsStep";
import EntityDetailsStep from "./FormSteps/EntityDetailsStep";
import StartupDetailsStep from "./FormSteps/StartupDetailsStep";
import CoFounderDetailsStep from "./FormSteps/CoFounderDetailsStep";
import BusinessIdeaStep from "./FormSteps/BusinessIdeaStep";
import Preview from "./Preview";
import PrintAcknowledgement from "./PrintAcknowledgement";
import FormStatus from "./FormStatus";

const STORAGE_KEY = "startupRegistrationDraft";
const AUTH_KEY = "startupRegistrationAuth";

const stepLabels = [
  "Register",
  "Basic Details",
  "Entity Details",
  "Startup Details",
  "Co-Founder Details",
  "Business Idea",
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
  <FaEye />,
  <FaPrint />,
  <FaClipboardCheck />,
];

const initialFormData = {
  applicationId: "",
  status: "draft",
  currentStep: 1,
  createdAt: null,
  updatedAt: null,
  submittedAt: null,
  statusLabel: "",
  statusMessage: "",
  adminRemarks: "",
  currentStage: "",
  userSignup: null,
  basicDetails: null,
  entityDetails: null,
  startupDetails: null,
  cofounderDetails: null,
  businessIdea: null,
};

const normalizeEmail = (value = "") => value.trim().toLowerCase();
const normalizePhone = (value = "") => value.replace(/\D/g, "").slice(0, 10);
const normalizeApplicationId = (value = "") => value.trim().toUpperCase();
const normalizeAadhar = (value = "") => value.replace(/\D/g, "").slice(0, 12);

const getCurrentYearMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
};

async function sha256(text) {
  const encoded = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function generateIncrementalApplicationId() {
  const yearMonth = getCurrentYearMonth();
  const counterRef = doc(db, "applicationCounters", yearMonth);

  const nextNumber = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(counterRef);

    if (!snap.exists()) {
      transaction.set(counterRef, {
        yearMonth,
        lastNumber: 1,
        updatedAt: serverTimestamp(),
      });
      return 1;
    }

    const current = Number(snap.data()?.lastNumber || 0);
    const updated = current + 1;

    transaction.update(counterRef, {
      lastNumber: updated,
      updatedAt: serverTimestamp(),
    });

    return updated;
  });

  return `SB${yearMonth}${String(nextNumber).padStart(4, "0")}`;
}

function RegistrationLayoutInner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [formData, setFormData] = useState(initialFormData);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

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

  const appId = formData.applicationId;
  const isSubmitted = formData.status === "submitted";
  const isLoggedIn = !!authState?.applicationId;

  const persistLocalDraft = useCallback((data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

    const fileRef = ref(storage, path);
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
    if (data.status === "submitted") return 9;
    if (data.businessIdea) return 7;
    if (data.cofounderDetails) return 6;
    if (data.startupDetails) return 5;
    if (data.entityDetails) return 4;
    if (data.basicDetails) return 3;
    if (data.userSignup) return 2;
    return 1;
  }, []);

  const loadApplicationById = useCallback(
    async (applicationId) => {
      const docRef = doc(db, "startupApplications", applicationId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;

      const data = { ...initialFormData, ...snap.data() };
      setFormData(data);
      setCurrentStep(getStepFromData(data));
      persistLocalDraft(data);
      return data;
    },
    [getStepFromData, persistLocalDraft]
  );

  useEffect(() => {
    const loadDraft = async () => {
      setIsInitialLoading(true);

      try {
        const savedAuthRaw = localStorage.getItem(AUTH_KEY);
        const savedDraftRaw = localStorage.getItem(STORAGE_KEY);

        const savedAuth = savedAuthRaw ? JSON.parse(savedAuthRaw) : null;
        const savedDraft = savedDraftRaw ? JSON.parse(savedDraftRaw) : null;

        if (savedAuth?.applicationId) {
          try {
            const loaded = await loadApplicationById(savedAuth.applicationId);
            if (loaded) {
              setIsInitialLoading(false);
              return;
            }
          } catch (error) {
            console.error("Failed to load authenticated application", error);
          }
        }

        if (savedDraft) {
          const merged = { ...initialFormData, ...savedDraft };
          setFormData(merged);
          setCurrentStep(getStepFromData(merged));
        }
      } catch (error) {
        console.error("Failed to restore draft", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadDraft();
  }, [getStepFromData, loadApplicationById]);

  const saveSectionToFirestore = useCallback(
    async ({ applicationId, sectionKey, payload, nextStep, preserveStatus }) => {
      if (!applicationId || !sectionKey) return;

      setIsSaving(true);
      setSaveMessage("Saving...");

      try {
        const docRef = doc(db, "startupApplications", applicationId);

        await setDoc(
          docRef,
          {
            applicationId,
            status: preserveStatus || "draft",
            currentStep: nextStep ?? currentStep,
            [sectionKey]: payload,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );

        setSaveMessage("Saved");
      } catch (error) {
        console.error(`Failed to save ${sectionKey}`, error);
        setSaveMessage("Save failed");
      } finally {
        setIsSaving(false);
        setTimeout(() => setSaveMessage(""), 1500);
      }
    },
    [currentStep]
  );

  const checkIdentifierExists = useCallback(async ({ email, phoneNumber, aadharNumber, currentApplicationId = "" }) => {
    const existing = [];

    const appsRef = collection(db, "startupApplications");

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizePhone(phoneNumber);
    const normalizedAadhar = normalizeAadhar(aadharNumber);
    const currentId = normalizeApplicationId(currentApplicationId);

    if (normalizedEmail) {
      const emailQ = query(
        appsRef,
        where("userSignup.email", "==", normalizedEmail),
        limit(5)
      );
      const emailSnap = await getDocs(emailQ);
      const emailMatch = emailSnap.docs.find((d) => d.id !== currentId);
      if (emailMatch) existing.push("email");
    }

    if (normalizedPhone) {
      const phoneQ = query(
        appsRef,
        where("userSignup.phoneNumber", "==", normalizedPhone),
        limit(5)
      );
      const phoneSnap = await getDocs(phoneQ);
      const phoneMatch = phoneSnap.docs.find((d) => d.id !== currentId);
      if (phoneMatch) existing.push("mobile");
    }

    if (normalizedAadhar) {
      const aadharQ = query(
        appsRef,
        where("userSignup.aadharNumber", "==", normalizedAadhar),
        limit(5)
      );
      const aadharSnap = await getDocs(aadharQ);
      const aadharMatch = aadharSnap.docs.find((d) => d.id !== currentId);
      if (aadharMatch) existing.push("aadhar");
    }

    if (normalizedAadhar) {
      const blockedRef = doc(db, "aadharBlocked", normalizedAadhar);
      const blockedSnap = await getDoc(blockedRef);
      if (blockedSnap.exists() && !existing.includes("aadhar")) {
        const blockedForApplicationId = blockedSnap.data()?.applicationId || "";
        if (blockedForApplicationId !== currentId) {
          existing.push("aadhar");
        }
      }
    }

    return existing;
  }, []);

  const blockAadharAfterRegistration = useCallback(async ({ aadharNumber, applicationId, founderName, startupName, email, phoneNumber }) => {
    const normalizedAadhar = normalizeAadhar(aadharNumber);
    if (!normalizedAadhar || !applicationId) return;

    await setDoc(
      doc(db, "aadharBlocked", normalizedAadhar),
      {
        aadharNumber: normalizedAadhar,
        applicationId,
        founderName: founderName || "",
        startupName: startupName || "",
        email: normalizeEmail(email || ""),
        phoneNumber: normalizePhone(phoneNumber || ""),
        blockedAt: serverTimestamp(),
        source: "startupRegistration",
        active: true,
      },
      { merge: true }
    );
  }, []);

  const transformStepDataForStorage = useCallback(
    async (stepData, step, applicationId) => {
      if (step === 2) {
        let profilePhotoMeta = stepData.profilePhotoMeta || null;

        if (stepData.profilePhoto instanceof File) {
          const ext =
            stepData.profilePhoto.name?.split(".").pop()?.toLowerCase() || "jpg";

          profilePhotoMeta = await uploadFileAndGetMeta(
            stepData.profilePhoto,
            `startupApplications/${applicationId}/basic/profile-photo-${Date.now()}.${ext}`
          );
        }

        return {
          ...stepData,
          profilePhoto: null,
          profilePhotoMeta,
        };
      }

      if (step === 3) {
        let certificateMeta = stepData.certificateMeta || null;

        if (stepData.certificate instanceof File) {
          certificateMeta = await uploadFileAndGetMeta(
            stepData.certificate,
            `startupApplications/${applicationId}/entity/certificate-${Date.now()}-${stepData.certificate.name}`
          );
        }

        return {
          ...stepData,
          certificate: null,
          certificateMeta,
        };
      }

      if (step === 6) {
        let pitchDeckMeta = stepData.pitchDeckMeta || null;

        if (stepData.pitchDeck instanceof File) {
          pitchDeckMeta = await uploadFileAndGetMeta(
            stepData.pitchDeck,
            `startupApplications/${applicationId}/business/pitchdeck-${Date.now()}-${stepData.pitchDeck.name}`
          );
        }

        return {
          ...stepData,
          pitchDeck: null,
          pitchDeckMeta,
        };
      }

      return stepData;
    },
    [uploadFileAndGetMeta]
  );

  const handleStepSubmit = useCallback(
    async (rawStepData, step) => {
      if (isSubmitted) return { ok: false, error: "Application already submitted." };

      let nextFormData = { ...formData };
      let sectionKey = "";
      let nextStep = step + 1;

      if (step === 1) {
        // Logged-in user: allow only startup name update, not re-registration
        if (isLoggedIn && formData.applicationId && formData.userSignup) {
          const updatedSignup = {
            ...formData.userSignup,
            startupName: rawStepData.startupName?.trim() || formData.userSignup.startupName || "",
            founderName: formData.userSignup.founderName,
            email: formData.userSignup.email,
            phoneNumber: formData.userSignup.phoneNumber,
            aadharNumber: formData.userSignup.aadharNumber,
            passwordHash: formData.userSignup.passwordHash,
          };

          nextFormData = {
            ...nextFormData,
            userSignup: updatedSignup,
          };

          sectionKey = "userSignup";
          persistAuth({
            ...(authState || {}),
            applicationId: formData.applicationId,
            founderName: updatedSignup.founderName,
            startupName: updatedSignup.startupName,
            email: updatedSignup.email,
            phoneNumber: updatedSignup.phoneNumber,
          });
        } else {
          const exists = await checkIdentifierExists({
            email: rawStepData.email,
            phoneNumber: rawStepData.phoneNumber,
            aadharNumber: rawStepData.aadharNumber,
          });

          if (exists.length > 0) {
            return {
              ok: false,
              error: `${exists.join(", ")} already exist.`,
              existingFields: exists,
            };
          }

          const applicationId = await createOrGetApplicationId();
          const passwordHash = await sha256(rawStepData.password);

          sectionKey = "userSignup";

          nextFormData = {
            ...nextFormData,
            applicationId,
            userSignup: {
              founderName: rawStepData.founderName,
              startupName: rawStepData.startupName,
              email: normalizeEmail(rawStepData.email),
              phoneNumber: normalizePhone(rawStepData.phoneNumber),
              aadharNumber: normalizeAadhar(rawStepData.aadharNumber),
              phoneVerified: true,
              registrationType: rawStepData.type || "registration",
              registeredAt: rawStepData.registeredAt || new Date().toISOString(),
              passwordHash,
            },
          };

          persistAuth({
            applicationId,
            founderName: rawStepData.founderName,
            startupName: rawStepData.startupName,
            email: normalizeEmail(rawStepData.email),
            phoneNumber: normalizePhone(rawStepData.phoneNumber),
          });
        }
      } else {
        const applicationId =
          nextFormData.applicationId || (await createOrGetApplicationId());

        nextFormData.applicationId = applicationId;

        const stepData = await transformStepDataForStorage(
          rawStepData,
          step,
          applicationId
        );

        if (step === 2) {
          sectionKey = "basicDetails";
          nextFormData.basicDetails = stepData;
        } else if (step === 3) {
          sectionKey = "entityDetails";
          nextFormData.entityDetails = stepData;
        } else if (step === 4) {
          sectionKey = "startupDetails";
          nextFormData.startupDetails = stepData;
        } else if (step === 5) {
          sectionKey = "cofounderDetails";
          nextFormData.cofounderDetails = stepData;
        } else if (step === 6) {
          sectionKey = "businessIdea";
          nextFormData.businessIdea = stepData;
          nextStep = 7;
        }
      }

      setFormData(nextFormData);
      persistLocalDraft(nextFormData);

      if (sectionKey) {
        await saveSectionToFirestore({
          applicationId: nextFormData.applicationId,
          sectionKey,
          payload: nextFormData[sectionKey],
          nextStep,
          preserveStatus: "draft",
        });
      }

      // Block Aadhar only for first successful registration
      if (
        step === 1 &&
        !isLoggedIn &&
        nextFormData?.userSignup?.aadharNumber &&
        nextFormData?.applicationId
      ) {
        await blockAadharAfterRegistration({
          aadharNumber: nextFormData.userSignup.aadharNumber,
          applicationId: nextFormData.applicationId,
          founderName: nextFormData.userSignup.founderName,
          startupName: nextFormData.userSignup.startupName,
          email: nextFormData.userSignup.email,
          phoneNumber: nextFormData.userSignup.phoneNumber,
        });
      }

      setCurrentStep(nextStep);
      return { ok: true };
    },
    [
      isSubmitted,
      formData,
      isLoggedIn,
      authState,
      createOrGetApplicationId,
      persistLocalDraft,
      saveSectionToFirestore,
      transformStepDataForStorage,
      persistAuth,
      checkIdentifierExists,
      blockAadharAfterRegistration,
    ]
  );

  const handleFinalSubmit = useCallback(async () => {
    if (!formData.applicationId || isSubmitted) return;

    setIsSaving(true);
    setSaveMessage("Submitting...");

    try {
      const docRef = doc(db, "startupApplications", formData.applicationId);

      await setDoc(
        docRef,
        {
          applicationId: formData.applicationId,
          status: "submitted",
          statusLabel: "Application Submitted",
          statusMessage:
            "Your application has been submitted successfully and is awaiting review.",
          currentStage: "submitted",
          currentStep: 8,
          submittedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const updated = {
        ...formData,
        status: "submitted",
        statusLabel: "Application Submitted",
        statusMessage:
          "Your application has been submitted successfully and is awaiting review.",
        currentStage: "submitted",
      };

      setFormData(updated);
      persistLocalDraft(updated);
      setCurrentStep(8);
      setSaveMessage("Submitted");
    } catch (error) {
      console.error("Final submit failed", error);
      setSaveMessage("Submit failed");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 1800);
    }
  }, [formData, persistLocalDraft, isSubmitted]);

  const handlePrevious = (step) => {
    if (step > 1) {
      if (isSubmitted) {
        if (step === 9) setCurrentStep(8);
        else if (step === 8) setCurrentStep(7);
        return;
      }
      setCurrentStep(step - 1);
    }
  };

  const handleLogout = () => {
    persistAuth(null);
    localStorage.removeItem(STORAGE_KEY);
    setFormData(initialFormData);
    setCurrentStep(1);
    setMobileNavOpen(false);
    setShowLoginModal(false);
  };

  const findApplicationForLogin = async (identifier) => {
    const trimmed = identifier.trim();
    const colRef = collection(db, "startupApplications");

    if (/^SB\d{10}$/i.test(trimmed)) {
      const appId = normalizeApplicationId(trimmed);
      const snap = await getDoc(doc(db, "startupApplications", appId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    }

    if (/^\d{10}$/.test(trimmed)) {
      const q = query(
        colRef,
        where("userSignup.phoneNumber", "==", normalizePhone(trimmed)),
        limit(1)
      );
      const result = await getDocs(q);
      if (!result.empty) {
        const d = result.docs[0];
        return { id: d.id, ...d.data() };
      }
    }

    const q = query(
      colRef,
      where("userSignup.email", "==", normalizeEmail(trimmed)),
      limit(1)
    );
    const result = await getDocs(q);
    if (!result.empty) {
      const d = result.docs[0];
      return { id: d.id, ...d.data() };
    }

    return null;
  };

  const handleInlineLogin = async () => {
    setLoginError("");

    const identifier = loginIdentifier.trim();
    const password = loginPassword;

    if (!identifier || !password) {
      setLoginError("Enter registration number, email or mobile, and password.");
      return;
    }

    try {
      setLoginLoading(true);

      const application = await findApplicationForLogin(identifier);

      if (!application) {
        setLoginError("No application found for the entered details.");
        return;
      }

      const passwordHash = await sha256(password);
      const savedHash = application?.userSignup?.passwordHash || "";

      if (!savedHash || savedHash !== passwordHash) {
        setLoginError("Invalid password.");
        return;
      }

      const auth = {
        applicationId: application.applicationId || application.id,
        founderName: application?.userSignup?.founderName || "",
        startupName: application?.userSignup?.startupName || "",
        email: application?.userSignup?.email || "",
        phoneNumber: application?.userSignup?.phoneNumber || "",
      };

      persistAuth(auth);

      const loaded = { ...initialFormData, ...application };
      setFormData(loaded);
      setCurrentStep(getStepFromData(loaded));
      persistLocalDraft(loaded);

      setShowLoginModal(false);
      setLoginIdentifier("");
      setLoginPassword("");
      setLoginError("");
    } catch (error) {
      console.error("Login failed", error);
      setLoginError("Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const isStepCompleted = (n) => {
    switch (n) {
      case 1:
        return !!formData.userSignup;
      case 2:
        return !!formData.basicDetails;
      case 3:
        return !!formData.entityDetails;
      case 4:
        return !!formData.startupDetails;
      case 5:
        return !!formData.cofounderDetails;
      case 6:
        return !!formData.businessIdea;
      case 7:
        return !!formData.businessIdea;
      case 8:
        return formData.status === "submitted";
      case 9:
        return !!formData.applicationId;
      default:
        return false;
    }
  };

  const isLocked = (n) => {
    if (isSubmitted) {
      if ([1, 2, 3, 4, 5, 6].includes(n)) return true;
      if (n === 7) return !formData.businessIdea;
      if (n === 8) return false;
      if (n === 9) return false;
      return true;
    }

    if (n === 1) return false;
    if (n === 2) return !formData.userSignup;
    if (n === 3) return !formData.basicDetails;
    if (n === 4) return !formData.entityDetails;
    if (n === 5) return !formData.startupDetails;
    if (n === 6) return !formData.cofounderDetails;
    if (n === 7) return !formData.businessIdea;
    if (n === 8) return formData.status !== "submitted";
    if (n === 9) return !formData.applicationId;
    return true;
  };

  const handleTabClick = (stepIndex) => {
    const stepNumber = stepIndex + 1;
    if (isLocked(stepNumber)) return;
    setCurrentStep(stepNumber);
    setMobileNavOpen(false);
  };

  const progressPercent = useMemo(() => {
    const completed = [1, 2, 3, 4, 5, 6].filter((n) => isStepCompleted(n)).length;
    return Math.round((completed / 6) * 100);
  }, [formData]);

  const renderStep = () => {
    const commonProps = {
      onSubmit: (values) => handleStepSubmit(values, currentStep),
      onPrevious: () => handlePrevious(currentStep),
      isReadOnly: isSubmitted,
    };

    switch (currentStep) {
      case 1:
        return (
          <UserSignup
            {...commonProps}
            initialValues={formData.userSignup}
            isLoggedIn={isLoggedIn}
            loginIdentity={authState?.applicationId || authState?.email || authState?.phoneNumber || ""}
          />
        );

      case 2:
        return (
          <BasicDetailsStep
            {...commonProps}
            initialValues={formData.basicDetails}
            userSignupData={formData.userSignup}
          />
        );

      case 3:
        return (
          <EntityDetailsStep
            {...commonProps}
            initialValues={formData.entityDetails}
          />
        );

      case 4:
        return (
          <StartupDetailsStep
            {...commonProps}
            initialValues={formData.startupDetails}
          />
        );

      case 5:
        return (
          <CoFounderDetailsStep
            {...commonProps}
            initialValues={formData.cofounderDetails}
          />
        );

      case 6:
        return (
          <BusinessIdeaStep
            {...commonProps}
            initialValues={formData.businessIdea}
          />
        );

      case 7:
        return (
          <Preview
            formData={formData}
            isSubmitted={isSubmitted}
            onPrevious={() => handlePrevious(7)}
            onFormSubmit={handleFinalSubmit}
            onNavigateToStep={(step) => {
              if (isSubmitted && step <= 6) return;
              setCurrentStep(step);
            }}
          />
        );

      case 8:
        return (
          <PrintAcknowledgement
            formData={formData}
            onNext={() => setCurrentStep(9)}
          />
        );

      case 9:
        return (
          <FormStatus
            applicationId={formData.applicationId}
            formData={formData}
            onPrevious={() => handlePrevious(9)}
          />
        );

      default:
        return null;
    }
  };

  const gray = "#94A3B8";

  if (isInitialLoading) {
    return (
      <div
        className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg1.jpg')" }}
      >
        <div className="absolute inset-0 bg-[rgba(247,244,238,0.68)] backdrop-blur-[3px]" />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="rounded-[32px] border border-white/80 bg-white/75 px-10 py-8 text-center shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div className="text-lg font-semibold text-slate-800">Loading application...</div>
            <div className="mt-2 text-sm text-slate-500">
              Restoring your saved details
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg1.jpg')" }}
    >
      <div className="absolute inset-0 bg-[rgba(247,244,238,0.58)] backdrop-blur-[3px]" />

      <div className="relative z-10">
        <div className="md:hidden flex items-center justify-between border-b border-white/60 bg-white/40 px-4 py-3 backdrop-blur-xl">
          <div>
            <div className="text-lg font-semibold text-slate-800">Startup Bihar</div>
            <div className="text-xs text-slate-500">Registration Form</div>
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/70 text-slate-700 shadow-sm"
                title="Login"
              >
                <FaUserCircle />
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
          <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[34px] border border-white/80 bg-white/58 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
            <aside className="hidden w-[300px] shrink-0 border-r border-slate-200/60 bg-white/45 backdrop-blur-xl md:flex md:flex-col">
              <div className="border-b border-slate-200/60 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-2xl font-bold tracking-tight text-slate-900">
                      Startup Bihar
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {isLoggedIn ? "Logged in application" : "New registration"}
                    </div>
                  </div>

                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                      title="Logout"
                    >
                      <FaSignOutAlt />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                      title="Login"
                    >
                      <FaUserCircle />
                    </button>
                  )}
                </div>

                <div className="mt-5 rounded-[24px] border border-white/80 bg-white/75 p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-semibold text-slate-700">{progressPercent}%</span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-slate-900 via-indigo-700 to-amber-500 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    {saveMessage ||
                      (isSaving
                        ? "Saving..."
                        : isSubmitted
                        ? "Submitted"
                        : isLoggedIn
                        ? "Authenticated"
                        : "Guest mode")}
                  </div>
                </div>

                {authState?.applicationId ? (
                  <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Current application
                    </div>
                    <div className="mt-2 text-sm font-semibold text-slate-800">
                      {authState.applicationId}
                    </div>
                    {authState.startupName ? (
                      <div className="mt-1 text-sm text-slate-500">
                        {authState.startupName}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <nav className="flex-1 space-y-2 p-4">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  const active = currentStep === stepNumber;
                  const locked = isLocked(stepNumber);
                  const completed = isStepCompleted(stepNumber);

                  return (
                    <button
                      key={label}
                      onClick={() => !locked && handleTabClick(index)}
                      disabled={locked}
                      className={`flex w-full items-center justify-between rounded-[22px] px-4 py-3 text-left transition ${
                        active
                          ? "border border-slate-200 bg-white shadow-sm"
                          : locked
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-white/70"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span style={{ color: locked ? "#CBD5E1" : gray }}>
                          {locked ? <FaLock /> : icons[index]}
                        </span>
                        <span className="text-sm font-medium text-slate-700">{label}</span>
                      </span>

                      {completed && !locked && (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <FaCheck size={12} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </aside>

            {mobileNavOpen && (
              <div className="fixed inset-0 z-50 md:hidden">
                <div
                  className="absolute inset-0 bg-black/35"
                  onClick={() => setMobileNavOpen(false)}
                />
                <div className="absolute left-0 top-0 h-full w-[84%] max-w-xs bg-white/95 p-4 shadow-xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="text-lg font-semibold text-slate-800">Registration</div>
                    <button
                      onClick={() => setMobileNavOpen(false)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <nav className="mt-4 space-y-2">
                    {stepLabels.map((label, index) => {
                      const stepNumber = index + 1;
                      const active = currentStep === stepNumber;
                      const locked = isLocked(stepNumber);

                      return (
                        <button
                          key={label}
                          onClick={() => !locked && handleTabClick(index)}
                          disabled={locked}
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left ${
                            active ? "bg-slate-100" : "hover:bg-slate-50"
                          } ${locked ? "cursor-not-allowed opacity-50" : ""}`}
                        >
                          <span className="text-sm text-slate-700">{label}</span>
                          {isStepCompleted(stepNumber) && !locked && (
                            <FaCheck className="text-emerald-600" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            )}

            <main className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3 md:px-8 md:py-4">
                <div>
                  <div className="text-lg font-semibold text-slate-800">
                    {stepLabels[currentStep - 1]}
                  </div>
                  <div className="text-sm text-slate-500">
                    Application ID: {appId || "Will be created on register"}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => setShowLoginModal(true)}
                      className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 md:inline-flex"
                    >
                      Login
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 md:inline-flex"
                    >
                      Logout
                    </button>
                  )}

                  <LanguageToggle />
                </div>
              </div>

              <div className="md:hidden border-b border-slate-200/60 px-3 py-2">
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

              <div className="flex-1 overflow-y-auto p-4 md:p-8">{renderStep()}</div>
            </main>
          </div>
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 p-4">
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!loginLoading) {
                setShowLoginModal(false);
                setLoginError("");
              }
            }}
          />

          <div className="relative z-10 w-full max-w-md rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.18)] backdrop-blur-2xl">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  <FaShieldAlt />
                  Secure Login
                </div>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                  Continue your application
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Login using registration number, email, or mobile number.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!loginLoading) {
                    setShowLoginModal(false);
                    setLoginError("");
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
                  Registration No / Email / Mobile
                </label>
                <input
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="SB2026030001 or name@example.com or 9876543210"
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
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
                  placeholder="Enter your password"
                  className="block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loginLoading) handleInlineLogin();
                  }}
                />
              </div>

              {loginError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {loginError}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!loginLoading) {
                      setShowLoginModal(false);
                      setLoginError("");
                    }
                  }}
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
      )}
    </div>
  );
}

export default function RegistrationLayout() {
  return (
    <LanguageProvider>
      <RegistrationLayoutInner />
    </LanguageProvider>
  );
}