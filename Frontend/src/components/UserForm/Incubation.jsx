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
    <div className="overflow-x-hidden">
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
          <h1 className="text-3xl font-bold mb-2 relative top-10">Apply for Incubation</h1>
          <p className="text-lg max-w-xl relative top-10">
          
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true" />
      <div className="w-full rounded-lg p-10 flex justify-center items-center align-middle mt-20">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full max-w-md space-y-6"
        >

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
