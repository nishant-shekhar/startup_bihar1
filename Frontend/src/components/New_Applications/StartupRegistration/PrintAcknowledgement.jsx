import React, { useMemo, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toPng } from "html-to-image";


const PrintAcknowledgement = ({ formData }) => {
  const printRef = useRef(null);

  // Generate a stable random registration number per render session
  const registrationNo = useMemo(() => {
    const pad = (n) => String(n).padStart(2, "0");
    const now = new Date();
    const y = now.getFullYear();
    const m = pad(now.getMonth() + 1);
    const d = pad(now.getDate());
    const rnd = Array.from({ length: 4 }, () =>
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]
    ).join("");
    return `SB-${y}${m}${d}-${rnd}`;
  }, []);

  // Open the current markup in a print-only window (unchanged)
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;

    const printWindow = window.open("", "_blank");
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Application Acknowledgement</title>
          <style>
            @page { size: A4; margin: 18mm; }
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #111827; }
            .ack-container { border: 1px solid #e5e7eb; padding: 20px; }
            .watermark { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; opacity:0.04; font-size:80px; font-weight:800; letter-spacing:2px; transform:rotate(-15deg); }
          </style>
        </head>
        <body>
          <div class="watermark">STARTUP BIHAR</div>
          <div class="ack-container">
            ${printContents}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  // PNG download — pixel-perfect to what the user sees
const handleDownloadPng = async () => {
  if (!printRef.current) return;
  const dataUrl = await toPng(printRef.current, {
    cacheBust: true,
    pixelRatio: 2,      // crisper
    backgroundColor: "#FFFFFF",
  });
  const a = document.createElement("a");
  a.download = `${registrationNo}.png`;
  a.href = dataUrl;
  a.click();
};

// PDF from image — preserves exact design
const handleDownloadPdfFromImage = async () => {
  if (!printRef.current) return;

  const dataUrl = await toPng(printRef.current, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: "#FFFFFF",
  });

  const pdf = new jsPDF("p", "mm", "a4");
  const pageW = pdf.internal.pageSize.getWidth();   // 210mm
  const pageH = pdf.internal.pageSize.getHeight();  // 297mm
  const margin = 10;

  const imgProps = pdf.getImageProperties(dataUrl);
  const imgAspect = imgProps.width / imgProps.height;

  let imgW = pageW - margin * 2;
  let imgH = imgW / imgAspect;

  // If height overflows, scale by height instead
  if (imgH > pageH - margin * 2) {
    imgH = pageH - margin * 2;
    imgW = imgH * imgAspect;
  }

  pdf.addImage(
    dataUrl,
    "PNG",
    (pageW - imgW) / 2, // center horizontally
    (pageH - imgH) / 2, // center vertically
    imgW,
    imgH
  );

  pdf.save(`${registrationNo}.pdf`);
};



  // NEW: Download the same design as a PDF (multi-page safe)
const handleDownloadPdf = async () => {
  if (!printRef.current) return;

  const pdf = new jsPDF("p", "mm", "a4");

  // px -> mm helpers (for margins/width tuning if needed)
  const pxPerMm = 96 / 25.4; // assuming 96 DPI
  const marginMm = 10;       // left/right/top/bottom margins in mm

  await pdf.html(printRef.current, {
    // Force canvas to render crisp and with same background
    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#FFFFFF",
      // Ensures it captures at the element's true width (we set 190mm above)
      windowWidth: printRef.current.scrollWidth,
    },
    x: marginMm,
    y: marginMm,
    width: pdf.internal.pageSize.getWidth() - marginMm * 2, // fit inside margins
    autoPaging: "text", // add pages if content overflows
    callback: () => {
      pdf.save(`${registrationNo}.pdf`);
    },
  });
};


  const submittedAt = useMemo(() => new Date().toLocaleString(), []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-4 print:mb-0">
        <h2 className="text-2xl font-bold">Application Acknowledgement</h2>
        <div className="flex gap-2">
  <button
    onClick={handleDownloadPng}
    className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700"
  >
    Download PNG
  </button>
  <button
    onClick={handleDownloadPdfFromImage}
    className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
  >
    Download PDF
  </button>
  <button
    onClick={handlePrint}
    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 print:hidden"
  >
    Print / Save PDF
  </button>
</div>

      </div>

      {/* Printable area */}
<div
  ref={printRef}
  className="bg-white rounded-lg border shadow-sm p-5"
  style={{ width: "900px", margin: "0 auto" }}  // lock to A4 width
>
      {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md">
              <img
                src="favicon_full.png"
                alt="Startup Bihar Logo"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div>
              <div className="text-base font-bold">
                Startup Bihar – Department of Industries, Govt. of Bihar
              </div>
              <div className="text-xs text-gray-500 -mt-0.5">
                Application Acknowledgement Receipt
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">Registration No.</div>
            <div className="font-semibold">{registrationNo}</div>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex">
            <div className="w-40 text-gray-500">Application Title</div>
            <div className="font-semibold">
              {formData?.userSignup?.startupName || "-"}
            </div>
          </div>

          <div className="flex">
            <div className="w-40 text-gray-500">Founder</div>
            <div className="font-semibold">
              {formData?.userSignup?.founderName || "-"}
            </div>
          </div>

          <div className="flex">
            <div className="w-40 text-gray-500">Email</div>
            <div className="font-semibold">
              {formData?.userSignup?.email || "-"}
            </div>
          </div>

          <div className="flex">
            <div className="w-40 text-gray-500">Phone</div>
            <div className="font-semibold">
              {formData?.userSignup?.phoneNumber || "-"}
            </div>
          </div>

          <div className="flex">
            <div className="w-40 text-gray-500">Submitted At</div>
            <div className="font-semibold">{submittedAt}</div>
          </div>

          <div className="flex">
            <div className="w-40 text-gray-500">Acknowledged By</div>
            <div className="font-semibold">Startup Bihar Portal</div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-5 text-xs text-gray-600">
          <div className="font-semibold text-gray-700 mb-1">Important:</div>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              Please quote the <span className="font-semibold">Registration No.</span> in all future correspondence.
            </li>
            <li>
              This is a system‑generated acknowledgement and does not imply approval.
            </li>
            <li>Keep a printed or PDF copy of this receipt for your records.</li>
          </ul>
        </div>

        {/* Signature strip */}
        <div className="mt-8 flex items-end justify-between">
          <div className="w-1/2 pr-6">
            <div className="border-t border-dashed border-gray-300 pt-2 text-center text-xs text-gray-600">
              Applicant’s Signature
            </div>
          </div>
          <div className="w-1/2 pl-6 text-right">
            <div className="border-t border-dashed border-gray-300 pt-2 text-center text-xs text-gray-600">
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintAcknowledgement;
