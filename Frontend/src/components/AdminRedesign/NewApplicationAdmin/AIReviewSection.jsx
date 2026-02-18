import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  X,
  Bot,
  Loader,
  Sparkles,
  Database,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThinkingIndicator from "./ThinkingIndicator";
import "./AIReviewSection.css";

/**
 * UPDATED FOR NEW API
 * Request:
 * POST https://nsbot.online/prompt
 * {
 *   "sbNo": "REG-AB12-2026",
 *   "answers": {
 *     "problem_statement": "...",
 *     "solution": "...",
 *     "innovation": "...",
 *     "target_market": "..."
 *   }
 * }
 *
 * Response (success path):
 * {
 *   model: "...",
 *   sb_no: "...",
 *   response: {
 *     sb_no, business_type, decision,
 *     overall_score, innovation_score, scalability_score,
 *     qualifier_count, startup_qualifiers,
 *     ratings, strengths, risks_and_gaps, commercialization_path, summary
 *   }
 * }
 */

// ---------- UI helpers ----------
const getScoreColor = (score) => {
  if (score >= 8) return "text-emerald-400 font-bold";
  if (score >= 6.5) return "text-emerald-300";
  if (score >= 5.5) return "text-yellow-400";
  return "text-rose-400";
};

const getDecisionPill = (decision) => {
  const d = (decision || "").toLowerCase();
  if (d === "fit_for_funding") {
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  }
  if (d === "fit_for_incubation") {
    return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
  return "bg-rose-500/10 text-rose-400 border-rose-500/20";
};

const prettifyDecision = (decision) => {
  const d = (decision || "").toLowerCase();
  if (d === "fit_for_funding") return "Fit for Funding";
  if (d === "fit_for_incubation") return "Fit for Incubation";
  return "Reject";
};

const prettifyBusinessType = (t) => {
  const x = (t || "").toLowerCase();
  if (x === "startup") return "Startup";
  return "Traditional";
};

// ---------- Modal ----------
const DetailModal = ({ entry, onClose }) => {
  if (!entry) return null;

  const { apiResponse, inputData, timeTaken, entityName, regNo, stage } = entry;

  const decision = apiResponse?.decision;
  const businessType = apiResponse?.business_type;
  const overall = apiResponse?.overall_score ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-[#0f0f16] border border-[#2d2d3f] w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2d2d3f] flex items-center justify-between bg-[#13131f]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {entityName}{" "}
                <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                  {regNo}
                </span>
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-gray-400 text-sm">
                  Stage: <span className="text-emerald-400">{stage}</span>
                </span>

                <span className="text-gray-600">•</span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDecisionPill(
                    decision
                  )}`}
                >
                  {prettifyDecision(decision)}
                </span>

                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    businessType === "startup"
                      ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  }`}
                >
                  {prettifyBusinessType(businessType)}
                </span>

                <span className="text-gray-600">•</span>

                <span className="text-gray-400 text-sm">
                  Overall:{" "}
                  <span className={`${getScoreColor(overall)} font-bold font-mono`}>
                    {Number(overall).toFixed(1)}/10
                  </span>
                </span>

                <span className="text-gray-600">•</span>
                <span className="text-gray-400 text-sm">Time: {timeTaken}s</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Inputs + Ratings */}
            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Database size={16} /> Data Analyzed
                </h3>

                <div className="space-y-4 bg-[#1a1a2e] p-5 rounded-2xl border border-[#2d2d3f]/50">
                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Problem Statement</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{inputData.problemStatement || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-indigo-400 block mb-1">Proposed Solution</span>
                    <p className="text-sm text-gray-300 leading-relaxed">{inputData.solution || "N/A"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-indigo-400 block mb-1">Innovation</span>
                      <p className="text-sm text-gray-300 leading-relaxed">{inputData.innovation || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-indigo-400 block mb-1">Target Market</span>
                      <p className="text-sm text-gray-300 leading-relaxed">{inputData.targetMarket || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp size={16} /> Detailed Evaluation
                </h3>

                <div className="space-y-3">
                  {apiResponse?.ratings?.map((rating, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1a1a2e] p-4 rounded-xl border border-[#2d2d3f] hover:border-indigo-500/30 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white">{rating.criterion_label}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                              style={{ width: `${(Number(rating.score) / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-emerald-400 font-bold font-mono">
                            {Number(rating.score).toFixed(1)}/10
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-indigo-500/20 pl-3">
                        {rating.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT: Insights */}
            <div className="space-y-8">
              <section className="bg-gradient-to-br from-[#1a1a2e] to-[#13131f] p-6 rounded-2xl border border-indigo-500/20 shadow-lg shadow-indigo-900/10">
                <h3 className="text-indigo-300 font-semibold mb-3 flex items-center gap-2">
                  <Sparkles size={18} /> NSBot Executive Summary
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm italic">
                  "{apiResponse?.summary || "No summary available."}"
                </p>
              </section>

              {/* Strengths */}
              {apiResponse?.strengths?.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ArrowUpRight size={16} /> Key Strengths
                  </h3>
                  <ul className="space-y-2">
                    {apiResponse.strengths.map((str, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-emerald-500/10"
                      >
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        {str}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Risks & Gaps */}
              {apiResponse?.risks_and_gaps?.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ShieldAlert size={16} /> Risks & Commercial Gaps
                  </h3>
                  <ul className="space-y-2">
                    {apiResponse.risks_and_gaps.map((risk, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm text-gray-300 bg-[#1a1a2e]/50 p-3 rounded-lg border border-rose-500/10"
                      >
                        <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Commercialization Path */}
              {apiResponse?.commercialization_path?.length > 0 && (
                <section>
                  <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Lightbulb size={16} /> Recommended Path
                  </h3>
                  <div className="bg-[#1a1a2e] rounded-xl border border-amber-500/10 overflow-hidden">
                    {apiResponse.commercialization_path.map((path, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-4 border-b border-[#2d2d3f] last:border-0 hover:bg-[#202030] transition-colors"
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-300">{path}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Qualifiers */}
              {apiResponse?.startup_qualifiers && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp size={16} /> Startup Qualifiers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(apiResponse.startup_qualifiers).map(([k, v]) => (
                      <div
                        key={k}
                        className={`p-3 rounded-xl border ${
                          v ? "bg-emerald-500/10 border-emerald-500/20" : "bg-[#1a1a2e] border-[#2d2d3f]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-300 font-mono">{k}</span>
                          <span className={`text-xs font-bold ${v ? "text-emerald-400" : "text-gray-500"}`}>
                            {v ? "YES" : "NO"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ---------- Main ----------
const AIReviewSection = () => {
  const [file, setFile] = useState(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [processedData, setProcessedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fileInputRef = useRef(null);
  const tableContainerRef = useRef(null);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    readExcel(uploadedFile);
  };

  const readExcel = (f) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet);

      setTotalEntries(jsonData.length);
      setProcessedCount(0);
      setProcessedData([]);
      setIsProcessing(true);
      setIsComplete(false);

      processQueue(jsonData);
    };
    reader.readAsBinaryString(f);
  };

  const processQueue = async (rows) => {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const startTime = performance.now();

      // Excel mappings (keep flexible)
      const regNo =
        row["Registration No"] ||
        row["Reg No"] ||
        row["Registration Number"] ||
        row["RegNumber"] ||
        `REG-${new Date().getFullYear()}-${String(i + 1).padStart(4, "0")}`;

      const entityName = row["Entity Name"] || row["Startup Name"] || row["Name"] || "Unknown Entity";
      const stage = row["Stage"] || "Ideation";

      // Inputs
      const problemStatement = row["Problem Statement"] || row["Problem"] || "";
      const solution = row["Solution"] || "";
      const innovation = row["Innovation"] || "";
      const targetMarket = row["Target Market"] || row["Market"] || "";

      let apiResponseFull = null;
      let isError = false;

      try {
        const response = await fetch("https://nsbot.online/prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sbNo: String(regNo),
            answers: {
              problem_statement: String(problemStatement || ""),
              solution: String(solution || ""),
              innovation: String(innovation || ""),
              target_market: String(targetMarket || ""),
            },
          }),
        });

        if (!response.ok) {
          isError = true;
        } else {
          const apiResult = await response.json();

          // Expect: apiResult.response = enforced object
          if (apiResult && apiResult.response && Array.isArray(apiResult.response.ratings)) {
            apiResponseFull = apiResult.response;
          } else {
            isError = true;
          }
        }
      } catch (err) {
        console.error("Fetch error", err);
        isError = true;
      }

      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      const overall = apiResponseFull?.overall_score ?? 0;
      const decision = apiResponseFull?.decision ?? "reject";
      const businessType = apiResponseFull?.business_type ?? "traditional";

      const newEntry = {
        sNo: i + 1,
        regNo: String(regNo),
        entityName,
        stage,

        // New key metrics
        decision,
        business_type: businessType,
        overall_score: overall,
        innovation_score: apiResponseFull?.innovation_score ?? 0,
        scalability_score: apiResponseFull?.scalability_score ?? 0,
        qualifier_count: apiResponseFull?.qualifier_count ?? 0,
        comment: apiResponseFull?.summary || (isError ? "AI Service Unavailable" : "No summary provided."),
        timeTaken: duration,
        isError,

        // For modal
        apiResponse: apiResponseFull,
        inputData: { problemStatement, solution, innovation, targetMarket },
      };

      setProcessedData((prev) => [...prev, newEntry]);
      setProcessedCount(i + 1);

      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
      }
    }

    setIsProcessing(false);
    setIsComplete(true);
  };

  const downloadReport = () => {
    if (processedData.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(
      processedData.map((item) => ({
        "S. No": item.sNo,
        "Reg No": item.regNo,
        "Entity Name": item.entityName,
        Stage: item.stage,
        Decision: prettifyDecision(item.decision),
        "Business Type": prettifyBusinessType(item.business_type),
        "Overall Score (/10)": Number(item.overall_score).toFixed(1),
        "Innovation (/10)": Number(item.innovation_score).toFixed(1),
        "Scalability (/10)": Number(item.scalability_score).toFixed(1),
        "Qualifier Count": item.qualifier_count,
        "Time Taken (s)": item.timeTaken,
        "NSBot Summary": item.comment,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Startup_Review_Report");
    XLSX.writeFile(wb, `NSBot_Startup_Review_${Date.now()}.xlsx`);
  };

  const resetUpload = () => {
    setFile(null);
    setProcessedData([]);
    setTotalEntries(0);
    setProcessedCount(0);
    setIsProcessing(false);
    setIsComplete(false);
    setSelectedEntry(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mt-6 mb-8 relative overflow-hidden rounded-3xl bg-[#0a0a12] border border-[#2d2d3f] shadow-2xl min-h-[600px] flex flex-col">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
      </div>

      <div className="relative z-10 p-8 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                NSBot Startup Selection{" "}
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-semibold">
                  Beta
                </span>
              </h2>
              <p className="text-gray-400 text-sm">Automated triage: Funding • Incubation • Reject</p>
            </div>
          </div>

          {(isProcessing || isComplete) && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a2e] border border-[#2d2d3f] rounded-lg">
                <FileSpreadsheet size={14} className="text-emerald-500" />
                <span className="text-xs text-gray-400 font-mono truncate max-w-[150px]">{file?.name}</span>
              </div>

              <div className="flex flex-col items-end">
                <span className={`text-sm font-semibold ${isComplete ? "text-emerald-400" : "text-indigo-400"}`}>
                  {isComplete ? "Evaluation Complete" : "NSBot is evaluating..."}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  {processedCount} / {totalEntries} Entries
                </span>
              </div>

              <div className="w-12 h-12 rounded-full bg-[#1e1e2d] border border-[#2d2d3f] flex items-center justify-center relative">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#2d2d3f]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className={`${isComplete ? "text-emerald-500" : "text-indigo-500"} transition-all duration-500 ease-out`}
                    strokeDasharray={`${(processedCount / Math.max(totalEntries, 1)) * 100}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
                {isComplete ? (
                  <CheckCircle2 size={16} className="text-emerald-500 absolute" />
                ) : (
                  <Loader size={16} className="text-indigo-500 absolute animate-spin" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Upload */}
        {!file ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
            <div
              className="border-2 border-dashed border-[#2d2d3f] bg-[#13131f]/50 rounded-2xl p-16 flex flex-col items-center justify-center text-center hover:border-indigo-500/50 hover:bg-[#1a1a2e] transition-all group cursor-pointer w-full max-w-2xl"
              onClick={() => fileInputRef.current.click()}
            >
              <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" ref={fileInputRef} />
              <div className="w-24 h-24 rounded-full bg-[#1e1e2d] group-hover:bg-[#252538] flex items-center justify-center mb-8 transition-all shadow-xl shadow-black/20 group-hover:scale-110 duration-300 border border-[#2d2d3f]">
                <Upload className="text-indigo-400" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Upload Application Data</h3>
              <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                Upload .xlsx containing: Registration No, Entity Name, Stage, Problem Statement, Solution, Innovation, Target Market.
              </p>
              <button className="mt-8 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-600/20">
                Browse Files
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                {isProcessing && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-[#1a1a2e] border border-[#2d2d3f] rounded-lg">
                    <ThinkingIndicator elapsedLabel="NSBot" />
                    <span className="text-sm text-gray-300 animate-pulse">Evaluating Entry #{processedCount + 1}...</span>
                  </div>
                )}

                {isComplete && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-medium">Evaluation Completed Successfully</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadReport}
                  disabled={processedData.length === 0}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg 
                    ${
                      processedData.length > 0
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                        : "bg-[#1e1e2d] text-gray-500 cursor-not-allowed border border-[#2d2d3f]"
                    }
                  `}
                >
                  <Download size={16} />
                  Download Report
                </button>
                <button
                  onClick={resetUpload}
                  className="p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-[#2d2d3f]"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 bg-[#13131f] border border-[#2d2d3f] rounded-2xl overflow-hidden shadow-xl flex flex-col">
              <div className="overflow-x-auto custom-scrollbar flex-1" ref={tableContainerRef}>
                <table className="w-full text-left text-sm text-gray-400 relative">
                  <thead className="text-xs uppercase bg-[#0f0f16] text-gray-500 sticky top-0 z-10 box-decoration-clone">
                    <tr>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">
                        S. No
                      </th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">
                        Reg No
                      </th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">
                        Entity Name
                      </th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">
                        Stage
                      </th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">
                        Decision
                      </th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">
                        Type
                      </th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16] text-indigo-400">
                        Overall
                      </th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16] text-indigo-400">
                        Innovation
                      </th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16] text-indigo-400">
                        Scalability
                      </th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16]">
                        Qualifiers
                      </th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16] text-blue-400">
                        Time
                      </th>
                      <th className="px-6 py-4 font-semibold border-b border-[#2d2d3f] whitespace-nowrap bg-[#0f0f16] text-gray-300">
                        NSBot Summary
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#2d2d3f]">
                    {processedData.map((row, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-[#1a1a2e] cursor-pointer group"
                        onClick={() => setSelectedEntry(row)}
                        title="Click to view detailed analysis"
                      >
                        <td className="px-6 py-4 font-mono text-gray-500">{row.sNo}</td>
                        <td className="px-6 py-4 font-mono text-gray-300 group-hover:text-indigo-400 transition-colors">
                          {row.regNo}
                        </td>
                        <td className="px-6 py-4 font-medium text-white">{row.entityName}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {row.stage}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDecisionPill(row.decision)}`}>
                            {prettifyDecision(row.decision)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              row.business_type === "startup"
                                ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }`}
                          >
                            {prettifyBusinessType(row.business_type)}
                          </span>
                        </td>

                        <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.overall_score)}`}>
                          {Number(row.overall_score).toFixed(1)}
                        </td>
                        <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.innovation_score)}`}>
                          {Number(row.innovation_score).toFixed(1)}
                        </td>
                        <td className={`px-6 py-4 text-center font-mono ${getScoreColor(row.scalability_score)}`}>
                          {Number(row.scalability_score).toFixed(1)}
                        </td>
                        <td className="px-6 py-4 text-center font-mono text-gray-300">{row.qualifier_count}</td>
                        <td className="px-6 py-4 text-center font-mono text-blue-400 text-xs">{row.timeTaken}s</td>
                        <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate">{row.comment}</td>
                      </motion.tr>
                    ))}

                    <tr className="h-4"></tr>
                  </tbody>
                </table>

                {processedData.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Loader className="animate-spin mb-4 text-indigo-500 opacity-50" size={32} />
                    <p>NSBot is ready to start evaluation...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Overlay */}
        <AnimatePresence>
          {selectedEntry && <DetailModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f0f16;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2d2d3f;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f5a;
        }
      `}</style>
    </div>
  );
};

export default AIReviewSection;
