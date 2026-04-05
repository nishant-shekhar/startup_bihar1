import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cropper from "react-easy-crop";
import stateDistrictData from "./stateDistrictData.json";
import { qualificationOptions } from "./FormFieldUtils";
import { useLanguage } from "../../shared/LanguageContext";
import { FaLock, FaUpload } from "react-icons/fa";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg");
};

const institutionOptions = [
  "IIT Patna",
  "NIT Patna",
  "BIT Patna",
  "CIMP Patna",
  "Patna University",
  "Aryabhatta Knowledge University",
  "NIFT Patna",
  "AIIMS Patna",
  "Chanakya National Law University",
  "IGIMS Patna",
  "Other",
];

/* ========================= District Map ========================= */

const districtBlockMap = {
  Araria: ["Araria", "Bhargama", "Forbesganj", "Jokihat", "Kursakanta", "Narpatganj", "Palasi", "Raniganj", "Sikti"],
  Arwal: ["Arwal", "Sonbhadra Banshi Surypur", "Kaler", "Karpi", "Kurtha"],
  Aurangabad: ["Aurangabad", "Barun", "Daudnagar", "Deo", "Goh", "Haspura", "Kutumba", "Madanpur", "Nabinagar", "Obra", "Rafiganj"],
  Banka: ["Amarpur", "Banka", "Barahat", "Belhar", "Bounsi", "Chandan", "Dhoraiya", "Fullidumar", "Katoriya", "Rajoun", "Shambhuganj"],
  Begusarai: ["Bachwara", "Bakhri", "Balia", "Barauni", "Begusarai", "Bhagawanpur", "Birpur", "Cheria Bariyarpur", "Chhourahi", "Dandari", "Garhpura", "Khodabandpur", "Mansurchak", "Matihani", "Navkothi", "Sahebpur Kamal", "Samho-Akaha-Kurha", "Teghra"],
  Bhabhua: ["Adhaura", "Bhabhua", "Bhagwanpur", "Chainpur", "Chand", "Durgawati", "Kudra", "Mohania", "Nuawon", "Ramgarh", "Rampur"],
  Bhagalpur: ["Bihpur", "Gauradih", "Gopalpur", "Ishmailpur", "Jagdishpur", "Kahalgaon", "Kharik", "Narayanpur", "Nathnagar", "Navgachhia", "Pirpainty", "Rangra Chowk", "Sabour", "Shahkund", "Sanhoula", "Sultanganj"],
  Bhojpur: ["Agioan", "Ara Sadar", "Barhara", "Bihiya", "Charpokhri", "Garhani", "Jagdishpur", "Koilwar", "Piro", "Sahar", "Sandesh", "Shahpur", "Tarari", "Udwantnagar"],
  Buxar: ["Brahmpur", "Buxar", "Chakki", "Chausha", "Chaugain", "Dumraon", "Itarhi", "Kesath", "Nawanagar", "Rajpur", "Simari"],
  Darbhanga: ["Alinagar", "Bahadurpur", "Baheri", "Benipur", "Biraul", "Darbhanga", "Gaura Bauram", "Ghanshyampur", "Hanuman Nagar", "Hayaghat", "Jale", "Keoti", "Kiratpur", "Kusheswar Asthan", "Kusheswar Asthan East", "Manigachhi", "Singhwara", "Tardih"],
  "East Champaran": ["Adapur", "Areraj", "Banjariya", "Chakia", "Chhauradano", "Chiraiya", "Dhaka", "Ghorasahan", "Harsiddhi", "Kalyanpur", "Kesaria", "Kotwa", "Madhuban", "Mehsi", "Motihari", "Paharpur", "Pakaridayal", "Patahi", "Phenhara", "Piprakothi", "Ramgarhwa", "Raxaul", "Sangrampur", "Sugauli", "Tetaria", "Turkauliya", "Bankatwa"],
  Gaya: ["Amas", "Atri", "Banke Bazar", "Barachatty", "Belaganj", "Bodh Gaya", "Dobhi", "Dumariya", "Fatehpur", "Gaya Sadar", "Guraru", "Gurua", "Imamganj", "Khizar Sarai", "Konch", "Manpur", "Mohanpur", "Mohra", "Paraiya", "Sherghatty", "Tankuppa", "Tekari", "Wazirganj"],
  Gopalganj: ["Bhore", "Gopalganj", "Manjha", "Uchkagaon", "Kuchaikot", "Kateya", "Vijaipur", "Barauli", "Hathua", "Baikunthpur", "Phulwaria", "Thawe", "Panchdevari", "Sidhwalia"],
  Jamui: ["Barhat", "Chakai", "Gidhaur", "Isalmanagar Aliganj", "Jamui", "Jhajha", "Khaira", "Laxmipur", "Sikandra", "Sono"],
  Jehanabad: ["Jehanabad", "Ghoshi", "Hulasgunj", "Kako", "Makhdumpur", "Modanganj", "Ratni Faridpur"],
  Katihar: ["Amdabad", "Azamnagar", "Balrampur", "Barari", "Barsoi", "Dandkhora", "Falka", "Hasanganj", "Kadwa", "Katihar", "Korha", "Kursela", "Manihari", "Mansahi", "Pranpur", "Sameli"],
  Khagaria: ["Allouli Beldaur", "Beldaur", "Chautham", "Gogari", "Khagaria", "Mansi", "Parbatta"],
  Kishanganj: ["Bahadurganj", "Dighalbank", "Kishanganj", "Kochadhaman", "Pothia", "Terhagachh", "Thakurganj"],
  Lakhisarai: ["Barahia", "Channan", "Halsi", "Lakhisarai", "Piparia", "Ramgarh Chowk", "Suryagarha"],
  Madhepura: ["Alamnagar", "Bihariganj", "Chausa", "Ghailadh", "Gamharia", "Gualpara", "Kumarkhand", "Madhepura", "Murliganj", "Puraini", "Shankarpur", "Singheshwarsthan", "Uda Kishanganj"],
  Madhubani: ["Khutauna", "Phulparas", "Laukahi", "Ghoghardiha", "Rahika", "Pandaul", "Rajnagar", "Khajauli", "Kaluahi", "Babubarhi", "Madhwapur", "Harlakhi", "Bisfi", "Benipatti", "Lakhnaur", "Madhepur", "Jhanjharpur", "Andharathari", "Basopatti", "Ladania", "Jainagar"],
  Munger: ["Munger Sadar", "Dharahara", "Bariyarpur", "Jamalpur", "Tetia Bamber", "Haveli Kharagpur", "Tarapur", "Asarganj", "Sangrampur"],
  Muzaffarpur: ["Sahebganj", "Motipur", "Paroo", "Saraiya", "Kurhani", "Kanti", "Marwan", "Minapur", "Musahari", "Bochahan", "Aurai", "Katara", "Gaighat", "Muraul", "Sakra", "Bandra"],
  Nalanda: ["Ekangarsarai", "Biharsarif", "Asthawan", "Noorsarai", "Sarmera", "Rahui", "Harnaut", "Hilsa", "Islampur", "Ben", "Bind", "Parwalpur", "Katrisarai", "Karai Parsurai", "Nagarnarusa", "Chandi", "Tharthari", "Giriyak", "Rajgir", "Silao"],
  Nawada: ["Rajauli", "Akbarpur", "Sirdala", "Kowakole", "Pakaribarawan", "Warsaliganj", "Kashichak", "Nawada", "Nardiganj", "Roh", "Meskaur", "Govindpur", "Narhat", "Hisua"],
  Patna: ["Athmalgola", "Bakhtiarpur", "Barh", "Belchhi", "Bihta", "Bikram", "Danapur", "Daniyawan", "Dhanarua", "Dulhin Bazar", "Fatuha", "Ghoswari", "Khusrupur", "Maner", "Masaudhi", "Mokama", "Naubatpur", "Paliganj", "Pandarak", "Patna Sadar", "Phulwari Sharif", "Punpun", "Sampatchak"],
  Purnia: ["Amour", "Baisa", "Baisi", "Banmankhi", "Barhara Kothi", "Bhawanipur", "Dagarua", "Dhamdaha", "Jalalgarh", "Krityanandnagar", "Kasba", "Purnia", "Rupouli", "Srinagar"],
  Rohtas: ["Akorhigola", "Bikramganj", "Chenari", "Dawath", "Dehri", "Dinara", "Karakata", "Kargahar", "Kochas", "Nasriganj", "Nauhatta", "Nokha", "Rajpur", "Rohtas", "Sanjhauli", "Sasaram", "Sheosagar", "Surajpura", "Tilouthu"],
  Saharsa: ["Kahra", "Sattar Katiya", "Saur Bazar", "Patarghat", "Mahishi", "Sonbarsa", "Nauhatta", "Salkhua", "Banma Itahri", "Simri Bakhtiyarpur"],
  Samastipur: ["Kalyanpur", "Warisnagar", "Khanpur", "Samastipur", "Pusa", "Tajpur", "Morwa", "Sarairanjan", "Patori", "Mohanpur", "Mohiuddinnagar", "Vidyapatinagar", "Dalsingsarai", "Ujiyarpur", "Bibhutipur", "Rosera", "Shivajinagar", "Singhia", "Hasanpur", "Bithan"],
  Saran: ["Baniyapur", "Lahladpur", "Jalalpur", "Nagra", "Ekma", "Manjhi", "Rivilganj", "Chapra", "Maker", "Garkha", "Marhourah", "Amnour", "Mashrakh", "Panapur", "Taraiyan", "Ishupur", "Parsa", "Dariyapur", "Dighwara", "Sonepur"],
  Sheikhpura: ["Sheikhpura", "Barbigha", "Shekhopur Sarai", "Ariari", "Chewara", "Ghat Kusumba"],
  Sheohar: ["Sheohar", "Dumari", "Piprahi", "Purnahiya", "Tariyani"],
  Sitamarhi: ["Belsand", "Parsauni", "Runnisaidpur", "Dumra", "Riga", "Bairgania", "Majorganj", "Suppi", "Bathnaha", "Sonbarsa", "Parihar", "Sursand", "Bajpatti", "Pupri", "Choraut", "Nanpur", "Bokhra"],
  Siwan: ["Jiradei", "Andar", "Siswan", "Guthani", "Pachrukhi", "Darauli", "Goreakothi", "Bhagwanpur", "Hussainganj", "Mairwa", "Duraudha", "Siwan", "Barharia", "Raghunathpur", "Basantpur", "Maharajganj", "Lakri Nabiganj", "Hasanpura", "Nautan"],
  Supaul: ["Nirmali", "Marauna", "Supaul", "Kishanpur", "Saraigarh", "Pipra", "Basantpur", "Raghopur", "Pratapganj", "Triveniganj", "Chhatapur"],
  Vaishali: ["Hajipur", "Raghopur", "Bidupur", "Lalganj", "Vaishali", "Bhagwanpur", "Patedhi Belsar", "Mahnar", "Sahdei", "Mahua", "Chehrakala", "Jandaha", "Garaul", "Patepur", "Rajapakar", "Desri"],
  "West Champaran": ["Bettiah", "Narkatiaganj", "Ramnagar", "Bagaha", "Lauriya", "Chanpatia", "Gaunaha", "Mainatand", "Sikta", "Jogapatti", "Bairiya"],
};

const cutoffDate = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d;
})();

const getQualificationInitialValues = (savedQualification = "") => {
  const trimmed = String(savedQualification || "").trim();

  if (!trimmed) {
    return {
      qualification: "",
      customQualification: "",
    };
  }

  if (qualificationOptions.includes(trimmed) && trimmed !== "Other") {
    return {
      qualification: trimmed,
      customQualification: "",
    };
  }

  return {
    qualification: "Other",
    customQualification: trimmed === "Other" ? "" : trimmed,
  };
};

export default function BasicDetailsStep({
  onSubmit,
  onPrevious,
  initialValues,
  userSignupData,
  isReadOnly = false,
}) {
  const { t } = useLanguage();
  const founderName = userSignupData?.founderName || "";

  const existingProfilePhotoMeta = initialValues?.profilePhotoMeta || null;
  const qualificationInitials = getQualificationInitialValues(
    initialValues?.qualification || ""
  );

  const [profileImageUrl, setProfileImageUrl] = useState(
    existingProfilePhotoMeta?.downloadURL ||
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (existingProfilePhotoMeta?.downloadURL) {
      setProfileImageUrl(existingProfilePhotoMeta.downloadURL);
    }
  }, [existingProfilePhotoMeta?.downloadURL]);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    gender: Yup.string().required("Gender is required"),
    category: Yup.string().required("Category is required"),
    dateOfBirth: Yup.date()
      .max(cutoffDate, "You must be at least 18 years old")
      .required("Date of birth is required"),
    qualification: Yup.string().required("Qualification is required"),
    customQualification: Yup.string().when("qualification", {
      is: "Other",
      then: (schema) => schema.trim().required("Please enter qualification"),
      otherwise: (schema) => schema.notRequired(),
    }),
    institution: Yup.string().required("Institution is required"),
    otherInstitution: Yup.string().when("institution", {
      is: "Other",
      then: (schema) => schema.required("Please specify institution"),
      otherwise: (schema) => schema.notRequired(),
    }),
    linkedinProfile: Yup.string().url("Enter a valid URL").nullable(),
    applicantAddress: Yup.string().required("Applicant address is required"),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    blockName: Yup.string().trim().required("Block name is required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
    profilePhoto: Yup.mixed().test(
      "profile-photo-required",
      "Profile photo is required",
      function (value) {
        const hasNewFile = value instanceof File;
        const meta = this.parent?.profilePhotoMeta;

        const hasExistingPhoto =
          !!meta &&
          (typeof meta === "string" ||
            !!meta.downloadURL ||
            !!meta.fileName ||
            !!meta.storagePath);

        return hasNewFile || hasExistingPhoto;
      }
    ),
    profilePhotoMeta: Yup.mixed().nullable(),
  });

  const handleFileChange = (event) => {
    if (isReadOnly) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1048576) {
      alert("File size exceeds 1 MB");
      return;
    }

    setSelectedFile(URL.createObjectURL(file));
    setShowCropper(true);
  };

  const handleCropSave = async (formik) => {
    if (isReadOnly) return;

    try {
      const croppedImageUrl = await getCroppedImg(selectedFile, croppedAreaPixels);
      setProfileImageUrl(croppedImageUrl);
      setShowCropper(false);

      const blob = await fetch(croppedImageUrl).then((res) => res.blob());
      const file = new File([blob], "profile-photo.jpg", {
        type: "image/jpeg",
      });

      formik.setFieldValue("profilePhoto", file);
      formik.setFieldValue("profilePhotoMeta", formik.values.profilePhotoMeta || null);
      formik.setFieldTouched("profilePhoto", true, false);
      formik.validateField("profilePhoto");
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            Step 2 of 6
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Applicant basic details
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add founder profile, education and applicant address details.
          </p>
        </div>

        {isReadOnly ? (
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <FaLock />
              Step locked
            </div>
            <div className="mt-1">This section is read-only after final submission.</div>
          </div>
        ) : null}
      </div>

      <Formik
        initialValues={
          initialValues
            ? {
                ...initialValues,
                fullName: initialValues.fullName || founderName,
                qualification: qualificationInitials.qualification,
                customQualification: qualificationInitials.customQualification,
                gender: initialValues.gender || "",
                category: initialValues.category || "",
                dateOfBirth: initialValues.dateOfBirth || "",
                institution: initialValues.institution || "",
                otherInstitution: initialValues.otherInstitution || "",
                linkedinProfile: initialValues.linkedinProfile || "",
                profilePhoto: null,
                profilePhotoMeta: existingProfilePhotoMeta,
                applicantAddress: initialValues.applicantAddress || "",
                state: initialValues.state || "",
                district: initialValues.district || "",
                blockName: initialValues.blockName || "",
                pincode: initialValues.pincode || "",
              }
            : {
                fullName: founderName,
                gender: "",
                category: "",
                dateOfBirth: "",
                qualification: "",
                customQualification: "",
                institution: "",
                otherInstitution: "",
                linkedinProfile: "",
                profilePhoto: null,
                profilePhotoMeta: existingProfilePhotoMeta,
                applicantAddress: "",
                state: "",
                district: "",
                blockName: "",
                pincode: "",
              }
        }
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const finalQualification =
            values.qualification === "Other"
              ? values.customQualification.trim()
              : values.qualification;

          const finalValues = {
            ...values,
            qualification: finalQualification,
          };

          delete finalValues.customQualification;

          onSubmit(finalValues);
        }}
        enableReinitialize
      >
        {(formik) => {
          useEffect(() => {
            if (existingProfilePhotoMeta) {
              formik.setFieldValue("profilePhotoMeta", existingProfilePhotoMeta, false);
            }
          }, [existingProfilePhotoMeta]);

          const availableDistricts = formik.values.state
            ? stateDistrictData[formik.values.state] || []
            : [];

          const isBiharSelected = formik.values.state === "Bihar";
          const availableBlocks =
            isBiharSelected && formik.values.district
              ? districtBlockMap[formik.values.district] || []
              : [];

          const stateOptions = Object.keys(stateDistrictData);

          return (
            <Form className="space-y-6">
              <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
                <div className="mb-6 rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-amber-50/60 p-4">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                    Applicant profile
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Please ensure the details match your registration information.
                  </div>
                </div>

                <div className="mb-8 flex flex-col items-center">
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={() => !isReadOnly && fileInputRef.current?.click()}
                    className={`group relative ${isReadOnly ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-amber-200/70 via-white to-indigo-200/70 blur-md transition duration-300 group-hover:opacity-100" />
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="relative h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg ring-1 ring-slate-200"
                    />
                    {!isReadOnly ? (
                      <div className="absolute inset-0 rounded-full bg-black/0 transition group-hover:bg-black/10" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 text-white">
                        <FaLock />
                      </div>
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isReadOnly}
                  />

                  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-700">
                    {!isReadOnly ? (
                      <FaUpload className="text-slate-500" />
                    ) : (
                      <FaLock className="text-slate-500" />
                    )}
                    {t("basicDetails.uploadPhoto")}{" "}
                    <span className="text-red-500">*</span>
                  </div>

                  <div className="mt-1 text-xs text-slate-500">Max file size: 1 MB</div>

                  {formik.values.profilePhotoMeta?.fileName ? (
                    <div className="mt-2 text-xs text-slate-500">
                      Uploaded: {formik.values.profilePhotoMeta.fileName}
                    </div>
                  ) : null}

                  <ErrorMessage
                    name="profilePhoto"
                    component="p"
                    className="mt-2 text-sm text-red-500"
                  />
                </div>

                {showCropper && !isReadOnly && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
                    <div className="w-full max-w-md rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-2xl backdrop-blur-xl">
                      <div className="mb-4 text-lg font-semibold text-slate-800">
                        Crop profile photo
                      </div>

                      <div className="relative h-72 overflow-hidden rounded-2xl bg-slate-100">
                        <Cropper
                          image={selectedFile}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          cropShape="round"
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={(_, croppedPixels) =>
                            setCroppedAreaPixels(croppedPixels)
                          }
                        />
                      </div>

                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="mt-4 w-full"
                      />

                      <div className="mt-5 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowCropper(false)}
                          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCropSave(formik)}
                          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                        >
                          Save Crop
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <ReadOnlyField
                    name="fullName"
                    label={t("basicDetails.fullName")}
                    helper={t("basicDetails.nameFromRegistration")}
                  />

                  <SelectField
                    name="gender"
                    label={t("basicDetails.gender")}
                    disabled={isReadOnly}
                  >
                    <option value="">{t("common.select")}</option>
                    <option value="Male">{t("basicDetails.male")}</option>
                    <option value="Female">{t("basicDetails.female")}</option>
                    <option value="Other">{t("basicDetails.other")}</option>
                  </SelectField>

                  <SelectField
                    name="category"
                    label={t("basicDetails.category")}
                    disabled={isReadOnly}
                  >
                    <option value="">{t("common.select")}</option>
                    <option value="General">{t("basicDetails.general")}</option>
                    <option value="OBC">{t("basicDetails.obc")}</option>
                    <option value="SC">{t("basicDetails.sc")}</option>
                    <option value="ST">{t("basicDetails.st")}</option>
                  </SelectField>

                  <InputField
                    name="dateOfBirth"
                    type="date"
                    label={t("basicDetails.dateOfBirth")}
                    max={cutoffDate.toISOString().split("T")[0]}
                    disabled={isReadOnly}
                  />

                  <div>
                    <label
                      htmlFor="qualification"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      {t("basicDetails.qualification")}
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Field
                        as="select"
                        id="qualification"
                        name="qualification"
                        disabled={isReadOnly}
                        onChange={(e) => {
                          const value = e.target.value;
                          formik.setFieldValue("qualification", value);

                          if (value !== "Other") {
                            formik.setFieldValue("customQualification", "");
                          }
                        }}
                        className={`block w-full rounded-2xl border px-4 py-3 outline-none transition ${
                          isReadOnly
                            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                            : "border-slate-200 bg-white/85 text-slate-900 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
                        }`}
                      >
                        <option value="">{t("common.select")}</option>
                        {qualificationOptions
                          .filter((qual) => qual !== "Other")
                          .map((qual) => (
                            <option key={qual} value={qual}>
                              {qual}
                            </option>
                          ))}
                        <option value="Other">Other</option>
                      </Field>

                      {formik.values.qualification === "Other" ? (
                        <Field
                          id="customQualification"
                          name="customQualification"
                          type="text"
                          placeholder="Enter qualification"
                          disabled={isReadOnly}
                          className={`block w-full rounded-2xl border px-4 py-3 outline-none transition ${
                            isReadOnly
                              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
                              : "border-slate-200 bg-white/85 text-slate-900 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
                          }`}
                        />
                      ) : (
                        <div />
                      )}
                    </div>

                    <ErrorMessage
                      name="qualification"
                      component="p"
                      className="mt-2 text-sm text-red-500"
                    />
                    {formik.values.qualification === "Other" && (
                      <ErrorMessage
                        name="customQualification"
                        component="p"
                        className="mt-2 text-sm text-red-500"
                      />
                    )}
                  </div>

                  <SelectField
                    name="institution"
                    label={t("basicDetails.institution")}
                    disabled={isReadOnly}
                  >
                    <option value="">{t("basicDetails.selectInstitution")}</option>
                    {institutionOptions.map((institution) => (
                      <option key={institution} value={institution}>
                        {institution}
                      </option>
                    ))}
                  </SelectField>

                  {formik.values.institution === "Other" && (
                    <InputField
                      name="otherInstitution"
                      label={t("basicDetails.otherInstitution")}
                      placeholder={t("basicDetails.otherInstitution")}
                      disabled={isReadOnly}
                    />
                  )}

                  <InputField
                    name="linkedinProfile"
                    type="url"
                    label={t("basicDetails.linkedinProfile")}
                    placeholder="https://linkedin.com/in/yourprofile"
                    disabled={isReadOnly}
                  />

                  <div className="md:col-span-2">
                    <TextAreaField
                      name="applicantAddress"
                      label="Applicant Address"
                      rows={4}
                      disabled={isReadOnly}
                    />
                  </div>

                  <SelectField
                    name="state"
                    label={t("basicDetails.state")}
                    disabled={isReadOnly}
                    onChange={(e) => {
                      formik.setFieldValue("state", e.target.value);
                      formik.setFieldValue("district", "");
                      formik.setFieldValue("blockName", "");
                    }}
                  >
                    <option value="">{t("common.select")}</option>
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </SelectField>

                  <SelectField
                    name="district"
                    label={t("basicDetails.district")}
                    disabled={!formik.values.state || isReadOnly}
                    onChange={(e) => {
                      formik.setFieldValue("district", e.target.value);
                      formik.setFieldValue("blockName", "");
                    }}
                  >
                    <option value="">
                      {formik.values.state
                        ? t("basicDetails.selectDistrict")
                        : `${t("common.select")} ${t("basicDetails.state")}`}
                    </option>
                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </SelectField>

                  {isBiharSelected ? (
                    <SelectField
                      name="blockName"
                      label="Block Name"
                      disabled={!formik.values.district || isReadOnly}
                    >
                      <option value="">
                        {formik.values.district
                          ? "Select Block"
                          : "Select district first"}
                      </option>
                      {availableBlocks.map((block) => (
                        <option key={block} value={block}>
                          {block}
                        </option>
                      ))}
                    </SelectField>
                  ) : (
                    <InputField
                      name="blockName"
                      label="Block Name"
                      placeholder="Enter block name"
                      disabled={isReadOnly}
                    />
                  )}

                  <InputField
                    name="pincode"
                    label="Pincode"
                    placeholder="800001"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={onPrevious}
                    className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    {t("common.previous")}
                  </button>

                  {!isReadOnly ? (
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                    >
                      {t("common.saveAndContinue")}
                    </button>
                  ) : (
                    <div className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-500">
                      Locked after submission
                    </div>
                  )}
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

function InputField({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  ...rest
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full rounded-2xl border px-4 py-3 outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
            : "border-slate-200 bg-white/85 text-slate-900 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
        }`}
        {...rest}
      />
      <ErrorMessage
        name={name}
        component="p"
        className="mt-2 text-sm text-red-500"
      />
    </div>
  );
}

function SelectField({ name, label, children, disabled = false, ...rest }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <Field
        as="select"
        id={name}
        name={name}
        disabled={disabled}
        className={`block w-full rounded-2xl border px-4 py-3 outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
            : "border-slate-200 bg-white/85 text-slate-900 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
        }`}
        {...rest}
      >
        {children}
      </Field>
      <ErrorMessage
        name={name}
        component="p"
        className="mt-2 text-sm text-red-500"
      />
    </div>
  );
}

function ReadOnlyField({ name, label, helper }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        disabled
        className="block w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
      />
      {helper ? <p className="mt-2 text-xs text-slate-500">{helper}</p> : null}
      <ErrorMessage
        name={name}
        component="p"
        className="mt-2 text-sm text-red-500"
      />
    </div>
  );
}

function TextAreaField({ name, label, rows = 4, disabled = false }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <Field
        as="textarea"
        id={name}
        name={name}
        rows={rows}
        disabled={disabled}
        className={`block w-full rounded-2xl border px-4 py-3 outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
            : "border-slate-200 bg-white/85 text-slate-900 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
        }`}
      />
      <ErrorMessage
        name={name}
        component="p"
        className="mt-2 text-sm text-red-500"
      />
    </div>
  );
}