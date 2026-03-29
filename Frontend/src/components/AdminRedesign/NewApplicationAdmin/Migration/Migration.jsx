import React, { useEffect, useMemo, useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path as needed

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3007";

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("adminToken") ||
    sessionStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `${token}` } : {}),
  };
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sanitizeForFirestore = (value) => {
  if (value === undefined) return null;

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item));
  }

  if (value && typeof value === "object") {
    const out = {};
    Object.keys(value).forEach((key) => {
      out[key] = sanitizeForFirestore(value[key]);
    });
    return out;
  }

  return value;
};

const buildPayload = (row, table) => {
  return {
    ...sanitizeForFirestore(row),
    migrationMeta: {
      source: "mysql",
      tableKey: table.key,
      collectionName: table.collectionName,
      legacyId: row?.id || null,
      migratedAtIso: new Date().toISOString(),
      phase: "phase_1_db_to_firestore",
    },
    firestoreUpdatedAt: serverTimestamp(),
  };
};

const getDocId = (tableKey, row) => {
  switch (tableKey) {
    case "users":
      return row.user_id || row.id;
    case "admins":
      return row.admin_id || row.id;
    case "startupDocuments":
    case "seedFunds":
    case "secondTranches":
    case "postSeedFunds":
    case "accelerationPrograms":
    case "matchingLoans":
    case "iprReimbursements":
    case "incubationApplications":
    case "coworkingApplications":
      return row.userId || row.id;
    case "qReports":
    case "staff":
    case "showcase":
    case "userNotifications":
    case "activities":
    case "coworkingApplicationsLegacy":
    case "coworkingSeatMap":
    default:
      return row.id;
  }
};

export default function Migration() {
  const [tables, setTables] = useState([]);
  const [previewMap, setPreviewMap] = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [logs, setLogs] = useState([]);
  const [runningTable, setRunningTable] = useState("");

  const totalLoaded = useMemo(() => {
    return Object.values(previewMap).reduce((acc, item) => acc + (item?.total || 0), 0);
  }, [previewMap]);

  const pushLog = (message, type = "info") => {
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        message,
        type,
        ts: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  };

  const setStatus = (tableKey, type, message) => {
    setStatusMap((prev) => ({
      ...prev,
      [tableKey]: { type, message },
    }));
  };

  const loadTables = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/migration/tables`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load migration tables");
      }

      setTables(data.tables || []);
    } catch (error) {
      pushLog(error.message || "Failed to load tables", "error");
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const fetchRows = async (table) => {
    try {
      setRunningTable(table.key);
      setStatus(table.key, "loading", "Fetching rows from MySQL...");

      const res = await fetch(`${API_BASE}/api/migration/fetch/${table.key}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch rows");
      }

      setPreviewMap((prev) => ({
        ...prev,
        [table.key]: {
          rows: data.rows || [],
          total: data.total || 0,
          title: data.title || table.title,
          collectionName: data.collectionName || table.collectionName,
        },
      }));

      setProgressMap((prev) => ({
        ...prev,
        [table.key]: {
          total: data.total || 0,
          done: 0,
          success: 0,
          failed: 0,
          current: "",
        },
      }));

      setStatus(table.key, "success", `Fetched ${data.total || 0} rows`);
      pushLog(`${table.title}: fetched ${data.total || 0} rows`, "success");
    } catch (error) {
      setStatus(table.key, "error", error.message || "Fetch failed");
      pushLog(`${table.title}: ${error.message}`, "error");
    } finally {
      setRunningTable("");
    }
  };

  const migrateRows = async (table) => {
    const preview = previewMap[table.key];
    const rows = preview?.rows || [];

    if (!rows.length) {
      setStatus(table.key, "error", "No rows loaded. Fetch first.");
      return;
    }

    try {
      setRunningTable(table.key);
      setStatus(table.key, "loading", "Writing rows to Firestore one by one...");

      let success = 0;
      let failed = 0;

      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        const docId = String(getDocId(table.key, row) || "");

        setProgressMap((prev) => ({
          ...prev,
          [table.key]: {
            ...(prev[table.key] || {}),
            total: rows.length,
            done: i,
            success,
            failed,
            current: docId || `row-${i + 1}`,
          },
        }));

        if (!docId) {
          failed += 1;
          pushLog(`${table.title}: row ${i + 1} skipped, no doc id`, "error");
          continue;
        }

        try {
          const payload = buildPayload(row, table);
          await setDoc(doc(db, table.collectionName, docId), payload, { merge: true });

          success += 1;
          pushLog(`${table.title}: migrated ${docId}`, "success");
        } catch (error) {
          failed += 1;
          pushLog(
            `${table.title}: failed ${docId} - ${error.message || "write failed"}`,
            "error"
          );
        }

        setProgressMap((prev) => ({
          ...prev,
          [table.key]: {
            ...(prev[table.key] || {}),
            total: rows.length,
            done: i + 1,
            success,
            failed,
            current: docId || `row-${i + 1}`,
          },
        }));

        await sleep(50);
      }

      setStatus(
        table.key,
        "success",
        `Completed. Success: ${success}, Failed: ${failed}`
      );
    } catch (error) {
      setStatus(table.key, "error", error.message || "Migration failed");
      pushLog(`${table.title}: ${error.message}`, "error");
    } finally {
      setRunningTable("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">Firestore Migration</h1>
          <p className="mt-2 text-sm text-slate-600">
            Phase 1 migration: MySQL → Frontend → Firestore
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-indigo-700">
              Tables: {tables.length}
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-slate-700">
              Loaded rows: {totalLoaded}
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tables.map((table) => {
            const preview = previewMap[table.key];
            const progress = progressMap[table.key];
            const status = statusMap[table.key];
            const isBusy = runningTable === table.key;
            const percent =
              progress?.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

            return (
              <div
                key={table.key}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-800">{table.title}</h2>
                <div className="mt-1 text-xs text-slate-500">
                  Collection: {table.collectionName}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Key: {table.key}
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-sm text-slate-700">
                    Rows loaded: <span className="font-semibold">{preview?.total || 0}</span>
                  </div>

                  {progress?.total ? (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                        <span>{percent}%</span>
                        <span>
                          {progress.done}/{progress.total}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="mt-2 text-xs text-slate-600">
                        Current: <span className="font-medium">{progress.current || "-"}</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        Success: {progress.success || 0} | Failed: {progress.failed || 0}
                      </div>
                    </div>
                  ) : null}

                  {status?.message ? (
                    <div
                      className={`mt-3 text-xs ${
                        status.type === "error"
                          ? "text-red-600"
                          : status.type === "loading"
                          ? "text-indigo-700"
                          : "text-green-700"
                      }`}
                    >
                      {status.message}
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => fetchRows(table)}
                    disabled={isBusy}
                    className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {isBusy ? "Please wait..." : "1. Fetch Rows"}
                  </button>

                  <button
                    onClick={() => migrateRows(table)}
                    disabled={isBusy}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {isBusy ? "Please wait..." : "2. Write to Firestore"}
                  </button>
                </div>

                {preview?.rows?.length ? (
                  <div className="mt-4 max-h-64 overflow-auto rounded-xl border border-slate-200">
                    <table className="min-w-full text-xs">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="px-3 py-2 text-left">Doc ID</th>
                          <th className="px-3 py-2 text-left">Legacy ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.rows.slice(0, 8).map((row, idx) => (
                          <tr key={`${row.id || row.userId || row.user_id || idx}`} className="border-t">
                            <td className="px-3 py-2">
                              {String(getDocId(table.key, row) || "-")}
                            </td>
                            <td className="px-3 py-2">{row.id || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">Live Logs</h3>
          <div className="mt-4 max-h-96 space-y-2 overflow-auto">
            {logs.length === 0 ? (
              <div className="text-sm text-slate-500">No logs yet.</div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    log.type === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : log.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-slate-200 bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="font-medium">{log.message}</div>
                  <div className="mt-1 text-xs opacity-80">{log.ts}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}