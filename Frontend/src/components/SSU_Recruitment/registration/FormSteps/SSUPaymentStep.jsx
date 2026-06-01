import React, { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCloudUploadAlt,
  FaCopy,
  FaExternalLinkAlt,
  FaFileImage,
  FaInfoCircle,
  FaReceipt,
  FaTimes,
  FaUniversity,
} from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../../AdminRedesign/NewApplicationAdmin/firebase";
import { ssuDocPath } from "../ssuFirebasePaths";

const ENV_APPLICATION_FEE = Number(
  import.meta.env.VITE_SSU_APPLICATION_FEE || 1000
);

const ENV_SBI_COLLECT_LINK =
  import.meta.env.VITE_SSU_SBI_COLLECT_LINK ||
  "https://onlinesbi.sbi.bank.in/sbicollect/#";

const paymentGuideImages = [
  {
    src: "/ssu-payment/sbi-step-1.jpg",
    title: "Search Bihar Start Up",
  },
  {
    src: "/ssu-payment/sbi-step-2.jpg",
    title: "Select Payment Category",
  },
  {
    src: "/ssu-payment/sbi-step-3.jpg",
    title: "Enter Payment Details",
  },
];

const defaultFeeSettings = {
  active: true,
  amount: ENV_APPLICATION_FEE,
  currency: "INR",
  paymentMode: "SBI_COLLECT",
  sbiCollectLink: ENV_SBI_COLLECT_LINK,
  sbiCollectButtonText: "Pay via SBI Collect",
  inactiveMessage:
    "SBI Collect payment link is currently inactive. Please check again later.",
};

const initialState = {
  status: "",
  verificationStatus: "",
  amount: ENV_APPLICATION_FEE,
  currency: "INR",
  paymentMode: "SBI_COLLECT",

  sbiCollectLink: ENV_SBI_COLLECT_LINK,
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
    utrVerified: false,
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
  const hasSubmittedProof =
    !!details?.paymentScreenshotMeta?.downloadURL ||
    !!details?.utrNumber ||
    !!details?.submittedAt;

  if (!hasSubmittedProof) return null;

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

  return (
    <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
      Payment proof submitted. Verification is pending.
    </div>
  );
}

function ImagePreviewDialog({ images, activeIndex, onClose, onMove }) {
  const activeImage = images?.[activeIndex];

  useEffect(() => {
    if (activeIndex === null || activeIndex === undefined) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onMove(-1);
      if (event.key === "ArrowRight") onMove(1);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, onClose, onMove]);

  if (activeIndex === null || activeIndex === undefined || !activeImage) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 md:px-5">
          <div>
            <div className="text-sm font-bold text-slate-900">
              {activeImage.title}
            </div>
            <div className="text-xs text-slate-500">
              {activeIndex + 1} of {images.length}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
            aria-label="Close image preview"
          >
            <FaTimes />
          </button>
        </div>

        <div className="relative flex min-h-[280px] items-center justify-center p-4 md:min-h-[560px] md:p-6">
          <button
            type="button"
            onClick={() => onMove(-1)}
            className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-lg transition hover:bg-white md:left-5 md:h-12 md:w-12"
            aria-label="Previous image"
          >
            <FaChevronLeft />
          </button>

          <img
            src={activeImage.src}
            alt={activeImage.title}
            className="max-h-[70vh] w-full rounded-2xl object-contain"
          />

          <button
            type="button"
            onClick={() => onMove(1)}
            className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-lg transition hover:bg-white md:right-5 md:h-12 md:w-12"
            aria-label="Next image"
          >
            <FaChevronRight />
          </button>
        </div>

        <div className="flex justify-center gap-2 border-t border-slate-100 px-4 py-3">
          {images.map((item, index) => (
            <button
              type="button"
              key={item.src}
              onClick={() => onMove(index, true)}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex
                  ? "w-7 bg-slate-900"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Open image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SSUPaymentStep({
  onSubmit,
  onPrevious,
  initialValues,
  isReadOnly,
  formData,
}) {
  const [feeSettings, setFeeSettings] = useState(defaultFeeSettings);
  const [feeLoading, setFeeLoading] = useState(true);

  const [values, setValues] = useState({
    ...initialState,
    ...(initialValues || {}),
    paymentMode: "SBI_COLLECT",
    sbiCollectLink:
      initialValues?.sbiCollectLink || ENV_SBI_COLLECT_LINK || "",
    paymentScreenshotFile: null,
    applicantDeclaration: initialValues?.applicantDeclaration || false,
  });

  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState("");
  const [activeGuideImage, setActiveGuideImage] = useState(null);

  const canEdit = !isReadOnly;

  useEffect(() => {
    let mounted = true;

    const loadFeeSettings = async () => {
      try {
        setFeeLoading(true);

        const snap = await getDoc(doc(db, ...ssuDocPath.settingFee()));

        if (!mounted) return;

        if (snap.exists()) {
          const data = snap.data();

          const nextSettings = {
            ...defaultFeeSettings,
            ...data,
            paymentMode: "SBI_COLLECT",
            amount: Number(data?.amount || defaultFeeSettings.amount),
            sbiCollectLink:
              data?.sbiCollectLink ||
              data?.sbiCollectUrl ||
              data?.paymentLink ||
              ENV_SBI_COLLECT_LINK ||
              "",
          };

          setFeeSettings(nextSettings);

          setValues((prev) => ({
            ...prev,
            amount: Number(prev.amount || nextSettings.amount),
            currency: nextSettings.currency || "INR",
            paymentMode: "SBI_COLLECT",
            sbiCollectLink:
              prev.sbiCollectLink ||
              nextSettings.sbiCollectLink ||
              ENV_SBI_COLLECT_LINK ||
              "",
          }));
        }
      } catch (error) {
        console.error("Failed to load SBI Collect settings", error);
      } finally {
        if (mounted) setFeeLoading(false);
      }
    };

    loadFeeSettings();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const effectiveFeeAmount = useMemo(() => {
    return Number(feeSettings?.amount || values?.amount || ENV_APPLICATION_FEE);
  }, [feeSettings?.amount, values?.amount]);

  const effectiveSbiCollectLink = useMemo(() => {
    return (
      feeSettings?.sbiCollectLink ||
      values?.sbiCollectLink ||
      ENV_SBI_COLLECT_LINK ||
      ""
    );
  }, [feeSettings?.sbiCollectLink, values?.sbiCollectLink]);

  const isPaymentLinkActive =
    feeSettings?.active === true && !!effectiveSbiCollectLink;

  const alreadySubmitted =
    !!values?.paymentScreenshotMeta?.downloadURL ||
    !!initialValues?.paymentScreenshotMeta?.downloadURL;

  const setField = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
      form: "",
    }));
  };

  const copyText = async (text, label) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setCopied("");
    }
  };

  const moveGuideImage = (step, absolute = false) => {
    setActiveGuideImage((current) => {
      if (absolute) return step;

      const total = paymentGuideImages.length;
      if (current === null || current === undefined) return 0;

      return (current + step + total) % total;
    });
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

    if (previewUrl) URL.revokeObjectURL(previewUrl);

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

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
  };

  const handleSubmit = async () => {
    const nextValues = {
      status: "submitted_for_verification",
      verificationStatus: "pending",
      amount: effectiveFeeAmount,
      currency: feeSettings?.currency || "INR",
      paymentMode: "SBI_COLLECT",

      sbiCollectLink: effectiveSbiCollectLink,
      utrNumber: String(values.utrNumber || "").trim().toUpperCase(),
      utrNumberNormalized: String(values.utrNumber || "")
        .trim()
        .toUpperCase()
        .replace(/\s+/g, ""),
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
        utrVerified: false,
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
      <ImagePreviewDialog
        images={paymentGuideImages}
        activeIndex={activeGuideImage}
        onClose={() => setActiveGuideImage(null)}
        onMove={moveGuideImage}
      />

      <div className="mb-6 rounded-[32px] border border-white/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <FaUniversity />
              SBI Collect Payment
            </div>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Application Fee Payment
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              Pay through SBI Collect, then upload the success screenshot and
              transaction reference number here.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-800">
            <div className="text-xs font-semibold uppercase tracking-[0.18em]">
              Application Fee
            </div>
            <div className="mt-1 text-3xl font-bold">
              ₹{effectiveFeeAmount}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
          <PaymentStatusPill details={initialValues || values} />

          <div className="mb-5 flex flex-col gap-3 rounded-[26px] border border-indigo-100 bg-indigo-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                <FaUniversity className="text-indigo-600" />
                Complete payment on SBI Collect
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Use the button below to open the official SBI Collect page.
              </p>
            </div>

            {isPaymentLinkActive ? (
              <a
                href={effectiveSbiCollectLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <FaExternalLinkAlt />
                {feeSettings?.sbiCollectButtonText || "Pay via SBI Collect"}
              </a>
            ) : (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {feeLoading
                  ? "Checking SBI Collect payment link..."
                  : feeSettings?.inactiveMessage ||
                    "SBI Collect payment link is currently inactive."}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Payment Mode</label>
              <input value="SBI Collect" disabled className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Application Fee</label>
              <input
                value={`₹${effectiveFeeAmount}`}
                disabled
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                UTR / Transaction Reference No. *
              </label>
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
            <label className={labelClass}>
              SBI Collect Success Screenshot *
            </label>

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
        </section>

        <aside className="space-y-5">
          <div className="rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <FaInfoCircle className="text-blue-600" />
              How to Pay
            </div>

            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  1
                </span>
                <span>Click Pay via SBI Collect.</span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  2
                </span>
                <span>
                  Search <b>bihar start up</b>. Keep space between{" "}
                  <b>start</b> and <b>up</b>.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  3
                </span>
                <span>
                  Select <b>BIHAR START UP FUND TRUST</b>.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  4
                </span>
                <span>
                  Choose <b>APPLICATION FEES</b> from payment category.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  5
                </span>
                <span>
                  Enter same mobile number and email ID used in this
                  application.
                </span>
              </li>

              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  6
                </span>
                <span>
                  Complete payment, then upload success screenshot and UTR here.
                </span>
              </li>
            </ol>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Search Text
              </div>

              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="text-sm font-bold text-slate-900">
                  bihar start up
                </div>

                <button
                  type="button"
                  onClick={() => copyText("bihar start up", "search")}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <FaCopy />
                  {copied === "search" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Quick Visual Guide
              </div>

              <div className="flex items-center gap-2">
                {paymentGuideImages.map((image, index) => (
                  <button
                    type="button"
                    key={image.src}
                    onClick={() => setActiveGuideImage(index)}
                    className="group relative h-14 w-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    title={image.title}
                  >
                    <img
                      src={image.src}
                      alt={image.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />

                    <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-2 text-[11px] text-slate-500">
                Click any thumbnail to view larger image.
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
            <div className="flex items-center gap-2 font-bold">
              <FaReceipt />
              Important
            </div>

            <p className="mt-2 leading-relaxed">
              One UTR / transaction reference number should be used for one
              application only. Do not use the same UTR for multiple
              applications.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}