import React, { useMemo, useState } from "react";
import {
  X,
  BarChart3,
  Users,
  BriefcaseBusiness,
  CreditCard,
  MapPin,
  GraduationCap,
  RefreshCw,
  Search,
  TrendingUp,
  PieChart as PieChartIcon,
  Activity,
  CheckCircle2,
  XCircle,
  EyeOff,
  Eye,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STATUS_KEYS = [
  "draft",
  "payment_pending",
  "submitted",
  "under_review",
  "shortlisted",
  "selected",
  "waitlisted",
  "rejected",
];

const STATUS_LABELS = {
  draft: "Draft",
  payment_pending: "Payment Pending",
  submitted: "Submitted",
  under_review: "Under Review",
  shortlisted: "Shortlisted",
  selected: "Selected",
  waitlisted: "Waitlisted",
  rejected: "Rejected",
};

const PAYMENT_KEYS = ["not_submitted", "pending", "verified", "rejected"];

const PAYMENT_LABELS = {
  not_submitted: "Not Submitted",
  pending: "Pending",
  verified: "Verified",
  rejected: "Rejected",
};

const STATUS_COLORS = {
  draft: "#94a3b8",
  payment_pending: "#f59e0b",
  submitted: "#0ea5e9",
  under_review: "#6366f1",
  shortlisted: "#06b6d4",
  selected: "#10b981",
  waitlisted: "#f97316",
  rejected: "#ef4444",
};

const PAYMENT_COLORS = {
  not_submitted: "#94a3b8",
  pending: "#f59e0b",
  verified: "#10b981",
  rejected: "#ef4444",
};

const CATEGORY_COLORS = [
  "#0f172a",
  "#2563eb",
  "#059669",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#ea580c",
  "#4f46e5",
  "#16a34a",
  "#be123c",
  "#0d9488",
];

const EMPTY_VALUES = new Set([
  "",
  "-",
  "not selected",
  "not available",
  "not applicable",
  "n/a",
  "na",
  "unknown",
  "other",
  "undefined",
  "null",
]);

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
};

const isMeaningfulValue = (value) => {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (EMPTY_VALUES.has(normalized)) return false;

  return true;
};

const cleanLabel = (value, fallback = "Not Available") => {
  const text = String(value ?? "").trim();
  return text || fallback;
};

const normalizeStatus = (value) => {
  return String(value || "draft").trim().toLowerCase();
};

const getPaymentStatus = (item) => {
  const payment = item?.paymentDetails || {};

  const hasSubmittedProof =
    !!payment?.paymentScreenshotMeta?.downloadURL ||
    !!payment?.utrNumber ||
    !!payment?.submittedAt;

  if (!hasSubmittedProof) return "not_submitted";

  return (
    payment?.adminVerification?.status ||
    payment?.verificationStatus ||
    "pending"
  );
};

const getApplicantName = (item) => {
  return (
    item?.personalDetails?.fullName ||
    item?.userSignup?.fullName ||
    item?.fullName ||
    "-"
  );
};

const getPostName = (item) => {
  return cleanLabel(
    item?.personalDetails?.postEligibilitySnapshot?.postName ||
      item?.personalDetails?.postAppliedFor ||
      item?.postAppliedFor,
    "Not Selected"
  );
};

const getPostLevel = (item) => {
  return cleanLabel(
    item?.personalDetails?.postEligibilitySnapshot?.level,
    "Not Available"
  );
};

const getPostCategory = (item) => {
  return cleanLabel(
    item?.personalDetails?.postEligibilitySnapshot?.category,
    "Not Available"
  );
};

const getDistrict = (item) => {
  return cleanLabel(
    item?.personalDetails?.presentDistrict || item?.district,
    "Not Available"
  );
};

const getGender = (item) => {
  return cleanLabel(item?.personalDetails?.gender, "Not Available");
};

const getSocialCategory = (item) => {
  return cleanLabel(item?.personalDetails?.category, "Not Available");
};

const parseDate = (value) => {
  if (!value) return null;

  try {
    if (typeof value?.toDate === "function") return value.toDate();
    if (value?.seconds) return new Date(value.seconds * 1000);

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

const getAge = (dobValue) => {
  const dob = parseDate(dobValue);
  if (!dob) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  if (age < 0 || age > 100) return null;

  return age;
};

const getAgeGroup = (item) => {
  const age = getAge(item?.personalDetails?.dateOfBirth);

  if (age === null) return "Unknown";
  if (age <= 24) return "18-24";
  if (age <= 29) return "25-29";
  if (age <= 34) return "30-34";
  if (age <= 39) return "35-39";
  if (age <= 44) return "40-44";
  if (age <= 49) return "45-49";
  return "50+";
};

const getHighestEducationGroup = (item) => {
  const edu = item?.educationalQualifications || {};
  const allRows = Array.isArray(edu?.education)
    ? edu.education
    : [
        edu?.tenth,
        edu?.twelfth,
        ...(edu?.graduations || []),
        ...(edu?.postGraduations || []),
        ...(edu?.others || []),
      ].filter(Boolean);

  const text = allRows
    .map((row) =>
      [
        row?.level,
        row?.degree,
        row?.qualificationName,
        row?.specialisation,
      ]
        .filter(Boolean)
        .join(" ")
    )
    .join(" ")
    .toLowerCase();

  if (!text.trim()) return "Not Available";
  if (text.includes("phd")) return "PhD";
  if (text.includes("chartered accountant") || text.includes(" ca")) return "CA";
  if (text.includes("masters in law") || text.includes("llm")) return "Masters Law";
  if (text.includes("mca")) return "MCA";
  if (text.includes("masters") || text.includes("pg diploma")) return "Post Graduation";
  if (text.includes("llb")) return "LLB";
  if (text.includes("b.tech") || text.includes("b.e")) return "B.Tech / BE";
  if (text.includes("graduation") || text.includes("bachelors")) return "Graduation";

  return "Not Available";
};

const hasPaymentProof = (item) => {
  const payment = item?.paymentDetails || {};

  return (
    !!payment?.paymentScreenshotMeta?.downloadURL ||
    !!payment?.utrNumber ||
    !!payment?.submittedAt
  );
};

const hasFinalDeclaration = (item) => {
  return (
    item?.finalDeclaration === true ||
    item?.declaration?.accepted === true ||
    item?.previewDeclaration === true ||
    item?.isFinalSubmitted === true
  );
};

const filterEmptyRows = (rows, key = "name", hideEmptyData = false) => {
  if (!hideEmptyData) return rows;
  return rows.filter((row) => isMeaningfulValue(row?.[key]));
};

const countBy = (items, getter, hideEmptyData = false) => {
  const map = new Map();

  items.forEach((item) => {
    const key = getter(item) || "Not Available";

    if (hideEmptyData && !isMeaningfulValue(key)) return;

    map.set(key, (map.get(key) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

const topN = (rows, n = 15) => {
  return rows.slice(0, n);
};

function KpiCard({ title, value, subtitle, icon: Icon, tone = "slate" }) {
  const toneMap = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    blue: "border-sky-200 bg-sky-50 text-sky-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    red: "border-red-200 bg-red-50 text-red-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-[28px] border border-white/80 bg-white p-5 shadow-sm">
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${
          toneMap[tone] || toneMap.slate
        }`}
      >
        <Icon size={20} />
      </div>

      <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </div>

      <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </div>

      <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
    </div>
  );
}

function ChartCard({ icon: Icon, title, subtitle, children, className = "" }) {
  return (
    <section
      className={`rounded-[30px] border border-white/80 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-5 flex items-start gap-3 border-b border-slate-100 pb-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <Icon size={18} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      {children}
    </section>
  );
}

function EmptyState({ text = "No data available." }) {
  return (
    <div className="flex h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
      {text}
    </div>
  );
}

function AnalyticsTable({ columns, rows, maxHeight = "max-h-[360px]" }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white ${maxHeight}`}
    >
      <div className="overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-slate-900 text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-4 py-3 font-semibold"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-700">
                      {safe(row[col.key])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-slate-500"
                >
                  No records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function ToggleButton({ active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
        active
          ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      }`}
    >
      {active ? <EyeOff size={16} /> : <Eye size={16} />}
      {active ? "Hide Empty Data: On" : "Show Empty Data"}
    </button>
  );
}

export default function SSUAnalytics({ open, applications = [], onClose }) {
  const [postFilter, setPostFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [hideEmptyData, setHideEmptyData] = useState(true);

  const usableApplications = useMemo(() => {
    if (!hideEmptyData) return applications;

    return applications.filter((item) => {
      const postName = getPostName(item);
      return isMeaningfulValue(postName);
    });
  }, [applications, hideEmptyData]);

  const postOptions = useMemo(() => {
    const set = new Set();

    usableApplications.forEach((item) => {
      const postName = getPostName(item);

      if (hideEmptyData && !isMeaningfulValue(postName)) return;

      set.add(postName);
    });

    return ["All", ...Array.from(set).filter(Boolean).sort()];
  }, [usableApplications, hideEmptyData]);

  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase();

    return usableApplications.filter((item) => {
      const postName = getPostName(item);
      const applicant = getApplicantName(item);

      if (hideEmptyData && !isMeaningfulValue(postName)) return false;

      const matchesPost = postFilter === "All" || postName === postFilter;

      const searchText = [
        applicant,
        postName,
        getPostLevel(item),
        getPostCategory(item),
        getDistrict(item),
        getGender(item),
        getHighestEducationGroup(item),
        item?.paymentDetails?.utrNumber,
        item?._applicationId,
        item?.applicationId,
        item?.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchText.includes(q);

      return matchesPost && matchesSearch;
    });
  }, [usableApplications, postFilter, search, hideEmptyData]);

  const analytics = useMemo(() => {
    const total = filteredApps.length;
    const paymentProof = filteredApps.filter(hasPaymentProof).length;
    const paymentVerified = filteredApps.filter(
      (item) => getPaymentStatus(item) === "verified"
    ).length;
    const finalSubmitted = filteredApps.filter(hasFinalDeclaration).length;
    const rejected = filteredApps.filter(
      (item) =>
        normalizeStatus(item?.status) === "rejected" ||
        getPaymentStatus(item) === "rejected"
    ).length;

    const meaningfulPosts = filteredApps
      .map(getPostName)
      .filter((value) => !hideEmptyData || isMeaningfulValue(value));

    const meaningfulDistricts = filteredApps
      .map(getDistrict)
      .filter((value) => !hideEmptyData || isMeaningfulValue(value));

    const uniquePosts = new Set(meaningfulPosts).size;
    const uniqueDistricts = new Set(meaningfulDistricts).size;

    const postMap = new Map();

    filteredApps.forEach((item) => {
      const post = getPostName(item);

      if (hideEmptyData && !isMeaningfulValue(post)) return;

      if (!postMap.has(post)) {
        postMap.set(post, {
          post,
          total: 0,
          draft: 0,
          payment_pending: 0,
          submitted: 0,
          under_review: 0,
          shortlisted: 0,
          selected: 0,
          waitlisted: 0,
          rejected: 0,
          payment_verified: 0,
          payment_pending_count: 0,
        });
      }

      const row = postMap.get(post);
      const status = normalizeStatus(item?.status);
      const paymentStatus = getPaymentStatus(item);

      row.total += 1;

      if (STATUS_KEYS.includes(status)) {
        row[status] += 1;
      } else {
        row.draft += 1;
      }

      if (paymentStatus === "verified") row.payment_verified += 1;
      if (paymentStatus === "pending") row.payment_pending_count += 1;
      if (paymentStatus === "rejected") row.rejected += 1;
    });

    const postStageData = Array.from(postMap.values()).sort(
      (a, b) => b.total - a.total
    );

    const postPaymentData = postStageData.map((row) => ({
      post: row.post,
      not_submitted: filteredApps.filter(
        (item) =>
          getPostName(item) === row.post &&
          getPaymentStatus(item) === "not_submitted"
      ).length,
      pending: filteredApps.filter(
        (item) =>
          getPostName(item) === row.post &&
          getPaymentStatus(item) === "pending"
      ).length,
      verified: filteredApps.filter(
        (item) =>
          getPostName(item) === row.post &&
          getPaymentStatus(item) === "verified"
      ).length,
      rejected: filteredApps.filter(
        (item) =>
          getPostName(item) === row.post &&
          getPaymentStatus(item) === "rejected"
      ).length,
    }));

    const ageGroupOrder = [
      "18-24",
      "25-29",
      "30-34",
      "35-39",
      "40-44",
      "45-49",
      "50+",
      "Unknown",
    ];

    const effectiveAgeGroups = hideEmptyData
      ? ageGroupOrder.filter((group) => group !== "Unknown")
      : ageGroupOrder;

    const ageGroupData = effectiveAgeGroups.map((group) => ({
      group,
      applicants: filteredApps.filter((item) => getAgeGroup(item) === group)
        .length,
    }));

    const postAgeData = postStageData.map((row) => {
      const postApps = filteredApps.filter(
        (item) => getPostName(item) === row.post
      );

      const base = { post: row.post, total: postApps.length };

      effectiveAgeGroups.forEach((group) => {
        base[group] = postApps.filter((item) => getAgeGroup(item) === group).length;
      });

      return base;
    });

    const educationGroups = [
      "Graduation",
      "B.Tech / BE",
      "Post Graduation",
      "MCA",
      "CA",
      "LLB",
      "Masters Law",
      "PhD",
      "Not Available",
    ];

    const effectiveEducationGroups = hideEmptyData
      ? educationGroups.filter((group) => isMeaningfulValue(group))
      : educationGroups;

    const postEducationData = postStageData.map((row) => {
      const postApps = filteredApps.filter(
        (item) => getPostName(item) === row.post
      );

      const base = { post: row.post, total: postApps.length };

      effectiveEducationGroups.forEach((group) => {
        base[group] = postApps.filter(
          (item) => getHighestEducationGroup(item) === group
        ).length;
      });

      return base;
    });

    const districtData = topN(countBy(filteredApps, getDistrict, hideEmptyData), 15);
    const genderData = countBy(filteredApps, getGender, hideEmptyData);
    const socialCategoryData = countBy(
      filteredApps,
      getSocialCategory,
      hideEmptyData
    );
    const educationData = countBy(
      filteredApps,
      getHighestEducationGroup,
      hideEmptyData
    );
    const postCategoryData = countBy(
      filteredApps,
      getPostCategory,
      hideEmptyData
    );
    const postLevelData = countBy(filteredApps, getPostLevel, hideEmptyData);

    const conversionData = [
      {
        stage: "Applications",
        count: total,
      },
      {
        stage: "Payment Proof",
        count: paymentProof,
      },
      {
        stage: "Payment Verified",
        count: paymentVerified,
      },
      {
        stage: "Final Declaration",
        count: finalSubmitted,
      },
      {
        stage: "Rejected",
        count: rejected,
      },
    ];

    const insightRows = postStageData.map((row) => {
      const paymentRow =
        postPaymentData.find((item) => item.post === row.post) || {};

      const verifiedRate = row.total
        ? `${Math.round(((paymentRow.verified || 0) / row.total) * 100)}%`
        : "0%";

      const submittedRate = row.total
        ? `${Math.round(((row.submitted || 0) / row.total) * 100)}%`
        : "0%";

      return {
        post: row.post,
        total: row.total,
        submitted: row.submitted,
        draft: row.draft,
        paymentPending: paymentRow.pending || 0,
        paymentVerified: paymentRow.verified || 0,
        rejected: row.rejected,
        submittedRate,
        verifiedRate,
      };
    });

    return {
      total,
      paymentProof,
      paymentVerified,
      finalSubmitted,
      rejected,
      uniquePosts,
      uniqueDistricts,
      postStageData,
      postPaymentData,
      ageGroupData,
      postAgeData,
      postEducationData,
      districtData,
      genderData,
      socialCategoryData,
      educationData,
      postCategoryData,
      postLevelData,
      conversionData,
      insightRows,
      effectiveAgeGroups,
      effectiveEducationGroups,
    };
  }, [filteredApps, hideEmptyData]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] bg-slate-950/70 p-2 backdrop-blur-sm md:p-4">
      <div className="mx-auto flex h-[96vh] w-full max-w-[98vw] flex-col overflow-hidden rounded-[34px] border border-white/80 bg-slate-100 shadow-[0_45px_140px_rgba(15,23,42,0.45)]">
        <div className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-5 py-5 text-white md:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                <BarChart3 size={14} />
                SSU Recruitment Analytics
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                Recruitment Insights Dashboard
              </h2>

              <p className="mt-2 max-w-4xl text-sm leading-relaxed text-white/65">
                Post-wise stage distribution, payment verification funnel,
                age-group trends, education mix, district spread and category
                insights.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
                Showing {analytics.total} applicant(s)
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 bg-white px-5 py-4 md:px-7">
          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_auto_auto]">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applicant, post, district, UTR, application ID..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <select
              value={postFilter}
              onChange={(e) => setPostFilter(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              {postOptions.map((post) => (
                <option key={post} value={post}>
                  {post === "All" ? "All Posts" : post}
                </option>
              ))}
            </select>

            <ToggleButton
              active={hideEmptyData}
              onClick={() => setHideEmptyData((prev) => !prev)}
            />

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPostFilter("All");
                setHideEmptyData(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <RefreshCw size={16} />
              Reset
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {postOptions.slice(0, 8).map((post) => (
              <FilterChip
                key={post}
                active={postFilter === post}
                onClick={() => setPostFilter(post)}
              >
                {post === "All" ? "All Posts" : post}
              </FilterChip>
            ))}

            {hideEmptyData ? (
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700">
                Not Selected / Not Available hidden
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
                Empty / unavailable data included
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
            <KpiCard
              title="Applications"
              value={analytics.total}
              subtitle="Filtered records"
              icon={Users}
              tone="slate"
            />
            <KpiCard
              title="Posts"
              value={analytics.uniquePosts}
              subtitle="Post options"
              icon={BriefcaseBusiness}
              tone="violet"
            />
            <KpiCard
              title="Districts"
              value={analytics.uniqueDistricts}
              subtitle="Applicant spread"
              icon={MapPin}
              tone="blue"
            />
            <KpiCard
              title="Payment Proof"
              value={analytics.paymentProof}
              subtitle="Uploaded by applicants"
              icon={CreditCard}
              tone="amber"
            />
            <KpiCard
              title="Payment Verified"
              value={analytics.paymentVerified}
              subtitle="Verified by admin"
              icon={CheckCircle2}
              tone="emerald"
            />
            <KpiCard
              title="Final Declaration"
              value={analytics.finalSubmitted}
              subtitle="Completed flow"
              icon={Activity}
              tone="blue"
            />
            <KpiCard
              title="Rejected"
              value={analytics.rejected}
              subtitle="Rejected applications"
              icon={XCircle}
              tone="red"
            />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <ChartCard
              icon={BriefcaseBusiness}
              title="Post-wise Applicant Stage Distribution"
              subtitle="Each post shows applicant count across draft, payment pending, submitted, review and decision stages."
            >
              {analytics.postStageData.length ? (
                <div className="h-[430px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.postStageData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="post"
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                        height={120}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      {STATUS_KEYS.map((key) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          name={STATUS_LABELS[key]}
                          stackId="stage"
                          fill={STATUS_COLORS[key]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </ChartCard>

            <ChartCard
              icon={TrendingUp}
              title="Application Funnel"
              subtitle="Quick conversion view from applications to payment verification and declaration."
            >
              {analytics.conversionData.length ? (
                <div className="h-[430px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.conversionData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        name="Applicants"
                        fill="#0f172a"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </ChartCard>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <ChartCard
              icon={CreditCard}
              title="Post-wise Payment Status"
              subtitle="Payment proof status split by post."
            >
              {analytics.postPaymentData.length ? (
                <div className="h-[390px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.postPaymentData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="post"
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                        height={120}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      {PAYMENT_KEYS.map((key) => (
                        <Bar
                          key={key}
                          dataKey={key}
                          name={PAYMENT_LABELS[key]}
                          stackId="payment"
                          fill={PAYMENT_COLORS[key]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </ChartCard>

            <ChartCard
              icon={Users}
              title="Age Group Distribution"
              subtitle="Age distribution of applicants in the selected dataset."
            >
              {analytics.ageGroupData.length ? (
                <div className="h-[390px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.ageGroupData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="group" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar
                        dataKey="applicants"
                        name="Applicants"
                        fill="#2563eb"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </ChartCard>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <ChartCard
              icon={Users}
              title="Post-wise Age Group Mix"
              subtitle="Shows which age groups are applying for each post."
            >
              {analytics.postAgeData.length ? (
                <div className="h-[430px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.postAgeData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="post"
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                        height={120}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      {analytics.effectiveAgeGroups.map((group, index) => (
                        <Bar
                          key={group}
                          dataKey={group}
                          stackId="age"
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </ChartCard>

            <ChartCard
              icon={GraduationCap}
              title="Post-wise Education Mix"
              subtitle="Highest education/professional qualification distribution by post."
            >
              {analytics.postEducationData.length ? (
                <div className="h-[430px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.postEducationData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 100 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="post"
                        angle={-35}
                        textAnchor="end"
                        interval={0}
                        height={120}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      {analytics.effectiveEducationGroups.map((group, index) => (
                        <Bar
                          key={group}
                          dataKey={group}
                          stackId="education"
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </ChartCard>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-3">
            <ChartCard
              icon={PieChartIcon}
              title="Gender Mix"
              subtitle="Applicant gender distribution."
            >
              {analytics.genderData.length ? (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.genderData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={105}
                        label
                      >
                        {analytics.genderData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </ChartCard>

            <ChartCard
              icon={PieChartIcon}
              title="Social Category"
              subtitle="Category-wise applicant count."
            >
              {analytics.socialCategoryData.length ? (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.socialCategoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={105}
                        label
                      >
                        {analytics.socialCategoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </ChartCard>

            <ChartCard
              icon={PieChartIcon}
              title="Post Category"
              subtitle="Startup, IT, Finance, Legal, Design etc."
            >
              {analytics.postCategoryData.length ? (
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.postCategoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={105}
                        label
                      >
                        {analytics.postCategoryData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </ChartCard>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <ChartCard
              icon={MapPin}
              title="Top Districts"
              subtitle="District-wise applicant count."
            >
              {analytics.districtData.length ? (
                <div className="h-[430px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics.districtData}
                      layout="vertical"
                      margin={{ top: 10, right: 20, left: 80, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        name="Applicants"
                        fill="#0891b2"
                        radius={[0, 10, 10, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </ChartCard>

            <ChartCard
              icon={Activity}
              title="Post-wise Summary Table"
              subtitle="Operational view for admin review and planning."
            >
              <AnalyticsTable
                columns={[
                  { key: "post", label: "Post" },
                  { key: "total", label: "Total" },
                  { key: "draft", label: "Draft" },
                  { key: "submitted", label: "Submitted" },
                  { key: "paymentPending", label: "Payment Pending" },
                  { key: "paymentVerified", label: "Payment Verified" },
                  { key: "rejected", label: "Rejected" },
                  { key: "submittedRate", label: "Submitted %" },
                  { key: "verifiedRate", label: "Payment Verified %" },
                ]}
                rows={analytics.insightRows}
              />
            </ChartCard>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-3">
            <ChartCard
              icon={GraduationCap}
              title="Education Groups"
              subtitle="Highest qualification distribution."
            >
              <AnalyticsTable
                columns={[
                  { key: "name", label: "Education" },
                  { key: "value", label: "Applicants" },
                ]}
                rows={analytics.educationData}
              />
            </ChartCard>

            <ChartCard
              icon={BriefcaseBusiness}
              title="Post Level"
              subtitle="Consultant level distribution."
            >
              <AnalyticsTable
                columns={[
                  { key: "name", label: "Level" },
                  { key: "value", label: "Applicants" },
                ]}
                rows={analytics.postLevelData}
              />
            </ChartCard>

            <ChartCard
              icon={MapPin}
              title="District Table"
              subtitle="Top district records."
            >
              <AnalyticsTable
                columns={[
                  { key: "name", label: "District" },
                  { key: "value", label: "Applicants" },
                ]}
                rows={analytics.districtData}
              />
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}