import React, { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFileImage,
  FaFlagCheckered,
  FaHourglassHalf,
  FaIdBadge,
  FaPrint,
  FaRegStar,
  FaSpinner,
  FaStar,
  FaTimesCircle,
  FaUserTie,
} from "react-icons/fa";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import { SSU_DEV_MODE } from "../ssuDevMode";
import {
  SSU_APPLICATION_STATUS,
  SSU_TIMELINE_KEYS,
  ssuCollectionPath,
  ssuDocPath,
} from "./ssuFirebasePaths";

const defaultTimelineSteps = [
  {
    key: SSU_TIMELINE_KEYS.registrationStarted,
    title: "Registration Started",
    description: "Your SSU recruitment application has been created.",
    icon: FaIdBadge,
  },
  {
    key: SSU_TIMELINE_KEYS.paymentCompleted,
    title: "Payment Proof Submitted",
    description: "Payment details and screenshot have been submitted for verification.",
    icon: FaClock,
  },
  {
    key: SSU_TIMELINE_KEYS.formSubmitted,
    title: "Application Submitted",
    description: "Your application has been submitted successfully.",
    icon: FaFileAlt,
  },
  {
    key: SSU_TIMELINE_KEYS.stageOneScreening,
    title: "Stage-I Screening",
    description: "Application will be screened by the department.",
    icon: FaHourglassHalf,
  },
  {
    key: SSU_TIMELINE_KEYS.documentVerification,
    title: "Document Verification",
    description: "Submitted documents will be verified.",
    icon: FaCheckCircle,
  },
  {
    key: SSU_TIMELINE_KEYS.writtenExam,
    title: "Written / Technical Evaluation",
    description: "Evaluation details will be updated if applicable.",
    icon: FaFileAlt,
  },
  {
    key: SSU_TIMELINE_KEYS.interview,
    title: "Interview / Interaction",
    description: "Interview details will be updated if applicable.",
    icon: FaUserTie,
  },
  {
    key: SSU_TIMELINE_KEYS.finalSelection,
    title: "Final Selection",
    description: "Final result will be updated after completion of the process.",
    icon: FaFlagCheckered,
  },
];

const statusConfig = {
  draft: {
    label: "Draft",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  payment_pending: {
    label: "Payment Verification Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  payment_completed: {
    label: "Payment Completed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  submitted: {
    label: "Submitted",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  under_review: {
    label: "Under Review",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-cyan-50 text-cyan-700 border-cyan-200",
  },
  selected: {
    label: "Selected",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  waitlisted: {
    label: "Waitlisted",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

const safeDate = (value) => {
  if (!value) return "";

  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  return "";
};

const safeValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const getApplicantName = (application) => {
  return (
    application?.userSignup?.fullName ||
    application?.personalDetails?.fullName ||
    application?.personalDetails?.applicantName ||
    "-"
  );
};

const getPostAppliedFor = (application) => {
  return application?.personalDetails?.postAppliedFor || "-";
};

const getPaymentVerificationStatus = (application) => {
  const payment = application?.paymentDetails || {};
  const adminStatus = payment?.adminVerification?.status;

  if (payment?.verified === true || payment?.verificationStatus === "verified" || adminStatus === "verified") {
    return {
      label: "Verified",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      message: "Payment has been verified by the admin team.",
    };
  }

  if (payment?.verificationStatus === "rejected" || adminStatus === "rejected") {
    return {
      label: "Rejected",
      className: "border-red-200 bg-red-50 text-red-700",
      message:
        payment?.adminVerification?.remarks ||
        "Payment proof has been rejected. Please contact the department/admin.",
    };
  }

  if (payment?.status === "submitted_for_verification") {
    return {
      label: "Pending Verification",
      className: "border-amber-200 bg-amber-50 text-amber-700",
      message: "Payment proof has been submitted and is pending verification.",
    };
  }

  return {
    label: "Not Submitted",
    className: "border-slate-200 bg-slate-50 text-slate-700",
    message: "Payment proof has not been submitted.",
  };
};

const StarRating = ({ value, onChange, disabled }) => {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(n)}
            className={`text-2xl transition ${
              active ? "text-amber-400" : "text-slate-300 hover:text-amber-300"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {active ? <FaStar /> : <FaRegStar />}
          </button>
        );
      })}
    </div>
  );
};

const FeedbackCard = ({ applicationId }) => {
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!applicationId) return;

    setError("");

    if (!message.trim()) {
      setError("Please write a short feedback message.");
      return;
    }

    try {
      setSaving(true);

      if (!SSU_DEV_MODE) {
        await setDoc(
          doc(db, "SSURecruitment", "main", "Feedback", applicationId),
          {
            applicationId,
            message: message.trim(),
            rating,
            source: "applicant_status_page",
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      setSaved(true);
    } catch (err) {
      console.error("Feedback save failed", err);
      setError("Could not save feedback. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <h3 className="text-lg font-bold text-slate-900">Feedback</h3>
      <p className="mt-1 text-sm text-slate-500">
        Share your experience about the application process.
      </p>

      {saved ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Feedback submitted successfully.
        </div>
      ) : (
        <>
          <textarea
            rows={4}
            maxLength={250}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback here..."
            className="mt-4 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)]"
          />

          <div className="mt-1 text-right text-xs text-slate-400">
            {message.length}/250
          </div>

          <div className="mt-4">
            <div className="mb-2 text-sm font-semibold text-slate-700">
              Rating
            </div>
            <StarRating value={rating} onChange={setRating} disabled={saving} />
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-5 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Submit Feedback"}
          </button>
        </>
      )}
    </div>
  );
};

export default function SSUFormStatus({ applicationId, onPrevious, formData }) {
  const [application, setApplication] = useState(formData || null);
  const [timelineDocs, setTimelineDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const paymentStatus = useMemo(() => {
    return getPaymentVerificationStatus(application);
  }, [application]);

  const subtitle = useMemo(() => {
    if (!applicationId) {
      return "Status will be available after your application ID is created.";
    }

    if (application?.status === SSU_APPLICATION_STATUS.selected) {
      return "Congratulations. Your application has been marked as selected.";
    }

    if (application?.status === SSU_APPLICATION_STATUS.rejected) {
      return "Your application has been reviewed. Please check remarks if provided.";
    }

    if (application?.status === SSU_APPLICATION_STATUS.underReview) {
      return "Your application is currently under review.";
    }

    if (application?.status === SSU_APPLICATION_STATUS.submitted) {
      return "Your application has been submitted. Payment proof is subject to verification.";
    }

    if (application?.paymentDetails?.status === "submitted_for_verification") {
      return "Payment proof submitted. Final submission may still be pending.";
    }

    if (application?.userSignup) {
      return "Registration started. Complete all steps and submit the form.";
    }

    return "Complete the form step by step.";
  }, [application, applicationId]);

  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      if (!applicationId) {
        setLoading(false);
        return;
      }

      if (SSU_DEV_MODE) {
        setApplication(formData || null);
        setTimelineDocs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const appRef = doc(db, ...ssuDocPath.application(applicationId));
        const appSnap = await getDoc(appRef);

        if (mounted && appSnap.exists()) {
          setApplication({
            applicationId: appSnap.id,
            ...appSnap.data(),
          });
        }

        try {
          const timelineRef = collection(
            db,
            ...ssuCollectionPath.timeline(applicationId)
          );

          const timelineQuery = query(timelineRef, orderBy("createdAt", "asc"));
          const timelineSnap = await getDocs(timelineQuery);

          const items = timelineSnap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((item) => item.visibleToApplicant !== false);

          if (mounted) setTimelineDocs(items);
        } catch (timelineError) {
          console.error("SSU timeline load failed", timelineError);
          if (mounted) setTimelineDocs([]);
        }
      } catch (error) {
        console.error("Failed to load SSU application status", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStatus();

    return () => {
      mounted = false;
    };
  }, [applicationId, formData]);

  const timelineStatus = useMemo(() => {
    const statusMap = {};

    defaultTimelineSteps.forEach((step) => {
      statusMap[step.key] = {
        completed: false,
        date: null,
        description: step.description,
      };
    });

    if (application?.userSignup || application?.createdAt) {
      statusMap[SSU_TIMELINE_KEYS.registrationStarted] = {
        completed: true,
        date: application?.createdAt || application?.updatedAt || null,
        description: "Your SSU recruitment application has been created.",
      };
    }

    if (application?.paymentDetails?.status === "submitted_for_verification") {
      statusMap[SSU_TIMELINE_KEYS.paymentCompleted] = {
        completed: true,
        date:
          application?.paymentDetails?.submittedAt ||
          application?.paymentDetails?.updatedAt ||
          application?.updatedAt ||
          null,
        description:
          "Payment proof has been submitted and is pending admin verification.",
      };
    }

    if (
      application?.submittedAt ||
      application?.status === SSU_APPLICATION_STATUS.submitted ||
      application?.status === SSU_APPLICATION_STATUS.underReview ||
      application?.status === SSU_APPLICATION_STATUS.shortlisted ||
      application?.status === SSU_APPLICATION_STATUS.selected ||
      application?.status === SSU_APPLICATION_STATUS.rejected ||
      application?.status === SSU_APPLICATION_STATUS.waitlisted
    ) {
      statusMap[SSU_TIMELINE_KEYS.formSubmitted] = {
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

  const status = application?.status || SSU_APPLICATION_STATUS.draft;
  const activeStatus = statusConfig[status] || statusConfig.draft;

  const paymentDetails = application?.paymentDetails || {};
  const screenshotUrl = paymentDetails?.paymentScreenshotMeta?.downloadURL || "";
  const screenshotName =
    paymentDetails?.paymentScreenshotMeta?.fileName || "Payment Screenshot";

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl rounded-[28px] border border-white/70 bg-white/85 p-8 shadow-xl backdrop-blur-xl">
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Application Status
            </h2>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${activeStatus.className}`}
            >
              {activeStatus.label}
            </span>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <FaPrint />
              Print
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <InfoCard label="Application ID" value={applicationId} />
          <InfoCard label="Applicant Name" value={getApplicantName(application)} />
          <InfoCard label="Post Applied For" value={getPostAppliedFor(application)} />
          <InfoCard
            label="Submitted At"
            value={safeDate(application?.submittedAt) || "-"}
          />
        </div>

        {application?.adminRemarks ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <div className="font-semibold">Admin Remarks</div>
            <div className="mt-1">{application.adminRemarks}</div>
          </div>
        ) : null}

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">Process Progress</span>
            <span className="font-semibold text-slate-700">
              {progressPercent}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-slate-900 via-indigo-700 to-emerald-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Payment Verification
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Manual QR payment proof is verified by the admin team.
            </p>
          </div>

          <span
            className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${paymentStatus.className}`}
          >
            {paymentStatus.label}
          </span>
        </div>

        <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${paymentStatus.className}`}>
          {paymentStatus.message}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoCard label="Amount" value={`₹${safeValue(paymentDetails?.amount)}`} />
          <InfoCard
            label="Amount Paid"
            value={`₹${safeValue(paymentDetails?.paymentAmountPaid)}`}
          />
          <InfoCard label="Payment Mode" value={paymentDetails?.paymentMode || "UPI_QR"} />
          <InfoCard label="UTR / Reference No." value={paymentDetails?.utrNumber} />
          <InfoCard label="Payment Date" value={paymentDetails?.paymentDate} />
          <InfoCard label="Payment Time" value={paymentDetails?.paymentTime} />
          <InfoCard label="Payer Name" value={paymentDetails?.payerName} />
          <InfoCard label="Payer Mobile" value={paymentDetails?.payerMobile} />
          <InfoCard label="Payer Bank" value={paymentDetails?.payerBankName} />
        </div>

        {screenshotUrl ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FaFileImage />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Payment Screenshot
                  </div>
                  <div className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {screenshotName}
                  </div>
                </div>
              </div>

              <a
                href={screenshotUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <FaExternalLinkAlt />
                View Screenshot
              </a>
            </div>
          </div>
        ) : null}

        {paymentDetails?.adminVerification?.remarks ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <div className="font-semibold">Verification Remarks</div>
            <div className="mt-1">{paymentDetails.adminVerification.remarks}</div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <h3 className="text-xl font-bold text-slate-900">Application Timeline</h3>
        <p className="mt-1 text-sm text-slate-500">
          Updates will appear here as the recruitment process moves forward.
        </p>

        <div className="mt-6 space-y-4">
          {defaultTimelineSteps.map((step, index) => {
            const item = timelineStatus[step.key] || {};
            const completed = !!item.completed;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full border ${
                      completed
                        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                    }`}
                  >
                    {completed ? <FaCheckCircle /> : <Icon />}
                  </div>

                  {index < defaultTimelineSteps.length - 1 ? (
                    <div
                      className={`mt-2 h-10 w-px ${
                        completed ? "bg-emerald-200" : "bg-slate-200"
                      }`}
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 pb-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div
                      className={`font-semibold ${
                        completed ? "text-slate-900" : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </div>

                    {item.date ? (
                      <div className="text-xs font-medium text-slate-400">
                        {safeDate(item.date)}
                      </div>
                    ) : null}
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.description || step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <FeedbackCard applicationId={applicationId} />

      <div className="flex justify-between print:hidden">
        {onPrevious ? (
          <button
            type="button"
            onClick={onPrevious}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FaArrowLeft />
            Back
          </button>
        ) : (
          <span />
        )}

        {application?.status === SSU_APPLICATION_STATUS.rejected ? (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <FaTimesCircle />
            Not Selected / Rejected
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
            <FaClock />
            Keep checking this page for updates
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value || "-"}
      </div>
    </div>
  );
}