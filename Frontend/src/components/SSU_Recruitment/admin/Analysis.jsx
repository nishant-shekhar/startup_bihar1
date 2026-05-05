import React, { useMemo } from "react";
import {
  X,
  PieChart,
  Bot,
  Users,
  Building2,
  MapPin,
  BadgeCheck,
  TrendingUp,
  Sparkles,
  FileText,
  Layers3,
  Download,
  GraduationCap,
  UserRoundCheck,
  AlertTriangle,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PointElement,
  LineElement,
} from "chart.js";

import { Bar, Doughnut, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  PointElement,
  LineElement
);

const EMPTY_LABEL = "Have not filled yet";

const CHART_COLORS = {
  violet: "#8b5cf6",
  indigo: "#6366f1",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  mint: "#2dd4bf",
  teal: "#14b8a6",
  emeraldSoft: "#34d399",
  lime: "#84cc16",
  yellow: "#facc15",
  amber: "#f59e0b",
  orange: "#fb923c",
  orangeDeep: "#f97316",
  coral: "#f87171",
  pink: "#ec4899",
  purple: "#a855f7",
  slate: "#64748b",
};

const COLORS = [
  CHART_COLORS.violet,
  CHART_COLORS.blue,
  CHART_COLORS.cyan,
  CHART_COLORS.mint,
  CHART_COLORS.teal,
  CHART_COLORS.yellow,
  CHART_COLORS.amber,
  CHART_COLORS.orange,
  CHART_COLORS.purple,
  CHART_COLORS.pink,
  CHART_COLORS.indigo,
  CHART_COLORS.slate,
];

const DECISION_LABELS = ["Pitch Call", "Reserved Band", "Rejected"];

const DECISION_COLOR_MAP = {
  "Pitch Call": "#2dd4bf",
  "Reserved Band": "#8b5cf6",
  Rejected: "#f59e0b",
};

const DECISION_BADGE_CLASS = {
  "Pitch Call": "border-teal-200 bg-teal-50 text-teal-700",
  "Reserved Band": "border-violet-200 bg-violet-50 text-violet-700",
  Rejected: "border-orange-200 bg-orange-50 text-orange-700",
};

const safe = (value) => {
  if (value === null || value === undefined || value === "") return EMPTY_LABEL;
  return String(value);
};

const normalize = (value, fallback = EMPTY_LABEL) => {
  if (value === null || value === undefined || value === "") return fallback;
  const str = String(value).trim();
  return str || fallback;
};

const normalizeDecisionLabel = (value) => {
  const raw = normalize(value, "");
  const lower = raw.toLowerCase();

  if (lower.includes("pitch")) return "Pitch Call";

  if (
    lower.includes("reserved") ||
    lower.includes("reserve") ||
    lower.includes("band")
  ) {
    return "Reserved Band";
  }

  if (
    lower.includes("reject") ||
    lower.includes("rejected") ||
    lower.includes("traditional")
  ) {
    return "Rejected";
  }

  return "";
};

const getStatus = (item) =>
  item?._status ||
  item?.status ||
  item?.applicationStatus ||
  item?.reviewStatus ||
  item?.documentStatus ||
  "Submitted";

const getStartupName = (item) =>
  item?.userSignup?.startupName ||
  item?.startupName ||
  item?.startup_name ||
  item?.company_name ||
  item?.companyName ||
  EMPTY_LABEL;

const getFounderName = (item) =>
  item?.userSignup?.founderName ||
  item?.basicDetails?.fullName ||
  item?.founderName ||
  item?.founder_name ||
  item?.name ||
  EMPTY_LABEL;

const getDistrict = (item) =>
  item?.basicDetails?.district ||
  item?.district ||
  item?.registeredDistrict ||
  item?.districtRoc ||
  item?.startupDistrict ||
  item?.entityDetails?.district ||
  EMPTY_LABEL;

const getState = (item) =>
  item?.basicDetails?.state ||
  item?.entityDetails?.state ||
  item?.state ||
  EMPTY_LABEL;

const getGender = (item) =>
  item?.basicDetails?.gender || item?.gender || EMPTY_LABEL;

const getReservedCategory = (item) =>
  item?.basicDetails?.category ||
  item?.category ||
  item?.reservedCategory ||
  EMPTY_LABEL;

const getReservedBand = (item) => {
  const categoryRaw = getReservedCategory(item);
  const category = String(categoryRaw || "").trim().toLowerCase();
  const gender = String(getGender(item) || "").trim().toLowerCase();

  if (!category || category === EMPTY_LABEL.toLowerCase()) return EMPTY_LABEL;

  if (gender === "female" || gender === "woman" || gender === "women") {
    return "Women Founder";
  }

  if (category.includes("sc")) return "SC";
  if (category.includes("st")) return "ST";
  if (category.includes("ebc")) return "EBC";
  if (category.includes("obc")) return "OBC";
  if (category.includes("minority")) return "Minority";
  if (category.includes("general")) return "General";

  return categoryRaw || EMPTY_LABEL;
};

const getQualification = (item) => {
  const q = item?.basicDetails?.qualification || item?.qualification;

  if (q === "Other") {
    return (
      item?.basicDetails?.otherQualification ||
      item?.otherQualification ||
      "Other"
    );
  }

  return q || EMPTY_LABEL;
};

const getInstitution = (item) => {
  const institution = item?.basicDetails?.institution || item?.institution;

  if (institution === "Other") {
    return item?.basicDetails?.otherInstitution || EMPTY_LABEL;
  }

  return institution || EMPTY_LABEL;
};

const getCategory = (item) =>
  item?.startupDetails?.sector ||
  item?.sector ||
  item?.startupCategory ||
  EMPTY_LABEL;

const getStage = (item) =>
  item?.startupDetails?.stage || item?.stage || EMPTY_LABEL;

const getApplicationType = (item) =>
  item?.userSignup?.applicationType || item?.applicationType || EMPTY_LABEL;

const getTeamSize = (item) => {
  const raw = item?.startupDetails?.teamSize;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};

const getTeamSizeBucket = (item) => {
  const size = getTeamSize(item);

  if (!size || size <= 0) return EMPTY_LABEL;
  if (size === 1) return "Solo";
  if (size >= 2 && size <= 3) return "2–3";
  if (size >= 4 && size <= 5) return "4–5";
  if (size >= 6 && size <= 10) return "6–10";
  return "10+";
};

const hasRegisteredCompany = (item) =>
  !!(
    item?._registeredCompany ||
    item?.entityDetails?.hasRegisteredEntity ||
    item?.cin ||
    item?.registrationNumber ||
    item?.registration_no ||
    item?.entityType ||
    item?.entityDetails?.entityRegistrationNumber
  );

const hasAIReview = (item) => item?.aiEvaluation?.done === true;

const getAIScore = (item) => {
  const value = item?.aiEvaluation?.finalScore;

  if (value === null || value === undefined || value === "") return null;

  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const getAIDecision = (item) => {
  if (!hasAIReview(item)) return "";

  return normalizeDecisionLabel(
    item?.aiEvaluation?.decision ||
      item?.aiEvaluation?.startupQuality ||
      item?.aiEvaluation?.qualityTier ||
      item?.aiEvaluation?.scoreBand ||
      ""
  );
};

const getScoreRange = (score) => {
  const n = Number(score);

  if (!Number.isFinite(n)) return "";
  if (n < 4) return "0–4";
  if (n < 5) return "4–5";
  if (n < 6) return "5–6";
  if (n < 7) return "6–7";
  if (n < 8) return "7–8";
  if (n < 9) return "8–9";
  return "9–10";
};

const getAIBand = (score) => {
  const n = Number(score);

  if (!Number.isFinite(n)) return "";
  if (n >= 7.5) return "High";
  if (n >= 5.5) return "Medium";
  return "Low";
};

const countBy = (rows, getter) => {
  const map = {};

  rows.forEach((item) => {
    const key = normalize(getter(item));
    map[key] = (map[key] || 0) + 1;
  });

  return Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
};

const topN = (arr, n = 12) => arr.slice(0, n);

const percent = (part, total) => {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
};

const buildBarData = (labels, values, label) => ({
  labels,
  datasets: [
    {
      label,
      data: values,
      backgroundColor: labels.map((_, index) => COLORS[index % COLORS.length]),
      borderColor: labels.map((_, index) => COLORS[index % COLORS.length]),
      borderRadius: 9,
      borderWidth: 1,
      maxBarThickness: 46,
    },
  ],
});

const buildPieData = (labels, values, label) => ({
  labels,
  datasets: [
    {
      label,
      data: values,
      backgroundColor: labels.map((_, index) => COLORS[index % COLORS.length]),
      borderColor: "#ffffff",
      borderWidth: 3,
      hoverOffset: 8,
    },
  ],
});

const buildStackedDecisionData = (rows, groupGetter) => {
  const reviewedRows = rows.filter((item) => {
    const decision = getAIDecision(item);
    return hasAIReview(item) && DECISION_LABELS.includes(decision);
  });

  const groups = Array.from(
    new Set(reviewedRows.map((item) => normalize(groupGetter(item))))
  );

  const datasets = DECISION_LABELS.map((decision) => ({
    label: decision,
    data: groups.map((group) => {
      return reviewedRows.filter((item) => {
        const groupValue = normalize(groupGetter(item));
        const decisionValue = getAIDecision(item);

        return groupValue === group && decisionValue === decision;
      }).length;
    }),
    backgroundColor: DECISION_COLOR_MAP[decision],
    borderColor: DECISION_COLOR_MAP[decision],
    borderRadius: 8,
    borderWidth: 1,
  }));

  return {
    labels: groups,
    datasets,
  };
};

const buildRegisteredDecisionData = (rows) => {
  const reviewedRows = rows.filter((item) => {
    const decision = getAIDecision(item);
    return hasAIReview(item) && DECISION_LABELS.includes(decision);
  });

  const labels = ["Registered Entity", "Not Registered"];

  return {
    labels,
    datasets: DECISION_LABELS.map((decision) => ({
      label: decision,
      data: labels.map((label) => {
        return reviewedRows.filter((item) => {
          const registeredLabel = hasRegisteredCompany(item)
            ? "Registered Entity"
            : "Not Registered";

          return registeredLabel === label && getAIDecision(item) === decision;
        }).length;
      }),
      backgroundColor: DECISION_COLOR_MAP[decision],
      borderColor: DECISION_COLOR_MAP[decision],
      borderRadius: 8,
      borderWidth: 1,
    })),
  };
};

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        font: {
          size: 11,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#64748b",
        maxRotation: 50,
        minRotation: 0,
      },
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        color: "#64748b",
        precision: 0,
      },
      grid: {
        color: "rgba(148, 163, 184, 0.22)",
      },
    },
  },
};

const horizontalBarOptions = {
  ...baseChartOptions,
  indexAxis: "y",
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        color: "#64748b",
        precision: 0,
      },
      grid: {
        color: "rgba(148, 163, 184, 0.22)",
      },
    },
    y: {
      ticks: {
        color: "#64748b",
      },
      grid: {
        display: false,
      },
    },
  },
};

const stackedBarOptions = {
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: "#64748b",
        maxRotation: 45,
        minRotation: 0,
      },
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        color: "#64748b",
        precision: 0,
      },
      grid: {
        color: "rgba(148, 163, 184, 0.22)",
      },
    },
  },
};

const stackedHorizontalOptions = {
  ...stackedBarOptions,
  indexAxis: "y",
  scales: {
    x: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        color: "#64748b",
        precision: 0,
      },
      grid: {
        color: "rgba(148, 163, 184, 0.22)",
      },
    },
    y: {
      stacked: true,
      ticks: {
        color: "#64748b",
      },
      grid: {
        display: false,
      },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "68%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        font: {
          size: 11,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
  },
};

function StatCard({ title, value, subtitle, icon: Icon, tone = "slate" }) {
  const tones = {
    violet: "from-violet-100 via-white to-fuchsia-100 text-violet-700",
    blue: "from-sky-100 via-white to-indigo-100 text-sky-700",
    cyan: "from-cyan-100 via-white to-teal-100 text-cyan-700",
    mint: "from-teal-100 via-white to-cyan-100 text-teal-700",
    amber: "from-amber-100 via-white to-yellow-100 text-amber-700",
    orange: "from-orange-100 via-white to-amber-100 text-orange-700",
    slate: "from-slate-100 via-white to-slate-50 text-slate-700",
  };

  const iconTones = {
    violet: "bg-violet-600",
    blue: "bg-blue-600",
    cyan: "bg-cyan-600",
    mint: "bg-teal-500",
    amber: "bg-amber-500",
    orange: "bg-orange-500",
    slate: "bg-slate-950",
  };

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/78 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div
        className={`rounded-[22px] bg-gradient-to-br ${
          tones[tone] || tones.slate
        } p-4`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {title}
            </div>

            <div className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              {value}
            </div>

            <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
          </div>

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              iconTones[tone] || iconTones.slate
            } text-white shadow-sm`}
          >
            <Icon size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, icon: Icon, children, height = "h-80" }) {
  return (
    <div className="rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.09)] backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Icon size={16} />
            </div>

            <h3 className="text-base font-bold text-slate-950">{title}</h3>
          </div>

          {subtitle ? (
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className={`w-full ${height}`}>{children}</div>
    </div>
  );
}

function InsightRow({ label, value, detail }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3">
      <div>
        <div className="text-sm font-semibold text-slate-800">{label}</div>

        {detail ? (
          <div className="mt-1 text-xs text-slate-500">{detail}</div>
        ) : null}
      </div>

      <div className="text-right text-lg font-bold text-slate-950">{value}</div>
    </div>
  );
}

export default function Analysis({
  open,
  onClose,
  applications = [],
  allApplications = [],
  onDownloadExcel,
  exporting = false,
}) {
  const analytics = useMemo(() => {
    const rows = Array.isArray(applications) ? applications : [];
    const allRows = Array.isArray(allApplications) ? allApplications : [];

    const total = rows.length;
    const allTotal = allRows.length;

    const submitted = rows.filter((item) => {
      const status = String(getStatus(item)).toLowerCase();
      return status === "submitted";
    }).length;

    const draft = rows.filter((item) => {
      const status = String(getStatus(item)).toLowerCase();
      return status === "draft";
    }).length;

    const registered = rows.filter(hasRegisteredCompany).length;
    const unregistered = total - registered;

    const aiReviewed = rows.filter(hasAIReview).length;
    const aiPending = total - aiReviewed;

    const aiScores = rows.map(getAIScore).filter((v) => v !== null);

    const avgScore =
      aiScores.length > 0
        ? aiScores.reduce((sum, score) => sum + score, 0) / aiScores.length
        : null;

    const highScore = aiScores.filter((score) => score >= 7.5).length;

    const mediumScore = aiScores.filter(
      (score) => score >= 5.5 && score < 7.5
    ).length;

    const lowScore = aiScores.filter((score) => score < 5.5).length;

    const reviewedDecisionRows = rows.filter((item) => {
      const decision = getAIDecision(item);
      return hasAIReview(item) && DECISION_LABELS.includes(decision);
    });

    const pitchCall = reviewedDecisionRows.filter(
      (item) => getAIDecision(item) === "Pitch Call"
    ).length;

    const reservedBandDecision = reviewedDecisionRows.filter(
      (item) => getAIDecision(item) === "Reserved Band"
    ).length;

    const rejected = reviewedDecisionRows.filter(
      (item) => getAIDecision(item) === "Rejected"
    ).length;

    const totalTeamSize = rows.reduce((sum, item) => sum + getTeamSize(item), 0);
    const avgTeamSize = total ? totalTeamSize / total : 0;

    const gender = countBy(rows, getGender);
    const district = countBy(rows, getDistrict);
    const state = countBy(rows, getState);
    const sector = countBy(rows, getCategory);
    const stage = countBy(rows, getStage);
    const status = countBy(rows, getStatus);
    const applicationType = countBy(rows, getApplicationType);
    const qualification = countBy(rows, getQualification);
    const reservedCategory = countBy(rows, getReservedCategory);
    const reservedBand = countBy(rows, getReservedBand);
    const institution = countBy(rows, getInstitution);
    const teamSizeBucket = countBy(rows, getTeamSizeBucket);

    const aiDecision = countBy(reviewedDecisionRows, getAIDecision);

    const scoreRangeOrder = ["0–4", "4–5", "5–6", "6–7", "7–8", "8–9", "9–10"];

    const scoreRangeMap = {};
    scoreRangeOrder.forEach((key) => {
      scoreRangeMap[key] = 0;
    });

    rows.filter(hasAIReview).forEach((item) => {
      const range = getScoreRange(getAIScore(item));

      if (range) {
        scoreRangeMap[range] = (scoreRangeMap[range] || 0) + 1;
      }
    });

    const scoreRange = scoreRangeOrder.map((label) => ({
      label,
      value: scoreRangeMap[label] || 0,
    }));

    const aiBand = [
      { label: "High", value: highScore },
      { label: "Medium", value: mediumScore },
      { label: "Low", value: lowScore },
    ];

    const missingGender = rows.filter(
      (item) => getGender(item) === EMPTY_LABEL
    ).length;

    const missingQualification = rows.filter(
      (item) => getQualification(item) === EMPTY_LABEL
    ).length;

    const missingDistrict = rows.filter(
      (item) => getDistrict(item) === EMPTY_LABEL
    ).length;

    const missingStage = rows.filter(
      (item) => getStage(item) === EMPTY_LABEL
    ).length;

    const missingSector = rows.filter(
      (item) => getCategory(item) === EMPTY_LABEL
    ).length;

    const missingPitchDeck = rows.filter(
      (item) => !item?.businessIdea?.pitchDeckMeta?.downloadURL
    ).length;

    const topDistrict = district[0];
    const topSector = sector[0];
    const topGender = gender[0];
    const topStage = stage[0];
    const topQualification = qualification[0];

    return {
      rows,
      total,
      allTotal,
      submitted,
      draft,
      registered,
      unregistered,
      aiReviewed,
      aiPending,
      avgScore,
      highScore,
      mediumScore,
      lowScore,
      pitchCall,
      reservedBandDecision,
      rejected,
      totalTeamSize,
      avgTeamSize,
      gender,
      district,
      state,
      sector,
      stage,
      status,
      applicationType,
      qualification,
      reservedCategory,
      reservedBand,
      institution,
      teamSizeBucket,
      aiDecision,
      scoreRange,
      aiBand,
      missingGender,
      missingQualification,
      missingDistrict,
      missingStage,
      missingSector,
      missingPitchDeck,
      topDistrict,
      topSector,
      topGender,
      topStage,
      topQualification,
    };
  }, [applications, allApplications]);

  if (!open) return null;

  const districtTop = topN(analytics.district, 15);
  const sectorTop = topN(analytics.sector, 12);
  const stateTop = topN(analytics.state, 10);
  const qualificationTop = topN(analytics.qualification, 14);
  const institutionTop = topN(analytics.institution, 12);

  const statusData = buildBarData(
    analytics.status.map((x) => x.label),
    analytics.status.map((x) => x.value),
    "Applications"
  );

  const genderData = buildPieData(
    analytics.gender.map((x) => x.label),
    analytics.gender.map((x) => x.value),
    "Gender"
  );

  const registeredData = buildPieData(
    ["Registered Entity", "Not Registered"],
    [analytics.registered, analytics.unregistered],
    "Applications"
  );

  const aiReviewData = buildPieData(
    ["AI Reviewed", "AI Pending"],
    [analytics.aiReviewed, analytics.aiPending],
    "AI Review"
  );

  const aiDecisionData = {
    labels: analytics.aiDecision.map((x) => x.label),
    datasets: [
      {
        label: "AI Decision",
        data: analytics.aiDecision.map((x) => x.value),
        backgroundColor: analytics.aiDecision.map(
          (x) => DECISION_COLOR_MAP[x.label] || CHART_COLORS.slate
        ),
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const aiBandData = buildBarData(
    analytics.aiBand.map((x) => x.label),
    analytics.aiBand.map((x) => x.value),
    "Applications"
  );

  const scoreRangeData = buildBarData(
    analytics.scoreRange.map((x) => x.label),
    analytics.scoreRange.map((x) => x.value),
    "Startups"
  );

  const districtData = buildBarData(
    districtTop.map((x) => x.label),
    districtTop.map((x) => x.value),
    "Applications"
  );

  const sectorData = buildBarData(
    sectorTop.map((x) => x.label),
    sectorTop.map((x) => x.value),
    "Applications"
  );

  const stateData = buildBarData(
    stateTop.map((x) => x.label),
    stateTop.map((x) => x.value),
    "Applications"
  );

  const stageData = buildBarData(
    analytics.stage.map((x) => x.label),
    analytics.stage.map((x) => x.value),
    "Applications"
  );

  const applicationTypeData = buildBarData(
    analytics.applicationType.map((x) => x.label),
    analytics.applicationType.map((x) => x.value),
    "Applications"
  );

  const qualificationData = buildBarData(
    qualificationTop.map((x) => x.label),
    qualificationTop.map((x) => x.value),
    "Founders"
  );

  const institutionData = buildBarData(
    institutionTop.map((x) => x.label),
    institutionTop.map((x) => x.value),
    "Founders"
  );

  const teamSizeData = buildBarData(
    analytics.teamSizeBucket.map((x) => x.label),
    analytics.teamSizeBucket.map((x) => x.value),
    "Startups"
  );

  const reservedBandData = buildBarData(
    analytics.reservedBand.map((x) => x.label),
    analytics.reservedBand.map((x) => x.value),
    "Applications"
  );

  const genderDecisionData = buildStackedDecisionData(analytics.rows, getGender);

  const reservedCategoryDecisionData = buildStackedDecisionData(
    analytics.rows,
    getReservedCategory
  );

  const reservedBandDecisionData = buildStackedDecisionData(
    analytics.rows,
    getReservedBand
  );

  const sectorDecisionData = buildStackedDecisionData(analytics.rows, getCategory);

  const registeredDecisionData = buildRegisteredDecisionData(analytics.rows);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-slate-950/55 p-3 backdrop-blur-sm md:p-6">
      <div className="mx-auto flex h-full max-w-[1750px] flex-col overflow-hidden rounded-[34px] border border-white/60 bg-white/75 shadow-[0_40px_110px_rgba(15,23,42,0.35)] backdrop-blur-2xl">
        <div className="border-b border-white/80 bg-white/65 px-5 py-4 md:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <Sparkles size={13} />
                Application Analytics
              </div>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
                Startup Bihar Application Analysis
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Analytics is based on current selected filters. Showing{" "}
                <span className="font-semibold text-slate-800">
                  {analytics.total}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {analytics.allTotal || analytics.total}
                </span>{" "}
                loaded applications.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onDownloadExcel}
                disabled={!analytics.total || exporting}
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download size={16} />
                {exporting ? "Exporting..." : "Download Filtered Excel"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <X size={16} />
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gradient-to-br from-violet-50/80 via-cyan-50/70 to-rose-50/70 p-4 md:p-7">
          {analytics.total === 0 ? (
            <div className="flex min-h-[520px] items-center justify-center">
              <div className="max-w-md rounded-[30px] border border-white/80 bg-white/85 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-white">
                  <FileText size={24} />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  No data for analysis
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Change filters or refresh the application list.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                <StatCard
                  title="Filtered Total"
                  value={analytics.total}
                  subtitle={`${percent(
                    analytics.total,
                    analytics.allTotal
                  )} of loaded data`}
                  icon={FileText}
                  tone="violet"
                />

                <StatCard
                  title="AI Reviewed"
                  value={analytics.aiReviewed}
                  subtitle={`${analytics.aiPending} pending`}
                  icon={Bot}
                  tone="blue"
                />

                <StatCard
                  title="Pitch Call"
                  value={analytics.pitchCall}
                  subtitle={`${percent(
                    analytics.pitchCall,
                    analytics.aiReviewed
                  )} of reviewed`}
                  icon={BadgeCheck}
                  tone="mint"
                />

                <StatCard
                  title="Reserved Band"
                  value={analytics.reservedBandDecision}
                  subtitle={`${percent(
                    analytics.reservedBandDecision,
                    analytics.aiReviewed
                  )} of reviewed`}
                  icon={Sparkles}
                  tone="violet"
                />

                <StatCard
                  title="Rejected"
                  value={analytics.rejected}
                  subtitle={`${percent(
                    analytics.rejected,
                    analytics.aiReviewed
                  )} of reviewed`}
                  icon={AlertTriangle}
                  tone="orange"
                />

                <StatCard
                  title="Average AI Score"
                  value={
                    analytics.avgScore === null
                      ? "-"
                      : `${analytics.avgScore.toFixed(1)}/10`
                  }
                  subtitle={`${analytics.highScore} high score applications`}
                  icon={TrendingUp}
                  tone="amber"
                />
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <ChartCard
                  title="AI Review Coverage"
                  subtitle="Reviewed vs pending AI evaluation"
                  icon={Bot}
                  height="h-72"
                >
                  <Doughnut data={aiReviewData} options={doughnutOptions} />
                </ChartCard>

                <ChartCard
                  title="AI Decision Split"
                  subtitle="Only AI-reviewed applications. Pending reviews are excluded."
                  icon={PieChart}
                  height="h-72"
                >
                  <Doughnut data={aiDecisionData} options={doughnutOptions} />
                </ChartCard>

                <ChartCard
                  title="Gender Based Applications"
                  subtitle="Founder gender distribution"
                  icon={UserRoundCheck}
                  height="h-72"
                >
                  <Pie data={genderData} options={doughnutOptions} />
                </ChartCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <ChartCard
                  title="Gender Wise AI Decision"
                  subtitle="Only AI-reviewed applications. Pending reviews are excluded."
                  icon={Users}
                  height="h-96"
                >
                  <Bar data={genderDecisionData} options={stackedBarOptions} />
                </ChartCard>

                <ChartCard
                  title="Reserved Category Wise AI Decision"
                  subtitle="Only AI-reviewed applications. Pending reviews are excluded."
                  icon={BadgeCheck}
                  height="h-96"
                >
                  <Bar
                    data={reservedCategoryDecisionData}
                    options={stackedBarOptions}
                  />
                </ChartCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <ChartCard
                  title="Reserved Band"
                  subtitle="General, SC, ST, OBC, EBC, Minority and Women Founder grouping"
                  icon={BadgeCheck}
                  height="h-96"
                >
                  <Bar data={reservedBandData} options={baseChartOptions} />
                </ChartCard>

                <ChartCard
                  title="Reserved Band Wise AI Decision"
                  subtitle="Only AI-reviewed applications. Pending reviews are excluded."
                  icon={BadgeCheck}
                  height="h-96"
                >
                  <Bar
                    data={reservedBandDecisionData}
                    options={stackedBarOptions}
                  />
                </ChartCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <ChartCard
                  title="Rating Wise Startups"
                  subtitle="Only AI-reviewed applications. Score range distribution."
                  icon={TrendingUp}
                  height="h-80"
                >
                  <Bar data={scoreRangeData} options={baseChartOptions} />
                </ChartCard>

                <ChartCard
                  title="AI Score Band"
                  subtitle="High, medium and low score distribution"
                  icon={Sparkles}
                  height="h-80"
                >
                  <Bar data={aiBandData} options={baseChartOptions} />
                </ChartCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <ChartCard
                  title="Qualification Wise Founders"
                  subtitle="Founder qualification distribution"
                  icon={GraduationCap}
                  height="h-[430px]"
                >
                  <Bar data={qualificationData} options={horizontalBarOptions} />
                </ChartCard>

                <ChartCard
                  title="Team Size By Startups"
                  subtitle="Solo, 2–3, 4–5, 6–10 and 10+"
                  icon={Users}
                  height="h-[430px]"
                >
                  <Bar data={teamSizeData} options={horizontalBarOptions} />
                </ChartCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <ChartCard
                  title="Sector Wise AI Decision"
                  subtitle="Only AI-reviewed applications. Compares pitch call, reserved band and rejection."
                  icon={Layers3}
                  height="h-[460px]"
                >
                  <Bar
                    data={sectorDecisionData}
                    options={stackedHorizontalOptions}
                  />
                </ChartCard>

                <ChartCard
                  title="Registered Entity Wise AI Decision"
                  subtitle="Only AI-reviewed applications. Compares pitch call, reserved band and rejection."
                  icon={Building2}
                  height="h-[460px]"
                >
                  <Bar
                    data={registeredDecisionData}
                    options={stackedBarOptions}
                  />
                </ChartCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <ChartCard
                  title="Top Districts"
                  subtitle="District-wise application count"
                  icon={MapPin}
                  height="h-[430px]"
                >
                  <Bar data={districtData} options={horizontalBarOptions} />
                </ChartCard>

                <ChartCard
                  title="Top Sectors / Categories"
                  subtitle="Sector-wise application count"
                  icon={Layers3}
                  height="h-[430px]"
                >
                  <Bar data={sectorData} options={horizontalBarOptions} />
                </ChartCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <ChartCard
                  title="Startup Stage"
                  subtitle="Idea, prototype, validation, revenue and other stages"
                  icon={TrendingUp}
                  height="h-80"
                >
                  <Bar data={stageData} options={baseChartOptions} />
                </ChartCard>

                <ChartCard
                  title="Application Type"
                  subtitle="Funding, recognition and other application types"
                  icon={FileText}
                  height="h-80"
                >
                  <Bar data={applicationTypeData} options={baseChartOptions} />
                </ChartCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <ChartCard
                  title="State Wise Applications"
                  subtitle="State-wise application distribution"
                  icon={MapPin}
                  height="h-80"
                >
                  <Bar data={stateData} options={horizontalBarOptions} />
                </ChartCard>

                <ChartCard
                  title="Institution Wise Founders"
                  subtitle="Top institutions filled by founders"
                  icon={GraduationCap}
                  height="h-80"
                >
                  <Bar data={institutionData} options={horizontalBarOptions} />
                </ChartCard>
              </div>

              <div className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.09)] backdrop-blur-xl">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-600 text-white">
                      <Sparkles size={16} />
                    </div>

                    <h3 className="text-base font-bold text-slate-950">
                      Key Insights
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <InsightRow
                      label="Top District"
                      value={safe(analytics.topDistrict?.label)}
                      detail={`${analytics.topDistrict?.value || 0} applications`}
                    />

                    <InsightRow
                      label="Top Sector"
                      value={safe(analytics.topSector?.label)}
                      detail={`${analytics.topSector?.value || 0} applications`}
                    />

                    <InsightRow
                      label="Top Stage"
                      value={safe(analytics.topStage?.label)}
                      detail={`${analytics.topStage?.value || 0} applications`}
                    />

                    <InsightRow
                      label="Top Qualification"
                      value={safe(analytics.topQualification?.label)}
                      detail={`${analytics.topQualification?.value || 0} founders`}
                    />

                    <InsightRow
                      label="AI Pending"
                      value={analytics.aiPending}
                      detail={`${percent(
                        analytics.aiPending,
                        analytics.total
                      )} of filtered data`}
                    />
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.09)] backdrop-blur-xl">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500 text-white">
                      <AlertTriangle size={16} />
                    </div>

                    <h3 className="text-base font-bold text-slate-950">
                      Missing Data Summary
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <InsightRow
                      label="Gender Missing"
                      value={analytics.missingGender}
                      detail={`${percent(
                        analytics.missingGender,
                        analytics.total
                      )} of filtered`}
                    />

                    <InsightRow
                      label="Qualification Missing"
                      value={analytics.missingQualification}
                      detail={`${percent(
                        analytics.missingQualification,
                        analytics.total
                      )} of filtered`}
                    />

                    <InsightRow
                      label="District Missing"
                      value={analytics.missingDistrict}
                      detail={`${percent(
                        analytics.missingDistrict,
                        analytics.total
                      )} of filtered`}
                    />

                    <InsightRow
                      label="Stage Missing"
                      value={analytics.missingStage}
                      detail={`${percent(
                        analytics.missingStage,
                        analytics.total
                      )} of filtered`}
                    />

                    <InsightRow
                      label="Pitch Deck Missing"
                      value={analytics.missingPitchDeck}
                      detail={`${percent(
                        analytics.missingPitchDeck,
                        analytics.total
                      )} of filtered`}
                    />
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.09)] backdrop-blur-xl">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-teal-500 text-white">
                      <BadgeCheck size={16} />
                    </div>

                    <h3 className="text-base font-bold text-slate-950">
                      Decision Summary
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <InsightRow
                      label="Pitch Call"
                      value={analytics.pitchCall}
                      detail={`${percent(
                        analytics.pitchCall,
                        analytics.aiReviewed
                      )} of reviewed`}
                    />

                    <InsightRow
                      label="Reserved Band"
                      value={analytics.reservedBandDecision}
                      detail={`${percent(
                        analytics.reservedBandDecision,
                        analytics.aiReviewed
                      )} of reviewed`}
                    />

                    <InsightRow
                      label="Rejected"
                      value={analytics.rejected}
                      detail={`${percent(
                        analytics.rejected,
                        analytics.aiReviewed
                      )} of reviewed`}
                    />

                    <InsightRow
                      label="AI Reviewed"
                      value={analytics.aiReviewed}
                      detail={`${percent(
                        analytics.aiReviewed,
                        analytics.total
                      )} of filtered`}
                    />

                    <InsightRow
                      label="Registered Entity"
                      value={analytics.registered}
                      detail={`${percent(
                        analytics.registered,
                        analytics.total
                      )} of filtered`}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] border border-white/80 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.09)] backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-950">
                      Top AI Reviewed Startups
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Only applications with AI score are shown here.
                    </p>
                  </div>
                </div>

                <div className="overflow-auto rounded-2xl border border-slate-100">
                  <table className="min-w-[1100px] w-full">
                    <thead className="bg-slate-50">
                      <tr className="text-left text-xs uppercase tracking-[0.14em] text-slate-500">
                        <th className="px-4 py-3 font-semibold">Application</th>
                        <th className="px-4 py-3 font-semibold">Startup</th>
                        <th className="px-4 py-3 font-semibold">Founder</th>
                        <th className="px-4 py-3 font-semibold">Gender</th>
                        <th className="px-4 py-3 font-semibold">Reserved Band</th>
                        <th className="px-4 py-3 font-semibold">Qualification</th>
                        <th className="px-4 py-3 font-semibold">District</th>
                        <th className="px-4 py-3 font-semibold">Sector</th>
                        <th className="px-4 py-3 font-semibold">Decision</th>
                        <th className="px-4 py-3 font-semibold">Score</th>
                        <th className="px-4 py-3 font-semibold">Range</th>
                      </tr>
                    </thead>

                    <tbody>
                      {analytics.rows
                        .map((item) => ({
                          item,
                          score: getAIScore(item),
                        }))
                        .filter((x) => x.score !== null)
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 20)
                        .map(({ item, score }) => {
                          const band = getAIBand(score);
                          const range = getScoreRange(score);
                          const decision = getAIDecision(item);
                          const decisionClass =
                            DECISION_BADGE_CLASS[decision] ||
                            "border-slate-200 bg-slate-50 text-slate-700";

                          return (
                            <tr
                              key={item.id || item._applicationId}
                              className="border-t border-slate-100"
                            >
                              <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                                {safe(
                                  item._applicationId ||
                                    item.applicationId ||
                                    item.id
                                )}
                              </td>

                              <td className="px-4 py-3 text-sm text-slate-700">
                                {safe(getStartupName(item))}
                              </td>

                              <td className="px-4 py-3 text-sm text-slate-700">
                                {safe(getFounderName(item))}
                              </td>

                              <td className="px-4 py-3 text-sm text-slate-700">
                                {safe(getGender(item))}
                              </td>

                              <td className="px-4 py-3 text-sm text-slate-700">
                                {safe(getReservedBand(item))}
                              </td>

                              <td className="px-4 py-3 text-sm text-slate-700">
                                {safe(getQualification(item))}
                              </td>

                              <td className="px-4 py-3 text-sm text-slate-700">
                                {safe(getDistrict(item))}
                              </td>

                              <td className="px-4 py-3 text-sm text-slate-700">
                                {safe(getCategory(item))}
                              </td>

                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${decisionClass}`}
                                >
                                  {safe(decision)}
                                </span>
                              </td>

                              <td className="px-4 py-3 text-sm font-bold text-slate-950">
                                {score.toFixed(1)}/10
                              </td>

                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                                    band === "High"
                                      ? "border-teal-200 bg-teal-50 text-teal-700"
                                      : band === "Medium"
                                      ? "border-amber-200 bg-amber-50 text-amber-700"
                                      : "border-orange-200 bg-orange-50 text-orange-700"
                                  }`}
                                >
                                  {range}
                                </span>
                              </td>
                            </tr>
                          );
                        })}

                      {analytics.aiReviewed === 0 ? (
                        <tr>
                          <td
                            colSpan={11}
                            className="px-4 py-10 text-center text-sm text-slate-500"
                          >
                            No AI reviewed applications found in current filter.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}