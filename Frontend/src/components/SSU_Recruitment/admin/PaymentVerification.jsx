import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clipboard,
  Copy,
  ExternalLink,
  FileImage,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const normalizeUtr = (value = "") => {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
};

const getApplicationId = (item) => {
  return item?.applicationId || item?.applicationNo || item?.id || "-";
};

const getApplicantName = (item) => {
  return (
    item?.personalDetails?.fullName ||
    item?.userSignup?.fullName ||
    item?.fullName ||
    "-"
  );
};

const getPostName = (item) => {
  return (
    item?.personalDetails?.postEligibilitySnapshot?.postName ||
    item?.personalDetails?.postAppliedFor ||
    item?.postAppliedFor ||
    "-"
  );
};

const getPayment = (item) => item?.paymentDetails || {};

const getPaymentStatus = (item) => {
  const payment = getPayment(item);

  const hasSubmittedProof =
    !!payment?.paymentScreenshotMeta?.downloadURL ||
    !!payment?.utrNumber ||
    !!payment?.submittedAt;

  if (!hasSubmittedProof) return "not_submitted";

  return (
    payment?.adminVerification?.status ||
    payment?.verificationStatus ||
    "pending"
  );
};

const hasPaymentProof = (item) => {
  const payment = getPayment(item);

  return (
    !!payment?.paymentScreenshotMeta?.downloadURL ||
    !!payment?.utrNumber ||
    !!payment?.submittedAt
  );
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

function PaymentStatusBadge({ status }) {
  const key = String(status || "pending").toLowerCase();

  const className =
    key === "verified"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : key === "rejected"
        ? "border-red-200 bg-red-50 text-red-700"
        : key === "not_submitted"
          ? "border-slate-200 bg-slate-50 text-slate-600"
          : "border-amber-200 bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${className}`}
    >
      {key.replaceAll("_", " ")}
    </span>
  );
}

function InfoBox({ label, value, mono = false, action }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </div>
          <div
            className={`mt-1 break-all text-sm font-bold text-slate-900 ${
              mono ? "font-mono" : ""
            }`}
          >
            {safe(value)}
          </div>
        </div>

        {action}
      </div>
    </div>
  );
}

export default function PaymentVerification({
  open,
  applications = [],
  initialIndex = 0,
  onClose,
  onVerify,
  onReject,
}) {
  const paymentApplications = useMemo(() => {
    return applications.filter(hasPaymentProof);
  }, [applications]);

  const [index, setIndex] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [verifiedBy, setVerifiedBy] = useState("admin");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) return;

    const safeIndex =
      initialIndex >= 0 && initialIndex < paymentApplications.length
        ? initialIndex
        : 0;

    setIndex(safeIndex);
    setRemarks("");
    setMessage("");
    setSearch("");
  }, [open, initialIndex, paymentApplications.length]);

  const currentApplication = paymentApplications[index] || null;
  const currentPayment = getPayment(currentApplication);
  const currentUtr = normalizeUtr(currentPayment?.utrNumber || "");
  const currentStatus = getPaymentStatus(currentApplication);

  const duplicateUtrApplications = useMemo(() => {
    if (!currentUtr) return [];

    return applications.filter((item) => {
      const itemUtr = normalizeUtr(item?.paymentDetails?.utrNumber || "");
      const sameUtr = itemUtr && itemUtr === currentUtr;
      const differentApplication = item?.id !== currentApplication?.id;

      return sameUtr && differentApplication;
    });
  }, [applications, currentApplication?.id, currentUtr]);

  const hasVerifiedDuplicate = duplicateUtrApplications.some(
    (item) => getPaymentStatus(item) === "verified"
  );

  const filteredIndexList = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return paymentApplications.map((_, i) => i);

    return paymentApplications
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => {
        const payment = getPayment(item);

        const text = [
          getApplicationId(item),
          getApplicantName(item),
          getPostName(item),
          payment?.utrNumber,
          payment?.paymentDate,
          getPaymentStatus(item),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return text.includes(q);
      })
      .map(({ i }) => i);
  }, [paymentApplications, search]);

  const goPrevious = () => {
    if (paymentApplications.length === 0) return;
    setMessage("");
    setRemarks("");
    setIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    if (paymentApplications.length === 0) return;
    setMessage("");
    setRemarks("");
    setIndex((prev) => Math.min(paymentApplications.length - 1, prev + 1));
  };

  const jumpToIndex = (nextIndex) => {
    setMessage("");
    setRemarks("");
    setIndex(nextIndex);
  };

  const copyUtr = async () => {
    if (!currentUtr) return;

    try {
      await navigator.clipboard.writeText(currentUtr);
      setCopied(true);
      setTimeout(() => setCopied(false), 1300);
    } catch {
      setCopied(false);
    }
  };

  const handleVerify = async () => {
    if (!currentApplication) return;

    if (hasVerifiedDuplicate) {
      setMessage(
        "This UTR is already verified in another application. Verification is blocked."
      );
      return;
    }

    if (duplicateUtrApplications.length > 0) {
      const proceed = window.confirm(
        `Duplicate UTR found in ${duplicateUtrApplications.length} other application(s). Verify only if you have manually checked SBI Collect report. Continue?`
      );

      if (!proceed) return;
    }

    try {
      setSaving(true);
      setMessage("");

      const result = await onVerify?.({
        application: currentApplication,
        remarks,
        verifiedBy,
      });

      if (result?.ok === false) {
        setMessage(result.error || "Could not verify payment.");
        return;
      }

      setMessage("Payment verified successfully.");

      setTimeout(() => {
        if (index < paymentApplications.length - 1) {
          goNext();
        }
      }, 500);
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!currentApplication) return;

    const finalRemarks =
      remarks.trim() || "Payment could not be verified from SBI Collect report.";

    try {
      setSaving(true);
      setMessage("");

      const result = await onReject?.({
        application: currentApplication,
        remarks: finalRemarks,
        verifiedBy,
      });

      if (result?.ok === false) {
        setMessage(result.error || "Could not reject payment.");
        return;
      }

      setMessage("Payment rejected.");

      setTimeout(() => {
        if (index < paymentApplications.length - 1) {
          goNext();
        }
      }, 500);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const screenshotUrl = currentPayment?.paymentScreenshotMeta?.downloadURL || "";
  const screenshotName =
    currentPayment?.paymentScreenshotMeta?.fileName ||
    "SBI Collect payment screenshot";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm">
      <div className="flex h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[34px] border border-white/80 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
        <div className="border-b border-slate-100 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-5 py-5 text-white md:px-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                Dedicated Payment Verification
              </div>

              <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                SBI Collect Payment Queue
              </h2>

              <p className="mt-2 text-sm text-white/65">
                Verify payment screenshot, UTR and payment date. Duplicate UTR
                warning is shown automatically.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                {paymentApplications.length
                  ? `${index + 1} / ${paymentApplications.length}`
                  : "0 / 0"}
              </div>

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

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[300px_1fr_380px]">
          <aside className="hidden min-h-0 border-r border-slate-100 bg-slate-50 lg:block">
            <div className="border-b border-slate-100 p-4">
              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search UTR, name, app ID"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="h-full overflow-auto p-3">
              {filteredIndexList.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                  No payment proof found.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredIndexList.map((realIndex) => {
                    const item = paymentApplications[realIndex];
                    const payment = getPayment(item);
                    const status = getPaymentStatus(item);
                    const active = realIndex === index;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => jumpToIndex(realIndex)}
                        className={`w-full rounded-2xl border p-3 text-left transition ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <div className="text-sm font-bold">
                          {safe(getApplicationId(item))}
                        </div>
                        <div
                          className={`mt-1 truncate text-xs ${
                            active ? "text-white/70" : "text-slate-500"
                          }`}
                        >
                          {safe(getApplicantName(item))}
                        </div>
                        <div
                          className={`mt-1 truncate font-mono text-xs ${
                            active ? "text-white/70" : "text-slate-500"
                          }`}
                        >
                          {safe(payment?.utrNumber)}
                        </div>
                        <div className="mt-2">
                          <PaymentStatusBadge status={status} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          <main className="min-h-0 overflow-auto bg-slate-100 p-4 md:p-5">
            {!currentApplication ? (
              <div className="flex h-full items-center justify-center">
                <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <FileImage className="mx-auto text-slate-400" size={44} />
                  <h3 className="mt-4 text-lg font-bold text-slate-900">
                    No payment proof available
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Payment proof queue is empty.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-4xl">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={goPrevious}
                    disabled={index === 0}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArrowLeft size={16} />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={index >= paymentApplications.length - 1}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {safe(screenshotName)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Main screenshot preview
                        </div>
                      </div>

                      {screenshotUrl ? (
                        <a
                          href={screenshotUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          <ExternalLink size={15} />
                          Open Original
                        </a>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex min-h-[560px] items-center justify-center bg-slate-50 p-4">
                    {screenshotUrl ? (
                      screenshotUrl.toLowerCase().includes(".pdf") ? (
                        <iframe
                          title="SBI Collect Payment Proof"
                          src={screenshotUrl}
                          className="h-[620px] w-full rounded-2xl border border-slate-200 bg-white"
                        />
                      ) : (
                        <img
                          src={screenshotUrl}
                          alt="Payment proof"
                          className="max-h-[680px] w-auto rounded-2xl border border-slate-200 bg-white object-contain shadow-sm"
                        />
                      )
                    ) : (
                      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                        No screenshot available.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>

          <aside className="min-h-0 overflow-auto border-l border-slate-100 bg-white p-4 md:p-5">
            {currentApplication ? (
              <div className="space-y-4">
                <div className="rounded-[26px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-lg font-bold text-slate-900">
                    {safe(getApplicantName(currentApplication))}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">
                    {safe(getPostName(currentApplication))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <PaymentStatusBadge status={currentStatus} />

                    {currentPayment?.adminVerification?.utrVerified ? (
                      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        UTR verified
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                        UTR not verified
                      </span>
                    )}
                  </div>
                </div>

                <InfoBox
                  label="Application ID"
                  value={getApplicationId(currentApplication)}
                  mono
                />

                <InfoBox
                  label="UTR / Transaction Reference No."
                  value={currentUtr}
                  mono
                  action={
                    <button
                      type="button"
                      onClick={copyUtr}
                      disabled={!currentUtr}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                      title="Copy UTR"
                    >
                      {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                    </button>
                  }
                />

                <InfoBox
                  label="Payment Date"
                  value={currentPayment?.paymentDate}
                />

                <InfoBox
                  label="Amount"
                  value={
                    currentPayment?.amount
                      ? `₹${currentPayment.amount}`
                      : "-"
                  }
                />

                <InfoBox
                  label="Payment Mode"
                  value={currentPayment?.paymentMode || "SBI_COLLECT"}
                />

                <InfoBox
                  label="Submitted At"
                  value={formatDateTime(currentPayment?.submittedAt)}
                />

                {duplicateUtrApplications.length > 0 ? (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      hasVerifiedDuplicate
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold">
                      <ShieldAlert size={16} />
                      Duplicate UTR Found
                    </div>

                    <div className="mt-2 leading-relaxed">
                      This UTR is also used in:
                    </div>

                    <div className="mt-2 space-y-2">
                      {duplicateUtrApplications.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-current/20 bg-white/70 px-3 py-2"
                        >
                          <div className="font-mono text-xs font-bold">
                            {safe(getApplicationId(item))}
                          </div>
                          <div className="text-xs">
                            {safe(getApplicantName(item))} •{" "}
                            {safe(getPaymentStatus(item))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {hasVerifiedDuplicate ? (
                      <div className="mt-2 font-semibold">
                        Verification is blocked because this UTR is already
                        verified elsewhere.
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <div className="flex items-center gap-2 font-bold">
                      <ShieldCheck size={16} />
                      No duplicate UTR found
                    </div>
                  </div>
                )}

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
                    placeholder="Optional remarks"
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                {message ? (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                      message.includes("success")
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : message.includes("rejected")
                          ? "border-amber-200 bg-amber-50 text-amber-800"
                          : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                ) : null}

                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={
                      saving ||
                      currentStatus === "verified" ||
                      hasVerifiedDuplicate
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <ShieldCheck size={17} />
                    )}
                    Verify Payment
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={saving || currentStatus === "rejected"}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle size={17} />
                    Reject Payment
                  </button>
                </div>

                <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-xs leading-relaxed text-blue-800">
                  After verification, applicant status page will show payment as
                  verified/rejected. The dashboard payment column will also
                  update after refresh.
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}