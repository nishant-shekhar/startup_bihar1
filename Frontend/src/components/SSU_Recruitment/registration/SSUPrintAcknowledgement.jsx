import React, { useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaExternalLinkAlt,
  FaFileImage,
  FaFilePdf,
  FaPrint,
  FaSpinner,
} from "react-icons/fa";

const safeValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const safeDate = (value) => {
  if (!value) {
    return new Date().toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return String(value);
};

const prettyPaymentStatus = (status) => {
  if (status === "submitted_for_verification") return "Submitted for Verification";
  if (status === "payment_pending") return "Payment Pending";
  if (status === "paid") return "Paid";
  if (status === "verified") return "Verified";
  if (status === "rejected") return "Rejected";
  if (status === "pending") return "Pending";
  return safeValue(status);
};

const prettyVerificationStatus = (status) => {
  if (status === "pending") return "Pending Verification";
  if (status === "verified") return "Verified";
  if (status === "rejected") return "Rejected";
  return safeValue(status || "pending");
};

const getPaymentBoxClass = (paymentDetails) => {
  const adminStatus = paymentDetails?.adminVerification?.status;
  const verificationStatus = paymentDetails?.verificationStatus;

  if (paymentDetails?.verified === true || adminStatus === "verified" || verificationStatus === "verified") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800";
  }

  if (adminStatus === "rejected" || verificationStatus === "rejected") {
    return "border-red-200 bg-red-50 text-red-800";
  }

  return "border-amber-200 bg-amber-50 text-amber-800";
};

const getPaymentBoxText = (paymentDetails) => {
  const adminStatus = paymentDetails?.adminVerification?.status;
  const verificationStatus = paymentDetails?.verificationStatus;

  if (paymentDetails?.verified === true || adminStatus === "verified" || verificationStatus === "verified") {
    return "Payment has been verified by the admin team.";
  }

  if (adminStatus === "rejected" || verificationStatus === "rejected") {
    return "Payment proof has been rejected. Please check the status page for remarks.";
  }

  return "Payment proof has been submitted and is pending admin verification.";
};

export default function SSUPrintAcknowledgement({ formData, onNext }) {
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState("");

  const registrationNo = useMemo(() => {
    if (formData?.applicationId) {
      return formData.applicationId.toUpperCase();
    }

    const pad = (n) => String(n).padStart(2, "0");
    const now = new Date();
    return `SSU${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate()
    )}TEMP`;
  }, [formData?.applicationId]);

  const submittedAt = useMemo(() => {
    return safeDate(formData?.submittedAt);
  }, [formData?.submittedAt]);

  const applicantName =
    formData?.userSignup?.fullName ||
    formData?.personalDetails?.fullName ||
    formData?.personalDetails?.applicantName ||
    "-";

  const email =
    formData?.userSignup?.email ||
    formData?.personalDetails?.email ||
    "-";

  const phone =
    formData?.userSignup?.phoneNumber ||
    formData?.personalDetails?.phoneNumber ||
    "-";

  const postAppliedFor = formData?.personalDetails?.postAppliedFor || "-";
  const category = formData?.personalDetails?.category || "-";

  const paymentDetails = formData?.paymentDetails || {};
  const paymentStatus = prettyPaymentStatus(paymentDetails?.status);
  const verificationStatus = prettyVerificationStatus(
    paymentDetails?.verificationStatus ||
      paymentDetails?.adminVerification?.status ||
      "pending"
  );

  const paymentScreenshotUrl = paymentDetails?.paymentScreenshotMeta?.downloadURL || "";
  const paymentScreenshotName =
    paymentDetails?.paymentScreenshotMeta?.fileName || "Payment Screenshot";

  const handlePrint = () => {
    window.print();
  };

  const captureAcknowledgement = async () => {
    if (!printRef.current) return null;

    return await toPng(printRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#FFFFFF",
    });
  };

  const handleDownloadPng = async () => {
    try {
      setDownloading("png");

      const dataUrl = await captureAcknowledgement();
      if (!dataUrl) return;

      const a = document.createElement("a");
      a.download = `${registrationNo}-acknowledgement.png`;
      a.href = dataUrl;
      a.click();
    } catch (error) {
      console.error("PNG download failed", error);
    } finally {
      setDownloading("");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setDownloading("pdf");

      const dataUrl = await captureAcknowledgement();
      if (!dataUrl) return;

      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 10;

      const imgProps = pdf.getImageProperties(dataUrl);
      const imgAspect = imgProps.width / imgProps.height;

      let imgW = pageW - margin * 2;
      let imgH = imgW / imgAspect;

      if (imgH > pageH - margin * 2) {
        imgH = pageH - margin * 2;
        imgW = imgH * imgAspect;
      }

      pdf.addImage(
        dataUrl,
        "PNG",
        (pageW - imgW) / 2,
        margin,
        imgW,
        imgH
      );

      pdf.save(`${registrationNo}-acknowledgement.pdf`);
    } catch (error) {
      console.error("PDF download failed", error);
    } finally {
      setDownloading("");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Submitted
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Application Acknowledgement
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Save or print this acknowledgement for future reference.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={!!downloading}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {downloading === "png" ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaDownload />
            )}
            PNG
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={!!downloading}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {downloading === "pdf" ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaFilePdf />
            )}
            PDF
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <FaPrint />
            Print
          </button>

          {onNext ? (
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Status
              <FaArrowRight />
            </button>
          ) : null}
        </div>
      </div>

      <div
        ref={printRef}
        className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 px-6 py-6 text-white md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <img
                src="/startup_bihar_logo2.png"
                alt="Startup Bihar"
                className="h-16 w-auto rounded bg-white/95 object-contain p-2"
              />

              <div className="mt-4 text-sm text-white/75">
                Department of Industries, Government of Bihar
              </div>

              <div className="mt-2 text-2xl font-bold">
                SSU Recruitment Application
              </div>

              <div className="mt-1 text-sm text-white/75">
                Application Acknowledgement Receipt
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-left md:text-right">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Application ID
              </div>
              <div className="mt-2 text-xl font-bold text-white">
                {registrationNo}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-bold">
              <FaCheckCircle />
              Application submitted successfully.
            </div>
            <div className="mt-1">
              This acknowledgement confirms receipt of your SSU recruitment
              application. It does not imply shortlisting, selection, or payment
              verification.
            </div>
          </div>

          <div
            className={`mt-4 rounded-3xl border px-5 py-4 text-sm ${getPaymentBoxClass(
              paymentDetails
            )}`}
          >
            <div className="flex items-center gap-2 font-bold">
              <FaClock />
              Payment Verification Status
            </div>
            <div className="mt-1">{getPaymentBoxText(paymentDetails)}</div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoCard label="Applicant Name" value={applicantName} />
            <InfoCard label="Post Applied For" value={postAppliedFor} />
            <InfoCard label="Email" value={email} />
            <InfoCard label="Mobile Number" value={phone} />
            <InfoCard label="Submitted At" value={submittedAt} />
            <InfoCard label="Application ID" value={registrationNo} />
            <InfoCard label="Category" value={category} />
            <InfoCard label="Application Status" value={formData?.status || "submitted"} />

            <InfoCard label="Payment Status" value={paymentStatus} />
            <InfoCard label="Verification Status" value={verificationStatus} />
            <InfoCard label="Amount" value={`₹${safeValue(paymentDetails?.amount)}`} />
            <InfoCard
              label="Amount Paid"
              value={`₹${safeValue(paymentDetails?.paymentAmountPaid)}`}
            />
            <InfoCard label="Payment Mode" value={paymentDetails?.paymentMode || "UPI_QR"} />
            <InfoCard label="Payer Name" value={paymentDetails?.payerName} />
            <InfoCard label="Payer Mobile" value={paymentDetails?.payerMobile} />
            <InfoCard label="Payer UPI ID" value={paymentDetails?.payerUpiId} />
            <InfoCard label="Payer Bank Name" value={paymentDetails?.payerBankName} />
            <InfoCard
              label="Bank / Account Holder Name"
              value={paymentDetails?.bankAccountName}
            />
            <InfoCard label="UTR / Reference No." value={paymentDetails?.utrNumber} />
            <InfoCard label="Payment Date" value={paymentDetails?.paymentDate} />
            <InfoCard label="Payment Time" value={paymentDetails?.paymentTime} />
          </div>

          {paymentScreenshotUrl ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
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
                      {paymentScreenshotName}
                    </div>
                  </div>
                </div>

                <a
                  href={paymentScreenshotUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 print:hidden"
                >
                  <FaExternalLinkAlt />
                  View Screenshot
                </a>
              </div>

              <div className="mt-3 break-all text-xs text-slate-500">
                {paymentScreenshotUrl}
              </div>
            </div>
          ) : null}

          {paymentDetails?.adminVerification?.remarks ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
              <div className="font-semibold">Admin Verification Remarks</div>
              <div className="mt-1">
                {paymentDetails.adminVerification.remarks}
              </div>
            </div>
          ) : null}

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
            <div className="font-semibold text-slate-800">Important Instructions</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Please keep this acknowledgement for future reference.</li>
              <li>
                Use the application ID in all future communication related to SSU
                recruitment.
              </li>
              <li>
                Payment proof is subject to verification by the department/admin.
              </li>
              <li>
                The department may verify submitted information and documents at
                any stage.
              </li>
              <li>
                Selection, shortlisting, or rejection status will be updated on
                the application status page.
              </li>
            </ul>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Applicant Declaration
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                I confirm that the information and payment details submitted in
                the application are true and correct to the best of my knowledge.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                System Generated Receipt
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                This acknowledgement is generated electronically and does not
                require a physical signature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-semibold text-slate-800">
        {safeValue(value)}
      </div>
    </div>
  );
}