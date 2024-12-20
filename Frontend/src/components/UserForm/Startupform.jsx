import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import Upload from './Upload';
import * as Yup from 'yup';
import StatusDialog from "./StatusDialog"; // Import the new dialog component
import { useNavigate } from "react-router-dom";


const StartupForm = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusPopup, setStatusPopup] = useState(false);
	const [title, setTitle] = useState("");
	const [buttonVisible, setButtonVisible] = useState(true);
	const [subtitle, setSubtitle] = useState("");
	const [isSuccess, setIsSuccess] = useState(""); // Add success state
  const navigate = useNavigate(); // Initialize useNavigate hook


  const handleCloseDialog = () => {
    setStatusPopup(false); // Close the dialog
    navigate("/StartupProfile"); // Navigate to StartupProfile route
  };

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    registrationNo: Yup.string().required('Registration No is required'),
    founderName: Yup.string().required('Founder Name is required'),
    founderAadharNumber: Yup.string().required('Founder Aadhar Number is required'),
    coFounderNames: Yup.string().nullable(),
    coFounderAadharNumbers: Yup.string().nullable(),
    sector: Yup.string().required('Sector is required'),
    businessConcept: Yup.string().required('Business Concept is required'),
    mobileNumbers: Yup.string().required('Mobile Numbers are required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    websiteLink: Yup.string().url('Invalid URL').nullable(),
    category: Yup.string().required('Category is required'),
    gender: Yup.string().required('Gender is required'),
    dpiitRecognitionNo: Yup.string().nullable(),
    appliedIPR: Yup.boolean().required('Please select IPR status'),
    logo: Yup.mixed().nullable(),
    certificate: Yup.mixed().nullable(),
  });


  // Formik setup
  const formik = useFormik({
    initialValues: {
      registrationNo: '',
      founderName: '',
      founderAadharNumber: '',
      coFounderNames: '',
      coFounderAadharNumbers: '',
      sector: '',
      businessConcept: '',
      mobileNumbers: '',
      email: '',
      websiteLink: '',
      category: '',
      gender: '',
      dpiitRecognitionNo: '',
      appliedIPR: false,
      logo: null,
      certificate: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setTitle("Submitting Post Seed Fund Form");
			setSubtitle("Please wait while we submit your form");
			setButtonVisible(false);
			setStatusPopup(true);

			setStatusPopup(true);
      const formData = new FormData();
      for (const key in values) {
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      }

      try {
        const response = await axios.post('http://localhost:3007/api/StartupProfile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        setSuccessMessage(response.data.message);
        setErrorMessage('');
        formik.resetForm();
        setTitle("Submission Successful");
				setSubtitle(response.data.message);
				setButtonVisible(true);
				setSuccessMessage(response.data.message);
				setErrorMessage("");
				setIsSuccess("success"); // Set success state

      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'An error occurred during submission');
        setSuccessMessage('');
        setTitle("Submission Failed");
				setSubtitle(
					error.response?.data?.error || "An error occurred during submission"
				);
				setButtonVisible(true);
				setErrorMessage(
					error.response?.data?.error || "An error occurred during submission"
				);
				setSuccessMessage("");
				setIsSuccess("failed"); // Set success state
      } finally {
      }
    },
  });

  const handleFileChangeForm = (file, fieldName) => {
    if (file && file.size > 2 * 1024 * 1024) {
      setErrorMessage('File size should be less than 2MB');
      return;
    }
    if (file && !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      setErrorMessage('Invalid file type. Only JPEG, PNG, or PDF are allowed');
      return;
    }
    formik.setFieldValue(fieldName, file);
    setErrorMessage('');
  };
  return (
    <div className="h-screen overflow-y-auto">
       <div
        className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
        aria-hidden="true"
        style={{ pointerEvents: 'none' }} // Makes the element not clickable
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        ></div>
        
      </div>

      


      <h2 className="text-center text-2xl font-bold mb-6 mt-8">Startup Profile Form
      </h2>
      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 mx-6">
          {successMessage}
        </div>
      )}
      {/* Error Messages */}
      {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-6">{errorMessage}</div>}

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-6 space-x-2">
        {/* Left Column */}
        <div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="registrationNo">Registration No:</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="registrationNo"
              name="registrationNo"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.registrationNo}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="founderName">Founder Name:</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="founderName"
              name="founderName"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.founderName}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="founderAadharNumber">Founder Aadhaar Number:</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="founderAadharNumber"
              name="founderAadharNumber"
              type="number"
              onInput={(e) => {
                if (e.target.value.length > 12) e.target.value = e.target.value.slice(0, 12);
              }}
              onChange={formik.handleChange}
              value={formik.values.founderAadharNumber}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="coFounderNames">Co-Founder Names (comma-separated):</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="coFounderNames"
              name="coFounderNames"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.coFounderNames}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="coFounderAadharNumbers">Co-Founder Aadhaar Numbers (comma-separated):</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="coFounderAadharNumbers"
              name="coFounderAadharNumbers"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.coFounderAadharNumbers}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="sector">Sector:</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="sector"
              name="sector"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.sector}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="businessConcept">Business Concept:</label>
            <textarea
              className="border rounded w-full py-2 px-3"
              id="businessConcept"
              name="businessConcept"
              onChange={formik.handleChange}
              value={formik.values.businessConcept}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="mobileNumbers">Mobile Number:</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="mobileNumbers"
              name="mobileNumbers"
              type="number"
              onInput={(e) => {
                if (e.target.value.length > 10) e.target.value = e.target.value.slice(0, 10);
              }}
              onChange={formik.handleChange}
              value={formik.values.mobileNumbers}
              required
            />
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="email">Email:</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="websiteLink">Website Link:</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="websiteLink"
              name="websiteLink"
              type="text"
              onChange={(e) => {
                const value = e.target.value;
                formik.setFieldValue(
                  "websiteLink",
                  value.startsWith("http") ? value : `https://${value}`
                );
              }}
              value={formik.values.websiteLink}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="gender">Gender:</label>
            <select
              className="border rounded w-full py-2 px-3"
              id="gender"
              name="gender"
              onChange={formik.handleChange}
              value={formik.values.gender}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="category">Category:</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="category"
              name="category"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.category}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="dpiitRecognitionNo">DPIIT Recognition No:</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="dpiitRecognitionNo"
              name="dpiitRecognitionNo"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.dpiitRecognitionNo}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="appliedIPR">Applied for IPR:</label>
            <select
              className="border rounded w-full py-2 px-3"
              id="appliedIPR"
              name="appliedIPR"
              onChange={formik.handleChange}
              value={formik.values.appliedIPR}
              required
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          </div>
          <div className="mb-4">
            <Upload
              label="Upload Company Logo:"
              name="logo"
              onChange={(file) => handleFileChangeForm(file, 'logo')}
            />
          </div>
          <div className="mb-4">
            <Upload
              label="Upload Certificate:"
              name="certificate"
              onChange={(file) => handleFileChangeForm(file, 'certificate')}
            />
          </div>
        </div>

        {/* Submit Section */}
        <div className="col-span-1 md:col-span-2 flex justify-center my-6">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>

      </form>
      <StatusDialog
				isVisible={statusPopup}
				title={title}
				subtitle={subtitle}
				buttonVisible={buttonVisible}
				status={isSuccess} // Pass success state

        onClose={handleCloseDialog} // Use the new navigation function here
        />
    </div>
  );

};

export default StartupForm;
