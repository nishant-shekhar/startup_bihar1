import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

/**
 * ShowcasePopup
 * 
 * Props:
 * - isVisible           : Boolean to control visibility of the popup
 * - onClose             : Function to close the popup
 * - setTitle            : Sets title in the StatusDialog
 * - setSubtitle         : Sets subtitle in the StatusDialog
 * - setButtonVisible    : Toggles visibility of the button in the StatusDialog
 * - setStatusPopup      : Toggles the StatusDialog itself
 * - setIsSuccess        : Sets status ("success", "failed", "uploading") for the StatusDialog
 * - setIsPopupVisible   : Toggles this popup
 * - uploadedFileName    : Name of the uploaded file
 * - openFileSelector    : Function to open file selector
 * - fileInputRef        : useRef for the hidden file input
 * - handleFileChange    : Handler for file selection
 */
const ShowcasePopup = ({
  isVisible,
  onClose,
  setTitle,
  setSubtitle,
  setButtonVisible,
  setStatusPopup,
  setIsSuccess,
  setIsPopupVisible,
  uploadedFileName,
  openFileSelector,
  fileInputRef,
  handleFileChange,
}) => {
  // Add local state for previewing the image
  const [previewUrl, setPreviewUrl] = useState(null);
  const [photoName, setPhotoName] = useState("");

  // Intercept the close to also reset local state
  const handleClose = () => {
    // Reset local states
    setPreviewUrl(null);
    setPhotoName("");
    // Also call parent's onClose
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-10"></div>

      {/* Popup Container */}
      <div className="relative bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 w-5/12 p-8 rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={handleClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4">Add New Showcase</h2>

        <Formik
          initialValues={{
            title: "",
            subtitle: "",
            date: "",
            location: "",
            projectLink: "",
            imgUrl: null, // We'll store the File object here
          }}
          // Validate that the fields — including photo — are required
          validate={(values) => {
            const errors = {};

            if (!values.title) {
              errors.title = "Required";
            }
            if (!values.subtitle) {
              errors.subtitle = "Required";
            }
            if (!values.date) {
              errors.date = "Required";
            }
            if (!values.location) {
              errors.location = "Required";
            }
            if (!values.imgUrl) {
              errors.imgUrl = "Photo is required";
            }

            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            // Show the uploading status
            setTitle("Uploading Showcase Details");
            setSubtitle("Please wait while we post your update");
            setButtonVisible(false);
            setStatusPopup(true);
            setIsSuccess("uploading");

            const token = localStorage.getItem("token");
            console.log("Using token:", token);

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("subtitle", values.subtitle);
            formData.append("date", values.date);
            formData.append("projectLink", values.projectLink);
            formData.append("location", values.location);
            if (values.imgUrl) {
              formData.append("picUrl", values.imgUrl);
            }

            axios
              .post("https://startupbihar.in/api/showcase/post", formData, {
                headers: {
                  Authorization: token, // Include the token in the request headers
                },
              })
              .then((response) => {
                console.log("Data posted successfully:", response.data);
                setSubmitting(false);

                // Close this popup
                setIsPopupVisible(false);

                // Show success in your StatusDialog
                setTitle("Showcase Uploaded!");
                setSubtitle(response.data.message);
                setButtonVisible(true);
                setIsSuccess("success");

                // Reset local preview
                setPreviewUrl(null);
                setPhotoName("");
              })
              .catch((error) => {
                console.error("Error posting data:", error);
                setSubmitting(false);

                // Show error in your StatusDialog
                setTitle("Uploading Failed");
                setSubtitle(
                  error.response?.data?.error ||
                    "An error occurred during submission"
                );
                setButtonVisible(true);
                setIsSuccess("failed");
              });
          }}
        >
          {({ isSubmitting, setFieldValue, errors, touched }) => (
            <Form className="rounded-lg w-full p-6">
              {/* File Upload Section */}
              <div className="mb-4">
                <div className="py-4">
                  <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <ul className="divide-y divide-gray-100 rounded-md border border-gray-200 w-5/6">
                      <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6 bg-white rounded-md">
                        <div className="flex w-0 flex-1 items-center gap-2">
                          <svg
                            className="h-5 w-5 shrink-0 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <div className="flex flex-col">
                            <span className="truncate font-medium">
                              Upload Showcase Image
                            </span>
                            {/* If there's an error for the photo, show it */}
                            {errors.imgUrl && touched.imgUrl && (
                              <span className="text-red-600 text-xs italic">
                                {errors.imgUrl}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-4">
                          {/* Thumbnail Preview */}
                          {previewUrl && (
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-12 h-12 object-cover rounded border"
                            />
                          )}

                          {/* Upload Button */}
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-900"
                            onClick={async () => {
                              // Clear any existing file if user reopens the selector
                              fileInputRef.current.value = null;
                              openFileSelector();
                            }}
                          >
                            Upload
                          </button>

                          {/* Hidden Input */}
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files[0];
                              if (!file) return;

                              // Check the size (1 MB = 1 * 1024 * 1024 bytes)
                              if (file.size > 1 * 1024 * 1024) {
                                alert("File size must not exceed 1 MB.");
                                // Reset the file input
                                event.target.value = "";
                                setFieldValue("imgUrl", null);
                                setPreviewUrl(null);
                                setPhotoName("");
                                return;
                              }

                              setFieldValue("imgUrl", file);
                              setPhotoName(file.name);

                              // Generate a temporary local URL for preview
                              const localPreview = URL.createObjectURL(file);
                              setPreviewUrl(localPreview);
                            }}
                          />
                        </div>
                      </li>
                    </ul>
                    {/* Show the file name if any */}
                    {photoName && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected file: {photoName}
                      </p>
                    )}
                  </dd>
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-md font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter title"
                  className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              {/* Subtitle */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-md font-bold mb-2"
                  htmlFor="subtitle"
                >
                  Subtitle
                </label>
                <Field
                  id="subtitle"
                  name="subtitle"
                  type="text"
                  placeholder="Enter subtitle"
                  className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="subtitle"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              {/* Date */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-md font-bold mb-2"
                  htmlFor="date"
                >
                  Date
                </label>
                <Field
                  id="date"
                  name="date"
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  placeholder="Select the date"
                  className="border rounded-md w-5/6 py-2 px-3 text-base text-gray-500 sm:text-sm/6"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              {/* Location */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-md font-bold mb-2"
                  htmlFor="location"
                >
                  Location
                </label>
                <Field
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Enter Location"
                  className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="location"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              {/* Project Link */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-md font-bold mb-2"
                  htmlFor="projectLink"
                >
                  Project Link
                </label>
                <Field
                  id="projectLink"
                  name="projectLink"
                  type="text"
                  placeholder="Enter Project Link"
                  className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <ErrorMessage
                  name="projectLink"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between mt-6">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ShowcasePopup;
