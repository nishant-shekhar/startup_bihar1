import React, { useState } from "react";
import {
  X,
  ChevronRight,
  Bot,
  FileText,
  UserRound,
  Building2,
  Lightbulb,
  Rocket,
  Star,
  MessageSquareText,
  ExternalLink,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Users,
  BadgeCheck,
  ClipboardList,
  IdCard,
  ShieldCheck,
  Layers3,
  Globe2,
} from "lucide-react";
import AIEvaluationModal from "./AIEvaluationModal";

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const yesNo = (value) => (value ? "Yes" : "No");

const formatDate = (value) => {
  if (!value) return "-";

  try {
    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

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

const statusToneMap = {
  submitted: "border-sky-200 bg-sky-50 text-sky-700",
  Submitted: "border-sky-200 bg-sky-50 text-sky-700",
  "Under Review": "border-amber-200 bg-amber-50 text-amber-700",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700",
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  Draft: "border-slate-200 bg-slate-100 text-slate-700",
};

function StatusBadge({ status, dark = false }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        dark
          ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-50"
          : statusToneMap[status] ||
            "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      {safe(status)}
    </span>
  );
}

function RegisteredBadge({ value, dark = false }) {
  if (dark) {
    return (
      <span className="inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-50">
        Registered Company: {value ? "Yes" : "No"}
      </span>
    );
  }

  return value ? (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      Registered Company: Yes
    </span>
  ) : (
    <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      Registered Company: No
    </span>
  );
}
function LinkValue({ value, label = "Open Link" }) {
  if (!value || value === "-") return <>{safe(value)}</>;

  const raw = String(value).trim();
  const href = raw.startsWith("http://") || raw.startsWith("https://")
    ? raw
    : `https://${raw}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 break-all text-cyan-700 underline-offset-4 transition hover:text-cyan-900 hover:underline"
    >
      {raw}
      <ExternalLink size={13} />
    </a>
  );
}

function ReviewBadge({ children, tone = "slate" }) {
  const toneMap = {
    slate: "border-slate-200 bg-white text-slate-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${
        toneMap[tone] || toneMap.slate
      }`}
    >
      {children}
    </span>
  );
}

function IconLabel({ icon: Icon, label, value, dark = false }) {
  return (
    <div
      className={`rounded-[20px] px-4 py-3 ${
        dark
          ? "border border-white/10 bg-white/[0.07]"
          : "border border-slate-100 bg-white/90 shadow-sm"
      }`}
    >
      <div
        className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] ${
          dark ? "text-cyan-50/60" : "text-slate-500"
        }`}
      >
        <Icon size={13} />
        {label}
      </div>

    <div className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">
  {label === "Website" || label === "LinkedIn Profile" ? (
    <LinkValue value={value} />
  ) : (
    safe(value)
  )}
</div>
    </div>
  );
}

function scrollToDialogSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function SideNavButton({ icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-3 rounded-[18px] border border-slate-100 bg-white/78 px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50/70 hover:text-slate-950"
    >
      <span className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-cyan-100 group-hover:text-cyan-700">
          <Icon size={15} />
        </span>
        {label}
      </span>

      <ChevronRight size={14} className="text-slate-400 transition group-hover:text-cyan-600" />
    </button>
  );
}

function SectionShell({
  id,
  icon: Icon,
  title,
  subtitle,
  children,
  tone = "slate",
}) {
  const toneMap = {
    slate: "from-white via-white to-slate-50",
    warm: "from-amber-50/80 via-white to-orange-50/45",
    indigo: "from-indigo-50/75 via-white to-cyan-50/45",
    emerald: "from-emerald-50/70 via-white to-teal-50/45",
    violet: "from-violet-50/75 via-white to-indigo-50/45",
    cyan: "from-cyan-50/75 via-white to-sky-50/45",
  };

  return (
    <section
      id={id}
      className="scroll-mt-6 rounded-[30px] border border-white/85 bg-white/82 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-5"
    >
      <div
        className={`rounded-[24px] bg-gradient-to-br ${
          toneMap[tone] || toneMap.slate
        } p-5`}
      >
        <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]">
            <Icon size={18} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function NarrativeReviewCard({ number, title, value, tone = "amber" }) {
  const toneMap = {
    amber: "from-amber-500 to-orange-500",
    indigo: "from-indigo-500 to-cyan-500",
    emerald: "from-emerald-500 to-teal-500",
    violet: "from-violet-500 to-indigo-500",
  };

  return (
    <div className="rounded-[24px] border border-slate-100 bg-white/94 p-5 shadow-sm transition hover:border-cyan-100 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-white shadow-sm ${
            toneMap[tone] || toneMap.amber
          }`}
        >
          {number}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {title}
          </div>

          <div className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-7 text-slate-800">
            {safe(value)}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoGrid({ items }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(([label, value]) => (
        <InfoCell key={label} label={label} value={value} />
      ))}
    </div>
  );
}

function InfoCell({ label, value }) {
  return (
    <div className="rounded-[20px] border border-slate-100 bg-white/90 px-4 py-4 shadow-sm transition hover:border-cyan-100">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>

      <div className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">
        {safe(value)}
      </div>
    </div>
  );
}

function WideInfoCell({ label, value }) {
  return (
    <div className="rounded-[22px] border border-slate-100 bg-white/90 px-5 py-4 shadow-sm transition hover:border-cyan-100">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>

      <div className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
        {safe(value)}
      </div>
    </div>
  );
}

function ActionDocumentCard({
  title,
  meta,
  icon: Icon = FileText,
  tone = "violet",
}) {
  const fileName = meta?.fileName || "-";
  const link = meta?.downloadURL || "";

  const toneMap = {
    violet: "from-violet-50/85 via-white to-indigo-50/70",
    amber: "from-amber-50/85 via-white to-orange-50/70",
    emerald: "from-emerald-50/85 via-white to-teal-50/70",
    cyan: "from-cyan-50/85 via-white to-sky-50/70",
    slate: "from-slate-50 via-white to-slate-100",
  };

  return (
    <div
      className={`rounded-[24px] border border-slate-100 bg-gradient-to-br ${
        toneMap[tone] || toneMap.violet
      } p-4 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
          <Icon size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {title}
          </div>

          <div className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">
            {fileName}
          </div>

          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
            >
              Open File
              <ExternalLink size={14} />
            </a>
          ) : (
            <div className="mt-3 text-xs text-slate-400">
              No file uploaded
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UtilityRail({ title, children }) {
  return (
    <aside className="rounded-[30px] border border-white/85 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mb-5 border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          Important files and quick review data.
        </p>
      </div>

      <div className="space-y-4">{children}</div>
    </aside>
  );
}

function UtilityFact({ label, value }) {
  return (
    <div className="rounded-[18px] border border-slate-100 bg-slate-50/95 px-4 py-3 transition hover:border-cyan-100 hover:bg-white">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>

      <div className="mt-1 break-words text-sm font-semibold text-slate-800">
        {safe(value)}
      </div>
    </div>
  );
}

function ProfileRail({
  profilePhoto,
  profilePhotoName,
  founderName,
  email,
  phone,
  district,
  stage,
  onAI,
}) {
  return (
    <div className="sticky top-4 space-y-4">
      <div className="overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white shadow-[0_24px_70px_rgba(15,23,42,0.30)]">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.16),transparent_25%),radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_30%)] p-4">
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt={founderName}
                className="h-[260px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[260px] items-center justify-center text-center text-sm text-white/60">
                No profile photo
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-50/55">
              Founder
            </div>
            <div className="mt-1 text-lg font-semibold text-white">
              {safe(founderName)}
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <IconLabel dark icon={Mail} label="Email" value={email} />
            <IconLabel dark icon={Phone} label="Mobile" value={phone} />
            <IconLabel dark icon={MapPin} label="District" value={district} />
            <IconLabel dark icon={Rocket} label="Stage" value={stage} />
          </div>

          {profilePhotoName ? (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-50/55">
                Profile File
              </div>
              <div className="mt-1 break-words text-sm font-medium text-white/90">
                {safe(profilePhotoName)}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <button
        type="button"
        onClick={onAI}
        className="flex w-full items-center justify-center gap-2 rounded-[22px] border border-cyan-200 bg-gradient-to-r from-cyan-50 to-indigo-50 px-4 py-3 text-sm font-bold text-cyan-700 shadow-sm transition hover:border-cyan-300 hover:from-cyan-100 hover:to-indigo-100"
      >
        <Bot size={17} />
        AI Evaluation
      </button>

      <div className="rounded-[28px] border border-white/85 bg-white/84 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="mb-3 text-sm font-bold text-slate-900">
          Review Navigation
        </div>

        <div className="space-y-2">
          <SideNavButton
            icon={Lightbulb}
            label="Business Idea"
            onClick={() => scrollToDialogSection("review-business-idea")}
          />
          <SideNavButton
            icon={UserRound}
            label="Founder Profile"
            onClick={() => scrollToDialogSection("review-founder")}
          />
          <SideNavButton
            icon={Building2}
            label="Entity Details"
            onClick={() => scrollToDialogSection("review-entity")}
          />
          <SideNavButton
            icon={Users}
            label="Co-Founders"
            onClick={() => scrollToDialogSection("review-cofounders")}
          />
          <SideNavButton
            icon={MessageSquareText}
            label="Website Feedback"
            onClick={() => scrollToDialogSection("review-feedback")}
          />
          <SideNavButton
            icon={ClipboardList}
            label="Metadata"
            onClick={() => scrollToDialogSection("review-metadata")}
          />
        </div>
      </div>
    </div>
  );
}

function FeedbackMiniPanel({ feedback }) {
  const hasFeedback = feedback?.submitted === true;

  if (!hasFeedback) {
    return (
      <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
        No website feedback submitted yet.
      </div>
    );
  }

  return (
    <div className="rounded-[22px] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Website Feedback
          </div>
          <div className="mt-1 text-sm font-bold text-slate-900">
            {safe(feedback?.experience)}
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          {safe(feedback?.rating)}/5
        </div>
      </div>

      {feedback?.message ? (
        <div className="mt-3 whitespace-pre-wrap break-words rounded-[18px] border border-white bg-white/75 px-4 py-3 text-sm leading-6 text-slate-700">
          {feedback.message}
        </div>
      ) : null}
    </div>
  );
}

function CofounderList({ coFounders, isSoleFounder }) {
  if (isSoleFounder) {
    return (
      <div className="rounded-[22px] border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 text-sm font-medium text-emerald-800">
        This startup has been marked as a sole-founder venture.
      </div>
    );
  }

  if (!coFounders.length) {
    return (
      <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
        No co-founder details added.
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {coFounders.map((coFounder, index) => (
        <div
          key={index}
          className="rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-sm font-bold text-slate-800">
              Co-Founder {index + 1}
            </div>
            <ReviewBadge tone="indigo">Team Member</ReviewBadge>
          </div>

          <div className="space-y-3">
            <InfoCell label="Name" value={coFounder?.name} />
            <InfoCell label="Email" value={coFounder?.email} />
            <InfoCell label="Phone Number" value={coFounder?.phoneNumber} />
            <InfoCell label="Qualification" value={coFounder?.qualification} />
            <WideInfoCell
              label="LinkedIn Profile"
              value={coFounder?.linkedinProfile}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DetailDialog({
  open,
  onClose,
  application,
  getStartupName,
  getFounderName,
  getEmail,
  getPhone,
  getDistrict,
  getCategory,
  getStage,
}) {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  if (!open || !application) return null;

  const item = application || {};

  const startupId =
    item?._applicationId ||
    item?.applicationId ||
    item?.id ||
    item?.userId ||
    item?.startupId ||
    "";

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

  const institutionValue =
    item?.basicDetails?.institution === "Other"
      ? item?.basicDetails?.otherInstitution
      : item?.basicDetails?.institution;

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/76 p-3 backdrop-blur-md md:p-6">
        <div className="relative max-h-[94vh] w-full max-w-[1500px] overflow-hidden rounded-[38px] border border-white/20 bg-[#f7f9fc] shadow-[0_44px_130px_rgba(2,6,23,0.50)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_18%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_23%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.10),transparent_21%),linear-gradient(to_bottom,rgba(255,255,255,0.90),rgba(255,255,255,0.98))]" />

          <div className="relative flex max-h-[94vh] flex-col">
            <div className="border-b border-white/70 bg-white/78 px-5 py-4 backdrop-blur-xl md:px-7">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-700 shadow-sm">
                    <Sparkles size={13} />
                    Startup Application Review
                  </div>

                  <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-center">
                    <h2 className="truncate text-[28px] font-bold tracking-tight text-slate-950">
                      {startupName}
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={item._status} />
                      <ReviewBadge>ID: {safe(item._applicationId)}</ReviewBadge>
                      <RegisteredBadge value={item._registeredCompany} />
                      {hasFeedback ? (
                        <ReviewBadge tone="emerald">
                          Feedback {safe(feedback?.rating)}/5
                        </ReviewBadge>
                      ) : null}
                    </div>
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

            <div className="relative overflow-auto px-4 py-4 md:px-7 md:py-6">
              <div className="grid gap-5 xl:grid-cols-[300px_1fr]">
                <ProfileRail
                  profilePhoto={profilePhoto}
                  profilePhotoName={profilePhotoName}
                  founderName={founderName}
                  email={email}
                  phone={phone}
                  district={district}
                  stage={stage}
                  onAI={() => setIsAIModalOpen(true)}
                />

                <div className="space-y-5">
                  <div className="grid gap-5 2xl:grid-cols-[1fr_380px]">
                    <SectionShell
                      id="review-business-idea"
                      icon={Lightbulb}
                      title="Business Idea"
                      subtitle="Primary evaluation area. This section should receive the most review attention."
                      tone="warm"
                    >
                      <div className="grid gap-4">
                        <NarrativeReviewCard
                          number="1"
                          title="Problem Statement"
                          value={item?.businessIdea?.problemStatement}
                          tone="amber"
                        />
                        <NarrativeReviewCard
                          number="2"
                          title="Solution"
                          value={item?.businessIdea?.solution}
                          tone="indigo"
                        />
                        <NarrativeReviewCard
                          number="3"
                          title="Innovation"
                          value={item?.businessIdea?.innovation}
                          tone="emerald"
                        />
                        <NarrativeReviewCard
                          number="4"
                          title="Business Model"
                          value={item?.businessIdea?.businessModel}
                          tone="violet"
                        />
                      </div>
                    </SectionShell>

                    <div className="space-y-5 2xl:sticky 2xl:top-4 2xl:self-start">
                      <UtilityRail title="Review Utility">
                        <ActionDocumentCard
                          title="Pitch Deck"
                          meta={item?.businessIdea?.pitchDeckMeta}
                          icon={FileText}
                          tone="violet"
                        />

                        <div className="grid gap-3">
                          <UtilityFact
                            label="Sector"
                            value={item?.startupDetails?.sector || category}
                          />
                          <UtilityFact
                            label="Stage"
                            value={item?.startupDetails?.stage || stage}
                          />
                          <UtilityFact
                            label="Team Size"
                            value={item?.startupDetails?.teamSize}
                          />
                          <UtilityFact
                            label="Website"
                            value={item?.startupDetails?.website}
                          />
                          <UtilityFact label="Submitted" value={submitted} />
                          <UtilityFact
                            label="Registered Entity"
                            value={hasEntity ? "Yes" : "No"}
                          />
                        </div>

                        {hasEntity ? (
                          <ActionDocumentCard
                            title="Entity Certificate"
                            meta={item?.entityDetails?.certificateMeta}
                            icon={BadgeCheck}
                            tone="emerald"
                          />
                        ) : null}

                        <FeedbackMiniPanel feedback={feedback} />
                      </UtilityRail>
                    </div>
                  </div>

                  <SectionShell
                    id="review-founder"
                    icon={UserRound}
                    title="Founder Profile"
                    subtitle="Applicant identity, contact details, education, and address."
                    tone="slate"
                  >
                    <InfoGrid
                      items={[
                        ["Full Name", item?.basicDetails?.fullName || founderName],
                        ["Email", email],
                        ["Phone Number", phone],
                        ["Gender", item?.basicDetails?.gender],
                        ["Category", item?.basicDetails?.category],
                        ["Date of Birth", item?.basicDetails?.dateOfBirth],
                        ["Qualification", item?.basicDetails?.qualification],
                        ["Institution", institutionValue],
                        ["LinkedIn Profile", item?.basicDetails?.linkedinProfile],
                        ["State", item?.basicDetails?.state],
                        ["District", item?.basicDetails?.district],
                        ["Block Name", item?.basicDetails?.blockName],
                        ["Pincode", item?.basicDetails?.pincode],
                      ]}
                    />

                    <div className="mt-3">
                      <WideInfoCell
                        label="Applicant Address"
                        value={item?.basicDetails?.applicantAddress}
                      />
                    </div>
                  </SectionShell>

                  <SectionShell
                    id="review-entity"
                    icon={Building2}
                    title="Entity Details"
                    subtitle="Company registration details and official business information."
                    tone="indigo"
                  >
                    {!hasEntity ? (
                      <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
                        No registered entity has been added in this application.
                      </div>
                    ) : (
                      <>
                        <InfoGrid
                          items={[
                            [
                              "Has Registered Entity",
                              yesNo(
                                item?.entityDetails?.hasRegisteredEntity ||
                                  item._registeredCompany
                              ),
                            ],
                            ["Entity Name", item?.entityDetails?.entityName],
                            ["Entity Type", item?.entityDetails?.entityType],
                            [
                              "Registration Number",
                              item?.entityDetails?.entityRegistrationNumber ||
                                item?.registrationNumber,
                            ],
                            [
                              "Date of Registration",
                              item?.entityDetails?.dateOfRegistration,
                            ],
                            ["State", item?.entityDetails?.state],
                            ["District", item?.entityDetails?.district],
                          ]}
                        />

                        <div className="mt-3">
                          <WideInfoCell
                            label="Business Address"
                            value={item?.entityDetails?.businessAddress}
                          />
                        </div>

                        <div className="mt-3">
                          <ActionDocumentCard
                            title="Certificate"
                            meta={item?.entityDetails?.certificateMeta}
                            icon={BadgeCheck}
                            tone="emerald"
                          />
                        </div>
                      </>
                    )}
                  </SectionShell>

                  <SectionShell
                    id="review-cofounders"
                    icon={Users}
                    title="Co-Founder Details"
                    subtitle="Additional founders and team members listed by applicant."
                    tone="slate"
                  >
                    <CofounderList
                      coFounders={coFounders}
                      isSoleFounder={isSoleFounder}
                    />
                  </SectionShell>

                  <SectionShell
                    id="review-feedback"
                    icon={MessageSquareText}
                    title="Website Feedback"
                    subtitle="Applicant experience feedback from the application flow."
                    tone="emerald"
                  >
                    {hasFeedback ? (
                      <>
                        <InfoGrid
                          items={[
                            ["Submitted", "Yes"],
                            ["Experience", feedback?.experience],
                            ["Rating", `${safe(feedback?.rating)}/5`],
                            ["Submitted At", formatDate(feedback?.submittedAt)],
                          ]}
                        />

                        <div className="mt-3">
                          <WideInfoCell
                            label="Message"
                            value={feedback?.message || "No message provided"}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500">
                        No website feedback submitted yet.
                      </div>
                    )}
                  </SectionShell>

                  <SectionShell
                    id="review-metadata"
                    icon={IdCard}
                    title="Registration Metadata"
                    subtitle="Low priority reference information for record verification."
                    tone="slate"
                  >
                    <InfoGrid
                      items={[
                        ["Application ID", item._applicationId],
                        ["Founder Name", getFounderName(item)],
                        ["Startup Name", getStartupName(item)],
                        ["Aadhar Number", item?.userSignup?.aadharNumber],
                        [
                          "Application Type",
                          item?.userSignup?.applicationType ||
                            item?.applicationType,
                        ],
                        ["Status", item._status],
                        ["Submitted", submitted],
                        ["Registered Entity", hasEntity ? "Yes" : "No"],
                      ]}
                    />
                  </SectionShell>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AIEvaluationModal
        open={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        startupId={startupId}
        startupName={startupName}
        application={item}
      />
    </>
  );
}