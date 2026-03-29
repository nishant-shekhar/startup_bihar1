import React, { useEffect, useMemo, useState } from "react";
import {
  FaCheck,
  FaClock,
  FaFileAlt,
  FaUsers,
  FaPen,
  FaUserTie,
  FaTrophy,
  FaSpinner,
} from "react-icons/fa";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
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
    title: "Written Assessment",
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

const FormStatus = ({ applicationId, onPrevious, formData }) => {
  const [application, setApplication] = useState(formData || null);
  const [timelineDocs, setTimelineDocs] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 rounded-[28px] border border-white/20 bg-white/85 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              Application Status
            </h2>
            <p className="mt-1 text-slate-500">
              Track your Startup Bihar application in real time
            </p>
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
  );
};

export default FormStatus;