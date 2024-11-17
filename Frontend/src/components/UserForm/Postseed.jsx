import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';

export const App = () => {
  return (
    <div>
      <PostSeed />
    </div>
  );
};

// Validation function for form fields
const validate = (values) => {
  const errors = {};

  if (!values.currentStage) {
    errors.currentStage = 'Required';
  }
  if (!values.technicalKnowledge) {
    errors.technicalKnowledge = 'Required';
  }
  if (!values.raisedFunds) {
    errors.raisedFunds = 'Required';
  }
  if (!values.employment) {
    errors.employment = 'Required';
  }
  if (!values.auditedBalanceSheet) {
    errors.auditedBalanceSheet = 'Required';
  }
  if (!values.gstReturn) {
    errors.gstReturn = 'Required';
  }
  if (!values.projectReport) {
    errors.projectReport = 'Required';
  }

  return errors;
};

const PostSeed = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Formik setup for handling form submission
  const formik = useFormik({
    initialValues: {
      currentStage: '',
      technicalKnowledge: '',
      raisedFunds: '',
      employment: '',
      auditedBalanceSheet: null,
      gstReturn: null,
      projectReport: null,
    },
    validate,
    onSubmit: async (values) => {
      const formData = new FormData();
      for (const key in values) {
        formData.append(key, values[key] instanceof File ? values[key] : values[key]);
      }

      try {
        const response = await axios.post('http://localhost:3010/api/post-seed', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization:`${localStorage.getItem('token')}`,
          },
        });

        setSuccessMessage(response.data.message);
        setErrorMessage('');
        formik.resetForm(); // Reset form fields after submission
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'An error occurred during submission');
        setSuccessMessage('');
      }
    },
  });

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-3 lg:px-8 h-screen overflow-y-auto flex flex-col items-center">
      <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]" aria-hidden="true">
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        ></div>
      </div>

      {/* Form Start */}
      <form onSubmit={formik.handleSubmit} className="w-full max-w-lg p-8 rounded-lg">
        <h3 className="font-semibold text-xl mb-6">Post Seed Fund</h3>

        {/* Current Stage of Startup */}
        <div className="mb-6">
          <label htmlFor="currentStage" className="block text-sm font-medium text-gray-700 mb-2">
            Current stage of your startup
          </label>
          <select
            id="currentStage"
            name="currentStage"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            onChange={formik.handleChange}
            value={formik.values.currentStage}
          >
            <option value="">Select Stage</option>
            <option value="Ideation">Ideation</option>
            <option value="Prototype">Prototype</option>
            <option value="Validation">Validation</option>
            <option value="MVP">MVP</option>
            <option value="Scaling">Scaling</option>
          </select>
          {formik.errors.currentStage && <div className="text-red-600">{formik.errors.currentStage}</div>}
        </div>

        {/* Technical Knowledge */}
        <div className="mb-6">
          <label htmlFor="technicalKnowledge" className="block text-sm font-medium text-gray-700 mb-2">
            Do the founders/Key employees possess technical knowledge/necessary skills to operate and scale the business?
          </label>
          <input
            type="text"
            id="technicalKnowledge"
            name="technicalKnowledge"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            onChange={formik.handleChange}
            value={formik.values.technicalKnowledge}
          />
          {formik.errors.technicalKnowledge && <div className="text-red-600">{formik.errors.technicalKnowledge}</div>}
        </div>

        {/* Raised Funds */}
        <div className="mb-6">
          <label htmlFor="raisedFunds" className="block text-sm font-medium text-gray-700 mb-2">
            Has the startup raised any fund/investment from recognized SEBI CAT 1 AIF, angel investors, or venture capitalists?
          </label>
          <input
            type="text"
            id="raisedFunds"
            name="raisedFunds"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            onChange={formik.handleChange}
            value={formik.values.raisedFunds}
          />
          {formik.errors.raisedFunds && <div className="text-red-600">{formik.errors.raisedFunds}</div>}
        </div>

        {/* Employment */}
        <div className="mb-6">
          <label htmlFor="employment" className="block text-sm font-medium text-gray-700 mb-2">
            Has the startup given employment to 5-10 employees working continuously for at least 6 months?
          </label>
          <input
            type="text"
            id="employment"
            name="employment"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            onChange={formik.handleChange}
            value={formik.values.employment}
          />
          {formik.errors.employment && <div className="text-red-600">{formik.errors.employment}</div>}
        </div>

        {/* File Upload: Audited Balance Sheet */}
        <div className="mb-6">
          <label htmlFor="auditedBalanceSheet" className="block text-sm font-medium text-gray-700">
            Upload Audited Balance Sheet:
          </label>
          <input
            id="auditedBalanceSheet"
            name="auditedBalanceSheet"
            type="file"
            onChange={(event) => formik.setFieldValue('auditedBalanceSheet', event.currentTarget.files[0])}
          />
          {formik.errors.auditedBalanceSheet && <div className="text-red-600">{formik.errors.auditedBalanceSheet}</div>}
        </div>

        {/* File Upload: GST Return */}
        <div className="mb-6">
          <label htmlFor="gstReturn" className="block text-sm font-medium text-gray-700">
            Upload GST Return:
          </label>
          <input
            id="gstReturn"
            name="gstReturn"
            type="file"
            onChange={(event) => formik.setFieldValue('gstReturn', event.currentTarget.files[0])}
          />
          {formik.errors.gstReturn && <div className="text-red-600">{formik.errors.gstReturn}</div>}
        </div>

        {/* File Upload: Project Report */}
        <div className="mb-6">
          <label htmlFor="projectReport" className="block text-sm font-medium text-gray-700">
            Upload Project Report:
          </label>
          <input
            id="projectReport"
            name="projectReport"
            type="file"
            onChange={(event) => formik.setFieldValue('projectReport', event.currentTarget.files[0])}
          />
          {formik.errors.projectReport && <div className="text-red-600">{formik.errors.projectReport}</div>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="mt-6 w-full py-2 px-4 text-white bg-indigo-600 rounded-md">
          Submit
        </button>

        {/* Success and Error Messages */}
        {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default PostSeed;