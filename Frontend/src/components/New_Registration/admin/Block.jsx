import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import {
  FaUpload,
  FaSearch,
  FaLock,
  FaUnlock,
  FaSyncAlt,
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileExcel,
} from "react-icons/fa";

/* -------------------- Utils -------------------- */

const normalizeEmail = (v = "") => String(v).trim().toLowerCase();
const normalizePhone = (v = "") => String(v).replace(/\D/g, "").slice(-10);
const normalizeAadhar = (v = "") => String(v).replace(/\D/g, "").slice(0, 12);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TAB_CONFIG = {
  aadhar: {
    label: "Aadhar",
    blockedCollection: "aadharBlocked",
    unblockedCollection: "Unblocked/Aadhar/List",
    valueLabel: "Aadhar Number",
  },
  mobile: {
    label: "Mobile",
    blockedCollection: "phoneBlocked",
    unblockedCollection: "Unblocked/Mobile/List",
    valueLabel: "Mobile Number",
  },
  email: {
    label: "Email",
    blockedCollection: "emailBlocked",
    unblockedCollection: "Unblocked/Email/List",
    valueLabel: "Email ID",
  },
};

const EXPECTED_UPLOAD_COLUMNS = [
  "S.No.",
  "Name of Startup/ID No.",
  "Reg. ID",
  "Registration Number/CIN",
  "Name of Applicant",
  "Amount Sanctioned",
  "First Instalment Released",
  "2nd/Last Instalment Released",
  "Post Seed Fund",
  "Matching Loan (In Lakhs)",
  "District",
  "Mobile",
  "Email-ID",
  "Address",
  "Aadhar",
  "Block",
];

const getCell = (row, keys) => {
  for (const key of keys) {
    if (
      row[key] !== undefined &&
      row[key] !== null &&
      String(row[key]).trim() !== ""
    ) {
      return row[key];
    }
  }
  return "";
};

const getRegistrationId = (row) =>
  String(
    getCell(row, [
      "Reg. ID",
      "Registration Number/CIN",
      "Registration Number",
      "Registration No",
      "CIN",
      "Name of Startup/ID No.",
    ])
  ).trim();

const formatDate = (value) => {
  if (!value) return "-";
  if (value?.toDate) return value.toDate().toLocaleString("en-IN");
  if (value instanceof Date) return value.toLocaleString("en-IN");
  return "-";
};

/* -------------------- Main Component -------------------- */

export default function Block() {
  const [tab, setTab] = useState("aadhar");
  const [view, setView] = useState("blocked");

  const [fileRows, setFileRows] = useState([]);
  const [fileName, setFileName] = useState("");

  const [blockedData, setBlockedData] = useState([]);
  const [unblockedData, setUnblockedData] = useState([]);

  const [running, setRunning] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [actionId, setActionId] = useState("");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "id", direction: "asc" });

  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    aadharSaved: 0,
    mobileSaved: 0,
    emailSaved: 0,
    skipped: 0,
    failed: 0,
  });

  const activeConfig = TAB_CONFIG[tab];
  const activeData = view === "blocked" ? blockedData : unblockedData;

  const loadData = async () => {
    try {
      setLoadingData(true);

      const [blockedSnap, unblockedSnap] = await Promise.all([
        getDocs(collection(db, activeConfig.blockedCollection)),
        getDocs(collection(db, activeConfig.unblockedCollection)),
      ]);

      setBlockedData(
        blockedSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      setUnblockedData(
        unblockedSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    } catch (error) {
      console.error(error);
      alert("Failed to load records.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
    setSearch("");
    setSort({ key: "id", direction: "asc" });
  }, [tab]);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setFileName(file.name);
      setFileRows([]);

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
        raw: false,
      });

      setFileRows(rows);
      setProgress({
        current: 0,
        total: rows.length,
        aadharSaved: 0,
        mobileSaved: 0,
        emailSaved: 0,
        skipped: 0,
        failed: 0,
      });
    } catch (error) {
      console.error(error);
      alert("Could not read Excel file.");
    }
  };

  const uploadData = async () => {
    if (!fileRows.length) {
      alert("Please choose an Excel file first.");
      return;
    }

    try {
      setRunning(true);

      let aadharSaved = 0;
      let mobileSaved = 0;
      let emailSaved = 0;
      let skipped = 0;
      let failed = 0;

      for (let i = 0; i < fileRows.length; i += 1) {
        const row = fileRows[i];
        const applicationId = getRegistrationId(row);

        const aadhar = normalizeAadhar(
          getCell(row, ["Aadhar", "Aadhaar", "Aadhar Number"])
        );
        const phone = normalizePhone(
          getCell(row, ["Mobile", "Mobile\n", "Phone", "Phone Number"])
        );
        const email = normalizeEmail(
          getCell(row, ["Email-ID", "Email ID", "Email", "E-mail"])
        );

        if (!aadhar && !phone && !email) {
          skipped += 1;
        }

        try {
          const payload = {
            applicationId,
            blockedAt: serverTimestamp(),
          };

          if (aadhar) {
            await setDoc(doc(db, "aadharBlocked", aadhar), payload, {
              merge: true,
            });
            aadharSaved += 1;
          }

          if (phone) {
            await setDoc(doc(db, "phoneBlocked", phone), payload, {
              merge: true,
            });
            mobileSaved += 1;
          }

          if (email) {
            await setDoc(doc(db, "emailBlocked", email), payload, {
              merge: true,
            });
            emailSaved += 1;
          }
        } catch (error) {
          console.error(error);
          failed += 1;
        }

        setProgress({
          current: i + 1,
          total: fileRows.length,
          aadharSaved,
          mobileSaved,
          emailSaved,
          skipped,
          failed,
        });

        await sleep(35);
      }

      await loadData();
      setView("blocked");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setRunning(false);
    }
  };

  const handleUnblock = async (item) => {
    const confirmed = window.confirm(`Unblock ${activeConfig.label}: ${item.id}?`);
    if (!confirmed) return;

    try {
      setActionId(item.id);

      await setDoc(
        doc(db, activeConfig.unblockedCollection, item.id),
        {
          applicationId: item.applicationId || "",
          value: item.id,
          type: tab,
          unblockedAt: serverTimestamp(),
          previousBlockedAt: item.blockedAt || null,
        },
        { merge: true }
      );

      await deleteDoc(doc(db, activeConfig.blockedCollection, item.id));
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Unblock failed.");
    } finally {
      setActionId("");
    }
  };

  const handleRestoreBlock = async (item) => {
    const confirmed = window.confirm(`Block again ${activeConfig.label}: ${item.id}?`);
    if (!confirmed) return;

    try {
      setActionId(item.id);

      await setDoc(
        doc(db, activeConfig.blockedCollection, item.id),
        {
          applicationId: item.applicationId || "",
          blockedAt: serverTimestamp(),
          restoredFromUnblockedAt: item.unblockedAt || null,
        },
        { merge: true }
      );

      await deleteDoc(doc(db, activeConfig.unblockedCollection, item.id));
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Restore failed.");
    } finally {
      setActionId("");
    }
  };

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = activeData.filter((item) => {
      const value = String(item.id || "").toLowerCase();
      const appId = String(item.applicationId || "").toLowerCase();
      return !q || value.includes(q) || appId.includes(q);
    });

    return [...filtered].sort((a, b) => {
      const aVal =
        sort.key === "blockedAt" || sort.key === "unblockedAt"
          ? a[sort.key]?.toDate?.()?.getTime?.() || 0
          : String(a[sort.key] || a.id || "").toLowerCase();

      const bVal =
        sort.key === "blockedAt" || sort.key === "unblockedAt"
          ? b[sort.key]?.toDate?.()?.getTime?.() || 0
          : String(b[sort.key] || b.id || "").toLowerCase();

      if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [activeData, search, sort]);

  const changeSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const downloadCurrentViewExcel = () => {
    const rows = filteredAndSorted.map((item, index) => ({
      "S.No.": index + 1,
      Type: activeConfig.label,
      Value: item.id,
      "Reg ID": item.applicationId || "",
      Status: view === "blocked" ? "Blocked" : "Unblocked",
      "Blocked At": formatDate(item.blockedAt),
      "Unblocked At": formatDate(item.unblockedAt),
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, `${activeConfig.label}_${view}`);
    XLSX.writeFile(wb, `${activeConfig.label}_${view}_list.xlsx`);
  };

  const downloadSampleExcel = () => {
    const sampleRows = [
      {
        "S.No.": 1,
        "Name of Startup/ID No.": "Sample Startup",
        "Reg. ID": "SB2026030017",
        "Registration Number/CIN": "",
        "Name of Applicant": "Sample Applicant",
        "Amount Sanctioned": "",
        "First Instalment Released": "",
        "2nd/Last Instalment Released": "",
        "Post Seed Fund": "",
        "Matching Loan (In Lakhs)": "",
        District: "Patna",
        Mobile: "9876543210",
        "Email-ID": "sample@example.com",
        Address: "Sample Address",
        Aadhar: "999999999999",
        Block: "Patna Sadar",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleRows, {
      header: EXPECTED_UPLOAD_COLUMNS,
    });
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Sample_Block_Upload");
    XLSX.writeFile(wb, "sample_block_upload_format.xlsx");
  };

  const percent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed,transparent_34%),linear-gradient(135deg,#f8fafc,#eef2ff)] p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-[30px] border border-white/80 bg-white/80 shadow-[0_22px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-amber-700 p-6 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-100 ring-1 ring-white/20">
                  <FaDatabase />
                  Startup Bihar Controls
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight">
                  Blocked List Management
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-200">
                  Upload Excel data, manage blocked Aadhar, mobile and email records,
                  and maintain an unblock history.
                </p>
              </div>

              <button
                type="button"
                onClick={loadData}
                disabled={loadingData}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 disabled:opacity-60"
              >
                <FaSyncAlt className={loadingData ? "animate-spin" : ""} />
                {loadingData ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-3">
            <StatCard title="Blocked" value={blockedData.length} tone="red" />
            <StatCard title="Unblocked" value={unblockedData.length} tone="green" />
            <StatCard title="Current View" value={activeConfig.label} tone="indigo" />
          </div>
        </div>

        <div className="rounded-[26px] border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
              <FaUpload />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Upload Excel</h2>
              <p className="text-sm text-slate-500">
                Main required fields for blocking: Aadhar, Mobile, Email-ID, and Reg. ID.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm font-bold text-amber-900">
                  Supported Excel Column Heads
                </div>
                <div className="mt-1 text-xs text-amber-800">
                  The uploader reads these column names. Extra columns are ignored.
                </div>
              </div>

              <button
                type="button"
                onClick={downloadSampleExcel}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-800"
              >
                <FaFileExcel />
                Download Sample Format
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {EXPECTED_UPLOAD_COLUMNS.map((col) => (
                <span
                  key={col}
                  className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold text-amber-800"
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFile}
              disabled={running}
              className="block w-full max-w-md rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />

            <button
              type="button"
              onClick={uploadData}
              disabled={running || !fileRows.length}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {running ? "Uploading..." : "Upload Blocked Data"}
            </button>
          </div>

          {fileName ? (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              File: <span className="font-semibold">{fileName}</span> | Rows:{" "}
              <span className="font-semibold">{fileRows.length}</span>
            </div>
          ) : null}

          {(running || progress.total > 0) && (
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm text-slate-600">
                <span>{percent}% completed</span>
                <span>
                  {progress.current}/{progress.total}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-700 to-amber-500 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-5">
                <MiniStat label="Aadhar Saved" value={progress.aadharSaved} />
                <MiniStat label="Mobile Saved" value={progress.mobileSaved} />
                <MiniStat label="Email Saved" value={progress.emailSaved} />
                <MiniStat label="Skipped" value={progress.skipped} />
                <MiniStat label="Failed" value={progress.failed} />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[26px] border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur-xl">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {Object.entries(TAB_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
                    tab === key
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setView("blocked")}
                className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                  view === "blocked"
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                <FaLock />
                Blocked
              </button>

              <button
                type="button"
                onClick={() => setView("unblocked")}
                className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition ${
                  view === "unblocked"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                <FaUnlock />
                Unblocked
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeConfig.label} or Reg ID...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)]"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                Showing <span className="font-bold">{filteredAndSorted.length}</span>{" "}
                of <span className="font-bold">{activeData.length}</span>{" "}
                {view === "blocked" ? "blocked" : "unblocked"} records
              </div>

              <button
                type="button"
                onClick={downloadCurrentViewExcel}
                disabled={!filteredAndSorted.length}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaFileExcel />
                Download Excel
              </button>
            </div>
          </div>

          <div className="mt-5 overflow-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">S.No.</th>
                  <SortableTh
                    label={activeConfig.valueLabel}
                    sortKey="id"
                    sort={sort}
                    onSort={changeSort}
                  />
                  <SortableTh
                    label="Reg ID"
                    sortKey="applicationId"
                    sort={sort}
                    onSort={changeSort}
                  />
                  <SortableTh
                    label={view === "blocked" ? "Blocked At" : "Unblocked At"}
                    sortKey={view === "blocked" ? "blockedAt" : "unblockedAt"}
                    sort={sort}
                    onSort={changeSort}
                  />
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                  <th className="px-4 py-3 text-center font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {loadingData ? (
                  <EmptyRow text="Loading records..." />
                ) : filteredAndSorted.length === 0 ? (
                  <EmptyRow text="No records found." />
                ) : (
                  filteredAndSorted.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 hover:bg-slate-50/70"
                    >
                      <td className="px-4 py-3 text-slate-600">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                        {item.id}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {item.applicationId || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {view === "blocked"
                          ? formatDate(item.blockedAt)
                          : formatDate(item.unblockedAt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {view === "blocked" ? (
                          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                            <FaExclamationTriangle />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            <FaCheckCircle />
                            Unblocked
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {view === "blocked" ? (
                          <button
                            type="button"
                            onClick={() => handleUnblock(item)}
                            disabled={actionId === item.id}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                          >
                            {actionId === item.id ? "Processing..." : "Unblock"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRestoreBlock(item)}
                            disabled={actionId === item.id}
                            className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                          >
                            {actionId === item.id ? "Processing..." : "Block Again"}
                          </button>
                        )}
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
  );
}

/* -------------------- UI Helpers -------------------- */

function StatCard({ title, value, tone }) {
  const toneMap = {
    red: "from-red-50 to-white text-red-700 border-red-100",
    green: "from-emerald-50 to-white text-emerald-700 border-emerald-100",
    indigo: "from-indigo-50 to-white text-indigo-700 border-indigo-100",
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${toneMap[tone]}`}>
      <div className="text-sm font-semibold opacity-80">{title}</div>
      <div className="mt-2 text-3xl font-black">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function SortableTh({ label, sortKey, sort, onSort }) {
  const active = sort.key === sortKey;

  return (
    <th className="px-4 py-3 text-left font-semibold">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 hover:text-slate-950"
      >
        {label}
        <span className="text-xs text-slate-500">
          {active ? (sort.direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </button>
    </th>
  );
}

function EmptyRow({ text }) {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
        {text}
      </td>
    </tr>
  );
}