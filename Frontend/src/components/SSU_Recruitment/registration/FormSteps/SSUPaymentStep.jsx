import React, { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaCopy,
  FaExternalLinkAlt,
  FaFileImage,
  FaInfoCircle,
  FaReceipt,
  FaTimes,
  FaUniversity,
} from "react-icons/fa";

const APPLICATION_FEE = Number(import.meta.env.VITE_SSU_APPLICATION_FEE || 1000);

const SBI_COLLECT_LINK =
  import.meta.env.VITE_SSU_SBI_COLLECT_LINK || "";

const initialState = {
  status: "submitted_for_verification",
  verificationStatus: "pending",
  amount: APPLICATION_FEE,
  currency: "INR",
  paymentMode: "SBI_COLLECT",

  sbiCollectLink: SBI_COLLECT_LINK,
  utrNumber: "",
  paymentDate: "",
  paymentScreenshotMeta: null,
  paymentScreenshotFile: null,

  applicantDeclaration: false,
  submittedAt: "",
  verified: false,

  adminVerification: {
    status: "pending",
    verifiedBy: "",
    verifiedAt: null,
    remarks: "",
  },
};

const inputClass =
  "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "mb-2 block text-sm font-semibold text-slate-800";

const todayIso = () => new Date().toISOString().slice(0, 10);

const validate = (values) => {
  const errors = {};

  if (!values.utrNumber.trim()) {
    errors.utrNumber = "UTR / transaction reference number is required.";
  } else if (values.utrNumber.trim().length < 8) {
    errors.utrNumber = "Enter a valid UTR / transaction reference number.";
  }

  if (!values.paymentDate) {
    errors.paymentDate = "Payment date is required.";
  }

  if (!values.paymentScreenshotMeta && !values.paymentScreenshotFile) {
    errors.paymentScreenshotFile = "Upload SBI Collect success screenshot.";
  }

  if (!values.applicantDeclaration) {
    errors.applicantDeclaration = "Please accept the declaration.";
  }

  return errors;
};

function ErrorText({ children }) {
  if (!children) return null;
  return <div className="mt-1 text-xs font-medium text-red-600">{children}</div>;
}

function PaymentStatusPill({ details }) {
  if (!details?.status) return null;

  const adminStatus = details?.adminVerification?.status;
  const isVerified =
    details?.verified === true ||
    details?.verificationStatus === "verified" ||
    adminStatus === "verified";

  const isRejected =
    details?.verificationStatus === "rejected" || adminStatus === "rejected";

  if (isVerified) {
    return (
      <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        Payment verified by admin.
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        Payment rejected. Please check admin remarks and resubmit if allowed.
      </div>
    );
  }

  if (details.status === "submitted_for_verification") {
    return (
      <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
        Payment proof submitted. Verification is pending.
      </div>
    );
  }

  return null;
}

export default function SSUPaymentStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly,
  formData,
}) {
  const applicationId = formData?.applicationId || "";

  const [values, setValues] = useState({
    ...initialState,
    ...(initialValues || {}),
    paymentMode: "SBI_COLLECT",
    sbiCollectLink:
      initialValues?.sbiCollectLink || SBI_COLLECT_LINK || "",
    paymentScreenshotFile: null,
    applicantDeclaration: initialValues?.applicantDeclaration || false,
  });

  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const canEdit = !isReadOnly;

  const alreadySubmitted =
    values?.status === "submitted_for_verification" &&
    values?.paymentScreenshotMeta?.downloadURL;

  const effectiveSbiCollectLink = useMemo(() => {
    return values?.sbiCollectLink || SBI_COLLECT_LINK || "";
  }, [values?.sbiCollectLink]);

  const setField = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const copyApplicationId = async () => {
    if (!applicationId) return;

    try {
      await navigator.clipboard.writeText(applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const handleScreenshot = (file) => {
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        paymentScreenshotFile: "Only JPG, PNG, WEBP or PDF file is allowed.",
      }));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        paymentScreenshotFile: "File must be below 2 MB.",
      }));
      return;
    }

    setValues((prev) => ({
      ...prev,
      paymentScreenshotFile: file,
      paymentScreenshotMeta: null,
    }));

    setErrors((prev) => ({
      ...prev,
      paymentScreenshotFile: "",
    }));

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  const clearScreenshot = () => {
    setValues((prev) => ({
      ...prev,
      paymentScreenshotFile: null,
      paymentScreenshotMeta: null,
    }));
    setPreviewUrl("");
  };

  const handleSubmit = async () => {
    const nextValues = {
      status: "submitted_for_verification",
      verificationStatus: "pending",
      amount: APPLICATION_FEE,
      currency: "INR",
      paymentMode: "SBI_COLLECT",

      sbiCollectLink: effectiveSbiCollectLink,
      utrNumber: String(values.utrNumber || "").trim().toUpperCase(),
      paymentDate: values.paymentDate || "",
      paymentScreenshotMeta: values.paymentScreenshotMeta || null,
      paymentScreenshotFile: values.paymentScreenshotFile || null,

      applicantDeclaration: !!values.applicantDeclaration,
      submittedAt: new Date().toISOString(),
      verified: false,

      adminVerification: values.adminVerification || {
        status: "pending",
        verifiedBy: "",
        verifiedAt: null,
        remarks: "",
      },
    };

    const nextErrors = validate(nextValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitting(true);
      const result = await onSubmit(nextValues);

      if (result?.ok === false) {
        setErrors({
          form: result.error || "Could not save payment details.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 rounded-[34px] border border-white/80 bg-white/78 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <FaUniversity />
              SBI Collect Payment
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Application Fee Payment
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              Pay the application fee through SBI Collect. Use your application
              number in the SBI Collect form, then upload the success screenshot
              and transaction reference number.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
            <div className="text-xs font-semibold uppercase tracking-[0.18em]">
              Amount
            </div>
            <div className="mt-1 text-3xl font-bold">₹{APPLICATION_FEE}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
          <PaymentStatusPill details={initialValues || values} />

          <div className="rounded-[28px] border border-indigo-100 bg-indigo-50/80 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <FaReceipt />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-indigo-950">
                  Application Number for SBI Collect
                </div>

                <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="break-all rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-lg font-bold tracking-wide text-slate-900">
                    {applicationId || "Application ID not generated"}
                  </div>

                  <button
                    type="button"
                    onClick={copyApplicationId}
                    disabled={!applicationId}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaCopy />
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-indigo-900/80">
                  Copy this application number and paste it in the relevant field
                  of the SBI Collect payment form.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Payment Mode</label>
              <input value="SBI Collect" disabled className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Application Fee</label>
              <input value={`₹${APPLICATION_FEE}`} disabled className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>UTR / Transaction Reference No. *</label>
              <input
                value={values.utrNumber}
                disabled={!canEdit}
                onChange={(e) =>
                  setField("utrNumber", e.target.value.toUpperCase())
                }
                placeholder="Enter SBI Collect transaction reference / UTR"
                className={inputClass}
              />
              <ErrorText>{errors.utrNumber}</ErrorText>
            </div>

            <div>
              <label className={labelClass}>Payment Date *</label>
              <input
                type="date"
                value={values.paymentDate}
                max={todayIso()}
                disabled={!canEdit}
                onChange={(e) => setField("paymentDate", e.target.value)}
                className={inputClass}
              />
              <ErrorText>{errors.paymentDate}</ErrorText>
            </div>
          </div>

          <div className="mt-5">
            <label className={labelClass}>SBI Collect Success Screenshot *</label>

            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
              {values.paymentScreenshotMeta?.downloadURL ? (
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <FaFileImage />
                    </div>

                    <div className="min-w-0">
                      <div className="break-all text-sm font-semibold text-slate-800">
                        {values.paymentScreenshotMeta.fileName ||
                          "SBI Collect screenshot uploaded"}
                      </div>
                      <a
                        href={values.paymentScreenshotMeta.downloadURL}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 underline"
                      >
                        <FaExternalLinkAlt />
                        View uploaded file
                      </a>
                    </div>
                  </div>

                  {canEdit ? (
                    <button
                      type="button"
                      onClick={clearScreenshot}
                      className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                    >
                      <FaTimes />
                      Replace
                    </button>
                  ) : null}
                </div>
              ) : values.paymentScreenshotFile ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                        <FaFileImage />
                      </div>

                      <div className="min-w-0">
                        <div className="break-all text-sm font-semibold text-slate-800">
                          {values.paymentScreenshotFile.name}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          File ready for upload
                        </div>
                      </div>
                    </div>

                    {canEdit ? (
                      <button
                        type="button"
                        onClick={clearScreenshot}
                        className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                      >
                        <FaTimes />
                        Remove
                      </button>
                    ) : null}
                  </div>

                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="SBI Collect success screenshot preview"
                      className="max-h-72 rounded-2xl border border-slate-200 object-contain"
                    />
                  ) : null}
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white px-4 py-8 text-center transition hover:bg-slate-100">
                  <FaCloudUploadAlt className="text-3xl text-slate-400" />
                  <div className="mt-3 text-sm font-semibold text-slate-800">
                    Upload SBI Collect success screenshot
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    JPG, PNG, WEBP or PDF. Max 2 MB.
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    className="hidden"
                    disabled={!canEdit}
                    onChange={(e) => handleScreenshot(e.target.files?.[0])}
                  />
                </label>
              )}
            </div>

            <ErrorText>{errors.paymentScreenshotFile}</ErrorText>
          </div>

          <label className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <input
              type="checkbox"
              checked={!!values.applicantDeclaration}
              disabled={!canEdit}
              onChange={(e) =>
                setField("applicantDeclaration", e.target.checked)
              }
              className="mt-1 h-4 w-4 rounded border-slate-300"
            />

            <span className="text-sm text-slate-700">
              I confirm that I have paid the application fee through SBI Collect
              and the uploaded screenshot and transaction reference number are
              correct.
            </span>
          </label>
          <ErrorText>{errors.applicantDeclaration}</ErrorText>

          {errors.form ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors.form}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onPrevious}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <FaArrowLeft />
              Back
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !canEdit}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaCheckCircle />
              {submitting
                ? "Saving Payment Proof..."
                : alreadySubmitted
                  ? "Update & Proceed"
                  : "Submit Payment Proof"}
            </button>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <FaUniversity />
              SBI Collect
            </div>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Open SBI Collect, complete payment, then return to this page and
              upload proof.
            </p>

            {effectiveSbiCollectLink ? (
              <a
                href={effectiveSbiCollectLink}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <FaExternalLinkAlt />
                Pay via SBI Collect
              </a>
            ) : (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                SBI Collect link is not configured.
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Application Number
              </div>
              <div className="mt-1 break-all text-sm font-bold text-slate-900">
                {applicationId || "-"}
              </div>
            </div>

            <button
              type="button"
              onClick={copyApplicationId}
              disabled={!applicationId}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaCopy />
              {copied ? "Copied Application Number" : "Copy Application Number"}
            </button>
          </div>

          <div className="rounded-[28px] border border-blue-200 bg-blue-50 p-5 text-sm text-blue-800">
            <div className="flex items-center gap-2 font-bold">
              <FaInfoCircle />
              Instructions
            </div>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              <li>Copy your application number.</li>
              <li>Click Pay via SBI Collect.</li>
              <li>Use the application number in SBI Collect form.</li>
              <li>Complete payment successfully.</li>
              <li>Return here and upload success screenshot.</li>
              <li>Enter UTR / transaction reference number.</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}