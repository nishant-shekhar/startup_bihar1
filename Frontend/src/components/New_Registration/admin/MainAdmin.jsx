import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  orderBy,
  query,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, get } from "firebase/database";
import * as XLSX from "xlsx";
import {
  Search,
  RefreshCw,
  FileText,
  Building2,
  CircleCheckBig,
  Clock3,
  Sparkles,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
  Download,
  Bot,
  BarChart3,
  Star,
} from "lucide-react";

import { db, rtdb } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import FeedbackList from "./FeedBackList";
import DetailDialog from "./DetailDialog";
import AIEvaluationModal from "./AIEvaluationModal";
import Analysis from "./Analysis";

const PAGE_SIZE = 50;
const AI_MONTH_KEY = "April";

const STATUS_OPTIONS = [
  "All",
  "submitted",
  "Under Review",
  "Approved",
  "Rejected",
  "draft",
];

const REGISTERED_OPTIONS = ["All", "Yes", "No"];
const AI_REVIEW_OPTIONS = ["All", "Yes", "No"];
const EXPERT_REVIEW_OPTIONS = ["All", "Yes", "No"];

const safe = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  return String(value);
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
  item?.userSignup?.email || item?.email || item?.basicDetails?.email || "-";

const getPhone = (item) =>
  item?.userSignup?.phoneNumber || item?.phoneNumber || item?.mobile || "-";

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

const getCreatedAt = (item) =>
  item?.createdAt || item?.submittedAt || item?.firestoreUpdatedAt || null;

const hasAIReview = (item) => item?.aiEvaluation?.done === true;

const getAIScore = (item) => {
  const score = item?.aiEvaluation?.finalScore;
  return score === null || score === undefined || score === "" ? null : Number(score);
};

const getAIScoreBand = (score) => {
  const n = Number(score);
  if (!Number.isFinite(n)) return "unknown";
  if (n >= 7.5) return "high";
  if (n >= 5.5) return "medium";
  return "low";
};

const getExpertReview = (item) => item?._expertReview || item?.review?.expert || null;

const getExpertScore = (item) => {
  const review = getExpertReview(item);
  const score =
    review?.score ??
    review?.finalScore ??
    review?.initialScore ??
    review?.firstScore ??
    null;

  return score === null || score === undefined || score === "" ? null : Number(score);
};

const getExpertInitialScore = (item) => {
  const review = getExpertReview(item);
  const score = review?.firstScore ?? review?.initialScore ?? null;
  return score === null || score === undefined || score === "" ? null : Number(score);
};

const getExpertFinalScore = (item) => {
  const review = getExpertReview(item);
  const score = review?.score ?? review?.finalScore ?? null;
  return score === null || score === undefined || score === "" ? null : Number(score);
};

const hasExpertReview = (item) => getExpertScore(item) !== null;

const statusToneMap = {
  submitted: "border-sky-200 bg-sky-50 text-sky-700",
  Submitted: "border-sky-200 bg-sky-50 text-sky-700",
  "Under Review": "border-amber-200 bg-amber-50 text-amber-700",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700",
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  Draft: "border-slate-200 bg-slate-100 text-slate-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        statusToneMap[status] || "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      {safe(status)}
    </span>
  );
}

function RegisteredBadge({ value }) {
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
    violet: "from-violet-50 via-white to-indigo-50",
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

function AIScoreBadge({ score, isDraft }) {
  if (isDraft) {
    return (
      <span className="inline-flex min-w-[82px] items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
        Draft
      </span>
    );
  }

  if (score === null || score === undefined || score === "") {
    return (
      <span className="inline-flex min-w-[82px] items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
        —
      </span>
    );
  }

  const n = Number(score);
  const tone =
    n >= 7.5
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : n >= 5.5
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <span
      className={`inline-flex min-w-[82px] items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}
    >
      {Number.isFinite(n) ? n.toFixed(1) : "—"}/10
    </span>
  );
}

function ScoreBadge({ score, emptyText = "—" }) {
  if (score === null || score === undefined || score === "") {
    return (
      <span className="inline-flex min-w-[82px] items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
        {emptyText}
      </span>
    );
  }

  const n = Number(score);
  const tone =
    n >= 8
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : n >= 6
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <span
      className={`inline-flex min-w-[82px] items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}
    >
      {Number.isFinite(n) ? n.toFixed(1) : emptyText}/10
    </span>
  );
}

export default function NewApplicationDashboard() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [registeredFilter, setRegisteredFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [aiReviewedFilter, setAiReviewedFilter] = useState("All");
  const [expertReviewedFilter, setExpertReviewedFilter] = useState("All");
  const [aiScoreMinFilter, setAiScoreMinFilter] = useState("");
  const [expertScoreMinFilter, setExpertScoreMinFilter] = useState("");

  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalApplication, setAiModalApplication] = useState(null);
  const [analysisOpen, setAnalysisOpen] = useState(false);

  const [backfillState, setBackfillState] = useState({
    running: false,
    total: 0,
    done: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    current: "",
    message: "",
  });

  const loadApplications = async () => {
    setLoading(true);

    try {
      const q = query(
        collection(db, "startupApplications"),
        orderBy("createdAt", "desc")
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

      const enrichedRows = await Promise.all(
        rows.map(async (item) => {
          try {
            const expertReviewRef = doc(
              db,
              "startupApplications",
              item.id,
              "review",
              "expert"
            );

            const expertReviewSnap = await getDoc(expertReviewRef);

            return {
              ...item,
              _expertReview: expertReviewSnap.exists()
                ? expertReviewSnap.data()
                : null,
            };
          } catch (error) {
            console.warn("Expert review fetch failed:", item.id, error);
            return {
              ...item,
              _expertReview: null,
            };
          }
        })
      );

      setApplications(enrichedRows);
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

  const syncExistingAIReviewsToFirestore = async () => {
    if (backfillState.running) return;

    const rows = applications || [];
    if (!rows.length) {
      alert("No applications loaded.");
      return;
    }

    setBackfillState({
      running: true,
      total: rows.length,
      done: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      current: "",
      message: "Checking RTDB and syncing AI summaries to Firestore...",
    });

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i += 1) {
      const item = rows[i];
      const sbNo = String(item?._applicationId || "");
      const docId = String(item?.id || "");
      const isDraft = String(item?._status || "").toLowerCase() === "draft";

      setBackfillState((prev) => ({
        ...prev,
        done: i,
        updated,
        skipped,
        failed,
        current: sbNo || docId || `row-${i + 1}`,
      }));

      if (!sbNo || !docId || isDraft) {
        skipped += 1;
        continue;
      }

      try {
        const snap = await get(ref(rtdb, `/startupAIReview/${AI_MONTH_KEY}/${sbNo}`));

        if (!snap.exists()) {
          skipped += 1;
          continue;
        }

        const val = snap.val() || {};
        const result = val?.result || val?.api?.response || {};
        const evaluation = val?.evaluation || {};

        const finalScoreRaw =
          evaluation?.finalScore ??
          result?.overall_score ??
          val?.api?.response?.overall_score ??
          null;

        const finalScore =
          finalScoreRaw === null ||
          finalScoreRaw === undefined ||
          finalScoreRaw === ""
            ? null
            : Number(finalScoreRaw);

        const payload = {
          aiEvaluation: {
            done: true,
            finalScore,
            scoreBand: getAIScoreBand(finalScore),
            decision: result?.decision ?? evaluation?.decision ?? null,
            startupQuality: result?.startup_quality ?? null,
            monthKey: AI_MONTH_KEY,
            source: "rtdb_backfill",
            sourcePath: `/startupAIReview/${AI_MONTH_KEY}/${sbNo}`,
            reviewedAtMs: val?.updatedAt_ms ?? val?.updatedAt ?? null,
            syncedAt: serverTimestamp(),
          },
          firestoreUpdatedAt: serverTimestamp(),
        };

        await updateDoc(doc(db, "startupApplications", docId), payload);
        updated += 1;
      } catch (error) {
        console.error(`Backfill failed for ${sbNo}`, error);
        failed += 1;
      }

      setBackfillState((prev) => ({
        ...prev,
        done: i + 1,
        updated,
        skipped,
        failed,
        current: sbNo || docId || `row-${i + 1}`,
      }));

      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    setBackfillState((prev) => ({
      ...prev,
      running: false,
      done: rows.length,
      updated,
      skipped,
      failed,
      message: `Completed. Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`,
    }));

    await loadApplications();
  };

  const districts = useMemo(() => {
    const values = new Set();

    applications.forEach((item) => {
      const district = getDistrict(item);
      if (district && district !== "-") values.add(district);
    });

    return ["All", ...Array.from(values).sort()];
  }, [applications]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const aiScoreMin = Number(aiScoreMinFilter);
    const expertScoreMin = Number(expertScoreMinFilter);

    return applications.filter((item) => {
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

      const aiReviewed = hasAIReview(item);
      const expertReviewed = hasExpertReview(item);

      const matchesAIReviewed =
        aiReviewedFilter === "All" ||
        (aiReviewedFilter === "Yes" && aiReviewed) ||
        (aiReviewedFilter === "No" && !aiReviewed);

      const matchesExpertReviewed =
        expertReviewedFilter === "All" ||
        (expertReviewedFilter === "Yes" && expertReviewed) ||
        (expertReviewedFilter === "No" && !expertReviewed);

      const aiScore = getAIScore(item);
      const expertScore = getExpertScore(item);

      const matchesAIScoreMin =
        !aiScoreMinFilter ||
        (Number.isFinite(aiScoreMin) &&
          aiScore !== null &&
          Number(aiScore) >= aiScoreMin);

      const matchesExpertScoreMin =
        !expertScoreMinFilter ||
        (Number.isFinite(expertScoreMin) &&
          expertScore !== null &&
          Number(expertScore) >= expertScoreMin);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRegistered &&
        matchesDistrict &&
        matchesAIReviewed &&
        matchesExpertReviewed &&
        matchesAIScoreMin &&
        matchesExpertScoreMin
      );
    });
  }, [
    applications,
    search,
    statusFilter,
    registeredFilter,
    districtFilter,
    aiReviewedFilter,
    expertReviewedFilter,
    aiScoreMinFilter,
    expertScoreMinFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    registeredFilter,
    districtFilter,
    aiReviewedFilter,
    expertReviewedFilter,
    aiScoreMinFilter,
    expertScoreMinFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, currentPage]);

  const pageStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const pageEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      submitted: applications.filter(
        (a) => a._status === "submitted" || a._status === "Submitted"
      ).length,
      review: applications.filter((a) => a._status === "Under Review").length,
      approved: applications.filter((a) => a._status === "Approved").length,
      registered: applications.filter((a) => a._registeredCompany).length,
      expertScored: applications.filter((a) => hasExpertReview(a)).length,
    };
  }, [applications]);

  const handleRowClick = (item) => {
    setSelected(item);
    setDialogOpen(true);
  };

  const openAIModal = (item) => {
    const isDraft = String(item?._status || "").toLowerCase() === "draft";
    const reviewed = hasAIReview(item);
    if (isDraft || !reviewed) return;

    setAiModalApplication(item);
    setAiModalOpen(true);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  const exportApplicationsToExcel = () => {
    try {
      setExporting(true);

      const excelRows = filtered.map((item, index) => {
        const expertReview = getExpertReview(item);

        return {
          "S. No.": index + 1,
          "Application ID": safe(item._applicationId),
          "Startup Name": safe(getStartupName(item)),
          "Founder Name": safe(getFounderName(item)),
          Email: safe(getEmail(item)),
          Phone: safe(getPhone(item)),
          Status: safe(item._status),
          "Registered Company": item._registeredCompany ? "Yes" : "No",

          "AI Reviewed": hasAIReview(item) ? "Yes" : "No",
          "AI Score":
            String(item?._status || "").toLowerCase() === "draft"
              ? "Draft"
              : getAIScore(item) ?? "-",
          "AI Score Band": safe(item?.aiEvaluation?.scoreBand),
          "AI Decision": safe(item?.aiEvaluation?.decision),
          "AI Startup Quality": safe(item?.aiEvaluation?.startupQuality),
          "AI Reviewed At (ms)": safe(item?.aiEvaluation?.reviewedAtMs),

          "Expert Reviewed": hasExpertReview(item) ? "Yes" : "No",
          "Expert Score": getExpertScore(item) ?? "-",
          "Expert Initial Score": getExpertInitialScore(item) ?? "-",
          "Expert Final Score": getExpertFinalScore(item) ?? "-",
          "Expert Comment": safe(expertReview?.comment),
          "Expert First Comment": safe(expertReview?.firstComment),
          "Expert Reviewer ID": safe(expertReview?.reviewerId),
          "Expert Score Revised": expertReview?.scoreRevised === true ? "Yes" : "No",
          "Expert AI Viewed": expertReview?.aiEvaluationViewed === true ? "Yes" : "No",
          "Score Changed After AI View":
            expertReview?.scoreChangedAfterAIView === true ? "Yes" : "No",

          "Application Type": safe(
            item?.userSignup?.applicationType || item?.applicationType
          ),
          "Sector / Category": safe(getCategory(item)),
          Stage: safe(getStage(item)),
          "Team Size": safe(item?.startupDetails?.teamSize),
          Website: safe(item?.startupDetails?.website),
          District: safe(getDistrict(item)),
          State: safe(item?.basicDetails?.state || item?.entityDetails?.state),
          "Block Name": safe(item?.basicDetails?.blockName),
          Pincode: safe(item?.basicDetails?.pincode),
          "Applicant Address": safe(item?.basicDetails?.applicantAddress),
          Gender: safe(item?.basicDetails?.gender),
          Category: safe(item?.basicDetails?.category),
          "Date of Birth": safe(item?.basicDetails?.dateOfBirth),
          Qualification: safe(item?.basicDetails?.qualification),
          Institution:
            item?.basicDetails?.institution === "Other"
              ? safe(item?.basicDetails?.otherInstitution)
              : safe(item?.basicDetails?.institution),
          "LinkedIn Profile": safe(item?.basicDetails?.linkedinProfile),

          "Has Registered Entity": item?._registeredCompany ? "Yes" : "No",
          "Entity Name": safe(item?.entityDetails?.entityName),
          "Entity Type": safe(item?.entityDetails?.entityType),
          "Entity Registration Number": safe(
            item?.entityDetails?.entityRegistrationNumber || item?.registrationNumber
          ),
          "Date of Registration": safe(item?.entityDetails?.dateOfRegistration),
          "Business Address": safe(item?.entityDetails?.businessAddress),

          "Problem Statement": safe(item?.businessIdea?.problemStatement),
          Solution: safe(item?.businessIdea?.solution),
          Innovation: safe(item?.businessIdea?.innovation),
          "Business Model": safe(item?.businessIdea?.businessModel),

          "Pitch Deck File Name": safe(item?.businessIdea?.pitchDeckMeta?.fileName),
          "Pitch Deck URL": safe(item?.businessIdea?.pitchDeckMeta?.downloadURL),

          "Profile Photo File Name": safe(
            item?.basicDetails?.profilePhotoMeta?.fileName
          ),
          "Profile Photo URL": safe(
            item?.basicDetails?.profilePhotoMeta?.downloadURL
          ),

          "Entity Certificate File Name": safe(
            item?.entityDetails?.certificateMeta?.fileName
          ),
          "Entity Certificate URL": safe(
            item?.entityDetails?.certificateMeta?.downloadURL
          ),

          "Co-Founder Count": Array.isArray(item?.cofounderDetails?.coFounders)
            ? item.cofounderDetails.coFounders.length
            : 0,
          "Is Sole Founder": item?.cofounderDetails?.isSoleFounder ? "Yes" : "No",
          "Co-Founders": Array.isArray(item?.cofounderDetails?.coFounders)
            ? item.cofounderDetails.coFounders
                .map((cf, idx) => {
                  const parts = [
                    `#${idx + 1}`,
                    cf?.name || "-",
                    cf?.email || "-",
                    cf?.phoneNumber || "-",
                    cf?.qualification || "-",
                  ];
                  return parts.join(" | ");
                })
                .join(" || ")
            : "-",

          "Feedback Submitted":
            item?.websiteFeedback?.submitted === true ? "Yes" : "No",
          "Feedback Experience": safe(item?.websiteFeedback?.experience),
          "Feedback Rating": safe(item?.websiteFeedback?.rating),
          "Feedback Message": safe(item?.websiteFeedback?.message),
          "Feedback Submitted At": formatDate(item?.websiteFeedback?.submittedAt),

          "Aadhar Number": safe(item?.userSignup?.aadharNumber),
          "Created At": safe(item._createdAtDisplay),
          "Firestore Doc ID": safe(item.id),
        };
      });

      if (excelRows.length === 0) {
        alert("No filtered applications available to export.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

      const now = new Date();
      const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(now.getDate()).padStart(2, "0")}`;

      XLSX.writeFile(workbook, `startup_applications_filtered_${datePart}.xlsx`);
    } catch (error) {
      console.error("Excel export failed", error);
      alert("Failed to export Excel file.");
    } finally {
      setExporting(false);
    }
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
                  Incoming startup applications, AI scores, expert scores, and filtered Excel export.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={loadApplications}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>

                <button
                  onClick={syncExistingAIReviewsToFirestore}
                  disabled={loading || backfillState.running || applications.length === 0}
                  className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Bot size={16} />
                  {backfillState.running ? "Syncing AI Reviews..." : "Sync AI Reviews"}
                </button>

                <button
                  onClick={() => setAnalysisOpen(true)}
                  disabled={loading || filtered.length === 0}
                  className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <BarChart3 size={16} />
                  Analysis
                </button>

                <button
                  onClick={exportApplicationsToExcel}
                  disabled={loading || exporting || filtered.length === 0}
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download size={16} />
                  {exporting ? "Exporting..." : "Download Excel"}
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
          </div>

          <div className="p-5 md:p-7">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
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
              <SummaryCard
                title="Expert Scored"
                value={stats.expertScored}
                subtitle="Expert score submitted"
                icon={Star}
                accent="violet"
              />
            </div>

            <div className="mt-6 rounded-[30px] border border-white/80 bg-white/78 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-8">
                <div className="xl:col-span-2">
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

                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={STATUS_OPTIONS}
                />

                <FilterSelect
                  label="Registered"
                  value={registeredFilter}
                  onChange={setRegisteredFilter}
                  options={REGISTERED_OPTIONS}
                />

                <FilterSelect
                  label="District"
                  value={districtFilter}
                  onChange={setDistrictFilter}
                  options={districts}
                />

                <FilterSelect
                  label="AI Reviewed"
                  value={aiReviewedFilter}
                  onChange={setAiReviewedFilter}
                  options={AI_REVIEW_OPTIONS}
                />

                <FilterSelect
                  label="Expert Reviewed"
                  value={expertReviewedFilter}
                  onChange={setExpertReviewedFilter}
                  options={EXPERT_REVIEW_OPTIONS}
                />

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    AI Score ≥
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={aiScoreMinFilter}
                    onChange={(e) => setAiScoreMinFilter(e.target.value)}
                    placeholder="8.2"
                    className="w-full rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                  />
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-8">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Expert Score ≥
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={expertScoreMinFilter}
                    onChange={(e) => setExpertScoreMinFilter(e.target.value)}
                    placeholder="7.6"
                    className="w-full rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setRegisteredFilter("All");
                    setDistrictFilter("All");
                    setAiReviewedFilter("All");
                    setExpertReviewedFilter("All");
                    setAiScoreMinFilter("");
                    setExpertScoreMinFilter("");
                  }}
                  className="mt-6 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Clear Filters
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Sparkles size={12} />
                  Showing {pageStart}-{pageEnd} of {filtered.length}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                  Page {currentPage} of {totalPages}
                </span>
                {aiScoreMinFilter ? (
                  <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    AI Score ≥ {aiScoreMinFilter}
                  </span>
                ) : null}
                {expertScoreMinFilter ? (
                  <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                    Expert Score ≥ {expertScoreMinFilter}
                  </span>
                ) : null}
              </div>
            </div>

            {backfillState.total > 0 ? (
              <div className="mt-6 rounded-[28px] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      AI Review Firestore Sync
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {backfillState.message || "-"}
                    </div>
                  </div>

                  <div className="text-xs text-slate-600">
                    Current:{" "}
                    <span className="font-semibold">
                      {backfillState.current || "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {backfillState.done}/{backfillState.total}
                    </span>
                    <span>
                      {backfillState.total
                        ? Math.round((backfillState.done / backfillState.total) * 100)
                        : 0}
                      %
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{
                        width: `${
                          backfillState.total
                            ? (backfillState.done / backfillState.total) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                      Updated: {backfillState.updated}
                    </span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                      Skipped: {backfillState.skipped}
                    </span>
                    <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 font-semibold text-rose-700">
                      Failed: {backfillState.failed}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

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
                <table className="min-w-[1650px] w-full">
                  <thead className="bg-slate-50/80">
                    <tr className="text-left text-xs uppercase tracking-[0.14em] text-slate-500">
                      <th className="px-5 py-4 font-semibold">Application ID</th>
                      <th className="px-5 py-4 font-semibold">Startup</th>
                      <th className="px-5 py-4 font-semibold">Founder</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">AI Score</th>
                      <th className="px-5 py-4 font-semibold">Expert Score</th>

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
                          {Array.from({ length: 13 }).map((__, i) => (
                            <td key={i} className="px-5 py-4">
                              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="px-6 py-16 text-center">
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
                      paginatedRows.map((item) => {
                        const isDraft =
                          String(item?._status || "").toLowerCase() === "draft";

                        return (
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

                            <td
                              className="px-5 py-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAIModal(item);
                              }}
                            >
                              <button
                                type="button"
                                disabled={isDraft || !hasAIReview(item)}
                                className={`inline-flex items-center gap-2 rounded-xl transition ${
                                  isDraft || !hasAIReview(item)
                                    ? "cursor-not-allowed opacity-80"
                                    : "hover:scale-[1.02]"
                                }`}
                              >
                                <Bot size={14} className="text-slate-500" />
                                <AIScoreBadge score={getAIScore(item)} isDraft={isDraft} />
                              </button>
                            </td>

                            <td className="px-5 py-4">
                              <ScoreBadge score={getExpertScore(item)} />
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
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {!loading && filtered.length > 0 ? (
                <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
                  <div className="text-sm text-slate-600">
                    Showing <span className="font-semibold">{pageStart}</span> to{" "}
                    <span className="font-semibold">{pageEnd}</span> of{" "}
                    <span className="font-semibold">{filtered.length}</span> entries
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ChevronLeft size={16} />
                      Prev
                    </button>

                    {currentPage > 3 && (
                      <>
                        <button
                          onClick={() => goToPage(1)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                          1
                        </button>
                        {currentPage > 4 && (
                          <span className="px-1 text-sm text-slate-400">...</span>
                        )}
                      </>
                    )}

                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`rounded-xl px-3 py-2 text-sm font-semibold shadow-sm transition ${
                          currentPage === page
                            ? "border border-slate-900 bg-slate-900 text-white"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className="px-1 text-sm text-slate-400">...</span>
                        )}
                        <button
                          onClick={() => goToPage(totalPages)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <DetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        application={selected}
        getStartupName={getStartupName}
        getFounderName={getFounderName}
        getEmail={getEmail}
        getPhone={getPhone}
        getDistrict={getDistrict}
        getCategory={getCategory}
        getStage={getStage}
      />

      <AIEvaluationModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        application={aiModalApplication}
        startupId={aiModalApplication?._applicationId}
        startupName={aiModalApplication ? getStartupName(aiModalApplication) : ""}
      />

      <Analysis
        open={analysisOpen}
        onClose={() => setAnalysisOpen(false)}
        applications={filtered}
        allApplications={applications}
        onDownloadExcel={exportApplicationsToExcel}
        exporting={exporting}
      />

      <FeedbackList
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
      />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-white/80 bg-white/85 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}