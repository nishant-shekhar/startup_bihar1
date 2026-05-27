import React, { useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaFileImage,
  FaInfoCircle,
  FaQrcode,
  FaTimes,
} from "react-icons/fa";

const APPLICATION_FEE = Number(import.meta.env.VITE_SSU_APPLICATION_FEE || 500);
const QR_IMAGE_SRC =
  import.meta.env.VITE_SSU_UPI_QR_IMAGE || "/ssu-upi-qr.png";
const UPI_ID = import.meta.env.VITE_SSU_UPI_ID || "";
const PAYEE_NAME =
  import.meta.env.VITE_SSU_UPI_PAYEE_NAME || "Startup Support Unit";

const todayIso = () => new Date().toISOString().slice(0, 10);

const initialState = {
  status: "submitted_for_verification",
  verificationStatus: "pending",
  amount: APPLICATION_FEE,
  currency: "INR",
  paymentMode: "UPI_QR",

  payerMobile: "",
  payerUpiId: "",
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

const normalizePhone = (value = "") =>
  String(value || "").replace(/\D/g, "").slice(0, 10);

const validateUpi = (value = "") => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return false;
  return /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/.test(trimmed);
};

const validate = (values) => {
  const errors = {};

  if (!/^\d{10}$/.test(values.payerMobile.trim())) {
    errors.payerMobile = "Enter the 10-digit mobile number linked with UPI.";
  }

  if (!validateUpi(values.payerUpiId)) {
    errors.payerUpiId = "Enter a valid UPI ID, for example name@upi.";
  }

  if (!values.utrNumber.trim()) {
    errors.utrNumber = "UTR / transaction reference number is required.";
  } else if (values.utrNumber.trim().length < 8) {
    errors.utrNumber = "Enter a valid UTR / transaction reference number.";
  }

  if (!values.paymentDate) {
    errors.paymentDate = "Payment date is required.";
  }

  if (!values.paymentScreenshotMeta && !values.paymentScreenshotFile) {
    errors.paymentScreenshotFile = "Upload payment screenshot.";
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
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        Payment verified by admin.
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        Payment rejected. Please check admin remarks and resubmit if allowed.
      </div>
    );
  }

  if (details.status === "submitted_for_verification") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
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
  const [values, setValues] = useState({
    ...initialState,
    ...(initialValues || {}),
    paymentScreenshotFile: null,
    applicantDeclaration: initialValues?.applicantDeclaration || false,
  });

  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const applicationId = formData?.applicationId || "";
  const canEdit = !isReadOnly;

  const alreadySubmitted =
    values?.status === "submitted_for_verification" &&
    values?.paymentScreenshotMeta?.downloadURL;

  const qrPaymentUrl = useMemo(() => {
    if (!UPI_ID) return "";

    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: PAYEE_NAME,
      am: String(APPLICATION_FEE),
      cu: "INR",
      tn: `SSU Application Fee ${applicationId || ""}`.trim(),
    });

    return `upi://pay?${params.toString()}`;
  }, [applicationId]);

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
      paymentMode: "UPI_QR",

      payerMobile: normalizePhone(values.payerMobile),
      payerUpiId: String(values.payerUpiId || "").trim().toLowerCase(),
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
              <FaQrcode />
              UPI QR Payment
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Application Fee Payment
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              Scan the QR code, complete payment, then upload screenshot with UTR,
              payment date and UPI details.
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

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Application ID</label>
              <input value={applicationId} disabled className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Payment Mode</label>
              <input value="UPI QR" disabled className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>UPI Mobile Number *</label>
              <input
                value={values.payerMobile}
                disabled={!canEdit}
                onChange={(e) =>
                  setField("payerMobile", normalizePhone(e.target.value))
                }
                placeholder="10-digit mobile linked with UPI"
                maxLength={10}
                className={inputClass}
              />
              <ErrorText>{errors.payerMobile}</ErrorText>
            </div>

            <div>
              <label className={labelClass}>UPI ID *</label>
              <input
                value={values.payerUpiId}
                disabled={!canEdit}
                onChange={(e) => setField("payerUpiId", e.target.value)}
                placeholder="example@upi"
                className={inputClass}
              />
              <ErrorText>{errors.payerUpiId}</ErrorText>
            </div>

            <div>
              <label className={labelClass}>
                UTR / Transaction Reference No. *
              </label>
              <input
                value={values.utrNumber}
                disabled={!canEdit}
                onChange={(e) =>
                  setField("utrNumber", e.target.value.toUpperCase())
                }
                placeholder="Enter UTR / reference number"
                className={inputClass}
              />
              <ErrorText>{errors.utrNumber}</ErrorText>
            </div>

            <div>
              <label className={labelClass}>Payment Date *</label>
              <input
                type="date"
                value={values.paymentDate}
                disabled={!canEdit}
                onChange={(e) => setField("paymentDate", e.target.value)}
                max={todayIso()}
                className={inputClass}
              />
              <ErrorText>{errors.paymentDate}</ErrorText>
            </div>
          </div>

          <div className="mt-5">
            <label className={labelClass}>Payment Screenshot / Receipt *</label>

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
                          "Payment screenshot uploaded"}
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
                      alt="Payment screenshot preview"
                      className="max-h-72 rounded-2xl border border-slate-200 object-contain"
                    />
                  ) : null}
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl bg-white px-4 py-8 text-center transition hover:bg-slate-100">
                  <FaCloudUploadAlt className="text-3xl text-slate-400" />
                  <div className="mt-3 text-sm font-semibold text-slate-800">
                    Upload payment screenshot
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
              I confirm that the UPI ID, mobile number, UTR, payment date and
              uploaded screenshot are correct. I understand that the payment will
              be verified by the admin team.
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
              <FaQrcode />
              Scan & Pay
            </div>

            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <img
                src={QR_IMAGE_SRC}
                alt="UPI QR Code"
                className="mx-auto aspect-square w-full max-w-[260px] rounded-2xl object-contain bg-white p-3"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Payee
                </div>
                <div className="mt-1 font-semibold text-slate-800">
                  {PAYEE_NAME}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Amount
                </div>
                <div className="mt-1 font-semibold text-slate-800">
                  ₹{APPLICATION_FEE}
                </div>
              </div>

              {UPI_ID ? (
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    UPI ID
                  </div>
                  <div className="mt-1 break-all font-semibold text-slate-800">
                    {UPI_ID}
                  </div>
                </div>
              ) : null}

              {qrPaymentUrl ? (
                <a
                  href={qrPaymentUrl}
                  className="block rounded-2xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Open UPI App
                </a>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-blue-200 bg-blue-50 p-5 text-sm text-blue-800">
            <div className="flex items-center gap-2 font-bold">
              <FaInfoCircle />
              Required After Payment
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>UPI mobile number</li>
              <li>UPI ID</li>
              <li>UTR / transaction reference number</li>
              <li>Payment date</li>
              <li>Payment screenshot</li>
            </ul>
          </div>

          <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            <div className="flex items-center gap-2 font-bold">
              <FaExclamationTriangle />
              Important
            </div>
            <p className="mt-2 leading-relaxed">
              Application will proceed only after admin verification of payment
              proof.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}