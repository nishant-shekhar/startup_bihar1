import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Search,
  RefreshCw,
  FileText,
  Building2,
  CircleCheckBig,
  Clock3,
  X,
  Mail,
  Phone,
  MapPin,
  User2,
  CalendarDays,
  Briefcase,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import FeedbackList from "./FeedBackList";
import { MessageSquareText } from "lucide-react";

const STATUS_OPTIONS = [
  "All",
  "submitted",
  "Under Review",
  "Approved",
  "Rejected",
  "draft",
];

const REGISTERED_OPTIONS = ["All", "Yes", "No"];

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const yesNo = (value) => (value ? "Yes" : "No");

const formatDate = (value) => {
  if (!value) return "-";

  try {
    if (value?.seconds) {
      return new Date(value.seconds * 1000).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

const getStatus = (item) =>
  item?.status ||
  item?.applicationStatus ||
  item?.reviewStatus ||
  item?.documentStatus ||
  "Submitted";

const hasRegisteredCompany = (item) =>
  !!(
    item?.entityDetails?.hasRegisteredEntity ||
    item?.cin ||
    item?.registrationNumber ||
    item?.registration_no ||
    item?.entityType ||
    item?.entityDetails?.entityRegistrationNumber
  );

const getApplicationId = (item, docId) =>
  item?.applicationId ||
  item?.applicationNo ||
  item?.registrationNumber ||
  item?.registration_no ||
  docId;

const getStartupName = (item) =>
  item?.userSignup?.startupName ||
  item?.startupName ||
  item?.startup_name ||
  item?.company_name ||
  item?.companyName;

const getFounderName = (item) =>
  item?.userSignup?.founderName ||
  item?.basicDetails?.fullName ||
  item?.founderName ||
  item?.founder_name ||
  item?.name;

const getEmail = (item) =>
  item?.userSignup?.email || item?.email || item?.basicDetails?.email;

const getPhone = (item) =>
  item?.userSignup?.phoneNumber || item?.phoneNumber || item?.mobile;

const getDistrict = (item) =>
  item?.basicDetails?.district ||
  item?.district ||
  item?.registeredDistrict ||
  item?.districtRoc ||
  item?.startupDistrict ||
  item?.entityDetails?.district;

const getCategory = (item) =>
  item?.startupDetails?.sector ||
  item?.basicDetails?.category ||
  item?.category ||
  item?.sector ||
  item?.startupCategory;

const getStage = (item) => item?.startupDetails?.stage || item?.stage || "-";

const getCreatedAt = (item) =>
  item?.createdAt || item?.submittedAt || item?.firestoreUpdatedAt || null;

const statusToneMap = {
  Submitted: "border-sky-200 bg-sky-50 text-sky-700",
  "Under Review": "border-amber-200 bg-amber-50 text-amber-700",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700",
  Draft: "border-slate-200 bg-slate-100 text-slate-700",
};

function StatusBadge({ status, dark = false }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        dark
          ? "border-white/15 bg-white/10 text-white"
          : statusToneMap[status] || "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      {safe(status)}
    </span>
  );
}

function RegisteredBadge({ value, dark = false }) {
  if (dark) {
    return (
      <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
        Registered Company: {value ? "Yes" : "No"}
      </span>
    );
  }

  return value ? (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      Yes
    </span>
  ) : (
    <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      No
    </span>
  );
}

function SummaryCard({ title, value, subtitle, icon: Icon, accent = "amber" }) {
  const accentClasses = {
    amber: "from-amber-50 via-white to-orange-50",
    blue: "from-sky-50 via-white to-indigo-50",
    emerald: "from-emerald-50 via-white to-teal-50",
    rose: "from-rose-50 via-white to-orange-50",
    slate: "from-slate-50 via-white to-slate-100",
  };

  return (
    <div className="rounded-[28px] border border-white/90 bg-white/78 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.10)] backdrop-blur-xl">
      <div
        className={`rounded-[22px] bg-gradient-to-br ${
          accentClasses[accent] || accentClasses.amber
        } p-5`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {title}
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {safe(value)}
            </div>
            <div className="mt-2 text-sm text-slate-500">{subtitle}</div>
          </div>

          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <Icon size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/72 p-4 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={14} />
        <span className="text-xs font-semibold uppercase tracking-[0.14em]">
          {label}
        </span>
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-slate-900">
        {safe(value)}
      </div>
    </div>
  );
}

function FieldBox({ label, value, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="rounded-2xl bg-slate-50 px-4 py-4">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </div>
        <div className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">
          {safe(value)}
        </div>
      </div>
    </div>
  );
}

function FileCard({ label, meta }) {
  const fileName = meta?.fileName || "-";
  const link = meta?.downloadURL || "";

  return (
    <div className="md:col-span-2">
      <div className="rounded-2xl bg-slate-50 px-4 py-4">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </div>

        <div className="mt-2 break-words text-sm font-semibold text-slate-800">
          {fileName}
        </div>

        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Open File
            <ChevronRight size={14} />
          </a>
        ) : (
          <div className="mt-2 text-xs text-slate-400">No file uploaded</div>
        )}
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-[30px] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">{children}</div>
    </div>
  );
}

function DetailDialog({ open, onClose, application }) {
  if (!open || !application) return null;

  const item = application;
  const coFounders = item?.cofounderDetails?.coFounders || [];
  const isSoleFounder = !!item?.cofounderDetails?.isSoleFounder;

  const startupName = safe(getStartupName(item));
  const founderName = safe(getFounderName(item));
  const email = safe(getEmail(item));
  const phone = safe(getPhone(item));
  const submitted = safe(item._createdAtDisplay);
  const district = safe(getDistrict(item));
  const category = safe(getCategory(item));
  const stage = safe(getStage(item));

  const profilePhoto = item?.basicDetails?.profilePhotoMeta?.downloadURL || "";
  const profilePhotoName = item?.basicDetails?.profilePhotoMeta?.fileName || "";

  const feedback = item?.websiteFeedback || null;
  const hasFeedback = feedback?.submitted === true;

  const hasEntity =
    !!item?.entityDetails?.hasRegisteredEntity || !!item?._registeredCompany;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-md md:p-6">
      <div className="relative max-h-[94vh] w-full max-w-[1380px] overflow-hidden rounded-[36px] border border-white/20 bg-[#f7f9fc] shadow-[0_40px_120px_rgba(2,6,23,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.15),transparent_18%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_22%),linear-gradient(to_bottom,rgba(255,255,255,0.86),rgba(255,255,255,0.97))]" />

        <div className="relative flex max-h-[94vh] flex-col">
          <div className="sticky top-0 z-20 border-b border-white/70 bg-white/72 px-5 py-4 backdrop-blur-xl md:px-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-700 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Application Details
                </div>

                <h2 className="mt-3 truncate text-[28px] font-bold tracking-tight text-slate-900">
                  {startupName}
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusBadge status={item._status} />
                  <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                    ID: {safe(item._applicationId)}
                  </span>
                  <RegisteredBadge value={item._registeredCompany} />
                  {hasFeedback ? (
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Feedback: {safe(feedback?.rating)}/5
                    </span>
                  ) : null}
                </div>
              </div>

              <button
                onClick={onClose}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:scale-[1.02] hover:bg-slate-50"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="relative max-h-[calc(94vh-90px)] overflow-auto px-4 py-4 md:px-7 md:py-6">
            <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
              <div className="space-y-5">
                <div className="overflow-hidden rounded-[30px] border border-slate-800/10 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white shadow-[0_24px_60px_rgba(15,23,42,0.24)]">
                  <div className="bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.18),transparent_22%)] p-4">
                    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/8">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt={founderName}
                          className="h-[300px] w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-[300px] items-center justify-center text-center text-sm text-white/60">
                          No profile photo
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                        Founder
                      </div>
                      <div className="mt-1 text-lg font-semibold text-white">
                        {founderName}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3">
                      <HeroMeta label="Email" value={email} />
                      <HeroMeta label="Mobile" value={phone} />
                      <HeroMeta label="District" value={district} />
                      <HeroMeta label="Stage" value={stage} />
                    </div>

                    {profilePhotoName ? (
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                          Profile File
                        </div>
                        <div className="mt-1 break-words text-sm font-medium text-white/90">
                          {safe(profilePhotoName)}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <CompactMetaCard
                  title="Quick Overview"
                  items={[
                    ["Category / Sector", category],
                    ["Submitted", submitted],
                    ["Application Type", item?.userSignup?.applicationType || item?.applicationType],
                    ["Team Size", item?.startupDetails?.teamSize],
                    ["Website", item?.startupDetails?.website],
                    ["Registered Entity", hasEntity ? "Yes" : "No"],
                  ]}
                />

                {hasFeedback ? (
                  <CompactFeedbackCard feedback={feedback} />
                ) : null}
              </div>

              <div className="space-y-5">
                <div className="grid gap-5 xl:grid-cols-[1.3fr_0.72fr]">
                  <PrimarySectionCard
                    title="Business Idea"
                    subtitle="Most important evaluation content"
                    tone="warm"
                  >
                    <NarrativeBlock
                      title="Problem Statement"
                      value={item?.businessIdea?.problemStatement}
                    />
                    <NarrativeBlock
                      title="Solution"
                      value={item?.businessIdea?.solution}
                    />
                    <NarrativeBlock
                      title="Innovation"
                      value={item?.businessIdea?.innovation}
                    />
                    <NarrativeBlock
                      title="Business Model"
                      value={item?.businessIdea?.businessModel}
                    />
                  </PrimarySectionCard>

                  <UtilityRailCard title="Pitch Deck & Review Data">
                    <DocumentSpotlight
                      title="Pitch Deck"
                      meta={item?.businessIdea?.pitchDeckMeta}
                      accent="violet"
                    />

                    <UtilityItem label="Sector" value={item?.startupDetails?.sector || category} />
                    <UtilityItem label="Stage" value={item?.startupDetails?.stage || stage} />
                    <UtilityItem label="Team Size" value={item?.startupDetails?.teamSize} />
                    <UtilityItem label="Website" value={item?.startupDetails?.website} />
                    <UtilityItem label="Registered Entity" value={hasEntity ? "Yes" : "No"} />

                    {hasEntity ? (
                      <DocumentMiniCard
                        title="Entity Certificate"
                        meta={item?.entityDetails?.certificateMeta}
                      />
                    ) : (
                      <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
                        No registered entity certificate available.
                      </div>
                    )}
                  </UtilityRailCard>
                </div>

                <PrimarySectionCard
                  title="Founder Profile"
                  subtitle="Founder identity and applicant details"
                  tone="slate"
                >
                  <MetaGrid
                    items={[
                      ["Full Name", item?.basicDetails?.fullName || founderName],
                      ["Email", email],
                      ["Phone Number", phone],
                      ["Gender", item?.basicDetails?.gender],
                      ["Category", item?.basicDetails?.category],
                      ["Date of Birth", item?.basicDetails?.dateOfBirth],
                      ["Qualification", item?.basicDetails?.qualification],
                      ["Institution", item?.basicDetails?.institution],
                      ["LinkedIn Profile", item?.basicDetails?.linkedinProfile],
                      ["State", item?.basicDetails?.state],
                      ["District", item?.basicDetails?.district],
                      ["Block Name", item?.basicDetails?.blockName],
                      ["Pincode", item?.basicDetails?.pincode],
                    ]}
                  />
                  <WideMetaRow
                    label="Applicant Address"
                    value={item?.basicDetails?.applicantAddress}
                  />
                </PrimarySectionCard>

                <PrimarySectionCard
                  title="Entity Details"
                  subtitle="Company registration and business records"
                  tone="indigo"
                >
                  {!hasEntity ? (
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
                      No registered entity has been added in this application.
                    </div>
                  ) : (
                    <>
                      <MetaGrid
                        items={[
                          [
                            "Has Registered Entity",
                            yesNo(item?.entityDetails?.hasRegisteredEntity || item._registeredCompany),
                          ],
                          ["Entity Name", item?.entityDetails?.entityName],
                          ["Entity Type", item?.entityDetails?.entityType],
                          [
                            "Registration Number",
                            item?.entityDetails?.entityRegistrationNumber || item?.registrationNumber,
                          ],
                          ["Date of Registration", item?.entityDetails?.dateOfRegistration],
                          ["State", item?.entityDetails?.state],
                          ["District", item?.entityDetails?.district],
                        ]}
                      />
                      <WideMetaRow
                        label="Business Address"
                        value={item?.entityDetails?.businessAddress}
                      />
                      <DocumentMiniCard
                        title="Certificate"
                        meta={item?.entityDetails?.certificateMeta}
                      />
                    </>
                  )}
                </PrimarySectionCard>

                <PrimarySectionCard
                  title="Website Feedback"
                  subtitle="Applicant experience with the form"
                  tone="emerald"
                >
                  {hasFeedback ? (
                    <>
                      <MetaGrid
                        items={[
                          ["Submitted", "Yes"],
                          ["Experience", feedback?.experience],
                          ["Rating", `${safe(feedback?.rating)}/5`],
                          ["Submitted At", formatDate(feedback?.submittedAt)],
                        ]}
                      />
                      <WideMetaRow
                        label="Message"
                        value={feedback?.message || "No message provided"}
                      />
                    </>
                  ) : (
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
                      No website feedback submitted yet.
                    </div>
                  )}
                </PrimarySectionCard>

                <PrimarySectionCard
                  title="Co-Founder Details"
                  subtitle="Additional founders listed in the application"
                  tone="slate"
                >
                  {isSoleFounder ? (
                    <div className="rounded-[22px] border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 text-sm font-medium text-emerald-800">
                      This startup has been marked as a sole-founder venture.
                    </div>
                  ) : coFounders.length === 0 ? (
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
                      No co-founder details added.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {coFounders.map((coFounder, index) => (
                        <div
                          key={index}
                          className="rounded-[24px] border border-slate-200 bg-white/88 px-4 py-4 shadow-sm"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="text-sm font-semibold text-slate-800">
                              Co-Founder {index + 1}
                            </div>
                            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                              Team Member
                            </span>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <SlimMeta label="Name" value={coFounder?.name} />
                            <SlimMeta label="Email" value={coFounder?.email} />
                            <SlimMeta label="Phone Number" value={coFounder?.phoneNumber} />
                            <SlimMeta label="Qualification" value={coFounder?.qualification} />
                            <div className="md:col-span-2">
                              <SlimMeta label="LinkedIn Profile" value={coFounder?.linkedinProfile} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </PrimarySectionCard>

                <PrimarySectionCard
                  title="Registration Metadata"
                  subtitle="Low-priority application reference details"
                  tone="slate"
                >
                  <MetaGrid
                    items={[
                      ["Application ID", item._applicationId],
                      ["Founder Name", getFounderName(item)],
                      ["Startup Name", getStartupName(item)],
                      ["Aadhar Number", item?.userSignup?.aadharNumber],
                      ["Status", item._status],
                    ]}
                  />
                </PrimarySectionCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroMeta({ label, value }) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/7 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-medium text-white/92">
        {safe(value)}
      </div>
    </div>
  );
}

function CompactMetaCard({ title, items }) {
  return (
    <div className="rounded-[28px] border border-white/85 bg-white/82 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-4 space-y-3">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-[18px] bg-slate-50 px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {label}
            </div>
            <div className="mt-1 break-words text-sm font-semibold text-slate-800">
              {safe(value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactFeedbackCard({ feedback }) {
  return (
    <div className="rounded-[28px] border border-white/85 bg-white/82 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-900">Feedback Summary</div>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {safe(feedback?.rating)}/5
        </span>
      </div>

      <div className="mt-4 rounded-[18px] bg-slate-50 px-4 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Experience
        </div>
        <div className="mt-1 text-sm font-semibold text-slate-800">
          {safe(feedback?.experience)}
        </div>
      </div>

      {feedback?.message ? (
        <div className="mt-3 rounded-[18px] bg-slate-50 px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Message
          </div>
          <div className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
            {feedback.message}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PrimarySectionCard({ title, subtitle, children, tone = "slate" }) {
  const toneMap = {
    slate: "from-white via-white to-slate-50",
    warm: "from-amber-50/70 via-white to-orange-50/50",
    indigo: "from-indigo-50/55 via-white to-sky-50/35",
    emerald: "from-emerald-50/55 via-white to-teal-50/35",
  };

  return (
    <div className="rounded-[30px] border border-white/85 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
      <div className={`rounded-[24px] bg-gradient-to-br ${toneMap[tone] || toneMap.slate} p-5`}>
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="mt-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

function UtilityRailCard({ title, children }) {
  return (
    <div className="rounded-[30px] border border-white/85 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function NarrativeBlock({ title, value }) {
  return (
    <div className="rounded-[22px] border border-slate-100 bg-white/90 px-5 py-4 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </div>
      <div className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-800">
        {safe(value)}
      </div>
    </div>
  );
}

function MetaGrid({ items }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(([label, value]) => (
        <SlimMeta key={label} label={label} value={value} />
      ))}
    </div>
  );
}

function SlimMeta({ label, value }) {
  return (
    <div className="rounded-[20px] border border-slate-100 bg-white/88 px-4 py-4 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-slate-800">
        {safe(value)}
      </div>
    </div>
  );
}

function WideMetaRow({ label, value }) {
  return (
    <div className="rounded-[22px] border border-slate-100 bg-white/88 px-5 py-4 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
        {safe(value)}
      </div>
    </div>
  );
}

function UtilityItem({ label, value }) {
  return (
    <div className="rounded-[18px] bg-slate-50 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 break-words text-sm font-semibold text-slate-800">
        {safe(value)}
      </div>
    </div>
  );
}

function DocumentSpotlight({ title, meta, accent = "violet" }) {
  const fileName = meta?.fileName || "-";
  const link = meta?.downloadURL || "";

  const accentMap = {
    violet: "from-violet-50/70 via-white to-indigo-50/50",
    amber: "from-amber-50/70 via-white to-orange-50/50",
  };

  return (
    <div className={`rounded-[22px] border border-slate-100 bg-gradient-to-br ${accentMap[accent] || accentMap.violet} p-4 shadow-sm`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-slate-800">
        {fileName}
      </div>

      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Open File
          <ChevronRight size={14} />
        </a>
      ) : (
        <div className="mt-3 text-xs text-slate-400">No file uploaded</div>
      )}
    </div>
  );
}

function DocumentMiniCard({ title, meta }) {
  const fileName = meta?.fileName || "-";
  const link = meta?.downloadURL || "";

  return (
    <div className="rounded-[20px] border border-slate-100 bg-white/88 px-4 py-4 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-slate-800">
        {fileName}
      </div>

      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Open File
          <ChevronRight size={14} />
        </a>
      ) : (
        <div className="mt-3 text-xs text-slate-400">No file uploaded</div>
      )}
    </div>
  );
}

function PremiumSectionCard({ title, subtitle, children, tone = "default" }) {
  const toneMap = {
    default: "from-white to-slate-50",
    amber: "from-amber-50/80 via-white to-orange-50/60",
    indigo: "from-indigo-50/70 via-white to-sky-50/60",
    violet: "from-violet-50/70 via-white to-indigo-50/60",
    emerald: "from-emerald-50/70 via-white to-teal-50/60",
    slate: "from-slate-50 via-white to-slate-100/70",
  };

  return (
    <div className="rounded-[30px] border border-white/85 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
      <div className={`rounded-[24px] bg-gradient-to-br ${toneMap[tone] || toneMap.default} p-5`}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">{children}</div>
      </div>
    </div>
  );
}

function PremiumFieldBox({ label, value, full = false, multiline = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="h-full rounded-[22px] border border-slate-100 bg-white/85 px-4 py-4 shadow-sm backdrop-blur">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </div>
        <div
          className={`mt-2 break-words text-sm font-semibold text-slate-800 ${
            multiline ? "whitespace-pre-wrap leading-6" : ""
          }`}
        >
          {safe(value)}
        </div>
      </div>
    </div>
  );
}

function PremiumFileCard({ label, meta }) {
  const fileName = meta?.fileName || "-";
  const link = meta?.downloadURL || "";

  return (
    <div className="md:col-span-2">
      <div className="rounded-[22px] border border-slate-100 bg-gradient-to-br from-amber-50/70 via-white to-indigo-50/50 px-4 py-4 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </div>

        <div className="mt-2 break-words text-sm font-semibold text-slate-800">
          {fileName}
        </div>

        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Open File
            <ChevronRight size={14} />
          </a>
        ) : (
          <div className="mt-2 text-xs text-slate-400">No file uploaded</div>
        )}
      </div>
    </div>
  );
}

function PremiumImageCard({ label, meta }) {
  const fileName = meta?.fileName || "-";
  const link = meta?.downloadURL || "";

  return (
    <div className="md:col-span-2">
      <div className="rounded-[22px] border border-slate-100 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 p-4 shadow-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </div>

        <div className="mt-3 overflow-hidden rounded-[20px] border border-slate-200 bg-white">
          {link ? (
            <img
              src={link}
              alt={fileName}
              className="h-[260px] w-full object-cover"
            />
          ) : (
            <div className="flex h-[260px] items-center justify-center text-sm text-slate-400">
              No image uploaded
            </div>
          )}
        </div>

        <div className="mt-3 break-words text-sm font-semibold text-slate-800">
          {fileName}
        </div>

        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Open Image
            <ChevronRight size={14} />
          </a>
        ) : null}
      </div>
    </div>
  );
}

function PremiumInfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/8 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-white/70">
        <Icon size={14} />
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-white">
        {safe(value)}
      </div>
    </div>
  );
}

function MiniHeroStat({ label, value }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/6 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-white">
        {safe(value)}
      </div>
    </div>
  );
}

export default function NewApplicationDashboard() {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [registeredFilter, setRegisteredFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const loadApplications = async () => {
    setLoading(true);

    try {
      const q = query(
        collection(db, "startupApplications"),
        orderBy("createdAt", "desc"),
        limit(500)
      );

      const snapshot = await getDocs(q);

      const rows = snapshot.docs.map((docItem) => {
        const data = docItem.data();
        return {
          id: docItem.id,
          ...data,
          _status: getStatus(data),
          _registeredCompany: hasRegisteredCompany(data),
          _applicationId: getApplicationId(data, docItem.id),
          _createdAtDisplay: formatDate(getCreatedAt(data)),
        };
      });

      setApplications(rows);
    } catch (error) {
      console.error("Failed to load applications", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const districts = useMemo(() => {
    const values = new Set();

    applications.forEach((item) => {
      const district = getDistrict(item);
      if (district && district !== "-") values.add(district);
    });

    return ["All", ...Array.from(values).sort()];
  }, [applications]);

  useEffect(() => {
    const q = search.trim().toLowerCase();

    const next = applications.filter((item) => {
      const searchable = [
        item._applicationId,
        getStartupName(item),
        getFounderName(item),
        getEmail(item),
        getPhone(item),
        getDistrict(item),
        getCategory(item),
        getStage(item),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchable.includes(q);
      const matchesStatus =
        statusFilter === "All" || item._status === statusFilter;

      const matchesRegistered =
        registeredFilter === "All" ||
        (registeredFilter === "Yes" && item._registeredCompany) ||
        (registeredFilter === "No" && !item._registeredCompany);

      const matchesDistrict =
        districtFilter === "All" || getDistrict(item) === districtFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRegistered &&
        matchesDistrict
      );
    });

    setFiltered(next);
  }, [applications, search, statusFilter, registeredFilter, districtFilter]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      submitted: applications.filter((a) => a._status === "submitted").length,
      review: applications.filter((a) => a._status === "Under Review").length,
      approved: applications.filter((a) => a._status === "Approved").length,
      registered: applications.filter((a) => a._registeredCompany).length,
    };
  }, [applications]);

  const handleRowClick = (item) => {
    setSelected(item);
    setDialogOpen(true);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg1.jpg')" }}
    >
      <div className="absolute inset-0 bg-white/70 backdrop-[blur(2px)]" />

      <div className="relative mx-auto max-w-[1650px] p-4 md:p-6 xl:p-8">
        <div className="overflow-hidden rounded-[38px] border border-white/80 bg-white/58 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="border-b border-white/70 bg-white/30 px-5 py-5 md:px-7 md:py-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  New Application Dashboard
                </div>
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Admin Dashboard
                </h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-500">
                  Incoming startup applications, premium filters, and full-screen
                  detail view on row click.
                </p>
              </div>

              <button
                onClick={loadApplications}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
  onClick={() => setFeedbackDialogOpen(true)}
  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
>
  <MessageSquareText size={16} />
  Website Feedback
</button>
            </div>
          </div>

          <div className="p-5 md:p-7">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <SummaryCard
                title="Total Applications"
                value={stats.total}
                subtitle="All incoming applications"
                icon={FileText}
                accent="amber"
              />
              <SummaryCard
                title="Submitted"
                value={stats.submitted}
                subtitle="Awaiting action"
                icon={Clock3}
                accent="blue"
              />
              <SummaryCard
                title="Under Review"
                value={stats.review}
                subtitle="Currently being checked"
                icon={Search}
                accent="amber"
              />
              <SummaryCard
                title="Approved"
                value={stats.approved}
                subtitle="Successfully cleared"
                icon={CircleCheckBig}
                accent="emerald"
              />
              <SummaryCard
                title="Registered Company"
                value={stats.registered}
                subtitle="Company already registered"
                icon={Building2}
                accent="slate"
              />
            </div>

            <div className="mt-6 rounded-[30px] border border-white/80 bg-white/78 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="xl:col-span-1">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Search
                  </label>
                  <div className="relative">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search startup, founder, mobile, email..."
                      className="w-full rounded-2xl border border-white/80 bg-white/85 px-4 py-3 pl-11 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                  >
                    {STATUS_OPTIONS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Registered Company
                  </label>
                  <select
                    value={registeredFilter}
                    onChange={(e) => setRegisteredFilter(e.target.value)}
                    className="w-full rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                  >
                    {REGISTERED_OPTIONS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    District
                  </label>
                  <select
                    value={districtFilter}
                    onChange={(e) => setDistrictFilter(e.target.value)}
                    className="w-full rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                  >
                    {districts.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Sparkles size={12} />
                  Showing {filtered.length} of {applications.length}
                </span>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[32px] border border-white/80 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Incoming Applications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Click any row to open the full details dialog
                </p>
              </div>

              <div className="overflow-auto">
                <table className="min-w-[1250px] w-full">
                  <thead className="bg-slate-50/80">
                    <tr className="text-left text-xs uppercase tracking-[0.14em] text-slate-500">
                      <th className="px-5 py-4 font-semibold">Application ID</th>
                      <th className="px-5 py-4 font-semibold">Startup</th>
                      <th className="px-5 py-4 font-semibold">Founder</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Registered Company</th>
                      <th className="px-5 py-4 font-semibold">District</th>
                      <th className="px-5 py-4 font-semibold">Category / Sector</th>
                      <th className="px-5 py-4 font-semibold">Stage</th>
                      <th className="px-5 py-4 font-semibold">Submitted</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      Array.from({ length: 8 }).map((_, index) => (
                        <tr key={index} className="border-t border-slate-100">
                          {Array.from({ length: 9 }).map((__, i) => (
                            <td key={i} className="px-5 py-4">
                              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-16 text-center">
                          <div className="mx-auto max-w-md">
                            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                              <FileText size={22} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">
                              No applications found
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                              Try changing the filter or search values.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => handleRowClick(item)}
                          className="cursor-pointer border-t border-slate-100 transition hover:bg-amber-50/40"
                        >
                          <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                            {safe(item._applicationId)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="text-sm font-semibold text-slate-900">
                              {safe(getStartupName(item))}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {safe(getEmail(item))}
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-700">
                            {safe(getFounderName(item))}
                          </td>

                          <td className="px-5 py-4">
                            <StatusBadge status={item._status} />
                          </td>

                          <td className="px-5 py-4">
                            <RegisteredBadge value={item._registeredCompany} />
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-700">
                            {safe(getDistrict(item))}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-700">
                            {safe(getCategory(item))}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-700">
                            {safe(getStage(item))}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-700">
                            {safe(item._createdAtDisplay)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        application={selected}
      />
      <FeedbackList
  open={feedbackDialogOpen}
  onClose={() => setFeedbackDialogOpen(false)}
/>
    </div>
  );
}