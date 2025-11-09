import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  renderField,
  qualificationOptions,
  categoryOptions,
  genderOptions,
} from "./FormFieldUtils";
import Cropper from "react-easy-crop";
import stateDistrictData from "./stateDistrictData.json";
import { useLanguage } from "../LanguageContext";

// --- helpers for image crop ---
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

// --- date + age helpers ---
const dateToYMD = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const cutoffDate = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18); // must be at least 18
  return d;
})();

// Institution options
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

const calculateAge = (dobStr) => {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (isNaN(dob)) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
};

const BasicDetailsStep = ({ onSubmit, initialValues, userSignupData }) => {
  const { t } = useLanguage();

  // Default user SVG as data URL
  const defaultUserSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239ca3af'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E`;

  // Get founder name from userSignup data
  const founderName = userSignupData?.founderName || "";

  const [profileImageUrl, setProfileImageUrl] = useState(defaultUserSVG);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1048576) {
        alert("File size exceeds the 1 MB limit");
        return;
      }
      setSelectedFile(URL.createObjectURL(file));
      setShowCropper(true);
    }
  };

  // keep this function OUTSIDE Formik render, but accept setters
  const handleCropSave = async (
    selectedFile,
    croppedAreaPixels,
    setProfileImageUrl,
    setShowCropper,
    setFieldValue,
    setFieldTouched
  ) => {
    try {
      const croppedImageUrl = await getCroppedImg(
        selectedFile,
        croppedAreaPixels
      );
      setProfileImageUrl(croppedImageUrl);
      setShowCropper(false);

      const blob = await fetch(croppedImageUrl).then((res) => res.blob());
      const file = new File([blob], "profile-photo.jpg", {
        type: "image/jpeg",
      });

      // ✅ set the Formik field and mark it touched so validation clears
      setFieldValue("profilePhoto", file);
      setFieldTouched("profilePhoto", true, false);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full name is required"),
    gender: Yup.string().required("Gender is required"),
    category: Yup.string().required("Category is required"),
    dateOfBirth: Yup.date()
      .typeError("Invalid date")
      .max(cutoffDate, "You must be at least 18 years old")
      .required("Date of birth is required"),
    qualification: Yup.string().required("Qualification is required"),
    institution: Yup.string().required("Institution is required"),
    otherInstitution: Yup.string().when("institution", {
      is: "Other",
      then: (schema) => schema.required("Please specify the institution name"),
      otherwise: (schema) => schema.notRequired(),
    }),
    linkedinProfile: Yup.string()
      .url("Please enter a valid URL")
      .matches(
        /^https?:\/\/(www\.)?linkedin\.com\/.*$/,
        "Please enter a valid LinkedIn profile URL"
      )
      .nullable(),
    state: Yup.string().required("State is required"),
    district: Yup.string().required("District is required"),
    profilePhoto: Yup.mixed()
      .required("Profile photo is required")
      .test("fileSize", "File size should be less than 1MB", (value) => {
        return !value || (value && value.size <= 1048576);
      }),
  });

  return (
    <Formik
      initialValues={
        initialValues || {
          fullName: founderName,
          gender: "",
          category: "",
          dateOfBirth: "",
          qualification: "",
          institution: "",
          otherInstitution: "",
          linkedinProfile: "",
          profilePhoto: null,
          state: "",
          district: "",
        }
      }
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        const age = calculateAge(formik.values.dateOfBirth);
        const maxDobStr = dateToYMD(cutoffDate);

        // Get available districts based on selected state
        const availableDistricts = formik.values.state
          ? stateDistrictData[formik.values.state] || []
          : [];

        // Get all states as options
        const stateOptions = Object.keys(stateDistrictData);

        return (
          <Form className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-800">
                  {t("basicDetails.title")}
                </h1>
              </div>
            </div>

            <hr className="mb-4 border-gray-300" />

            {/* Scrollable Content */}
            <div className="overflow-y-auto pr-1 flex-1">
              {/* Profile Image Upload */}
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-6">
                <img
                  alt="Profile"
                  src={profileImageUrl}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-400 shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {t("basicDetails.uploadPhoto")}
                </p>
                <ErrorMessage
                  name="profilePhoto"
                  component="p"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              {/* Cropper */}
              {showCropper && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
                  <div className="relative w-80 h-80 bg-white p-4">
                    <Cropper
                      image={selectedFile}
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      cropShape="round"
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={(croppedArea, croppedAreaPixels) =>
                        setCroppedAreaPixels(croppedAreaPixels)
                      }
                    />
                  </div>
                  <div className="w-80 my-4">
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowCropper(false)}
                      className="px-4 py-2 bg-gray-300 rounded"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded"
                      onClick={() =>
                        handleCropSave(
                          selectedFile,
                          croppedAreaPixels,
                          setProfileImageUrl,
                          setShowCropper,
                          formik.setFieldValue,
                          formik.setFieldTouched
                        )
                      }
                    >
                      Save Crop
                    </button>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name - Pre-filled and disabled */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("basicDetails.fullName")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="fullName"
                    id="fullName"
                    disabled
                    className="bg-gray-100 border border-gray-400 text-gray-500 rounded-2xl block w-full p-2.5 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("basicDetails.nameFromRegistration")}
                  </p>
                  <ErrorMessage
                    name="fullName"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("basicDetails.gender")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    id="gender"
                    className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  >
                    <option value="">{t("common.select")}</option>
                    <option value="Male">{t("basicDetails.male")}</option>
                    <option value="Female">{t("basicDetails.female")}</option>
                    <option value="Other">{t("basicDetails.other")}</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="category"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("basicDetails.category")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="category"
                    id="category"
                    className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  >
                    <option value="">{t("common.select")}</option>
                    <option value="General">{t("basicDetails.general")}</option>
                    <option value="OBC">{t("basicDetails.obc")}</option>
                    <option value="SC">{t("basicDetails.sc")}</option>
                    <option value="ST">{t("basicDetails.st")}</option>
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Custom DOB with age display and 18+ constraint */}
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("basicDetails.dateOfBirth")}{" "}
                    {age !== null && (
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          age >= 18
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {t("basicDetails.age")}: {age} {t("basicDetails.years")}
                      </span>
                    )}
                  </label>
                  <Field
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    max={maxDobStr} // cannot select a date that makes age < 18
                    className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 ${
                      formik.errors.dateOfBirth && formik.touched.dateOfBirth
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="dateOfBirth"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    You must be at least 18 years old.
                  </p>
                </div>

                {/* Qualification */}
                <div>
                  <label
                    htmlFor="qualification"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("basicDetails.qualification")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="qualification"
                    id="qualification"
                    className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5"
                  >
                    <option value="">{t("common.select")}</option>
                    {qualificationOptions.map((qual) => (
                      <option key={qual} value={qual}>
                        {qual}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="qualification"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Institution Dropdown */}
                <div>
                  <label
                    htmlFor="institution"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("basicDetails.institution")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="institution"
                    id="institution"
                    className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 ${
                      formik.errors.institution && formik.touched.institution
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">
                      {t("basicDetails.selectInstitution")}
                    </option>
                    {institutionOptions.map((institution) => (
                      <option key={institution} value={institution}>
                        {institution}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="institution"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* Other Institution Input (shows only if "Other" selected) */}
                {formik.values.institution === "Other" && (
                  <div>
                    <label
                      htmlFor="otherInstitution"
                      className="block mb-2 text-sm font-semibold text-gray-900"
                    >
                      {t("basicDetails.otherInstitution")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="otherInstitution"
                      id="otherInstitution"
                      placeholder={t("basicDetails.otherInstitution")}
                      className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 ${
                        formik.errors.otherInstitution &&
                        formik.touched.otherInstitution
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="otherInstitution"
                      component="p"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>
                )}

                {/* LinkedIn Profile */}
                <div>
                  <label
                    htmlFor="linkedinProfile"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("basicDetails.linkedinProfile")}
                  </label>
                  <Field
                    type="url"
                    name="linkedinProfile"
                    id="linkedinProfile"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 ${
                      formik.errors.linkedinProfile &&
                      formik.touched.linkedinProfile
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  <ErrorMessage
                    name="linkedinProfile"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* State Dropdown */}
                <div>
                  <label
                    htmlFor="state"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("basicDetails.state")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="state"
                    id="state"
                    className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 ${
                      formik.errors.state && formik.touched.state
                        ? "border-red-500"
                        : ""
                    }`}
                    onChange={(e) => {
                      formik.setFieldValue("state", e.target.value);
                      // Reset district when state changes
                      formik.setFieldValue("district", "");
                    }}
                  >
                    <option value="">
                      {t("common.select")} {t("basicDetails.state")}
                    </option>
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="state"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>

                {/* District Dropdown */}
                <div>
                  <label
                    htmlFor="district"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    {t("basicDetails.district")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="district"
                    id="district"
                    disabled={!formik.values.state}
                    className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 ${
                      formik.errors.district && formik.touched.district
                        ? "border-red-500"
                        : ""
                    } ${
                      !formik.values.state
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <option value="">
                      {formik.values.state
                        ? t("basicDetails.selectDistrict")
                        : t("common.select") +
                          " " +
                          t("basicDetails.state") +
                          " First"}
                    </option>
                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="district"
                    component="p"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => onPrevious(formik.values)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                {t("common.previous")}
              </button>

              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                {t("common.saveAndContinue")}
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default BasicDetailsStep;
