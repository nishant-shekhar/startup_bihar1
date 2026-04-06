import React, { useEffect, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import {
  X,
  MessageSquareText,
  Search,
  RefreshCw,
  Star,
  CalendarDays,
  User2,
  Building2,
  Filter,
  BarChart3,
  TrendingUp,
  MessagesSquare,
} from "lucide-react";
import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";

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

function RatingStars({ value = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Number(value)
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300"
          }
        />
      ))}
    </div>
  );
}

function SummaryMetricCard({ icon: Icon, label, value, subtitle, tone = "slate" }) {
  const toneMap = {
    slate: "from-white via-white to-slate-50",
    amber: "from-amber-50/70 via-white to-orange-50/50",
    indigo: "from-indigo-50/60 via-white to-sky-50/40",
    emerald: "from-emerald-50/60 via-white to-teal-50/40",
  };

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/82 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className={`rounded-[20px] bg-gradient-to-br ${toneMap[tone] || toneMap.slate} p-4`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              {label}
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {value}
            </div>
            {subtitle ? (
              <div className="mt-2 text-sm text-slate-500">{subtitle}</div>
            ) : null}
          </div>

          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <Icon size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingDistribution({ stats, total }) {
  const rows = [5, 4, 3, 2, 1];

  return (
    <div className="rounded-[26px] border border-white/80 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <BarChart3 size={18} className="text-slate-700" />
        <h3 className="text-lg font-semibold text-slate-900">Star Summary</h3>
      </div>

      <div className="mt-5 space-y-4">
        {rows.map((rating) => {
          const count = stats[rating] || 0;
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={rating} className="grid grid-cols-[52px_1fr_54px] items-center gap-3">
              <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                <span>{rating}</span>
                <Star size={13} className="fill-amber-400 text-amber-400" />
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="text-right text-sm font-semibold text-slate-600">
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecentFeedbackHighlights({ rows }) {
  return (
    <div className="rounded-[26px] border border-white/80 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <MessagesSquare size={18} className="text-slate-700" />
        <h3 className="text-lg font-semibold text-slate-900">Recent Feedback Highlights</h3>
      </div>

      <div className="mt-4 space-y-3">
        {rows.length === 0 ? (
          <div className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
            No recent feedback available.
          </div>
        ) : (
          rows.map((item) => {
            const feedback = item?.websiteFeedback || {};
            return (
              <div
                key={item.id}
                className="rounded-[20px] border border-slate-100 bg-gradient-to-br from-amber-50/40 via-white to-indigo-50/30 px-4 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">
                      {safe(getStartupName(item))}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {safe(getFounderName(item))} • {formatDate(feedback?.submittedAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <RatingStars value={feedback?.rating || 0} size={13} />
                    <span className="text-xs font-semibold text-slate-700">
                      {safe(feedback?.rating)}/5
                    </span>
                  </div>
                </div>

                <div className="mt-3 line-clamp-3 text-sm leading-6 text-slate-700">
                  {feedback?.message?.trim() ? feedback.message : "No message provided."}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function FeedbackCard({ item }) {
  const feedback = item?.websiteFeedback || {};

  return (
    <div className="rounded-[28px] border border-white/80 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Feedback Submitted
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {safe(feedback?.experience)}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-semibold text-slate-900">
            {safe(getStartupName(item))}
          </h3>

          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <InfoPill
              icon={<Building2 size={14} />}
              label="Application ID"
              value={item._applicationId}
            />
            <InfoPill
              icon={<User2 size={14} />}
              label="Founder"
              value={getFounderName(item)}
            />
            <InfoPill
              icon={<CalendarDays size={14} />}
              label="Submitted On"
              value={formatDate(feedback?.submittedAt)}
            />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Rating
              </div>
              <div className="mt-2 flex items-center gap-2">
                <RatingStars value={feedback?.rating || 0} />
                <span className="text-sm font-semibold text-slate-700">
                  {safe(feedback?.rating)}/5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[22px] border border-slate-100 bg-gradient-to-br from-amber-50/60 via-white to-indigo-50/40 px-4 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Feedback Message
        </div>
        <div className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
          {feedback?.message?.trim() ? feedback.message : "No message provided."}
        </div>
      </div>
    </div>
  );
}

function InfoPill({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>
      <div className="mt-2 break-words text-sm font-semibold text-slate-800">
        {safe(value)}
      </div>
    </div>
  );
}

export default function FeedbackList({ open, onClose }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "startupApplications"),
        orderBy("createdAt", "desc"),
        limit(600)
      );

      const snap = await getDocs(q);

      const list = snap.docs
        .map((docItem) => {
          const data = docItem.data();
          return {
            id: docItem.id,
            ...data,
            _applicationId: getApplicationId(data, docItem.id),
          };
        })
        .filter((item) => item?.websiteFeedback?.submitted === true);

      setRows(list);
    } catch (error) {
      console.error("Failed to load website feedback list", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadFeedbacks();
    }
  }, [open]);

  const experienceOptions = useMemo(() => {
    const set = new Set();
    rows.forEach((item) => {
      const value = item?.websiteFeedback?.experience;
      if (value) set.add(value);
    });
    return ["All", ...Array.from(set)];
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rows.filter((item) => {
      const feedback = item?.websiteFeedback || {};
      const matchesSearch =
        !q ||
        [
          item._applicationId,
          getStartupName(item),
          getFounderName(item),
          feedback?.experience,
          feedback?.message,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesExperience =
        experienceFilter === "All" || feedback?.experience === experienceFilter;

      const matchesRating =
        ratingFilter === "All" || Number(feedback?.rating || 0) === Number(ratingFilter);

      return matchesSearch && matchesExperience && matchesRating;
    });
  }, [rows, search, experienceFilter, ratingFilter]);

  const summary = useMemo(() => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let ratingSum = 0;
    let ratingCount = 0;

    filteredRows.forEach((item) => {
      const rating = Number(item?.websiteFeedback?.rating || 0);
      if (rating >= 1 && rating <= 5) {
        distribution[rating] += 1;
        ratingSum += rating;
        ratingCount += 1;
      }
    });

    const average = ratingCount ? (ratingSum / ratingCount).toFixed(1) : "0.0";

    return {
      distribution,
      average,
      total: filteredRows.length,
      ratingCount,
    };
  }, [filteredRows]);

 const recentHighlights = useMemo(() => {
  return filteredRows
    .filter((item) => {
      const msg = item?.websiteFeedback?.message;
      return msg && msg.trim().length > 0;
    })
    .slice(0, 3);
}, [filteredRows]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-md md:p-6">
      <div className="relative max-h-[94vh] w-full max-w-7xl overflow-hidden rounded-[38px] border border-white/20 bg-[#f8fafc] shadow-[0_40px_120px_rgba(2,6,23,0.42)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_18%),radial-gradient(circle_at_top_right,rgba(79,70,229,0.14),transparent_20%),linear-gradient(to_bottom,rgba(255,255,255,0.83),rgba(255,255,255,0.97))]" />

        <div className="relative flex max-h-[94vh] flex-col">
          <div className="sticky top-0 z-20 border-b border-white/60 bg-white/72 px-5 py-5 backdrop-blur-xl md:px-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
                  <MessageSquareText size={14} />
                  Website Feedback
                </div>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  Applicant Feedback List
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  View all website feedback entries, average rating, and star summary in one place.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadFeedbacks}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
                <button
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative max-h-[calc(94vh-98px)] overflow-auto px-4 py-4 md:px-7 md:py-6">
            <div className="mb-6 rounded-[30px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="xl:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
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
                      placeholder="Search startup, founder, application ID, message..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Experience
                  </label>
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                  >
                    {experienceOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Rating
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                  >
                    <option value="All">All</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                <Filter size={12} />
                Showing {filteredRows.length} of {rows.length} feedback entries
              </div>
            </div>

            {!loading && (
              <div className="mb-6 grid gap-4 xl:grid-cols-[0.95fr_1.2fr_1fr]">
                <SummaryMetricCard
                  icon={MessageSquareText}
                  label="Total Feedback"
                  value={summary.total}
                  subtitle="Entries after current filters"
                  tone="indigo"
                />

                <SummaryMetricCard
                  icon={TrendingUp}
                  label="Average Rating"
                  value={summary.average}
                  subtitle="Average star score out of 5"
                  tone="amber"
                />

                <div className="rounded-[26px] border border-white/80 bg-white/82 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <div className="rounded-[20px] bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 p-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Average Stars
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <RatingStars value={Math.round(Number(summary.average || 0))} size={18} />
                      <span className="text-3xl font-bold tracking-tight text-slate-900">
                        {summary.average}
                      </span>
                      <span className="text-sm font-medium text-slate-500">/ 5</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && (
              <div className="mb-6 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
                <RatingDistribution
                  stats={summary.distribution}
                  total={summary.total}
                />
                <RecentFeedbackHighlights rows={recentHighlights} />
              </div>
            )}

            {loading ? (
              <div className="grid gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-[28px] border border-white/80 bg-white/82 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
                  >
                    <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />
                    <div className="mt-4 h-24 animate-pulse rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="rounded-[30px] border border-white/80 bg-white/82 px-6 py-16 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <MessageSquareText size={22} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">No feedback found</h3>
                <p className="mt-2 text-sm text-slate-500">
                  No website feedback matches the current filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRows.map((item) => (
                  <FeedbackCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}