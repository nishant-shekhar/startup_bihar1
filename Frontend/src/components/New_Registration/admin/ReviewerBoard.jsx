import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { get, ref } from "firebase/database";
import {
  X,
  Search,
  RefreshCw,
  LogOut,
  LockKeyhole,
  UserRound,
  FileText,
  Building2,
  Clock3,
  CheckCircle2,
  Star,
  Bot,
  Lightbulb,
  Rocket,
  Users,
  BadgeCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  IdCard,
  ShieldCheck,
  Moon,
  Sun,
} from "lucide-react";

import { db, rtdb } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import AIEvaluationModal from "./AIEvaluationModal";

const PAGE_SIZE = 25;

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const yesNo = (value) => (value ? "Yes" : "No");

const normalizeNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

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

const getStatus = (item) =>
  item?.status ||
  item?.applicationStatus ||
  item?.reviewStatus ||
  item?.documentStatus ||
  "submitted";

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
  item?.companyName ||
  "-";

const getFounderName = (item) =>
  item?.userSignup?.founderName ||
  item?.basicDetails?.fullName ||
  item?.founderName ||
  item?.founder_name ||
  item?.name ||
  "-";

const getEmail = (item) =>
  item?.userSignup?.email ||
  item?.email ||
  item?.basicDetails?.email ||
  "-";

const getPhone = (item) =>
  item?.userSignup?.phoneNumber ||
  item?.phoneNumber ||
  item?.mobile ||
  "-";

const getDistrict = (item) =>
  item?.basicDetails?.district ||
  item?.district ||
  item?.registeredDistrict ||
  item?.districtRoc ||
  item?.startupDistrict ||
  item?.entityDetails?.district ||
  "-";

const getCategory = (item) =>
  item?.startupDetails?.sector ||
  item?.basicDetails?.category ||
  item?.category ||
  item?.sector ||
  item?.startupCategory ||
  "-";

const getStage = (item) => item?.startupDetails?.stage || item?.stage || "-";

const hasRegisteredCompany = (item) =>
  !!(
    item?.entityDetails?.hasRegisteredEntity ||
    item?._registeredCompany ||
    item?.cin ||
    item?.registrationNumber ||
    item?.registration_no ||
    item?.entityType ||
    item?.entityDetails?.entityRegistrationNumber
  );

const getAIScore = (item) => {
  return normalizeNumber(item?.aiEvaluation?.finalScore);
};

function ThemeToggle({ darkMode, setDarkMode }) {
  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("expertReviewerTheme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black shadow-sm transition ${
        darkMode
          ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
          : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
      }`}
    >
      {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      {darkMode ? "Light Theme" : "Dark Theme"}
    </button>
  );
}

function StatusBadge({ status, darkMode = false }) {
  const base = "inline-flex rounded-full border px-3 py-1 text-xs font-semibold";

  if (darkMode) {
    const darkMap = {
      submitted: "border-sky-400/30 bg-sky-400/10 text-sky-200",
      Submitted: "border-sky-400/30 bg-sky-400/10 text-sky-200",
      "Under Review": "border-amber-400/30 bg-amber-400/10 text-amber-200",
      Approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
      Rejected: "border-rose-400/30 bg-rose-400/10 text-rose-200",
      draft: "border-slate-400/25 bg-slate-400/10 text-slate-300",
      Draft: "border-slate-400/25 bg-slate-400/10 text-slate-300",
    };

    return (
      <span className={`${base} ${darkMap[status] || darkMap.draft}`}>
        {safe(status)}
      </span>
    );
  }

  const statusMap = {
    submitted: "border-sky-200 bg-sky-50 text-sky-700",
    Submitted: "border-sky-200 bg-sky-50 text-sky-700",
    "Under Review": "border-amber-200 bg-amber-50 text-amber-700",
    Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Rejected: "border-rose-200 bg-rose-50 text-rose-700",
    draft: "border-slate-200 bg-slate-100 text-slate-700",
    Draft: "border-slate-200 bg-slate-100 text-slate-700",
  };

  return (
    <span className={`${base} ${statusMap[status] || statusMap.draft}`}>
      {safe(status)}
    </span>
  );
}

function RegisteredBadge({ value, darkMode = false }) {
  if (darkMode) {
    return value ? (
      <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
        Registered: Yes
      </span>
    ) : (
      <span className="inline-flex rounded-full border border-slate-400/25 bg-slate-400/10 px-3 py-1 text-xs font-semibold text-slate-300">
        Registered: No
      </span>
    );
  }

  return value ? (
    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      Registered: Yes
    </span>
  ) : (
    <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      Registered: No
    </span>
  );
}

function ReviewBadge({ children, tone = "slate", darkMode = false }) {
  const base =
    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shadow-sm";

  if (darkMode) {
    const darkMap = {
      slate: "border-slate-500/30 bg-slate-500/10 text-slate-200",
      amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
      emerald: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
      indigo: "border-indigo-400/30 bg-indigo-400/10 text-indigo-200",
      cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
      rose: "border-rose-400/30 bg-rose-400/10 text-rose-200",
    };

    return <span className={`${base} ${darkMap[tone] || darkMap.slate}`}>{children}</span>;
  }

  const toneMap = {
    slate: "border-slate-200 bg-white text-slate-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return <span className={`${base} ${toneMap[tone] || toneMap.slate}`}>{children}</span>;
}

function LinkValue({ value, darkMode = false }) {
  if (!value || value === "-") return <>{safe(value)}</>;

  const raw = String(value).trim();
  const href =
    raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 break-all underline-offset-4 transition hover:underline ${
        darkMode ? "text-cyan-200 hover:text-cyan-100" : "text-cyan-700 hover:text-cyan-900"
      }`}
    >
      {raw}
      <ExternalLink size={13} />
    </a>
  );
}

function LoginScreen({ onLogin, darkMode, setDarkMode }) {
  const [expertId, setExpertId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitLogin = async (e) => {
    e.preventDefault();
    setError("");

    const cleanId = expertId.trim();
    const cleanPassword = password.trim();

    if (!cleanId || !cleanPassword) {
      setError("Please enter reviewer ID and password.");
      return;
    }

    try {
      setLoading(true);
      const adminSnap = await get(ref(rtdb, `Admin/${cleanId}`));

      if (!adminSnap.exists()) {
        setError("Invalid reviewer ID or password.");
        return;
      }

      const adminData = adminSnap.val() || {};
      const isExpert = String(adminData?.type || "").toLowerCase() === "expert";
      const passwordMatches = String(adminData?.password || "") === cleanPassword;
      const isBlocked = adminData?.active === false || adminData?.disabled === true;

      if (!isExpert || !passwordMatches || isBlocked) {
        setError("Invalid reviewer ID or password.");
        return;
      }

      const session = {
        id: cleanId,
        type: adminData.type || "Expert",
        name: adminData.name || cleanId,
        loginAt: new Date().toISOString(),
      };

      localStorage.setItem("expertReviewerSession", JSON.stringify(session));
      onLogin(session);
    } catch (error) {
      console.error("Expert login failed", error);
      setError("Unable to verify login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg1.jpg')" }}
    >
      <div
        className={`absolute inset-0 backdrop-blur-[2px] ${
          darkMode
            ? "bg-gradient-to-br from-slate-950/96 via-indigo-950/92 to-cyan-950/90"
            : "bg-gradient-to-br from-slate-950/88 via-indigo-950/82 to-cyan-950/76"
        }`}
      />
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-indigo-500/25 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div
          className={`grid w-full max-w-5xl overflow-hidden rounded-[34px] border shadow-[0_40px_120px_rgba(2,6,23,0.45)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr] ${
            darkMode ? "border-white/10 bg-slate-950/92" : "border-white/20 bg-white/95"
          }`}
        >
          <div className="hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-cyan-950 p-8 text-white lg:block">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-cyan-100">
              <ShieldCheck size={26} />
            </div>
            <h1 className="mt-8 max-w-md text-4xl font-black tracking-tight">
              Startup Bihar Expert Review Board
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/72">
              Secure access for expert reviewers to examine assigned applications, submit
              score, and view AI evaluation only after expert scoring.
            </p>

            <div className="mt-10 grid gap-3">
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100/80">
                  Credential Source
                </div>
                <div className="mt-1 text-sm text-white/90">Realtime Database /Admin</div>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/8 p-4">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100/80">
                  Access Type
                </div>
                <div className="mt-1 text-sm text-white/90">Expert reviewer access</div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <div className="lg:hidden">
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
                    darkMode ? "bg-white/10 text-white" : "bg-slate-950 text-white"
                  }`}
                >
                  <ShieldCheck size={22} />
                </div>
              </div>
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>

            <div className="mt-5 lg:mt-6">
              <div
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                  darkMode
                    ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-200"
                    : "border-cyan-200 bg-cyan-50 text-cyan-700"
                }`}
              >
                Expert Login
              </div>
              <h2
                className={`mt-3 text-2xl font-black tracking-tight ${
                  darkMode ? "text-white" : "text-slate-950"
                }`}
              >
                Verify Reviewer Access
              </h2>
              <p className={`mt-2 text-sm leading-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Use your reviewer ID and password.
              </p>
            </div>

            <form onSubmit={submitLogin} className="mt-7">
              <label
                className={`mb-2 block text-sm font-bold ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                Reviewer ID
              </label>
              <div className="relative">
                <UserRound
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={expertId}
                  onChange={(e) => setExpertId(e.target.value)}
                  placeholder="Reviewer ID"
                  autoComplete="username"
                  className={`w-full rounded-2xl border px-4 py-3 pl-11 text-sm font-semibold outline-none transition ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:bg-white/8 focus:ring-4 focus:ring-cyan-400/10"
                      : "border-slate-200 bg-slate-50 text-slate-800 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  }`}
                />
              </div>

              <label
                className={`mb-2 mt-5 block text-sm font-bold ${
                  darkMode ? "text-slate-200" : "text-slate-700"
                }`}
              >
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className={`w-full rounded-2xl border px-4 py-3 pl-11 text-sm font-semibold outline-none transition ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:bg-white/8 focus:ring-4 focus:ring-cyan-400/10"
                      : "border-slate-200 bg-slate-50 text-slate-800 focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  }`}
                />
              </div>

              {error ? (
                <div
                  className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    darkMode
                      ? "border-rose-400/25 bg-rose-400/10 text-rose-200"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-cyan-900 px-5 py-3 text-sm font-black text-white shadow-[0_18px_40px_rgba(15,23,42,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LockKeyhole size={16} />
                {loading ? "Verifying..." : "Open Reviewer Board"}
              </button>

              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-xs leading-5 ${
                  darkMode
                    ? "border-white/10 bg-white/5 text-slate-400"
                    : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                Password is verified from RTDB, not hardcoded in this component.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, title, value, subtitle, tone = "slate", darkMode = false }) {
  if (darkMode) {
    const darkToneMap = {
      slate: "from-slate-900/92 via-slate-950/90 to-slate-900/80",
      cyan: "from-cyan-950/55 via-slate-950/90 to-slate-900/80",
      emerald: "from-emerald-950/50 via-slate-950/90 to-slate-900/80",
      amber: "from-amber-950/45 via-slate-950/90 to-slate-900/80",
      indigo: "from-indigo-950/60 via-slate-950/90 to-slate-900/80",
    };

    return (
      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <div className={`rounded-[22px] bg-gradient-to-br ${darkToneMap[tone]} p-5`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {title}
              </div>
              <div className="mt-2 text-3xl font-black text-white">{value}</div>
              <div className="mt-2 text-sm text-slate-400">{subtitle}</div>
            </div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-cyan-100">
              <Icon size={18} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const toneMap = {
    slate: "from-white via-white to-slate-50",
    cyan: "from-cyan-50 via-white to-sky-50",
    emerald: "from-emerald-50 via-white to-teal-50",
    amber: "from-amber-50 via-white to-orange-50",
    indigo: "from-indigo-50 via-white to-violet-50",
  };

  return (
    <div className="rounded-[28px] border border-white/85 bg-white/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className={`rounded-[22px] bg-gradient-to-br ${toneMap[tone]} p-5`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {title}
            </div>
            <div className="mt-2 text-3xl font-black text-slate-950">{value}</div>
            <div className="mt-2 text-sm text-slate-500">{subtitle}</div>
          </div>
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Icon size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

function IconLabel({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.07] px-4 py-3">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-cyan-50/60">
        <Icon size={13} />
        {label}
      </div>

      <div className="mt-2 break-words text-sm font-semibold text-white">
        {safe(value)}
      </div>
    </div>
  );
}

function SectionShell({
  id,
  icon: Icon,
  title,
  subtitle,
  children,
  tone = "slate",
  darkMode = false,
}) {
  if (darkMode) {
    const darkToneMap = {
      slate: "from-slate-900/92 via-slate-950/88 to-slate-900/85",
      warm: "from-amber-950/30 via-slate-950/90 to-slate-900/85",
      indigo: "from-indigo-950/40 via-slate-950/90 to-cyan-950/20",
      emerald: "from-emerald-950/30 via-slate-950/90 to-teal-950/20",
      violet: "from-violet-950/35 via-slate-950/90 to-indigo-950/25",
      cyan: "from-cyan-950/35 via-slate-950/90 to-sky-950/20",
    };

    return (
      <section
        id={id}
        className="scroll-mt-6 rounded-[30px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-5"
      >
        <div className={`rounded-[24px] bg-gradient-to-br ${darkToneMap[tone]} p-5`}>
          <div className="flex items-start gap-3 border-b border-white/10 pb-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-100 shadow-[0_12px_30px_rgba(0,0,0,0.20)]">
              <Icon size={18} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">{subtitle}</p>
            </div>
          </div>
          <div className="mt-5">{children}</div>
        </div>
      </section>
    );
  }

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
      <div className={`rounded-[24px] bg-gradient-to-br ${toneMap[tone] || toneMap.slate} p-5`}>
        <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]">
            <Icon size={18} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
          </div>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </section>
  );
}

function NarrativeReviewCard({ number, title, value, tone = "amber", darkMode = false }) {
  const toneMap = {
    amber: "from-amber-500 to-orange-500",
    indigo: "from-indigo-500 to-cyan-500",
    emerald: "from-emerald-500 to-teal-500",
    violet: "from-violet-500 to-indigo-500",
  };

  return (
    <div
      className={`rounded-[24px] p-5 shadow-sm transition ${
        darkMode
          ? "border border-white/10 bg-white/[0.05] hover:border-cyan-400/25"
          : "border border-slate-100 bg-white/94 hover:border-cyan-100 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-white shadow-sm ${
            toneMap[tone] || toneMap.amber
          }`}
        >
          {number}
        </div>
        <div className="min-w-0 flex-1">
          <div
            className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </div>
          <div
            className={`mt-3 whitespace-pre-wrap break-words text-[15px] leading-7 ${
              darkMode ? "text-slate-200" : "text-slate-800"
            }`}
          >
            {safe(value)}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoGrid({ items, darkMode = false }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map(([label, value]) => (
        <InfoCell key={label} label={label} value={value} darkMode={darkMode} />
      ))}
    </div>
  );
}

function InfoCell({ label, value, darkMode = false }) {
  const isLink = label === "Website" || label === "LinkedIn Profile";

  return (
    <div
      className={`rounded-[20px] px-4 py-4 shadow-sm transition ${
        darkMode
          ? "border border-white/10 bg-white/[0.05] hover:border-cyan-400/25"
          : "border border-slate-100 bg-white/90 hover:border-cyan-100"
      }`}
    >
      <div
        className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-2 break-words text-sm font-semibold leading-6 ${
          darkMode ? "text-slate-200" : "text-slate-800"
        }`}
      >
        {isLink ? <LinkValue value={value} darkMode={darkMode} /> : safe(value)}
      </div>
    </div>
  );
}

function WideInfoCell({ label, value, darkMode = false }) {
  const isLink = label === "Website" || label === "LinkedIn Profile";

  return (
    <div
      className={`rounded-[22px] px-5 py-4 shadow-sm transition ${
        darkMode
          ? "border border-white/10 bg-white/[0.05] hover:border-cyan-400/25"
          : "border border-slate-100 bg-white/90 hover:border-cyan-100"
      }`}
    >
      <div
        className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-3 whitespace-pre-wrap break-words text-sm leading-6 ${
          darkMode ? "text-slate-200" : "text-slate-800"
        }`}
      >
        {isLink ? <LinkValue value={value} darkMode={darkMode} /> : safe(value)}
      </div>
    </div>
  );
}

function ActionDocumentCard({
  title,
  meta,
  icon: Icon = FileText,
  tone = "violet",
  darkMode = false,
}) {
  const fileName = meta?.fileName || "-";
  const link = meta?.downloadURL || "";

  const lightToneMap = {
    violet: "from-violet-50/85 via-white to-indigo-50/70",
    amber: "from-amber-50/85 via-white to-orange-50/70",
    emerald: "from-emerald-50/85 via-white to-teal-50/70",
    cyan: "from-cyan-50/85 via-white to-sky-50/70",
    slate: "from-slate-50 via-white to-slate-100",
  };

  const darkToneMap = {
    violet: "from-violet-950/35 via-slate-950/70 to-indigo-950/25",
    amber: "from-amber-950/30 via-slate-950/70 to-orange-950/20",
    emerald: "from-emerald-950/30 via-slate-950/70 to-teal-950/20",
    cyan: "from-cyan-950/30 via-slate-950/70 to-sky-950/20",
    slate: "from-slate-900 via-slate-950 to-slate-900",
  };

  return (
    <div
      className={`rounded-[24px] border bg-gradient-to-br p-4 shadow-sm ${
        darkMode
          ? `border-white/10 ${darkToneMap[tone] || darkToneMap.violet}`
          : `border-slate-100 ${lightToneMap[tone] || lightToneMap.violet}`
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
            darkMode
              ? "bg-white/10 text-cyan-100"
              : "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white"
          }`}
        >
          <Icon size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {title}
          </div>
          <div
            className={`mt-2 break-words text-sm font-semibold leading-6 ${
              darkMode ? "text-slate-200" : "text-slate-800"
            }`}
          >
            {fileName}
          </div>

          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className={`mt-3 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm transition ${
                darkMode
                  ? "border-white/10 bg-white/8 text-cyan-100 hover:border-cyan-400/25 hover:bg-cyan-400/10"
                  : "border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
              }`}
            >
              Open File
              <ExternalLink size={14} />
            </a>
          ) : (
            <div className={`mt-3 text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
              No file uploaded
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UtilityRail({ children, darkMode = false }) {
  return (
    <aside
      className={`rounded-[30px] p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ${
        darkMode ? "border border-white/10 bg-white/[0.04]" : "border border-white/85 bg-white/82"
      }`}
    >
      <div className={`mb-5 border-b pb-4 ${darkMode ? "border-white/10" : "border-slate-100"}`}>
        <h3 className={`text-lg font-black ${darkMode ? "text-white" : "text-slate-900"}`}>
          Review Utility
        </h3>
        <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Important files and quick review data.
        </p>
      </div>
      <div className="space-y-4">{children}</div>
    </aside>
  );
}

function UtilityFact({ label, value, darkMode = false }) {
  const isLink = label === "Website";

  return (
    <div
      className={`rounded-[18px] border px-4 py-3 transition ${
        darkMode
          ? "border-white/10 bg-white/[0.05] hover:border-cyan-400/25"
          : "border-slate-100 bg-slate-50/95 hover:border-cyan-100 hover:bg-white"
      }`}
    >
      <div
        className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-1 break-words text-sm font-semibold ${
          darkMode ? "text-slate-200" : "text-slate-800"
        }`}
      >
        {isLink ? <LinkValue value={value} darkMode={darkMode} /> : safe(value)}
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
  canViewAI,
  darkMode = false,
}) {
  return (
    <div className="sticky top-4 space-y-4">
      <div className="overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white shadow-[0_24px_70px_rgba(15,23,42,0.30)]">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.16),transparent_25%),radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_30%)] p-4">
          <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            {profilePhoto ? (
              <img src={profilePhoto} alt={founderName} className="h-[260px] w-full object-cover" />
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
            <div className="mt-1 text-lg font-semibold text-white">{safe(founderName)}</div>
          </div>

          <div className="mt-4 grid gap-3">
            <IconLabel icon={Mail} label="Email" value={email} />
            <IconLabel icon={Phone} label="Mobile" value={phone} />
            <IconLabel icon={MapPin} label="District" value={district} />
            <IconLabel icon={Rocket} label="Stage" value={stage} />
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
        disabled={!canViewAI}
        onClick={onAI}
        className={`flex w-full items-center justify-center gap-2 rounded-[22px] border px-4 py-3 text-sm font-bold shadow-sm transition ${
          canViewAI
            ? darkMode
              ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/15"
              : "border-cyan-200 bg-gradient-to-r from-cyan-50 to-indigo-50 text-cyan-700 hover:border-cyan-300 hover:from-cyan-100 hover:to-indigo-100"
            : darkMode
            ? "cursor-not-allowed border-white/10 bg-white/5 text-slate-500"
            : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
        }`}
      >
        <Bot size={17} />
        {canViewAI ? "View AI Evaluation" : "Score First to Unlock AI"}
      </button>
    </div>
  );
}

function FeedbackMiniPanel({ feedback, darkMode = false }) {
  const hasFeedback = feedback?.submitted === true;

  if (!hasFeedback) {
    return (
      <div
        className={`rounded-[20px] border px-4 py-4 text-sm ${
          darkMode
            ? "border-white/10 bg-white/[0.05] text-slate-400"
            : "border-slate-200 bg-slate-50 text-slate-500"
        }`}
      >
        No website feedback submitted yet.
      </div>
    );
  }

  return (
    <div
      className={`rounded-[22px] border p-4 ${
        darkMode
          ? "border-emerald-400/20 bg-emerald-400/10"
          : "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div
            className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
              darkMode ? "text-emerald-200" : "text-emerald-700"
            }`}
          >
            Website Feedback
          </div>
          <div className={`mt-1 text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            {safe(feedback?.experience)}
          </div>
        </div>

        <div
          className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${
            darkMode
              ? "border-amber-400/25 bg-amber-400/10 text-amber-200"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          <Star size={13} className="fill-amber-400 text-amber-400" />
          {safe(feedback?.rating)}/5
        </div>
      </div>

      {feedback?.message ? (
        <div
          className={`mt-3 whitespace-pre-wrap break-words rounded-[18px] border px-4 py-3 text-sm leading-6 ${
            darkMode
              ? "border-white/10 bg-white/[0.05] text-slate-200"
              : "border-white bg-white/75 text-slate-700"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}
    </div>
  );
}

function CofounderList({ coFounders, isSoleFounder, darkMode = false }) {
  if (isSoleFounder) {
    return (
      <div
        className={`rounded-[22px] border px-5 py-4 text-sm font-medium ${
          darkMode
            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
            : "border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800"
        }`}
      >
        This startup has been marked as a sole-founder venture.
      </div>
    );
  }

  if (!coFounders.length) {
    return (
      <div
        className={`rounded-[22px] border px-5 py-4 text-sm ${
          darkMode
            ? "border-white/10 bg-white/[0.05] text-slate-400"
            : "border-slate-200 bg-slate-50 text-slate-500"
        }`}
      >
        No co-founder details added.
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {coFounders.map((coFounder, index) => (
        <div
          key={index}
          className={`rounded-[24px] border p-4 shadow-sm ${
            darkMode ? "border-white/10 bg-white/[0.05]" : "border-slate-200 bg-white/90"
          }`}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
              Co-Founder {index + 1}
            </div>
            <ReviewBadge tone="indigo" darkMode={darkMode}>
              Team Member
            </ReviewBadge>
          </div>

          <div className="space-y-3">
            <InfoCell label="Name" value={coFounder?.name} darkMode={darkMode} />
            <InfoCell label="Email" value={coFounder?.email} darkMode={darkMode} />
            <InfoCell label="Phone Number" value={coFounder?.phoneNumber} darkMode={darkMode} />
            <InfoCell label="Qualification" value={coFounder?.qualification} darkMode={darkMode} />
            <WideInfoCell
              label="LinkedIn Profile"
              value={coFounder?.linkedinProfile}
              darkMode={darkMode}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ScorePanel({
  review,
  score,
  setScore,
  comment,
  setComment,
  saving,
  onSave,
  darkMode = false,
}) {
  const alreadyScored = !!review?.score;

  return (
    <div
      className={`rounded-[30px] border p-5 shadow-[0_22px_70px_rgba(15,23,42,0.10)] ${
        darkMode ? "border-white/10 bg-slate-950/70" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${
              darkMode
                ? "border-indigo-400/25 bg-indigo-400/10 text-indigo-200"
                : "border-indigo-200 bg-indigo-50 text-indigo-700"
            }`}
          >
            <Star size={13} />
            Expert Score
          </div>
          <h3 className={`mt-3 text-xl font-black ${darkMode ? "text-white" : "text-slate-950"}`}>
            {alreadyScored ? "Score Submitted" : "Submit Score"}
          </h3>
          <p className={`mt-1 text-sm leading-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Submit your independent score first. AI evaluation will be available only after score submission.
          </p>
        </div>

        {alreadyScored ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
              darkMode
                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            Score: {review.score}/10
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr_auto]">
        <div>
          <label
            className={`mb-2 block text-xs font-bold uppercase tracking-[0.16em] ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Score out of 10
          </label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="0 - 10"
            className={`w-full rounded-2xl border px-4 py-3 text-sm font-bold outline-none transition ${
              darkMode
                ? "border-white/10 bg-white/[0.05] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-400/10"
                : "border-slate-200 bg-slate-50 text-slate-800 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            }`}
          />
        </div>

        <div>
          <label
            className={`mb-2 block text-xs font-bold uppercase tracking-[0.16em] ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Comment
          </label>
          <textarea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write expert observation..."
            className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition ${
              darkMode
                ? "border-white/10 bg-white/[0.05] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-400/10"
                : "border-slate-200 bg-slate-50 text-slate-800 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            }`}
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex h-[48px] items-center justify-center rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-cyan-900 px-5 text-sm font-black text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : alreadyScored ? "Revise Score" : "Save Score"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({
  open,
  onClose,
  application,
  reviewerId,
  onReviewSaved,
  darkMode = false,
}) {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [review, setReview] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [saving, setSaving] = useState(false);

  const item = application || {};
  const appDocId = item?.id || item?._docId || "";
  const startupId = item?._applicationId || item?.applicationId || appDocId || "";

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
  const hasEntity = hasRegisteredCompany(item);

  const institutionValue =
    item?.basicDetails?.institution === "Other"
      ? item?.basicDetails?.otherInstitution
      : item?.basicDetails?.institution;

  const canViewAI = !!review?.score;

  useEffect(() => {
    const loadReview = async () => {
      if (!open || !appDocId) return;

      try {
        setLoadingReview(true);
        const reviewRef = doc(db, "startupApplications", appDocId, "review", "expert");
        const snap = await getDoc(reviewRef);

        if (snap.exists()) {
          const data = snap.data();
          setReview(data);
          setScore(data?.score ?? "");
          setComment(data?.comment ?? "");
        } else {
          setReview(null);
          setScore("");
          setComment("");
        }
      } catch (error) {
        console.error("Failed to load expert review", error);
      } finally {
        setLoadingReview(false);
      }
    };

    loadReview();
  }, [open, appDocId]);

  const saveExpertReview = async () => {
    const numericScore = Number(score);

    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 10) {
      alert("Please enter a valid score between 0 and 10.");
      return;
    }

    if (!comment.trim()) {
      alert("Please add a short comment.");
      return;
    }

    try {
      setSaving(true);

      const reviewRef = doc(db, "startupApplications", appDocId, "review", "expert");

      const previousScore = Number(review?.score);
      const alreadyScored = !!review?.score;
      const scoreChanged =
        alreadyScored && Number.isFinite(previousScore) && previousScore !== numericScore;
      const viewedAI = review?.aiEvaluationViewed === true;

      let payload = {
        reviewerId: reviewerId || "unknownExpert",
        reviewerType: "expertReviewer",
        score: numericScore,
        comment: comment.trim(),
        updatedAt: serverTimestamp(),
      };

      if (!alreadyScored) {
        payload = {
          ...payload,
          firstScore: numericScore,
          firstComment: comment.trim(),
          firstSubmittedAt: serverTimestamp(),
          scoreSubmitted: true,
          aiEvaluationAllowed: true,
          scoreRevised: false,
        };
      } else {
        payload = {
          ...payload,
          firstScore: review.firstScore ?? review.score,
          firstComment: review.firstComment || review.comment || "",
          firstSubmittedAt: review.firstSubmittedAt || null,
          scoreRevised: scoreChanged || review?.scoreRevised === true,
          lastRevisedAt: scoreChanged ? serverTimestamp() : review?.lastRevisedAt || null,
          previousScore: scoreChanged ? previousScore : review?.previousScore ?? null,
          previousComment: scoreChanged ? review?.comment || "" : review?.previousComment || "",
          scoreChangedAfterAIView:
            viewedAI && scoreChanged ? true : review?.scoreChangedAfterAIView === true,
          scoreChangedAfterAIViewAt:
            viewedAI && scoreChanged ? serverTimestamp() : review?.scoreChangedAfterAIViewAt || null,
        };
      }

      await setDoc(reviewRef, payload, { merge: true });

      const freshSnap = await getDoc(reviewRef);
      const freshReview = freshSnap.exists() ? freshSnap.data() : payload;

      setReview(freshReview);
      onReviewSaved?.(appDocId, freshReview);
      alert(!review?.score ? "Score saved. AI evaluation is now available." : "Score revised successfully.");
    } catch (error) {
      console.error("Failed to save expert review", error);
      alert("Unable to save expert review.");
    } finally {
      setSaving(false);
    }
  };

  const openAIWithTracking = async () => {
    if (!canViewAI) return;

    setIsAIModalOpen(true);

    if (review?.aiEvaluationViewed === true || !appDocId) return;

    try {
      const reviewRef = doc(db, "startupApplications", appDocId, "review", "expert");
      await setDoc(
        reviewRef,
        {
          aiEvaluationViewed: true,
          aiEvaluationViewedAt: serverTimestamp(),
          aiEvaluationViewedBy: reviewerId || "unknownExpert",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const freshSnap = await getDoc(reviewRef);
      if (freshSnap.exists()) {
        const freshReview = freshSnap.data();
        setReview(freshReview);
        onReviewSaved?.(appDocId, freshReview);
      }
    } catch (error) {
      console.error("Failed to mark AI evaluation viewed", error);
    }
  };

  if (!open || !application) return null;

  return (
    <>
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/82 p-3 backdrop-blur-md md:p-6">
        <div
          className={`relative max-h-[94vh] w-full max-w-[1500px] overflow-hidden rounded-[38px] border shadow-[0_44px_130px_rgba(2,6,23,0.50)] ${
            darkMode ? "border-white/10 bg-slate-950" : "border-white/20 bg-[#f7f9fc]"
          }`}
        >
          <div
            className={`absolute inset-0 ${
              darkMode
                ? "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.10),transparent_18%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_23%),linear-gradient(to_bottom,rgba(2,6,23,0.94),rgba(15,23,42,0.98))]"
                : "bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_18%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_23%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.10),transparent_21%),linear-gradient(to_bottom,rgba(255,255,255,0.90),rgba(255,255,255,0.98))]"
            }`}
          />

          <div className="relative flex max-h-[94vh] flex-col">
            <div
              className={`border-b px-5 py-4 backdrop-blur-xl md:px-7 ${
                darkMode ? "border-white/10 bg-white/[0.04]" : "border-white/70 bg-white/78"
              }`}
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="min-w-0">
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] shadow-sm ${
                      darkMode
                        ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-200"
                        : "border-cyan-200 bg-cyan-50 text-cyan-700"
                    }`}
                  >
                    <ShieldCheck size={13} />
                    Expert Review
                  </div>

                  <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-center">
                    <h2
                      className={`truncate text-[28px] font-black tracking-tight ${
                        darkMode ? "text-white" : "text-slate-950"
                      }`}
                    >
                      {startupName}
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={item._status} darkMode={darkMode} />
                      <ReviewBadge darkMode={darkMode}>ID: {safe(item._applicationId)}</ReviewBadge>
                      <RegisteredBadge value={item._registeredCompany} darkMode={darkMode} />
                      {review?.score ? (
                        <ReviewBadge tone="emerald" darkMode={darkMode}>
                          Scored
                        </ReviewBadge>
                      ) : (
                        <ReviewBadge tone="amber" darkMode={darkMode}>
                          Pending Score
                        </ReviewBadge>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition hover:scale-[1.02] ${
                    darkMode
                      ? "border-white/10 bg-white/8 text-white hover:bg-white/12"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="relative overflow-auto px-4 py-4 md:px-7 md:py-6">
              <div className="mb-5">
                {loadingReview ? (
                  <div
                    className={`rounded-[28px] border p-5 text-sm ${
                      darkMode
                        ? "border-white/10 bg-white/[0.04] text-slate-400"
                        : "border-white/85 bg-white/82 text-slate-500"
                    }`}
                  >
                    Loading expert review...
                  </div>
                ) : (
                  <ScorePanel
                    review={review}
                    score={score}
                    setScore={setScore}
                    comment={comment}
                    setComment={setComment}
                    saving={saving}
                    onSave={saveExpertReview}
                    darkMode={darkMode}
                  />
                )}
              </div>

              <div className="grid gap-5 xl:grid-cols-[300px_1fr]">
                <ProfileRail
                  profilePhoto={profilePhoto}
                  profilePhotoName={profilePhotoName}
                  founderName={founderName}
                  email={email}
                  phone={phone}
                  district={district}
                  stage={stage}
                  onAI={openAIWithTracking}
                  canViewAI={canViewAI}
                  darkMode={darkMode}
                />

                <div className="space-y-5">
                  <div className="grid gap-5 2xl:grid-cols-[1fr_380px]">
                    <SectionShell
                      id="review-business-idea"
                      icon={Lightbulb}
                      title="Business Idea"
                      subtitle="Primary evaluation area. Review this before opening AI evaluation."
                      tone="warm"
                      darkMode={darkMode}
                    >
                      <div className="grid gap-4">
                        <NarrativeReviewCard
                          number="1"
                          title="Problem Statement"
                          value={item?.businessIdea?.problemStatement}
                          tone="amber"
                          darkMode={darkMode}
                        />
                        <NarrativeReviewCard
                          number="2"
                          title="Solution"
                          value={item?.businessIdea?.solution}
                          tone="indigo"
                          darkMode={darkMode}
                        />
                        <NarrativeReviewCard
                          number="3"
                          title="Innovation"
                          value={item?.businessIdea?.innovation}
                          tone="emerald"
                          darkMode={darkMode}
                        />
                        <NarrativeReviewCard
                          number="4"
                          title="Business Model"
                          value={item?.businessIdea?.businessModel}
                          tone="violet"
                          darkMode={darkMode}
                        />
                      </div>
                    </SectionShell>

                    <div className="space-y-5 2xl:sticky 2xl:top-4 2xl:self-start">
                      <UtilityRail darkMode={darkMode}>
                        <ActionDocumentCard
                          title="Pitch Deck"
                          meta={item?.businessIdea?.pitchDeckMeta}
                          icon={FileText}
                          tone="violet"
                          darkMode={darkMode}
                        />

                        <div className="grid gap-3">
                          <UtilityFact
                            label="Sector"
                            value={item?.startupDetails?.sector || category}
                            darkMode={darkMode}
                          />
                          <UtilityFact
                            label="Stage"
                            value={item?.startupDetails?.stage || stage}
                            darkMode={darkMode}
                          />
                          <UtilityFact
                            label="Team Size"
                            value={item?.startupDetails?.teamSize}
                            darkMode={darkMode}
                          />
                          <UtilityFact
                            label="Website"
                            value={item?.startupDetails?.website}
                            darkMode={darkMode}
                          />
                          <UtilityFact label="Submitted" value={submitted} darkMode={darkMode} />
                          <UtilityFact
                            label="Registered Entity"
                            value={hasEntity ? "Yes" : "No"}
                            darkMode={darkMode}
                          />
                        </div>

                        {hasEntity ? (
                          <ActionDocumentCard
                            title="Entity Certificate"
                            meta={item?.entityDetails?.certificateMeta}
                            icon={BadgeCheck}
                            tone="emerald"
                            darkMode={darkMode}
                          />
                        ) : null}

                        <FeedbackMiniPanel feedback={feedback} darkMode={darkMode} />
                      </UtilityRail>
                    </div>
                  </div>

                  <SectionShell
                    id="review-founder"
                    icon={UserRound}
                    title="Founder Profile"
                    subtitle="Applicant identity, contact details, education, and address."
                    tone="slate"
                    darkMode={darkMode}
                  >
                    <InfoGrid
                      darkMode={darkMode}
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
                        darkMode={darkMode}
                      />
                    </div>
                  </SectionShell>

                  <SectionShell
                    id="review-entity"
                    icon={Building2}
                    title="Entity Details"
                    subtitle="Company registration details and official business information."
                    tone="indigo"
                    darkMode={darkMode}
                  >
                    {!hasEntity ? (
                      <div
                        className={`rounded-[22px] border px-5 py-4 text-sm ${
                          darkMode
                            ? "border-white/10 bg-white/[0.05] text-slate-400"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}
                      >
                        No registered entity has been added in this application.
                      </div>
                    ) : (
                      <>
                        <InfoGrid
                          darkMode={darkMode}
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

                        <div className="mt-3">
                          <WideInfoCell
                            label="Business Address"
                            value={item?.entityDetails?.businessAddress}
                            darkMode={darkMode}
                          />
                        </div>

                        <div className="mt-3">
                          <ActionDocumentCard
                            title="Certificate"
                            meta={item?.entityDetails?.certificateMeta}
                            icon={BadgeCheck}
                            tone="emerald"
                            darkMode={darkMode}
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
                    darkMode={darkMode}
                  >
                    <CofounderList
                      coFounders={coFounders}
                      isSoleFounder={isSoleFounder}
                      darkMode={darkMode}
                    />
                  </SectionShell>

                  <SectionShell
                    id="review-metadata"
                    icon={IdCard}
                    title="Registration Metadata"
                    subtitle="Low-priority reference information for record verification."
                    tone="slate"
                    darkMode={darkMode}
                  >
                    <InfoGrid
                      darkMode={darkMode}
                      items={[
                        ["Application ID", item._applicationId],
                        ["Founder Name", getFounderName(item)],
                        ["Startup Name", getStartupName(item)],
                        ["Aadhar Number", item?.userSignup?.aadharNumber],
                        ["Application Type", item?.userSignup?.applicationType || item?.applicationType],
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

export default function ReviewerBoard() {
  const getSavedSession = () => {
    try {
      return JSON.parse(localStorage.getItem("expertReviewerSession") || "null");
    } catch {
      return null;
    }
  };

  const getSavedTheme = () => {
    const saved = localStorage.getItem("expertReviewerTheme");
    return saved === "dark";
  };

  const savedSession = getSavedSession();

  const [darkMode, setDarkMode] = useState(getSavedTheme);
  const [loggedIn, setLoggedIn] = useState(!!savedSession?.id);
  const [reviewer, setReviewer] = useState(savedSession || null);

  const [rows, setRows] = useState([]);
  const [internalThreshold, setInternalThreshold] = useState(7.5);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [registeredFilter, setRegisteredFilter] = useState("All");
  const [reviewFilter, setReviewFilter] = useState("All");
  const [scoreFilter, setScoreFilter] = useState("All");
  const [sortMode, setSortMode] = useState("ID Desc");
  const [page, setPage] = useState(1);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const loadReviewerData = async () => {
    setLoading(true);

    try {
      let minScore = 7.5;

      try {
        const thresholdSnap = await get(ref(rtdb, "GlobalParameter/ExpertReviewMinScore"));
        if (thresholdSnap.exists()) {
          minScore = Number(thresholdSnap.val()) || 7.5;
        }
      } catch (error) {
        console.warn("ExpertReviewMinScore not found. Using fallback 7.5", error);
      }

      setInternalThreshold(minScore);

      const q = query(collection(db, "startupApplications"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      const allRows = snap.docs.map((docItem) => {
        const data = docItem.data();

        return {
          id: docItem.id,
          _docId: docItem.id,
          ...data,
          _applicationId: getApplicationId(data, docItem.id),
          _status: getStatus(data),
          _registeredCompany: hasRegisteredCompany(data),
          _createdAtDisplay: formatDate(
            data?.createdAt || data?.submittedAt || data?.firestoreUpdatedAt
          ),
          _aiScoreInternal: getAIScore(data),
        };
      });

      const eligibleRows = allRows.filter((item) => item._aiScoreInternal >= minScore);

      const enriched = await Promise.all(
        eligibleRows.map(async (item) => {
          try {
            const reviewRef = doc(db, "startupApplications", item.id, "review", "expert");
            const reviewSnap = await getDoc(reviewRef);

            return {
              ...item,
              _expertReview: reviewSnap.exists() ? reviewSnap.data() : null,
            };
          } catch {
            return {
              ...item,
              _expertReview: null,
            };
          }
        })
      );

      setRows(enriched);
    } catch (error) {
      console.error("Failed to load reviewer board", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      loadReviewerData();
    }
  }, [loggedIn]);

  const handleLogin = (session) => {
    setReviewer(session);
    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("expertReviewerSession");
    setReviewer(null);
    setLoggedIn(false);
  };

  const getNumericId = (id) => {
    const found = String(id || "").match(/(\d+)/g);
    return found ? Number(found.join("")) : 0;
  };

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = rows.filter((item) => {
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
      const matchesStatus = statusFilter === "All" || item._status === statusFilter;
      const matchesRegistered =
        registeredFilter === "All" ||
        (registeredFilter === "Yes" && item._registeredCompany) ||
        (registeredFilter === "No" && !item._registeredCompany);

      const hasReview = !!item?._expertReview?.score;
      const score = Number(item?._expertReview?.score);

      const matchesReview =
        reviewFilter === "All" ||
        (reviewFilter === "Pending" && !hasReview) ||
        (reviewFilter === "Reviewed" && hasReview);

      const matchesScore =
        scoreFilter === "All" ||
        (scoreFilter === "Not Scored" && !hasReview) ||
        (scoreFilter === "0 - 4.9" && hasReview && score < 5) ||
        (scoreFilter === "5 - 6.9" && hasReview && score >= 5 && score < 7) ||
        (scoreFilter === "7 - 8.4" && hasReview && score >= 7 && score < 8.5) ||
        (scoreFilter === "8.5 - 10" && hasReview && score >= 8.5);

      return matchesSearch && matchesStatus && matchesRegistered && matchesReview && matchesScore;
    });

    return [...filtered].sort((a, b) => {
      const aId = String(a._applicationId || a.id || "");
      const bId = String(b._applicationId || b.id || "");
      const aNum = getNumericId(aId);
      const bNum = getNumericId(bId);
      const aScore = Number(a?._expertReview?.score || 0);
      const bScore = Number(b?._expertReview?.score || 0);

      if (sortMode === "ID Asc") return aNum - bNum || aId.localeCompare(bId);
      if (sortMode === "ID Desc") return bNum - aNum || bId.localeCompare(aId);
      if (sortMode === "Score High") return bScore - aScore;
      if (sortMode === "Score Low") return aScore - bScore;
      return 0;
    });
  }, [rows, search, statusFilter, registeredFilter, reviewFilter, scoreFilter, sortMode]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, registeredFilter, reviewFilter, scoreFilter, sortMode]);

  const stats = useMemo(() => {
    const reviewed = rows.filter((item) => !!item?._expertReview?.score).length;
    const pending = rows.length - reviewed;
    const registered = rows.filter((item) => item._registeredCompany).length;

    return {
      total: rows.length,
      reviewed,
      pending,
      registered,
    };
  }, [rows]);

  const openDetails = (item) => {
    setSelectedApplication(item);
    setDetailOpen(true);
  };

  const handleReviewSaved = (docId, reviewData) => {
    setRows((prev) =>
      prev.map((item) =>
        item.id === docId
          ? {
              ...item,
              _expertReview: reviewData,
            }
          : item
      )
    );

    setSelectedApplication((prev) =>
      prev?.id === docId
        ? {
            ...prev,
            _expertReview: reviewData,
          }
        : prev
    );
  };

  if (!loggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg1.jpg')" }}
    >
      <div
        className={`absolute inset-0 backdrop-blur-[2px] ${
          darkMode
            ? "bg-gradient-to-br from-slate-950/96 via-indigo-950/94 to-cyan-950/92"
            : "bg-gradient-to-br from-slate-50/92 via-indigo-50/82 to-cyan-50/88"
        }`}
      />
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-indigo-400/18 blur-3xl" />

      <div className="relative mx-auto max-w-[1650px] p-4 md:p-6 xl:p-8">
        <div
          className={`overflow-hidden rounded-[38px] border shadow-[0_34px_100px_rgba(15,23,42,0.16)] backdrop-blur-xl ${
            darkMode ? "border-white/10 bg-slate-950/88" : "border-white bg-white/76"
          }`}
        >
          <div className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-indigo-950 to-cyan-900 px-5 py-5 text-white md:px-7 md:py-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="inline-flex rounded-full border border-cyan-200/30 bg-white/10 px-3 py-1 text-xs font-black text-cyan-100">
                  Expert Reviewer Board
                </div>
                <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
                  Assigned Startup Review Queue
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/72">
                  Review assigned applications independently. AI score remains hidden to avoid bias.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white shadow-sm">
                  Reviewer: {reviewer?.name || reviewer?.id}
                </div>

                <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

                <button
                  onClick={loadReviewerData}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white px-5 py-3 text-sm font-black text-slate-900 shadow-sm transition hover:bg-cyan-50"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>

                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-black text-rose-700 shadow-sm transition hover:bg-rose-100"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-7">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                icon={FileText}
                title="Assigned"
                value={stats.total}
                subtitle="Applications in review queue"
                tone="cyan"
                darkMode={darkMode}
              />
              <KpiCard
                icon={Clock3}
                title="Pending"
                value={stats.pending}
                subtitle="Yet to be scored"
                tone="amber"
                darkMode={darkMode}
              />
              <KpiCard
                icon={CheckCircle2}
                title="Scored"
                value={stats.reviewed}
                subtitle="Score saved"
                tone="emerald"
                darkMode={darkMode}
              />
              <KpiCard
                icon={Building2}
                title="Registered"
                value={stats.registered}
                subtitle="Registered entities"
                tone="indigo"
                darkMode={darkMode}
              />
            </div>

            <div
              className={`mt-6 rounded-[30px] border p-4 shadow-[0_20px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl md:p-5 ${
                darkMode ? "border-white/10 bg-white/[0.05]" : "border-white bg-white/88"
              }`}
            >
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                <div className="xl:col-span-2">
                  <label
                    className={`mb-2 block text-xs font-bold uppercase tracking-[0.16em] ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
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
                      placeholder="Search startup, founder, district, sector..."
                      className={`w-full rounded-2xl border px-4 py-3 pl-11 text-sm shadow-sm outline-none transition ${
                        darkMode
                          ? "border-white/10 bg-white/[0.05] text-white placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white/[0.08] focus:ring-4 focus:ring-indigo-400/10"
                          : "border-slate-200 bg-slate-50 text-slate-800 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                      }`}
                    />
                  </div>
                </div>

                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={["All", "submitted", "Submitted", "Under Review", "Approved", "Rejected", "draft", "Draft"]}
                  darkMode={darkMode}
                />

                <FilterSelect
                  label="Registered"
                  value={registeredFilter}
                  onChange={setRegisteredFilter}
                  options={["All", "Yes", "No"]}
                  darkMode={darkMode}
                />

                <FilterSelect
                  label="Review"
                  value={reviewFilter}
                  onChange={setReviewFilter}
                  options={["All", "Pending", "Reviewed"]}
                  darkMode={darkMode}
                />

                <FilterSelect
                  label="Score"
                  value={scoreFilter}
                  onChange={setScoreFilter}
                  options={["All", "Not Scored", "0 - 4.9", "5 - 6.9", "7 - 8.4", "8.5 - 10"]}
                  darkMode={darkMode}
                />
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                <FilterSelect
                  label="Sort"
                  value={sortMode}
                  onChange={setSortMode}
                  options={["ID Desc", "ID Asc", "Score High", "Score Low"]}
                  darkMode={darkMode}
                />
              </div>
            </div>

            <div
              className={`mt-6 overflow-hidden rounded-[32px] border shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl ${
                darkMode ? "border-white/10 bg-white/[0.05]" : "border-white bg-white/90"
              }`}
            >
              <div
                className={`flex flex-col gap-2 border-b px-5 py-4 md:flex-row md:items-center md:justify-between ${
                  darkMode ? "border-white/10" : "border-slate-100"
                }`}
              >
                <div>
                  <h2 className={`text-lg font-black ${darkMode ? "text-white" : "text-slate-950"}`}>
                    Assigned Startups
                  </h2>
                  <p className={`mt-1 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Click any row to review, score, or revise score.
                  </p>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2 text-xs font-bold ${
                    darkMode ? "bg-white/8 text-slate-300" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {filteredRows.length} filtered / {rows.length} assigned
                </div>
              </div>

              <div className="overflow-auto">
                <table className="min-w-[1280px] w-full">
                  <thead className={darkMode ? "bg-slate-900 text-white" : "bg-slate-950 text-white"}>
                    <tr className="text-left text-xs uppercase tracking-[0.14em] text-white/78">
                      <th className="px-5 py-4 font-bold">Application ID</th>
                      <th className="px-5 py-4 font-bold">Startup</th>
                      <th className="px-5 py-4 font-bold">Founder</th>
                      <th className="px-5 py-4 font-bold">Status</th>
                      <th className="px-5 py-4 font-bold">Registered</th>
                      <th className="px-5 py-4 font-bold">District</th>
                      <th className="px-5 py-4 font-bold">Sector</th>
                      <th className="px-5 py-4 font-bold">Score</th>
                      <th className="px-5 py-4 font-bold">Review</th>
                      <th className="px-5 py-4 font-bold">Submitted</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      Array.from({ length: 8 }).map((_, index) => (
                        <tr
                          key={index}
                          className={darkMode ? "border-t border-white/10" : "border-t border-slate-100"}
                        >
                          {Array.from({ length: 10 }).map((__, i) => (
                            <td key={i} className="px-5 py-4">
                              <div
                                className={`h-4 w-full animate-pulse rounded ${
                                  darkMode ? "bg-white/10" : "bg-slate-100"
                                }`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-6 py-16 text-center">
                          <div className="mx-auto max-w-md">
                            <div
                              className={`mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${
                                darkMode ? "bg-white/8 text-slate-400" : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              <FileText size={22} />
                            </div>
                            <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>
                              No startups found
                            </h3>
                            <p className={`mt-2 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                              Try changing filters.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((item) => {
                        const isReviewed = !!item?._expertReview?.score;

                        return (
                          <tr
                            key={item.id}
                            onClick={() => openDetails(item)}
                            className={`cursor-pointer border-t transition ${
                              darkMode
                                ? "border-white/10 hover:bg-white/[0.06]"
                                : "border-slate-100 hover:bg-indigo-50/55"
                            }`}
                          >
                            <td
                              className={`px-5 py-4 text-sm font-black ${
                                darkMode ? "text-white" : "text-slate-950"
                              }`}
                            >
                              {safe(item._applicationId)}
                            </td>
                            <td className="px-5 py-4">
                              <div
                                className={`text-sm font-bold ${
                                  darkMode ? "text-white" : "text-slate-950"
                                }`}
                              >
                                {safe(getStartupName(item))}
                              </div>
                              <div className={`mt-1 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                                {safe(getEmail(item))}
                              </div>
                            </td>
                            <td className={`px-5 py-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                              {safe(getFounderName(item))}
                            </td>
                            <td className="px-5 py-4">
                              <StatusBadge status={item._status} darkMode={darkMode} />
                            </td>
                            <td className="px-5 py-4">
                              <RegisteredBadge value={item._registeredCompany} darkMode={darkMode} />
                            </td>
                            <td className={`px-5 py-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                              {safe(getDistrict(item))}
                            </td>
                            <td className={`px-5 py-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                              {safe(getCategory(item))}
                            </td>
                            <td className="px-5 py-4">
                              {isReviewed ? (
                                <ReviewBadge tone="emerald" darkMode={darkMode}>
                                  {item._expertReview.score}/10
                                </ReviewBadge>
                              ) : (
                                <ReviewBadge tone="amber" darkMode={darkMode}>
                                  Not Scored
                                </ReviewBadge>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              {isReviewed ? (
                                <ReviewBadge tone="emerald" darkMode={darkMode}>
                                  Scored
                                </ReviewBadge>
                              ) : (
                                <ReviewBadge tone="amber" darkMode={darkMode}>
                                  Pending
                                </ReviewBadge>
                              )}
                            </td>
                            <td className={`px-5 py-4 text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                              {safe(item._createdAtDisplay)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div
                className={`flex flex-col gap-3 border-t px-5 py-4 md:flex-row md:items-center md:justify-between ${
                  darkMode ? "border-white/10" : "border-slate-100"
                }`}
              >
                <div className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  Showing page <b>{page}</b> of <b>{totalPages}</b> | {filteredRows.length} startups
                </div>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-bold shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${
                      darkMode
                        ? "border-white/10 bg-white/8 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-bold shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${
                      darkMode
                        ? "border-white/10 bg-white/8 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DetailModal
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          application={selectedApplication}
          reviewerId={reviewer?.id}
          onReviewSaved={handleReviewSaved}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, darkMode = false }) {
  return (
    <div>
      <label
        className={`mb-2 block text-xs font-bold uppercase tracking-[0.16em] ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-2xl border px-4 py-3 text-sm shadow-sm outline-none transition ${
          darkMode
            ? "border-white/10 bg-slate-950/80 text-white focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
            : "border-white/80 bg-white/90 text-slate-800 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
        }`}
      >
        {options.map((item) => (
          <option key={item} value={item} className={darkMode ? "bg-slate-950 text-white" : ""}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}