import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import Upload from './Upload';

const SeedFund = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission status

  const districtsOfBihar = [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar",
    "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur",
    "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger",
    "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur",
    "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"
  ];

  const businessEntityTypes = [
    "Private Limited Company/One Person Company (OPC)", "Partnership Firm",
    "Limited Liability Partnership (LLP)"
  ];

  // Formik setup
  const formik = useFormik({
    initialValues: {
      companyName: '',
      registrationNumber: '',
      dateOfIncorporation: '',
      businessEntityType: '',
      rocDistrict: '',
      companyCertificate: null,
      companyAddress: '',
      pincode: '',
      bankName: '',
      ifscCode: '',
      currentAccountNumber: '',
      currentAccountHolderName: '',
      branchName: '',
      branchAddress: '',
      cancelChequeOrPassbook: null,
      panNumber: '',
      gstNumber: '',
    },
    onSubmit: async (values) => {
      setIsSubmitting(true); // Show the modal dialog
      const formData = new FormData();
      for (const key in values) {
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      }
      try {
        const response = await axios.post('https://startup-bihar1.onrender.com/api/seed-fund', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${localStorage.getItem('token')}`,
          },
        });
        setSuccessMessage("Form submitted successfully!");
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error.response?.data?.error || 'An error occurred during submission');
        setSuccessMessage('');
      } finally {
        setIsSubmitting(false); // Hide the modal dialog after response
        formik.resetForm(); // Reset form fields after submission
      }
    },
  });

  const handleFileChange = (file, fieldName) => {
    formik.setFieldValue(fieldName, file);
  };

  return (
    <div className="h-screen overflow-y-auto">
      <h2 className="text-center text-xl font-semibold mb-4">Seed Fund Application Form</h2>

      {/* Modal Dialog */}
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-lg font-semibold">{successMessage || errorMessage || "Uploading form..."}</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <form onSubmit={formik.handleSubmit}>
          <div className="flex">

            {/* Left Column */}
            <div className="w-1/2 p-4">
              <div className="mb-4">
                <label className="block mb-2" htmlFor="companyName">Company Name:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="companyName"
                  name="companyName"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.companyName}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="registrationNumber">Registration Number:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.registrationNumber}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="dateOfIncorporation">Date of Incorporation:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="dateOfIncorporation"
                  name="dateOfIncorporation"
                  type="date"
                  onChange={formik.handleChange}
                  value={formik.values.dateOfIncorporation}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="businessEntityType">Business Entity Type:</label>
                <select
                  className="border rounded w-full py-2 px-3"
                  id="businessEntityType"
                  name="businessEntityType"
                  onChange={formik.handleChange}
                  value={formik.values.businessEntityType}
                  required
                >
                  <option value="">Select Entity Type</option>
                  {businessEntityTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="rocDistrict">ROC District:</label>
                <select
                  className="border rounded w-full py-2 px-3"
                  id="rocDistrict"
                  name="rocDistrict"
                  onChange={formik.handleChange}
                  value={formik.values.rocDistrict}
                  required
                >
                  <option value="">Select District</option>
                  {districtsOfBihar.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <Upload
                  label="Company Certificate/ Registration Cerificate"
                  name="companyCertificate"
                  onChange={(file) => handleFileChange(file, 'companyCertificate')}
                />
              </div>
              {/* Conditional Upload Fields for Private Limited Company/One Person Company (OPC) */}
              {formik.values.businessEntityType === "Private Limited Company/One Person Company (OPC)" && (
                <>
                  <div className="mb-6">
                    <Upload
                      label="INC33 (MOA)"
                      name="inc33"
                      onChange={(file) => handleFileChange(file, 'inc33')}
                    />
                  </div>
                  <div className="mb-6">
                    <Upload
                      label="INC34 (AOA)"
                      name="inc34"
                      onChange={(file) => handleFileChange(file, 'inc34')}
                    />
                  </div>
                </>
              )}

              {/* Conditional Upload Field for Partnership Firm or Limited Liability Partnership (LLP) */}
              {(formik.values.businessEntityType === "Partnership Firm" || formik.values.businessEntityType === "Limited Liability Partnership (LLP)") && (
                <div className="mb-6">
                  <Upload
                    label="Partnership Agreement"
                    name="partnershipAgreement"
                    onChange={(file) => handleFileChange(file, 'partnershipAgreement')}
                  />
                </div>
              )}
              <div className="mb-6">
                <Upload
                  label="Detailed Project Report"
                  name="dpr"
                  onChange={(file) => handleFileChange(file, 'dpr')}
                />
              </div>
              <div className="mb-6">
                <Upload
                  label="Upload Cancel Cheque (PDF)"
                  name="cancelChequeOrPassbook"
                  onChange={(file) => handleFileChange(file, 'cancelChequeOrPassbook')}
                />
              </div>


            </div>

            {/* Right Column */}
            <div className="w-1/2 p-4">
              <div className="mb-4">
                <label className="block mb-2" htmlFor="companyAddress">Company Address:</label>
                <textarea
                  className="border rounded w-full py-2 px-3"
                  id="companyAddress"
                  name="companyAddress"
                  onChange={formik.handleChange}
                  value={formik.values.companyAddress}
                  rows="3"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="pincode">Pincode:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="pincode"
                  name="pincode"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.pincode}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="bankName">Bank Name:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="bankName"
                  name="bankName"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.bankName}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="ifscCode">IFSC Code:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="ifscCode"
                  name="ifscCode"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.ifscCode}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="currentAccountNumber">Current Account Number:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="currentAccountNumber"
                  name="currentAccountNumber"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.currentAccountNumber}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="currentAccountHolderName">Current Account Holder Name:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="currentAccountHolderName"
                  name="currentAccountHolderName"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.currentAccountHolderName}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="branchName">Branch Name:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="branchName"
                  name="branchName"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.branchName}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="branchAddress">Branch Address:</label>
                <textarea
                  className="border rounded w-full py-2 px-3"
                  id="branchAddress"
                  name="branchAddress"
                  onChange={formik.handleChange}
                  value={formik.values.branchAddress}
                  rows="3"
                  required
                />
              </div>



              <div className="mb-4">
                <label className="block mb-2" htmlFor="panNumber">PAN Number:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="panNumber"
                  name="panNumber"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.panNumber}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2" htmlFor="gstNumber">GST Number:</label>
                <input
                  className="border rounded w-full py-2 px-3"
                  id="gstNumber"
                  name="gstNumber"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.gstNumber}
                  required
                />
              </div>
            </div>
          </div>
          {/* Footer with buttons */}
          <div className="text-center mt-4">
            <button type="submit" className="bg-blue-500 text-white rounded py-2 px-4">Submit</button>
          </div>

          {successMessage && <div className="text-green-500 mt-4 text-center">{successMessage}</div>}
          {errorMessage && <div className="text-red-500 mt-4 text-center">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default SeedFund;
