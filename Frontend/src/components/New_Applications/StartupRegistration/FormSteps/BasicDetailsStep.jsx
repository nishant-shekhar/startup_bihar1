import React, { useState, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FaArrowLeft } from "react-icons/fa";
import {
  renderField,
  qualificationOptions,
  categoryOptions,
  genderOptions,
} from "./FormFieldUtils";
import Cropper from "react-easy-crop";

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

  const handleCropSave = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(selectedFile, croppedAreaPixels);
      setProfileImageUrl(croppedImageUrl);
      setShowCropper(false);

      fetch(croppedImageUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "profile-photo.jpg", {
            type: "image/jpeg",
          });
          formik.setFieldValue("profilePhoto", file);
        });
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    gender: Yup.string().required("Gender is required"),
    category: Yup.string().required("Category is required"),
    dateOfBirth: Yup.date().required("Date of birth is required"),
    qualification: Yup.string().required("Qualification is required"),
  });

  return (
    <Formik
      initialValues={
        initialValues || {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          gender: "",
          category: "",
          dateOfBirth: "",
          qualification: "",
          profilePhoto: null,
        }
      }
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className="flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FaArrowLeft className="text-gray-600" />
              <h1 className="text-xl font-semibold text-gray-800">Basic Details</h1>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>

          <hr className="mb-4 border-gray-300" />

          {/* Scrollable Content */}
          <div className="overflow-y-auto pr-1 flex-1">
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
                    onClick={() => handleCropSave()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded"
                    type="button"
                  >
                    Save Crop
                  </button>
                </div>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderField({ name: "firstName", label: "First Name", required: true })}
              {renderField({ name: "lastName", label: "Last Name", required: true })}
              {renderField({
                name: "email",
                label: "Email",
                type: "email",
                required: true,
              })}
              {renderField({
                name: "phoneNumber",
                label: "Phone Number (Preferred Whatsapp)",
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
              {renderField({
                name: "dateOfBirth",
                label: "Date of Birth",
                type: "date",
                required: true,
              })}
              {renderField({
                name: "qualification",
                label: "Qualification",
                as: "select",
                options: qualificationOptions,
                required: true,
              })}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BasicDetailsStep;
