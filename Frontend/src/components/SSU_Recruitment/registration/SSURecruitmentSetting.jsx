import React, { useEffect, useMemo, useState } from "react";
import {
  FaBell,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaFlag,
  FaInfoCircle,
  FaLink,
  FaRegSave,
  FaSearch,
  FaSpinner,
  FaToggleOff,
  FaToggleOn,
  FaUniversity,
} from "react-icons/fa";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import {
  isSafeSbiCollectLink,
  ssuDocPath,
} from "../registration/ssuFirebasePaths";

const inputClass =
  "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "mb-2 block text-sm font-semibold text-slate-800";

const COLORS = [
  { label: "Amber", value: "amber" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Red", value: "red" },
  { label: "Slate", value: "slate" },
];

const TOR_POSTS = [
  {
    serialNo: 1,
    postName: "Sr. Consultant Startup",
    emoluments: "₹1.25 - ₹1.50 Lakh/Month",
    qualification:
      "B.Tech / BE / Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 10 years overall experience, including at least 4 years in startup ecosystem",
  },
  {
    serialNo: 2,
    postName: "Sr. Consultant Incubation",
    emoluments: "₹1.25 - ₹1.50 Lakh/Month",
    qualification:
      "B.Tech / BE / Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 10 years overall experience, including at least 4 years in startup ecosystem",
  },
  {
    serialNo: 3,
    postName: "Sr. Consultant Finance",
    emoluments: "₹1.25 - ₹1.50 Lakh/Month",
    qualification:
      "Chartered Accountant / Masters or PG Diploma in Business Management Finance",
    experience:
      "Minimum 10 years overall experience, including at least 4 years in Government Sector / startup ecosystem",
  },
  {
    serialNo: 4,
    postName: "Consultant Startup",
    emoluments: "₹1.00 - ₹1.25 Lakh/Month",
    qualification:
      "B.Tech / BE / Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 8 years overall experience, including at least 3 years in startup ecosystem",
  },
  {
    serialNo: 5,
    postName: "Consultant Incubation",
    emoluments: "₹1.00 - ₹1.25 Lakh/Month",
    qualification:
      "B.Tech / BE / Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 8 years overall experience, including at least 3 years in startup ecosystem",
  },
  {
    serialNo: 6,
    postName: "Consultant Media Management",
    emoluments: "₹1.00 - ₹1.25 Lakh/Month",
    qualification:
      "Mass Communication / Master's in Advertising, Public Relations or related field",
    experience:
      "Minimum 8 years overall experience, including at least 3 years in social media planning and strategy",
  },
  {
    serialNo: 7,
    postName: "Consultant IT",
    emoluments: "₹1.00 - ₹1.25 Lakh/Month",
    qualification: "B.Tech / B.E in CS / IT / MCA",
    experience:
      "Minimum 8 years overall experience, including at least 3 years in Government Sector",
  },
  {
    serialNo: 8,
    postName: "Consultant Finance",
    emoluments: "₹1.00 - ₹1.25 Lakh/Month",
    qualification:
      "Masters or PG Diploma in Business Management or equivalent in Finance / CA",
    experience:
      "Minimum 8 years overall experience, including at least 3 years in Government / Banking sector",
  },
  {
    serialNo: 9,
    postName: "Jr. Consultant IT",
    emoluments: "₹0.75 - ₹1.00 Lakh/Month",
    qualification: "B.Tech / B.E in CS / IT / MCA",
    experience:
      "Minimum 5 years overall experience, preferably 2 years in startup ecosystem",
  },
  {
    serialNo: 10,
    postName: "Jr. Consultant Finance",
    emoluments: "₹0.75 - ₹1.00 Lakh/Month",
    qualification:
      "Masters or PG Diploma in Business Management or equivalent in Finance / CA",
    experience:
      "Minimum 5 years overall experience, preferably 2 years in startup ecosystem",
  },
  {
    serialNo: 11,
    postName: "Jr. Consultant Legal",
    emoluments: "₹0.75 - ₹1.00 Lakh/Month",
    qualification: "LLB or Masters in Law from recognized university",
    experience:
      "Minimum 5 years overall experience, preferably 2 years in Government sector",
  },
  {
    serialNo: 12,
    postName: "Jr. Consultant Startup",
    emoluments: "₹0.75 - ₹1.00 Lakh/Month",
    qualification:
      "B.Tech / BE / Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 5 years overall experience, preferably 2 years in startup ecosystem",
  },
  {
    serialNo: 13,
    postName: "Coordinator Graphics Design",
    emoluments: "₹0.50 - ₹0.75 Lakh/Month",
    qualification:
      "Bachelor's / Master's in Graphic Design, Visual Communication, Fine Arts, Media Studies, Animation, Digital Design or equivalent",
    experience:
      "Minimum 3 years overall experience, preferably 1 year in startup ecosystem / Government sector",
  },
  {
    serialNo: 14,
    postName: "Coordinator Startup",
    emoluments: "₹0.50 - ₹0.75 Lakh/Month",
    qualification:
      "B.Tech / BE / Bachelors or Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 3 years overall experience, preferably 1 year in startup ecosystem",
  },
  {
    serialNo: 15,
    postName: "Coordinator Finance",
    emoluments: "₹0.50 - ₹0.75 Lakh/Month",
    qualification:
      "Bachelors or Masters or PG Diploma in Business Management or equivalent in Finance / CA",
    experience:
      "Minimum 3 years overall experience in financial management, preferably 1 year in startup ecosystem",
  },
  {
    serialNo: 16,
    postName: "Coordinator Legal",
    emoluments: "₹0.50 - ₹0.75 Lakh/Month",
    qualification: "LLB or Master's in Law from recognized university",
    experience:
      "Minimum 3 years overall experience, preferably 1 year in Government sector",
  },
];

const defaultFormOpen = {
  isOpen: true,
  close: false,
  lastDate: "",
  message: "SSU Recruitment application is open.",
};

const defaultNotice = {
  active: true,
  notice:
    "SSU Recruitment 2026 application is open. Please read the ToR carefully before applying. Complete the form, SBI Collect payment, payment proof upload, and final submission before the last date.",
  link: "",
  color: "amber",
  linkButtonText: "Read ToR & Eligibility",
};

const defaultFee = {
  active: true,
  amount: 1000,
  currency: "INR",
  paymentMode: "SBI_COLLECT",
  sbiCollectLink: "",
  sbiCollectButtonText: "Pay via SBI Collect",
  applicationNumberInstruction:
    "Copy your application number and paste it in the SBI Collect form wherever application/reference number is required.",
  inactiveMessage:
    "SBI Collect payment link is currently inactive. Please check again later or contact the department.",
};

const defaultResultAnnouncement = {
  active: false,
  title: "Result Announcement",
  message:
    "Result notification will be published here after completion of scrutiny and payment verification.",
  resultLink: "",
  color: "blue",
};

const defaultPaymentVerification = {
  enabled: true,
  requireUtrUnique: true,
  showPaymentVerificationStatus: true,
  pendingMessage:
    "Your application has been submitted. Payment proof and UTR are pending verification.",
  verifiedMessage:
    "Your payment has been verified. Result notification will be published as per schedule.",
  rejectedMessage:
    "Your payment proof could not be verified. Please check remarks or contact the department.",
};

const timestampToLocalInput = (value) => {
  if (!value) return "";

  const date = new Date(Number(value));
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
};

const localInputToTimestamp = (value) => {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.getTime();
};

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(Number(value));
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function SectionCard({ icon, title, subtitle, children, action }) {
  return (
    <section className="rounded-[32px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
      <div className="mb-5 flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
            {icon}
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

function SaveButton({ loading, onClick, label = "Save" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? <FaSpinner className="animate-spin" /> : <FaRegSave />}
      {loading ? "Saving..." : label}
    </button>
  );
}

function TogglePill({
  checked,
  onClick,
  trueLabel = "Active",
  falseLabel = "Inactive",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
        checked
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
    >
      {checked ? <FaToggleOn /> : <FaToggleOff />}
      {checked ? trueLabel : falseLabel}
    </button>
  );
}

function StatusBanner({ type, children }) {
  if (!children) return null;

  const className =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${className}`}
    >
      {children}
    </div>
  );
}

function FieldHelp({ children }) {
  return <p className="mt-2 text-xs leading-relaxed text-slate-500">{children}</p>;
}

export default function SSURecruitmentSettings() {
  const [formOpen, setFormOpen] = useState(defaultFormOpen);
  const [notice, setNotice] = useState(defaultNotice);
  const [fee, setFee] = useState(defaultFee);
  const [resultAnnouncement, setResultAnnouncement] = useState(
    defaultResultAnnouncement
  );
  const [paymentVerification, setPaymentVerification] = useState(
    defaultPaymentVerification
  );

  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const formStatus = useMemo(() => {
    const deadline = localInputToTimestamp(formOpen.lastDate);
    const now = Date.now();

    if (formOpen.close === true || formOpen.isOpen === false) {
      return {
        label: "Closed",
        className: "border-red-200 bg-red-50 text-red-700",
        message: formOpen.message || "Form is manually closed.",
      };
    }

    if (deadline && now > deadline) {
      return {
        label: "Deadline Passed",
        className: "border-amber-200 bg-amber-50 text-amber-700",
        message: `Submission deadline passed on ${formatDateTime(deadline)}.`,
      };
    }

    return {
      label: "Open",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      message: deadline
        ? `Form is open until ${formatDateTime(deadline)}.`
        : "Form is open with no deadline set.",
    };
  }, [formOpen]);

  const sbiLinkSafe = useMemo(() => {
    return isSafeSbiCollectLink(fee.sbiCollectLink);
  }, [fee.sbiCollectLink]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        formSnap,
        noticeSnap,
        feeSnap,
        resultSnap,
        paymentVerificationSnap,
      ] = await Promise.all([
        getDoc(doc(db, ...ssuDocPath.settingFormOpen())),
        getDoc(doc(db, ...ssuDocPath.settingNotice())),
        getDoc(doc(db, ...ssuDocPath.settingFee())),
        getDoc(doc(db, ...ssuDocPath.settingResultAnnouncement())),
        getDoc(doc(db, ...ssuDocPath.settingPaymentVerification())),
      ]);

      if (formSnap.exists()) {
        const data = formSnap.data();

        setFormOpen({
          isOpen: data?.isOpen !== false,
          close: data?.close === true,
          lastDate: timestampToLocalInput(data?.lastDate),
          message: data?.message || "",
        });
      }

      if (noticeSnap.exists()) {
        setNotice({
          ...defaultNotice,
          ...noticeSnap.data(),
        });
      }

      if (feeSnap.exists()) {
        const data = feeSnap.data();

        setFee({
          ...defaultFee,
          ...data,
          active: data?.active !== false,
          amount: Number(data?.amount || defaultFee.amount),
          currency: data?.currency || "INR",
          paymentMode: "SBI_COLLECT",
          sbiCollectLink:
            data?.sbiCollectLink ||
            data?.sbiCollectUrl ||
            data?.paymentLink ||
            "",
          sbiCollectButtonText:
            data?.sbiCollectButtonText || defaultFee.sbiCollectButtonText,
          applicationNumberInstruction:
            data?.applicationNumberInstruction ||
            defaultFee.applicationNumberInstruction,
          inactiveMessage: data?.inactiveMessage || defaultFee.inactiveMessage,
        });
      }

      if (resultSnap.exists()) {
        setResultAnnouncement({
          ...defaultResultAnnouncement,
          ...resultSnap.data(),
        });
      }

      if (paymentVerificationSnap.exists()) {
        setPaymentVerification({
          ...defaultPaymentVerification,
          ...paymentVerificationSnap.data(),
        });
      }
    } catch (err) {
      console.error("Failed to load SSU settings", err);
      setError("Could not load settings. Check Firebase rules and connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveFormOpen = async () => {
    try {
      setSavingKey("formOpen");
      setMessage("");
      setError("");

      const lastDateTs = localInputToTimestamp(formOpen.lastDate);

      await setDoc(
        doc(db, ...ssuDocPath.settingFormOpen()),
        {
          isOpen: formOpen.isOpen === true,
          close: formOpen.close === true,
          lastDate: lastDateTs,
          message: String(formOpen.message || "").trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("Form window settings saved.");
    } catch (err) {
      console.error("Failed to save FormOpen", err);
      setError("Could not save form window settings.");
    } finally {
      setSavingKey("");
      setTimeout(() => setMessage(""), 2200);
    }
  };

  const saveNotice = async () => {
    try {
      setSavingKey("notice");
      setMessage("");
      setError("");

      await setDoc(
        doc(db, ...ssuDocPath.settingNotice()),
        {
          active: notice.active === true,
          notice: String(notice.notice || "").trim(),
          link: String(notice.link || "").trim(),
          color: notice.color || "amber",
          linkButtonText:
            String(notice.linkButtonText || "").trim() ||
            defaultNotice.linkButtonText,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("Notice settings saved.");
    } catch (err) {
      console.error("Failed to save Notice", err);
      setError("Could not save notice settings.");
    } finally {
      setSavingKey("");
      setTimeout(() => setMessage(""), 2200);
    }
  };

  const saveFee = async () => {
    try {
      setSavingKey("fee");
      setMessage("");
      setError("");

      const amount = Number(fee.amount || 0);
      const sbiCollectLink = String(fee.sbiCollectLink || "").trim();

      if (!amount || amount <= 0) {
        setError("Enter a valid application fee amount.");
        return;
      }

      if (fee.active && !sbiCollectLink) {
        setError("Enter SBI Collect payment link or mark payment link inactive.");
        return;
      }

      if (sbiCollectLink && !isSafeSbiCollectLink(sbiCollectLink)) {
        setError(
          "SBI Collect link must be HTTPS and should belong to onlinesbi.sbi."
        );
        return;
      }

      await setDoc(
        doc(db, ...ssuDocPath.settingFee()),
        {
          active: fee.active === true,
          amount,
          currency: fee.currency || "INR",
          paymentMode: "SBI_COLLECT",
          sbiCollectLink,
          sbiCollectButtonText:
            String(fee.sbiCollectButtonText || "").trim() ||
            "Pay via SBI Collect",
          applicationNumberInstruction:
            String(fee.applicationNumberInstruction || "").trim() ||
            defaultFee.applicationNumberInstruction,
          inactiveMessage:
            String(fee.inactiveMessage || "").trim() ||
            defaultFee.inactiveMessage,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("SBI Collect payment settings saved.");
    } catch (err) {
      console.error("Failed to save Fee", err);
      setError("Could not save fee settings.");
    } finally {
      setSavingKey("");
      setTimeout(() => setMessage(""), 2200);
    }
  };

  const saveResultAnnouncement = async () => {
    try {
      setSavingKey("result");
      setMessage("");
      setError("");

      await setDoc(
        doc(db, ...ssuDocPath.settingResultAnnouncement()),
        {
          active: resultAnnouncement.active === true,
          title:
            String(resultAnnouncement.title || "").trim() ||
            "Result Announcement",
          message: String(resultAnnouncement.message || "").trim(),
          resultLink: String(resultAnnouncement.resultLink || "").trim(),
          color: resultAnnouncement.color || "blue",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("Result announcement settings saved.");
    } catch (err) {
      console.error("Failed to save ResultAnnouncement", err);
      setError("Could not save result announcement settings.");
    } finally {
      setSavingKey("");
      setTimeout(() => setMessage(""), 2200);
    }
  };

  const savePaymentVerification = async () => {
    try {
      setSavingKey("paymentVerification");
      setMessage("");
      setError("");

      await setDoc(
        doc(db, ...ssuDocPath.settingPaymentVerification()),
        {
          enabled: paymentVerification.enabled === true,
          requireUtrUnique: paymentVerification.requireUtrUnique === true,
          showPaymentVerificationStatus:
            paymentVerification.showPaymentVerificationStatus === true,
          pendingMessage: String(paymentVerification.pendingMessage || "").trim(),
          verifiedMessage: String(paymentVerification.verifiedMessage || "").trim(),
          rejectedMessage: String(paymentVerification.rejectedMessage || "").trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("Payment verification settings saved.");
    } catch (err) {
      console.error("Failed to save PaymentVerification", err);
      setError("Could not save payment verification settings.");
    } finally {
      setSavingKey("");
      setTimeout(() => setMessage(""), 2200);
    }
  };

  const setFormField = (key, value) => {
    setFormOpen((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setNoticeField = (key, value) => {
    setNotice((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setFeeField = (key, value) => {
    setFee((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setResultField = (key, value) => {
    setResultAnnouncement((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setPaymentVerificationField = (key, value) => {
    setPaymentVerification((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">
          <div className="rounded-[32px] border border-white bg-white px-8 py-7 text-center shadow-sm">
            <FaSpinner className="mx-auto animate-spin text-2xl text-slate-700" />
            <div className="mt-4 text-lg font-bold text-slate-900">
              Loading SSU settings
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Please wait while settings are fetched.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4 md:p-8"
      style={{ backgroundImage: "url('/bg1.jpg')" }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[34px] border border-white/80 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <FaInfoCircle />
                Admin Settings
              </div>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                SSU Recruitment Settings
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
                Manage form dates, notices, SBI Collect payment link,
                application fee, result notification and payment verification
                messages.
              </p>
            </div>

            <button
              type="button"
              onClick={loadSettings}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className={`rounded-2xl border px-4 py-3 ${formStatus.className}`}>
              <div className="text-xs font-semibold uppercase tracking-wide opacity-75">
                Form Status
              </div>
              <div className="mt-1 text-lg font-bold">{formStatus.label}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Last Date
              </div>
              <div className="mt-1 text-sm font-bold">
                {formOpen.lastDate
                  ? formatDateTime(localInputToTimestamp(formOpen.lastDate))
                  : "Not set"}
              </div>
            </div>

            <div
              className={`rounded-2xl border px-4 py-3 ${
                fee.active
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wide opacity-75">
                SBI Collect
              </div>
              <div className="mt-1 text-sm font-bold">
                {fee.active ? "Active" : "Inactive"} • ₹{Number(fee.amount || 0)}
              </div>
            </div>

            <div
              className={`rounded-2xl border px-4 py-3 ${
                paymentVerification.enabled
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wide opacity-75">
                Payment Verification
              </div>
              <div className="mt-1 text-sm font-bold">
                {paymentVerification.enabled ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>

          <div
            className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${formStatus.className}`}
          >
            {formStatus.message}
          </div>
        </div>

        <StatusBanner type="success">{message}</StatusBanner>
        <StatusBanner type="error">{error}</StatusBanner>

        <SectionCard
          icon={<FaCalendarAlt />}
          title="Form Window"
          subtitle="Control whether applicants can submit the form and define the deadline."
          action={
            <SaveButton
              loading={savingKey === "formOpen"}
              onClick={saveFormOpen}
              label="Save Form Settings"
            />
          }
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-bold text-slate-900">
                Form Open
              </div>

              <TogglePill
                checked={formOpen.isOpen}
                onClick={() => setFormField("isOpen", !formOpen.isOpen)}
                trueLabel="Open"
                falseLabel="Closed"
              />

              <FieldHelp>
                If disabled, applicants cannot complete final submission.
              </FieldHelp>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-bold text-slate-900">
                Force Close
              </div>

              <TogglePill
                checked={formOpen.close}
                onClick={() => setFormField("close", !formOpen.close)}
                trueLabel="Force Closed"
                falseLabel="Not Force Closed"
              />

              <FieldHelp>
                Force close overrides last date and immediately blocks submission.
              </FieldHelp>
            </div>

            <div>
              <label className={labelClass}>Last Date & Time</label>
              <input
                type="datetime-local"
                value={formOpen.lastDate}
                onChange={(e) => setFormField("lastDate", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Form Message</label>
              <input
                value={formOpen.message}
                onChange={(e) => setFormField("message", e.target.value)}
                placeholder="Example: SSU Recruitment application is open."
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={<FaBell />}
          title="Applicant Notice"
          subtitle="Notice shown on the SSU recruitment form page."
          action={
            <SaveButton
              loading={savingKey === "notice"}
              onClick={saveNotice}
              label="Save Notice"
            />
          }
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-bold text-slate-900">
                Notice Visibility
              </div>

              <TogglePill
                checked={notice.active}
                onClick={() => setNoticeField("active", !notice.active)}
                trueLabel="Visible"
                falseLabel="Hidden"
              />
            </div>

            <div>
              <label className={labelClass}>Notice Color</label>
              <select
                value={notice.color}
                onChange={(e) => setNoticeField("color", e.target.value)}
                className={inputClass}
              >
                {COLORS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Notice Text</label>
              <textarea
                value={notice.notice}
                onChange={(e) => setNoticeField("notice", e.target.value)}
                rows={4}
                placeholder="Write notice for applicants"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Notice Link</label>
              <input
                value={notice.link}
                onChange={(e) => setNoticeField("link", e.target.value)}
                placeholder="Optional URL"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Notice Link Button Text</label>
              <input
                value={notice.linkButtonText}
                onChange={(e) =>
                  setNoticeField("linkButtonText", e.target.value)
                }
                placeholder="Read ToR & Eligibility"
                className={inputClass}
              />
            </div>

            {notice.link ? (
              <div className="md:col-span-2">
                <a
                  href={notice.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FaExternalLinkAlt />
                  Open notice link
                </a>
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard
          icon={<FaUniversity />}
          title="SBI Collect Payment"
          subtitle="Set application fee, SBI Collect URL, button text and inactive message."
          action={
            <SaveButton
              loading={savingKey === "fee"}
              onClick={saveFee}
              label="Save SBI Collect Settings"
            />
          }
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-bold text-slate-900">
                Payment Link Status
              </div>

              <TogglePill
                checked={fee.active}
                onClick={() => setFeeField("active", !fee.active)}
                trueLabel="Active"
                falseLabel="Inactive"
              />

              <FieldHelp>
                If inactive, applicant payment page will hide the SBI Collect
                button and show the inactive message.
              </FieldHelp>
            </div>

            <div>
              <label className={labelClass}>Application Fee Amount</label>
              <input
                type="number"
                value={fee.amount}
                onChange={(e) => setFeeField("amount", e.target.value)}
                placeholder="1000"
                className={inputClass}
              />
              <FieldHelp>Default fee as per ToR: ₹1000.</FieldHelp>
            </div>

            <div>
              <label className={labelClass}>Currency</label>
              <input
                value={fee.currency}
                onChange={(e) => setFeeField("currency", e.target.value)}
                placeholder="INR"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Payment Mode</label>
              <input value="SBI_COLLECT" disabled className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>SBI Collect Link</label>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  value={fee.sbiCollectLink}
                  onChange={(e) => setFeeField("sbiCollectLink", e.target.value)}
                  placeholder="https://www.onlinesbi.sbi/sbicollect/..."
                  className={inputClass}
                />

                {fee.sbiCollectLink ? (
                  <a
                    href={fee.sbiCollectLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <FaExternalLinkAlt />
                    Test
                  </a>
                ) : null}
              </div>

              <div
                className={`mt-2 rounded-2xl border px-4 py-3 text-xs font-semibold ${
                  sbiLinkSafe
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {sbiLinkSafe
                  ? "Link validation passed. HTTPS onlinesbi.sbi link accepted."
                  : "Invalid link. Use HTTPS link from onlinesbi.sbi only."}
              </div>
            </div>

            <div>
              <label className={labelClass}>Button Text</label>
              <input
                value={fee.sbiCollectButtonText}
                onChange={(e) =>
                  setFeeField("sbiCollectButtonText", e.target.value)
                }
                placeholder="Pay via SBI Collect"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Inactive Message</label>
              <textarea
                value={fee.inactiveMessage}
                onChange={(e) => setFeeField("inactiveMessage", e.target.value)}
                rows={3}
                placeholder="SBI Collect payment link is currently inactive..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Application Number Instruction</label>
              <textarea
                value={fee.applicationNumberInstruction}
                onChange={(e) =>
                  setFeeField("applicationNumberInstruction", e.target.value)
                }
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="md:col-span-2 rounded-3xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-800">
              <div className="flex gap-2">
                <FaLink className="mt-0.5 shrink-0" />
                <div>
                  <div className="font-bold">Safer storage approach</div>
                  <p className="mt-1 leading-relaxed">
                    Make sure to use a correct SBI Collect link for SSU recruitment fee payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={<FaSearch />}
          title="Payment Verification"
          subtitle="Control messages shown while UTR/payment proof is verified by admin."
          action={
            <SaveButton
              loading={savingKey === "paymentVerification"}
              onClick={savePaymentVerification}
              label="Save Verification Settings"
            />
          }
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-bold text-slate-900">
                Verification Enabled
              </div>

              <TogglePill
                checked={paymentVerification.enabled}
                onClick={() =>
                  setPaymentVerificationField(
                    "enabled",
                    !paymentVerification.enabled
                  )
                }
                trueLabel="Enabled"
                falseLabel="Disabled"
              />
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-bold text-slate-900">
                Unique UTR Required
              </div>

              <TogglePill
                checked={paymentVerification.requireUtrUnique}
                onClick={() =>
                  setPaymentVerificationField(
                    "requireUtrUnique",
                    !paymentVerification.requireUtrUnique
                  )
                }
                trueLabel="Required"
                falseLabel="Not Required"
              />
            </div>

            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-bold text-slate-900">
                Show Verification Status
              </div>

              <TogglePill
                checked={paymentVerification.showPaymentVerificationStatus}
                onClick={() =>
                  setPaymentVerificationField(
                    "showPaymentVerificationStatus",
                    !paymentVerification.showPaymentVerificationStatus
                  )
                }
                trueLabel="Show"
                falseLabel="Hide"
              />
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              <div className="font-bold">Admin verification required</div>
              <p className="mt-2 leading-relaxed">
                Applicant uploads SBI Collect screenshot and UTR. Admin verifies
                UTR against SBI Collect report and marks verified/rejected.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Pending Message</label>
              <textarea
                value={paymentVerification.pendingMessage}
                onChange={(e) =>
                  setPaymentVerificationField("pendingMessage", e.target.value)
                }
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Verified Message</label>
              <textarea
                value={paymentVerification.verifiedMessage}
                onChange={(e) =>
                  setPaymentVerificationField("verifiedMessage", e.target.value)
                }
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Rejected Message</label>
              <textarea
                value={paymentVerification.rejectedMessage}
                onChange={(e) =>
                  setPaymentVerificationField("rejectedMessage", e.target.value)
                }
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          icon={<FaFlag />}
          title="Result Announcement"
          subtitle="Applicant status page will show application submitted and this result notification."
          action={
            <SaveButton
              loading={savingKey === "result"}
              onClick={saveResultAnnouncement}
              label="Save Result Announcement"
            />
          }
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 text-sm font-bold text-slate-900">
                Announcement Visibility
              </div>

              <TogglePill
                checked={resultAnnouncement.active}
                onClick={() =>
                  setResultField("active", !resultAnnouncement.active)
                }
                trueLabel="Visible"
                falseLabel="Hidden"
              />
            </div>

            <div>
              <label className={labelClass}>Color</label>
              <select
                value={resultAnnouncement.color}
                onChange={(e) => setResultField("color", e.target.value)}
                className={inputClass}
              >
                {COLORS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Title</label>
              <input
                value={resultAnnouncement.title}
                onChange={(e) => setResultField("title", e.target.value)}
                placeholder="Result Announcement"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Result Link</label>
              <input
                value={resultAnnouncement.resultLink}
                onChange={(e) => setResultField("resultLink", e.target.value)}
                placeholder="Optional result/notice link"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Announcement Message</label>
              <textarea
                value={resultAnnouncement.message}
                onChange={(e) => setResultField("message", e.target.value)}
                rows={4}
                placeholder="Write result announcement or notification message"
                className={`${inputClass} resize-none`}
              />
            </div>

            {resultAnnouncement.resultLink ? (
              <div className="md:col-span-2">
                <a
                  href={resultAnnouncement.resultLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FaExternalLinkAlt />
                  Open Result Link
                </a>
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard
          icon={<FaInfoCircle />}
          title="ToR Post Reference"
          subtitle="Read-only list used in the applicant form for post, qualification, experience and emoluments."
        >
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="max-h-[540px] overflow-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-900 text-white">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3 font-semibold">
                      No.
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 font-semibold">
                      Post
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 font-semibold">
                      Emoluments
                    </th>
                    <th className="min-w-[280px] px-4 py-3 font-semibold">
                      Qualification
                    </th>
                    <th className="min-w-[280px] px-4 py-3 font-semibold">
                      Experience
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {TOR_POSTS.map((post) => (
                    <tr key={post.serialNo} className="align-top hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {post.serialNo}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {post.postName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {post.emoluments}
                      </td>
                      <td className="px-4 py-3 leading-relaxed text-slate-600">
                        {post.qualification}
                      </td>
                      <td className="px-4 py-3 leading-relaxed text-slate-600">
                        {post.experience}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>

        <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <div className="flex items-center gap-2 font-bold">
            <FaExclamationTriangle />
            Important
          </div>
          <p className="mt-2 leading-relaxed">
            Please ensure that only trusted admins have access to these settings, especially the SBI Collect link and form open/close controls. Regularly review admin access and monitor changes to settings for security.
          </p>
        </div>
      </div>
    </div>
  );
}