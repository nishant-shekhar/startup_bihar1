import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaCheck,
  FaClock,
  FaFileAlt,
  FaUsers,
  FaPen,
  FaUserTie,
  FaSpinner,
  FaStar,
  FaTimes,
  FaCommentDots,
  FaInfoCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLaptop,
  FaUpload,
  FaExternalLinkAlt,
  FaFilePdf,
  FaEnvelope,
  FaLock,
  FaTimesCircle,
  FaTrophy,
} from "react-icons/fa";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../AdminRedesign/NewApplicationAdmin/firebase";

const timelineSteps = [
  {
    key: "formSubmitted",
    title: "Application Submitted",
    icon: <FaFileAlt />,
    description: "Your application has been submitted successfully.",
  },
  {
    key: "aiScreening",
    title: "Application Screening",
    icon: <FaCheck />,
    description: "Initial screening of your submitted application.",
    publishKey: "aiResult",
  },
  {
    key: "expertReview",
    title: "Expert Review",
    icon: <FaUsers />,
    description: "Detailed evaluation by the expert review panel.",
    publishKey: "expertResult",
  },
  {
    key: "writtenAssessment",
    title: "Written Assessment",
    icon: <FaPen />,
    description: "Written assessment stage, if applicable for this batch.",
    publishKey: "writtenResult",
    schedulePublishKey: "writtenSchedule",
  },
  {
    key: "pitchRecognition",
    title: "Pitch / PI & Recognition",
    icon: <FaUserTie />,
    description:
      "Pitch or personal interaction with the evaluation committee. Clearing this stage means startup recognition.",
    publishKey: "piResult",
    schedulePublishKey: "piSchedule",
  },
];

const feedbackOptions = [
  "Excellent",
  "Very Good",
  "Good",
  "Could Be Better",
  "Found a bug / Issue",
];

const statusLabelMap = {
  pending: "Pending",
  completed: "Completed",
  inactive: "Inactive",
  shortlisted: "Shortlisted",
  not_shortlisted: "Not Shortlisted",
  selected: "Cleared",
  not_selected: "Not Cleared",
  qualified: "Qualified",
  not_qualified: "Not Qualified",
  recognised: "Recognised",
  not_recognised: "Not Recognised",
  all: "Applications in Batch",
  ai: "Application Screening",
  expert: "Expert Review",
  written: "Written Assessment",
  pi: "Pitch / Personal Interaction",
  final: "Recognition",
};

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const formatDate = (value) => {
  if (!value) return "";

  let date = null;

  if (typeof value?.toDate === "function") {
    date = value.toDate();
  } else if (value?.seconds) {
    date = new Date(value.seconds * 1000);
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else {
    return "";
  }

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatSlotDateTime = (schedule) => {
  if (!schedule?.date) return "";

  const date = new Date(`${schedule.date}T00:00:00`);
  const dateText = Number.isNaN(date.getTime())
    ? schedule.date
    : date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  return `${dateText}, ${schedule.startTime || "-"} - ${
    schedule.endTime || "-"
  }`;
};

const getStatusLabel = (value) => {
  if (!value) return "Pending";
  return statusLabelMap[value] || value;
};

const isPositiveStatus = (status) =>
  ["shortlisted", "selected", "qualified", "recognised", "completed"].includes(
    status
  );

const isNegativeStatus = (status) =>
  [
    "not_shortlisted",
    "not_selected",
    "not_qualified",
    "not_recognised",
  ].includes(status);

const isInactiveStatus = (status) => status === "inactive";

const getStatusTone = (status) => {
  if (isPositiveStatus(status)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (isNegativeStatus(status)) {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (isInactiveStatus(status)) {
    return "border-slate-200 bg-slate-50 text-slate-400";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
};

const getFallbackSubtitle = (application, applicationId) => {
  if (!applicationId) {
    return "Status will be available after your application ID is created.";
  }

  if (application?.status === "submitted") {
    return "Your application has been submitted and is under review.";
  }

  if (application?.businessIdea) {
    return "Final submission pending. Please review and submit your application.";
  }

  if (application?.cofounderDetails) {
    return "Business idea completed. Final review is pending before submission.";
  }

  if (application?.startupDetails) {
    return "Co-founder details pending.";
  }

  if (application?.entityDetails) {
    return "Startup details pending.";
  }

  if (application?.basicDetails) {
    return "Entity details pending.";
  }

  if (application?.userSignup) {
    return "Basic details pending.";
  }

  return "Registration started. Complete the form step by step.";
};

const resolvePublishedStageStatus = ({ stage, batchApplication, publish }) => {
  if (!batchApplication) return "pending";

  if (stage === "ai") {
    if (!publish?.aiResult) return "pending";
    return batchApplication?.ai?.status === "shortlisted"
      ? "shortlisted"
      : "not_shortlisted";
  }

  if (stage === "expert") {
    if (!publish?.expertResult) return "pending";
    return batchApplication?.expert?.status === "shortlisted"
      ? "shortlisted"
      : "not_shortlisted";
  }

  if (stage === "written") {
    if (!publish?.writtenResult) return "pending";
    return batchApplication?.written?.status === "selected"
      ? "selected"
      : "not_selected";
  }

  if (stage === "pi") {
    if (!publish?.piResult) return "pending";
    return batchApplication?.pi?.selected === true ? "recognised" : "not_selected";
  }

  return "pending";
};

const getTerminalFailureStage = ({ batchApplication, publish }) => {
  if (!batchApplication) return null;

  const aiStatus = resolvePublishedStageStatus({
    stage: "ai",
    batchApplication,
    publish,
  });

  if (publish?.aiResult && aiStatus === "not_shortlisted") {
    return "ai";
  }

  const expertStatus = resolvePublishedStageStatus({
    stage: "expert",
    batchApplication,
    publish,
  });

  if (publish?.expertResult && expertStatus === "not_shortlisted") {
    return "expert";
  }

  const writtenStatus = resolvePublishedStageStatus({
    stage: "written",
    batchApplication,
    publish,
  });

  if (publish?.writtenResult && writtenStatus === "not_selected") {
    return "written";
  }

  const piStatus = resolvePublishedStageStatus({
    stage: "pi",
    batchApplication,
    publish,
  });

  if (publish?.piResult && piStatus === "not_selected") {
    return "pi";
  }

  return null;
};

const getApplicantMessage = ({ application, batchApplication, publish }) => {
  if (!batchApplication) {
    if (application?.status === "submitted") {
      return "Your application has been submitted successfully. It will be reviewed as per the Startup Bihar evaluation process.";
    }

    return getFallbackSubtitle(application, application?.applicationId);
  }

  const terminalFailureStage = getTerminalFailureStage({
    batchApplication,
    publish,
  });

  if (terminalFailureStage === "ai") {
    return "Your application could not be shortlisted at the initial screening stage. Please continue strengthening your startup idea, product readiness, and market clarity. You may apply again in future opportunities.";
  }

  if (terminalFailureStage === "expert") {
    return "Your application could not be shortlisted after Expert Review. Please continue improving your startup model, innovation strength, and execution plan. You may apply again in future opportunities.";
  }

  if (terminalFailureStage === "written") {
    return "You could not clear the Written Assessment stage this time. Please keep strengthening your startup understanding and apply again in future opportunities.";
  }

  if (terminalFailureStage === "pi") {
    return "Your startup could not clear the Pitch / Personal Interaction stage this time. Please continue improving your product, execution plan, and pitch readiness. You may apply again in future opportunities.";
  }

  const piStatus = resolvePublishedStageStatus({
    stage: "pi",
    batchApplication,
    publish,
  });

  const writtenStatus = resolvePublishedStageStatus({
    stage: "written",
    batchApplication,
    publish,
  });

  const expertStatus = resolvePublishedStageStatus({
    stage: "expert",
    batchApplication,
    publish,
  });

  const aiStatus = resolvePublishedStageStatus({
    stage: "ai",
    batchApplication,
    publish,
  });

  if (publish?.piResult && piStatus === "recognised") {
    return "Congratulations. Your startup has cleared the Pitch / Personal Interaction stage and is recognised under the Startup Bihar initiative.";
  }

  if (publish?.writtenResult && writtenStatus === "selected") {
    return "You have cleared the Written Assessment stage and are eligible for the Pitch / Personal Interaction stage.";
  }

  if (publish?.expertResult && expertStatus === "shortlisted") {
    return "Your application has cleared the Expert Review stage and is eligible for the next stage.";
  }

  if (publish?.aiResult && aiStatus === "shortlisted") {
    return "Your application has cleared the initial screening stage and has moved to the next level of review.";
  }

  return "Your application is under review. Please keep checking the portal for further updates.";
};

const getPitchDeckAccess = ({ batchApplication, publish }) => {
  const writtenStatus = resolvePublishedStageStatus({
    stage: "written",
    batchApplication,
    publish,
  });

  const terminalFailureStage = getTerminalFailureStage({
    batchApplication,
    publish,
  });

  return (
    publish?.writtenResult === true &&
    writtenStatus === "selected" &&
    terminalFailureStage !== "pi"
  );
};

const getCurrentStatusText = ({ application, batchApplication, publish }) => {
  if (!batchApplication) {
    return application?.statusLabel || application?.status || "Draft";
  }

  const terminalFailureStage = getTerminalFailureStage({
    batchApplication,
    publish,
  });

  if (terminalFailureStage === "ai") return "Application Screening Not Shortlisted";
  if (terminalFailureStage === "expert") return "Expert Review Not Shortlisted";
  if (terminalFailureStage === "written") return "Written Assessment Not Cleared";
  if (terminalFailureStage === "pi") return "Pitch / PI Not Cleared";

  const piStatus = resolvePublishedStageStatus({
    stage: "pi",
    batchApplication,
    publish,
  });

  if (publish?.piResult && piStatus === "recognised") {
    return "Recognised";
  }

  const writtenStatus = resolvePublishedStageStatus({
    stage: "written",
    batchApplication,
    publish,
  });

  if (publish?.writtenResult && writtenStatus === "selected") {
    return "Written Assessment Cleared";
  }

  const expertStatus = resolvePublishedStageStatus({
    stage: "expert",
    batchApplication,
    publish,
  });

  if (publish?.expertResult && expertStatus === "shortlisted") {
    return "Expert Review Qualified";
  }

  const aiStatus = resolvePublishedStageStatus({
    stage: "ai",
    batchApplication,
    publish,
  });

  if (publish?.aiResult && aiStatus === "shortlisted") {
    return "Application Screening Qualified";
  }

  return batchApplication?.currentStage
    ? getStatusLabel(batchApplication.currentStage)
    : application?.statusLabel || application?.status || "Draft";
};

const StarRating = ({ value, onChange, disabled = false }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= (hovered || value);

        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => !disabled && setHovered(star)}
            onMouseLeave={() => !disabled && setHovered(0)}
            className={`transition duration-200 ${
              disabled ? "cursor-default" : "hover:scale-110"
            }`}
          >
            <FaStar
              className={`text-[20px] sm:text-[22px] ${
                active ? "text-amber-400" : "text-slate-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

const WebsiteFeedbackPopup = ({ applicationId, application, onSaved }) => {
  const [mounted, setMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);
  const [experience, setExperience] = useState("Excellent");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);

  const sessionDismissKey = `websiteFeedbackDismissed_${
    applicationId || "unknown"
  }`;
  const alreadySubmitted = application?.websiteFeedback?.submitted === true;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !applicationId || alreadySubmitted) {
      setShouldRender(false);
      setVisible(false);
      return;
    }

    const dismissedForSession =
      typeof window !== "undefined" &&
      sessionStorage.getItem(sessionDismissKey) === "1";

    if (dismissedForSession) return;

    const timer = window.setTimeout(() => {
      setShouldRender(true);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [mounted, applicationId, alreadySubmitted, sessionDismissKey]);

  const closePopup = () => {
    setVisible(false);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(sessionDismissKey, "1");
    }

    window.setTimeout(() => {
      setShouldRender(false);
    }, 260);
  };

  const handleSave = async () => {
    if (!applicationId || !experience || !rating) return;

    try {
      setSaving(true);

      await updateDoc(doc(db, "startupApplications", applicationId), {
        websiteFeedback: {
          submitted: true,
          experience,
          message: message.trim(),
          rating,
          submittedAt: serverTimestamp(),
        },
      });

      if (typeof window !== "undefined") {
        sessionStorage.removeItem(sessionDismissKey);
      }

      onSaved?.({
        submitted: true,
        experience,
        message: message.trim(),
        rating,
      });

      setVisible(false);
      window.setTimeout(() => {
        setShouldRender(false);
      }, 220);
    } catch (error) {
      console.error("Failed to save website feedback", error);
      alert("Unable to save feedback right now. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || !applicationId || alreadySubmitted || !shouldRender) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[9999] flex justify-center px-3 sm:bottom-5 sm:justify-end sm:px-5">
      <div
        className={`pointer-events-auto w-full max-w-[360px] overflow-hidden rounded-[24px] border border-white/50 bg-white/95 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-xl transition-all duration-300 ease-out sm:max-w-[390px] ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-8 scale-95 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 px-4 py-3.5 text-white sm:px-5 sm:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <FaCommentDots className="text-sm" />
              </div>

              <div className="min-w-0">
                <div className="text-[15px] font-semibold leading-5">
                  Quick Feedback
                </div>
                <div className="mt-1 text-xs leading-5 text-white/90 sm:text-[13px]">
                  Was everything smooth? Share your thoughts to help us improve.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={closePopup}
              className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Close feedback popup"
            >
              <FaTimes size={12} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Select your experience
          </label>

          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white"
          >
            {feedbackOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <label className="mt-4 mb-1.5 block text-sm font-medium text-slate-700">
            Share your thoughts
          </label>

          <textarea
            rows={3}
            maxLength={250}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How was your form filling experience?"
            className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white"
          />

          <div className="mt-1.5 text-right text-[11px] text-slate-400">
            {message.length}/250
          </div>

          <div className="mt-4">
            <div className="mb-2 text-sm font-medium text-slate-700">
              Your rating
            </div>
            <StarRating value={rating} onChange={setRating} disabled={saving} />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-5 w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving feedback..." : "Submit Feedback"}
          </button>

          <div className="mt-3 text-center text-[11px] text-slate-400">
            Your feedback helps us improve the experience
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ScheduleCard = ({ title, schedule }) => {
  if (!schedule?.date) return null;

  return (
    <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-950">
      <div className="mb-3 font-semibold">{title}</div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="flex items-start gap-2 rounded-xl bg-white/70 p-3">
          <FaCalendarAlt className="mt-0.5 text-indigo-600" />
          <div>
            <div className="text-xs text-indigo-500">Date & Time</div>
            <div className="font-semibold">{formatSlotDateTime(schedule)}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-white/70 p-3">
          <FaLaptop className="mt-0.5 text-indigo-600" />
          <div>
            <div className="text-xs text-indigo-500">Mode</div>
            <div className="font-semibold">{schedule.mode || "-"}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-white/70 p-3">
          <FaMapMarkerAlt className="mt-0.5 text-indigo-600" />
          <div>
            <div className="text-xs text-indigo-500">Venue / Link</div>
            <div className="break-all font-semibold">
              {schedule.venue || "-"}
            </div>
          </div>
        </div>
      </div>

      {schedule.instruction ? (
        <div className="mt-3 rounded-xl bg-white/70 p-3">
          <div className="text-xs text-indigo-500">Instruction</div>
          <div className="mt-1 font-medium">{schedule.instruction}</div>
        </div>
      ) : null}
    </div>
  );
};

const UpdatedPitchDeckCard = ({
  applicationId,
  application,
  batch,
  batchApplication,
  onSaved,
}) => {
  const [deckType, setDeckType] = useState("file");
  const [file, setFile] = useState(null);
  const [canvaLink, setCanvaLink] = useState("");
  const [saving, setSaving] = useState(false);

  const existingDeck =
    application?.UpdatedPitchDeck || batchApplication?.UpdatedPitchDeck || null;

  const maxSize = 25 * 1024 * 1024;

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] || null;

    if (!selected) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    const extension = selected.name.split(".").pop()?.toLowerCase();
    const allowedExtension = ["pdf", "ppt", "pptx"].includes(extension);

    if (!allowedTypes.includes(selected.type) && !allowedExtension) {
      alert("Please upload only PDF, PPT or PPTX file.");
      event.target.value = "";
      setFile(null);
      return;
    }

    if (selected.size > maxSize) {
      alert("Maximum file size allowed is 25 MB.");
      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async () => {
    if (!applicationId) return;

    if (deckType === "file" && !file) {
      alert("Please choose a PDF/PPT/PPTX file.");
      return;
    }

    if (deckType === "canva" && !canvaLink.trim()) {
      alert("Please enter Canva presentation link.");
      return;
    }

    try {
      setSaving(true);

      let payload = {
        type: deckType,
        updatedAt: serverTimestamp(),
        submittedAt: serverTimestamp(),
        source: "after_written_cleared",
      };

      if (deckType === "file") {
        const safeFileName = file.name.replace(/[^\w.\-]+/g, "_");
        const storagePath = `startupApplications/${applicationId}/UpdatedPitchDeck/${Date.now()}_${safeFileName}`;
        const fileRef = ref(storage, storagePath);

        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);

        payload = {
          ...payload,
          fileName: file.name,
          fileSize: file.size,
          contentType: file.type || "",
          storagePath,
          downloadURL,
          canvaLink: "",
        };
      } else {
        payload = {
          ...payload,
          fileName: "",
          fileSize: null,
          contentType: "canva_link",
          storagePath: "",
          downloadURL: "",
          canvaLink: canvaLink.trim(),
        };
      }

      await updateDoc(doc(db, "startupApplications", applicationId), {
        UpdatedPitchDeck: payload,
      });

      const batchId = batch?.id || application?.shortlistingBatch?.batchId;

      if (batchId) {
        await setDoc(
          doc(
            db,
            "startupShortlistingBatches",
            batchId,
            "applications",
            applicationId
          ),
          {
            UpdatedPitchDeck: payload,
            lastUpdatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      onSaved?.(payload);

      setFile(null);
      setCanvaLink("");

      alert("Updated pitch deck saved successfully.");
    } catch (error) {
      console.error("Updated pitch deck upload failed", error);
      alert("Unable to save updated pitch deck. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-5 rounded-[24px] border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
            <FaUpload />
            Updated Pitch Deck
          </div>

          <h3 className="mt-3 text-lg font-bold text-emerald-950">
            Upload updated pitch deck for Pitch / PI stage
          </h3>

          <p className="mt-1 text-sm leading-6 text-emerald-900">
            You have cleared the Written Assessment stage. Upload your updated
            pitch deck as PDF/PPT/PPTX or provide a Canva presentation link.
          </p>
        </div>

        {existingDeck ? (
          <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-emerald-800">
            Deck already submitted
          </div>
        ) : null}
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
        <div className="flex items-start gap-2">
          <FaEnvelope className="mt-1 shrink-0" />
          <div>
            Please also check emails from Startup Bihar regularly. Any
            additional instruction, meeting update, or correction notice may also
            be shared through email.
          </div>
        </div>
      </div>

      {existingDeck ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-white p-4">
          <div className="mb-2 text-sm font-semibold text-slate-800">
            Current submitted updated deck
          </div>

          {existingDeck.type === "canva" ? (
            <a
              href={existingDeck.canvaLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <FaExternalLinkAlt />
              Open Canva Link
            </a>
          ) : existingDeck.downloadURL ? (
            <a
              href={existingDeck.downloadURL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <FaFilePdf />
              Open Uploaded Deck
            </a>
          ) : null}

          <div className="mt-2 text-xs text-slate-500">
            Last updated: {formatDate(existingDeck.updatedAt)}
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 md:grid-cols-[220px_1fr]">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-emerald-800">
            Submission Type
          </label>

          <select
            value={deckType}
            onChange={(e) => setDeckType(e.target.value)}
            className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
          >
            <option value="file">Upload PDF / PPT / PPTX</option>
            <option value="canva">Canva Presentation Link</option>
          </select>
        </div>

        {deckType === "file" ? (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-emerald-800">
              File
            </label>

            <input
              type="file"
              accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              onChange={handleFileChange}
              className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none"
            />

            <div className="mt-1 text-xs text-emerald-800">
              Allowed: PDF, PPT, PPTX. Maximum size: 25 MB.
            </div>
          </div>
        ) : (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Canva Link
            </label>

            <input
              value={canvaLink}
              onChange={(e) => setCanvaLink(e.target.value)}
              placeholder="Paste Canva presentation link"
              className="w-full rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={saving}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <FaUpload />
        {saving
          ? "Saving..."
          : existingDeck
          ? "Replace Updated Pitch Deck"
          : "Submit Updated Pitch Deck"}
      </button>
    </div>
  );
};

const FormStatus = ({ applicationId, onPrevious, formData }) => {
  const [application, setApplication] = useState(formData || null);
  const [batch, setBatch] = useState(null);
  const [batchApplication, setBatchApplication] = useState(null);
  const [timelineDocs, setTimelineDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const publish = batch?.publish || {};

  const applicantMessage = useMemo(() => {
    return getApplicantMessage({
      application,
      batchApplication,
      publish,
    });
  }, [application, batchApplication, publish]);

  const subtitle = useMemo(() => {
    if (batchApplication) return applicantMessage;
    return getFallbackSubtitle(application, applicationId);
  }, [application, applicationId, batchApplication, applicantMessage]);

  const canUploadUpdatedPitchDeck = getPitchDeckAccess({
    batchApplication,
    publish,
  });

  const currentStatusText = useMemo(() => {
    return getCurrentStatusText({
      application,
      batchApplication,
      publish,
    });
  }, [application, batchApplication, publish]);

  const terminalFailureStage = useMemo(() => {
    return getTerminalFailureStage({
      batchApplication,
      publish,
    });
  }, [batchApplication, publish]);

  useEffect(() => {
    const loadStatus = async () => {
      if (!applicationId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const appRef = doc(db, "startupApplications", applicationId);
        const appSnap = await getDoc(appRef);

        let appData = formData || null;

        if (appSnap.exists()) {
          appData = {
            id: appSnap.id,
            ...appSnap.data(),
          };
          setApplication(appData);
        }

        const batchId = appData?.shortlistingBatch?.batchId;

        if (batchId) {
          const batchRef = doc(db, "startupShortlistingBatches", batchId);
          const batchSnap = await getDoc(batchRef);

          if (batchSnap.exists()) {
            setBatch({
              id: batchSnap.id,
              ...batchSnap.data(),
            });
          }

          const batchAppRef = doc(
            db,
            "startupShortlistingBatches",
            batchId,
            "applications",
            applicationId
          );

          const batchAppSnap = await getDoc(batchAppRef);

          if (batchAppSnap.exists()) {
            setBatchApplication({
              id: batchAppSnap.id,
              ...batchAppSnap.data(),
            });
          }
        }

        try {
          const timelineRef = collection(
            db,
            "startupApplications",
            applicationId,
            "timeline"
          );

          const timelineQuery = query(timelineRef, orderBy("createdAt", "asc"));
          const timelineSnap = await getDocs(timelineQuery);

          const items = timelineSnap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((item) => item.visibleToApplicant !== false);

          setTimelineDocs(items);
        } catch (error) {
          console.error("Timeline load failed", error);
          setTimelineDocs([]);
        }
      } catch (error) {
        console.error("Failed to load application status", error);
      } finally {
        setLoading(false);
      }
    };

    loadStatus();
  }, [applicationId, formData]);

  const timelineStatus = useMemo(() => {
    const statusMap = {};

    timelineSteps.forEach((step) => {
      statusMap[step.key] = {
        completed: false,
        visible: true,
        date: null,
        description: step.description,
        status: "pending",
        locked: false,
        inactive: false,
      };
    });

    if (application?.submittedAt || application?.status === "submitted") {
      statusMap.formSubmitted = {
        completed: true,
        visible: true,
        date: application?.submittedAt || application?.updatedAt || null,
        description: "Your application has been submitted successfully.",
        status: "completed",
        locked: false,
        inactive: false,
      };
    }

    if (batchApplication) {
      const aiStatus = resolvePublishedStageStatus({
        stage: "ai",
        batchApplication,
        publish,
      });

      const expertStatus = resolvePublishedStageStatus({
        stage: "expert",
        batchApplication,
        publish,
      });

      const writtenStatus = resolvePublishedStageStatus({
        stage: "written",
        batchApplication,
        publish,
      });

      const piStatus = resolvePublishedStageStatus({
        stage: "pi",
        batchApplication,
        publish,
      });

      statusMap.aiScreening = {
        completed: publish?.aiResult && aiStatus !== "pending",
        visible: true,
        date: publish?.aiResult ? batchApplication?.ai?.updatedAt || null : null,
        description: publish?.aiResult
          ? aiStatus === "shortlisted"
            ? "Your application has cleared the initial screening stage."
            : "Your application could not be shortlisted at the initial screening stage. Later stages are not applicable for this batch."
          : "This stage is pending or the result has not been published yet.",
        status: publish?.aiResult ? aiStatus : "pending",
        locked: !publish?.aiResult,
        inactive: false,
      };

      statusMap.expertReview = {
        completed: publish?.expertResult && expertStatus !== "pending",
        visible: true,
        date: publish?.expertResult
          ? batchApplication?.expert?.updatedAt || null
          : null,
        description: publish?.expertResult
          ? expertStatus === "shortlisted"
            ? "Your application has cleared the Expert Review stage."
            : "Your application could not be shortlisted after Expert Review. Later stages are not applicable for this batch."
          : batchApplication?.ai?.status === "shortlisted"
          ? "This stage is upcoming. Please wait for the Expert Review result to be published."
          : "This stage is pending.",
        status: publish?.expertResult ? expertStatus : "pending",
        locked: !publish?.expertResult,
        inactive: terminalFailureStage === "ai",
      };

      statusMap.writtenAssessment = {
        completed: publish?.writtenResult && writtenStatus !== "pending",
        visible: true,
        date: publish?.writtenResult
          ? batchApplication?.written?.updatedAt || null
          : null,
        description: publish?.writtenResult
          ? writtenStatus === "selected"
            ? "You have cleared the Written Assessment stage."
            : "You could not clear the Written Assessment stage. Later stages are not applicable for this batch."
          : publish?.writtenSchedule
          ? "Your Written Assessment schedule has been published. Result is pending."
          : batchApplication?.expert?.status === "shortlisted"
          ? "This stage is upcoming. Please wait for schedule or result updates."
          : "This stage is pending.",
        status: publish?.writtenResult ? writtenStatus : "pending",
        locked: !publish?.writtenResult,
        inactive: terminalFailureStage === "ai" || terminalFailureStage === "expert",
      };

      statusMap.pitchRecognition = {
        completed: publish?.piResult && piStatus !== "pending",
        visible: true,
        date: publish?.piResult ? batchApplication?.pi?.updatedAt || null : null,
        description: publish?.piResult
          ? piStatus === "recognised"
            ? "Congratulations. You have cleared the Pitch / Personal Interaction stage and your startup is recognised."
            : "You could not clear the Pitch / Personal Interaction stage. Recognition is not applicable for this batch."
          : publish?.piSchedule
          ? "Your Pitch / Personal Interaction schedule has been published. Result is pending."
          : batchApplication?.written?.status === "selected"
          ? "This stage is upcoming. Please prepare your updated pitch deck and check email updates."
          : "This stage is pending.",
        status: publish?.piResult ? piStatus : "pending",
        locked: !publish?.piResult,
        inactive:
          terminalFailureStage === "ai" ||
          terminalFailureStage === "expert" ||
          terminalFailureStage === "written",
      };
    }

    timelineDocs.forEach((item) => {
      if (!item?.key) return;

      statusMap[item.key] = {
        ...(statusMap[item.key] || {}),
        completed: !!item.completed,
        visible: item.visibleToApplicant !== false,
        date: item.createdAt || item.updatedAt || null,
        description: item.description || statusMap[item.key]?.description || "",
        status: item.completed ? "completed" : "pending",
        locked: false,
        inactive: false,
      };
    });

    return statusMap;
  }, [application, batchApplication, publish, timelineDocs, terminalFailureStage]);

  const visibleTimelineSteps = useMemo(() => {
    return timelineSteps.filter(
      (step) => timelineStatus[step.key]?.visible !== false
    );
  }, [timelineStatus]);

  const completedCount = useMemo(() => {
    return visibleTimelineSteps.filter((step) => {
      const state = timelineStatus[step.key];
      return state?.completed && !state?.inactive;
    }).length;
  }, [timelineStatus, visibleTimelineSteps]);

  const inactiveCount = useMemo(() => {
    return visibleTimelineSteps.filter((step) => timelineStatus[step.key]?.inactive)
      .length;
  }, [timelineStatus, visibleTimelineSteps]);

  const pendingCount = visibleTimelineSteps.length - completedCount - inactiveCount;

  const progressPercent =
    visibleTimelineSteps.length > 0
      ? Math.round((completedCount / visibleTimelineSteps.length) * 100)
      : 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl rounded-[28px] border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur">
        <div className="flex items-center gap-3 text-slate-700">
          <FaSpinner className="animate-spin" />
          <span>Loading application status...</span>
        </div>
      </div>
    );
  }

  if (!applicationId) {
    return (
      <div className="mx-auto max-w-5xl rounded-[28px] border border-amber-200 bg-amber-50 p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-amber-900">
          Application Status
        </h2>
        <p className="mt-2 text-amber-800">
          Status will be available after your application ID is created.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-[28px] border border-white/20 bg-white/85 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-slate-800">
                Application Status
              </h2>
              <p className="mt-1 max-w-3xl text-slate-500">{subtitle}</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white shadow-lg">
              <div className="text-xs uppercase tracking-wide text-white/80">
                Current Status
              </div>
              <div className="mt-1 text-lg font-semibold">
                {currentStatusText}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Application ID</div>
              <div className="mt-1 break-all font-semibold text-slate-800">
                {applicationId}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Submitted On</div>
              <div className="mt-1 font-semibold text-slate-800">
                {formatDate(application?.submittedAt) || "Not submitted yet"}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Batch</div>
              <div className="mt-1 font-semibold text-slate-800">
                {batch?.batchName || batch?.batchId || "Not assigned yet"}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Pending Stages</div>
              <div className="mt-1 font-semibold text-slate-800">
                {pendingCount} stage{pendingCount === 1 ? "" : "s"} pending
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
            <div className="flex items-start gap-2">
              <FaInfoCircle className="mt-0.5 shrink-0 text-indigo-600" />
              <div>{applicantMessage}</div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <div className="flex items-start gap-2">
              <FaEnvelope className="mt-1 shrink-0" />
              <div>
                Please check your registered email regularly for communication
                from Startup Bihar, including schedule updates, document
                requirements, or correction notices.
              </div>
            </div>
          </div>

          {publish?.writtenSchedule &&
          batchApplication?.written?.schedule?.date &&
          !["ai", "expert"].includes(terminalFailureStage) ? (
            <ScheduleCard
              title="Written Assessment Schedule"
              schedule={batchApplication.written.schedule}
            />
          ) : null}

          {publish?.piSchedule &&
          batchApplication?.pi?.schedule?.date &&
          !["ai", "expert", "written"].includes(terminalFailureStage) ? (
            <ScheduleCard
              title="Pitch / Personal Interaction Schedule"
              schedule={batchApplication.pi.schedule}
            />
          ) : null}

          {canUploadUpdatedPitchDeck ? (
            <UpdatedPitchDeckCard
              applicationId={applicationId}
              application={application}
              batch={batch}
              batchApplication={batchApplication}
              onSaved={(payload) => {
                setApplication((prev) => ({
                  ...(prev || {}),
                  UpdatedPitchDeck: payload,
                }));

                setBatchApplication((prev) => ({
                  ...(prev || {}),
                  UpdatedPitchDeck: payload,
                }));
              }}
            />
          ) : null}

          {application?.adminRemarks ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="mb-1 font-semibold text-slate-800">
                Admin Remarks
              </div>
              <div>{application.adminRemarks}</div>
            </div>
          ) : null}
        </div>

        <div className="mb-6 rounded-[28px] border border-white/20 bg-white/85 p-6 shadow-xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Progress Summary
            </h3>
            <span className="text-sm font-medium text-slate-600">
              {progressPercent}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              Completed stages: <strong>{completedCount}</strong>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              Pending stages: <strong>{pendingCount}</strong>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
              Inactive stages: <strong>{inactiveCount}</strong>
            </div>
          </div>
        </div>

        <div className="relative rounded-[28px] border border-white/20 bg-white/85 p-6 shadow-xl backdrop-blur">
          <div className="absolute bottom-8 left-11 top-8 w-[2px] bg-gradient-to-b from-indigo-200 via-violet-200 to-slate-200" />

          <div className="space-y-8">
            {visibleTimelineSteps.map((step, index) => {
              const state = timelineStatus[step.key] || {};
              const isCompleted = !!state.completed;
              const status = state.inactive
                ? "inactive"
                : state.status || "pending";
              const negative = isNegativeStatus(status);
              const inactive = state.inactive;

              return (
                <div
                  key={step.key}
                  className={`relative flex items-start gap-5 ${
                    inactive ? "opacity-60" : ""
                  }`}
                >
                  <div
                    className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm ${
                      isCompleted && !negative && !inactive
                        ? "border-emerald-400 bg-emerald-500 text-white"
                        : negative
                        ? "border-rose-300 bg-rose-500 text-white"
                        : inactive
                        ? "border-slate-200 bg-slate-100 text-slate-400"
                        : "border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  >
                    {inactive ? (
                      <FaLock />
                    ) : negative ? (
                      <FaTimesCircle />
                    ) : isCompleted ? (
                      step.key === "pitchRecognition" ? (
                        <FaTrophy />
                      ) : (
                        <FaCheck />
                      )
                    ) : (
                      step.icon
                    )}
                  </div>

                  <div
                    className={`flex-1 rounded-2xl border p-5 shadow-sm ${
                      inactive
                        ? "border-slate-200 bg-slate-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Stage {index + 1} of {visibleTimelineSteps.length}
                        </div>

                        <h4
                          className={`mt-1 text-lg font-semibold ${
                            inactive
                              ? "text-slate-500"
                              : isCompleted
                              ? "text-slate-900"
                              : "text-slate-700"
                          }`}
                        >
                          {step.title}
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">
                          {inactive
                            ? "This stage is not applicable because the application did not clear an earlier stage."
                            : state.description || step.description}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${getStatusTone(
                          status
                        )}`}
                      >
                        {inactive ? (
                          <FaLock size={10} />
                        ) : negative ? (
                          <FaTimesCircle size={10} />
                        ) : isCompleted ? (
                          <FaCheck size={10} />
                        ) : (
                          <FaClock size={10} />
                        )}
                        {inactive
                          ? "Inactive"
                          : isCompleted || negative
                          ? getStatusLabel(status)
                          : "Pending"}
                      </span>
                    </div>

                    {state.date && !inactive ? (
                      <div className="mt-3 text-sm font-medium text-slate-600">
                        Updated on: {formatDate(state.date)}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          {onPrevious && (
            <button
              type="button"
              onClick={onPrevious}
              className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              ← Previous
            </button>
          )}
          <div />
        </div>
      </div>

      <WebsiteFeedbackPopup
        applicationId={applicationId}
        application={application}
        onSaved={(feedback) => {
          setApplication((prev) => ({
            ...(prev || {}),
            websiteFeedback: feedback,
          }));
        }}
      />
    </>
  );
};

export default FormStatus;