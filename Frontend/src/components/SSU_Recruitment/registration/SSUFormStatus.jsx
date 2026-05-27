import React, { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaBell,
  FaCheckCircle,
  FaClock,
  FaExternalLinkAlt,
  FaFileAlt,
  FaFlag,
  FaHourglassHalf,
  FaPrint,
  FaReceipt,
  FaSpinner,
  FaTimesCircle,
  FaUniversity,
} from "react-icons/fa";
import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import {
  SSU_APPLICATION_STATUS,
  ssuDocPath,
} from "./ssuFirebasePaths";

const safeValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const safeDate = (value) => {
  if (!value) return "-";

  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

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

  return String(value);
};

const statusConfig = {
  draft: {
    label: "Draft",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
  payment_pending: {
    label: "Payment Verification Pending",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  payment_completed: {
    label: "Payment Completed",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  submitted: {
    label: "Application Submitted",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  under_review: {
    label: "Under Review",
    className: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  selected: {
    label: "Selected",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  waitlisted: {
    label: "Waitlisted",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

const colorClassMap = {
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  blue: "border-blue-200 bg-blue-50 text-blue-800",
  green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  red: "border-red-200 bg-red-50 text-red-800",
  slate: "border-slate-200 bg-slate-50 text-slate-800",
};

const defaultResultAnnouncement = {
  active: false,
  title: "Result Announcement",
  message:
    "Result notification will be published here after completion of scrutiny and payment verification.",
  resultLink: "",
  color: "blue",
};

const defaultPaymentVerification = {
  enabled: true,
  requireUtrUnique: true,
  showPaymentVerificationStatus: true,
  pendingMessage:
    "Your application has been submitted. Payment proof and UTR are pending verification.",
  verifiedMessage:
    "Your payment has been verified. Result notification will be published as per schedule.",
  rejectedMessage:
    "Your payment proof could not be verified. Please check remarks or contact the department.",
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

const getPaymentState = (application, paymentVerificationSettings) => {
  const payment = application?.paymentDetails || {};
  const adminStatus = payment?.adminVerification?.status || "pending";
  const verificationStatus = payment?.verificationStatus || adminStatus;

  const verified =
    payment?.verified === true ||
    verificationStatus === "verified" ||
    adminStatus === "verified";

  const rejected = verificationStatus === "rejected" || adminStatus === "rejected";

  const submitted =
    payment?.status === "submitted_for_verification" ||
    !!payment?.paymentScreenshotMeta?.downloadURL ||
    !!payment?.utrNumber;

  if (verified) {
    return {
      key: "verified",
      label: "Payment Verified",
      icon: <FaCheckCircle />,
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      message:
        paymentVerificationSettings?.verifiedMessage ||
        defaultPaymentVerification.verifiedMessage,
    };
  }

  if (rejected) {
    return {
      key: "rejected",
      label: "Payment Rejected",
      icon: <FaTimesCircle />,
      className: "border-red-200 bg-red-50 text-red-700",
      message:
        payment?.adminVerification?.remarks ||
        paymentVerificationSettings?.rejectedMessage ||
        defaultPaymentVerification.rejectedMessage,
    };
  }

  if (submitted) {
    return {
      key: "pending",
      label: "Payment Verification Pending",
      icon: <FaHourglassHalf />,
      className: "border-amber-200 bg-amber-50 text-amber-700",
      message:
        paymentVerificationSettings?.pendingMessage ||
        defaultPaymentVerification.pendingMessage,
    };
  }

  return {
    key: "not_submitted",
    label: "Payment Proof Not Submitted",
    icon: <FaClock />,
    className: "border-slate-200 bg-slate-50 text-slate-700",
    message: "Payment proof has not been submitted.",
  };
};

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-semibold text-slate-800">
        {safeValue(value)}
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const activeStatus = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${activeStatus.className}`}
    >
      {activeStatus.label}
    </span>
  );
}

function SectionCard({ icon, title, subtitle, children, action }) {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
            {icon}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            {subtitle ? (
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {action}
      </div>

      {children}
    </div>
  );
}

function ApplicationSubmittedBox({ application }) {
  const submittedAt = application?.submittedAt || application?.updatedAt;

  return (
    <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
          <FaCheckCircle className="text-2xl" />
        </div>

        <div className="min-w-0">
          <div className="text-xl font-bold">Application Submitted</div>
          <p className="mt-2 text-sm leading-relaxed">
            Your SSU recruitment application has been submitted successfully.
            Please keep your application number for future reference.
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-white/75 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Application Number
              </div>
              <div className="mt-1 break-all text-lg font-bold text-emerald-950">
                {safeValue(application?.applicationId || application?.applicationNo)}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white/75 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Submitted At
              </div>
              <div className="mt-1 text-sm font-bold text-emerald-950">
                {safeDate(submittedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentVerificationBox({ application, settings }) {
  if (settings?.showPaymentVerificationStatus === false) {
    return null;
  }

  const payment = application?.paymentDetails || {};
  const paymentState = getPaymentState(application, settings);

  return (
    <SectionCard
      icon={<FaUniversity />}
      title="Payment Verification"
      subtitle="SBI Collect payment proof and UTR verification status"
      action={
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${paymentState.className}`}
        >
          {paymentState.icon}
          {paymentState.label}
        </span>
      }
    >
      <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${paymentState.className}`}>
        {paymentState.message}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoCard label="Payment Mode" value={payment?.paymentMode || "SBI_COLLECT"} />
        <InfoCard label="Amount" value={payment?.amount ? `₹${payment.amount}` : "-"} />
        <InfoCard label="Payment Date" value={payment?.paymentDate || "-"} />
        <InfoCard label="UTR / Reference No." value={payment?.utrNumber || "-"} />
        <InfoCard
          label="Verification Status"
          value={
            payment?.adminVerification?.status ||
            payment?.verificationStatus ||
            "pending"
          }
        />
        <InfoCard
          label="UTR Verified"
          value={payment?.adminVerification?.utrVerified ? "Yes" : "Pending"}
        />
      </div>

      {payment?.paymentScreenshotMeta?.downloadURL ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FaReceipt />
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  SBI Collect Screenshot
                </div>
                <div className="mt-1 break-all text-sm font-semibold text-slate-800">
                  {payment.paymentScreenshotMeta.fileName || "Payment screenshot"}
                </div>
              </div>
            </div>

            <a
              href={payment.paymentScreenshotMeta.downloadURL}
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

      {payment?.adminVerification?.remarks ? (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <div className="font-semibold">Verification Remarks</div>
          <div className="mt-1">{payment.adminVerification.remarks}</div>
        </div>
      ) : null}
    </SectionCard>
  );
}

function ResultAnnouncementBox({ announcement }) {
  const active = announcement?.active === true;

  const className =
    colorClassMap[announcement?.color || "blue"] || colorClassMap.blue;

  return (
    <SectionCard
      icon={<FaFlag />}
      title={announcement?.title || "Result Announcement"}
      subtitle="Official notification related to result or further process"
      action={
        active ? (
          <span className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${className}`}>
            Active
          </span>
        ) : (
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
            Awaiting Notification
          </span>
        )
      }
    >
      {active ? (
        <div className={`rounded-2xl border px-5 py-4 ${className}`}>
          <div className="flex items-start gap-3">
            <FaBell className="mt-1 shrink-0" />
            <div className="min-w-0">
              <div className="font-bold">
                {announcement?.title || "Result Announcement"}
              </div>

              <p className="mt-2 text-sm leading-relaxed">
                {announcement?.message ||
                  "Result notification has been published."}
              </p>

              {announcement?.resultLink ? (
                <a
                  href={announcement.resultLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-current bg-white/70 px-4 py-2 text-sm font-semibold hover:bg-white"
                >
                  <FaExternalLinkAlt />
                  Open Notification
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <FaClock className="mt-0.5 shrink-0 text-slate-500" />
            <div>
              <div className="font-semibold text-slate-900">
                Result notification is not published yet.
              </div>
              <p className="mt-1 leading-relaxed">
                {announcement?.message ||
                  defaultResultAnnouncement.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}

function BasicApplicationSummary({ application }) {
  return (
    <SectionCard
      icon={<FaFileAlt />}
      title="Application Summary"
      subtitle="Basic details submitted in the application"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <InfoCard
          label="Application ID"
          value={application?.applicationId || application?.applicationNo}
        />
        <InfoCard label="Applicant Name" value={getApplicantName(application)} />
        <InfoCard label="Post Applied For" value={getPostAppliedFor(application)} />
        <InfoCard
          label="Current Status"
          value={
            statusConfig[application?.status]?.label ||
            safeValue(application?.status)
          }
        />
      </div>
    </SectionCard>
  );
}

export default function SSUFormStatus({ applicationId, onPrevious, formData }) {
  const [application, setApplication] = useState(formData || null);
  const [resultAnnouncement, setResultAnnouncement] = useState(
    defaultResultAnnouncement
  );
  const [paymentVerificationSettings, setPaymentVerificationSettings] = useState(
    defaultPaymentVerification
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const status = application?.status || SSU_APPLICATION_STATUS.draft;

  const subtitle = useMemo(() => {
    if (!applicationId) {
      return "Status will be available after your application ID is created.";
    }

    if (status === SSU_APPLICATION_STATUS.submitted) {
      return "Application submitted successfully. Check payment verification and result notification below.";
    }

    if (status === SSU_APPLICATION_STATUS.paymentPending) {
      return "Payment proof submitted. Final submission may still be pending.";
    }

    return "Complete and submit your SSU recruitment application to see final status.";
  }, [applicationId, status]);

  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      if (!applicationId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError("");

        const [appSnap, resultSnap, paymentVerificationSnap] = await Promise.all([
          getDoc(doc(db, ...ssuDocPath.application(applicationId))),
          getDoc(doc(db, ...ssuDocPath.settingResultAnnouncement())),
          getDoc(doc(db, ...ssuDocPath.settingPaymentVerification())),
        ]);

        if (mounted && appSnap.exists()) {
          setApplication({
            applicationId: appSnap.id,
            ...appSnap.data(),
          });
        }

        if (mounted && resultSnap.exists()) {
          setResultAnnouncement({
            ...defaultResultAnnouncement,
            ...resultSnap.data(),
          });
        }

        if (mounted && paymentVerificationSnap.exists()) {
          setPaymentVerificationSettings({
            ...defaultPaymentVerification,
            ...paymentVerificationSnap.data(),
          });
        }
      } catch (error) {
        console.error("Failed to load SSU application status", error);
        if (mounted) {
          setLoadError("Could not load application status. Please try again.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStatus();

    return () => {
      mounted = false;
    };
  }, [applicationId]);

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

  if (loadError) {
    return (
      <div className="mx-auto max-w-5xl rounded-[28px] border border-red-200 bg-red-50 p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-red-900">
          Could not load status
        </h2>
        <p className="mt-2 text-red-800">{loadError}</p>

        {onPrevious ? (
          <button
            type="button"
            onClick={onPrevious}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100"
          >
            <FaArrowLeft />
            Back
          </button>
        ) : null}
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
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={status} />

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
      </div>

      <ApplicationSubmittedBox application={application} />

      <PaymentVerificationBox
        application={application}
        settings={paymentVerificationSettings}
      />

      <ResultAnnouncementBox announcement={resultAnnouncement} />

      <BasicApplicationSummary application={application} />

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

        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
          <FaClock />
          Check this page for result notification
        </div>
      </div>
    </div>
  );
}