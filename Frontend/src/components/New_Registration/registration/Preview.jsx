import React from "react";
import {
  FaCheckCircle,
  FaDownload,
  FaEdit,
  FaLock,
  FaPaperPlane,
  FaFilePdf,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const yesNo = (value) => (value ? "Yes" : "No");

const sectionCard =
  "rounded-[30px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6";

function buildRows(formData) {
  const rows = [];

  const addSection = (title, data) => {
    rows.push([
      {
        content: title,
        colSpan: 2,
        styles: {
          fontStyle: "bold",
          fillColor: [241, 245, 249],
          textColor: [15, 23, 42],
        },
      },
    ]);

    data.forEach(([key, value]) => {
      rows.push([key, safe(value)]);
    });
  };

  addSection("Registration Details", [
    ["Application ID", formData?.applicationId],
    ["Founder Name", formData?.userSignup?.founderName],
    ["Startup Name", formData?.userSignup?.startupName],
    ["Email", formData?.userSignup?.email],
    ["Phone Number", formData?.userSignup?.phoneNumber],
    ["Aadhar Number", formData?.userSignup?.aadharNumber],
    ["Phone Verified", yesNo(formData?.userSignup?.phoneVerified)],
    ["Registration Type", formData?.userSignup?.registrationType],
  ]);

  addSection("Basic Details", [
    ["Full Name", formData?.basicDetails?.fullName],
    ["Gender", formData?.basicDetails?.gender],
    ["Category", formData?.basicDetails?.category],
    ["Date of Birth", formData?.basicDetails?.dateOfBirth],
    ["Qualification", formData?.basicDetails?.qualification],
    ["Institution", formData?.basicDetails?.institution],
    ["Other Institution", formData?.basicDetails?.otherInstitution],
    ["LinkedIn", formData?.basicDetails?.linkedinProfile],
    ["State", formData?.basicDetails?.state],
    ["District", formData?.basicDetails?.district],
    ["Profile Photo", formData?.basicDetails?.profilePhotoMeta?.fileName],
  ]);

  addSection("Entity Details", [
    ["Has Registered Entity", yesNo(formData?.entityDetails?.hasRegisteredEntity)],
    ["Entity Name", formData?.entityDetails?.entityName],
    ["Entity Type", formData?.entityDetails?.entityType],
    ["Registration Number", formData?.entityDetails?.entityRegistrationNumber],
    ["Date of Registration", formData?.entityDetails?.dateOfRegistration],
    ["Business Address", formData?.entityDetails?.businessAddress],
    ["State", formData?.entityDetails?.state],
    ["District", formData?.entityDetails?.district],
    ["Certificate", formData?.entityDetails?.certificateMeta?.fileName],
  ]);

  addSection("Startup Details", [
    ["Team Size", formData?.startupDetails?.teamSize],
    ["Website", formData?.startupDetails?.website],
    ["Sector", formData?.startupDetails?.sector],
    ["Stage", formData?.startupDetails?.stage],
    ["Applicant Address", formData?.startupDetails?.applicantAddress],
    ["State", formData?.startupDetails?.state],
    ["District", formData?.startupDetails?.district],
    ["Pincode", formData?.startupDetails?.pincode],
  ]);

  (formData?.cofounderDetails?.coFounders || []).forEach((coFounder, index) => {
    addSection(`Co-Founder ${index + 1}`, [
      ["Name", coFounder?.name],
      ["Email", coFounder?.email],
      ["Phone Number", coFounder?.phoneNumber],
      ["Qualification", coFounder?.qualification],
      ["LinkedIn", coFounder?.linkedinProfile],
    ]);
  });

  addSection("Business Idea", [
    ["Problem Statement", formData?.businessIdea?.problemStatement],
    ["Solution", formData?.businessIdea?.solution],
    ["Innovation", formData?.businessIdea?.innovation],
    ["Business Model", formData?.businessIdea?.businessModel],
    ["Pitch Deck", formData?.businessIdea?.pitchDeckMeta?.fileName],
  ]);

  return rows;
}

function downloadPdf(formData) {
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFontSize(18);
  doc.text("Startup Bihar Application", 14, 16);

  doc.setFontSize(10);
  doc.text(`Application ID: ${safe(formData?.applicationId)}`, 14, 24);
  doc.text(`Status: ${safe(formData?.status)}`, 14, 30);

  autoTable(doc, {
    startY: 36,
    head: [["Field", "Value"]],
    body: buildRows(formData),
    styles: {
      fontSize: 9,
      cellPadding: 2.8,
      valign: "top",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [15, 23, 42],
    },
    columnStyles: {
      0: { cellWidth: 58, fontStyle: "bold" },
      1: { cellWidth: 118 },
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${safe(formData?.applicationId)}-startup-bihar-form.pdf`);
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-1 gap-1 rounded-2xl bg-slate-50 px-4 py-3 md:grid-cols-[240px_1fr]">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="break-words text-sm font-semibold text-slate-800">{safe(value)}</div>
    </div>
  );
}

function Section({ title, step, onEdit, canEdit, children }) {
  return (
    <div className={sectionCard}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>

        {canEdit ? (
          <button
            type="button"
            onClick={() => onEdit(step)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <FaEdit />
            Edit
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-500">
            <FaLock />
            Locked after submit
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

export default function Preview({
  formData,
  onPrevious,
  onFormSubmit,
  onNavigateToStep,
  isSubmitted = false,
}) {
  const canEdit = !isSubmitted;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Preview
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Review your application
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Verify all entered details before final submission.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadPdf(formData)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FaFilePdf />
            Download PDF
          </button>

          {isSubmitted ? (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">
              <FaCheckCircle />
              Already Submitted
            </div>
          ) : null}
        </div>
      </div>

      {isSubmitted ? (
        <div className="mb-6 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          This application has already been submitted. Steps 1 to 6 are locked now. You can review the application and download the PDF.
        </div>
      ) : null}

      <div className="space-y-6">
        <Section title="Registration Details" step={1} onEdit={onNavigateToStep} canEdit={canEdit}>
          <InfoRow label="Application ID" value={formData?.applicationId} />
          <InfoRow label="Founder Name" value={formData?.userSignup?.founderName} />
          <InfoRow label="Startup Name" value={formData?.userSignup?.startupName} />
          <InfoRow label="Email" value={formData?.userSignup?.email} />
          <InfoRow label="Phone Number" value={formData?.userSignup?.phoneNumber} />
          <InfoRow label="Aadhar Number" value={formData?.userSignup?.aadharNumber} />
          <InfoRow label="Registration Type" value={formData?.userSignup?.registrationType} />
        </Section>

        <Section title="Basic Details" step={2} onEdit={onNavigateToStep} canEdit={canEdit}>
          <InfoRow label="Full Name" value={formData?.basicDetails?.fullName} />
          <InfoRow label="Gender" value={formData?.basicDetails?.gender} />
          <InfoRow label="Category" value={formData?.basicDetails?.category} />
          <InfoRow label="Date of Birth" value={formData?.basicDetails?.dateOfBirth} />
          <InfoRow label="Qualification" value={formData?.basicDetails?.qualification} />
          <InfoRow label="Institution" value={formData?.basicDetails?.institution} />
          <InfoRow label="Other Institution" value={formData?.basicDetails?.otherInstitution} />
          <InfoRow label="LinkedIn Profile" value={formData?.basicDetails?.linkedinProfile} />
          <InfoRow label="State" value={formData?.basicDetails?.state} />
          <InfoRow label="District" value={formData?.basicDetails?.district} />
          <InfoRow label="Profile Photo" value={formData?.basicDetails?.profilePhotoMeta?.fileName} />
        </Section>

        <Section title="Entity Details" step={3} onEdit={onNavigateToStep} canEdit={canEdit}>
          <InfoRow label="Has Registered Entity" value={yesNo(formData?.entityDetails?.hasRegisteredEntity)} />
          <InfoRow label="Entity Name" value={formData?.entityDetails?.entityName} />
          <InfoRow label="Entity Type" value={formData?.entityDetails?.entityType} />
          <InfoRow label="Entity Registration Number" value={formData?.entityDetails?.entityRegistrationNumber} />
          <InfoRow label="Date of Registration" value={formData?.entityDetails?.dateOfRegistration} />
          <InfoRow label="Business Address" value={formData?.entityDetails?.businessAddress} />
          <InfoRow label="State" value={formData?.entityDetails?.state} />
          <InfoRow label="District" value={formData?.entityDetails?.district} />
          <InfoRow label="Certificate" value={formData?.entityDetails?.certificateMeta?.fileName} />
        </Section>

        <Section title="Startup Details" step={4} onEdit={onNavigateToStep} canEdit={canEdit}>
          <InfoRow label="Team Size" value={formData?.startupDetails?.teamSize} />
          <InfoRow label="Website" value={formData?.startupDetails?.website} />
          <InfoRow label="Sector" value={formData?.startupDetails?.sector} />
          <InfoRow label="Stage" value={formData?.startupDetails?.stage} />
          <InfoRow label="Applicant Address" value={formData?.startupDetails?.applicantAddress} />
          <InfoRow label="State" value={formData?.startupDetails?.state} />
          <InfoRow label="District" value={formData?.startupDetails?.district} />
          <InfoRow label="Pincode" value={formData?.startupDetails?.pincode} />
        </Section>

        <Section title="Co-Founder Details" step={5} onEdit={onNavigateToStep} canEdit={canEdit}>
          {(formData?.cofounderDetails?.coFounders || []).length === 0 ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              No co-founder details added.
            </div>
          ) : (
            (formData?.cofounderDetails?.coFounders || []).map((coFounder, index) => (
              <div key={index} className="rounded-[24px] border border-slate-200 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-800">
                  Co-Founder {index + 1}
                </div>
                <div className="space-y-3">
                  <InfoRow label="Name" value={coFounder?.name} />
                  <InfoRow label="Email" value={coFounder?.email} />
                  <InfoRow label="Phone Number" value={coFounder?.phoneNumber} />
                  <InfoRow label="Qualification" value={coFounder?.qualification} />
                  <InfoRow label="LinkedIn Profile" value={coFounder?.linkedinProfile} />
                </div>
              </div>
            ))
          )}
        </Section>

        <Section title="Business Idea" step={6} onEdit={onNavigateToStep} canEdit={canEdit}>
          <InfoRow label="Problem Statement" value={formData?.businessIdea?.problemStatement} />
          <InfoRow label="Solution" value={formData?.businessIdea?.solution} />
          <InfoRow label="Innovation" value={formData?.businessIdea?.innovation} />
          <InfoRow label="Business Model" value={formData?.businessIdea?.businessModel} />
          <InfoRow label="Pitch Deck" value={formData?.businessIdea?.pitchDeckMeta?.fileName} />
        </Section>
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Previous
        </button>

        {!isSubmitted ? (
          <button
            type="button"
            onClick={onFormSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            <FaPaperPlane />
            Final Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={() => downloadPdf(formData)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            <FaDownload />
            Download PDF
          </button>
        )}
      </div>
    </div>
  );
}