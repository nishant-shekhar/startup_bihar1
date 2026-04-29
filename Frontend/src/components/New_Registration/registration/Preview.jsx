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
  FaBuilding,
  FaLightbulb,
  FaUsers,
  FaRocket,
  FaIdBadge,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const yesNo = (value) => (value ? "Yes" : "No");

const formatApplicationType = (value) => {
  if (value === "recognition_only") return "Startup Recognition Only";
  if (value === "funding_with_recognition") {
    return "Startup Funding with Recognition";
  }
  return safe(value);
};

const surfaceCard =
  "rounded-[32px] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6";

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
    ["Application Type", formatApplicationType(formData?.userSignup?.applicationType)],
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
    ["Applicant Address", formData?.basicDetails?.applicantAddress],
    ["State", formData?.basicDetails?.state],
    ["District", formData?.basicDetails?.district],
    ["Block Name", formData?.basicDetails?.blockName],
    ["Pincode", formData?.basicDetails?.pincode],
    ["Profile Photo", formData?.basicDetails?.profilePhotoMeta?.fileName],
    ["Profile Photo Link", formData?.basicDetails?.profilePhotoMeta?.downloadURL],
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
    ["Certificate Link", formData?.entityDetails?.certificateMeta?.downloadURL],
  ]);

  addSection("Startup Details", [
    ["Team Size", formData?.startupDetails?.teamSize],
    ["Website", formData?.startupDetails?.website],
    ["Sector", formData?.startupDetails?.sector],
    ["Stage", formData?.startupDetails?.stage],
  ]);

  if (formData?.cofounderDetails?.isSoleFounder) {
    addSection("Co-Founder Details", [["Sole Founder", "Yes"]]);
  } else {
    (formData?.cofounderDetails?.coFounders || []).forEach((coFounder, index) => {
      addSection(`Co-Founder ${index + 1}`, [
        ["Name", coFounder?.name],
        ["Email", coFounder?.email],
        ["Phone Number", coFounder?.phoneNumber],
        ["Qualification", coFounder?.qualification],
        ["LinkedIn", coFounder?.linkedinProfile],
      ]);
    });
  }

  addSection("Business Idea", [
    ["Problem Statement", formData?.businessIdea?.problemStatement],
    ["Solution", formData?.businessIdea?.solution],
    ["Innovation", formData?.businessIdea?.innovation],
    ["Business Model", formData?.businessIdea?.businessModel],
    ["Pitch Deck", formData?.businessIdea?.pitchDeckMeta?.fileName],
    ["Pitch Deck Link", formData?.businessIdea?.pitchDeckMeta?.downloadURL],
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
    <div className="grid grid-cols-1 gap-1 rounded-2xl bg-slate-50 px-4 py-3 md:grid-cols-[220px_1fr]">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="break-words text-sm font-semibold text-slate-800">
        {safe(value)}
      </div>
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
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <FaExternalLinkAlt />
            Open file
          </a>
        ) : (
          <div className="mt-2 text-xs text-slate-400">No file link available</div>
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
  );
}

function Section({ icon, title, subtitle, step, onEdit, canEdit, children }) {
  return (
    <div className={surfaceCard}>
      <SectionHeader
        icon={icon}
        title={title}
        subtitle={subtitle}
        canEdit={canEdit}
        onEdit={onEdit}
        step={step}
      />
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

export default function Preview({
  formData,
  onPrevious,
  onFormSubmit,
  onNavigateToStep,
  submissionWindow,
  isSubmitted = false,
}) {
  const canEdit = !isSubmitted;
  const coFounders = formData?.cofounderDetails?.coFounders || [];
  const isSoleFounder = !!formData?.cofounderDetails?.isSoleFounder;

  const isSubmissionClosed =
    !isSubmitted && submissionWindow?.checked && submissionWindow?.isOpen === false;

  const submissionMessage =
    submissionWindow?.message || "Form submission is closed.";

  return (
    <div className="mx-auto w-full max-w-6xl">
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
              Check all sections carefully. File links are visible below so you can confirm
              the exact uploaded document before you submit.
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

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <SummaryCard label="Application ID" value={formData?.applicationId} tone="default" />
          <SummaryCard label="Founder" value={formData?.userSignup?.founderName} tone="default" />
          <SummaryCard label="Startup" value={formData?.userSignup?.startupName} tone="accent" />
          <SummaryCard
            label="Status"
            value={
              isSubmitted
                ? "Submitted"
                : isSubmissionClosed
                ? "Submission Closed"
                : "Pending Final Submit"
            }
            tone={isSubmitted ? "success" : isSubmissionClosed ? "danger" : "default"}
          />
        </div>
      </div>

      {isSubmitted ? (
        <div className="mb-6 rounded-[24px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          This application has already been submitted. Steps 1 to 6 are locked now. You can review the details and download the PDF.
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
        <Section
          icon={<FaIdBadge />}
          title="Registration Details"
          subtitle="Core applicant identity and account details"
          step={1}
          onEdit={onNavigateToStep}
          canEdit={canEdit}
        >
          <InfoRow label="Application ID" value={formData?.applicationId} />
          <InfoRow label="Founder Name" value={formData?.userSignup?.founderName} />
          <InfoRow label="Startup Name" value={formData?.userSignup?.startupName} />
          <InfoRow
            label="Application Type"
            value={formatApplicationType(formData?.userSignup?.applicationType)}
          />
          <InfoRow label="Email" value={formData?.userSignup?.email} />
          <InfoRow label="Phone Number" value={formData?.userSignup?.phoneNumber} />
          <InfoRow label="Aadhar Number" value={formData?.userSignup?.aadharNumber} />
          <InfoRow label="Phone Verified" value={yesNo(formData?.userSignup?.phoneVerified)} />
          <InfoRow label="Registration Type" value={formData?.userSignup?.registrationType} />
        </Section>

        <Section
          icon={<FaUser />}
          title="Basic Details"
          subtitle="Personal details, education, profile photo, and address"
          step={2}
          onEdit={onNavigateToStep}
          canEdit={canEdit}
        >
          <InfoRow label="Full Name" value={formData?.basicDetails?.fullName} />
          <InfoRow label="Gender" value={formData?.basicDetails?.gender} />
          <InfoRow label="Category" value={formData?.basicDetails?.category} />
          <InfoRow label="Date of Birth" value={formData?.basicDetails?.dateOfBirth} />
          <InfoRow label="Qualification" value={formData?.basicDetails?.qualification} />
          <InfoRow label="Institution" value={formData?.basicDetails?.institution} />
          <InfoRow label="Other Institution" value={formData?.basicDetails?.otherInstitution} />
          <InfoRow label="LinkedIn Profile" value={formData?.basicDetails?.linkedinProfile} />
          <InfoRow label="Applicant Address" value={formData?.basicDetails?.applicantAddress} />
          <InfoRow label="State" value={formData?.basicDetails?.state} />
          <InfoRow label="District" value={formData?.basicDetails?.district} />
          <InfoRow label="Block Name" value={formData?.basicDetails?.blockName} />
          <InfoRow label="Pincode" value={formData?.basicDetails?.pincode} />
          <LinkRow label="Profile Photo" meta={formData?.basicDetails?.profilePhotoMeta} />
        </Section>

        <Section
          icon={<FaBuilding />}
          title="Entity Details"
          subtitle="Registered entity information and certificate"
          step={3}
          onEdit={onNavigateToStep}
          canEdit={canEdit}
        >
          <InfoRow
            label="Has Registered Entity"
            value={yesNo(formData?.entityDetails?.hasRegisteredEntity)}
          />
          <InfoRow label="Entity Name" value={formData?.entityDetails?.entityName} />
          <InfoRow label="Entity Type" value={formData?.entityDetails?.entityType} />
          <InfoRow
            label="Entity Registration Number"
            value={formData?.entityDetails?.entityRegistrationNumber}
          />
          <InfoRow
            label="Date of Registration"
            value={formData?.entityDetails?.dateOfRegistration}
          />
          <InfoRow label="Business Address" value={formData?.entityDetails?.businessAddress} />
          <InfoRow label="State" value={formData?.entityDetails?.state} />
          <InfoRow label="District" value={formData?.entityDetails?.district} />
          <LinkRow label="Certificate" meta={formData?.entityDetails?.certificateMeta} />
        </Section>

        <Section
          icon={<FaRocket />}
          title="Startup Details"
          subtitle="Venture profile, sector, and stage"
          step={4}
          onEdit={onNavigateToStep}
          canEdit={canEdit}
        >
          <InfoRow label="Team Size" value={formData?.startupDetails?.teamSize} />
          <InfoRow label="Website" value={formData?.startupDetails?.website} />
          <InfoRow label="Sector" value={formData?.startupDetails?.sector} />
          <InfoRow label="Stage" value={formData?.startupDetails?.stage} />
        </Section>

        <Section
          icon={<FaUsers />}
          title="Co-Founder Details"
          subtitle="Co-founder records added in the application"
          step={5}
          onEdit={onNavigateToStep}
          canEdit={canEdit}
        >
          {isSoleFounder ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              This startup has been marked as a sole-founder venture.
            </div>
          ) : coFounders.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              No co-founder details added.
            </div>
          ) : (
            coFounders.map((coFounder, index) => (
              <div key={index} className="rounded-[24px] border border-slate-200 bg-white p-4">
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

        <Section
          icon={<FaLightbulb />}
          title="Business Idea"
          subtitle="Problem, solution, innovation, model, and pitch deck"
          step={6}
          onEdit={onNavigateToStep}
          canEdit={canEdit}
        >
          <InfoRow label="Problem Statement" value={formData?.businessIdea?.problemStatement} />
          <InfoRow label="Solution" value={formData?.businessIdea?.solution} />
          <InfoRow label="Innovation" value={formData?.businessIdea?.innovation} />
          <InfoRow label="Business Model" value={formData?.businessIdea?.businessModel} />
          <LinkRow label="Pitch Deck" meta={formData?.businessIdea?.pitchDeckMeta} />
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
            disabled={isSubmissionClosed}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition ${
              isSubmissionClosed
                ? "cursor-not-allowed bg-slate-400 opacity-70"
                : "bg-slate-900 hover:opacity-95"
            }`}
          >
            <FaPaperPlane />
            {isSubmissionClosed ? "Submission Closed" : "Final Submit"}
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