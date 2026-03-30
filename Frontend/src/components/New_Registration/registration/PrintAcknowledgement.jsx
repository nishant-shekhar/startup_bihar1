import React, { useMemo, useRef } from "react";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

export default function PrintAcknowledgement({ formData }) {
  const printRef = useRef(null);

  const registrationNo = useMemo(() => {
    if (formData?.applicationId) {
      return `SB-${formData.applicationId.slice(0, 8).toUpperCase()}`;
    }

    const pad = (n) => String(n).padStart(2, "0");
    const now = new Date();
    return `SB-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(
      now.getDate()
    )}-TEMP`;
  }, [formData?.applicationId]);

  const submittedAt = useMemo(() => new Date().toLocaleString(), []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = async () => {
    if (!printRef.current) return;

    const dataUrl = await toPng(printRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#FFFFFF",
    });

    const a = document.createElement("a");
    a.download = `${registrationNo}.png`;
    a.href = dataUrl;
    a.click();
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;

    const dataUrl = await toPng(printRef.current, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#FFFFFF",
    });

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
      (pageH - imgH) / 2,
      imgW,
      imgH
    );

    pdf.save(`${registrationNo}.pdf`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Submitted
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Application acknowledgement
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadPng}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Download PNG
          </button>
          <button
            onClick={handleDownloadPdf}
            className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Print
          </button>
        </div>
      </div>

      <div
        ref={printRef}
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <img
              src="/startup_bihar_logo2.png"
              alt="Startup Bihar"
              className="h-16 w-auto object-contain"
            />
            <div className="mt-2 text-sm text-slate-500">
              Department of Industries, Government of Bihar
            </div>
            <div className="mt-4 text-lg font-semibold text-slate-800">
              Application Acknowledgement Receipt
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Registration No.
            </div>
            <div className="mt-1 text-base font-bold text-slate-900">
              {formData?.applicationId}
            </div>
          </div>
        </div>

        <div className="my-6 h-px bg-slate-200" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoCard label="Startup Name" value={formData?.userSignup?.startupName || "-"} />
          <InfoCard label="Founder Name" value={formData?.userSignup?.founderName || "-"} />
          <InfoCard label="Email" value={formData?.userSignup?.email || "-"} />
          <InfoCard label="Phone" value={formData?.userSignup?.phoneNumber || "-"} />
          <InfoCard label="Submitted At" value={submittedAt} />
          <InfoCard label="Application ID" value={formData?.applicationId || "-"} />
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <div className="font-semibold text-slate-800">Important</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Please keep this acknowledgement for future reference.</li>
            <li>This is a system-generated receipt and does not imply approval.</li>
            <li>Use the registration number in future communication.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-medium text-slate-800">
        {value}
      </div>
    </div>
  );
}