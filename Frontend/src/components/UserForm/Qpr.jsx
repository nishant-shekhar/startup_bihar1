import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Upload from "./Upload";
import StatusDialog from "./StatusDialog";

/* ========================= Helpers & Constants ========================= */

const MAX_TOTAL_BYTES = 20 * 1024 * 1024; // 20 MB

const isOptionSelected = (option, valueStr) => {
  const arr = (valueStr || "").split(";").filter(Boolean);
  return arr.includes(option);
};
const addOptionToString = (option, valueStr) => {
  const arr = (valueStr || "").split(";").filter(Boolean);
  if (!arr.includes(option)) arr.push(option);
  return arr.join(";");
};
const removeOptionFromString = (option, valueStr) => {
  const arr = (valueStr || "").split(";").filter(Boolean);
  return arr.filter((x) => x !== option).join(";");
};

const FieldError = ({ error }) =>
  error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null;

const SectionCard = ({ title, children }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
    <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    {children}
  </div>
);

const Label = ({ htmlFor, children, required }) => (
  <label htmlFor={htmlFor} className="block font-medium text-gray-800">
    {children}
    {required && <span className="text-red-600">*</span>}
  </label>
);

/* ========================= Options ========================= */

const fundsOptions = [
  "1st tranche seed fund",
  "2nd tranche seed fund",
  "Post-seed fund",
  "Matching fund",
  "IPR support",
  "Acceleration support",
  "Additional incentive women",
  "Additional incentive SC/ST/Physically challenged",
];

const iprOptions = ["Trademark", "Copyright", "Patent", "Trade secret", "Industrial Design"];

/* ========================= Validation (Yup) ========================= */

const numberRequired = (label) =>
  Yup.number()
    .typeError(`${label} must be a number`)
    .min(0, `${label} cannot be negative`)
    .required(`${label} is required`);

const validationSchema = Yup.object({
  totalCoFounders: numberRequired("Total no. of Co-founders"),
  stage: Yup.string().required("Stage is required"),
  sector: Yup.string().required("Sector is required"),
  registeredDistrict: Yup.string().required("Registered office district is required"),
  registeredBlock: Yup.string().nullable(),
  aboutStartup: Yup.string().required("About your Startup is required"),
  fundsTaken: Yup.string()
    .test(
      "at-least-one",
      "Select at least one option",
      (val) => !!val && val.split(";").filter(Boolean).length > 0
    )
    .required("Select at least one option"),
  currentRevenue: Yup.string().required("Current Revenue/Turnover details is required"),
  netProfitOrLoss: Yup.string().required("Net Profit or Loss is required"),
  fundsRaised: Yup.string().required("This field is required"),
  fundsDetails: Yup.string().when("fundsRaised", {
    is: (val) => val === "Yes",
    then: (schema) => schema.required("Please share details of funds raised"),
    otherwise: (schema) => schema,
  }),
  fundAmount: numberRequired("Amount of Fund"),
  fullTimeMale: numberRequired("No. of Full-time Male employees"),
  fullTimeFemale: numberRequired("No. of Full-time Female employees"),
  partTimeMale: numberRequired("No. of Part-time Male employees"),
  partTimeFemale: numberRequired("No. of Part-time Female employees"),
  workOrders: numberRequired("No. of Work orders received"),
  totalWorkOrderAmount: numberRequired("Total Amount of Work Orders received"),
  customersAcquired: numberRequired("No. of Customers acquired"),
  incubationBenefits: Yup.string().required("This field is required"),
  benefitsDetails: Yup.string().when("incubationBenefits", {
    is: (val) => val === "Yes",
    then: (schema) => schema.required("Please mention the benefits"),
    otherwise: (schema) => schema,
  }),
  unitPhotos: Yup.object({
    photo1: Yup.mixed().required("Photo 1 is required"),
    photo2: Yup.mixed().required("Photo 2 is required"),
  }).required("Both geo-tagged photos are required"),
  pitchdeck: Yup.mixed().required("Pitchdeck is required"),
  auditedReport: Yup.mixed().required("Audited financial statement report is required"),
  // Virtual field for total-size check—error will render in "Uploads & Evidence" section
  filesTotal: Yup.mixed().test("total-size", "Total selected files exceed 20 MB", function () {
    const { unitPhotos, pitchdeck, auditedReport } = this.parent || {};
    const files = [
      unitPhotos?.photo1,
      unitPhotos?.photo2,
      pitchdeck,
      auditedReport,
    ].filter(Boolean);
    const total = files.reduce((sum, f) => sum + (f?.size || 0), 0);
    return total <= MAX_TOTAL_BYTES;
  }),
});

/* ========================= District Map ========================= */

const districtBlockMap = {
  "Araria": ["Araria", "Bhargama", "Forbesganj", "Jokihat", "Kursakanta", "Narpatganj", "Palasi", "Raniganj", "Sikti"],
  "Arwal": ["Arwal", "Sonbhadra Banshi Surypur", "Kaler", "Karpi", "Kurtha"],
  "Aurangabad": ["Aurangabad", "Barun", "Daudnagar", "Deo", "Goh", "Haspura", "Kutumba", "Madanpur", "Nabinagar", "Obra", "Rafiganj"],
  "Banka": ["Amarpur", "Banka", "Barahat", "Belhar", "Bounsi", "Chandan", "Dhoraiya", "Fullidumar", "Katoriya", "Rajoun", "Shambhuganj"],
  "Begusarai": ["Bachwara", "Bakhri", "Balia", "Barauni", "Begusarai", "Bhagawanpur", "Birpur", "Cheria Bariyarpur", "Chhourahi", "Dandari", "Garhpura", "Khodabandpur", "Mansurchak", "Matihani", "Navkothi", "Sahebpur Kamal", "Samho-Akaha-Kurha", "Teghra"],
  "Bhabhua": ["Adhaura", "Bhabhua", "Bhagwanpur", "Chainpur", "Chand", "Durgawati", "Kudra", "Mohania", "Nuawon", "Ramgarh", "Rampur"],
  "Bhagalpur": ["Bihpur", "Gauradih", "Gopalpur", "Ishmailpur", "Jagdishpur", "Kahalgaon", "Kharik", "Narayanpur", "Nathnagar", "Navgachhia", "Pirpainty", "Rangra Chowk", "Sabour", "Shahkund", "Sanhoula", "Sultanganj"],
  "Bhojpur": ["Agioan", "Ara Sadar", "Barhara", "Bihiya", "Charpokhri", "Garhani", "Jagdishpur", "Koilwar", "Piro", "Sahar", "Sandesh", "Shahpur", "Tarari", "Udwantnagar"],
  "Buxar": ["Brahmpur", "Buxar", "Chakki", "Chausha", "Chaugain", "Dumraon", "Itarhi", "Kesath", "Nawanagar", "Rajpur", "Simari"],
  "Darbhanga": ["Alinagar", "Bahadurpur", "Baheri", "Benipur", "Biraul", "Darbhanga", "Gaura Bauram", "Ghanshyampur", "Hanuman Nagar", "Hayaghat", "Jale", "Keoti", "Kiratpur", "Kusheswar Asthan", "Kusheswar Asthan East", "Manigachhi", "Singhwara", "Tardih"],
  "East Champaran": ["Adapur", "Areraj", "Banjariya", "Chakia", "Chhauradano", "Chiraiya", "Dhaka", "Ghorasahan", "Harsiddhi", "Kalyanpur", "Kesaria", "Kotwa", "Madhuban", "Mehsi", "Motihari", "Paharpur", "Pakaridayal", "Patahi", "Phenhara", "Piprakothi", "Ramgarhwa", "Raxaul", "Sangrampur", "Sugauli", "Tetaria", "Turkauliya", "Bankatwa"],
  "Gaya": ["Amas", "Atri", "Banke Bazar", "Barachatty", "Belaganj", "Bodh Gaya", "Dobhi", "Dumariya", "Fatehpur", "Gaya Sadar", "Guraru", "Gurua", "Imamganj", "Khizar Sarai", "Konch", "Manpur", "Mohanpur", "Mohra", "Paraiya", "Sherghatty", "Tankuppa", "Tekari", "Wazirganj"],
  "Gopalganj": ["Bhore", "Gopalganj", "Manjha", "Uchkagaon", "Kuchaikot", "Kateya", "Vijaipur", "Barauli", "Hathua", "Baikunthpur", "Phulwaria", "Thawe", "Panchdevari", "Sidhwalia"],
  "Jamui": ["Barhat", "Chakai", "Gidhaur", "Isalmanagar Aliganj", "Jamui", "Jhajha", "Khaira", "Laxmipur", "Sikandra", "Sono"],
  "Jehanabad": ["Jehanabad", "Ghoshi", "Hulasgunj", "Kako", "Makhdumpur", "Modanganj", "Ratni Faridpur"],
  "Katihar": ["Amdabad", "Azamnagar", "Balrampur", "Barari", "Barsoi", "Dandkhora", "Falka", "Hasanganj", "Kadwa", "Katihar", "Korha", "Kursela", "Manihari", "Mansahi", "Pranpur", "Sameli"],
  "Khagaria": ["Allouli Beldaur", "Beldaur", "Chautham", "Gogari", "Khagaria", "Mansi", "Parbatta"],
  "Kishanganj": ["Bahadurganj", "Dighalbank", "Kishanganj", "Kochadhaman", "Pothia", "Terhagachh", "Thakurganj"],
  "Lakhisarai": ["Barahia", "Channan", "Halsi", "Lakhisarai", "Piparia", "Ramgarh Chowk", "Suryagarha"],
  "Madhepura": ["Alamnagar", "Bihariganj", "Chausa", "Ghailadh", "Gamharia", "Gualpara", "Kumarkhand", "Madhepura", "Murliganj", "Puraini", "Shankarpur", "Singheshwarsthan", "Uda Kishanganj"],
  "Madhubani": ["Khutauna", "Phulparas", "Laukahi", "Ghoghardiha", "Rahika", "Pandaul", "Rajnagar", "Khajauli", "Kaluahi", "Babubarhi", "Madhwapur", "Harlakhi", "Bisfi", "Benipatti", "Lakhnaur", "Madhepur", "Jhanjharpur", "Andharathari", "Basopatti", "Ladania", "Jainagar"],
  "Munger": ["Munger Sadar", "Dharahara", "Bariyarpur", "Jamalpur", "Tetia Bamber", "Haveli Kharagpur", "Tarapur", "Asarganj", "Sangrampur"],
  "Muzaffarpur": ["Sahebganj", "Motipur", "Paroo", "Saraiya", "Kurhani", "Kanti", "Marwan", "Minapur", "Musahari", "Bochahan", "Aurai", "Katara", "Gaighat", "Muraul", "Sakra", "Bandra"],
  "Nalanda": ["Ekangarsarai", "Biharsarif", "Asthawan", "Noorsarai", "Sarmera", "Rahui", "Harnaut", "Hilsa", "Islampur", "Ben", "Bind", "Parwalpur", "Katrisarai", "Karai Parsurai", "Nagarnarusa", "Chandi", "Tharthari", "Giriyak", "Rajgir", "Silao"],
  "Nawada": ["Rajauli", "Akbarpur", "Sirdala", "Kowakole", "Pakaribarawan", "Warsaliganj", "Kashichak", "Nawada", "Nardiganj", "Roh", "Meskaur", "Govindpur", "Narhat", "Hisua"],
  "Patna": ["Athmalgola", "Bakhtiarpur", "Barh", "Belchhi", "Bihta", "Bikram", "Danapur", "Daniyawan", "Dhanarua", "Dulhin Bazar", "Fatuha", "Ghoswari", "Khusrupur", "Maner", "Masaudhi", "Mokama", "Naubatpur", "Paliganj", "Pandarak", "Patna Sadar", "Phulwari Sharif", "Punpun", "Sampatchak"],
  "Purnea": ["Amour", "Baisa", "Baisi", "Banmankhi", "Barhara Kothi", "Bhawanipur", "Dagarua", "Dhamdaha", "Jalalgarh", "Krityanandnagar", "Kasba", "Purnia", "Rupouli", "Srinagar"],
  "Rohtas": ["Akorhigola", "Bikramganj", "Chenari", "Dawath", "Dehri", "Dinara", "Karakata", "Kargahar", "Kochas", "Nasriganj", "Nauhatta", "Nokha", "Rajpur", "Rohtas", "Sanjhauli", "Sasaram", "Sheosagar", "Surajpura", "Tilouthu"],
  "Saharsa": ["Kahra", "Sattar Katiya", "Saur Bazar", "Patarghat", "Mahishi", "Sonbarsa", "Nauhatta", "Salkhua", "Banma Itahri", "Simri Bakhtiyarpur"],
  "Samastipur": ["Kalyanpur", "Warisnagar", "Khanpur", "Samastipur", "Pusa", "Tajpur", "Morwa", "Sarairanjan", "Patori", "Mohanpur", "Mohiuddinnagar", "Vidyapatinagar", "Dalsingsarai", "Ujiyarpur", "Bibhutipur", "Rosera", "Shivajinagar", "Singhia", "Hasanpur", "Bithan"],
  "Saran": ["Baniyapur", "Lahladpur", "Jalalpur", "Nagra", "Ekma", "Manjhi", "Rivilganj", "Chapra", "Maker", "Garkha", "Marhourah", "Amnour", "Mashrakh", "Panapur", "Taraiyan", "Ishupur", "Parsa", "Dariyapur", "Dighwara", "Sonepur"],
  "Sheikhpura": ["Sheikhpura", "Barbigha", "Shekhopur Sarai", "Ariari", "Chewara", "Ghat Kusumba"],
  "Sheohar": ["Sheohar", "Dumari", "Piprahi", "Purnahiya", "Tariyani"],
  "Sitamarhi": ["Belsand", "Parsauni", "Runnisaidpur", "Dumra", "Riga", "Bairgania", "Majorganj", "Suppi", "Bathnaha", "Sonbarsa", "Parihar", "Sursand", "Bajpatti", "Pupri", "Choraut", "Nanpur", "Bokhra"],
  "Siwan": ["Jiradei", "Andar", "Siswan", "Guthani", "Pachrukhi", "Darauli", "Goreakothi", "Bhagwanpur", "Hussainganj", "Mairwa", "Duraudha", "Siwan", "Barharia", "Raghunathpur", "Basantpur", "Maharajganj", "Lakri Nabiganj", "Hasanpura", "Nautan"],
  "Supaul": ["Nirmali", "Marauna", "Supaul", "Kishanpur", "Saraigarh", "Pipra", "Basantpur", "Raghopur", "Pratapganj", "Triveniganj", "Chhatapur"],
  "Vaishali": ["Hajipur", "Raghopur", "Bidupur", "Lalganj", "Vaishali", "Bhagwanpur", "Patedhi Belsar", "Mahnar", "Sahdei", "Mahua", "Chehrakala", "Jandaha", "Garaul", "Patepur", "Rajapakar", "Desri"],
  "West Champaran": ["Bettiah", "Narkatiaganj", "Ramnagar", "Bagaha", "Lauriya", "Chanpatia", "Gaunaha", "Mainatand", "Sikta", "Jogapatti", "Bairiya"],
};

/* ========================= Component ========================= */

const QprForm = ({ onFormSubmitSuccess }) => {
  const [iprReceivedStr, setIprReceivedStr] = useState(""); // optional field (not required by Yup)

  const [statusPopup, setStatusPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonVisible, setButtonVisible] = useState(true);
  const [subtitle, setSubtitle] = useState("");
  const [isSuccess, setIsSuccess] = useState("");

  const inputClass = (name, formik) =>
    `w-full border rounded-md p-2 mt-1 ${
      formik.submitCount > 0 && formik.errors[name]
        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
    }`;

  const formik = useFormik({
    initialValues: {
      totalCoFounders: "",
      stage: "",
      sector: "",
      registeredDistrict: "",
      registeredBlock: "",
      aboutStartup: "",
      fundsTaken: "", // semicolon string (validated by Yup)
      currentRevenue: "",
      netProfitOrLoss: "",
      fundsRaised: "",
      fundsDetails: "",
      fundAmount: "",
      fullTimeMale: "",
      fullTimeFemale: "",
      partTimeMale: "",
      partTimeFemale: "",
      workOrders: "",
      totalWorkOrderAmount: "",
      customersAcquired: "",
      unitPhotos: { photo1: null, photo2: null },
      pitchdeck: null,
      auditedReport: null,
      incubationBenefits: "",
      benefitsDetails: "",
      otherAchievements: "",
      filesTotal: 0, // virtual field for total-size test (computed in Yup test)
    },
    validationSchema,
    validateOnChange: false,  // show errors only on submit
    validateOnBlur: false,    // show errors only on submit
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setTitle("Submitting Startup Progress Form");
      setSubtitle("Please wait while we submit your form");
      setButtonVisible(false);
      setStatusPopup(true);

      try {
        const formData = new FormData();
        formData.append("totalCoFounders", values.totalCoFounders);
        formData.append("stage", values.stage);
        formData.append("sector", values.sector);
        formData.append("registeredDistrict", values.registeredDistrict);
        formData.append("registeredBlock", values.registeredBlock || "");
        formData.append("aboutStartup", values.aboutStartup);
        formData.append("fundsTaken", values.fundsTaken); // from Yup-validated string
        formData.append("currentRevenue", values.currentRevenue);
        formData.append("netProfitOrLoss", values.netProfitOrLoss);
        formData.append("fundsRaised", values.fundsRaised);
        formData.append("fundsDetails", values.fundsDetails || "");
        formData.append("fundAmount", values.fundAmount);
        formData.append("iprReceived", iprReceivedStr); // optional
        formData.append("fullTimeMale", values.fullTimeMale);
        formData.append("fullTimeFemale", values.fullTimeFemale);
        formData.append("partTimeMale", values.partTimeMale);
        formData.append("partTimeFemale", values.partTimeFemale);
        formData.append("workOrders", values.workOrders);
        formData.append("totalWorkOrderAmount", values.totalWorkOrderAmount);
        formData.append("customersAcquired", values.customersAcquired);
        formData.append("incubationBenefits", values.incubationBenefits);
        formData.append("benefitsDetails", values.benefitsDetails || "");
        formData.append("otherAchievements", values.otherAchievements || "");

        if (values.unitPhotos.photo1) formData.append("unitPhoto1", values.unitPhotos.photo1);
        if (values.unitPhotos.photo2) formData.append("unitPhoto2", values.unitPhotos.photo2);
        if (values.pitchdeck) formData.append("pitchdeck", values.pitchdeck);
        if (values.auditedReport) formData.append("auditedReport", values.auditedReport);

        const response = await axios.post("https://startupbihar.in/api/Qreport", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        setTitle("Submission Successful");
        setSubtitle(response?.data?.message || "Data submitted successfully");
        setButtonVisible(true);
        setIsSuccess("success");

        resetForm();
        setIprReceivedStr("");
      } catch (error) {
        // Friendly mapping for common server failures
        let msg = "An error occurred during submission";
        if (error?.response) {
          const status = error.response.status;
          if (status === 413) {
            msg = "Upload too large. Combined files exceed the server's 20 MB limit. Please compress and retry.";
          } else if (status === 401 || status === 403) {
            msg = "Your session seems to have expired. Please log in again and resubmit.";
          } else {
            msg =
              error.response.data?.error ||
              error.response.data?.message ||
              `Request failed with status ${status}`;
          }
        } else if (error?.request) {
          msg = "Network error. Please check your connection and try again.";
        } else if (error?.message) {
          msg = error.message;
        }

        setTitle("Submission Failed");
        setSubtitle(msg);
        setButtonVisible(true);
        setIsSuccess("failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    formik.setFieldValue("registeredDistrict", district);
    formik.setFieldValue("registeredBlock", "");
  };

  const goBacktoHome = () => {
    setStatusPopup(false);
    if (isSuccess === "success") onFormSubmitSuccess?.();
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      {/* Hero */}
      <div className="relative w-full h-[210px] bg-[#0e2a47] text-white">
        <div className="relative h-full flex flex-col justify-center px-6">
          <h1 className="text-2xl md:text-3xl font-bold">Startup Progress Report</h1>
          <p className="text-base md:text-lg opacity-90">Share your startup progress metrics</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 mt-8 pb-16">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Company & Stage */}
          <SectionCard title="Company & Stage">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="totalCoFounders" required>
                  Total no. of Co-founders
                </Label>
                <input
                  id="totalCoFounders"
                  name="totalCoFounders"
                  type="number"
                  min="0"
                  value={formik.values.totalCoFounders}
                  onChange={formik.handleChange}
                  className={inputClass("totalCoFounders", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.totalCoFounders : undefined} />
              </div>

              <div>
                <Label htmlFor="stage" required>
                  Stage
                </Label>
                <select
                  id="stage"
                  name="stage"
                  value={formik.values.stage}
                  onChange={formik.handleChange}
                  className={inputClass("stage", formik)}
                >
                  <option value="">Select Stage</option>
                  <option value="Ideation">Ideation</option>
                  <option value="Prototype">Prototype</option>
                  <option value="MVP">MVP</option>
                  <option value="Scaling">Scaling</option>
                </select>
                <FieldError error={formik.submitCount > 0 ? formik.errors.stage : undefined} />
              </div>

              <div>
                <Label htmlFor="sector" required>
                  Sector
                </Label>
                <select
                  id="sector"
                  name="sector"
                  value={formik.values.sector}
                  onChange={formik.handleChange}
                  className={inputClass("sector", formik)}
                >
                  <option value="">Select Sector</option>
                  <option value="Agri-Tech and Allied Sector">Agri-Tech and Allied Sector</option>
                  <option value="AI-ML-Deeptech">AI/ML/Deeptech</option>
                  <option value="IT-ITeS-ESDM">IT/ITeS/ESDM</option>
                  <option value="Health-tech">Health-tech</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="IoT & Robotics & Drone">IoT & Robotics & Drone</option>
                  <option value="Green Energy-Environment">Green Energy/Environment</option>
                  <option value="Edu-Tech">Edu-Tech</option>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Fashion&Apparels">Fashion & Apparels</option>
                  <option value="Manufacturing-Industrial Automation">Manufacturing/Industrial Automation</option>
                  <option value="E-Vehicle">E-Vehicle</option>
                  <option value="Construction/architecture/Proptech">Construction/Architecture/Proptech</option>
                  <option value="Media and Entertainment">Media and Entertainment</option>
                  <option value="Handicrafts">Handicrafts</option>
                  <option value="Others">Others</option>
                </select>
                <FieldError error={formik.submitCount > 0 ? formik.errors.sector : undefined} />
              </div>

              <div>
                <Label htmlFor="aboutStartup" required>
                  About your Startup (in one line)
                </Label>
                <input
                  id="aboutStartup"
                  name="aboutStartup"
                  value={formik.values.aboutStartup}
                  onChange={formik.handleChange}
                  className={inputClass("aboutStartup", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.aboutStartup : undefined} />
              </div>
            </div>
          </SectionCard>

          {/* Registered Office */}
          <SectionCard title="Registered Office">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="registeredDistrict" required>
                  Registered office district
                </Label>
                <select
                  id="registeredDistrict"
                  name="registeredDistrict"
                  value={formik.values.registeredDistrict}
                  onChange={handleDistrictChange}
                  className={inputClass("registeredDistrict", formik)}
                >
                  <option value="">Select District</option>
                  {Object.keys(districtBlockMap).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <FieldError error={formik.submitCount > 0 ? formik.errors.registeredDistrict : undefined} />
              </div>

              <div>
                <Label htmlFor="registeredBlock">Registered office Block</Label>
                <select
                  id="registeredBlock"
                  name="registeredBlock"
                  value={formik.values.registeredBlock}
                  onChange={formik.handleChange}
                  className={inputClass("registeredBlock", formik)}
                  disabled={!formik.values.registeredDistrict}
                >
                  <option value="">Select Block</option>
                  {formik.values.registeredDistrict &&
                    districtBlockMap[formik.values.registeredDistrict].map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                </select>
                <FieldError error={formik.submitCount > 0 ? formik.errors.registeredBlock : undefined} />
              </div>
            </div>
          </SectionCard>

          {/* Funding & Financials */}
          <SectionCard title="Funding & Financials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label required>Funds taken from Startup Bihar</Label>
                <div id="fundsTaken" className="flex flex-wrap gap-3 mt-1">
                  {fundsOptions.map((option) => (
                    <label key={option} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        checked={isOptionSelected(option, formik.values.fundsTaken)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            formik.setFieldValue("fundsTaken", addOptionToString(option, formik.values.fundsTaken));
                          } else {
                            formik.setFieldValue("fundsTaken", removeOptionFromString(option, formik.values.fundsTaken));
                          }
                        }}
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
                <FieldError error={formik.submitCount > 0 ? formik.errors.fundsTaken : undefined} />
              </div>

              <div>
                <Label htmlFor="currentRevenue" required>
                  Current Revenue/Turnover details (in ₹ Lakhs)
                </Label>
                <input
                  id="currentRevenue"
                  name="currentRevenue"
                  value={formik.values.currentRevenue}
                  onChange={formik.handleChange}
                  className={inputClass("currentRevenue", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.currentRevenue : undefined} />
              </div>

              <div>
                <Label htmlFor="netProfitOrLoss" required>
                  Net Profit or Loss (in ₹ Lakhs)
                </Label>
                <input
                  id="netProfitOrLoss"
                  name="netProfitOrLoss"
                  value={formik.values.netProfitOrLoss}
                  onChange={formik.handleChange}
                  className={inputClass("netProfitOrLoss", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.netProfitOrLoss : undefined} />
              </div>

              <div>
                <Label htmlFor="fundsRaised" required>
                  Any Funds raised or Grants received
                </Label>
                <select
                  id="fundsRaised"
                  name="fundsRaised"
                  value={formik.values.fundsRaised}
                  onChange={formik.handleChange}
                  className={inputClass("fundsRaised", formik)}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <FieldError error={formik.submitCount > 0 ? formik.errors.fundsRaised : undefined} />
              </div>

              {formik.values.fundsRaised === "Yes" && (
                <div className="md:col-span-2">
                  <Label htmlFor="fundsDetails" required>
                    If yes, share details (Name of organization)
                  </Label>
                  <select
                    id="fundsDetails"
                    name="fundsDetails"
                    value={formik.values.fundsDetails}
                    onChange={formik.handleChange}
                    className={inputClass("fundsDetails", formik)}
                  >
                    <option value="">Select</option>
                    <option value="HNI">HNI</option>
                    <option value="Angel group">Angel group</option>
                    <option value="AIF CAT-1">AIF CAT-1</option>
                    <option value="AIF CAT-2">AIF CAT-2</option>
                    <option value="Startup India">Startup India</option>
                  </select>
                  <FieldError error={formik.submitCount > 0 ? formik.errors.fundsDetails : undefined} />
                </div>
              )}

              <div>
                <Label htmlFor="fundAmount" required>
                  Amount of Fund
                </Label>
                <input
                  id="fundAmount"
                  name="fundAmount"
                  type="number"
                  min="0"
                  value={formik.values.fundAmount}
                  onChange={formik.handleChange}
                  className={inputClass("fundAmount", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.fundAmount : undefined} />
              </div>
            </div>
          </SectionCard>

          {/* IPR & Team */}
          <SectionCard title="IPR & Team">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label>Any IPR Received (optional)</Label>
                <div id="iprReceived" className="flex flex-wrap gap-3 mt-1">
                  {iprOptions.map((option) => (
                    <label key={option} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        value={option}
                        checked={isOptionSelected(option, iprReceivedStr)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setIprReceivedStr((prev) => addOptionToString(option, prev));
                          } else {
                            setIprReceivedStr((prev) => removeOptionFromString(option, prev));
                          }
                        }}
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="fullTimeMale" required>
                  No. of Full-time Male employees
                </Label>
                <input
                  id="fullTimeMale"
                  name="fullTimeMale"
                  type="number"
                  min="0"
                  value={formik.values.fullTimeMale}
                  onChange={formik.handleChange}
                  className={inputClass("fullTimeMale", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.fullTimeMale : undefined} />
              </div>

              <div>
                <Label htmlFor="fullTimeFemale" required>
                  No. of Full-time Female employees
                </Label>
                <input
                  id="fullTimeFemale"
                  name="fullTimeFemale"
                  type="number"
                  min="0"
                  value={formik.values.fullTimeFemale}
                  onChange={formik.handleChange}
                  className={inputClass("fullTimeFemale", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.fullTimeFemale : undefined} />
              </div>

              <div>
                <Label htmlFor="partTimeMale" required>
                  No. of Part-time Male employees
                </Label>
                <input
                  id="partTimeMale"
                  name="partTimeMale"
                  type="number"
                  min="0"
                  value={formik.values.partTimeMale}
                  onChange={formik.handleChange}
                  className={inputClass("partTimeMale", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.partTimeMale : undefined} />
              </div>

              <div>
                <Label htmlFor="partTimeFemale" required>
                  No. of Part-time Female employees
                </Label>
                <input
                  id="partTimeFemale"
                  name="partTimeFemale"
                  type="number"
                  min="0"
                  value={formik.values.partTimeFemale}
                  onChange={formik.handleChange}
                  className={inputClass("partTimeFemale", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.partTimeFemale : undefined} />
              </div>
            </div>
          </SectionCard>

          {/* Orders & Users */}
          <SectionCard title="Orders & Users">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="workOrders" required>
                  No. of Work orders received
                </Label>
                <input
                  id="workOrders"
                  name="workOrders"
                  type="number"
                  min="0"
                  value={formik.values.workOrders}
                  onChange={formik.handleChange}
                  className={inputClass("workOrders", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.workOrders : undefined} />
              </div>
              <div>
                <Label htmlFor="totalWorkOrderAmount" required>
                  Total Amount of Work Orders received
                </Label>
                <input
                  id="totalWorkOrderAmount"
                  name="totalWorkOrderAmount"
                  type="number"
                  min="0"
                  value={formik.values.totalWorkOrderAmount}
                  onChange={formik.handleChange}
                  className={inputClass("totalWorkOrderAmount", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.totalWorkOrderAmount : undefined} />
              </div>
              <div>
                <Label htmlFor="customersAcquired" required>
                  No. of Customers acquired / Current Active users
                </Label>
                <input
                  id="customersAcquired"
                  name="customersAcquired"
                  type="number"
                  min="0"
                  value={formik.values.customersAcquired}
                  onChange={formik.handleChange}
                  className={inputClass("customersAcquired", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.customersAcquired : undefined} />
              </div>
            </div>
          </SectionCard>

          {/* Uploads */}
          <SectionCard title="Uploads & Evidence">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div id="unitPhotos" className="md:col-span-2">
                <Label required>Upload 2 Geo-tagged photos of your unit/office</Label>
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="flex-1">
                    <Upload
                      label="Photo 1"
                      name="unitPhoto1"
                      onChange={(file) =>
                        formik.setFieldValue("unitPhotos", {
                          ...formik.values.unitPhotos,
                          photo1: file,
                        })
                      }
                      allowImages={true}
                    />
                  </div>
                  <div className="flex-1">
                    <Upload
                      label="Photo 2"
                      name="unitPhoto2"
                      onChange={(file) =>
                        formik.setFieldValue("unitPhotos", {
                          ...formik.values.unitPhotos,
                          photo2: file,
                        })
                      }
                      allowImages={true}
                    />
                  </div>
                </div>
                <FieldError
                  error={
                    formik.submitCount > 0
                      ? formik.errors.unitPhotos?.photo1 ||
                        formik.errors.unitPhotos?.photo2 ||
                        formik.errors.unitPhotos
                      : undefined
                  }
                />
              </div>

              <div>
                <Label htmlFor="pitchdeck" required>
                  Upload updated pitchdeck (PDF)
                </Label>
                <Upload
                  label="Pitchdeck (PDF)"
                  name="pitchdeck"
                  onChange={(file) => formik.setFieldValue("pitchdeck", file)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.pitchdeck : undefined} />
              </div>

              <div>
                <Label htmlFor="auditedReport" required>
                  Upload last year audited financial statement report
                </Label>
                <Upload
                  label="Audited Financials (PDF)"
                  name="auditedReport"
                  onChange={(file) => formik.setFieldValue("auditedReport", file)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.auditedReport : undefined} />
              </div>

              {/* Total-size error (Yup virtual field) */}
              <div className="md:col-span-2">
                <FieldError error={formik.submitCount > 0 ? formik.errors.filesTotal : undefined} />
              </div>
            </div>
          </SectionCard>

          {/* Incubation & Achievements */}
          <SectionCard title="Incubation & Other Achievements">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="incubationBenefits" required>
                  Any benefits available from the incubation center/appointed mentors
                </Label>
                <select
                  id="incubationBenefits"
                  name="incubationBenefits"
                  value={formik.values.incubationBenefits}
                  onChange={formik.handleChange}
                  className={inputClass("incubationBenefits", formik)}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <FieldError error={formik.submitCount > 0 ? formik.errors.incubationBenefits : undefined} />
              </div>

              {formik.values.incubationBenefits === "Yes" && (
                <div>
                  <Label htmlFor="benefitsDetails" required>
                    If yes, please mention
                  </Label>
                  <input
                    id="benefitsDetails"
                    name="benefitsDetails"
                    value={formik.values.benefitsDetails}
                    onChange={formik.handleChange}
                    className={inputClass("benefitsDetails", formik)}
                  />
                  <FieldError error={formik.submitCount > 0 ? formik.errors.benefitsDetails : undefined} />
                </div>
              )}

              <div className="md:col-span-2">
                <Label htmlFor="otherAchievements">Any other Achievements, share details</Label>
                <input
                  id="otherAchievements"
                  name="otherAchievements"
                  value={formik.values.otherAchievements}
                  onChange={formik.handleChange}
                  className={inputClass("otherAchievements", formik)}
                />
                <FieldError error={formik.submitCount > 0 ? formik.errors.otherAchievements : undefined} />
              </div>
            </div>
          </SectionCard>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`w-full py-3 rounded-xl font-medium text-white ${
                formik.isSubmitting ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {formik.isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      <StatusDialog
        isVisible={statusPopup}
        title={title}
        subtitle={subtitle}
        buttonVisible={buttonVisible}
        status={isSuccess}
        onClose={goBacktoHome}
      />
    </div>
  );
};

export default QprForm;
