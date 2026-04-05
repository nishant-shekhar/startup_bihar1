import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaCheck,
  FaClock,
  FaFileAlt,
  FaUsers,
  FaPen,
  FaUserTie,
  FaTrophy,
  FaSpinner,
  FaStar,
  FaTimes,
  FaCommentDots,
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
} from "firebase/firestore";
import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";

const defaultTimelineSteps = [
  {
    key: "formSubmitted",
    title: "Application Submitted",
    icon: <FaFileAlt />,
    description: "Your application has been submitted successfully.",
  },
  {
    key: "stageOneAccepted",
    title: "Stage 1 Review",
    icon: <FaCheck />,
    description: "Initial scrutiny by Startup Bihar team.",
  },
  {
    key: "expertPanelReview",
    title: "Expert Panel Review",
    icon: <FaUsers />,
    description: "Detailed evaluation by expert panel.",
  },
  {
    key: "writtenExam",
    title: "Written Assessment Test",
    icon: <FaPen />,
    description: "Assessment stage, if applicable.",
  },
  {
    key: "personalInterview",
    title: "Personal Interview",
    icon: <FaUserTie />,
    description: "Interview with evaluation committee.",
  },
  {
    key: "startupRecognised",
    title: "Startup Recognised",
    icon: <FaTrophy />,
    description: "Your startup has been officially recognised.",
  },
];

const feedbackOptions = [
  "Excellent",
  "Very Good",
  "Good",
  "Could Be Better",
  "Found a bug / Issue",
];

const formatDate = (value) => {
  if (!value) return "";

  let date = null;

  if (typeof value?.toDate === "function") {
    date = value.toDate();
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

  const sessionDismissKey = `websiteFeedbackDismissed_${applicationId || "unknown"}`;
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

    if (dismissedForSession) {
      return;
    }

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
            placeholder="How was your form filling experience? We hope everything worked well for you."
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

const FormStatus = ({ applicationId, onPrevious, formData }) => {
  const [application, setApplication] = useState(formData || null);
  const [timelineDocs, setTimelineDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const subtitle = useMemo(() => {
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
  }, [application, applicationId]);

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

        if (appSnap.exists()) {
          setApplication(appSnap.data());
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
  }, [applicationId]);

  const timelineStatus = useMemo(() => {
    const statusMap = {};

    defaultTimelineSteps.forEach((step) => {
      statusMap[step.key] = {
        completed: false,
        date: null,
        description: step.description,
      };
    });

    if (application?.submittedAt || application?.status === "submitted") {
      statusMap.formSubmitted = {
        completed: true,
        date: application?.submittedAt || application?.updatedAt || null,
        description: "Your application has been submitted successfully.",
      };
    }

    timelineDocs.forEach((item) => {
      if (!item?.key) return;

      statusMap[item.key] = {
        completed: !!item.completed,
        date: item.createdAt || item.updatedAt || null,
        description: item.description || statusMap[item.key]?.description || "",
      };
    });

    return statusMap;
  }, [application, timelineDocs]);

  const completedCount = useMemo(() => {
    return defaultTimelineSteps.filter(
      (step) => timelineStatus[step.key]?.completed
    ).length;
  }, [timelineStatus]);

  const progressPercent = Math.round(
    (completedCount / defaultTimelineSteps.length) * 100
  );

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
        <h2 className="text-2xl font-bold text-amber-900">Application Status</h2>
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
              <p className="mt-1 text-slate-500">{subtitle}</p>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white shadow-lg">
              <div className="text-xs uppercase tracking-wide text-white/80">
                Current Status
              </div>
              <div className="mt-1 text-lg font-semibold">
                {application?.statusLabel || application?.status || "Draft"}
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
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
              <div className="text-xs text-slate-500">Progress</div>
              <div className="mt-1 font-semibold text-slate-800">
                {completedCount} / {defaultTimelineSteps.length} stages completed
              </div>
            </div>
          </div>

          {application?.statusMessage ? (
            <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
              {application.statusMessage}
            </div>
          ) : null}

          {application?.adminRemarks ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="mb-1 font-semibold text-slate-800">Admin Remarks</div>
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
        </div>

        <div className="relative rounded-[28px] border border-white/20 bg-white/85 p-6 shadow-xl backdrop-blur">
          <div className="absolute bottom-8 left-11 top-8 w-[2px] bg-gradient-to-b from-indigo-200 via-violet-200 to-slate-200" />

          <div className="space-y-8">
            {defaultTimelineSteps.map((step) => {
              const state = timelineStatus[step.key] || {};
              const isCompleted = !!state.completed;

              return (
                <div key={step.key} className="relative flex items-start gap-5">
                  <div
                    className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm ${
                      isCompleted
                        ? "border-emerald-400 bg-emerald-500 text-white"
                        : "border-slate-200 bg-slate-100 text-slate-500"
                    }`}
                  >
                    {isCompleted ? <FaCheck /> : step.icon}
                  </div>

                  <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h4
                          className={`text-lg font-semibold ${
                            isCompleted ? "text-slate-900" : "text-slate-700"
                          }`}
                        >
                          {step.title}
                        </h4>

                        <p className="mt-1 text-sm text-slate-500">
                          {state.description || step.description}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                          isCompleted
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isCompleted ? <FaCheck size={10} /> : <FaClock size={10} />}
                        {isCompleted ? "Completed" : "Pending"}
                      </span>
                    </div>

                    {state.date ? (
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