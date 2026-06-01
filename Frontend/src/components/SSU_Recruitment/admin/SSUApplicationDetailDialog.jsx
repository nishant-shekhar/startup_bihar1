import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  UserRound,
  FileText,
  BriefcaseBusiness,
  GraduationCap,
  Building2,
  MapPin,
  Phone,
  CreditCard,
  ShieldCheck,
  ExternalLink,
  BadgeCheck,
  AlertTriangle,
  Download,
  Save,
  RefreshCw,
  ClipboardCheck,
  Eye,
} from "lucide-react";

const STATUS_OPTIONS = [
  "draft",
  "payment_pending",
  "submitted",
  "under_review",
  "shortlisted",
  "selected",
  "waitlisted",
  "rejected",
];

const PAYMENT_STATUS_OPTIONS = ["pending", "verified", "rejected"];

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const formatDateTime = (value) => {
  if (!value) return "-";

  try {
    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (value?.seconds) {
      return new Date(value.seconds * 1000).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

const normalizeStatus = (value) => {
  return String(value || "draft").trim().toLowerCase();
};

const getApplicationId = (app) =>
  app?.applicationId || app?.applicationNo || app?.id || "-";

const getApplicantName = (app) => {
  return (
    app?.personalDetails?.fullName ||
    app?.userSignup?.fullName ||
    app?.fullName ||
    "-"
  );
};

const getEmail = (app) => {
  return app?.personalDetails?.email || app?.userSignup?.email || app?.email || "-";
};

const getPhone = (app) => {
  return (
    app?.personalDetails?.phoneNumber ||
    app?.userSignup?.phoneNumber ||
    app?.phoneNumber ||
    "-"
  );
};

const getPostSnapshot = (app) => {
  return app?.personalDetails?.postEligibilitySnapshot || {};
};

const getPostName = (app) => {
  return (
    app?.personalDetails?.postEligibilitySnapshot?.postName ||
    app?.personalDetails?.postAppliedFor ||
    app?.postAppliedFor ||
    "-"
  );
};

const getPaymentStatus = (app) => {
  const payment = app?.paymentDetails || {};

  const hasSubmittedProof =
    !!payment?.paymentScreenshotMeta?.downloadURL ||
    !!payment?.paymentScreenshotMeta?.url ||
    !!payment?.utrNumber ||
    !!payment?.submittedAt;

  if (!hasSubmittedProof) return "not_submitted";

  return payment?.adminVerification?.status || payment?.verificationStatus || "pending";
};

const getFinalDeclaration = (app) => {
  return (
    app?.finalDeclaration === true ||
    app?.declaration?.accepted === true ||
    app?.previewDeclaration === true ||
    app?.isFinalSubmitted === true
  );
};

const statusToneMap = {
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  payment_pending: "border-amber-200 bg-amber-50 text-amber-700",
  submitted: "border-sky-200 bg-sky-50 text-sky-700",
  under_review: "border-indigo-200 bg-indigo-50 text-indigo-700",
  shortlisted: "border-cyan-200 bg-cyan-50 text-cyan-700",
  selected: "border-emerald-200 bg-emerald-50 text-emerald-700",
  waitlisted: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const paymentToneMap = {
  verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  not_submitted: "border-slate-200 bg-slate-100 text-slate-600",
};

function SSUAdminBadge({ value, type = "status" }) {
  const key = String(value || "").trim().toLowerCase();

  const tone =
    type === "payment"
      ? paymentToneMap[key] || paymentToneMap.not_submitted
      : statusToneMap[key] || statusToneMap.draft;

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}
    >
      {safe(key.replaceAll("_", " "))}
    </span>
  );
}

function SSUAdminYesNoBadge({ value }) {
  return value ? (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      Yes
    </span>
  ) : (
    <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      No
    </span>
  );
}

function SSUAdminInfoItem({ label, value, mono = false }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
      <div
        className={`mt-1 break-words text-sm font-semibold text-slate-800 ${
          mono ? "font-mono" : ""
        }`}
      >
        {safe(value)}
      </div>
    </div>
  );
}

function SSUAdminSection({ icon: Icon, title, subtitle, children, action }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Icon size={18} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
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
    </section>
  );
}

function SSUAdminFileLink({ label, meta }) {
  const url =
    meta?.downloadURL ||
    meta?.url ||
    meta?.fileUrl ||
    meta?.fileURL ||
    meta?.publicUrl ||
    "";

  if (!url) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        {label}: Not uploaded
      </div>
    );
  }

  const fileName =
    meta?.fileName ||
    meta?.filename ||
    meta?.name ||
    meta?.originalName ||
    meta?.path ||
    "View file";

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
    >
      <span className="min-w-0 break-all">
        {label}: {fileName}
      </span>
      <ExternalLink size={16} className="shrink-0" />
    </a>
  );
}

const humanizeKey = (value) => {
  return String(value || "")
    .replace(/Meta$/i, "")
    .replace(/File$/i, "")
    .replace(/URL$/i, "")
    .replace(/Url$/i, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
};

const isFileMetaObject = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return !!(
    value.downloadURL ||
    value.url ||
    value.fileUrl ||
    value.fileURL ||
    value.publicUrl
  );
};

const getFileUrl = (meta) => {
  return (
    meta?.downloadURL ||
    meta?.url ||
    meta?.fileUrl ||
    meta?.fileURL ||
    meta?.publicUrl ||
    ""
  );
};

const getFileName = (meta, fallback = "View file") => {
  return (
    meta?.fileName ||
    meta?.filename ||
    meta?.name ||
    meta?.originalName ||
    meta?.path ||
    fallback
  );
};

const getReadableDocumentLabel = (node, path = []) => {
  if (node?.label) return node.label;
  if (node?.documentLabel) return node.documentLabel;
  if (node?.documentType) return humanizeKey(node.documentType);
  if (node?.type) return humanizeKey(node.type);

  const lastKey = path[path.length - 1] || "Document";
  const parentKey = path[path.length - 2] || "";

  const joined = `${humanizeKey(parentKey)} ${humanizeKey(lastKey)}`.trim();

  return joined || "Uploaded Document";
};

const collectUploadedFiles = (source) => {
  const files = [];
  const seen = new Set();

  const skipKeys = new Set([
    "password",
    "otp",
    "token",
    "accessToken",
    "refreshToken",
    "idToken",
  ]);

  const walk = (node, path = []) => {
    if (!node || typeof node !== "object") return;

    if (isFileMetaObject(node)) {
      const url = getFileUrl(node);
      if (!url || seen.has(url)) return;

      seen.add(url);

      files.push({
        label: getReadableDocumentLabel(node, path),
        meta: {
          ...node,
          downloadURL: url,
          fileName: getFileName(node),
        },
        path: path.join("."),
      });

      return;
    }

    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        walk(item, [...path, String(index + 1)]);
      });
      return;
    }

    Object.entries(node).forEach(([key, value]) => {
      if (skipKeys.has(key)) return;
      walk(value, [...path, key]);
    });
  };

  walk(source);

  return files;
};

function SSUAdminDynamicFileGrid({ files }) {
  if (!files?.length) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
        No uploaded documents found in this application record.
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {files.map((file, index) => (
        <div key={`${file.meta.downloadURL}-${index}`} className="space-y-1">
          <SSUAdminFileLink label={file.label} meta={file.meta} />

          <div className="px-1 text-[11px] text-slate-400">
            Saved at: {file.path}
          </div>
        </div>
      ))}
    </div>
  );
}

function SSUAdminTable({ columns, rows, emptyText = "No records available." }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-3 font-semibold"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows?.length ? (
              rows.map((row, index) => (
                <tr key={index} className="align-top">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-700">
                      {safe(row?.[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SSUAdminTabButton({ active, onClick, children, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}

function SSUPaymentVerificationPanel({
  application,
  onPaymentVerificationUpdate,
  onAfterUpdate,
}) {
  const payment = application?.paymentDetails || {};
  const adminVerification = payment?.adminVerification || {};

  const [status, setStatus] = useState(
    adminVerification?.status || payment?.verificationStatus || "pending"
  );
  const [utrVerified, setUtrVerified] = useState(
    adminVerification?.utrVerified === true
  );
  const [verifiedBy, setVerifiedBy] = useState(
    adminVerification?.verifiedBy || "admin"
  );
  const [remarks, setRemarks] = useState(adminVerification?.remarks || "");
  const [saving, setSaving] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    setStatus(adminVerification?.status || payment?.verificationStatus || "pending");
    setUtrVerified(adminVerification?.utrVerified === true);
    setVerifiedBy(adminVerification?.verifiedBy || "admin");
    setRemarks(adminVerification?.remarks || "");
  }, [application?.id]);

  const handleSave = async () => {
    if (!onPaymentVerificationUpdate) return;

    try {
      setSaving(true);
      setLocalMessage("");

      const result = await onPaymentVerificationUpdate({
        applicationId: application?.id,
        status,
        remarks,
        verifiedBy,
        utrVerified,
      });

      if (result?.ok === false) {
        setLocalMessage(result.error || "Could not update payment verification.");
        return;
      }

      setLocalMessage("Payment verification updated.");
      onAfterUpdate?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <SSUAdminInfoItem
            label="Payment Mode"
            value={payment?.paymentMode || "SBI_COLLECT"}
          />
          <SSUAdminInfoItem
            label="Amount"
            value={payment?.amount ? `₹${payment.amount}` : "-"}
          />
          <SSUAdminInfoItem label="Payment Date" value={payment?.paymentDate} />
          <SSUAdminInfoItem
            label="UTR / Reference No."
            value={payment?.utrNumber}
            mono
          />
          <SSUAdminInfoItem
            label="Applicant Submitted At"
            value={formatDateTime(payment?.submittedAt)}
          />

          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Current Status
            </div>
            <div className="mt-2">
              <SSUAdminBadge value={getPaymentStatus(application)} type="payment" />
            </div>
          </div>
        </div>

        <SSUAdminFileLink
          label="SBI Collect Success Screenshot"
          meta={payment?.paymentScreenshotMeta}
        />

        {adminVerification?.remarks ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <div className="font-semibold">Existing Remarks</div>
            <div className="mt-1">{adminVerification.remarks}</div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
        <div className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
          <ShieldCheck size={18} />
          Verify Payment
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Verification Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              {PAYMENT_STATUS_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={utrVerified}
              onChange={(e) => setUtrVerified(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">
              UTR verified against SBI Collect report
            </span>
          </label>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Verified By
            </label>
            <input
              value={verifiedBy}
              onChange={(e) => setVerifiedBy(e.target.value)}
              placeholder="Admin name / ID"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Verification remarks"
              rows={4}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {localMessage ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                localMessage.includes("updated")
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {localMessage}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : "Save Verification"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SSUStatusUpdatePanel({ application, onStatusUpdate, onAfterUpdate }) {
  const [status, setStatus] = useState(normalizeStatus(application?.status));
  const [saving, setSaving] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  useEffect(() => {
    setStatus(normalizeStatus(application?.status));
  }, [application?.id, application?.status]);

  const handleSave = async () => {
    if (!onStatusUpdate) return;

    try {
      setSaving(true);
      setLocalMessage("");

      const result = await onStatusUpdate({
        applicationId: application?.id,
        status,
      });

      if (result?.ok === false) {
        setLocalMessage(result.error || "Could not update application status.");
        return;
      }

      setLocalMessage("Application status updated.");
      onAfterUpdate?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
        <ClipboardCheck size={18} />
        Application Status
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-800">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
          >
            {STATUS_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : "Update Status"}
        </button>
      </div>

      {localMessage ? (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            localMessage.includes("updated")
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {localMessage}
        </div>
      ) : null}
    </div>
  );
}

export default function SSUApplicationDetailDialog({
  open,
  application,
  onClose,
  onPaymentVerificationUpdate,
  onStatusUpdate,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (open) setActiveTab("overview");
  }, [open, application?.id]);

  const postSnapshot = useMemo(() => getPostSnapshot(application), [application]);

  const uploadedFiles = useMemo(() => {
    return collectUploadedFiles(application);
  }, [application]);

  if (!open || !application) return null;

  const personal = application?.personalDetails || {};
  const education = application?.educationalQualifications || {};
  const experience = application?.workExperience || {};
  const payment = application?.paymentDetails || {};
  const declarationDone = getFinalDeclaration(application);

  const educationRows = Array.isArray(education?.education)
    ? education.education
    : [
        education?.tenth,
        education?.twelfth,
        ...(education?.graduations || []),
        ...(education?.postGraduations || []),
        ...(education?.others || []),
      ].filter(Boolean);

  const experienceRows = Array.isArray(experience?.workExperience)
    ? experience.workExperience
    : [];

  const certificationRows = Array.isArray(education?.certifications)
    ? education.certifications
    : [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm">
      <div className="flex max-h-[94vh] w-full max-w-[1480px] flex-col overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-5 py-5 text-white md:px-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                SSU Application Detail
              </div>

              <h2 className="mt-3 break-words text-2xl font-bold md:text-3xl">
                {safe(getApplicantName(application))}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/70">
                <span>{safe(getApplicationId(application))}</span>
                <span>•</span>
                <span>{safe(getPostName(application))}</span>
                <span>•</span>
                <span>{safe(getEmail(application))}</span>
                <span>•</span>
                <span>{safe(getPhone(application))}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SSUAdminBadge value={application?._status || application?.status} />
              <SSUAdminBadge value={getPaymentStatus(application)} type="payment" />

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 md:px-7">
          <div className="flex flex-wrap gap-2">
            <SSUAdminTabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              icon={Eye}
            >
              Overview
            </SSUAdminTabButton>

            <SSUAdminTabButton
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              icon={UserRound}
            >
              Profile
            </SSUAdminTabButton>

            <SSUAdminTabButton
              active={activeTab === "education"}
              onClick={() => setActiveTab("education")}
              icon={GraduationCap}
            >
              Education
            </SSUAdminTabButton>

            <SSUAdminTabButton
              active={activeTab === "experience"}
              onClick={() => setActiveTab("experience")}
              icon={BriefcaseBusiness}
            >
              Experience
            </SSUAdminTabButton>

            <SSUAdminTabButton
              active={activeTab === "payment"}
              onClick={() => setActiveTab("payment")}
              icon={CreditCard}
            >
              Payment
            </SSUAdminTabButton>

            <SSUAdminTabButton
              active={activeTab === "documents"}
              onClick={() => setActiveTab("documents")}
              icon={FileText}
            >
              Documents
            </SSUAdminTabButton>

            <SSUAdminTabButton
              active={activeTab === "admin"}
              onClick={() => setActiveTab("admin")}
              icon={BadgeCheck}
            >
              Admin Action
            </SSUAdminTabButton>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-slate-50 p-5 md:p-7">
          {activeTab === "overview" ? (
            <div className="space-y-5">
              <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
                <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                  {personal?.profilePhotoMeta?.downloadURL ||
                  personal?.profilePhotoMeta?.url ? (
                    <img
                      src={
                        personal?.profilePhotoMeta?.downloadURL ||
                        personal?.profilePhotoMeta?.url
                      }
                      alt={getApplicantName(application)}
                      className="h-52 w-full rounded-[24px] border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center rounded-[24px] bg-slate-100 text-slate-400">
                      <UserRound size={44} />
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <div className="text-lg font-bold text-slate-900">
                      {safe(getApplicantName(application))}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {safe(getPostName(application))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <SSUAdminInfoItem
                    label="Application ID"
                    value={getApplicationId(application)}
                    mono
                  />
                  <SSUAdminInfoItem
                    label="Status"
                    value={normalizeStatus(application?.status).replaceAll("_", " ")}
                  />
                  <SSUAdminInfoItem
                    label="Payment"
                    value={getPaymentStatus(application).replaceAll("_", " ")}
                  />
                  <SSUAdminInfoItem label="Email" value={getEmail(application)} />
                  <SSUAdminInfoItem label="Mobile" value={getPhone(application)} />
                  <SSUAdminInfoItem label="District" value={personal?.presentDistrict} />
                  <SSUAdminInfoItem label="Category" value={personal?.category} />
                  <SSUAdminInfoItem label="DOB" value={personal?.dateOfBirth} />
                  <SSUAdminInfoItem
                    label="Submitted At"
                    value={formatDateTime(application?.submittedAt)}
                  />
                </div>
              </div>

              <SSUAdminSection
                icon={BriefcaseBusiness}
                title="Post Eligibility Snapshot"
                subtitle="Exact ToR eligibility snapshot saved with the application"
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <SSUAdminInfoItem
                    label="Post"
                    value={postSnapshot?.postName || getPostName(application)}
                  />
                  <SSUAdminInfoItem label="Level" value={postSnapshot?.level} />
                  <SSUAdminInfoItem label="Category" value={postSnapshot?.category} />
                  <SSUAdminInfoItem
                    label="Emoluments"
                    value={postSnapshot?.emoluments}
                  />
                  <div className="md:col-span-2">
                    <SSUAdminInfoItem
                      label="Required Qualification"
                      value={postSnapshot?.qualification}
                    />
                  </div>
                  <div className="md:col-span-3">
                    <SSUAdminInfoItem
                      label="Required Experience"
                      value={postSnapshot?.experience}
                    />
                  </div>
                </div>
              </SSUAdminSection>

              <SSUAdminSection
                icon={AlertTriangle}
                title="Declarations"
                subtitle="Applicant confirmation status"
              >
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Final Declaration
                    </div>
                    <div className="mt-2">
                      <SSUAdminYesNoBadge value={declarationDone} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Qualification Declaration
                    </div>
                    <div className="mt-2">
                      <SSUAdminYesNoBadge
                        value={education?.qualificationDeclaration}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Experience Declaration
                    </div>
                    <div className="mt-2">
                      <SSUAdminYesNoBadge
                        value={experience?.experienceDeclaration}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Payment Declaration
                    </div>
                    <div className="mt-2">
                      <SSUAdminYesNoBadge value={payment?.applicantDeclaration} />
                    </div>
                  </div>
                </div>
              </SSUAdminSection>
            </div>
          ) : null}

          {activeTab === "profile" ? (
            <div className="space-y-5">
              <SSUAdminSection icon={UserRound} title="Personal Details">
                <div className="grid gap-4 md:grid-cols-3">
                  <SSUAdminInfoItem label="Full Name" value={personal?.fullName} />
                  <SSUAdminInfoItem
                    label="Father/Husband Name"
                    value={personal?.fathersName}
                  />
                  <SSUAdminInfoItem label="Mother Name" value={personal?.mothersName} />
                  <SSUAdminInfoItem
                    label="Date of Birth"
                    value={personal?.dateOfBirth}
                  />
                  <SSUAdminInfoItem label="Gender" value={personal?.gender} />
                  <SSUAdminInfoItem label="Category" value={personal?.category} />
                  <SSUAdminInfoItem
                    label="Nationality"
                    value={personal?.nationality}
                  />
                </div>
              </SSUAdminSection>

              <SSUAdminSection icon={Phone} title="Contact Details">
                <div className="grid gap-4 md:grid-cols-3">
                  <SSUAdminInfoItem
                    label="Email"
                    value={personal?.email || getEmail(application)}
                  />
                  <SSUAdminInfoItem
                    label="Mobile"
                    value={personal?.phoneNumber || getPhone(application)}
                  />
                  <SSUAdminInfoItem
                    label="Alternate Mobile"
                    value={personal?.alternateNumber}
                  />
                </div>
              </SSUAdminSection>

              <SSUAdminSection icon={MapPin} title="Address Details">
                <div className="grid gap-4 md:grid-cols-2">
                  <SSUAdminInfoItem
                    label="Present Address"
                    value={personal?.presentAddress}
                  />
                  <SSUAdminInfoItem
                    label="Permanent Address"
                    value={personal?.permanentAddress}
                  />
                  <SSUAdminInfoItem
                    label="Present State"
                    value={personal?.presentState}
                  />
                  <SSUAdminInfoItem
                    label="Permanent State"
                    value={personal?.permanentState}
                  />
                  <SSUAdminInfoItem
                    label="Present District"
                    value={personal?.presentDistrict}
                  />
                  <SSUAdminInfoItem
                    label="Permanent District"
                    value={personal?.permanentDistrict}
                  />
                  <SSUAdminInfoItem
                    label="Present Pincode"
                    value={personal?.presentPincode}
                  />
                  <SSUAdminInfoItem
                    label="Permanent Pincode"
                    value={personal?.permanentPincode}
                  />
                </div>
              </SSUAdminSection>
            </div>
          ) : null}

          {activeTab === "education" ? (
            <div className="space-y-5">
              <SSUAdminSection
                icon={GraduationCap}
                title="Educational Qualifications"
                subtitle="10th, 12th, graduation, post graduation and other qualifications"
              >
                <SSUAdminTable
                  columns={[
                    { key: "level", label: "Level" },
                    { key: "degree", label: "Degree" },
                    { key: "specialisation", label: "Specialisation" },
                    { key: "institution", label: "Institution" },
                    { key: "boardUniversity", label: "Board / University" },
                    { key: "yearOfPassing", label: "Year" },
                    { key: "percentage", label: "% / CGPA" },
                    { key: "status", label: "Status" },
                  ]}
                  rows={educationRows}
                />
              </SSUAdminSection>

              <SSUAdminSection icon={BadgeCheck} title="Certifications">
                <SSUAdminTable
                  columns={[
                    { key: "certName", label: "Certification" },
                    { key: "issuingOrg", label: "Organisation" },
                    { key: "year", label: "Year" },
                    { key: "duration", label: "Duration" },
                  ]}
                  rows={certificationRows}
                  emptyText="No certifications added."
                />
              </SSUAdminSection>
            </div>
          ) : null}

          {activeTab === "experience" ? (
            <div className="space-y-5">
              <SSUAdminSection icon={BriefcaseBusiness} title="Experience Summary">
                <div className="grid gap-4 md:grid-cols-4">
                  <SSUAdminInfoItem
                    label="Total Experience"
                    value={experience?.totalExperienceText}
                  />
                  <SSUAdminInfoItem
                    label="Relevant Experience"
                    value={experience?.relevantExperienceText}
                  />
                  <SSUAdminInfoItem
                    label="Total Years"
                    value={experience?.totalExpYears}
                  />
                  <SSUAdminInfoItem
                    label="Relevant Years"
                    value={experience?.relevantExpYears}
                  />
                  <div className="md:col-span-4">
                    <SSUAdminInfoItem
                      label="Required Experience as per ToR"
                      value={
                        experience?.requiredExperienceText ||
                        postSnapshot?.experience
                      }
                    />
                  </div>
                </div>
              </SSUAdminSection>

              <SSUAdminSection icon={Building2} title="Employment History">
                <SSUAdminTable
                  columns={[
                    { key: "organisation", label: "Organisation" },
                    { key: "designation", label: "Designation" },
                    { key: "from", label: "From" },
                    { key: "to", label: "To" },
                    { key: "currentlyWorking", label: "Current" },
                    { key: "natureOfWork", label: "Nature of Work" },
                  ]}
                  rows={experienceRows.map((row) => ({
                    ...row,
                    currentlyWorking: row?.currentlyWorking ? "Yes" : "No",
                  }))}
                  emptyText="No employment history added."
                />
              </SSUAdminSection>
            </div>
          ) : null}

          {activeTab === "payment" ? (
            <SSUAdminSection
              icon={CreditCard}
              title="SBI Collect Payment"
              subtitle="Verify UTR and payment screenshot against SBI Collect report"
            >
              <SSUPaymentVerificationPanel
                application={application}
                onPaymentVerificationUpdate={onPaymentVerificationUpdate}
              />
            </SSUAdminSection>
          ) : null}

          {activeTab === "documents" ? (
            <div className="space-y-5">
              <SSUAdminSection
                icon={FileText}
                title="Uploaded Files"
                subtitle="All uploaded files found in the application record"
              >
                <SSUAdminDynamicFileGrid files={uploadedFiles} />
              </SSUAdminSection>

              
            </div>
          ) : null}

          {activeTab === "admin" ? (
            <div className="space-y-5">
              <SSUAdminSection
                icon={BadgeCheck}
                title="Admin Actions"
                subtitle="Update application status and payment verification"
              >
                <div className="grid gap-5 lg:grid-cols-2">
                  <SSUStatusUpdatePanel
                    application={application}
                    onStatusUpdate={onStatusUpdate}
                  />

                  <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                      <Download size={18} />
                      Quick Files
                    </div>

                    <div className="space-y-3">
                      {uploadedFiles.slice(0, 6).map((file, index) => (
                        <SSUAdminFileLink
                          key={`${file.meta.downloadURL}-${index}`}
                          label={file.label}
                          meta={file.meta}
                        />
                      ))}

                      {!uploadedFiles.length ? (
                        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-500">
                          No uploaded files found.
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                      Admin can use the main Excel download from dashboard for
                      filtered exports.
                    </div>
                  </div>
                </div>
              </SSUAdminSection>

              <SSUAdminSection icon={RefreshCw} title="System Metadata">
                <div className="grid gap-4 md:grid-cols-3">
                  <SSUAdminInfoItem
                    label="Firestore Doc ID"
                    value={application?.id}
                    mono
                  />
                  <SSUAdminInfoItem
                    label="Created At"
                    value={formatDateTime(application?.createdAt)}
                  />
                  <SSUAdminInfoItem
                    label="Updated At"
                    value={formatDateTime(application?.updatedAt)}
                  />
                  <SSUAdminInfoItem
                    label="Submitted At"
                    value={formatDateTime(application?.submittedAt)}
                  />
                  <SSUAdminInfoItem
                    label="Registered At"
                    value={formatDateTime(application?.registeredAt)}
                  />
                  <SSUAdminInfoItem
                    label="Application Source"
                    value={application?.source || "SSU Recruitment"}
                  />
                </div>
              </SSUAdminSection>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between md:px-7">
          <div className="text-sm text-slate-500">
            Application ID:{" "}
            <span className="font-semibold text-slate-800">
              {safe(getApplicationId(application))}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <X size={16} />
            Close
          </button>
        </div>
      </div>
    </div>
  );
}