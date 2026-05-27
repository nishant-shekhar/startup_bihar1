import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
  FaCamera,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaIdBadge,
  FaMapMarkerAlt,
  FaTimes,
  FaUser,
} from "react-icons/fa";

import stateDistrictData from "./stateDistrictData.json";

const SSU_POSTS = [
  {
    id: "sr_consultant_startup",
    serialNo: 1,
    postName: "Sr. Consultant Startup",
    emoluments: "₹1.25 - ₹1.50 Lakh/Month",
    qualification:
      "B.Tech / BE / Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 10 years overall experience, including at least 4 years in startup ecosystem",
    category: "Startup",
    level: "Senior Consultant",
  },
  {
    id: "sr_consultant_incubation",
    serialNo: 2,
    postName: "Sr. Consultant Incubation",
    emoluments: "₹1.25 - ₹1.50 Lakh/Month",
    qualification:
      "B.Tech / BE / Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 10 years overall experience, including at least 4 years in startup ecosystem",
    category: "Incubation",
    level: "Senior Consultant",
  },
  {
    id: "sr_consultant_finance",
    serialNo: 3,
    postName: "Sr. Consultant Finance",
    emoluments: "₹1.25 - ₹1.50 Lakh/Month",
    qualification:
      "Chartered Accountant / Masters or PG Diploma in Business Management Finance",
    experience:
      "Minimum 10 years overall experience, including at least 4 years in Government Sector / startup ecosystem",
    category: "Finance",
    level: "Senior Consultant",
  },
  {
    id: "consultant_startup",
    serialNo: 4,
    postName: "Consultant Startup",
    emoluments: "₹1.00 - ₹1.25 Lakh/Month",
    qualification:
      "B.Tech / BE / Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 8 years overall experience, including at least 3 years in startup ecosystem",
    category: "Startup",
    level: "Consultant",
  },
  {
    id: "consultant_incubation",
    serialNo: 5,
    postName: "Consultant Incubation",
    emoluments: "₹1.00 - ₹1.25 Lakh/Month",
    qualification:
      "B.Tech / BE / Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 8 years overall experience, including at least 3 years in startup ecosystem",
    category: "Incubation",
    level: "Consultant",
  },
  {
    id: "consultant_media_management",
    serialNo: 6,
    postName: "Consultant Media Management",
    emoluments: "₹1.00 - ₹1.25 Lakh/Month",
    qualification:
      "Mass Communication / Master's in Advertising, Public Relations or related field",
    experience:
      "Minimum 8 years overall experience, including at least 3 years in social media planning and strategy",
    category: "Media",
    level: "Consultant",
  },
  {
    id: "consultant_it",
    serialNo: 7,
    postName: "Consultant IT",
    emoluments: "₹1.00 - ₹1.25 Lakh/Month",
    qualification: "B.Tech / B.E in CS / IT / MCA",
    experience:
      "Minimum 8 years overall experience, including at least 3 years in Government Sector",
    category: "IT",
    level: "Consultant",
  },
  {
    id: "consultant_finance",
    serialNo: 8,
    postName: "Consultant Finance",
    emoluments: "₹1.00 - ₹1.25 Lakh/Month",
    qualification:
      "Masters or PG Diploma in Business Management or equivalent in Finance / CA",
    experience:
      "Minimum 8 years overall experience, including at least 3 years in Government / Banking sector",
    category: "Finance",
    level: "Consultant",
  },
  {
    id: "jr_consultant_it",
    serialNo: 9,
    postName: "Jr. Consultant IT",
    emoluments: "₹0.75 - ₹1.00 Lakh/Month",
    qualification: "B.Tech / B.E in CS / IT / MCA",
    experience:
      "Minimum 5 years overall experience, preferably 2 years in startup ecosystem",
    category: "IT",
    level: "Junior Consultant",
  },
  {
    id: "jr_consultant_finance",
    serialNo: 10,
    postName: "Jr. Consultant Finance",
    emoluments: "₹0.75 - ₹1.00 Lakh/Month",
    qualification:
      "Masters or PG Diploma in Business Management or equivalent in Finance / CA",
    experience:
      "Minimum 5 years overall experience, preferably 2 years in startup ecosystem",
    category: "Finance",
    level: "Junior Consultant",
  },
  {
    id: "jr_consultant_legal",
    serialNo: 11,
    postName: "Jr. Consultant Legal",
    emoluments: "₹0.75 - ₹1.00 Lakh/Month",
    qualification: "LLB or Masters in Law from recognized university",
    experience:
      "Minimum 5 years overall experience, preferably 2 years in Government sector",
    category: "Legal",
    level: "Junior Consultant",
  },
  {
    id: "jr_consultant_startup",
    serialNo: 12,
    postName: "Jr. Consultant Startup",
    emoluments: "₹0.75 - ₹1.00 Lakh/Month",
    qualification:
      "B.Tech / BE / Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 5 years overall experience, preferably 2 years in startup ecosystem",
    category: "Startup",
    level: "Junior Consultant",
  },
  {
    id: "coordinator_graphics_design",
    serialNo: 13,
    postName: "Coordinator Graphics Design",
    emoluments: "₹0.50 - ₹0.75 Lakh/Month",
    qualification:
      "Bachelor's / Master's in Graphic Design, Visual Communication, Fine Arts, Media Studies, Animation, Digital Design or equivalent",
    experience:
      "Minimum 3 years overall experience, preferably 1 year in startup ecosystem / Government sector",
    category: "Design",
    level: "Coordinator",
  },
  {
    id: "coordinator_startup",
    serialNo: 14,
    postName: "Coordinator Startup",
    emoluments: "₹0.50 - ₹0.75 Lakh/Month",
    qualification:
      "B.Tech / BE / Bachelors or Masters or PG Diploma in Business Management or equivalent",
    experience:
      "Minimum 3 years overall experience, preferably 1 year in startup ecosystem",
    category: "Startup",
    level: "Coordinator",
  },
  {
    id: "coordinator_finance",
    serialNo: 15,
    postName: "Coordinator Finance",
    emoluments: "₹0.50 - ₹0.75 Lakh/Month",
    qualification:
      "Bachelors or Masters or PG Diploma in Business Management or equivalent in Finance / CA",
    experience:
      "Minimum 3 years overall experience in financial management, preferably 1 year in startup ecosystem",
    category: "Finance",
    level: "Coordinator",
  },
  {
    id: "coordinator_legal",
    serialNo: 16,
    postName: "Coordinator Legal",
    emoluments: "₹0.50 - ₹0.75 Lakh/Month",
    qualification: "LLB or Master's in Law from recognized university",
    experience:
      "Minimum 3 years overall experience, preferably 1 year in Government sector",
    category: "Legal",
    level: "Coordinator",
  },
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const CATEGORY_OPTIONS = ["General", "EWS", "BC", "EBC", "SC", "ST", "Other"];

const inputClass =
  "block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:shadow-[0_0_0_4px_rgba(148,163,184,0.12)] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500";

const labelClass = "mb-2 block text-sm font-semibold text-slate-800";

const todayIso = () => new Date().toISOString().slice(0, 10);

const normalizePhone = (value = "") =>
  String(value || "").replace(/\D/g, "").slice(0, 10);

const getPostById = (id) => SSU_POSTS.find((post) => post.id === id) || null;

const buildPostSnapshot = (post) => {
  if (!post) return null;

  return {
    id: post.id,
    serialNo: post.serialNo,
    postName: post.postName,
    emoluments: post.emoluments,
    qualification: post.qualification,
    experience: post.experience,
    category: post.category,
    level: post.level,
  };
};

const buildInitialValues = (initialValues, userSignupData) => ({
  postAppliedForId:
    initialValues?.postAppliedForId ||
    initialValues?.postEligibilitySnapshot?.id ||
    "",
  postAppliedFor: initialValues?.postAppliedFor || "",
  postEligibilitySnapshot: initialValues?.postEligibilitySnapshot || null,

  profilePhotoMeta: initialValues?.profilePhotoMeta || null,
  profilePhotoFile: null,

  fullName: initialValues?.fullName || userSignupData?.fullName || "",
  fathersName: initialValues?.fathersName || "",
  mothersName: initialValues?.mothersName || "",
  dateOfBirth: initialValues?.dateOfBirth || "",
  gender: initialValues?.gender || "",
  category: initialValues?.category || "",
  nationality: initialValues?.nationality || "Indian",

  email: initialValues?.email || userSignupData?.email || "",
  phoneNumber: initialValues?.phoneNumber || userSignupData?.phoneNumber || "",
  alternateNumber: initialValues?.alternateNumber || "",

  presentAddress: initialValues?.presentAddress || "",
  presentState: initialValues?.presentState || "Bihar",
  presentDistrict: initialValues?.presentDistrict || "",
  presentPincode: initialValues?.presentPincode || "",

  permanentAddressSameAsPresent:
    initialValues?.permanentAddressSameAsPresent !== undefined
      ? initialValues.permanentAddressSameAsPresent
      : true,

  permanentAddress: initialValues?.permanentAddress || "",
  permanentState: initialValues?.permanentState || "Bihar",
  permanentDistrict: initialValues?.permanentDistrict || "",
  permanentPincode: initialValues?.permanentPincode || "",
});

const validationSchema = Yup.object().shape({
  postAppliedForId: Yup.string().required("Post applied for is required"),

  profilePhotoMeta: Yup.mixed().nullable(),
  profilePhotoFile: Yup.mixed().nullable(),

  fullName: Yup.string().trim().required("Full name is required"),
  fathersName: Yup.string()
    .trim()
    .required("Father's / Husband's name is required"),
  mothersName: Yup.string().trim(),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  gender: Yup.string().required("Gender is required"),
  category: Yup.string().required("Category is required"),
  nationality: Yup.string().trim().required("Nationality is required"),

  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  alternateNumber: Yup.string().test(
    "alternate-phone",
    "Alternate number must be 10 digits",
    (value) => !value || /^[0-9]{10}$/.test(value)
  ),

  presentAddress: Yup.string().trim().required("Present address is required"),
  presentState: Yup.string().required("Present state is required"),
  presentDistrict: Yup.string().required("Present district is required"),
  presentPincode: Yup.string()
    .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
    .required("Present pincode is required"),

  permanentAddressSameAsPresent: Yup.boolean(),

  permanentAddress: Yup.string().when("permanentAddressSameAsPresent", {
    is: false,
    then: (schema) => schema.trim().required("Permanent address is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  permanentState: Yup.string().when("permanentAddressSameAsPresent", {
    is: false,
    then: (schema) => schema.required("Permanent state is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  permanentDistrict: Yup.string().when("permanentAddressSameAsPresent", {
    is: false,
    then: (schema) => schema.required("Permanent district is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  permanentPincode: Yup.string().when("permanentAddressSameAsPresent", {
    is: false,
    then: (schema) =>
      schema
        .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
        .required("Permanent pincode is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

function ErrorText({ name }) {
  return (
    <ErrorMessage
      name={name}
      component="div"
      className="mt-1 text-xs font-medium text-red-600"
    />
  );
}

function TextField({
  name,
  label,
  type = "text",
  placeholder,
  required,
  disabled,
  maxLength,
  as,
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>

      <Field
        as={as}
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`${inputClass} ${as === "textarea" ? "min-h-[104px] resize-none" : ""}`}
      />

      <ErrorText name={name} />
    </div>
  );
}

function SelectField({ name, label, children, required, disabled }) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>

      <Field as="select" name={name} disabled={disabled} className={inputClass}>
        {children}
      </Field>

      <ErrorText name={name} />
    </div>
  );
}

function PostEligibilityCard({ post }) {
  if (!post) return null;

  return (
    <div className="rounded-[28px] border border-indigo-100 bg-indigo-50/80 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-700 text-white">
          <FaBriefcase />
        </div>

        <div>
          <div className="text-lg font-bold text-indigo-950">
            {post.postName}
          </div>
          <div className="text-sm text-indigo-700">
            Position {post.serialNo} • {post.level} • {post.category}
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
            Emoluments
          </div>
          <div className="mt-1 text-sm font-bold text-slate-900">
            {post.emoluments}
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3 md:col-span-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
            Required Qualification
          </div>
          <div className="mt-1 text-sm font-bold leading-relaxed text-slate-900">
            {post.qualification}
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3 md:col-span-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-indigo-400">
            Required Experience
          </div>
          <div className="mt-1 text-sm font-bold leading-relaxed text-slate-900">
            {post.experience}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePhotoUpload({
  values,
  setFieldValue,
  isReadOnly,
  fileError,
  setFileError,
}) {
  const [previewUrl, setPreviewUrl] = useState("");

  const existingUrl = values?.profilePhotoMeta?.downloadURL || "";
  const selectedFile = values?.profilePhotoFile || null;

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const validatePhoto = (file) => {
    if (!file) return "Profile photo is required.";

    if (!file.type?.startsWith("image/")) {
      return "Profile photo must be an image file.";
    }

    if (file.size > 1 * 1024 * 1024) {
      return "Profile photo must be 1 MB or less.";
    }

    return "";
  };

  const handleFile = (file) => {
    const error = validatePhoto(file);

    if (error) {
      setFileError(error);
      return;
    }

    setFileError("");
    setFieldValue("profilePhotoFile", file);
    setFieldValue("profilePhotoMeta", null);
  };

  const removePhoto = () => {
    setFileError("");
    setFieldValue("profilePhotoFile", null);
    setFieldValue("profilePhotoMeta", null);
  };

  const visibleUrl = previewUrl || existingUrl;

  return (
    <div className="rounded-[28px] border border-slate-100 bg-slate-50/80 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <FaCamera />
        </div>

        <div>
          <div className="text-lg font-bold text-slate-900">
            Profile Photo <span className="text-red-500">*</span>
          </div>
          <div className="text-sm text-slate-500">
            Upload a clear passport-style image. Maximum file size: 1 MB.
          </div>
        </div>
      </div>

      {visibleUrl ? (
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <img
            src={visibleUrl}
            alt="Profile preview"
            className="h-32 w-32 rounded-3xl border border-slate-200 bg-white object-cover"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <FaCheckCircle />
              {selectedFile ? "Photo selected" : "Photo uploaded"}
            </div>

            <div className="mt-1 break-all text-sm text-slate-600">
              {selectedFile?.name ||
                values?.profilePhotoMeta?.fileName ||
                "Profile photo"}
            </div>

            {!isReadOnly ? (
              <button
                type="button"
                onClick={removePhoto}
                className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
              >
                <FaTimes />
                Remove / Replace
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center transition hover:bg-slate-100">
          <FaCloudUploadAlt className="text-3xl text-slate-400" />

          <div className="mt-3 text-sm font-semibold text-slate-800">
            Upload Profile Photo
          </div>

          <div className="mt-1 text-xs text-slate-500">
            JPG, PNG, WEBP. Maximum 1 MB.
          </div>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={isReadOnly}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}

      {fileError ? (
        <div className="mt-2 text-xs font-medium text-red-600">{fileError}</div>
      ) : null}
    </div>
  );
}

export default function SSUPersonalDetailsStep({
  onSubmit,
  onPrevious,
  initialValues,
  userSignupData,
  isReadOnly = false,
}) {
  const [fileError, setFileError] = useState("");

  const formInitialValues = useMemo(
    () => buildInitialValues(initialValues, userSignupData),
    [initialValues, userSignupData]
  );

  const stateOptions = useMemo(() => Object.keys(stateDistrictData || {}), []);

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setStatus("");
    setFileError("");

    const selectedPost = getPostById(values.postAppliedForId);

    if (!selectedPost) {
      setStatus("Please select a valid post.");
      setSubmitting(false);
      return;
    }

    if (!values.profilePhotoMeta?.downloadURL && !values.profilePhotoFile) {
      setFileError("Profile photo is required.");
      setSubmitting(false);
      return;
    }

    const cleaned = {
      ...values,

      postAppliedForId: selectedPost.id,
      postAppliedFor: selectedPost.postName,
      postEligibilitySnapshot: buildPostSnapshot(selectedPost),

      fullName: String(values.fullName || "").trim().replace(/\s+/g, " "),
      fathersName: String(values.fathersName || "")
        .trim()
        .replace(/\s+/g, " "),
      mothersName: String(values.mothersName || "")
        .trim()
        .replace(/\s+/g, " "),
      email: String(values.email || "").trim().toLowerCase(),
      phoneNumber: normalizePhone(values.phoneNumber),
      alternateNumber: normalizePhone(values.alternateNumber),
      presentAddress: String(values.presentAddress || "").trim(),

      permanentAddress: values.permanentAddressSameAsPresent
        ? String(values.presentAddress || "").trim()
        : String(values.permanentAddress || "").trim(),
      permanentState: values.permanentAddressSameAsPresent
        ? values.presentState
        : values.permanentState,
      permanentDistrict: values.permanentAddressSameAsPresent
        ? values.presentDistrict
        : values.permanentDistrict,
      permanentPincode: values.permanentAddressSameAsPresent
        ? values.presentPincode
        : values.permanentPincode,

      updatedAtIso: new Date().toISOString(),
    };

    const result = await onSubmit?.(cleaned);

    if (result?.ok === false) {
      setStatus(result.error || "Could not save personal details.");
    }

    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 rounded-[32px] border border-white/80 bg-white/78 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <FaUser />
              Step 2
            </div>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Personal Details
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
              Select the post as per ToR, upload profile photo, and fill
              applicant profile/contact/address details.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
            <div className="font-semibold text-slate-800">
              Application Profile
            </div>
            <div className="mt-1">
              Post eligibility snapshot will be saved with the application.
            </div>
          </div>
        </div>
      </div>

      <Formik
        initialValues={formInitialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, status, setFieldValue }) => {
          const presentDistricts = stateDistrictData?.[values.presentState] || [];
          const permanentDistricts =
            stateDistrictData?.[values.permanentState] || [];

          const selectedPost = getPostById(values.postAppliedForId);

          useEffect(() => {
            if (
              values.presentState &&
              values.presentDistrict &&
              !presentDistricts.includes(values.presentDistrict)
            ) {
              setFieldValue("presentDistrict", "");
            }
          }, [values.presentState]);

          useEffect(() => {
            if (
              values.permanentState &&
              values.permanentDistrict &&
              !permanentDistricts.includes(values.permanentDistrict)
            ) {
              setFieldValue("permanentDistrict", "");
            }
          }, [values.permanentState]);

          return (
            <Form className="space-y-6">
              <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <FaBriefcase />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Post Applied For
                    </h3>
                    <p className="text-sm text-slate-500">
                      Select one contractual position from the ToR list.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5">
                  <SelectField
                    name="postAppliedForId"
                    label="Post Applied For"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">Select Post</option>
                    {SSU_POSTS.map((post) => (
                      <option key={post.id} value={post.id}>
                        {post.serialNo}. {post.postName} ({post.emoluments})
                      </option>
                    ))}
                  </SelectField>

                  <PostEligibilityCard post={selectedPost} />
                </div>
              </div>

              <ProfilePhotoUpload
                values={values}
                setFieldValue={setFieldValue}
                isReadOnly={isReadOnly}
                fileError={fileError}
                setFileError={setFileError}
              />

              <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <FaIdBadge />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Applicant Information
                    </h3>
                    <p className="text-sm text-slate-500">
                      Basic identity details
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <TextField
                    name="fullName"
                    label="Full Name"
                    placeholder="Applicant full name"
                    required
                    disabled={isReadOnly}
                  />

                  <TextField
                    name="fathersName"
                    label="Father's / Husband's Name"
                    placeholder="Enter name"
                    required
                    disabled={isReadOnly}
                  />

                  <TextField
                    name="mothersName"
                    label="Mother's Name"
                    placeholder="Enter mother's name"
                    disabled={isReadOnly}
                  />

                  <TextField
                    name="dateOfBirth"
                    label="Date of Birth"
                    type="date"
                    required
                    disabled={isReadOnly}
                    max={todayIso()}
                  />

                  <SelectField
                    name="gender"
                    label="Gender"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">Select Gender</option>
                    {GENDER_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </SelectField>

                  <SelectField
                    name="category"
                    label="Category"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">Select Category</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </SelectField>

                  <TextField
                    name="nationality"
                    label="Nationality"
                    placeholder="Indian"
                    required
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-700 text-white">
                    <FaUser />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Contact Details
                    </h3>
                    <p className="text-sm text-slate-500">
                      Primary details are copied from signup
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    required
                    disabled={isReadOnly}
                  />

                  <TextField
                    name="phoneNumber"
                    label="Mobile Number"
                    required
                    disabled={isReadOnly}
                    maxLength={10}
                  />

                  <TextField
                    name="alternateNumber"
                    label="Alternate Mobile Number"
                    placeholder="Optional"
                    disabled={isReadOnly}
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="rounded-[32px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Address Details
                    </h3>
                    <p className="text-sm text-slate-500">
                      Present and permanent address
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <TextField
                      name="presentAddress"
                      label="Present Address"
                      placeholder="House no., street, locality"
                      required
                      disabled={isReadOnly}
                      as="textarea"
                    />
                  </div>

                  <SelectField
                    name="presentState"
                    label="Present State"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">Select State</option>
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </SelectField>

                  <SelectField
                    name="presentDistrict"
                    label="Present District"
                    required
                    disabled={isReadOnly}
                  >
                    <option value="">Select District</option>
                    {presentDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </SelectField>

                  <TextField
                    name="presentPincode"
                    label="Present Pincode"
                    required
                    disabled={isReadOnly}
                    maxLength={6}
                  />

                  <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <Field
                      type="checkbox"
                      name="permanentAddressSameAsPresent"
                      disabled={isReadOnly}
                      className="mt-1 h-4 w-4 rounded border-slate-300"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      Permanent address is same as present address
                    </span>
                  </label>

                  {!values.permanentAddressSameAsPresent ? (
                    <>
                      <div className="md:col-span-2">
                        <TextField
                          name="permanentAddress"
                          label="Permanent Address"
                          placeholder="House no., street, locality"
                          required
                          disabled={isReadOnly}
                          as="textarea"
                        />
                      </div>

                      <SelectField
                        name="permanentState"
                        label="Permanent State"
                        required
                        disabled={isReadOnly}
                      >
                        <option value="">Select State</option>
                        {stateOptions.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </SelectField>

                      <SelectField
                        name="permanentDistrict"
                        label="Permanent District"
                        required
                        disabled={isReadOnly}
                      >
                        <option value="">Select District</option>
                        {permanentDistricts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </SelectField>

                      <TextField
                        name="permanentPincode"
                        label="Permanent Pincode"
                        required
                        disabled={isReadOnly}
                        maxLength={6}
                      />
                    </>
                  ) : null}
                </div>
              </div>

              {status ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {status}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 rounded-[28px] border border-white/80 bg-white/82 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={onPrevious}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  <FaArrowLeft />
                  Back
                </button>

                {!isReadOnly ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60"
                  >
                    {isSubmitting ? "Saving..." : "Save & Continue"}
                    <FaArrowRight />
                  </button>
                ) : null}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}