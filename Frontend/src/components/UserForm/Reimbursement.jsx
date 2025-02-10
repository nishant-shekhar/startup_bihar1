import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios'; // Import axios
import Textbox from './Textbox'; // Your custom textbox component
import Upload from './Upload';   // Your custom upload component (if needed)
import StatusDialog from './StatusDialog';

const Reimbursement = ({ onFormSubmitSuccess }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusPopup, setStatusPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonVisible, setButtonVisible] = useState(true);
  const [subtitle, setSubtitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(""); // "success" or "failed"
  const [dialogStatus, setDialogStatus] = useState({
    isVisible: false,
    title: "",
    subtitle: "",
    buttonVisible: false,
    status: ""
  });

  const goBacktoHome = () => {
    //setDialogStatus({ ...dialogStatus, isVisible: false });
    setStatusPopup(false);
    console.log("navigate to home");
    onFormSubmitSuccess();
  };

  const validate = (values) => {
    const errors = {};
    if (!values.iprType) {
      errors.iprType = 'Required';
    }
    if (!values.iprCertificate) {
      errors.iprCertificate = 'Required';
    }
    if (!values.feePaidForApplicationForm) {
      errors.feePaidForApplicationForm = 'Required';
    }
    if (!values.feePaidInvoice) {
      errors.feePaidInvoice = 'Required';
    }
    if (!values.consultancyFee) {
      errors.consultancyFee = 'Required';
    }
    if (!values.consultancyInvoice) {
      errors.consultancyInvoice = 'Required';
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      iprType: '',
      iprCertificate: null, // file
      feePaidForApplicationForm: '',
      feePaidInvoice: null,    // file
      consultancyFee: '',
      consultancyInvoice: null, // file
    },
    validate,
    onSubmit: async (values) => {
      setTitle("Submitting IPR Reimbursement Form");
      setSubtitle("Please wait while we submit your form");
      setButtonVisible(false);
      setStatusPopup(true);

      // Create a FormData object and append all values (files and text)
      const formData = new FormData();
      for (const key in values) {
        // Append file objects directly; other values will be appended as strings
        formData.append(key, values[key]);
      }

      try {
        const response = await axios.post(
          "https://startupbihar.in/api/iprReimbursement",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        formik.resetForm();

        setTitle("Submission Successful");
        setSubtitle(response.data.message);
        setButtonVisible(true);
        setSuccessMessage(response.data.message);
        setErrorMessage("");
        setIsSuccess("success"); // Mark success state
      } catch (error) {
        setTitle("Submission Failed");
        setSubtitle(
          error.response?.data?.error || "An error occurred during submission"
        );
        setButtonVisible(true);
        setErrorMessage(
          error.response?.data?.error || "An error occurred during submission"
        );
        setSuccessMessage("");
        setIsSuccess("failed");
      }
    },
  });



  return (
    <div className="h-screen overflow-y-auto">
      {/* Top poster background */}
      <div className="relative w-full h-[250px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xmlnsSvgjs="http://svgjs.dev/svgjs"
          width="1440"
          height="250"
          preserveAspectRatio="none"
          viewBox="0 0 1440 250"
        >
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
            <path d="M0 250L234.72324462026174 250L0 15.276755379738262z" fill="url(#SvgjsLinearGradient1002)"></path>
          </g>
          <defs>
            <mask id="SvgjsMask1000">
              <rect width="1440" height="250" fill="#ffffff"></rect>
            </mask>
            <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="SvgjsLinearGradient1001">
              <stop stopColor="rgba(15, 70, 185, 0.2)" offset="0"></stop>
              <stop stopOpacity="0" stopColor="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
            </linearGradient>
            <linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="SvgjsLinearGradient1002">
              <stop stopColor="rgba(15, 70, 185, 0.2)" offset="0"></stop>
              <stop stopOpacity="0" stopColor="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute top-9 left-0 w-full p-6 text-white">
          <h1 className="text-3xl font-bold mb-2 relative top-10">IPR Reimbursement Form</h1>
          <p className="text-lg max-w-xl relative top-10">
            Share your IPR Details
          </p>
        </div>
      </div>

      {/* Success Message */}
      {isSuccess === "success" && (
        <div className="mb-4 text-green-600 font-bold text-center">
          Form submitted successfully!
        </div>
      )}

      {/* Form Start */}
      <form onSubmit={formik.handleSubmit} className="px-10">
        <div className="mb-4">
          <label htmlFor="iprType" className="block mb-2 mt-4 text-sm font-medium text-gray-900">
            IPR Type:
          </label>
          <input
            className="border rounded-md w-full py-2 px-3 text-base text-gray-500"
            id="iprType"
            name="iprType"
            placeholder="Enter IPR Type"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.iprType}
            required
          />
          {formik.errors.iprType && <div className="text-red-600">{formik.errors.iprType}</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="feePaidForApplicationForm" className="block mb-2 mt-4 text-sm font-medium text-gray-900">
            Fee Paid For Application Form:
          </label>
          <input
            className="border rounded-md w-full py-2 px-3 text-base text-gray-500"
            id="feePaidForApplicationForm"
            name="feePaidForApplicationForm"
            placeholder="Enter Fee Paid For Application Form"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.feePaidForApplicationForm}
            required
          />
          {formik.errors.feePaidForApplicationForm && (
            <div className="text-red-600">{formik.errors.feePaidForApplicationForm}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="consultancyFee" className="block mb-2 mt-4 text-sm font-medium text-gray-900">
            Consultancy Fee:
          </label>
          <input
            className="border rounded-md w-full py-2 px-3 text-base text-gray-500"
            id="consultancyFee"
            name="consultancyFee"
            placeholder="Enter Consultancy Fee"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.consultancyFee}
            required
          />
          {formik.errors.consultancyFee && (
            <div className="text-red-600">{formik.errors.consultancyFee}</div>
          )}
        </div>

        <div className="bg-white p-6 border border-black-500 rounded-md">
          <div className="border-b-2 border-[#4b4b4b]/10 mb-8 pb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-6">
              <label htmlFor="iprCertificate" className="block text-sm font-medium text-black">
                IPR Certificate:
              </label>
              <Upload
                id="iprCertificate"
                name="iprCertificate"
                onChange={(file) => formik.setFieldValue("iprCertificate", file)}
              />
              {formik.errors.iprCertificate && (
                <div className="text-red-600">{formik.errors.iprCertificate}</div>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="feePaidInvoice" className="block text-sm font-medium text-black">
                Fee Paid Invoice:
              </label>
              <Upload
                id="feePaidInvoice"
                name="feePaidInvoice"
                onChange={(file) => formik.setFieldValue("feePaidInvoice", file)}
              />
              {formik.errors.feePaidInvoice && (
                <div className="text-red-600">{formik.errors.feePaidInvoice}</div>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="consultancyInvoice" className="block text-sm font-medium text-black">
                Consultancy Invoice:
              </label>
              <Upload
                id="consultancyInvoice"
                name="consultancyInvoice"
                type="file"
                onChange={(file) => formik.setFieldValue("consultancyInvoice", file)}
              />
              {formik.errors.consultancyInvoice && (
                <div className="text-red-600">{formik.errors.consultancyInvoice}</div>
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="w-full md:w-auto text-sm font-semibold text-gray-900 border border-gray-400 rounded-md px-4 py-2"
              onClick={goBacktoHome}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </div>
        {successMessage && (<div className="text-green-500 mt-4">{successMessage}</div>)}
        {errorMessage && (<div className="text-red-500 mt-4">{errorMessage}</div>)}
      </form>
      <StatusDialog
        isVisible={statusPopup}
        title={title}
        subtitle={subtitle}
        buttonVisible={buttonVisible}
        status={isSuccess}
        onClose={() => goBacktoHome()}
      />
    </div>
  );
};

export default Reimbursement;
