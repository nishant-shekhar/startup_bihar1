import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import Upload from "./Upload";
import StatusDialog from "./StatusDialog";

// Helper functions for managing semicolon-separated strings
const isOptionSelected = (option, valueStr) => {
  const arr = valueStr.split(";").filter((x) => x);
  return arr.includes(option);
};

const addOptionToString = (option, valueStr) => {
  const arr = valueStr.split(";").filter((x) => x);
  if (!arr.includes(option)) {
    arr.push(option);
  }
  return arr.join(";");
};

const removeOptionFromString = (option, valueStr) => {
  const arr = valueStr.split(";").filter((x) => x);
  const newArr = arr.filter((item) => item !== option);
  return newArr.join(";");
};
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
const QprForm = ({ onFormSubmitSuccess }) => {
  // Separate state variables for multi-select fields (as semicolon-separated strings)
  const [fundsTakenStr, setFundsTakenStr] = useState("");
  const [iprReceivedStr, setIprReceivedStr] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [statusPopup, setStatusPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonVisible, setButtonVisible] = useState(true);
  const [subtitle, setSubtitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(""); // Add success state
  const [dialogStatus, setDialogStatus] = useState({ isVisible: false, title: "", subtitle: "", buttonVisible: false, status: "" });

  const goBacktoHome = () => {
		setDialogStatus({ ...dialogStatus, isVisible: false })
		console.log("navigate to home")
		onFormSubmitSuccess();
	}

  const handleDistrictChange = (event) => {
    const district = event.target.value;
    setSelectedDistrict(district);
    formik.setFieldValue("registeredDistrict", district);
    formik.setFieldValue("registeredBlock", ""); // Reset block selection
  };
  // Options for tickboxes
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

  const iprOptions = [
    "Trademark",
    "Copyright",
    "Patent",
    "Trade secret",
    "Industrial Design",
  ];

  // Custom validation function (adjust messages as needed)
  const validate = (values) => {
    const errors = {};
    if (!values.totalCoFounders) {
      errors.totalCoFounders = "Total no. of Co-founders is required";
    }
    if (!values.stage) {
      errors.stage = "Stage is required";
    }
    if (!values.sector) {
      errors.sector = "Sector is required";
    }
    if (!values.registeredDistrict) {
      errors.registeredDistrict = "Registered office district is required";
    }
    if (!values.aboutStartup) {
      errors.aboutStartup = "About your Startup is required";
    }
    //if (!fundsTakenStr || fundsTakenStr.split(";").filter(x => x).length === 0) {
    //   errors.fundsTaken = "Select at least one option";
    // }
    if (!values.currentRevenue) {
      errors.currentRevenue = "Current Revenue/Turnover details is required";
    }
    if (!values.netProfitOrLoss) {
      errors.netProfitOrLoss = "Net Profit or Loss is required";
    }
    if (values.fundsRaised === "") {
      errors.fundsRaised = "This field is required";
    }
    if (values.fundsRaised === "Yes" && !values.fundsDetails) {
      errors.fundsDetails = "Please share details of funds raised";
    }
    if (!values.fundAmount) {
      errors.fundAmount = "Amount of Fund is required";
    } else if (isNaN(values.fundAmount)) {
      errors.fundAmount = "Amount must be a number";
    }
    //if (!iprReceivedStr || iprReceivedStr.split(";").filter(x => x).length === 0) {
    //  errors.iprReceived = "Select at least one option";
    // }
    if (!values.fullTimeMale) {
      errors.fullTimeMale = "No. of Full-time Male employees is required";
    } else if (isNaN(values.fullTimeMale)) {
      errors.fullTimeMale = "Must be a number";
    }
    if (!values.fullTimeFemale) {
      errors.fullTimeFemale = "No. of Full-time Female employees is required";
    } else if (isNaN(values.fullTimeFemale)) {
      errors.fullTimeFemale = "Must be a number";
    }
    if (!values.partTimeMale) {
      errors.partTimeMale = "No. of Part-time Male employees is required";
    } else if (isNaN(values.partTimeMale)) {
      errors.partTimeMale = "Must be a number";
    }
    if (!values.partTimeFemale) {
      errors.partTimeFemale = "No. of Part-time Female employees is required";
    } else if (isNaN(values.partTimeFemale)) {
      errors.partTimeFemale = "Must be a number";
    }
    if (!values.workOrders) {
      errors.workOrders = "No. of Work orders received is required";
    } else if (isNaN(values.workOrders)) {
      errors.workOrders = "Must be a number";
    }
    if (!values.totalWorkOrderAmount) {
      errors.totalWorkOrderAmount = "Total Amount of Work Orders received is required";
    } else if (isNaN(values.totalWorkOrderAmount)) {
      errors.totalWorkOrderAmount = "Must be a number";
    }
    if (!values.customersAcquired) {
      errors.customersAcquired = "No. of Customers acquired is required";
    } else if (isNaN(values.customersAcquired)) {
      errors.customersAcquired = "Must be a number";
    }
    if (
      !values.unitPhotos ||
      (!values.unitPhotos.photo1 && !values.unitPhotos.photo2)
    ) {
      errors.unitPhotos = "Geo-tagged photos are required";
    }
    if (!values.pitchdeck) {
      errors.pitchdeck = "Pitchdeck is required";
    }
    if (!values.auditedReport) {
      errors.auditedReport = "Audited financial statement report is required";
    }
    if (!values.incubationBenefits) {
      errors.incubationBenefits = "This field is required";
    }
    if (values.incubationBenefits === "Yes" && !values.benefitsDetails) {
      errors.benefitsDetails = "Please mention the benefits";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      totalCoFounders: "",
      stage: "",
      sector: "",
      registeredDistrict: "",
      registeredBlock: "",
      aboutStartup: "",
      currentRevenue: "",
      netProfitOrLoss: "",
      fundsRaised: "", // Expect "Yes" or "No"
      fundsDetails: "",
      fundAmount: "",
      fullTimeMale: "",
      fullTimeFemale: "",
      partTimeMale: "",
      partTimeFemale: "",
      workOrders: "",
      totalWorkOrderAmount: "",
      customersAcquired: "",
      // For file uploads, unitPhotos is an object; pitchdeck and auditedReport are files.
      unitPhotos: { photo1: null, photo2: null },
      pitchdeck: null,
      auditedReport: null,
      incubationBenefits: "", // "Yes" or "No"
      benefitsDetails: "",
      otherAchievements: "",
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      setTitle("Submitting Startup Progress Form");
			setSubtitle("Please wait while we submit your form");
			setButtonVisible(false);
			setStatusPopup(true);
      try {
        // Build FormData for multipart/form-data submission
        const formData = new FormData();
        formData.append("totalCoFounders", values.totalCoFounders);
        formData.append("stage", values.stage);
        formData.append("sector", values.sector);
        formData.append("registeredDistrict", values.registeredDistrict);
        formData.append("registeredBlock", values.registeredBlock);
        formData.append("aboutStartup", values.aboutStartup);
        // Append our semicolon-separated strings for multi-select fields
        formData.append("fundsTaken", fundsTakenStr);
        formData.append("currentRevenue", values.currentRevenue);
        formData.append("netProfitOrLoss", values.netProfitOrLoss);
        formData.append("fundsRaised", values.fundsRaised);
        formData.append("fundsDetails", values.fundsDetails);
        formData.append("fundAmount", values.fundAmount);
        formData.append("iprReceived", iprReceivedStr);
        formData.append("fullTimeMale", values.fullTimeMale);
        formData.append("fullTimeFemale", values.fullTimeFemale);
        formData.append("partTimeMale", values.partTimeMale);
        formData.append("partTimeFemale", values.partTimeFemale);
        formData.append("workOrders", values.workOrders);
        formData.append("totalWorkOrderAmount", values.totalWorkOrderAmount);
        formData.append("customersAcquired", values.customersAcquired);
        formData.append("incubationBenefits", values.incubationBenefits);
        formData.append("benefitsDetails", values.benefitsDetails);
        formData.append("otherAchievements", values.otherAchievements);

        // Append file fields if available
        if (values.unitPhotos.photo1) {
          formData.append("unitPhoto1", values.unitPhotos.photo1);
        }
        if (values.unitPhotos.photo2) {
          formData.append("unitPhoto2", values.unitPhotos.photo2);
        }
        if (values.pitchdeck) {
          formData.append("pitchdeck", values.pitchdeck);
        }
        if (values.auditedReport) {
          formData.append("auditedReport", values.auditedReport);
        }

        const response = await axios.post(
          "https://startupbihar.in/api/Qreport",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        //alert("Data submitted successfully!");
        setTitle("Submission Successful");
				setSubtitle(response.data.message);
				setButtonVisible(true);
				setIsSuccess("success"); // Set success state
        resetForm();
      } catch (error) {
        console.error("Error submitting data:", error.response?.data || error.message);
        //alert("Failed to submit data. Check console for details.");
        setTitle("Submission Failed");
				setSubtitle(
					error.response?.data?.error || "An error occurred during submission"
				);
				setButtonVisible(true);
			
				setIsSuccess("failed"); // Set success state
      }
    },
  });

  return (
    <div className="h-screen overflow-y-auto">
      <div className="relative w-full h-[250px]">

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="1440" height="250" preserveAspectRatio="none" viewBox="0 0 1440 250">
          <g mask="url(#SvgjsMask1000)" fill="none">
            <rect width="1440" height="250" x="0" y="0" fill="#0e2a47"></rect>
            <path d="M38 250L288 0L538.5 0L288.5 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M244.60000000000002 250L494.6 0L647.6 0L397.6 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M490.20000000000005 250L740.2 0L911.2 0L661.2 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M728.8000000000001 250L978.8000000000001 0L1289.3000000000002 0L1039.3000000000002 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M1406 250L1156 0L982 0L1232 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M1199.4 250L949.4000000000001 0L749.9000000000001 0L999.9000000000001 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M940.8 250L690.8 0L375.79999999999995 0L625.8 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M704.1999999999999 250L454.19999999999993 0L146.69999999999993 0L396.69999999999993 250z" fill="url(#SvgjsLinearGradient1002)"></path>
            <path d="M1205.2767553797382 250L1440 15.276755379738262L1440 250z" fill="url(#SvgjsLinearGradient1001)"></path>
            <path d="M0 250L234.72324462026174 250L 0 15.276755379738262z" fill="url(#SvgjsLinearGradient1002)"></path>
          </g>
          <defs>
            <mask id="SvgjsMask1000">
              <rect width="1440" height="250" fill="#ffffff"></rect>
            </mask>
            <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="SvgjsLinearGradient1001">
              <stop stop-color="rgba(15, 70, 185, 0.2)" offset="0"></stop>
              <stop stop-opacity="0" stop-color="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
            </linearGradient>
            <linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="SvgjsLinearGradient1002">
              <stop stop-color="rgba(15, 70, 185, 0.2)" offset="0"></stop>
              <stop stop-opacity="0" stop-color="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
            </linearGradient>
          </defs>
        </svg>


        <div className="absolute top-9 left-0 w-full p-6 text-white">
          <h1 className="text-3xl font-bold mb-2 relative top-10">Startup Progress Report </h1>
          <p className="text-lg max-w-xl relative top-10">
            Share your startup progress metrics
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <form onSubmit={formik.handleSubmit} className="w-full max-w-4xl p-8">


          {/* Row 1 - Column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div>
              {/* Total no. of Co-founders */}
              <div className="mb-4">
                <label htmlFor="totalCoFounders" className="block font-medium">
                  Total no. of Co-founders*
                </label>
                <input
                  type="text"
                  id="totalCoFounders"
                  name="totalCoFounders"
                  value={formik.values.totalCoFounders}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.totalCoFounders && (
                  <div className="text-red-600">{formik.errors.totalCoFounders}</div>
                )}
              </div>

              {/* Stage */}
              <div className="mb-4">
                <label htmlFor="stage" className="block font-medium">
                  Stage* (Dropdown)
                </label>
                <select
                  id="stage"
                  name="stage"
                  value={formik.values.stage}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                >
                  <option value="">Select Stage</option>
                  <option value="Ideation">Ideation</option>
                  <option value="Prototype">Prototype</option>
                  <option value="MVP">MVP</option>
                  <option value="Scaling">Scaling</option>
                </select>
                {formik.errors.stage && (
                  <div className="text-red-600">{formik.errors.stage}</div>
                )}
              </div>

              {/* Sector */}
              <div className="mb-4">
                <label htmlFor="sector" className="block font-medium">
                  Sector*
                </label>
                <select
                  id="sector"
                  name="sector"
                  value={formik.values.sector}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                >
                  <option value="">Select Sector</option>
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


                {formik.errors.sector && (
                  <div className="text-red-600">{formik.errors.sector}</div>
                )}
              </div>

              {/* Registered office district */}
              <div className="mb-4">
                <label htmlFor="registeredDistrict" className="block font-medium">
                  Registered office district*
                </label>
                <select
                  id="registeredDistrict"
                  name="registeredDistrict"
                  value={formik.values.registeredDistrict}
                  onChange={handleDistrictChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                >
                  <option value="">Select District</option>
                  {Object.keys(districtBlockMap).map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {formik.errors.registeredDistrict && (
                  <div className="text-red-600">{formik.errors.registeredDistrict}</div>
                )}
              </div>

              {/* Registered office Block */}
              <div className="mb-4">
                <label htmlFor="registeredBlock" className="block font-medium">
                  Registered office Block
                </label>
                <select
                  id="registeredBlock"
                  name="registeredBlock"
                  value={formik.values.registeredBlock}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  disabled={!selectedDistrict}
                >
                  <option value="">Select Block</option>
                  {selectedDistrict &&
                    districtBlockMap[selectedDistrict].map((block) => (
                      <option key={block} value={block}>{block}</option>
                    ))}
                </select>
                {formik.errors.registeredBlock && (
                  <div className="text-red-600">{formik.errors.registeredBlock}</div>
                )}
              </div>

              {/* About your Startup */}
              <div className="mb-4">
                <label htmlFor="aboutStartup" className="block font-medium">
                  About your Startup (In one line)*
                </label>
                <input
                  type="text"
                  id="aboutStartup"
                  name="aboutStartup"
                  value={formik.values.aboutStartup}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.aboutStartup && (
                  <div className="text-red-600">{formik.errors.aboutStartup}</div>
                )}
              </div>

              {/* Funds taken from Startup Bihar */}
              <div className="mb-4">
                <label className="block font-medium">
                  Funds taken from Startup Bihar*
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {fundsOptions.map((option, index) => (
                    <label key={index} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="fundsTaken"
                        value={option}
                        checked={isOptionSelected(option, fundsTakenStr)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFundsTakenStr((prev) => addOptionToString(option, prev));
                          } else {
                            setFundsTakenStr((prev) => removeOptionFromString(option, prev));
                          }
                        }}
                        className="form-checkbox"
                      />
                      <span className="ml-2 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
                {formik.errors.fundsTaken && (
                  <div className="text-red-600">{formik.errors.fundsTaken}</div>
                )}
              </div>

              {/* Current Revenue/Turnover details */}
              <div className="mb-4">
                <label htmlFor="currentRevenue" className="block font-medium">
                  Current Revenue/Turnover details (In Rs. Lakhs)*
                </label>
                <input
                  type="text"
                  id="currentRevenue"
                  name="currentRevenue"
                  value={formik.values.currentRevenue}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.currentRevenue && (
                  <div className="text-red-600">{formik.errors.currentRevenue}</div>
                )}
              </div>

              {/* Net Profit or Loss */}
              <div className="mb-4">
                <label htmlFor="netProfitOrLoss" className="block font-medium">
                  Net Profit or Loss (Rs. In lakh)*
                </label>
                <input
                  type="text"
                  id="netProfitOrLoss"
                  name="netProfitOrLoss"
                  value={formik.values.netProfitOrLoss}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.netProfitOrLoss && (
                  <div className="text-red-600">{formik.errors.netProfitOrLoss}</div>
                )}
              </div>
            </div>

            {/* Column 2 */}
            <div>
              {/* Funds raised or Grants received */}
              <div className="mb-4">
                <label htmlFor="fundsRaised" className="block font-medium">
                  Any Funds raised or Grants received*
                </label>
                <select
                  id="fundsRaised"
                  name="fundsRaised"
                  value={formik.values.fundsRaised}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {formik.errors.fundsRaised && (
                  <div className="text-red-600">{formik.errors.fundsRaised}</div>
                )}
              </div>

              {/* If yes, share details */}
              {formik.values.fundsRaised === "Yes" && (
                <div className="mb-4">
                  <label htmlFor="fundsDetails" className="block font-medium">
                    If yes, share details (Name of organization)
                  </label>
                  <select
                    id="fundsDetails"
                    name="fundsDetails"
                    value={formik.values.fundsDetails}
                    onChange={formik.handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  >
                    <option value="">Select</option>
                    <option value="HNI">HNI</option>
                    <option value="Angel group">Angel group</option>
                    <option value="AIF CAT-1">AIF CAT-1</option>
                    <option value="AIF CAT-2">AIF CAT-2</option>
                    <option value="Startup India">Startup India</option>
                  </select>
                  {formik.errors.fundsDetails && (
                    <div className="text-red-600">{formik.errors.fundsDetails}</div>
                  )}
                </div>
              )}

              {/* Amount of Fund */}
              <div className="mb-4">
                <label htmlFor="fundAmount" className="block font-medium">
                  Amount of Fund
                </label>
                <input
                  type="number"
                  step="1"
                  id="fundAmount"
                  name="fundAmount"
                  value={formik.values.fundAmount}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.fundAmount && (
                  <div className="text-red-600">{formik.errors.fundAmount}</div>
                )}
              </div>

              {/* Any IPR received */}
              <div className="mb-4">
                <label className="block font-medium">Any IPR received*</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {iprOptions.map((option, index) => (
                    <label key={index} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="iprReceived"
                        value={option}
                        checked={isOptionSelected(option, iprReceivedStr)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setIprReceivedStr((prev) => addOptionToString(option, prev));
                          } else {
                            setIprReceivedStr((prev) => removeOptionFromString(option, prev));
                          }
                        }}
                        className="form-checkbox"
                      />
                      <span className="ml-2 text-sm">{option}</span>
                    </label>
                  ))}
                </div>
                {formik.errors.iprReceived && (
                  <div className="text-red-600">{formik.errors.iprReceived}</div>
                )}
              </div>

              {/* Full-time Male employees */}
              <div className="mb-4">
                <label htmlFor="fullTimeMale" className="block font-medium">
                  No. of Full-time Male employees*
                </label>
                <input
                  type="number"
                  id="fullTimeMale"
                  name="fullTimeMale"
                  value={formik.values.fullTimeMale}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.fullTimeMale && (
                  <div className="text-red-600">{formik.errors.fullTimeMale}</div>
                )}
              </div>

              {/* Full-time Female employees */}
              <div className="mb-4">
                <label htmlFor="fullTimeFemale" className="block font-medium">
                  No. of Full-time Female employees*
                </label>
                <input
                  type="number"
                  id="fullTimeFemale"
                  name="fullTimeFemale"
                  value={formik.values.fullTimeFemale}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.fullTimeFemale && (
                  <div className="text-red-600">{formik.errors.fullTimeFemale}</div>
                )}
              </div>

              {/* Part-time Male employees */}
              <div className="mb-4">
                <label htmlFor="partTimeMale" className="block font-medium">
                  No. of Part-time Male employees*
                </label>
                <input
                  type="number"
                  id="partTimeMale"
                  name="partTimeMale"
                  value={formik.values.partTimeMale}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.partTimeMale && (
                  <div className="text-red-600">{formik.errors.partTimeMale}</div>
                )}
              </div>

              {/* Part-time Female employees */}
              <div className="mb-4">
                <label htmlFor="partTimeFemale" className="block font-medium">
                  No. of Part-time Female employees*
                </label>
                <input
                  type="number"
                  id="partTimeFemale"
                  name="partTimeFemale"
                  value={formik.values.partTimeFemale}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.partTimeFemale && (
                  <div className="text-red-600">{formik.errors.partTimeFemale}</div>
                )}
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div>
              {/* Work orders received */}
              <div className="mb-4">
                <label htmlFor="workOrders" className="block font-medium">
                  No. of Work orders received *
                </label>
                <input
                  type="number"
                  id="workOrders"
                  name="workOrders"
                  value={formik.values.workOrders}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.workOrders && (
                  <div className="text-red-600">{formik.errors.workOrders}</div>
                )}
              </div>

              {/* Total amount of work orders received */}
              <div className="mb-4">
                <label htmlFor="totalWorkOrderAmount" className="block font-medium">
                  Total Amount of Work Orders received*
                </label>
                <input
                  type="number"
                  step="1"
                  id="totalWorkOrderAmount"
                  name="totalWorkOrderAmount"
                  value={formik.values.totalWorkOrderAmount}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.totalWorkOrderAmount && (
                  <div className="text-red-600">{formik.errors.totalWorkOrderAmount}</div>
                )}
              </div>

              {/* Customers acquired */}
              <div className="mb-4">
                <label htmlFor="customersAcquired" className="block font-medium">
                  No. of Customers acquired/Current Active users *
                </label>
                <input
                  type="number"
                  id="customersAcquired"
                  name="customersAcquired"
                  value={formik.values.customersAcquired}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.customersAcquired && (
                  <div className="text-red-600">{formik.errors.customersAcquired}</div>
                )}
              </div>

              {/* Upload Geo-tagged photos (2 photos) */}
              <div className="mb-4">
                <label className="block font-medium">
                  Upload 2 Geo-tagged photos of your unit/office*
                </label>
                <div className="flex flex-col gap-4 mt-2">
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
                {formik.errors.unitPhotos && (
                  <div className="text-red-600">{formik.errors.unitPhotos}</div>
                )}
              </div>
            </div>

            {/* Column 2 */}
            <div>
              {/* Pitchdeck */}
              <div className="mb-4">
                <Upload
                  label="Upload updated pitchdeck (PDF)*"
                  name="pitchdeck"
                  onChange={(file) => formik.setFieldValue("pitchdeck", file)}
                />
                {formik.errors.pitchdeck && (
                  <div className="text-red-600">{formik.errors.pitchdeck}</div>
                )}
              </div>

              {/* Audited Financial Statement */}
              <div className="mb-4">
                <Upload
                  label="Upload last year audited financial statement report*"
                  name="auditedReport"
                  onChange={(file) => formik.setFieldValue("auditedReport", file)}
                />
                {formik.errors.auditedReport && (
                  <div className="text-red-600">{formik.errors.auditedReport}</div>
                )}
              </div>

              {/* Benefits from incubation/mentors */}
              <div className="mb-4">
                <label htmlFor="incubationBenefits" className="block font-medium">
                  Any benefits available from the incubation center/appointed mentors*
                </label>
                <select
                  id="incubationBenefits"
                  name="incubationBenefits"
                  value={formik.values.incubationBenefits}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {formik.errors.incubationBenefits && (
                  <div className="text-red-600">{formik.errors.incubationBenefits}</div>
                )}
              </div>

              {/* If yes, Benefits details */}
              {formik.values.incubationBenefits === "Yes" && (
                <div className="mb-4">
                  <label htmlFor="benefitsDetails" className="block font-medium">
                    If yes, please mention
                  </label>
                  <input
                    type="text"
                    id="benefitsDetails"
                    name="benefitsDetails"
                    value={formik.values.benefitsDetails}
                    onChange={formik.handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  />
                  {formik.errors.benefitsDetails && (
                    <div className="text-red-600">{formik.errors.benefitsDetails}</div>
                  )}
                </div>
              )}

              {/* Other Achievements */}
              <div className="mb-4">
                <label htmlFor="otherAchievements" className="block font-medium">
                  Any other Achievements, share details
                </label>
                <input
                  type="text"
                  id="otherAchievements"
                  name="otherAchievements"
                  value={formik.values.otherAchievements}
                  onChange={formik.handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
                {formik.errors.otherAchievements && (
                  <div className="text-red-600">{formik.errors.otherAchievements}</div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
        
      </div>
      <StatusDialog
				isVisible={statusPopup}
				title={title}
				subtitle={subtitle}
				buttonVisible={buttonVisible}
				status={isSuccess} // Pass success state

				onClose={() => goBacktoHome()}
			/>
    </div>
  );
};

export default QprForm;
