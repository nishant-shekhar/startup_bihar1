import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import StatusDialog from "./StatusDialog";

const Incubation = ({onFormSubmitSuccess}) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogStatus, setDialogStatus] = useState({ isVisible: false, title: "", subtitle: "", buttonVisible: false, status: "" });

  // Validation schema using Yup
  const validationSchema = Yup.object({
    preference1: Yup.string().required("Select your first preference"),
    preference2: Yup.string().required("Select your second preference"),
    preference3: Yup.string().required("Select your third preference"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      preference1: "",
      preference2: "",
      preference3: "",
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await axios.post(
          "https://startupbihar.in/api/incubation",
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`, // Add your token here
            },
          }
        );
        setSuccessMessage("Application submitted successfully!");
        setDialogStatus({
          isVisible: true,
          title: "Form submitted successfully!",
          subtitle: `Your form has been submitted successfully.`,
          buttonVisible: true,
          actionButton: "Ok Thanks",
          status: "success",
        });
        setErrorMessage("");
        resetForm();
      } catch (error) {
        setSuccessMessage("");
        setErrorMessage(
          error.response?.data?.error || "Failed to submit application."
        );
        setDialogStatus({
          isVisible: true,
          title: "Some Error occur",
          subtitle: `An error occurred during submission`,
          buttonVisible: true,
          status: "failed",
          actionButton: "Retry Later",

        });
        console.error("Error submitting application:", error.message);
      }
    },
  });

  const goBacktoHome = () => {
    setDialogStatus({ ...dialogStatus, isVisible: false })
    console.log("navigate to home")
    onFormSubmitSuccess();
  }

  // Incubation center list
  const incubationCenters = [
    "Chandragupt Institute of Management (CIMP) Patna",
    "Indian Institute of Technology (IIT), Patna",
    "Birla Institute of Technology (BIT), Patna",
    "Bihar Agricultural University (BAU), SABOUR, Bhagalpur",
    "Central Institute of Petrochemicals Engineering & Technology (CIPET), Hajipur",
    "Tool Room & Training Centre (TRTC)",
    "Dr. Rajendra Prasad Central Agricultural University (PUSA), Samastipur",
    "Amity University (AMITY), Patna",
    "Muzaffarpur Institute of Technology (MIT), Muzaffarpur",
    "Development Management Institute (DMI), Patna",
    "National Institute of Electronics & Information Technology (NIELIT), Patna",
    "Chanakya National Law University (CNLU), Patna",
    "National Institute of Technology (NIT), Patna",
    "Footwear Design and Development Institute (FDDI), Patna",
    "Upendra Maharathi Shilp Anusandhan Sansthan (UMSAS), Patna",
    "Indian Institute of Information Technology (IIIT), Bhagalpur",
    "Darbhanga College of Engineering (DCE), Darbhanga",
    "Indian Institute of Management (IIM), Gaya",
    "Software Technology Park of India (STPI), Patna",
    "Aryabhatt Knowledge University (AKU), Patna",
    "Loknayak Jai Prakash Institute of Technology",
  ];

  // Manage selected values for cascading dropdowns
  const [selectedValues, setSelectedValues] = useState({
    preference1: "",
    preference2: "",
    preference3: "",
  });

  const handleSelectionChange = (e) => {
    const { name, value } = e.target;
    setSelectedValues((prev) => ({ ...prev, [name]: value }));
    formik.setFieldValue(name, value); // Sync with Formik
  };

  // Filter options to prevent duplicate selections
  const getFilteredOptions = (excludeValues) => {
    return incubationCenters.filter(
      (center) => !excludeValues.includes(center)
    );
  };

  return (
    <div className="isolate bg-white h-screen flex items-center justify-center px-6 py-24 sm:py-12 lg:px-8">
      <div className="w-full max-w-4xl rounded-lg p-10 flex justify-center">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md space-y-6"
        >
          <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
            Apply for Incubation
          </h2>

          {/* Preference 1 */}
          <div className="mb-4">
            <label htmlFor="preference1" className="block font-medium">
              Select Incubation Center Preference 1
            </label>
            <select
              id="preference1"
              name="preference1"
              value={selectedValues.preference1}
              onChange={handleSelectionChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            >
              <option value="">Select</option>
              {incubationCenters.map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
            {formik.errors.preference1 && (
              <div className="text-red-600">{formik.errors.preference1}</div>
            )}
          </div>

          {/* Preference 2 */}
          <div className="mb-4">
            <label htmlFor="preference2" className="block font-medium">
              Select Incubation Center Preference 2
            </label>
            <select
              id="preference2"
              name="preference2"
              value={selectedValues.preference2}
              onChange={handleSelectionChange}
              disabled={!selectedValues.preference1}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            >
              <option value="">Select</option>
              {getFilteredOptions([selectedValues.preference1]).map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
            {formik.errors.preference2 && (
              <div className="text-red-600">{formik.errors.preference2}</div>
            )}
          </div>

          {/* Preference 3 */}
          <div className="mb-4">
            <label htmlFor="preference3" className="block font-medium">
              Select Incubation Center Preference 3
            </label>
            <select
              id="preference3"
              name="preference3"
              value={selectedValues.preference3}
              onChange={handleSelectionChange}
              disabled={!selectedValues.preference2}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            >
              <option value="">Select</option>
              {getFilteredOptions([
                selectedValues.preference1,
                selectedValues.preference2,
              ]).map((center) => (
                <option key={center} value={center}>
                  {center}
                </option>
              ))}
            </select>
            {formik.errors.preference3 && (
              <div className="text-red-600">{formik.errors.preference3}</div>
            )}
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="text-green-500 mt-4">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="text-red-500 mt-4">{errorMessage}</div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="px-6 py-2 bg-gray-100 border rounded-md text-gray-700 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
        <StatusDialog
        isVisible={dialogStatus.isVisible}
        title={dialogStatus.title}
        subtitle={dialogStatus.subtitle}
        buttonVisible={dialogStatus.buttonVisible}
        onClose={() => goBacktoHome()}
        status={dialogStatus.status}
      />
      </div>
    </div>
  );
};

export default Incubation;
