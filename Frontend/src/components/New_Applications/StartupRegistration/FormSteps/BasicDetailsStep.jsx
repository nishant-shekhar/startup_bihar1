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

const BasicDetailsStep = ({ onSubmit, initialValues }) => {
  const [profileImageUrl, setProfileImageUrl] = useState("person.png");
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
    const croppedImageUrl = await getCroppedImg(selectedFile, croppedAreaPixels);
    setProfileImageUrl(croppedImageUrl);
    setShowCropper(false);

    const blob = await fetch(croppedImageUrl).then((res) => res.blob());
    const file = new File([blob], "profile-photo.jpg", { type: "image/jpeg" });

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
          fullName: "",
          gender: "",
          category: "",
          dateOfBirth: "",
          qualification: "",
          profilePhoto: null,
          district: "",
        }
      }
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        const age = calculateAge(formik.values.dateOfBirth);
        const maxDobStr = dateToYMD(cutoffDate);

        return (
          <Form className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-800">
                  Basic Details
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
    onClick={() => fileInputRef.current && fileInputRef.current.click()}
  />
  <input
    type="file"
    ref={fileInputRef}
    style={{ display: "none" }}
    accept="image/*"
    onChange={handleFileChange}
  />
  <p className="text-sm text-gray-500 mt-2">
    Click on image to upload profile photo
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
                {renderField({
                  name: "fullName",
                  label: "Full Name",
                  required: true,
                })}

                {renderField({
                  name: "gender",
                  label: "Gender",
                  as: "select",
                  options: genderOptions,
                  required: true,
                })}

                {renderField({
                  name: "category",
                  label: "Category",
                  as: "select",
                  options: categoryOptions,
                  required: true,
                })}

                {/* Custom DOB with age display and 18+ constraint */}
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block mb-2 text-sm font-semibold text-gray-900"
                  >
                    Date of Birth{" "}
                    {age !== null && (
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          age >= 18
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        Age: {age} yrs
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

                {renderField({
                  name: "qualification",
                  label: "Qualification",
                  as: "select",
                  options: qualificationOptions,
                  required: true,
                })}

                {renderField({
                  name: "district",
                  label: "District",
                  as: "select",
                  options: [
                    "Araria",
                    "Arwal",
                    "Aurangabad",
                    "Banka",
                    "Begusarai",
                    "Bhagalpur",
                    "Bhojpur",
                    "Buxar",
                    "Darbhanga",
                    "East Champaran",
                    "Gaya",
                    "Gopalganj",
                    "Jamui",
                    "Jehanabad",
                    "Kaimur",
                    "Katihar",
                    "Khagaria",
                    "Kishanganj",
                    "Lakhisarai",
                    "Madhepura",
                    "Madhubani",
                    "Munger",
                    "Muzaffarpur",
                    "Nalanda",
                    "Nawada",
                    "Patna",
                    "Purnia",
                    "Rohtas",
                    "Saharsa",
                    "Samastipur",
                    "Saran",
                    "Sheikhpura",
                    "Sheohar",
                    "Sitamarhi",
                    "Siwan",
                    "Supaul",
                    "Vaishali",
                    "West Champaran",
                  ],
                  required: true,
                })}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => onPrevious(formik.values)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Previous
              </button>
              
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                Save & Continue
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default BasicDetailsStep;
