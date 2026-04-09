import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

const normalizePhone = (value = "") =>
  String(value).replace(/\D/g, "").slice(-10);

const normalizeAadhar = (value = "") =>
  String(value).replace(/\D/g, "").slice(0, 12);

const getCell = (row, keys = []) => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
      return row[key];
    }
  }
  return "";
};

const getRegistrationId = (row) => {
  return String(
    getCell(row, [
      "Reg. ID",
      "Registration Number/CIN",
      "Name of Startup/ID No.",
      "Reg.ID",
      "Registration No",
      "Registration Number",
      "CIN",
    ])
  ).trim();
};

const getApplicantName = (row) =>
  String(
    getCell(row, ["Name of Applicant", "Applicant Name", "Name"])
  ).trim();

const getStartupName = (row) =>
  String(
    getCell(row, ["Name of Startup/ID No.", "Name of Startup", "Startup Name"])
  ).trim();

const getDistrict = (row) => String(getCell(row, ["District"])).trim();

const getBlock = (row) => String(getCell(row, ["Block"])).trim();

const getAddress = (row) => String(getCell(row, ["Address"])).trim();

const getEmail = (row) =>
  normalizeEmail(getCell(row, ["Email-ID", "Email ID", "Email", "E-mail"]));

const getPhone = (row) =>
  normalizePhone(getCell(row, ['Mobile\n', "Mobile", "Phone", "Phone Number", "Mobile Number"]));

const getAadhar = (row) =>
  normalizeAadhar(getCell(row, ["Aadhar", "Adhar", "Aadhaar", "Aadhar Number"]));

export default function Block() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [running, setRunning] = useState(false);

  const [progress, setProgress] = useState({
    totalRows: 0,
    currentRow: 0,
    currentLabel: "",
    success: 0,
    skipped: 0,
    failed: 0,
    aadharSaved: 0,
    phoneSaved: 0,
    emailSaved: 0,
  });

  const [logs, setLogs] = useState([]);

  const pushLog = (message, type = "info") => {
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        message,
        type,
        time: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  };

  const preview = useMemo(() => {
    let withAadhar = 0;
    let withPhone = 0;
    let withEmail = 0;

    for (const row of rows) {
      if (getAadhar(row)) withAadhar += 1;
      if (getPhone(row)) withPhone += 1;
      if (getEmail(row)) withEmail += 1;
    }

    return {
      total: rows.length,
      withAadhar,
      withPhone,
      withEmail,
    };
  }, [rows]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoadingSheet(true);
      setFileName(file.name);
      setRows([]);
      setHeaders([]);
      setLogs([]);
      setProgress({
        totalRows: 0,
        currentRow: 0,
        currentLabel: "",
        success: 0,
        skipped: 0,
        failed: 0,
        aadharSaved: 0,
        phoneSaved: 0,
        emailSaved: 0,
      });

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];

      const jsonRows = XLSX.utils.sheet_to_json(sheet, {
        defval: "",
        raw: false,
      });

      const sheetHeaders = jsonRows.length ? Object.keys(jsonRows[0]) : [];

      setRows(jsonRows);
      setHeaders(sheetHeaders);

      pushLog(
        `Loaded ${jsonRows.length} rows from "${firstSheetName}"`,
        "success"
      );
    } catch (error) {
      console.error(error);
      pushLog(error.message || "Failed to read Excel file", "error");
    } finally {
      setLoadingSheet(false);
    }
  };

  const saveBlockedEntry = async ({
    collectionName,
    docId,
    payload,
  }) => {
    if (!docId) return false;

    await setDoc(
      doc(db, collectionName, docId),
      {
        ...payload,
        blockedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  };

  const handleUploadBlockedData = async () => {
    if (!rows.length) {
      pushLog("No rows loaded. Please choose an Excel file first.", "error");
      return;
    }

    try {
      setRunning(true);

      let success = 0;
      let skipped = 0;
      let failed = 0;
      let aadharSaved = 0;
      let phoneSaved = 0;
      let emailSaved = 0;

      setProgress({
        totalRows: rows.length,
        currentRow: 0,
        currentLabel: "",
        success: 0,
        skipped: 0,
        failed: 0,
        aadharSaved: 0,
        phoneSaved: 0,
        emailSaved: 0,
      });

      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];

        const registrationId = getRegistrationId(row);
        const applicantName = getApplicantName(row);
        const startupName = getStartupName(row);
        const district = getDistrict(row);
        const block = getBlock(row);
        const address = getAddress(row);

        const aadhar = getAadhar(row);
        const phone = getPhone(row);
        const email = getEmail(row);

        const currentLabel =
          registrationId || startupName || applicantName || `Row ${i + 1}`;

        setProgress((prev) => ({
          ...prev,
          currentRow: i + 1,
          currentLabel,
        }));

        if (!aadhar && !phone && !email) {
          skipped += 1;
          pushLog(`${currentLabel}: skipped, no aadhar/mobile/email found`, "info");

          setProgress((prev) => ({
            ...prev,
            currentRow: i + 1,
            currentLabel,
            skipped,
          }));
          continue;
        }

        try {
          const basePayload = {
            applicationId: registrationId || "",
          
          };

          if (aadhar) {
            await saveBlockedEntry({
              collectionName: "aadharBlocked",
              docId: aadhar,
              payload: {
                ...basePayload,
                aadharNumber: aadhar,
              },
            });
            aadharSaved += 1;
          }

          if (phone) {
            await saveBlockedEntry({
              collectionName: "phoneBlocked",
              docId: phone,
              payload: {
                ...basePayload,
                phoneNumber: phone,
              },
            });
            phoneSaved += 1;
          }

          if (email) {
            await saveBlockedEntry({
              collectionName: "emailBlocked",
              docId: email,
              payload: {
                ...basePayload,
                email,
              },
            });
            emailSaved += 1;
          }

          success += 1;
          pushLog(
            `${currentLabel}: uploaded${aadhar ? " aadhar" : ""}${phone ? " mobile" : ""}${email ? " email" : ""}`,
            "success"
          );
        } catch (error) {
          failed += 1;
          pushLog(
            `${currentLabel}: failed - ${error.message || "upload failed"}`,
            "error"
          );
        }

        setProgress({
          totalRows: rows.length,
          currentRow: i + 1,
          currentLabel,
          success,
          skipped,
          failed,
          aadharSaved,
          phoneSaved,
          emailSaved,
        });

        await sleep(60);
      }

      pushLog(
        `Completed. Success rows: ${success}, Skipped: ${skipped}, Failed: ${failed}`,
        "success"
      );
    } catch (error) {
      console.error(error);
      pushLog(error.message || "Upload failed", "error");
    } finally {
      setRunning(false);
    }
  };

  const percent =
    progress.totalRows > 0
      ? Math.round((progress.currentRow / progress.totalRows) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">
            Block Aadhar / Mobile / Email Upload
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Upload an Excel file and save blocked Aadhar, mobile, and email data
            one by one with progress tracking.
          </p>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              disabled={loadingSheet || running}
              className="block w-full max-w-md rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
            />

            <button
              type="button"
              onClick={handleUploadBlockedData}
              disabled={!rows.length || running || loadingSheet}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {running ? "Uploading..." : "Upload One by One"}
            </button>
          </div>

          {fileName ? (
            <div className="mt-3 text-sm text-slate-600">
              File: <span className="font-medium">{fileName}</span>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Rows" value={preview.total} />
          <StatCard title="Rows with Aadhar" value={preview.withAadhar} />
          <StatCard title="Rows with Mobile" value={preview.withPhone} />
          <StatCard title="Rows with Email" value={preview.withEmail} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Progress</h2>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>{percent}% completed</span>
              <span>
                {progress.currentRow}/{progress.totalRows || rows.length || 0}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="mt-3 text-sm text-slate-700">
              Current:{" "}
              <span className="font-medium">
                {progress.currentLabel || "-"}
              </span>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
              <MiniStat label="Success Rows" value={progress.success} />
              <MiniStat label="Skipped Rows" value={progress.skipped} />
              <MiniStat label="Failed Rows" value={progress.failed} />
              <MiniStat label="Aadhar Saved" value={progress.aadharSaved} />
              <MiniStat label="Mobile Saved" value={progress.phoneSaved} />
              <MiniStat label="Email Saved" value={progress.emailSaved} />
            </div>
          </div>
        </div>

        {headers.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Detected Columns
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {headers.map((header) => (
                <span
                  key={header}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                >
                  {header}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {rows.length ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">Preview</h2>

            <div className="mt-4 overflow-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Startup / Applicant</th>
                    <th className="px-3 py-2 text-left">Reg. ID</th>
                    <th className="px-3 py-2 text-left">Aadhar</th>
                    <th className="px-3 py-2 text-left">Mobile</th>
                    <th className="px-3 py-2 text-left">Email</th>
                    <th className="px-3 py-2 text-left">District</th>
                    <th className="px-3 py-2 text-left">Block</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 12).map((row, index) => (
                    <tr key={index} className="border-t border-slate-200">
                      <td className="px-3 py-2">
                        {getStartupName(row) || getApplicantName(row) || "-"}
                      </td>
                      <td className="px-3 py-2">{getRegistrationId(row) || "-"}</td>
                      <td className="px-3 py-2">{getAadhar(row) || "-"}</td>
                      <td className="px-3 py-2">{getPhone(row) || "-"}</td>
                      <td className="px-3 py-2">{getEmail(row) || "-"}</td>
                      <td className="px-3 py-2">{getDistrict(row) || "-"}</td>
                      <td className="px-3 py-2">{getBlock(row) || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">Live Logs</h2>

          <div className="mt-4 max-h-[420px] space-y-2 overflow-auto">
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
                  <div className="mt-1 text-xs opacity-80">{log.time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-bold text-slate-800">{value}</div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-800">{value}</div>
    </div>
  );
}