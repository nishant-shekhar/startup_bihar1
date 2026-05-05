import React from "react";
import {
  FaCheckCircle,
  FaDownload,
  FaEdit,
  FaLock,
  FaPaperPlane,
  FaFilePdf,
  FaFileAlt,
  FaExternalLinkAlt,
  FaUser,
  FaGraduationCap,
  FaBriefcase,
  FaRocket,
  FaUsers,
  FaIdBadge,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const yesNo = (value) => {
  if (value === "yes") return "Yes";
  if (value === "no") return "No";
  return value ? "Yes" : "No";
};

const surfaceCard =
  "rounded-[32px] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6";

/* ── PDF export ── */
function buildRows(formData) {
  const rows = [];

  const addSection = (title, data) => {
    rows.push([
      {
        content: title,
        colSpan: 2,
        styles: { fontStyle: "bold", fillColor: [241, 245, 249], textColor: [15, 23, 42] },
      },
    ]);
    data.forEach(([key, value]) => rows.push([key, safe(value)]));
  };

  addSection("Account Details", [
    ["Application ID", formData?.applicationId],
    ["Full Name", formData?.userSignup?.fullName],
    ["Email", formData?.userSignup?.email],
    ["Phone Number", formData?.userSignup?.phoneNumber],
    ["Aadhaar Number", formData?.userSignup?.aadharNumber],
    ["Phone Verified", yesNo(formData?.userSignup?.phoneVerified)],
  ]);

  addSection("Personal Details", [
    ["Post Applied For", formData?.personalDetails?.postAppliedFor],
    ["Father's / Husband's Name", formData?.personalDetails?.fathersName],
    ["Date of Birth", formData?.personalDetails?.dateOfBirth],
    ["Gender", formData?.personalDetails?.gender],
    ["Category", formData?.personalDetails?.category],
    ["Nationality", formData?.personalDetails?.nationality],
    ["Alternate Number", formData?.personalDetails?.alternateNumber],
    ["Present Address", formData?.personalDetails?.presentAddress],
    ["Permanent Address", formData?.personalDetails?.permanentAddressSameAsPresent
      ? formData?.personalDetails?.presentAddress
      : formData?.personalDetails?.permanentAddress],
  ]);

  const edu = formData?.educationalQualifications?.education || [];
  edu.forEach((row) => {
    if (row.institution || row.yearOfPassing) {
      addSection(`Education — ${row.degree}`, [
        ["Institution", row.institution],
        ["Specialisation", row.specialisation],
        ["Year of Passing", row.yearOfPassing],
        ["% / CGPA", row.percentage],
        ["Status", row.status],
      ]);
    }
  });

  const certs = formData?.educationalQualifications?.certifications || [];
  certs.forEach((cert, i) => {
    if (cert.certName) {
      addSection(`Certification ${i + 1}`, [
        ["Certification Name", cert.certName],
        ["Issuing Organisation", cert.issuingOrg],
        ["Year", cert.year],
        ["Duration", cert.duration],
      ]);
    }
  });

  const work = formData?.workExperience?.workExperience || [];
  work.forEach((row, i) => {
    if (row.organisation) {
      addSection(`Work Experience ${i + 1}`, [
        ["Organisation", row.organisation],
        ["Designation", row.designation],
        ["From", row.from],
        ["To", row.to],
        ["Nature of Work", row.natureOfWork],
      ]);
    }
  });

  addSection("Total Experience", [
    ["Total Work Experience", `${safe(formData?.workExperience?.totalExpYears)} Years ${safe(formData?.workExperience?.totalExpMonths)} Months`],
    ["Relevant Experience", `${safe(formData?.workExperience?.relevantExpYears)} Years ${safe(formData?.workExperience?.relevantExpMonths)} Months`],
  ]);

  addSection("Startup & Domain Exposure", [
    ["Worked with Startup Ecosystem", yesNo(formData?.startupExposure?.workedWithStartupEcosystem)],
    ["Startup Ecosystem Details", formData?.startupExposure?.startupEcosystemDetails],
    ["Incubators Worked With", formData?.startupExposure?.ecosystemIncubators],
    ["Govt/Public Sector Experience", yesNo(formData?.startupExposure?.govtPublicSectorExp)],
    ["Govt Experience Details", formData?.startupExposure?.govtPublicSectorDetails],
    ["Key Domain Expertise", formData?.startupExposure?.keyDomainExpertise],
  ]);

  const refs = formData?.referencesAndDocs?.references || [];
  refs.forEach((ref, i) => {
    if (ref.name) {
      addSection(`Reference ${i + 1}`, [
        ["Name", ref.name],
        ["Organisation & Designation", ref.orgDesignation],
        ["Contact", ref.contactNumber],
        ["Email", ref.email],
      ]);
    }
  });

  addSection("Declaration", [
    ["Place", formData?.referencesAndDocs?.place],
    ["Date", formData?.referencesAndDocs?.declarationDate],
    ["Declaration Accepted", yesNo(formData?.referencesAndDocs?.declarationAccepted)],
  ]);

  return rows;
}

function downloadPdf(formData) {
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFontSize(16);
  doc.text("Startup Bihar — SSU Recruitment Application", 14, 16);
  doc.setFontSize(10);
  doc.text(`Application ID: ${safe(formData?.applicationId)}`, 14, 24);
  doc.text(`Applicant: ${safe(formData?.userSignup?.fullName)}`, 14, 30);

  autoTable(doc, {
    startY: 36,
    head: [["Field", "Value"]],
    body: buildRows(formData),
    styles: { fontSize: 9, cellPadding: 2.8, valign: "top", overflow: "linebreak" },
    headStyles: { fillColor: [15, 23, 42] },
    columnStyles: { 0: { cellWidth: 62, fontStyle: "bold" }, 1: { cellWidth: 114 } },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${safe(formData?.applicationId)}-ssu-recruitment.pdf`);
}

/* ── Shared UI Components ── */
function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 rounded-2xl bg-slate-50 px-4 py-3 md:grid-cols-[220px_1fr]">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="break-words text-sm font-semibold text-slate-800">{safe(value)}</div>
    </div>
  );
}

function LinkRow({ label, meta }) {
  const fileName = meta?.fileName || "-";
  const link = meta?.downloadURL || "";
  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 px-4 py-3 md:grid-cols-[220px_1fr]">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <FaFileAlt className="shrink-0 text-slate-500" />
          <span className="break-all">{fileName}</span>
        </div>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
            <FaExternalLinkAlt /> Open file
          </a>
        ) : (
          <div className="mt-2 text-xs text-slate-400">No file uploaded</div>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, subtitle, canEdit, onEdit, step }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {canEdit ? (
        <button type="button" onClick={() => onEdit(step)}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
          <FaEdit /> Edit
        </button>
      ) : (
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
          <FaLock /> Locked after submit
        </div>
      )}
    </div>
  );
}

function Section({ icon, title, subtitle, step, onEdit, canEdit, children }) {
  return (
    <div className={surfaceCard}>
      <SectionHeader icon={icon} title={title} subtitle={subtitle} canEdit={canEdit} onEdit={onEdit} step={step} />
      <div className="mt-5 space-y-3">{children}</div>
    </div>
  );
}

function SummaryCard({ label, value, tone = "default" }) {
  const toneMap = {
    default: "border-slate-200 bg-white text-slate-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    accent: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-red-200 bg-red-50 text-red-800",
  };
  return (
    <div className={`rounded-[24px] border p-4 shadow-sm ${toneMap[tone] || toneMap.default}`}>
      <div className="text-xs uppercase tracking-[0.16em] opacity-70">{label}</div>
      <div className="mt-2 text-lg font-bold">{safe(value)}</div>
    </div>
  );
}

/* ── Main Preview ── */
export default function Preview({ formData, onPrevious, onFormSubmit, onNavigateToStep, submissionWindow, isSubmitted = false }) {
  const canEdit = !isSubmitted;
  const isSubmissionClosed = !isSubmitted && submissionWindow?.checked && submissionWindow?.isOpen === false;
  const submissionMessage = submissionWindow?.message || "Form submission is closed.";

  const pd = formData?.personalDetails || {};
  const edu = formData?.educationalQualifications || {};
  const we = formData?.workExperience || {};
  const se = formData?.startupExposure || {};
  const rd = formData?.referencesAndDocs || {};

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Header */}
      <div className="mb-6 rounded-[34px] border border-white/80 bg-white/76 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Final Preview
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Review your application before submission
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-500">
              Check all sections carefully. You can still edit any section before final submission.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => downloadPdf(formData)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
              <FaFilePdf /> Download PDF
            </button>
            {isSubmitted && (
              <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
                <FaCheckCircle /> Already Submitted
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <SummaryCard label="Application ID" value={formData?.applicationId} />
          <SummaryCard label="Applicant" value={formData?.userSignup?.fullName} />
          <SummaryCard label="Post Applied For" value={pd.postAppliedFor} tone="accent" />
          <SummaryCard
            label="Status"
            value={isSubmitted ? "Submitted" : isSubmissionClosed ? "Submission Closed" : "Pending Final Submit"}
            tone={isSubmitted ? "success" : isSubmissionClosed ? "danger" : "default"}
          />
        </div>
      </div>

      {/* Status Banner */}
      {isSubmitted ? (
        <div className="mb-6 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          This application has already been submitted. All steps are now locked. You can review details and download the PDF.
        </div>
      ) : isSubmissionClosed ? (
        <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {submissionMessage}
        </div>
      ) : (
        <div className="mb-6 rounded-[24px] border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Review every section below. You can still edit any section before final submission.
        </div>
      )}

      <div className="space-y-6">
        {/* Step 1 — Account */}
        <Section icon={<FaIdBadge />} title="Account Details" subtitle="Registration identity and contact" step={1} onEdit={onNavigateToStep} canEdit={canEdit}>
          <InfoRow label="Application ID" value={formData?.applicationId} />
          <InfoRow label="Full Name" value={formData?.userSignup?.fullName} />
          <InfoRow label="Email" value={formData?.userSignup?.email} />
          <InfoRow label="Phone Number" value={formData?.userSignup?.phoneNumber} />
          <InfoRow label="Aadhaar Number" value={formData?.userSignup?.aadharNumber} />
          <InfoRow label="Phone Verified" value={yesNo(formData?.userSignup?.phoneVerified)} />
        </Section>

        {/* Step 2 — Personal Details */}
        <Section icon={<FaUser />} title="Personal Details" subtitle="Section A & B from the application form" step={2} onEdit={onNavigateToStep} canEdit={canEdit}>
          <InfoRow label="Post Applied For" value={pd.postAppliedFor} />
          <InfoRow label="Father's / Husband's Name" value={pd.fathersName} />
          <InfoRow label="Date of Birth" value={pd.dateOfBirth} />
          <InfoRow label="Gender" value={pd.gender} />
          <InfoRow label="Category" value={pd.category} />
          <InfoRow label="Nationality" value={pd.nationality} />
          <InfoRow label="Alternate Number" value={pd.alternateNumber} />
          <InfoRow label="Present Address" value={pd.presentAddress} />
          <InfoRow
            label="Permanent Address"
            value={pd.permanentAddressSameAsPresent ? "(Same as Present)" : pd.permanentAddress}
          />
        </Section>

        {/* Step 3 — Education */}
        <Section icon={<FaGraduationCap />} title="Educational Qualifications" subtitle="Section C — Degrees and certifications" step={3} onEdit={onNavigateToStep} canEdit={canEdit}>
          {(edu.education || []).map((row, i) => (
            <div key={i} className="rounded-[20px] border border-slate-200 bg-white p-4">
              <p className="mb-2 text-sm font-bold text-slate-800">{row.degree}</p>
              <div className="space-y-2">
                <InfoRow label="Institution" value={row.institution} />
                <InfoRow label="Specialisation" value={row.specialisation} />
                <InfoRow label="Year of Passing" value={row.yearOfPassing} />
                <InfoRow label="% / CGPA" value={row.percentage} />
                <InfoRow label="Status" value={row.status} />
              </div>
            </div>
          ))}
          {(edu.certifications || []).filter(c => c.certName).map((cert, i) => (
            <div key={i} className="rounded-[20px] border border-indigo-100 bg-indigo-50/60 p-4">
              <p className="mb-2 text-sm font-bold text-slate-800">Certification {i + 1}</p>
              <div className="space-y-2">
                <InfoRow label="Certification" value={cert.certName} />
                <InfoRow label="Issuing Organisation" value={cert.issuingOrg} />
                <InfoRow label="Year" value={cert.year} />
                <InfoRow label="Duration" value={cert.duration} />
              </div>
            </div>
          ))}
        </Section>

        {/* Step 4 — Work Experience */}
        <Section icon={<FaBriefcase />} title="Work Experience" subtitle="Section D — Employment history" step={4} onEdit={onNavigateToStep} canEdit={canEdit}>
          {(we.workExperience || []).filter(r => r.organisation).map((row, i) => (
            <div key={i} className="rounded-[20px] border border-slate-200 bg-white p-4">
              <p className="mb-2 text-sm font-bold text-slate-800">Experience {i + 1}</p>
              <div className="space-y-2">
                <InfoRow label="Organisation" value={row.organisation} />
                <InfoRow label="Designation" value={row.designation} />
                <InfoRow label="From" value={row.from} />
                <InfoRow label="To" value={row.to} />
                <InfoRow label="Nature of Work" value={row.natureOfWork} />
              </div>
            </div>
          ))}
          <div className="rounded-[20px] border border-slate-100 bg-slate-50 p-4">
            <InfoRow label="Total Work Experience" value={`${safe(we.totalExpYears)} Yrs ${safe(we.totalExpMonths)} Months`} />
            <InfoRow label="Relevant Experience" value={`${safe(we.relevantExpYears)} Yrs ${safe(we.relevantExpMonths)} Months`} />
          </div>
        </Section>

        {/* Step 5 — Startup Exposure */}
        <Section icon={<FaRocket />} title="Startup & Domain Exposure" subtitle="Section E — Ecosystem and domain expertise" step={5} onEdit={onNavigateToStep} canEdit={canEdit}>
          <InfoRow label="Worked with Startup Ecosystem?" value={yesNo(se.workedWithStartupEcosystem)} />
          {se.workedWithStartupEcosystem === "yes" && <InfoRow label="Specify" value={se.startupEcosystemDetails} />}
          <InfoRow label="Incubators Worked With" value={se.ecosystemIncubators} />
          <InfoRow label="Govt / Public Sector Experience?" value={yesNo(se.govtPublicSectorExp)} />
          {se.govtPublicSectorExp === "yes" && <InfoRow label="Specify" value={se.govtPublicSectorDetails} />}
          <InfoRow label="Key Domain Expertise" value={se.keyDomainExpertise} />
        </Section>

        {/* Step 6 — References & Docs */}
        <Section icon={<FaUsers />} title="References & Documents" subtitle="Section F, G & H" step={6} onEdit={onNavigateToStep} canEdit={canEdit}>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">References</p>
          {(rd.references || []).map((ref, i) => (
            <div key={i} className="rounded-[20px] border border-slate-200 bg-white p-4">
              <p className="mb-2 text-sm font-bold text-slate-800">Reference {i + 1}</p>
              <div className="space-y-2">
                <InfoRow label="Name" value={ref.name} />
                <InfoRow label="Organisation & Designation" value={ref.orgDesignation} />
                <InfoRow label="Contact" value={ref.contactNumber} />
                <InfoRow label="Email" value={ref.email} />
              </div>
            </div>
          ))}
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Declaration</p>
          <InfoRow label="Place" value={rd.place} />
          <InfoRow label="Date" value={rd.declarationDate} />
          <InfoRow label="Declaration Accepted" value={yesNo(rd.declarationAccepted)} />
          {rd.signatureMeta?.downloadURL && (
            <LinkRow label="Signature" meta={rd.signatureMeta} />
          )}
        </Section>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-between">
        <button type="button" onClick={onPrevious}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          ← Back
        </button>

        {!isSubmitted ? (
          <button type="button" onClick={onFormSubmit} disabled={isSubmissionClosed}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition ${
              isSubmissionClosed ? "cursor-not-allowed bg-slate-400 opacity-70" : "bg-slate-900 hover:opacity-95"
            }`}>
            <FaPaperPlane />
            {isSubmissionClosed ? "Submission Closed" : "Final Submit"}
          </button>
        ) : (
          <button type="button" onClick={() => downloadPdf(formData)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95">
            <FaDownload /> Download PDF
          </button>
        )}
      </div>
    </div>
  );
}