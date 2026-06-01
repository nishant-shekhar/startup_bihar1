import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import {
  Search,
  RefreshCw,
  FileText,
  CircleCheckBig,
  Clock3,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Download,
  UserRound,
  CreditCard,
  ShieldCheck,
  XCircle,
  Eye,
  SlidersHorizontal,
  ReceiptText,
  BarChart3,
} from "lucide-react";

import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import {
  ssuCollectionPath,
  ssuDocPath,
  normalizeUtr,
} from "../registration/ssuFirebasePaths";
import SSUApplicationDetailDialog from "./SSUApplicationDetailDialog";
import PaymentVerification from "./PaymentVerification";
import SSUAnalytics from "./SSUAnalytics";

const PAGE_SIZE = 50;

const STATUS_OPTIONS = [
  "All",
  "draft",
  "payment_pending",
  "submitted",
  "under_review",
  "shortlisted",
  "selected",
  "waitlisted",
  "rejected",
];

const PAYMENT_OPTIONS = [
  "All",
  "pending",
  "verified",
  "rejected",
  "not_submitted",
];

const DECLARATION_OPTIONS = ["All", "Yes", "No"];

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

const formatDateTime = (value) => {
  if (!value) return "-";

  try {
    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (value?.seconds) {
      return new Date(value.seconds * 1000).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

const normalizeStatus = (value) => {
  return String(value || "draft").trim().toLowerCase();
};

const getApplicationId = (item, docId) => {
  return item?.applicationId || item?.applicationNo || docId || "-";
};

const getApplicantName = (item) => {
  return (
    item?.personalDetails?.fullName ||
    item?.userSignup?.fullName ||
    item?.fullName ||
    "-"
  );
};

const getEmail = (item) => {
  return (
    item?.personalDetails?.email ||
    item?.userSignup?.email ||
    item?.email ||
    "-"
  );
};

const getPhone = (item) => {
  return (
    item?.personalDetails?.phoneNumber ||
    item?.userSignup?.phoneNumber ||
    item?.phoneNumber ||
    "-"
  );
};

const getPostName = (item) => {
  return (
    item?.personalDetails?.postEligibilitySnapshot?.postName ||
    item?.personalDetails?.postAppliedFor ||
    item?.postAppliedFor ||
    "-"
  );
};

const getPostLevel = (item) => {
  return item?.personalDetails?.postEligibilitySnapshot?.level || "-";
};

const getPostCategory = (item) => {
  return item?.personalDetails?.postEligibilitySnapshot?.category || "-";
};

const getDistrict = (item) => {
  return item?.personalDetails?.presentDistrict || item?.district || "-";
};

const getCategory = (item) => {
  return item?.personalDetails?.category || "-";
};

const getCreatedAt = (item) => {
  return item?.createdAt || item?.submittedAt || item?.updatedAt || null;
};

const getSubmittedAt = (item) => {
  return item?.submittedAt || item?.finalSubmittedAt || null;
};

const getPaymentDetails = (item) => {
  return item?.paymentDetails || {};
};

const hasPaymentProof = (item) => {
  const payment = getPaymentDetails(item);

  return (
    !!payment?.paymentScreenshotMeta?.downloadURL ||
    !!payment?.utrNumber ||
    !!payment?.submittedAt
  );
};

const getPaymentAdminStatus = (item) => {
  const payment = getPaymentDetails(item);

  if (!hasPaymentProof(item)) return "not_submitted";

  return (
    payment?.adminVerification?.status ||
    payment?.verificationStatus ||
    "pending"
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

const statusToneMap = {
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  payment_pending: "border-amber-200 bg-amber-50 text-amber-700",
  submitted: "border-sky-200 bg-sky-50 text-sky-700",
  under_review: "border-indigo-200 bg-indigo-50 text-indigo-700",
  shortlisted: "border-cyan-200 bg-cyan-50 text-cyan-700",
  selected: "border-emerald-200 bg-emerald-50 text-emerald-700",
  waitlisted: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const paymentToneMap = {
  verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  not_submitted: "border-slate-200 bg-slate-100 text-slate-600",
};

function StatusBadge({ status }) {
  const key = normalizeStatus(status);

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        statusToneMap[key] || "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      {safe(key.replaceAll("_", " "))}
    </span>
  );
}

function PaymentBadge({ status }) {
  const key = String(status || "not_submitted").trim().toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        paymentToneMap[key] || paymentToneMap.not_submitted
      }`}
    >
      {safe(key.replaceAll("_", " "))}
    </span>
  );
}

function YesNoBadge({ value }) {
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
            {item === "All" ? "All" : String(item).replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function SSUMain() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [paymentVerificationOpen, setPaymentVerificationOpen] = useState(false);
  const [paymentVerificationInitialIndex, setPaymentVerificationInitialIndex] =
    useState(0);

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [postFilter, setPostFilter] = useState("All");
  const [declarationFilter, setDeclarationFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const q = query(
        collection(db, ...ssuCollectionPath.applications),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const rows = snapshot.docs.map((docItem) => {
        const data = docItem.data();

        return {
          id: docItem.id,
          ...data,
          _applicationId: getApplicationId(data, docItem.id),
          _status: normalizeStatus(data?.status),
          _paymentStatus: getPaymentAdminStatus(data),
          _applicantName: getApplicantName(data),
          _email: getEmail(data),
          _phone: getPhone(data),
          _postName: getPostName(data),
          _postLevel: getPostLevel(data),
          _postCategory: getPostCategory(data),
          _district: getDistrict(data),
          _category: getCategory(data),
          _createdAtDisplay: formatDate(getCreatedAt(data)),
          _submittedAtDisplay: formatDateTime(getSubmittedAt(data)),
          _hasDeclaration: hasFinalDeclaration(data),
        };
      });

      setApplications(rows);
    } catch (error) {
      console.error("Failed to load SSU applications", error);
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
      if (item._district && item._district !== "-") values.add(item._district);
    });

    return ["All", ...Array.from(values).sort()];
  }, [applications]);

  const posts = useMemo(() => {
    const values = new Set();

    applications.forEach((item) => {
      if (item._postName && item._postName !== "-") values.add(item._postName);
    });

    return ["All", ...Array.from(values).sort()];
  }, [applications]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return applications.filter((item) => {
      const searchable = [
        item._applicationId,
        item._applicantName,
        item._email,
        item._phone,
        item._postName,
        item._postLevel,
        item._postCategory,
        item._district,
        item._category,
        item?.paymentDetails?.utrNumber,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchable.includes(q);

      const matchesStatus =
        statusFilter === "All" || item._status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" || item._paymentStatus === paymentFilter;

      const matchesDistrict =
        districtFilter === "All" || item._district === districtFilter;

      const matchesPost = postFilter === "All" || item._postName === postFilter;

      const matchesDeclaration =
        declarationFilter === "All" ||
        (declarationFilter === "Yes" && item._hasDeclaration) ||
        (declarationFilter === "No" && !item._hasDeclaration);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesDistrict &&
        matchesPost &&
        matchesDeclaration
      );
    });
  }, [
    applications,
    search,
    statusFilter,
    paymentFilter,
    districtFilter,
    postFilter,
    declarationFilter,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    paymentFilter,
    districtFilter,
    postFilter,
    declarationFilter,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, currentPage]);

  const pageStart =
    filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const pageEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      submitted: applications.filter((a) => a._status === "submitted").length,
      drafts: applications.filter((a) => a._status === "draft").length,
      paymentPending: applications.filter((a) => a._paymentStatus === "pending")
        .length,
      paymentVerified: applications.filter(
        (a) => a._paymentStatus === "verified"
      ).length,
      rejected: applications.filter(
        (a) => a._status === "rejected" || a._paymentStatus === "rejected"
      ).length,
    };
  }, [applications]);

  const paymentQueue = useMemo(() => {
    return applications.filter(hasPaymentProof);
  }, [applications]);

  const pendingPaymentQueueCount = useMemo(() => {
    return paymentQueue.filter((item) => item._paymentStatus === "pending")
      .length;
  }, [paymentQueue]);

  const verifiedPaymentQueueCount = useMemo(() => {
    return paymentQueue.filter((item) => item._paymentStatus === "verified")
      .length;
  }, [paymentQueue]);

  const rejectedPaymentQueueCount = useMemo(() => {
    return paymentQueue.filter((item) => item._paymentStatus === "rejected")
      .length;
  }, [paymentQueue]);

  const openDetail = (item) => {
    setSelectedApplication(item);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedApplication(null);
  };

  const openPaymentVerification = (application = null) => {
    if (application) {
      const targetIndex = paymentQueue.findIndex(
        (item) => item.id === application.id
      );
      setPaymentVerificationInitialIndex(targetIndex >= 0 ? targetIndex : 0);
    } else {
      const firstPendingIndex = paymentQueue.findIndex(
        (item) => item._paymentStatus === "pending"
      );
      setPaymentVerificationInitialIndex(
        firstPendingIndex >= 0 ? firstPendingIndex : 0
      );
    }

    setPaymentVerificationOpen(true);
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

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setDistrictFilter("All");
    setPostFilter("All");
    setDeclarationFilter("All");
  };

  const exportApplicationsToExcel = () => {
    try {
      setExporting(true);

      const excelRows = filtered.map((item, index) => {
        const payment = item?.paymentDetails || {};
        const adminVerification = payment?.adminVerification || {};
        const postSnapshot =
          item?.personalDetails?.postEligibilitySnapshot || {};

        return {
          "S. No.": index + 1,
          "Application ID": safe(item._applicationId),
          "Applicant Name": safe(item._applicantName),
          Email: safe(item._email),
          Mobile: safe(item._phone),
          "Post Applied For": safe(item._postName),
          "Post Level": safe(item._postLevel),
          "Post Category": safe(item._postCategory),
          "ToR Qualification": safe(postSnapshot?.qualification),
          "ToR Experience": safe(postSnapshot?.experience),
          Emoluments: safe(postSnapshot?.emoluments),

          Status: safe(item._status),
          "Payment Status": safe(item._paymentStatus),
          "Payment Mode": safe(payment?.paymentMode),
          "Payment Amount": safe(payment?.amount),
          "Payment Date": safe(payment?.paymentDate),
          "UTR / Reference No.": safe(payment?.utrNumber),
          "UTR Verified": adminVerification?.utrVerified ? "Yes" : "No",
          "Payment Verified By": safe(adminVerification?.verifiedBy),
          "Payment Verified At": formatDateTime(adminVerification?.verifiedAt),
          "Payment Remarks": safe(adminVerification?.remarks),

          Gender: safe(item?.personalDetails?.gender),
          Category: safe(item?.personalDetails?.category),
          "Date of Birth": safe(item?.personalDetails?.dateOfBirth),
          Nationality: safe(item?.personalDetails?.nationality),
          "Father/Husband Name": safe(item?.personalDetails?.fathersName),
          "Mother Name": safe(item?.personalDetails?.mothersName),

          "Present Address": safe(item?.personalDetails?.presentAddress),
          "Present State": safe(item?.personalDetails?.presentState),
          "Present District": safe(item?.personalDetails?.presentDistrict),
          "Present Pincode": safe(item?.personalDetails?.presentPincode),

          "Permanent Address": safe(item?.personalDetails?.permanentAddress),
          "Permanent State": safe(item?.personalDetails?.permanentState),
          "Permanent District": safe(
            item?.personalDetails?.permanentDistrict
          ),
          "Permanent Pincode": safe(item?.personalDetails?.permanentPincode),

          "Total Experience": safe(item?.workExperience?.totalExperienceText),
          "Relevant Experience": safe(
            item?.workExperience?.relevantExperienceText
          ),
          "Education Declaration": item?.educationalQualifications
            ?.qualificationDeclaration
            ? "Yes"
            : "No",
          "Experience Declaration": item?.workExperience?.experienceDeclaration
            ? "Yes"
            : "No",
          "Final Declaration": item._hasDeclaration ? "Yes" : "No",

          "Submitted At": safe(item._submittedAtDisplay),
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
      XLSX.utils.book_append_sheet(workbook, worksheet, "SSU Applications");

      const now = new Date();
      const datePart = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      XLSX.writeFile(workbook, `ssu_recruitment_applications_${datePart}.xlsx`);
    } catch (error) {
      console.error("SSU Excel export failed", error);
      alert("Failed to export Excel file.");
    } finally {
      setExporting(false);
    }
  };

  const updatePaymentVerification = async ({
    applicationId,
    status,
    remarks,
    verifiedBy,
    utrVerified,
  }) => {
    if (!applicationId) {
      return {
        ok: false,
        error: "Application ID missing.",
      };
    }

    try {
      const targetApplication = applications.find(
        (item) => item.id === applicationId
      );

      if (!targetApplication) {
        return {
          ok: false,
          error: "Application not found in local list.",
        };
      }

      const payment = targetApplication?.paymentDetails || {};
      const normalizedUtr = normalizeUtr(payment?.utrNumber || "");

      if (!normalizedUtr) {
        return {
          ok: false,
          error: "UTR number is missing.",
        };
      }

      if (status === "verified") {
        const duplicateVerified = applications.find((item) => {
          if (item.id === applicationId) return false;

          const itemUtr = normalizeUtr(item?.paymentDetails?.utrNumber || "");
          const itemPaymentStatus =
            item?.paymentDetails?.adminVerification?.status ||
            item?.paymentDetails?.verificationStatus ||
            "pending";

          return (
            itemUtr === normalizedUtr && itemPaymentStatus === "verified"
          );
        });

        if (duplicateVerified) {
          return {
            ok: false,
            error: `This UTR is already verified in application ${
              duplicateVerified._applicationId || duplicateVerified.id
            }.`,
          };
        }
      }

      const appRef = doc(db, ...ssuCollectionPath.applications, applicationId);

      const nextApplicationStatus =
        status === "verified" ? "submitted" : "payment_pending";

      await updateDoc(appRef, {
        "paymentDetails.verificationStatus": status,
        "paymentDetails.verified": status === "verified",
        "paymentDetails.adminVerification.status": status,
        "paymentDetails.adminVerification.remarks": remarks || "",
        "paymentDetails.adminVerification.verifiedBy": verifiedBy || "admin",
        "paymentDetails.adminVerification.utrVerified":
          status === "verified" ? true : !!utrVerified,
        "paymentDetails.adminVerification.verifiedAt": serverTimestamp(),
        status: nextApplicationStatus,
        updatedAt: serverTimestamp(),
      });

      if (status === "verified") {
        await setDoc(
          doc(db, ...ssuDocPath.payment(normalizedUtr)),
          {
            utrNumber: payment?.utrNumber || normalizedUtr,
            normalizedUtr,
            applicationId,
            applicantName: getApplicantName(targetApplication),
            amount: payment?.amount || null,
            paymentDate: payment?.paymentDate || "",
            verificationStatus: "verified",
            verified: true,
            verifiedBy: verifiedBy || "admin",
            verifiedAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      await loadApplications();

      return { ok: true };
    } catch (error) {
      console.error("Payment verification update failed", error);
      return {
        ok: false,
        error: "Could not update payment verification.",
      };
    }
  };

  const handleDedicatedPaymentVerify = async ({
    application,
    remarks,
    verifiedBy,
  }) => {
    return updatePaymentVerification({
      applicationId: application?.id,
      status: "verified",
      remarks,
      verifiedBy,
      utrVerified: true,
    });
  };

  const handleDedicatedPaymentReject = async ({
    application,
    remarks,
    verifiedBy,
  }) => {
    return updatePaymentVerification({
      applicationId: application?.id,
      status: "rejected",
      remarks,
      verifiedBy,
      utrVerified: false,
    });
  };

  const updateApplicationStatus = async ({ applicationId, status }) => {
    if (!applicationId) {
      return {
        ok: false,
        error: "Application ID missing.",
      };
    }

    try {
      const appRef = doc(db, ...ssuCollectionPath.applications, applicationId);

      await updateDoc(appRef, {
        status,
        updatedAt: serverTimestamp(),
      });

      await loadApplications();

      return { ok: true };
    } catch (error) {
      console.error("Application status update failed", error);
      return {
        ok: false,
        error: "Could not update application status.",
      };
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
                  SSU Recruitment Admin
                </div>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                  SSU Recruitment Applications
                </h1>

                <p className="mt-2 max-w-3xl text-sm text-slate-500">
                  Review SSU recruitment applications, verify SBI Collect payment,
                  filter candidates, and download Excel reports.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={loadApplications}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={16}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
                <button
  onClick={() => setAnalyticsOpen(true)}
  disabled={loading || applications.length === 0}
  className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
>
  <BarChart3 size={16} />
  Analytics
</button>

                <button
                  onClick={() => openPaymentVerification()}
                  disabled={loading || paymentQueue.length === 0}
                  className="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ReceiptText size={16} />
                  Payment Verification
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
                    {pendingPaymentQueueCount}
                  </span>
                </button>

                <button
                  onClick={exportApplicationsToExcel}
                  disabled={loading || exporting || filtered.length === 0}
                  className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download size={16} />
                  {exporting ? "Exporting..." : "Download Excel"}
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 md:p-7">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              <SummaryCard
                title="Total Applications"
                value={stats.total}
                subtitle="All applications"
                icon={FileText}
                accent="amber"
              />
              <SummaryCard
                title="Submitted"
                value={stats.submitted}
                subtitle="Final submitted"
                icon={CircleCheckBig}
                accent="blue"
              />
              <SummaryCard
                title="Drafts"
                value={stats.drafts}
                subtitle="Not final submitted"
                icon={Clock3}
                accent="slate"
              />
              <SummaryCard
                title="Payment Pending"
                value={stats.paymentPending}
                subtitle="UTR verification pending"
                icon={CreditCard}
                accent="amber"
              />
              <SummaryCard
                title="Payment Verified"
                value={stats.paymentVerified}
                subtitle="Verified by admin"
                icon={ShieldCheck}
                accent="emerald"
              />
              <SummaryCard
                title="Rejected"
                value={stats.rejected}
                subtitle="Application/payment rejected"
                icon={XCircle}
                accent="rose"
              />
            </div>

            <div className="mt-6 rounded-[30px] border border-white/80 bg-white/78 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
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
                      placeholder="Search name, application ID, post, mobile, email, UTR..."
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
                  label="Payment"
                  value={paymentFilter}
                  onChange={setPaymentFilter}
                  options={PAYMENT_OPTIONS}
                />

                <FilterSelect
                  label="District"
                  value={districtFilter}
                  onChange={setDistrictFilter}
                  options={districts}
                />

                <FilterSelect
                  label="Declaration"
                  value={declarationFilter}
                  onChange={setDeclarationFilter}
                  options={DECLARATION_OPTIONS}
                />
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-6">
                <div className="xl:col-span-2">
                  <FilterSelect
                    label="Post Applied For"
                    value={postFilter}
                    onChange={setPostFilter}
                    options={posts}
                  />
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <SlidersHorizontal size={16} />
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

                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  Payment Pending: {pendingPaymentQueueCount}
                </span>

                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  Payment Verified: {verifiedPaymentQueueCount}
                </span>

                <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                  Payment Rejected: {rejectedPaymentQueueCount}
                </span>

                {paymentFilter !== "All" ? (
                  <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                    Payment: {paymentFilter.replaceAll("_", " ")}
                  </span>
                ) : null}

                {postFilter !== "All" ? (
                  <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                    Post: {postFilter}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[32px] border border-white/80 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Applications
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Click any row to open structured application details.
                </p>
              </div>

              <div className="overflow-auto">
                <table className="min-w-[1580px] w-full">
                  <thead className="bg-slate-50/80">
                    <tr className="text-left text-xs uppercase tracking-[0.14em] text-slate-500">
                      <th className="px-5 py-4 font-semibold">
                        Application ID
                      </th>
                      <th className="px-5 py-4 font-semibold">Applicant</th>
                      <th className="px-5 py-4 font-semibold">Post</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 font-semibold">Payment</th>
                      <th className="px-5 py-4 font-semibold">UTR</th>
                      <th className="px-5 py-4 font-semibold">District</th>
                      <th className="px-5 py-4 font-semibold">Category</th>
                      <th className="px-5 py-4 font-semibold">Declaration</th>
                      <th className="px-5 py-4 font-semibold">Submitted</th>
                      <th className="px-5 py-4 font-semibold">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      Array.from({ length: 8 }).map((_, index) => (
                        <tr key={index} className="border-t border-slate-100">
                          {Array.from({ length: 11 }).map((__, i) => (
                            <td key={i} className="px-5 py-4">
                              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="px-6 py-16 text-center">
                          <div className="mx-auto max-w-md">
                            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                              <FileText size={22} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800">
                              No applications found
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                              Try changing the filters or search value.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((item) => {
                        const payment = item?.paymentDetails || {};

                        return (
                          <tr
                            key={item.id}
                            onClick={() => openDetail(item)}
                            className="cursor-pointer border-t border-slate-100 transition hover:bg-amber-50/40"
                          >
                            <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                              {safe(item._applicationId)}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {item?.personalDetails?.profilePhotoMeta
                                  ?.downloadURL ? (
                                  <img
                                    src={
                                      item.personalDetails.profilePhotoMeta
                                        .downloadURL
                                    }
                                    alt={item._applicantName}
                                    className="h-10 w-10 rounded-2xl border border-slate-200 object-cover"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                    <UserRound size={18} />
                                  </div>
                                )}

                                <div>
                                  <div className="text-sm font-semibold text-slate-900">
                                    {safe(item._applicantName)}
                                  </div>
                                  <div className="mt-1 text-xs text-slate-500">
                                    {safe(item._email)} • {safe(item._phone)}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="text-sm font-semibold text-slate-900">
                                {safe(item._postName)}
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                {safe(item._postLevel)} •{" "}
                                {safe(item._postCategory)}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <StatusBadge status={item._status} />
                            </td>

                            <td className="px-5 py-4">
                              <PaymentBadge status={item._paymentStatus} />
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-700">
                              {safe(payment?.utrNumber)}
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-700">
                              {safe(item._district)}
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-700">
                              {safe(item._category)}
                            </td>

                            <td className="px-5 py-4">
                              <YesNoBadge value={item._hasDeclaration} />
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-700">
                              {safe(item._submittedAtDisplay)}
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDetail(item);
                                  }}
                                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                                >
                                  <Eye size={14} />
                                  View
                                </button>

                                {item._paymentStatus !== "not_submitted" ? (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openPaymentVerification(item);
                                    }}
                                    className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-100"
                                  >
                                    <ReceiptText size={14} />
                                    Verify
                                  </button>
                                ) : null}
                              </div>
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
                    Showing <span className="font-semibold">{pageStart}</span>{" "}
                    to <span className="font-semibold">{pageEnd}</span> of{" "}
                    <span className="font-semibold">{filtered.length}</span>{" "}
                    entries
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

                    {currentPage > 3 ? (
                      <>
                        <button
                          onClick={() => goToPage(1)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                          1
                        </button>
                        {currentPage > 4 ? (
                          <span className="px-1 text-sm text-slate-400">
                            ...
                          </span>
                        ) : null}
                      </>
                    ) : null}

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

                    {currentPage < totalPages - 2 ? (
                      <>
                        {currentPage < totalPages - 3 ? (
                          <span className="px-1 text-sm text-slate-400">
                            ...
                          </span>
                        ) : null}
                        <button
                          onClick={() => goToPage(totalPages)}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                          {totalPages}
                        </button>
                      </>
                    ) : null}

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

      <SSUApplicationDetailDialog
        open={detailOpen}
        application={selectedApplication}
        onClose={closeDetail}
        onPaymentVerificationUpdate={updatePaymentVerification}
        onStatusUpdate={updateApplicationStatus}
      />

      <PaymentVerification
        open={paymentVerificationOpen}
        applications={applications}
        initialIndex={paymentVerificationInitialIndex}
        onClose={() => setPaymentVerificationOpen(false)}
        onVerify={handleDedicatedPaymentVerify}
        onReject={handleDedicatedPaymentReject}
      />
      <SSUAnalytics
  open={analyticsOpen}
  applications={applications}
  onClose={() => setAnalyticsOpen(false)}
/>
    </div>
  );
}