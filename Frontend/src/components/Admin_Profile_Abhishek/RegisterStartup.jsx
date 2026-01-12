import React, { useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

/**
 * ✅ Nice UI: Bulk Excel import + Single Startup Registration
 * - Bulk: upload excel, preview, register row-wise, download updated excel (same as your existing flow)
 * - Single: form with all fields from excel, category mapping, date handling, amount parsing
 *
 * Tailwind required (as your table already uses Tailwind)
 */

const API_URL = "https://startupbihar.in/api/userlogin/register";

const categoryMapping = {
  "Art and handicrafts": "Art & Entertainment",
  "Food Processing": "Food",
  "Others (Shoe Laundry)": "Logistics",
  "IT/ITeS": "Technology",
  "Energy": "Environment",
  "Healthcare": "Health",
  "Finance and allied sectors": "Finance",
  "Packaging and Logistics": "Logistics",
  "E-commerce": "Retail",
  "Edu-tech": "Edu-tech",
  "Agriculture and allied sector": "Food",
  "IoT/ICT": "Smart Innovations",
  "Urban Transportation": "Logistics",
  "Others (Iron and Steels)": "Manufacturing",
  "Fashion and Apparels": "Retail",
  "Environment and Waste Management": "Environment",
  "Automobile sector": "Logistics",
  "Others (Manufacturing)": "Manufacturing",
  "Others (Household services)": "Retail",
  "Travel and Tourism": "Travel",
  "FMCG": "Retail",
  "E-Vehicle": "Smart Innovations",
  "Construction/ architecture/Proptech": "Technology",
  "Travel/Tourism & Hospitality": "Travel",
  "Others (Photography)": "Art & Entertainment",
  "Drone Technology": "Smart Innovations",
  "AR/VR": "Smart Innovations",
  "Media and Entertainment": "Art & Entertainment",
  "HR Services": "Technology",
  "AI/ML": "Smart Innovations",
  "Manufacturing/Industrial Automation": "Manufacturing",
  "Robotics Technology": "Smart Innovations",
  "Others (Relationship management)": "Technology",
  "Others (Event management)": "Art & Entertainment",
  "Others (Social Enterprise)": "Environment",
  "Others (Marketing)": "Technology",
  "Others (Grass Tea)": "Food",
  "Others (Startup services)": "Technology",
  "Others": "Technology",
  "E-commerce (Household)": "Retail",
  "Others (Saloon Services Online)": "Retail",
  "E-commerce (Spiritual)": "Retail",
  "E-commerce (Logistics)": "Logistics",
  "Others (Digital Marketing)": "Technology",
  "Others (Nano Technology)": "Smart Innovations",
  Horeca: "Retail",
};

const toInt = (v) => {
  const n = parseInt(String(v ?? "").replace(/,/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
};

const excelSerialToDDMMYYYY = (serial) => {
  // Excel epoch starts at 1900-01-00; 25569 maps to 1970-01-01
  const utcDays = Math.floor(Number(serial) - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);

  const day = String(dateInfo.getUTCDate()).padStart(2, "0");
  const month = String(dateInfo.getUTCMonth() + 1).padStart(2, "0");
  const year = dateInfo.getUTCFullYear();
  return `${day}-${month}-${year}`;
};

const normalizeCategory = (raw) => {
  const original = (raw ?? "").toString().trim();
  return categoryMapping[original] ? categoryMapping[original] : original;
};

const emptySingle = {
  user_id: "",
  password: "",
  registration_no: "",
  company_name: "",
  startup_since: "2022",
  about: "",
  founder_name: "",
  email: "",
  mobile: "",
  category: "",
  districtRoc: "",
  dateOfIncorporation: "", // dd-mm-yyyy
  address: "",
  cin: "",
  topStartup: false,
  seedFundAmount: 0,
  secondTrancheAmount: 0,
  postSeedAmount: 0,
  matchingLoanAmount: 0,
};

const Label = ({ children, hint }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">{children}</span>
    {hint ? <span className="text-xs text-gray-400">{hint}</span> : null}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className={[
      "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm",
      "outline-none ring-0 focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]",
      props.className || "",
    ].join(" ")}
  />
);

const Textarea = (props) => (
  <textarea
    {...props}
    className={[
      "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm",
      "outline-none ring-0 focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]",
      props.className || "",
    ].join(" ")}
  />
);

const Select = (props) => (
  <select
    {...props}
    className={[
      "mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm",
      "outline-none ring-0 focus:border-gray-300 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)]",
      props.className || "",
    ].join(" ")}
  />
);

const Pill = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
};

export default function RegisterStartupNiceUI() {
  const token = localStorage.getItem("token");

  const [tab, setTab] = useState("single"); // "single" | "bulk"
  const [loading, setLoading] = useState(false);

  // Bulk state
  const [data, setData] = useState([]);
  const [bulkErrors, setBulkErrors] = useState([]);

  // Single state
  const [single, setSingle] = useState(emptySingle);
  const [singleStatus, setSingleStatus] = useState(null); // {type,message}

  const categoryOptions = useMemo(() => {
    // dropdown will show "mapped values" too; but you can type custom too if needed
    const mappedVals = Array.from(new Set(Object.values(categoryMapping)));
    mappedVals.sort((a, b) => a.localeCompare(b));
    return mappedVals;
  }, []);

  const validateSingle = (s) => {
    const errs = [];
    if (!s.user_id?.trim()) errs.push("User ID is required");
    if (!s.password?.trim()) errs.push("Password is required");
    if (!s.registration_no?.trim()) errs.push("Registration No is required");
    if (!s.company_name?.trim()) errs.push("Startup Name is required");
    return errs;
  };

  const handleSingleChange = (key, value) => {
    setSingle((prev) => ({ ...prev, [key]: value }));
  };

  const registerOne = async (payload) => {
    const res = await axios.post(API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return res.data;
  };

  const handleRegisterSingle = async () => {
    setSingleStatus(null);

    const errs = validateSingle(single);
    if (errs.length) {
      setSingleStatus({ type: "error", message: errs.join(" • ") });
      return;
    }

    const payload = {
      ...single,
      category: normalizeCategory(single.category),
      mobile: String(single.mobile ?? ""),
      seedFundAmount: toInt(single.seedFundAmount),
      secondTrancheAmount: toInt(single.secondTrancheAmount),
      postSeedAmount: toInt(single.postSeedAmount),
      matchingLoanAmount: toInt(single.matchingLoanAmount),
      startup_since: single.startup_since || "2022",
      about: single.about || "",
      founder_name: single.founder_name || "",
      email: single.email || "",
      districtRoc: single.districtRoc || "",
      dateOfIncorporation: single.dateOfIncorporation || "",
      address: single.address || "",
      cin: single.cin || "",
      topStartup: !!single.topStartup,
    };

    try {
      setLoading(true);
      const data = await registerOne(payload);
      setSingleStatus({
        type: "success",
        message: `User created successfully: ${data?.user?.user_id || payload.user_id}`,
      });
      // optional reset
      // setSingle(emptySingle);
    } catch (error) {
      console.error(error);
      setSingleStatus({
        type: "error",
        message: error.response?.data?.error || "Failed to create user. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Bulk Excel Upload
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const binaryData = e.target.result;
        const workbook = XLSX.read(binaryData, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const errors = [];
        const formattedData = sheetData
          .map((row, idx) => {
            const rowNo = idx + 2; // assuming headers at row 1
            if (!row["User ID"] || !row["Password"] || !row["Registration No"] || !row["Startup Name"]) {
              errors.push(`Row ${rowNo}: Missing required fields (User ID/Password/Registration No/Startup Name)`);
              return null;
            }

            const mappedCategory = normalizeCategory(row["Category"]);

            const dateRaw = row["Date of Incorporation"];
            const dateValue =
              Number.isFinite(Number(dateRaw)) && Number.isInteger(Number(dateRaw))
                ? excelSerialToDDMMYYYY(Number(dateRaw))
                : (dateRaw ?? "");

            return {
              user_id: row["User ID"],
              password: row["Password"],
              registration_no: row["Registration No"],
              company_name: row["Startup Name"],
              startup_since: row["Startup Since"] || "2022",
              about: row["About"] || "",
              founder_name: row["Founder Name"] || "",
              email: row["Email Id"] || "",
              mobile: String(row["Mobile"] || ""),
              districtRoc: row["District ROC"] || "",
              dateOfIncorporation: dateValue || "",
              address: row["Address"] || "",
              cin: row["CIN"] || "",
              category: mappedCategory,
              topStartup: String(row["Top Startup"] || "").trim() === "Yes",
              seedFundAmount: toInt(row["First Tranche"]),
              secondTrancheAmount: toInt(row["2nd Tranche"]),
              postSeedAmount: toInt(row["Post Seed Fund"]),
              matchingLoanAmount: toInt(row["Matching Loan (In Lakhs)"]),
              status: row["Status"] || "Pending",
            };
          })
          .filter(Boolean);

        setBulkErrors(errors);
        setData(formattedData);
      } catch (err) {
        console.error(err);
        setBulkErrors(["Failed to read Excel. Please ensure file is .xlsx/.xls and headers match."]);
        setData([]);
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleRegisterUser = async (userData, index) => {
    try {
      setLoading(true);
      await registerOne(userData);

      const updated = [...data];
      updated[index].status = "Registered";
      setData(updated);
    } catch (error) {
      console.error("Error creating user:", error);
      const updated = [...data];
      updated[index].status = "Failed";
      updated[index].error = error.response?.data?.error || "Failed to create user";
      setData(updated);
      alert(updated[index].error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAllPending = async () => {
    // simple sequential approach (safe for server). If you want concurrency, we can add.
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row.status === "Registered") continue;
      if (row.status === "Failed") continue; // you can choose to retry
      // eslint-disable-next-line no-await-in-loop
      await handleRegisterUser(row, i);
    }
  };

  const downloadUpdatedExcel = () => {
    const updatedData = data.map((row) => ({
      "User ID": row.user_id,
      Password: row.password,
      "Registration No": row.registration_no,
      "Startup Name": row.company_name,
      "Startup Since": row.startup_since,
      About: row.about,
      "Founder Name": row.founder_name,
      "Email Id": row.email,
      Mobile: row.mobile,
      Category: row.category,
      "District ROC": row.districtRoc,
      "Date of Incorporation": row.dateOfIncorporation,
      Address: row.address,
      CIN: row.cin,
      "Top Startup": row.topStartup ? "Yes" : "No",
      "First Instalment Released": row.seedFundAmount,
      "2nd/Last Instalment Released": row.secondTrancheAmount,
      "Post Seed Fund": row.postSeedAmount,
      "Matching Loan (In Lakhs)": row.matchingLoanAmount,
      Status: row.status || "Pending",
      Error: row.error || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(updatedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Updated Data");
    XLSX.writeFile(workbook, "Updated_Startup_Data.xlsx");
  };

  const TabButton = ({ id, title, desc }) => {
    const active = tab === id;
    return (
      <button
        onClick={() => setTab(id)}
        className={[
          "w-full rounded-2xl border px-4 py-3 text-left transition",
          active
            ? "border-blue-200 bg-blue-50 shadow-[0_8px_30px_rgba(59,130,246,0.12)]"
            : "border-gray-200 bg-white hover:bg-gray-50",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-gray-900">{title}</div>
            <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
          </div>
          {active ? <Pill tone="blue">Active</Pill> : <Pill>Switch</Pill>}
        </div>
      </button>
    );
  };

  return (
    <div className="max-h-screen bg-gray-50 overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Startup Registration</h1>
              <p className="text-sm text-gray-500">
                Register startups via <b>Single Form</b> or <b>Bulk Excel</b> (same format).
              </p>
            </div>

            <div className="flex items-center gap-2">
              {loading ? <Pill tone="yellow">Processing...</Pill> : <Pill tone="green">Ready</Pill>}
              {!token ? <Pill tone="red">Token missing</Pill> : <Pill tone="gray">Auth OK</Pill>}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <TabButton
              id="single"
              title="Single Registration"
              desc="Fill a form with the same fields as Excel and register instantly."
            />
            <TabButton
              id="bulk"
              title="Bulk via Excel"
              desc="Upload Excel, preview rows, register one-by-one or all, then download status."
            />
          </div>
        </div>

        {/* CONTENT */}
        {tab === "single" ? (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Form */}
            <div className="lg:col-span-2 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-900">Single Startup Details</div>
                  <div className="text-sm text-gray-500">All fields match the Excel columns.</div>
                </div>
                <button
                  onClick={() => {
                    setSingle(emptySingle);
                    setSingleStatus(null);
                  }}
                  className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>

              {singleStatus ? (
                <div
                  className={[
                    "mt-4 rounded-2xl px-4 py-3 text-sm",
                    singleStatus.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-100"
                      : "bg-red-50 text-red-700 border border-red-100",
                  ].join(" ")}
                >
                  {singleStatus.message}
                </div>
              ) : null}

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label hint="Required">User ID</Label>
                  <Input
                    value={single.user_id}
                    onChange={(e) => handleSingleChange("user_id", e.target.value)}
                    placeholder="e.g. SB1001"
                  />
                </div>

                <div>
                  <Label hint="Required">Password</Label>
                  <Input
                    value={single.password}
                    onChange={(e) => handleSingleChange("password", e.target.value)}
                    placeholder="e.g. Pass@123"
                  />
                </div>

                <div>
                  <Label hint="Required">Registration No</Label>
                  <Input
                    value={single.registration_no}
                    onChange={(e) => handleSingleChange("registration_no", e.target.value)}
                    placeholder="e.g. REG-2024-001"
                  />
                </div>

                <div>
                  <Label hint="Required">Startup Name</Label>
                  <Input
                    value={single.company_name}
                    onChange={(e) => handleSingleChange("company_name", e.target.value)}
                    placeholder="e.g. ABC Innovations"
                  />
                </div>

                <div>
                  <Label>Startup Since</Label>
                  <Input
                    value={single.startup_since}
                    onChange={(e) => handleSingleChange("startup_since", e.target.value)}
                    placeholder="e.g. 2022"
                  />
                </div>

                <div>
                  <Label>Founder Name</Label>
                  <Input
                    value={single.founder_name}
                    onChange={(e) => handleSingleChange("founder_name", e.target.value)}
                    placeholder="e.g. Rahul Kumar"
                  />
                </div>

                <div>
                  <Label>Email Id</Label>
                  <Input
                    value={single.email}
                    onChange={(e) => handleSingleChange("email", e.target.value)}
                    placeholder="e.g. founder@gmail.com"
                  />
                </div>

                <div>
                  <Label>Mobile</Label>
                  <Input
                    value={single.mobile}
                    onChange={(e) => handleSingleChange("mobile", e.target.value)}
                    placeholder="e.g. 9876543210"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>About</Label>
                  <Textarea
                    rows={3}
                    value={single.about}
                    onChange={(e) => handleSingleChange("about", e.target.value)}
                    placeholder="Short description..."
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Select
                    value={single.category}
                    onChange={(e) => handleSingleChange("category", e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                  <div className="mt-1 text-xs text-gray-400">
                    (Category will be normalized using mapping if it matches.)
                  </div>
                </div>

                <div>
                  <Label>District ROC</Label>
                  <Input
                    value={single.districtRoc}
                    onChange={(e) => handleSingleChange("districtRoc", e.target.value)}
                    placeholder="e.g. Patna"
                  />
                </div>

                <div>
                  <Label>Date of Incorporation</Label>
                  <Input
                    value={single.dateOfIncorporation}
                    onChange={(e) => handleSingleChange("dateOfIncorporation", e.target.value)}
                    placeholder="dd-mm-yyyy (e.g. 15-08-2022)"
                  />
                </div>

                <div>
                  <Label>CIN</Label>
                  <Input
                    value={single.cin}
                    onChange={(e) => handleSingleChange("cin", e.target.value)}
                    placeholder="e.g. U12345BR2022PTC000001"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Textarea
                    rows={2}
                    value={single.address}
                    onChange={(e) => handleSingleChange("address", e.target.value)}
                    placeholder="Full address..."
                  />
                </div>

                {/* Amounts */}
                <div>
                  <Label>First Tranche</Label>
                  <Input
                    value={single.seedFundAmount}
                    onChange={(e) => handleSingleChange("seedFundAmount", e.target.value)}
                    placeholder="e.g. 500000"
                  />
                </div>

                <div>
                  <Label>2nd Tranche</Label>
                  <Input
                    value={single.secondTrancheAmount}
                    onChange={(e) => handleSingleChange("secondTrancheAmount", e.target.value)}
                    placeholder="e.g. 500000"
                  />
                </div>

                <div>
                  <Label>Post Seed Fund</Label>
                  <Input
                    value={single.postSeedAmount}
                    onChange={(e) => handleSingleChange("postSeedAmount", e.target.value)}
                    placeholder="e.g. 0"
                  />
                </div>

                <div>
                  <Label>Matching Loan (In Lakhs)</Label>
                  <Input
                    value={single.matchingLoanAmount}
                    onChange={(e) => handleSingleChange("matchingLoanAmount", e.target.value)}
                    placeholder="e.g. 10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={single.topStartup}
                      onChange={(e) => handleSingleChange("topStartup", e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Top Startup
                  </label>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  onClick={handleRegisterSingle}
                  disabled={loading || !token}
                  className={[
                    "rounded-2xl px-5 py-2.5 text-sm font-semibold text-white",
                    loading || !token ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700",
                  ].join(" ")}
                >
                  {loading ? "Registering..." : "Register Startup"}
                </button>
              </div>
            </div>

           
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">Bulk Registration (Excel)</div>
                <div className="text-sm text-gray-500">
                  Upload Excel, preview data, register row-wise or all pending.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleRegisterAllPending}
                  disabled={loading || !data.length || !token}
                  className={[
                    "rounded-2xl px-4 py-2 text-sm font-semibold text-white",
                    loading || !data.length || !token ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700",
                  ].join(" ")}
                >
                  Register All Pending
                </button>

                <button
                  onClick={downloadUpdatedExcel}
                  disabled={!data.length}
                  className={[
                    "rounded-2xl px-4 py-2 text-sm font-semibold text-white",
                    !data.length ? "bg-gray-300" : "bg-green-600 hover:bg-green-700",
                  ].join(" ")}
                >
                  Download Updated Excel
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <Label>Upload Excel (.xlsx/.xls)</Label>
                <Input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
                <div className="mt-2 text-xs text-gray-500">
                  Tip: Make sure headers match exactly: <b>User ID</b>, <b>Password</b>, <b>Registration No</b>, <b>Startup Name</b>, etc.
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-4 bg-gray-50">
                <div className="text-sm font-semibold text-gray-900">Summary</div>
                <div className="mt-2 space-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between">
                    <span>Total Rows</span>
                    <Pill tone="blue">{data.length}</Pill>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Invalid Rows</span>
                    <Pill tone={bulkErrors.length ? "red" : "green"}>{bulkErrors.length}</Pill>
                  </div>
                </div>
              </div>
            </div>

            {bulkErrors.length ? (
              <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                <div className="font-semibold mb-2">Excel Issues</div>
                <ul className="list-disc pl-5 space-y-1">
                  {bulkErrors.slice(0, 10).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
                {bulkErrors.length > 10 ? (
                  <div className="mt-2 text-xs text-red-600">Showing first 10 errors only.</div>
                ) : null}
              </div>
            ) : null}

            {data.length > 0 ? (
              <div className="mt-5 overflow-x-auto rounded-2xl border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                      <th className="px-4 py-3 border-b">User ID</th>
                      <th className="px-4 py-3 border-b">Registration No</th>
                      <th className="px-4 py-3 border-b">Startup Name</th>
                      <th className="px-4 py-3 border-b">Category</th>
                      <th className="px-4 py-3 border-b">Top</th>
                      <th className="px-4 py-3 border-b">Seed</th>
                      <th className="px-4 py-3 border-b">2nd Tranche</th>
                      <th className="px-4 py-3 border-b">Post Seed</th>
                      <th className="px-4 py-3 border-b">Matching Loan</th>
                      <th className="px-4 py-3 border-b">Status</th>
                      <th className="px-4 py-3 border-b">Action</th>
                    </tr>
                  </thead>

                  <tbody className="text-sm">
                    {data.map((row, index) => {
                      const tone =
                        row.status === "Registered"
                          ? "green"
                          : row.status === "Failed"
                          ? "red"
                          : "yellow";
                      return (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="px-4 py-3">{row.user_id}</td>
                          <td className="px-4 py-3">{row.registration_no}</td>
                          <td className="px-4 py-3">{row.company_name}</td>
                          <td className="px-4 py-3">{row.category}</td>
                          <td className="px-4 py-3">{row.topStartup ? "Yes" : "No"}</td>
                          <td className="px-4 py-3">{row.seedFundAmount}</td>
                          <td className="px-4 py-3">{row.secondTrancheAmount}</td>
                          <td className="px-4 py-3">{row.postSeedAmount}</td>
                          <td className="px-4 py-3">{row.matchingLoanAmount}</td>
                          <td className="px-4 py-3">
                            <Pill tone={tone}>{row.status || "Pending"}</Pill>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className={[
                                "rounded-xl px-3 py-1.5 text-sm font-semibold text-white",
                                row.status === "Registered" || loading
                                  ? "bg-gray-300"
                                  : "bg-blue-600 hover:bg-blue-700",
                              ].join(" ")}
                              onClick={() => handleRegisterUser(row, index)}
                              disabled={row.status === "Registered" || loading}
                            >
                              {loading ? "..." : "Register"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
                Upload an Excel file to preview startups here.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
