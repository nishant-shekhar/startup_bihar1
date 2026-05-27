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
  FaCreditCard,
  FaImage,
  FaUniversity,
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

const prettyPaymentStatus = (status) => {
  if (status === "submitted_for_verification") return "Submitted for Verification";
  if (status === "paid") return "Paid";
  if (status === "pending") return "Pending";
  if (status === "rejected") return "Rejected";
  if (status === "verified") return "Verified";
  if (status === "payment_pending") return "Payment Verification Pending";
  return safe(status);
};

const prettyVerificationStatus = (status) => {
  if (status === "pending") return "Pending Verification";
  if (status === "verified") return "Verified";
  if (status === "rejected") return "Rejected";
  return safe(status || "pending");
};

const surfaceCard =
  "rounded-[32px] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6";

function getFileName(meta) {
  if (!meta) return "-";
  return meta.fileName || meta.name || "Uploaded file";
}

function getPostSnapshot(formData) {
  return (
    formData?.personalDetails?.postEligibilitySnapshot ||
    formData?.educationalQualifications?.selectedPostEligibilitySnapshot ||
    null
  );
}

function buildRows(formData) {
  const rows = [];
  const postSnapshot = getPostSnapshot(formData);

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

  addSection("Post Applied For & ToR Eligibility", [
    ["Post Applied For", formData?.personalDetails?.postAppliedFor],
    ["Position No.", postSnapshot?.serialNo],
    ["Level", postSnapshot?.level],
    ["Category", postSnapshot?.category],
    ["Emoluments", postSnapshot?.emoluments],
    ["Required Qualification", postSnapshot?.qualification],
    ["Required Experience", postSnapshot?.experience],
  ]);

  addSection("Personal Details", [
    ["Profile Photo", getFileName(formData?.personalDetails?.profilePhotoMeta)],
    ["Father's / Husband's Name", formData?.personalDetails?.fathersName],
    ["Mother's Name", formData?.personalDetails?.mothersName],
    ["Date of Birth", formData?.personalDetails?.dateOfBirth],
    ["Gender", formData?.personalDetails?.gender],
    ["Category", formData?.personalDetails?.category],
    ["Nationality", formData?.personalDetails?.nationality],
    ["Alternate Number", formData?.personalDetails?.alternateNumber],
    ["Present Address", formData?.personalDetails?.presentAddress],
    ["Present State", formData?.personalDetails?.presentState],
    ["Present District", formData?.personalDetails?.presentDistrict],
    ["Present Pincode", formData?.personalDetails?.presentPincode],
    [
      "Permanent Address",
      formData?.personalDetails?.permanentAddressSameAsPresent
        ? formData?.personalDetails?.presentAddress
        : formData?.personalDetails?.permanentAddress,
    ],
    [
      "Permanent State",
      formData?.personalDetails?.permanentAddressSameAsPresent
        ? formData?.personalDetails?.presentState
        : formData?.personalDetails?.permanentState,
    ],
    [
      "Permanent District",
      formData?.personalDetails?.permanentAddressSameAsPresent
        ? formData?.personalDetails?.presentDistrict
        : formData?.personalDetails?.permanentDistrict,
    ],
    [
      "Permanent Pincode",
      formData?.personalDetails?.permanentAddressSameAsPresent
        ? formData?.personalDetails?.presentPincode
        : formData?.personalDetails?.permanentPincode,
    ],
  ]);

  const edu = formData?.educationalQualifications?.education || [];
  edu.forEach((row, index) => {
    if (row.institution || row.yearOfPassing || row.degree) {
      addSection(`Education ${index + 1}`, [
        ["Qualification", row.degree],
        ["Institution", row.institution],
        ["Board / University", row.boardUniversity],
        ["Specialisation", row.specialisation],
        ["Year of Passing", row.yearOfPassing],
        ["% / CGPA", row.percentage],
        ["Status", row.status],
      ]);
    }
  });

  addSection("Qualification Declaration", [
    [
      "Required Qualification Accepted",
      yesNo(formData?.educationalQualifications?.qualificationDeclaration),
    ],
    [
      "Required Qualification Text",
      formData?.educationalQualifications?.requiredQualificationText ||
        postSnapshot?.qualification,
    ],
  ]);

  const certs = formData?.educationalQualifications?.certifications || [];
  certs.forEach((cert, index) => {
    if (cert.certName || cert.issuingOrg) {
      addSection(`Certification ${index + 1}`, [
        ["Certification Name", cert.certName],
        ["Issuing Organisation", cert.issuingOrg],
        ["Year", cert.year],
        ["Duration", cert.duration],
      ]);
    }
  });

  addSection("Experience Summary", [
    [
      "Total Work Experience",
      `${safe(formData?.workExperience?.totalExpYears)} Years ${safe(
        formData?.workExperience?.totalExpMonths
      )} Months`,
    ],
    [
      "Position Relevant Experience",
      `${safe(formData?.workExperience?.relevantExpYears)} Years ${safe(
        formData?.workExperience?.relevantExpMonths
      )} Months`,
    ],
    ["Required Experience As Per ToR", postSnapshot?.experience],
    [
      "Experience Declaration Accepted",
      yesNo(formData?.workExperience?.experienceDeclaration),
    ],
  ]);

  const work = formData?.workExperience?.workExperience || [];
  work.forEach((row, index) => {
    if (row.organisation || row.designation) {
      addSection(`Work Experience ${index + 1}`, [
        ["Organisation", row.organisation],
        ["Designation", row.designation],
        ["From", row.from],
        ["To", row.to],
        ["Currently Working", yesNo(row.currentlyWorking)],
        ["Nature of Work", row.natureOfWork],
      ]);
    }
  });

  addSection("Startup & Domain Exposure", [
    [
      "Worked with Startup Ecosystem",
      yesNo(formData?.startupExposure?.workedWithStartupEcosystem),
    ],
    ["Startup Ecosystem Details", formData?.startupExposure?.startupEcosystemDetails],
    ["Incubators / Organisations", formData?.startupExposure?.ecosystemIncubators],
    ["Startup Programs Handled", formData?.startupExposure?.startupProgramsHandled],
    ["Investment / Funding Exposure", formData?.startupExposure?.investmentExposure],
    ["Technology / Innovation Exposure", formData?.startupExposure?.technologyExposure],
    [
      "Govt/Public Sector Experience",
      yesNo(formData?.startupExposure?.govtPublicSectorExp),
    ],
    ["Govt/Public Sector Details", formData?.startupExposure?.govtPublicSectorDetails],
    ["Key Domain Expertise", formData?.startupExposure?.keyDomainExpertise],
    ["Policy / Governance Exposure", formData?.startupExposure?.policyExposure],
  ]);

  const refs = formData?.referencesAndDocs?.references || [];
  refs.forEach((ref, index) => {
    if (ref.name || ref.email) {
      addSection(`Reference ${index + 1}`, [
        ["Name", ref.name],
        ["Organisation & Designation", ref.orgDesignation],
        ["Contact", ref.contactNumber],
        ["Email", ref.email],
      ]);
    }
  });

  const documents = formData?.referencesAndDocs?.documents || {};
  addSection("Documents", [
    ["Resume / CV", getFileName(documents?.resume)],
    ["Highest Qualification Certificate", getFileName(documents?.qualification)],
    ["Identity Proof", getFileName(documents?.identity)],
    ["Experience Certificate", getFileName(documents?.experience)],
    ["Category / Caste Certificate", getFileName(documents?.caste)],
    ["Other Supporting Document", getFileName(documents?.other)],
    ["Signature", getFileName(formData?.referencesAndDocs?.signatureMeta)],
    ["Place", formData?.referencesAndDocs?.place],
    ["Declaration Date", formData?.referencesAndDocs?.declarationDate],
    ["Declaration Accepted", yesNo(formData?.referencesAndDocs?.declarationAccepted)],
  ]);

  addSection("Payment Details", [
    ["Payment Status", prettyPaymentStatus(formData?.paymentDetails?.status)],
    [
      "Verification Status",
      prettyVerificationStatus(
        formData?.paymentDetails?.verificationStatus ||
          formData?.paymentDetails?.adminVerification?.status ||
          "pending"
      ),
    ],
    ["Amount", `Rs. ${safe(formData?.paymentDetails?.amount)}`],
    ["Currency", formData?.paymentDetails?.currency || "INR"],
    ["Payment Mode", formData?.paymentDetails?.paymentMode || "SBI_COLLECT"],
    ["UTR / Reference No.", formData?.paymentDetails?.utrNumber],
    ["Payment Date", formData?.paymentDetails?.paymentDate],
    ["Payment Screenshot", getFileName(formData?.paymentDetails?.paymentScreenshotMeta)],
    ["Applicant Declaration", yesNo(formData?.paymentDetails?.applicantDeclaration)],
  ]);

  return rows;
}

function downloadPdf(formData) {
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFontSize(16);
  doc.text("SSU RECRUITMENT - APPLICATION FORM", 14, 16);

  doc.setFontSize(10);
  doc.text(`Application ID: ${safe(formData?.applicationId)}`, 14, 24);
  doc.text(`Applicant: ${safe(formData?.userSignup?.fullName)}`, 14, 30);

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
      textColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 62, fontStyle: "bold" },
      1: { cellWidth: 114 },
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${safe(formData?.applicationId)}-ssu-recruitment.pdf`);
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
          <div className="mt-2 text-xs text-slate-400">No file uploaded</div>
        )}
      </div>
    </div>
  );
}

function ProfilePhotoRow({ meta }) {
  const imageUrl = meta?.downloadURL || "";

  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-4">
      <div className="mb-3 text-sm font-medium text-slate-500">
        Profile Photo
      </div>

      {imageUrl ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <img
            src={imageUrl}
            alt="Profile"
            className="h-28 w-28 rounded-2xl border border-slate-200 object-cover"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <FaImage className="text-slate-500" />
              <span className="break-all">{meta?.fileName || "Profile photo"}</span>
            </div>

            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <FaExternalLinkAlt />
              Open photo
            </a>
          </div>
        </div>
      ) : (
        <div className="text-sm font-semibold text-slate-800">Not uploaded</div>
      )}
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
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    info: "border-indigo-200 bg-indigo-50 text-indigo-800",
    danger: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${toneMap[tone]}`}>
      <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-bold">{safe(value)}</div>
    </div>
  );
}

function EligibilitySnapshotBox({ snapshot }) {
  if (!snapshot) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
        Post eligibility snapshot is not available. Please revisit Personal Details
        and select the post again.
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-indigo-100 bg-indigo-50/80 p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-700 text-white">
          <FaBriefcase />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-xl font-bold text-indigo-950">
            {snapshot.postName}
          </div>
          <div className="mt-1 text-sm text-indigo-700">
            Position {safe(snapshot.serialNo)} • {safe(snapshot.level)} •{" "}
            {safe(snapshot.category)}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                Emoluments
              </div>
              <div className="mt-1 text-sm font-bold text-slate-900">
                {safe(snapshot.emoluments)}
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3 md:col-span-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                Required Qualification
              </div>
              <div className="mt-1 text-sm font-bold leading-relaxed text-slate-900">
                {safe(snapshot.qualification)}
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3 md:col-span-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
                Required Experience
              </div>
              <div className="mt-1 text-sm font-bold leading-relaxed text-slate-900">
                {safe(snapshot.experience)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentStatusBox({ paymentDetails }) {
  if (!paymentDetails) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        Payment details are not submitted.
      </div>
    );
  }

  const adminStatus = paymentDetails?.adminVerification?.status || "pending";

  if (
    paymentDetails?.verified === true ||
    adminStatus === "verified" ||
    paymentDetails?.verificationStatus === "verified"
  ) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        Payment verified by admin.
      </div>
    );
  }

  if (adminStatus === "rejected" || paymentDetails?.verificationStatus === "rejected") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        Payment proof rejected. Please check admin remarks.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
      Payment proof submitted. Verification is pending.
    </div>
  );
}

export default function SSUPreview({
  formData,
  isSubmitted,
  submissionWindow,
  onPrevious,
  onFormSubmit,
  onNavigateToStep,
}) {
  const canEdit = !isSubmitted;

  const postSnapshot = getPostSnapshot(formData);
  const edu = formData?.educationalQualifications?.education || [];
  const certs = formData?.educationalQualifications?.certifications || [];
  const work = formData?.workExperience?.workExperience || [];
  const refs = formData?.referencesAndDocs?.references || [];
  const documents = formData?.referencesAndDocs?.documents || {};
  const paymentDetails = formData?.paymentDetails || null;

  const hasProfilePhoto =
    !!formData?.personalDetails?.profilePhotoMeta?.downloadURL;

  const isPaymentSubmitted =
    paymentDetails?.status === "submitted_for_verification" ||
    paymentDetails?.paymentScreenshotMeta?.downloadURL;

  const canFinalSubmit =
    !!formData?.userSignup &&
    !!formData?.personalDetails &&
    !!postSnapshot &&
    hasProfilePhoto &&
    !!formData?.educationalQualifications &&
    !!formData?.workExperience &&
    !!formData?.startupExposure &&
    !!formData?.referencesAndDocs &&
    !!paymentDetails &&
    isPaymentSubmitted;

  const submitBlockedMessage = !canFinalSubmit
    ? "Please complete all steps, select post, upload profile photo, submit payment proof, and then final submit."
    : submissionWindow?.message || "";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className={surfaceCard}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <FaCheckCircle />
              Review Before Final Submit
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Application Preview
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              Please verify all details carefully. Once finally submitted, editing
              will be locked.
            </p>
          </div>

          <button
            type="button"
            onClick={() => downloadPdf(formData)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FaFilePdf />
            Download PDF
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <SummaryCard label="Application ID" value={formData?.applicationId} />
          <SummaryCard label="Applicant" value={formData?.userSignup?.fullName} />
          <SummaryCard
            label="Post Applied For"
            value={formData?.personalDetails?.postAppliedFor}
          />
          <SummaryCard
            label="Payment"
            value={
              paymentDetails?.verificationStatus === "verified" ||
              paymentDetails?.adminVerification?.status === "verified"
                ? "Verified"
                : isPaymentSubmitted
                  ? "Pending Verification"
                  : "Not Submitted"
            }
            tone={isPaymentSubmitted ? "warning" : "default"}
          />
        </div>
      </div>

      <Section
        icon={<FaUser />}
        title="Account Details"
        subtitle="Registration and login information"
        step={1}
        onEdit={onNavigateToStep}
        canEdit={canEdit}
      >
        <InfoRow label="Application ID" value={formData?.applicationId} />
        <InfoRow label="Full Name" value={formData?.userSignup?.fullName} />
        <InfoRow label="Email" value={formData?.userSignup?.email} />
        <InfoRow label="Phone Number" value={formData?.userSignup?.phoneNumber} />
        <InfoRow label="Aadhaar Number" value={formData?.userSignup?.aadharNumber} />
        <InfoRow label="Phone Verified" value={yesNo(formData?.userSignup?.phoneVerified)} />
      </Section>

      <Section
        icon={<FaBriefcase />}
        title="Post & Eligibility Snapshot"
        subtitle="Post, qualification, experience and emoluments as per ToR"
        step={2}
        onEdit={onNavigateToStep}
        canEdit={canEdit}
      >
        <EligibilitySnapshotBox snapshot={postSnapshot} />
      </Section>

      <Section
        icon={<FaIdBadge />}
        title="Personal Details"
        subtitle="Applicant profile, photo and address details"
        step={2}
        onEdit={onNavigateToStep}
        canEdit={canEdit}
      >
        <ProfilePhotoRow meta={formData?.personalDetails?.profilePhotoMeta} />

        <InfoRow
          label="Father's / Husband's Name"
          value={formData?.personalDetails?.fathersName}
        />
        <InfoRow label="Mother's Name" value={formData?.personalDetails?.mothersName} />
        <InfoRow label="Date of Birth" value={formData?.personalDetails?.dateOfBirth} />
        <InfoRow label="Gender" value={formData?.personalDetails?.gender} />
        <InfoRow label="Category" value={formData?.personalDetails?.category} />
        <InfoRow label="Nationality" value={formData?.personalDetails?.nationality} />
        <InfoRow label="Alternate Number" value={formData?.personalDetails?.alternateNumber} />
        <InfoRow label="Present Address" value={formData?.personalDetails?.presentAddress} />
        <InfoRow label="Present State" value={formData?.personalDetails?.presentState} />
        <InfoRow label="Present District" value={formData?.personalDetails?.presentDistrict} />
        <InfoRow label="Present Pincode" value={formData?.personalDetails?.presentPincode} />
        <InfoRow
          label="Permanent Address"
          value={
            formData?.personalDetails?.permanentAddressSameAsPresent
              ? formData?.personalDetails?.presentAddress
              : formData?.personalDetails?.permanentAddress
          }
        />
        <InfoRow
          label="Permanent State"
          value={
            formData?.personalDetails?.permanentAddressSameAsPresent
              ? formData?.personalDetails?.presentState
              : formData?.personalDetails?.permanentState
          }
        />
        <InfoRow
          label="Permanent District"
          value={
            formData?.personalDetails?.permanentAddressSameAsPresent
              ? formData?.personalDetails?.presentDistrict
              : formData?.personalDetails?.permanentDistrict
          }
        />
        <InfoRow
          label="Permanent Pincode"
          value={
            formData?.personalDetails?.permanentAddressSameAsPresent
              ? formData?.personalDetails?.presentPincode
              : formData?.personalDetails?.permanentPincode
          }
        />
      </Section>

      <Section
        icon={<FaGraduationCap />}
        title="Educational Qualifications"
        subtitle="Academic qualifications and ToR qualification declaration"
        step={3}
        onEdit={onNavigateToStep}
        canEdit={canEdit}
      >
        <InfoRow
          label="Required Qualification As Per ToR"
          value={
            formData?.educationalQualifications?.requiredQualificationText ||
            postSnapshot?.qualification
          }
        />
        <InfoRow
          label="Qualification Declaration"
          value={yesNo(formData?.educationalQualifications?.qualificationDeclaration)}
        />

        {edu.length ? (
          edu.map((row, index) => (
            <div
              key={`edu-${index}`}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="mb-3 font-semibold text-slate-900">
                {row.degree || `Qualification ${index + 1}`}
              </div>

              <div className="space-y-2">
                <InfoRow label="Qualification" value={row.degree} />
                <InfoRow label="Institution" value={row.institution} />
                <InfoRow label="Board / University" value={row.boardUniversity} />
                <InfoRow label="Specialisation" value={row.specialisation} />
                <InfoRow label="Year of Passing" value={row.yearOfPassing} />
                <InfoRow label="% / CGPA" value={row.percentage} />
                <InfoRow label="Status" value={row.status} />
              </div>
            </div>
          ))
        ) : (
          <InfoRow label="Education" value="No education details added" />
        )}

        {certs.length ? (
          certs.map((cert, index) => (
            <div
              key={`cert-${index}`}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="mb-3 font-semibold text-slate-900">
                Certification {index + 1}
              </div>

              <div className="space-y-2">
                <InfoRow label="Certification Name" value={cert.certName} />
                <InfoRow label="Issuing Organisation" value={cert.issuingOrg} />
                <InfoRow label="Year" value={cert.year} />
                <InfoRow label="Duration" value={cert.duration} />
              </div>
            </div>
          ))
        ) : null}
      </Section>

      <Section
        icon={<FaBriefcase />}
        title="Work Experience"
        subtitle="Professional experience and ToR experience declaration"
        step={4}
        onEdit={onNavigateToStep}
        canEdit={canEdit}
      >
        <InfoRow
          label="Required Experience As Per ToR"
          value={
            formData?.workExperience?.requiredExperienceText ||
            postSnapshot?.experience
          }
        />
        <InfoRow
          label="Experience Declaration"
          value={yesNo(formData?.workExperience?.experienceDeclaration)}
        />
        <InfoRow
          label="Total Work Experience"
          value={`${safe(formData?.workExperience?.totalExpYears)} Years ${safe(
            formData?.workExperience?.totalExpMonths
          )} Months`}
        />
        <InfoRow
          label="Position Relevant Experience"
          value={`${safe(formData?.workExperience?.relevantExpYears)} Years ${safe(
            formData?.workExperience?.relevantExpMonths
          )} Months`}
        />

        {work.length ? (
          work.map((row, index) => (
            <div
              key={`work-${index}`}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="mb-3 font-semibold text-slate-900">
                Work Experience {index + 1}
              </div>

              <div className="space-y-2">
                <InfoRow label="Organisation" value={row.organisation} />
                <InfoRow label="Designation" value={row.designation} />
                <InfoRow label="From" value={row.from} />
                <InfoRow label="To" value={row.to} />
                <InfoRow label="Currently Working" value={yesNo(row.currentlyWorking)} />
                <InfoRow label="Nature of Work" value={row.natureOfWork} />
              </div>
            </div>
          ))
        ) : (
          <InfoRow label="Experience" value="No work experience added" />
        )}
      </Section>

      <Section
        icon={<FaRocket />}
        title="Startup & Domain Exposure"
        subtitle="Startup ecosystem and government/public sector exposure"
        step={5}
        onEdit={onNavigateToStep}
        canEdit={canEdit}
      >
        <InfoRow
          label="Worked with Startup Ecosystem"
          value={yesNo(formData?.startupExposure?.workedWithStartupEcosystem)}
        />
        <InfoRow
          label="Startup Ecosystem Details"
          value={formData?.startupExposure?.startupEcosystemDetails}
        />
        <InfoRow
          label="Incubators / Organisations"
          value={formData?.startupExposure?.ecosystemIncubators}
        />
        <InfoRow
          label="Startup Programs Handled"
          value={formData?.startupExposure?.startupProgramsHandled}
        />
        <InfoRow
          label="Investment / Funding Exposure"
          value={formData?.startupExposure?.investmentExposure}
        />
        <InfoRow
          label="Technology / Innovation Exposure"
          value={formData?.startupExposure?.technologyExposure}
        />
        <InfoRow
          label="Govt/Public Sector Experience"
          value={yesNo(formData?.startupExposure?.govtPublicSectorExp)}
        />
        <InfoRow
          label="Govt/Public Sector Details"
          value={formData?.startupExposure?.govtPublicSectorDetails}
        />
        <InfoRow
          label="Key Domain Expertise"
          value={formData?.startupExposure?.keyDomainExpertise}
        />
        <InfoRow
          label="Policy / Governance Exposure"
          value={formData?.startupExposure?.policyExposure}
        />
      </Section>

      <Section
        icon={<FaUsers />}
        title="References & Documents"
        subtitle="Reference details, uploaded documents and declaration"
        step={6}
        onEdit={onNavigateToStep}
        canEdit={canEdit}
      >
        {refs.length ? (
          refs.map((ref, index) => (
            <div
              key={`ref-${index}`}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="mb-3 font-semibold text-slate-900">
                Reference {index + 1}
              </div>

              <div className="space-y-2">
                <InfoRow label="Name" value={ref.name} />
                <InfoRow label="Organisation & Designation" value={ref.orgDesignation} />
                <InfoRow label="Contact" value={ref.contactNumber} />
                <InfoRow label="Email" value={ref.email} />
              </div>
            </div>
          ))
        ) : (
          <InfoRow label="References" value="No references added" />
        )}

        {documents?.resume ? <LinkRow label="Resume / CV" meta={documents.resume} /> : null}
        {documents?.qualification ? (
          <LinkRow label="Highest Qualification Certificate" meta={documents.qualification} />
        ) : null}
        {documents?.identity ? <LinkRow label="Identity Proof" meta={documents.identity} /> : null}
        {documents?.experience ? (
          <LinkRow label="Experience Certificate" meta={documents.experience} />
        ) : null}
        {documents?.caste ? (
          <LinkRow label="Category / Caste Certificate" meta={documents.caste} />
        ) : null}
        {documents?.other ? (
          <LinkRow label="Other Supporting Document" meta={documents.other} />
        ) : null}

        {formData?.referencesAndDocs?.signatureMeta ? (
          <LinkRow
            label="Signature"
            meta={formData.referencesAndDocs.signatureMeta}
          />
        ) : null}

        <InfoRow label="Place" value={formData?.referencesAndDocs?.place} />
        <InfoRow label="Date" value={formData?.referencesAndDocs?.declarationDate} />
        <InfoRow
          label="Declaration Accepted"
          value={yesNo(formData?.referencesAndDocs?.declarationAccepted)}
        />
      </Section>

      <Section
        icon={<FaUniversity />}
        title="SBI Collect Payment Details"
        subtitle="Application fee proof and verification status"
        step={7}
        onEdit={onNavigateToStep}
        canEdit={canEdit}
      >
        <PaymentStatusBox paymentDetails={paymentDetails} />

        <InfoRow
          label="Payment Status"
          value={prettyPaymentStatus(paymentDetails?.status)}
        />
        <InfoRow
          label="Verification Status"
          value={prettyVerificationStatus(
            paymentDetails?.verificationStatus ||
              paymentDetails?.adminVerification?.status ||
              "pending"
          )}
        />
        <InfoRow label="Amount" value={`₹${safe(paymentDetails?.amount)}`} />
        <InfoRow label="Currency" value={paymentDetails?.currency || "INR"} />
        <InfoRow label="Payment Mode" value={paymentDetails?.paymentMode || "SBI_COLLECT"} />
        <InfoRow label="UTR / Reference No." value={paymentDetails?.utrNumber} />
        <InfoRow label="Payment Date" value={paymentDetails?.paymentDate} />
        <InfoRow
          label="Applicant Declaration"
          value={yesNo(paymentDetails?.applicantDeclaration)}
        />

        {paymentDetails?.paymentScreenshotMeta?.downloadURL ? (
          <LinkRow
            label="SBI Collect Screenshot"
            meta={paymentDetails.paymentScreenshotMeta}
          />
        ) : (
          <InfoRow label="SBI Collect Screenshot" value="Not uploaded" />
        )}

        {paymentDetails?.adminVerification?.remarks ? (
          <InfoRow
            label="Admin Verification Remarks"
            value={paymentDetails.adminVerification.remarks}
          />
        ) : null}
      </Section>

      {submitBlockedMessage ? (
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
          {submitBlockedMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-[32px] border border-white/80 bg-white/80 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Back
        </button>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => downloadPdf(formData)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FaDownload />
            Download PDF
          </button>

          <button
            type="button"
            disabled={!canFinalSubmit || isSubmitted || submissionWindow?.isOpen === false}
            onClick={onFormSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaPaperPlane />
            {isSubmitted ? "Already Submitted" : "Final Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}