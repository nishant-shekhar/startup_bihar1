import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import CropperModal from "../../../Utils/CropperDialogBox";

const ShowcasePopup = ({
  isVisible,
  onClose,
  setTitle,
  setSubtitle,
  setButtonVisible,
  setStatusPopup,
  setIsSuccess,
  setIsPopupVisible,
  openFileSelector,
  fileInputRef,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [rawImage, setRawImage] = useState(null); // data URL for cropper
  const handleCropComplete = (blob, setFieldValue) => {
    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    setFieldValue("imgUrl", file);
    setPreviewUrl(URL.createObjectURL(blob));
    setPhotoName("cropped.jpg");
  };


  const handleClose = () => {
    setPreviewUrl(null);
    setPhotoName("");
    onClose();
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>

      {/* Popup */}
      <div className="relative w-full max-w-lg bg-white bg-opacity-80 backdrop-filter backdrop-blur-md border border-white border-opacity-30 rounded-lg shadow-lg p-6 sm:p-8 z-10">
        {/* Close */}
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-xl"
          aria-label="Close"
          onClick={handleClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Add New Showcase</h2>

        <Formik
          initialValues={{
            title: "",
            subtitle: "",
            date: "",
            location: "",
            projectLink: "",
            imgUrl: null,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.title) errors.title = "Required";
            if (!values.subtitle) errors.subtitle = "Required";
            if (!values.date) errors.date = "Required";
            if (!values.location) errors.location = "Required";
            if (!values.imgUrl) errors.imgUrl = "Photo is required";
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTitle("Uploading Showcase Details");
            setSubtitle("Please wait while we post your update");
            setButtonVisible(false);
            setStatusPopup(true);
            setIsSuccess("uploading");

            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("subtitle", values.subtitle);
            formData.append("date", values.date);
            formData.append("projectLink", values.projectLink);
            formData.append("location", values.location);
            formData.append("picUrl", values.imgUrl);

            axios
              .post("https://startupbihar.in/api/showcase/post", formData, {
                headers: { Authorization: token },
              })
              .then((res) => {
                setIsPopupVisible(false);
                setTitle("Showcase Uploaded!");
                setSubtitle(res.data.message);
                setButtonVisible(true);
                setIsSuccess("success");
                setSubmitting(false);
                setPreviewUrl(null);
                setPhotoName("");
              })
              .catch((err) => {
                setTitle("Uploading Failed");
                setSubtitle(
                  err.response?.data?.error || "An error occurred during submission"
                );
                setButtonVisible(true);
                setIsSuccess("failed");
                setSubmitting(false);
              });
          }}
        >
          {({ isSubmitting, setFieldValue, errors, touched }) => (
            <Form className="space-y-4">
              {/* File Upload */}
              <div>
                <div className="text-sm font-medium mb-2">Upload Showcase Image</div>
                <div className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-300">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">{photoName || "No file selected"}</span>
                    {errors.imgUrl && touched.imgUrl && (
                      <span className="text-red-500 text-xs ml-2">{errors.imgUrl}</span>
                    )}
                  </div>
                  {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded object-cover" />
                  )}
                  <button
                    type="button"
                    className="text-indigo-600 hover:underline ml-4 text-sm"
                    onClick={() => {
                      fileInputRef.current.value = null;
                      openFileSelector();
                    }}
                  >
                    Add Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      if (file.size > 2*1024 * 1024) {
                        alert("File size must not exceed 2 MB.");
                        e.target.value = "";
                        return;
                      }

                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setRawImage(reader.result);
                        setCropModalVisible(true);
                      };
                      reader.readAsDataURL(file);
                    }}

                  />
                </div>
              </div>

              {/* Fields */}
              {["title", "subtitle", "date", "location", "projectLink"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-semibold capitalize mb-1" htmlFor={field}>
                    {field === "projectLink" ? "Project Link" : field}
                  </label>
                  <Field
                    id={field}
                    name={field}
                    type={field === "date" ? "date" : "text"}
                    max={field === "date" ? new Date().toISOString().split("T")[0] : undefined}
                    placeholder={`Enter ${field}`}
                    className="w-full border rounded px-3 py-2 text-sm text-gray-700"
                  />
                  <ErrorMessage name={field}>
                    {(msg) => <div className="text-red-500 text-xs">{msg}</div>}
                  </ErrorMessage>
                </div>
              ))}

              {/* Submit */}
              <div className="pt-4 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
              {cropModalVisible && (
                <CropperModal
                  imageSrc={rawImage}
                  onClose={() => setCropModalVisible(false)}
                  onCropComplete={(blob) => handleCropComplete(blob, setFieldValue)}
                />
              )}
            </Form>
          )}
        </Formik>
      </div>


    </div>
  );
};

export default ShowcasePopup;
