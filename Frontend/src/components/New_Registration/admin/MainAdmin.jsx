import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
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
  Sparkles,
  MessageSquareText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import FeedbackList from "./FeedBackList";
import DetailDialog from "./DetailDialog";

const PAGE_SIZE = 50;

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

export default function NewApplicationDashboard() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [registeredFilter, setRegisteredFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

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

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRegistered &&
        matchesDistrict
      );
    });
  }, [applications, search, statusFilter, registeredFilter, districtFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, registeredFilter, districtFilter]);

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
      submitted: applications.filter((a) => a._status === "submitted" || a._status === "Submitted").length,
      review: applications.filter((a) => a._status === "Under Review").length,
      approved: applications.filter((a) => a._status === "Approved").length,
      registered: applications.filter((a) => a._registeredCompany).length,
    };
  }, [applications]);

  const handleRowClick = (item) => {
    setSelected(item);
    setDialogOpen(true);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages]);

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

              <div className="flex flex-wrap gap-3">
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
                  Showing {pageStart}-{pageEnd} of {filtered.length}
                </span>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                  Page {currentPage} of {totalPages}
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
                    ) : paginatedRows.length === 0 ? (
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
                      paginatedRows.map((item) => (
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

      <FeedbackList
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
      />
    </div>
  );
}