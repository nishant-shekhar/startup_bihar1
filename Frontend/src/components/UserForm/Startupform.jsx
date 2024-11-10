import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import Upload from './Upload';

const DocumentUpload = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  

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
    onSubmit: async (values) => {
      const formData = new FormData();
      for (const key in values) {
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      }
      try {
        const response = await axios.post('http://localhost:3000/api/StartupProfile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${localStorage.getItem('token')}`, // Assuming you store the token in localStorage
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
  const handleFileChange = (file, fieldName) => {
    // Update Formik's state with the selected file
    formik.setFieldValue(fieldName, file);
  };

  return (
    <div className='h-screen overflow-y-auto'>
      <h2 className="text-center text-xl font-semibold mb-4">Upload Documents</h2>
      <div className='flex z'>

        <div className="max-w-6xl mx-auto flex">

          {/* Left Column */}
          <div className="w-1/2 p-4">

            <form onSubmit={formik.handleSubmit}>
              {/* Form Fields */}
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
                <label className="block mb-2" htmlFor="founderAadharNumber">Founder Aadhar Number:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="founderAadharNumber"
                  name="founderAadharNumber"
                  type="text"
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
                <label className="block mb-2" htmlFor="coFounderAadharNumbers">Co-Founder Aadhar Numbers (comma-separated):</label>
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
                <label className="block mb-2" htmlFor="mobileNumbers">Mobile Numbers (comma-separated):</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="mobileNumbers"
                  name="mobileNumbers"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.mobileNumbers}
                  required
                />
              </div>

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
            </form>
          </div>

          {/* Right Column */}
          <div className="w-1/2 p-4">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="websiteLink">Website Link:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="websiteLink"
                  name="websiteLink"
                  type="url"
                  onChange={formik.handleChange}
                  value={formik.values.websiteLink}
                />
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


              <div className="mb-6">
                <Upload
                  label="companyLogo"
                  name="logo"
                  onChange={(file) => handleFileChange(file, 'logo')}
                />
              </div>


              <div className="mb-6">
                <Upload
                  label="certificate"
                  name="certificate"
                  onChange={(file) => handleFileChange(file, 'certificate')}
                />
              </div>

              <button type="submit" className="bg-blue-500 text-white rounded py-2 px-4">Submit</button>

              {successMessage && <div className="text-green-500 mt-4">{successMessage}</div>}
              {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
            </form>
          </div>
        </div>
      </div>
      
    </div>

  );
};

export default DocumentUpload;
