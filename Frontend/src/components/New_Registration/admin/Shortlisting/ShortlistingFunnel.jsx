import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  RefreshCw,
  Plus,
  Save,
  UploadCloud,
  Eye,
  CheckCircle2,
  XCircle,
  Send,
  CalendarClock,
  RotateCcw,
  AlertTriangle,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";

import { db } from "../../../AdminRedesign/NewApplicationAdmin/firebase";

import {
  APP_COLLECTION,
  BATCH_COLLECTION,
  DEFAULT_COUNTS,
  DEFAULT_PUBLISH,
  FUNNEL_STAGES,
  STATUS,
  buildBatchApplication,
  buildSchedule,
  calculateCounts,
  formatDate,
  getAIScore,
  getApplicationId,
  getEffectiveSubmittedDate,
  getEmail,
  getExpertScore,
  getFounderName,
  getPhone,
  getRowsForStage,
  getStartupName,
  getStatus,
  isSubmittedStatus,
  readExpertReview,
  safe,
  toDate,
} from "./ShortlistingFunnelUtils";

import {
  Field,
  FunnelBar,
  MiniCount,
  PaginationBar,
  ScheduleText,
  ScoreBadge,
  SearchBox,
  SectionCard,
  StatusBadge,
  buttonBase,
  inputClass,
  usePagination,
} from "./ShortlistingFunnelUI";

const emptyBatchForm = {
  batchId: "",
  batchName: "",
  startDate: "",
  endDate: "",
};

const emptyScheduleForm = {
  date: "",
  startTime: "",
  endTime: "",
  mode: "Online",
  venue: "",
  instruction: "",
};

const getStageLabel = (stage) => {
  if (stage === FUNNEL_STAGES.AI) return "AI Screening";
  if (stage === FUNNEL_STAGES.EXPERT) return "Expert Review";
  if (stage === FUNNEL_STAGES.WRITTEN) return "Written";
  if (stage === FUNNEL_STAGES.PI) return "PI / Pitch";
  if (stage === FUNNEL_STAGES.FINAL) return "Final";
  return "Applications";
};

const normalizeId = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9]/g, "");

const getResetPublishPatch = (stage, currentPublish = {}) => {
  if (stage === FUNNEL_STAGES.AI) {
    return {
      ...currentPublish,
      aiResult: false,
      expertResult: false,
      writtenSchedule: false,
      writtenResult: false,
      piSchedule: false,
      piResult: false,
      finalResult: false,
    };
  }

  if (stage === FUNNEL_STAGES.EXPERT) {
    return {
      ...currentPublish,
      expertResult: false,
      writtenSchedule: false,
      writtenResult: false,
      piSchedule: false,
      piResult: false,
      finalResult: false,
    };
  }

  if (stage === FUNNEL_STAGES.WRITTEN) {
    return {
      ...currentPublish,
      writtenSchedule: false,
      writtenResult: false,
      piSchedule: false,
      piResult: false,
      finalResult: false,
    };
  }

  if (stage === FUNNEL_STAGES.PI) {
    return {
      ...currentPublish,
      piSchedule: false,
      piResult: false,
      finalResult: false,
    };
  }

  if (stage === FUNNEL_STAGES.FINAL) {
    return {
      ...currentPublish,
      finalResult: false,
    };
  }

  return currentPublish;
};

const getResetPayload = (stage, item) => {
  const resetExpert = {
    status: STATUS.PENDING,
    cutoffUsed: null,
    updatedAt: null,
  };

  const resetWritten = {
    schedule: null,
    marks: null,
    maxMarks: item?.written?.maxMarks || 100,
    status: STATUS.PENDING,
    remarks: "",
    updatedAt: null,
  };

  const resetPi = {
    schedule: null,
    selected: null,
    marks: null,
    remarks: "",
    updatedAt: null,
  };

  const resetFinal = {
    status: STATUS.PENDING,
    remarks: "",
    updatedAt: null,
  };

  if (stage === FUNNEL_STAGES.AI) {
    return {
      ai: {
        status: STATUS.PENDING,
        cutoffUsed: null,
        updatedAt: null,
      },
      expert: resetExpert,
      written: resetWritten,
      pi: resetPi,
      final: resetFinal,
      currentStage: FUNNEL_STAGES.ALL,
      lastUpdatedAt: serverTimestamp(),
    };
  }

  if (stage === FUNNEL_STAGES.EXPERT) {
    return {
      expert: resetExpert,
      written: resetWritten,
      pi: resetPi,
      final: resetFinal,
      currentStage: FUNNEL_STAGES.EXPERT,
      lastUpdatedAt: serverTimestamp(),
    };
  }

  if (stage === FUNNEL_STAGES.WRITTEN) {
    return {
      written: resetWritten,
      pi: resetPi,
      final: resetFinal,
      currentStage: FUNNEL_STAGES.WRITTEN,
      lastUpdatedAt: serverTimestamp(),
    };
  }

  if (stage === FUNNEL_STAGES.PI) {
    return {
      pi: resetPi,
      final: resetFinal,
      currentStage: FUNNEL_STAGES.PI,
      lastUpdatedAt: serverTimestamp(),
    };
  }

  if (stage === FUNNEL_STAGES.FINAL) {
    return {
      final: resetFinal,
      currentStage: FUNNEL_STAGES.FINAL,
      lastUpdatedAt: serverTimestamp(),
    };
  }

  return {};
};

const getPiStatusText = (item) => {
  if (item?.pi?.selected === true) return "Selected";
  if (item?.pi?.selected === false) return "Not Selected";
  return "Pending";
};

const getFinalStatusText = (item) => {
  if (item?.final?.status === STATUS.RECOGNISED) return "Recognised";
  if (item?.final?.status === STATUS.NOT_RECOGNISED) return "Not Recognised";
  return item?.final?.status || "Pending";
};

const getExcelRowsForStage = (stage, rows) => {
  return rows.map((item, index) => {
    const base = {
      "Sl No": index + 1,
      "SB No": item.applicationId || "",
      "Startup Name": item.startupName || "",
      "Founder Name": item.founderName || "",
      Email: item.email || "",
      Phone: item.phone || "",
      "Submitted On": formatDate(item.submittedAt) || "",
      "Current Stage": item.currentStage || "",
    };

    if (stage === FUNNEL_STAGES.ALL) {
      return {
        ...base,
        "AI Status": item.ai?.status || "pending",
        "AI Score": item.aiScore ?? "",
        "Expert Status": item.expert?.status || "pending",
        "Expert Score": item.expertScore ?? "",
        "Written Status": item.written?.status || "pending",
        "Written Marks": item.written?.marks ?? "",
        "PI Status": getPiStatusText(item),
        "PI Marks": item.pi?.marks ?? "",
        "Final Status": getFinalStatusText(item),
      };
    }

    if (stage === FUNNEL_STAGES.AI) {
      return {
        ...base,
        "AI Score": item.aiScore ?? "",
        "Current AI Status": item.ai?.status || "pending",
        "Preview Next AI Status": item.nextStatus || "",
      };
    }

    if (stage === FUNNEL_STAGES.EXPERT) {
      return {
        ...base,
        "AI Status": item.ai?.status || "pending",
        "Expert Score": item.expertScore ?? "",
        "Current Expert Status": item.expert?.status || "pending",
        "Preview Next Expert Status": item.nextStatus || "",
      };
    }

    if (stage === FUNNEL_STAGES.WRITTEN) {
      return {
        ...base,
        "Expert Status": item.expert?.status || "pending",
        "Written Date": item.written?.schedule?.date || "",
        "Written Start Time": item.written?.schedule?.startTime || "",
        "Written End Time": item.written?.schedule?.endTime || "",
        "Written Mode": item.written?.schedule?.mode || "",
        "Written Venue / Link": item.written?.schedule?.venue || "",
        "Written Instruction": item.written?.schedule?.instruction || "",
        "Written Marks": item.written?.marks ?? "",
        "Written Status": item.written?.status || "pending",
      };
    }

    if (stage === FUNNEL_STAGES.PI) {
      return {
        ...base,
        "Written Status": item.written?.status || "pending",
        "PI Date": item.pi?.schedule?.date || "",
        "PI Start Time": item.pi?.schedule?.startTime || "",
        "PI End Time": item.pi?.schedule?.endTime || "",
        "PI Mode": item.pi?.schedule?.mode || "",
        "PI Venue / Link": item.pi?.schedule?.venue || "",
        "PI Instruction": item.pi?.schedule?.instruction || "",
        "PI Marks": item.pi?.marks ?? "",
        "PI Status": getPiStatusText(item),
        "Final Status": getFinalStatusText(item),
      };
    }

    return {
      ...base,
      "PI Status": getPiStatusText(item),
      "Final Status": getFinalStatusText(item),
    };
  });
};

const downloadWorkbook = ({ fileName, sheetName, rows }) => {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, fileName);
};

const extractApplicationIdsFromExcel = async (file) => {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) return [];

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: "",
    raw: false,
  });

  if (!rows.length) return [];

  const possibleKeys = [
    "SB No",
    "SBNo",
    "SB_NO",
    "Application ID",
    "ApplicationID",
    "Application Id",
    "applicationId",
    "application_id",
    "Registration No",
    "Registration Number",
    "Startup ID",
  ];

  const ids = [];

  rows.forEach((row) => {
    let value = "";

    for (const key of possibleKeys) {
      if (row[key]) {
        value = row[key];
        break;
      }
    }

    if (!value) {
      const firstValue = Object.values(row).find((item) => String(item || "").trim());
      value = firstValue || "";
    }

    const normalized = normalizeId(value);

    if (normalized) ids.push(normalized);
  });

  return [...new Set(ids)];
};

export default function ShortlistingFunnel() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchRows, setBatchRows] = useState([]);

  const [activeStage, setActiveStage] = useState(FUNNEL_STAGES.ALL);
  const [batchForm, setBatchForm] = useState(emptyBatchForm);

  const [assignPanelOpen, setAssignPanelOpen] = useState(false);
  const [previewDateRange, setPreviewDateRange] = useState({ from: "", to: "" });
  const [previewRows, setPreviewRows] = useState([]);
  const [selectedPreviewIds, setSelectedPreviewIds] = useState({});
  const [previewStats, setPreviewStats] = useState({
    scanned: 0,
    submitted: 0,
    draftExcluded: 0,
    noDate: 0,
    outsideDate: 0,
    inRange: 0,
    alreadyAdded: 0,
  });

  const [aiCutoff, setAiCutoff] = useState("8");
  const [expertCutoff, setExpertCutoff] = useState("7.5");

  const [writtenSchedule, setWrittenSchedule] = useState(emptyScheduleForm);
  const [piSchedule, setPiSchedule] = useState(emptyScheduleForm);

  const [selectedRowIds, setSelectedRowIds] = useState({});
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const batchLabel =
    selectedBatch?.batchName || selectedBatch?.batchId || selectedBatchId || "-";

  const counts = useMemo(() => calculateCounts(batchRows), [batchRows]);
  const publish = selectedBatch?.publish || DEFAULT_PUBLISH;

  const stageRows = useMemo(
    () => getRowsForStage(activeStage, batchRows),
    [activeStage, batchRows]
  );

  const decoratedStageRows = useMemo(() => {
    if (activeStage === FUNNEL_STAGES.AI) {
      const cutoff = Number(aiCutoff);

      return stageRows.map((item) => {
        const score = Number(item.aiScore);
        const nextStatus =
          Number.isFinite(score) && Number.isFinite(cutoff) && score >= cutoff
            ? STATUS.SHORTLISTED
            : STATUS.NOT_SHORTLISTED;

        return { ...item, nextStatus };
      });
    }

    if (activeStage === FUNNEL_STAGES.EXPERT) {
      const cutoff = Number(expertCutoff);

      return stageRows.map((item) => {
        const score = Number(item.expertScore);
        const nextStatus =
          Number.isFinite(score) && Number.isFinite(cutoff) && score >= cutoff
            ? STATUS.SHORTLISTED
            : STATUS.NOT_SHORTLISTED;

        return { ...item, nextStatus };
      });
    }

    return stageRows;
  }, [activeStage, stageRows, aiCutoff, expertCutoff]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return decoratedStageRows;

    return decoratedStageRows.filter((item) =>
      [
        item.applicationId,
        item.startupName,
        item.founderName,
        item.email,
        item.phone,
        item.ai?.status,
        item.expert?.status,
        item.written?.status,
        item.pi?.selected === true ? "pi selected" : "",
        item.pi?.selected === false ? "pi not selected" : "",
        item.final?.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [decoratedStageRows, search]);

  const pager = usePagination(filteredRows, 15);

  const selectedCount = useMemo(
    () => Object.values(selectedRowIds).filter(Boolean).length,
    [selectedRowIds]
  );

  const previewSelectedCount = useMemo(
    () => Object.values(selectedPreviewIds).filter(Boolean).length,
    [selectedPreviewIds]
  );

  const currentStageTitle = useMemo(() => {
    if (activeStage === FUNNEL_STAGES.ALL) return "Applications in Batch";
    if (activeStage === FUNNEL_STAGES.AI) return "AI Screening";
    if (activeStage === FUNNEL_STAGES.EXPERT) return "Expert Review";
    if (activeStage === FUNNEL_STAGES.WRITTEN) return "Written Test";
    if (activeStage === FUNNEL_STAGES.PI) return "PI / Pitch";
    if (activeStage === FUNNEL_STAGES.FINAL) return "Final Recognition";
    return "Applications";
  }, [activeStage]);

  const selectedVisibleRows = () =>
    filteredRows.filter((item) => selectedRowIds[item.applicationId]);

  const getResetRows = (stage) => {
    const selectedRows = selectedVisibleRows();

    if (
      selectedRows.length &&
      [FUNNEL_STAGES.WRITTEN, FUNNEL_STAGES.PI, FUNNEL_STAGES.FINAL].includes(
        stage
      )
    ) {
      return { rows: selectedRows, scopeText: "selected applications" };
    }

    if (stage === FUNNEL_STAGES.AI) {
      return { rows: batchRows, scopeText: "all applications in this batch" };
    }

    return { rows: stageRows, scopeText: "all applications in this stage" };
  };

  const loadBatches = async () => {
    const snap = await getDocs(
      query(collection(db, BATCH_COLLECTION), orderBy("createdAt", "desc"))
    );

    const rows = snap.docs.map((item) => ({ id: item.id, ...item.data() }));
    setBatches(rows);

    if (!selectedBatchId && rows.length) {
      setSelectedBatchId(rows[0].id);
    }
  };

  const loadSelectedBatch = async (batchId = selectedBatchId) => {
    if (!batchId) {
      setSelectedBatch(null);
      return;
    }

    const snap = await getDoc(doc(db, BATCH_COLLECTION, batchId));

    if (snap.exists()) {
      setSelectedBatch({ id: snap.id, ...snap.data() });
    } else {
      setSelectedBatch(null);
    }
  };

  const loadBatchRows = async (batchId = selectedBatchId) => {
    if (!batchId) {
      setBatchRows([]);
      return;
    }

    const snap = await getDocs(
      collection(db, BATCH_COLLECTION, batchId, "applications")
    );

    const rows = snap.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) =>
        String(a.applicationId || "").localeCompare(String(b.applicationId || ""))
      );

    setBatchRows(rows);
  };

  const refreshAll = async () => {
    try {
      setLoading(true);
      await loadBatches();

      if (selectedBatchId) {
        await Promise.all([
          loadSelectedBatch(selectedBatchId),
          loadBatchRows(selectedBatchId),
        ]);
      }
    } catch (error) {
      console.error("Refresh failed", error);
      alert("Failed to refresh shortlisting funnel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches().catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedBatchId) {
      setSelectedBatch(null);
      setBatchRows([]);
      return;
    }

    loadSelectedBatch(selectedBatchId).catch(console.error);
    loadBatchRows(selectedBatchId).catch(console.error);
    setSearch("");
    setSelectedRowIds({});
  }, [selectedBatchId]);

  const createBatch = async () => {
    const batchId = batchForm.batchId.trim();
    const batchName = batchForm.batchName.trim() || batchId;

    if (!batchId || !batchForm.startDate || !batchForm.endDate) {
      alert("Enter batch ID, start date and end date.");
      return;
    }

    try {
      setSaving(true);

      await setDoc(
        doc(db, BATCH_COLLECTION, batchId),
        {
          batchId,
          batchName,
          startDate: batchForm.startDate,
          endDate: batchForm.endDate,
          publish: DEFAULT_PUBLISH,
          counts: DEFAULT_COUNTS,
          status: "active",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setBatchForm(emptyBatchForm);
      setSelectedBatchId(batchId);

      await loadBatches();
      await loadSelectedBatch(batchId);

      alert(`Batch ${batchId} created.`);
    } catch (error) {
      console.error("Create batch failed", error);
      alert("Failed to create batch.");
    } finally {
      setSaving(false);
    }
  };

  const previewSubmittedApplications = async () => {
    if (!selectedBatchId || !selectedBatch) {
      alert("Select or create batch first.");
      return;
    }

    const fromDate = previewDateRange.from || selectedBatch.startDate;
    const toDateValue = previewDateRange.to || selectedBatch.endDate;

    if (!fromDate || !toDateValue) {
      alert("Select submitted from and submitted to date.");
      return;
    }

    try {
      setPreviewLoading(true);

      const start = new Date(`${fromDate}T00:00:00`);
      const end = new Date(`${toDateValue}T23:59:59`);
      const alreadyAdded = new Set(batchRows.map((item) => String(item.applicationId)));

      const snap = await getDocs(
        query(collection(db, APP_COLLECTION), orderBy("createdAt", "desc"))
      );

      let scanned = 0;
      let submitted = 0;
      let draftExcluded = 0;
      let noDate = 0;
      let outsideDate = 0;
      let alreadyAddedCount = 0;

      const rawRows = [];

      snap.docs.forEach((docItem) => {
        scanned += 1;
        const data = docItem.data();

        if (!isSubmittedStatus(data)) {
          draftExcluded += 1;
          return;
        }

        submitted += 1;

        const submittedAtRaw = getEffectiveSubmittedDate(data);
        const submittedAtDate = toDate(submittedAtRaw);

        if (!submittedAtDate) {
          noDate += 1;
          return;
        }

        if (submittedAtDate < start || submittedAtDate > end) {
          outsideDate += 1;
          return;
        }

        const applicationId = getApplicationId(data, docItem.id);
        const exists = alreadyAdded.has(String(applicationId));

        if (exists) alreadyAddedCount += 1;

        rawRows.push({
          id: docItem.id,
          ...data,
          applicationDocId: docItem.id,
          applicationId,
          startupName: getStartupName(data),
          founderName: getFounderName(data),
          email: getEmail(data),
          phone: getPhone(data),
          status: getStatus(data) || "submitted",
          submittedAt: submittedAtRaw,
          aiScore: getAIScore(data),
          expertScore: null,
          alreadyAdded: exists,
        });
      });

      const rows = await Promise.all(
        rawRows.map(async (item) => {
          const expertReview = await readExpertReview({
            db,
            applicationDocId: item.applicationDocId,
          });

          return {
            ...item,
            _expertReview: expertReview,
            expertScore: getExpertScore({
              ...item,
              _expertReview: expertReview,
            }),
          };
        })
      );

      setPreviewRows(rows);
      setPreviewStats({
        scanned,
        submitted,
        draftExcluded,
        noDate,
        outsideDate,
        inRange: rows.length,
        alreadyAdded: alreadyAddedCount,
      });

      const selection = {};
      rows.forEach((item) => {
        selection[item.applicationId] = !item.alreadyAdded;
      });
      setSelectedPreviewIds(selection);
    } catch (error) {
      console.error("Preview failed", error);
      alert("Failed to preview submitted applications.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const assignSelectedToBatch = async () => {
    const rows = previewRows.filter(
      (item) => selectedPreviewIds[item.applicationId] && !item.alreadyAdded
    );

    if (!rows.length) {
      alert("No new applications selected.");
      return;
    }

    try {
      setSaving(true);

      for (let index = 0; index < rows.length; index += 250) {
        const chunk = rows.slice(index, index + 250);
        const batch = writeBatch(db);

        chunk.forEach((item) => {
          const payload = buildBatchApplication({
            item,
            selectedBatchId,
            selectedBatch,
          });

          batch.set(
            doc(db, BATCH_COLLECTION, selectedBatchId, "applications", item.applicationId),
            payload,
            { merge: true }
          );

          batch.set(
            doc(db, APP_COLLECTION, item.applicationDocId),
            {
              shortlistingBatch: {
                batchId: selectedBatchId,
                batchName: selectedBatch?.batchName || selectedBatchId,
                assignedAt: serverTimestamp(),
              },
              firestoreUpdatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        });

        await batch.commit();
      }

      await afterRowsUpdated();

      setPreviewRows((prev) =>
        prev.map((item) =>
          rows.some((x) => x.applicationId === item.applicationId)
            ? { ...item, alreadyAdded: true }
            : item
        )
      );

      alert(`${rows.length} applications assigned to ${batchLabel}.`);
    } catch (error) {
      console.error("Assign failed", error);
      alert("Failed to assign applications to batch.");
    } finally {
      setSaving(false);
    }
  };

  const afterRowsUpdated = async () => {
    const snap = await getDocs(
      collection(db, BATCH_COLLECTION, selectedBatchId, "applications")
    );

    const rows = snap.docs.map((item) => ({ id: item.id, ...item.data() }));
    const countsNext = calculateCounts(rows);

    await updateDoc(doc(db, BATCH_COLLECTION, selectedBatchId), {
      counts: countsNext,
      updatedAt: serverTimestamp(),
    });

    setBatchRows(rows);
    await Promise.all([loadSelectedBatch(selectedBatchId), loadBatches()]);
  };

  const updateSelectedRows = async (rows, getPayload, successMessage) => {
    if (!selectedBatchId) {
      alert("Select batch first.");
      return;
    }

    if (!rows.length) {
      alert("No applications selected.");
      return;
    }

    try {
      setSaving(true);

      for (let index = 0; index < rows.length; index += 300) {
        const chunk = rows.slice(index, index + 300);
        const batch = writeBatch(db);

        chunk.forEach((item) => {
          batch.set(
            doc(db, BATCH_COLLECTION, selectedBatchId, "applications", item.applicationId),
            getPayload(item),
            { merge: true }
          );
        });

        await batch.commit();
      }

      await afterRowsUpdated();
      setSelectedRowIds({});
      alert(successMessage);
    } catch (error) {
      console.error("Update rows failed", error);
      alert("Failed to update selected applications.");
    } finally {
      setSaving(false);
    }
  };

  const downloadCurrentStageExcel = () => {
    const stageLabel = getStageLabel(activeStage).replace(/[^\w]+/g, "_");
    const batchSafe = String(batchLabel || "Batch").replace(/[^\w]+/g, "_");

    const rows = getExcelRowsForStage(activeStage, filteredRows);

    if (!rows.length) {
      alert("No rows available to download.");
      return;
    }

    downloadWorkbook({
      fileName: `${batchSafe}_${stageLabel}_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`,
      sheetName: getStageLabel(activeStage),
      rows,
    });
  };

  const downloadSelectionTemplate = (stage) => {
    const stageLabel = getStageLabel(stage).replace(/[^\w]+/g, "_");

    downloadWorkbook({
      fileName: `${stageLabel}_Selection_Template.xlsx`,
      sheetName: "Selection List",
      rows: [
        {
          "SB No": "SB202600001",
          "Selected": "YES",
          "Remarks": "Optional",
        },
      ],
    });
  };

  const uploadSelectionExcel = async (event, stage) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (![FUNNEL_STAGES.WRITTEN, FUNNEL_STAGES.PI, FUNNEL_STAGES.FINAL].includes(stage)) {
      alert("Excel selection upload is available only for Written, PI and Final stages.");
      return;
    }

    try {
      const ids = await extractApplicationIdsFromExcel(file);

      if (!ids.length) {
        alert("No SB No / Application ID found in Excel.");
        return;
      }

      const availableMap = new Map(
        filteredRows.map((item) => [normalizeId(item.applicationId), item])
      );

      const nextSelection = {};
      const matched = [];
      const unmatched = [];

      ids.forEach((id) => {
        const item = availableMap.get(id);

        if (item) {
          nextSelection[item.applicationId] = true;
          matched.push(item.applicationId);
        } else {
          unmatched.push(id);
        }
      });

      setSelectedRowIds(nextSelection);

      alert(
        [
          `Excel selection loaded for ${getStageLabel(stage)}.`,
          "",
          `IDs in Excel: ${ids.length}`,
          `Matched in current filtered stage: ${matched.length}`,
          `Not found / not eligible in this stage: ${unmatched.length}`,
          "",
          matched.length
            ? "Now click the relevant Mark Selected / Mark Recognised button."
            : "No applications were selected.",
        ].join("\n")
      );
    } catch (error) {
      console.error("Excel selection upload failed", error);
      alert("Failed to read Excel file. Please use .xlsx/.xls format.");
    }
  };

  const resetStage = async (stage) => {
    if (!selectedBatchId || !selectedBatch) {
      alert("Select batch first.");
      return;
    }

    if (stage === FUNNEL_STAGES.ALL) {
      alert("Reset is available only for AI, Expert, Written, PI and Final stages.");
      return;
    }

    const { rows, scopeText } = getResetRows(stage);

    if (!rows.length) {
      alert("No applications available to reset for this stage.");
      return;
    }

    const stageLabel = getStageLabel(stage);

    const downstreamText =
      stage === FUNNEL_STAGES.AI
        ? "This will reset AI, Expert, Written, PI and Final data."
        : stage === FUNNEL_STAGES.EXPERT
        ? "This will reset Expert, Written, PI and Final data."
        : stage === FUNNEL_STAGES.WRITTEN
        ? "This will reset Written, PI and Final data."
        : stage === FUNNEL_STAGES.PI
        ? "This will reset PI and Final data."
        : "This will reset Final data.";

    const confirmText = [
      `Reset ${stageLabel} for ${batchLabel}?`,
      "",
      `Scope: ${scopeText}`,
      `Applications affected: ${rows.length}`,
      "",
      downstreamText,
      "Related published result/schedule flags will also be hidden to avoid incorrect applicant status.",
      "",
      "This action cannot be undone automatically.",
    ].join("\n");

    if (!window.confirm(confirmText)) return;

    const secondConfirm = window.prompt(`Type RESET to confirm resetting ${stageLabel}.`);

    if (secondConfirm !== "RESET") {
      alert("Reset cancelled.");
      return;
    }

    try {
      setSaving(true);

      for (let index = 0; index < rows.length; index += 300) {
        const chunk = rows.slice(index, index + 300);
        const batch = writeBatch(db);

        chunk.forEach((item) => {
          batch.set(
            doc(db, BATCH_COLLECTION, selectedBatchId, "applications", item.applicationId),
            getResetPayload(stage, item),
            { merge: true }
          );
        });

        await batch.commit();
      }

      await setDoc(
        doc(db, BATCH_COLLECTION, selectedBatchId),
        {
          publish: getResetPublishPatch(stage, publish),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await afterRowsUpdated();
      await loadSelectedBatch(selectedBatchId);
      setSelectedRowIds({});

      alert(`${stageLabel} reset completed for ${rows.length} applications.`);
    } catch (error) {
      console.error("Reset failed", error);
      alert("Failed to reset stage data.");
    } finally {
      setSaving(false);
    }
  };

  const applyAiCutoff = async () => {
    const cutoff = Number(aiCutoff);

    if (!Number.isFinite(cutoff)) {
      alert("Enter valid AI cutoff.");
      return;
    }

    const rows = batchRows;
    const shortlisted = rows.filter((item) => Number(item.aiScore) >= cutoff).length;
    const notShortlisted = rows.length - shortlisted;

    if (
      !window.confirm(
        `Apply AI cutoff to ${batchLabel}?\n\nCutoff: ${cutoff}\nShortlisted: ${shortlisted}\nNot shortlisted: ${notShortlisted}`
      )
    ) {
      return;
    }

    await updateSelectedRows(
      rows,
      (item) => {
        const score = Number(item.aiScore);
        const status =
          Number.isFinite(score) && score >= cutoff
            ? STATUS.SHORTLISTED
            : STATUS.NOT_SHORTLISTED;

        return {
          ai: {
            status,
            cutoffUsed: cutoff,
            updatedAt: serverTimestamp(),
          },
          currentStage:
            status === STATUS.SHORTLISTED ? FUNNEL_STAGES.EXPERT : FUNNEL_STAGES.AI,
          lastUpdatedAt: serverTimestamp(),
        };
      },
      "AI screening updated."
    );
  };

  const applyExpertCutoff = async () => {
    const cutoff = Number(expertCutoff);

    if (!Number.isFinite(cutoff)) {
      alert("Enter valid expert cutoff.");
      return;
    }

    const rows = batchRows.filter((item) => item?.ai?.status === STATUS.SHORTLISTED);
    const shortlisted = rows.filter((item) => Number(item.expertScore) >= cutoff).length;
    const notShortlisted = rows.length - shortlisted;

    if (
      !window.confirm(
        `Apply Expert cutoff to ${batchLabel}?\n\nEligible: ${rows.length}\nCutoff: ${cutoff}\nShortlisted: ${shortlisted}\nNot shortlisted: ${notShortlisted}`
      )
    ) {
      return;
    }

    await updateSelectedRows(
      rows,
      (item) => {
        const score = Number(item.expertScore);
        const status =
          Number.isFinite(score) && score >= cutoff
            ? STATUS.SHORTLISTED
            : STATUS.NOT_SHORTLISTED;

        return {
          expert: {
            status,
            cutoffUsed: cutoff,
            updatedAt: serverTimestamp(),
          },
          currentStage:
            status === STATUS.SHORTLISTED
              ? FUNNEL_STAGES.WRITTEN
              : FUNNEL_STAGES.EXPERT,
          lastUpdatedAt: serverTimestamp(),
        };
      },
      "Expert review updated."
    );
  };

  const assignWrittenSchedule = async () => {
    const rows = selectedVisibleRows();

    if (!writtenSchedule.date || !writtenSchedule.startTime || !writtenSchedule.endTime) {
      alert("Enter written test date, start time and end time.");
      return;
    }

    await updateSelectedRows(
      rows,
      () => ({
        written: {
          schedule: buildSchedule(writtenSchedule),
          status: STATUS.PENDING,
          updatedAt: serverTimestamp(),
        },
        currentStage: FUNNEL_STAGES.WRITTEN,
        lastUpdatedAt: serverTimestamp(),
      }),
      `Written schedule assigned to ${rows.length} applications.`
    );
  };

  const markWritten = async (status) => {
    const rows = selectedVisibleRows();

    await updateSelectedRows(
      rows,
      (item) => ({
        written: {
          ...(item.written || {}),
          status,
          updatedAt: serverTimestamp(),
        },
        currentStage:
          status === STATUS.SELECTED ? FUNNEL_STAGES.PI : FUNNEL_STAGES.WRITTEN,
        lastUpdatedAt: serverTimestamp(),
      }),
      `Written stage updated for ${rows.length} applications.`
    );
  };

  const assignPiSchedule = async () => {
    const rows = selectedVisibleRows();

    if (!piSchedule.date || !piSchedule.startTime || !piSchedule.endTime) {
      alert("Enter PI date, start time and end time.");
      return;
    }

    await updateSelectedRows(
      rows,
      () => ({
        pi: {
          schedule: buildSchedule(piSchedule),
          selected: null,
          updatedAt: serverTimestamp(),
        },
        currentStage: FUNNEL_STAGES.PI,
        lastUpdatedAt: serverTimestamp(),
      }),
      `PI schedule assigned to ${rows.length} applications.`
    );
  };

  const markPi = async (selected) => {
    const rows = selectedVisibleRows();

    await updateSelectedRows(
      rows,
      (item) => ({
        pi: {
          ...(item.pi || {}),
          selected,
          updatedAt: serverTimestamp(),
        },
        final: {
          ...(item.final || {}),
          status: selected ? STATUS.RECOGNISED : STATUS.NOT_RECOGNISED,
          updatedAt: serverTimestamp(),
        },
        currentStage: FUNNEL_STAGES.FINAL,
        lastUpdatedAt: serverTimestamp(),
      }),
      selected
        ? `PI selected. ${rows.length} startups marked recognised.`
        : `PI not selected. ${rows.length} startups marked not recognised.`
    );
  };

  const markFinal = async (status) => {
    const rows = selectedVisibleRows();

    await updateSelectedRows(
      rows,
      (item) => ({
        final: {
          ...(item.final || {}),
          status,
          updatedAt: serverTimestamp(),
        },
        currentStage: FUNNEL_STAGES.FINAL,
        lastUpdatedAt: serverTimestamp(),
      }),
      `Final status updated for ${rows.length} applications.`
    );
  };

  const togglePublish = async (key) => {
    if (!selectedBatchId || !selectedBatch) {
      alert("Select batch first.");
      return;
    }

    const nextValue = !publish[key];

    const confirmText = nextValue
      ? `Publish this stage for ${batchLabel}? Applicants in this batch will see this status.`
      : `Hide this stage for ${batchLabel}? Applicants in this batch will not see this status.`;

    if (!window.confirm(confirmText)) return;

    try {
      setSaving(true);

      await setDoc(
        doc(db, BATCH_COLLECTION, selectedBatchId),
        {
          publish: {
            ...publish,
            [key]: nextValue,
          },
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await loadSelectedBatch(selectedBatchId);
    } catch (error) {
      console.error("Publish failed", error);
      alert("Failed to update publish status.");
    } finally {
      setSaving(false);
    }
  };

  const currentStageStats = useMemo(() => {
    if (activeStage === FUNNEL_STAGES.ALL) {
      return [
        ["Total", counts.total, "slate"],
        ["AI Shortlisted", counts.aiShortlisted, "sky"],
        ["Expert Shortlisted", counts.expertShortlisted, "violet"],
      ];
    }

    if (activeStage === FUNNEL_STAGES.AI) {
      return [
        ["Applications", batchRows.length, "slate"],
        ["Shortlisted", counts.aiShortlisted, "emerald"],
        [
          "Not Shortlisted",
          batchRows.filter((x) => x?.ai?.status === STATUS.NOT_SHORTLISTED).length,
          "rose",
        ],
      ];
    }

    if (activeStage === FUNNEL_STAGES.EXPERT) {
      return [
        ["Eligible", stageRows.length, "slate"],
        ["Shortlisted", counts.expertShortlisted, "emerald"],
        [
          "Not Shortlisted",
          stageRows.filter((x) => x?.expert?.status === STATUS.NOT_SHORTLISTED)
            .length,
          "rose",
        ],
      ];
    }

    if (activeStage === FUNNEL_STAGES.WRITTEN) {
      return [
        ["Eligible", stageRows.length, "slate"],
        ["Selected", counts.writtenSelected, "emerald"],
        [
          "Not Selected",
          stageRows.filter((x) => x?.written?.status === STATUS.NOT_SELECTED).length,
          "rose",
        ],
      ];
    }

    if (activeStage === FUNNEL_STAGES.PI) {
      return [
        ["Eligible", stageRows.length, "slate"],
        ["PI Selected", counts.piSelected, "emerald"],
        [
          "PI Not Selected",
          stageRows.filter((x) => x?.pi?.selected === false).length,
          "rose",
        ],
      ];
    }

    return [
      ["Recognised", counts.recognised, "emerald"],
      [
        "Not Recognised",
        batchRows.filter((x) => x?.final?.status === STATUS.NOT_RECOGNISED).length,
        "rose",
      ],
      ["Total", stageRows.length, "slate"],
    ];
  }, [activeStage, counts, batchRows, stageRows]);

  const resetCount = useMemo(() => {
    if (activeStage === FUNNEL_STAGES.ALL) return 0;

    const selectedRows = selectedVisibleRows();

    if (
      selectedRows.length &&
      [FUNNEL_STAGES.WRITTEN, FUNNEL_STAGES.PI, FUNNEL_STAGES.FINAL].includes(
        activeStage
      )
    ) {
      return selectedRows.length;
    }

    if (activeStage === FUNNEL_STAGES.AI) return batchRows.length;

    return stageRows.length;
  }, [activeStage, selectedRowIds, filteredRows, batchRows, stageRows]);

  const selectAllCurrentPage = (checked) => {
    setSelectedRowIds((prev) => {
      const next = { ...prev };
      pager.pagedRows.forEach((item) => {
        next[item.applicationId] = checked;
      });
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 md:p-5">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                Startup Bihar Shortlisting Funnel
              </div>
              <h1 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl">
                Batch-wise Funnel Shortlisting
              </h1>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
                Move applications step by step: Applications → AI → Expert →
                Written → PI → Recognition. Marks are optional at Written and PI
                stages.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Field label="Active Batch">
                <select
                  value={selectedBatchId}
                  onChange={(event) => setSelectedBatchId(event.target.value)}
                  className={inputClass}
                >
                  <option value="">Select batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchName || batch.batchId || batch.id}
                    </option>
                  ))}
                </select>
              </Field>

              <button
                type="button"
                onClick={refreshAll}
                disabled={loading}
                className={`${buttonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </section>

        <SectionCard
          title={`Working Batch: ${batchLabel}`}
          subtitle="All actions below apply only to this selected batch."
        >
          <div className="grid gap-3 md:grid-cols-4">
            <Field label="Batch ID">
              <input
                value={batchForm.batchId}
                onChange={(event) =>
                  setBatchForm((prev) => ({ ...prev, batchId: event.target.value }))
                }
                placeholder="April2026"
                className={inputClass}
              />
            </Field>

            <Field label="Batch Name">
              <input
                value={batchForm.batchName}
                onChange={(event) =>
                  setBatchForm((prev) => ({ ...prev, batchName: event.target.value }))
                }
                placeholder="April 2026"
                className={inputClass}
              />
            </Field>

            <Field label="Start Date">
              <input
                type="date"
                value={batchForm.startDate}
                onChange={(event) =>
                  setBatchForm((prev) => ({
                    ...prev,
                    startDate: event.target.value,
                  }))
                }
                className={inputClass}
              />
            </Field>

            <Field label="End Date">
              <input
                type="date"
                value={batchForm.endDate}
                onChange={(event) =>
                  setBatchForm((prev) => ({ ...prev, endDate: event.target.value }))
                }
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={createBatch}
              disabled={saving}
              className={`${buttonBase} bg-slate-900 text-white hover:bg-slate-800`}
            >
              <Plus size={16} />
              Create Batch
            </button>

            <button
              type="button"
              onClick={() => setAssignPanelOpen((prev) => !prev)}
              disabled={!selectedBatchId}
              className={`${buttonBase} border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100`}
            >
              <UploadCloud size={16} />
              Assign Submitted Applications
            </button>
          </div>
        </SectionCard>

        {assignPanelOpen ? (
          <AssignPanel
            selectedBatch={selectedBatch}
            previewDateRange={previewDateRange}
            setPreviewDateRange={setPreviewDateRange}
            previewStats={previewStats}
            previewRows={previewRows}
            selectedPreviewIds={selectedPreviewIds}
            setSelectedPreviewIds={setSelectedPreviewIds}
            previewSelectedCount={previewSelectedCount}
            previewLoading={previewLoading}
            saving={saving}
            previewSubmittedApplications={previewSubmittedApplications}
            assignSelectedToBatch={assignSelectedToBatch}
          />
        ) : null}

        <FunnelBar
          activeStage={activeStage}
          setActiveStage={(stage) => {
            setActiveStage(stage);
            setSearch("");
            setSelectedRowIds({});
          }}
          counts={counts}
        />

        <SectionCard
          title={currentStageTitle}
          subtitle="Filter, select and mark applications in this stage."
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {currentStageStats.map(([label, value, tone]) => (
              <MiniCount key={label} label={label} value={value} tone={tone} />
            ))}
          </div>

          <StageActions
            activeStage={activeStage}
            aiCutoff={aiCutoff}
            setAiCutoff={setAiCutoff}
            expertCutoff={expertCutoff}
            setExpertCutoff={setExpertCutoff}
            applyAiCutoff={applyAiCutoff}
            applyExpertCutoff={applyExpertCutoff}
            writtenSchedule={writtenSchedule}
            setWrittenSchedule={setWrittenSchedule}
            assignWrittenSchedule={assignWrittenSchedule}
            markWritten={markWritten}
            piSchedule={piSchedule}
            setPiSchedule={setPiSchedule}
            assignPiSchedule={assignPiSchedule}
            markPi={markPi}
            markFinal={markFinal}
            selectedCount={selectedCount}
            publish={publish}
            togglePublish={togglePublish}
            resetStage={resetStage}
            resetCount={resetCount}
            saving={saving}
            downloadCurrentStageExcel={downloadCurrentStageExcel}
            downloadSelectionTemplate={downloadSelectionTemplate}
            uploadSelectionExcel={uploadSelectionExcel}
          />

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <SearchBox
              value={search}
              onChange={(value) => {
                setSearch(value);
                pager.setPage(1);
              }}
              placeholder="Search application, startup, founder..."
            />

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                Showing: {filteredRows.length}
              </span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                Selected: {selectedCount}
              </span>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
            <ApplicationTable
              activeStage={activeStage}
              rows={pager.pagedRows}
              selectedRowIds={selectedRowIds}
              setSelectedRowIds={setSelectedRowIds}
              selectAllCurrentPage={selectAllCurrentPage}
            />

            <PaginationBar
              page={pager.page}
              setPage={pager.setPage}
              pageSize={pager.pageSize}
              total={pager.total}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function AssignPanel({
  selectedBatch,
  previewDateRange,
  setPreviewDateRange,
  previewStats,
  previewRows,
  selectedPreviewIds,
  setSelectedPreviewIds,
  previewSelectedCount,
  previewLoading,
  saving,
  previewSubmittedApplications,
  assignSelectedToBatch,
}) {
  const [previewSearch, setPreviewSearch] = useState("");

  const filteredPreviewRows = useMemo(() => {
    const q = previewSearch.trim().toLowerCase();
    if (!q) return previewRows;

    return previewRows.filter((item) =>
      [item.applicationId, item.startupName, item.founderName, item.email, item.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [previewRows, previewSearch]);

  const pager = usePagination(filteredPreviewRows, 15);

  return (
    <SectionCard
      title="Assign Submitted Applications"
      subtitle="Preview submitted applications by date range and assign selected records to this batch."
    >
      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Submitted From">
          <input
            type="date"
            value={previewDateRange.from}
            onChange={(event) =>
              setPreviewDateRange((prev) => ({ ...prev, from: event.target.value }))
            }
            className={inputClass}
          />
        </Field>

        <Field label="Submitted To">
          <input
            type="date"
            value={previewDateRange.to}
            onChange={(event) =>
              setPreviewDateRange((prev) => ({ ...prev, to: event.target.value }))
            }
            className={inputClass}
          />
        </Field>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() =>
              setPreviewDateRange({
                from: selectedBatch?.startDate || "",
                to: selectedBatch?.endDate || "",
              })
            }
            className={`${buttonBase} w-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
          >
            Use Batch Dates
          </button>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={previewSubmittedApplications}
            disabled={previewLoading}
            className={`${buttonBase} w-full bg-sky-600 text-white hover:bg-sky-700`}
          >
            <Eye size={16} />
            {previewLoading ? "Scanning..." : "Preview"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        <MiniCount label="Scanned" value={previewStats.scanned} />
        <MiniCount label="Submitted" value={previewStats.submitted} tone="emerald" />
        <MiniCount label="Draft Excluded" value={previewStats.draftExcluded} tone="rose" />
        <MiniCount label="No Date" value={previewStats.noDate} tone="amber" />
        <MiniCount label="Outside Date" value={previewStats.outsideDate} />
        <MiniCount label="In Range" value={previewStats.inRange} tone="sky" />
        <MiniCount label="Already Added" value={previewStats.alreadyAdded} tone="violet" />
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchBox
          value={previewSearch}
          onChange={(value) => {
            setPreviewSearch(value);
            pager.setPage(1);
          }}
          placeholder="Search preview list..."
        />

        <button
          type="button"
          onClick={assignSelectedToBatch}
          disabled={!previewSelectedCount || saving}
          className={`${buttonBase} bg-violet-600 text-white hover:bg-violet-700`}
        >
          <UploadCloud size={16} />
          Assign Selected ({previewSelectedCount})
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-[950px] w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Select</th>
              <th className="px-4 py-3">Application</th>
              <th className="px-4 py-3">Startup</th>
              <th className="px-4 py-3">Founder</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">AI</th>
              <th className="px-4 py-3">Expert</th>
              <th className="px-4 py-3">Batch</th>
            </tr>
          </thead>

          <tbody>
            {pager.pagedRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                  No preview rows.
                </td>
              </tr>
            ) : (
              pager.pagedRows.map((item) => (
                <tr key={item.applicationId} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      disabled={item.alreadyAdded}
                      checked={!!selectedPreviewIds[item.applicationId]}
                      onChange={(event) =>
                        setSelectedPreviewIds((prev) => ({
                          ...prev,
                          [item.applicationId]: event.target.checked,
                        }))
                      }
                    />
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">
                    {safe(item.applicationId)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">
                      {safe(item.startupName)}
                    </div>
                    <div className="text-xs text-slate-500">{safe(item.email)}</div>
                  </td>
                  <td className="px-4 py-3">{safe(item.founderName)}</td>
                  <td className="px-4 py-3">{formatDate(item.submittedAt)}</td>
                  <td className="px-4 py-3">
                    <ScoreBadge value={item.aiScore} />
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge value={item.expertScore} />
                  </td>
                  <td className="px-4 py-3">
                    {item.alreadyAdded ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <CheckCircle2 size={12} />
                        Added
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        <XCircle size={12} />
                        New
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <PaginationBar
          page={pager.page}
          setPage={pager.setPage}
          pageSize={pager.pageSize}
          total={pager.total}
        />
      </div>
    </SectionCard>
  );
}

function StageActions({
  activeStage,
  aiCutoff,
  setAiCutoff,
  expertCutoff,
  setExpertCutoff,
  applyAiCutoff,
  applyExpertCutoff,
  writtenSchedule,
  setWrittenSchedule,
  assignWrittenSchedule,
  markWritten,
  piSchedule,
  setPiSchedule,
  assignPiSchedule,
  markPi,
  markFinal,
  selectedCount,
  publish,
  togglePublish,
  resetStage,
  resetCount,
  saving,
  downloadCurrentStageExcel,
  downloadSelectionTemplate,
  uploadSelectionExcel,
}) {
  const uploadInputRef = useRef(null);

  const resetButton = activeStage !== FUNNEL_STAGES.ALL ? (
    <ResetButton
      stage={activeStage}
      count={resetCount}
      saving={saving}
      onClick={() => resetStage(activeStage)}
    />
  ) : null;

  const downloadButton = (
    <button
      type="button"
      onClick={downloadCurrentStageExcel}
      className={`${buttonBase} border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50`}
    >
      <Download size={16} />
      Download Excel
    </button>
  );

  const uploadSelectionButtons =
    activeStage === FUNNEL_STAGES.WRITTEN ||
    activeStage === FUNNEL_STAGES.PI ||
    activeStage === FUNNEL_STAGES.FINAL ? (
      <>
        <input
          ref={uploadInputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(event) => uploadSelectionExcel(event, activeStage)}
        />

        <button
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          className={`${buttonBase} border border-sky-200 bg-white text-sky-700 hover:bg-sky-50`}
        >
          <FileSpreadsheet size={16} />
          Upload SB No Excel
        </button>

        <button
          type="button"
          onClick={() => downloadSelectionTemplate(activeStage)}
          className={`${buttonBase} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
        >
          <Download size={16} />
          Template
        </button>
      </>
    ) : null;

  if (activeStage === FUNNEL_STAGES.ALL) {
    return (
      <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        {downloadButton}
        <span className="flex items-center text-sm">
          Use this stage to review all applications assigned to the selected batch.
        </span>
      </div>
    );
  }

  if (activeStage === FUNNEL_STAGES.AI) {
    return (
      <div className="mt-5 space-y-3 rounded-2xl border border-sky-200 bg-sky-50 p-4">
        <div className="flex flex-wrap gap-2">
          <Field label="AI Cutoff">
            <input
              type="number"
              step="0.1"
              value={aiCutoff}
              onChange={(event) => setAiCutoff(event.target.value)}
              className={inputClass}
            />
          </Field>

          <button
            type="button"
            onClick={applyAiCutoff}
            disabled={saving}
            className={`${buttonBase} bg-sky-600 text-white hover:bg-sky-700 self-end`}
          >
            <Save size={16} />
            Mark AI Shortlisted
          </button>

          <PublishButton
            label="Application Screening Result"
            active={publish.aiResult}
            onClick={() => togglePublish("aiResult")}
          />

          {downloadButton}
          {resetButton}
        </div>

        <ResetHint text="Resetting AI will also reset Expert, Written, PI and Final data." />
      </div>
    );
  }

  if (activeStage === FUNNEL_STAGES.EXPERT) {
    return (
      <div className="mt-5 space-y-3 rounded-2xl border border-violet-200 bg-violet-50 p-4">
        <div className="flex flex-wrap gap-2">
          <Field label="Expert Cutoff">
            <input
              type="number"
              step="0.1"
              value={expertCutoff}
              onChange={(event) => setExpertCutoff(event.target.value)}
              className={inputClass}
            />
          </Field>

          <button
            type="button"
            onClick={applyExpertCutoff}
            disabled={saving}
            className={`${buttonBase} bg-violet-600 text-white hover:bg-violet-700 self-end`}
          >
            <Save size={16} />
            Mark Expert Shortlisted
          </button>

          <PublishButton
            label="Expert Review Result"
            active={publish.expertResult}
            onClick={() => togglePublish("expertResult")}
          />

          {downloadButton}
          {resetButton}
        </div>

        <ResetHint text="Resetting Expert will also reset Written, PI and Final data." />
      </div>
    );
  }

  if (activeStage === FUNNEL_STAGES.WRITTEN) {
    return (
      <div className="mt-5 space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <ScheduleForm form={writtenSchedule} setForm={setWrittenSchedule} />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={assignWrittenSchedule}
            disabled={saving || !selectedCount}
            className={`${buttonBase} bg-slate-900 text-white hover:bg-slate-800`}
          >
            <CalendarClock size={16} />
            Assign Written Schedule ({selectedCount})
          </button>

          <button
            type="button"
            onClick={() => markWritten(STATUS.SELECTED)}
            disabled={saving || !selectedCount}
            className={`${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`}
          >
            <CheckCircle2 size={16} />
            Mark Written Selected
          </button>

          <button
            type="button"
            onClick={() => markWritten(STATUS.NOT_SELECTED)}
            disabled={saving || !selectedCount}
            className={`${buttonBase} bg-rose-600 text-white hover:bg-rose-700`}
          >
            <XCircle size={16} />
            Mark Written Not Selected
          </button>

          <PublishButton
            label="Written Schedule"
            active={publish.writtenSchedule}
            onClick={() => togglePublish("writtenSchedule")}
          />

          <PublishButton
            label="Written Result"
            active={publish.writtenResult}
            onClick={() => togglePublish("writtenResult")}
          />

          {downloadButton}
          {uploadSelectionButtons}
          {resetButton}
        </div>

        <ResetHint text="Upload Excel with SB No / Application ID to auto-select applications in this Written stage. Then click Mark Written Selected or Not Selected." />

        <div className="text-xs font-semibold text-emerald-800">
          Marks are optional. You can directly mark selected or not selected.
        </div>
      </div>
    );
  }

  if (activeStage === FUNNEL_STAGES.PI) {
    return (
      <div className="mt-5 space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <ScheduleForm form={piSchedule} setForm={setPiSchedule} />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={assignPiSchedule}
            disabled={saving || !selectedCount}
            className={`${buttonBase} bg-slate-900 text-white hover:bg-slate-800`}
          >
            <CalendarClock size={16} />
            Assign PI Schedule ({selectedCount})
          </button>

          <button
            type="button"
            onClick={() => markPi(true)}
            disabled={saving || !selectedCount}
            className={`${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`}
          >
            <CheckCircle2 size={16} />
            Mark PI Selected + Recognised
          </button>

          <button
            type="button"
            onClick={() => markPi(false)}
            disabled={saving || !selectedCount}
            className={`${buttonBase} bg-rose-600 text-white hover:bg-rose-700`}
          >
            <XCircle size={16} />
            Mark PI Not Selected
          </button>

          <PublishButton
            label="PI Schedule"
            active={publish.piSchedule}
            onClick={() => togglePublish("piSchedule")}
          />

          <PublishButton
            label="PI Result"
            active={publish.piResult}
            onClick={() => togglePublish("piResult")}
          />

          {downloadButton}
          {uploadSelectionButtons}
          {resetButton}
        </div>

        <ResetHint text="Upload Excel with SB No / Application ID to auto-select applications in this PI stage. Then click Mark PI Selected + Recognised or Mark PI Not Selected." />

        <div className="text-xs font-semibold text-amber-800">
          Marks are optional. PI selected automatically marks the startup as recognised.
        </div>
      </div>
    );
  }

  if (activeStage === FUNNEL_STAGES.FINAL) {
    return (
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => markFinal(STATUS.RECOGNISED)}
            disabled={saving || !selectedCount}
            className={`${buttonBase} bg-emerald-600 text-white hover:bg-emerald-700`}
          >
            <CheckCircle2 size={16} />
            Mark Recognised
          </button>

          <button
            type="button"
            onClick={() => markFinal(STATUS.NOT_RECOGNISED)}
            disabled={saving || !selectedCount}
            className={`${buttonBase} bg-rose-600 text-white hover:bg-rose-700`}
          >
            <XCircle size={16} />
            Mark Not Recognised
          </button>

          <PublishButton
            label="Final Result"
            active={publish.finalResult}
            onClick={() => togglePublish("finalResult")}
          />

          {downloadButton}
          {uploadSelectionButtons}
          {resetButton}
        </div>

        <ResetHint text="Upload Excel with SB No / Application ID to auto-select applications in Final stage." />
      </div>
    );
  }

  return null;
}

function ResetButton({ stage, count, saving, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving || !count}
      className={`${buttonBase} border border-rose-200 bg-white text-rose-700 hover:bg-rose-50`}
    >
      <RotateCcw size={16} />
      Reset {getStageLabel(stage)} ({count || 0})
    </button>
  );
}

function ResetHint({ text }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-900">
      <AlertTriangle size={15} className="mt-0.5 shrink-0" />
      <span>{text}</span>
    </div>
  );
}

function ScheduleForm({ form, setForm }) {
  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
      <Field label="Date">
        <input
          type="date"
          value={form.date}
          onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
          className={inputClass}
        />
      </Field>

      <Field label="Start Time">
        <input
          type="time"
          value={form.startTime}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, startTime: event.target.value }))
          }
          className={inputClass}
        />
      </Field>

      <Field label="End Time">
        <input
          type="time"
          value={form.endTime}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, endTime: event.target.value }))
          }
          className={inputClass}
        />
      </Field>

      <Field label="Mode">
        <select
          value={form.mode}
          onChange={(event) => setForm((prev) => ({ ...prev, mode: event.target.value }))}
          className={inputClass}
        >
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </Field>

      <Field label="Venue / Link">
        <input
          value={form.venue}
          onChange={(event) => setForm((prev) => ({ ...prev, venue: event.target.value }))}
          placeholder="Venue or meeting link"
          className={inputClass}
        />
      </Field>

      <Field label="Instruction">
        <input
          value={form.instruction}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, instruction: event.target.value }))
          }
          placeholder="One-line instruction"
          className={inputClass}
        />
      </Field>
    </div>
  );
}

function PublishButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${buttonBase} border ${
        active
          ? "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Send size={16} />
      {label}: {active ? "Published" : "Hidden"}
    </button>
  );
}

function ApplicationTable({
  activeStage,
  rows,
  selectedRowIds,
  setSelectedRowIds,
  selectAllCurrentPage,
}) {
  const selectable =
    activeStage === FUNNEL_STAGES.WRITTEN ||
    activeStage === FUNNEL_STAGES.PI ||
    activeStage === FUNNEL_STAGES.FINAL;

  return (
    <table className="min-w-[1250px] w-full text-sm">
      <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
        <tr>
          {selectable ? (
            <th className="px-4 py-3">
              <input
                type="checkbox"
                onChange={(event) => selectAllCurrentPage(event.target.checked)}
              />
            </th>
          ) : null}

          <th className="px-4 py-3">Application</th>
          <th className="px-4 py-3">Startup</th>
          <th className="px-4 py-3">Founder</th>

          {activeStage === FUNNEL_STAGES.ALL ? (
            <>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Current Stage</th>
              <th className="px-4 py-3">AI</th>
              <th className="px-4 py-3">Expert</th>
              <th className="px-4 py-3">Written</th>
              <th className="px-4 py-3">PI</th>
              <th className="px-4 py-3">Final</th>
            </>
          ) : null}

          {activeStage === FUNNEL_STAGES.AI ? (
            <>
              <th className="px-4 py-3">AI Score</th>
              <th className="px-4 py-3">Current AI</th>
              <th className="px-4 py-3">Next AI</th>
            </>
          ) : null}

          {activeStage === FUNNEL_STAGES.EXPERT ? (
            <>
              <th className="px-4 py-3">AI Status</th>
              <th className="px-4 py-3">Expert Score</th>
              <th className="px-4 py-3">Current Expert</th>
              <th className="px-4 py-3">Next Expert</th>
            </>
          ) : null}

          {activeStage === FUNNEL_STAGES.WRITTEN ? (
            <>
              <th className="px-4 py-3">Expert Status</th>
              <th className="px-4 py-3">Written Schedule</th>
              <th className="px-4 py-3">Written Marks</th>
              <th className="px-4 py-3">Written Status</th>
            </>
          ) : null}

          {activeStage === FUNNEL_STAGES.PI ? (
            <>
              <th className="px-4 py-3">Written Status</th>
              <th className="px-4 py-3">PI Schedule</th>
              <th className="px-4 py-3">PI Marks</th>
              <th className="px-4 py-3">PI Status</th>
              <th className="px-4 py-3">Final</th>
            </>
          ) : null}

          {activeStage === FUNNEL_STAGES.FINAL ? (
            <>
              <th className="px-4 py-3">PI Status</th>
              <th className="px-4 py-3">Final Status</th>
            </>
          ) : null}
        </tr>
      </thead>

      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={12} className="px-4 py-12 text-center text-slate-500">
              No applications found.
            </td>
          </tr>
        ) : (
          rows.map((item) => (
            <tr key={item.applicationId} className="border-t border-slate-100 align-top">
              {selectable ? (
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={!!selectedRowIds[item.applicationId]}
                    onChange={(event) =>
                      setSelectedRowIds((prev) => ({
                        ...prev,
                        [item.applicationId]: event.target.checked,
                      }))
                    }
                  />
                </td>
              ) : null}

              <td className="px-4 py-3 font-semibold text-slate-900">
                {safe(item.applicationId)}
              </td>

              <td className="px-4 py-3">
                <div className="font-semibold text-slate-800">
                  {safe(item.startupName)}
                </div>
                <div className="text-xs text-slate-500">{safe(item.email)}</div>
              </td>

              <td className="px-4 py-3">{safe(item.founderName)}</td>

              {activeStage === FUNNEL_STAGES.ALL ? (
                <>
                  <td className="px-4 py-3">{formatDate(item.submittedAt)}</td>
                  <td className="px-4 py-3">{safe(item.currentStage)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.ai?.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.expert?.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.written?.status} />
                  </td>
                  <td className="px-4 py-3">
                    {item.pi?.selected === true ? (
                      <StatusBadge value="selected" />
                    ) : item.pi?.selected === false ? (
                      <StatusBadge value="not_selected" />
                    ) : (
                      <StatusBadge value="pending" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.final?.status} />
                  </td>
                </>
              ) : null}

              {activeStage === FUNNEL_STAGES.AI ? (
                <>
                  <td className="px-4 py-3">
                    <ScoreBadge value={item.aiScore} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.ai?.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.nextStatus} />
                  </td>
                </>
              ) : null}

              {activeStage === FUNNEL_STAGES.EXPERT ? (
                <>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.ai?.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge value={item.expertScore} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.expert?.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.nextStatus} />
                  </td>
                </>
              ) : null}

              {activeStage === FUNNEL_STAGES.WRITTEN ? (
                <>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.expert?.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ScheduleText schedule={item.written?.schedule} />
                  </td>
                  <td className="px-4 py-3">{item.written?.marks ?? "-"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.written?.status} />
                  </td>
                </>
              ) : null}

              {activeStage === FUNNEL_STAGES.PI ? (
                <>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.written?.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ScheduleText schedule={item.pi?.schedule} />
                  </td>
                  <td className="px-4 py-3">{item.pi?.marks ?? "-"}</td>
                  <td className="px-4 py-3">
                    {item.pi?.selected === true ? (
                      <StatusBadge value="selected" />
                    ) : item.pi?.selected === false ? (
                      <StatusBadge value="not_selected" />
                    ) : (
                      <StatusBadge value="pending" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.final?.status} />
                  </td>
                </>
              ) : null}

              {activeStage === FUNNEL_STAGES.FINAL ? (
                <>
                  <td className="px-4 py-3">
                    {item.pi?.selected === true ? (
                      <StatusBadge value="selected" />
                    ) : item.pi?.selected === false ? (
                      <StatusBadge value="not_selected" />
                    ) : (
                      <StatusBadge value="pending" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge value={item.final?.status} />
                  </td>
                </>
              ) : null}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}