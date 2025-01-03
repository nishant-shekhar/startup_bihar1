import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import Upload from './Upload';

const SeedFund = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);
      const formData = new FormData();
      for (const key in values) {
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      }
      try {
        const response = await axios.post('http://localhost:3007/api/seed-fund', formData, {
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
        setIsSubmitting(false);
        formik.resetForm();
      }
    },
  });

  const handleFileChange = (file, fieldName) => {
    formik.setFieldValue(fieldName, file);
  };

  return (
    <div className="h-screen overflow-y-auto">

      {/* top poster background */}
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
          <h1 className="text-3xl font-bold mb-2 relative top-10">Post Seed Fund</h1>
          <p className="text-lg max-w-xl relative top-10">
            Share your innovative ideas and secure funding to turn them into reality.
          </p>
        </div>
      </div>

      {/* top poster background ends */}

      {/* Modal Dialog */}
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-lg font-semibold">{successMessage || errorMessage || "Uploading form..."}</p>
          </div>
        </div>
      )}

      {/* Layout with Form */}
      <div className="container mx-auto p-4">
        <div className="gap-4 m-4 grid sm:grid-cols-12">

          {/* First layout (First part of the form) */}
          <div className="min-h-[100px] rounded sm:col-span-6">
            <form onSubmit={formik.handleSubmit}>

              <div className="flex">


                {/* Left Column */}
                <div className="w-full border rounded-md px-5">
                  <div className="mb-4">
                    <h1 className='text-black font-bold flex justify-center items-center border-b '>Company Information</h1>
                    <label className="block mb-2 mt-4 text-sm/6 font-medium text-gray-900" htmlFor="companyName">Company Name:</label>
                    <input
                      className="border rounded-md w-full py-2 px-3 text-base text-gray-500 sm:text-sm/6"
                      id="companyName"
                      name="companyName"
                      placeholder='Enter your company name'
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.companyName}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="registrationNumber">Registration Number:</label>
                    <input
                      className="border rounded-md w-full py-2 px-3 text-base text-gray-500 sm:text-sm/6"
                      id="registrationNumber"
                      name="registrationNumber"
                      placeholder='Enter your Registration Number'
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.registrationNumber}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="dateOfIncorporation">Date of Incorporation:</label>
                    <input
                      className="border rounded-md w-full py-2 px-3 text-base text-gray-500 sm:text-sm/6"
                      id="dateOfIncorporation"
                      name="dateOfIncorporation"
                      placeholder='Enter your Date of Incorporation'
                      type="date"
                      onChange={formik.handleChange}
                      value={formik.values.dateOfIncorporation}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="businessEntityType">Business Entity Type:</label>
                    <select
                      className="border rounded-md w-full py-2 px-3 text-base text-gray-500 sm:text-sm/6"
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
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="rocDistrict">ROC District:</label>
                    <select
                      className="border rounded-md w-full py-2 px-3 text-base text-gray-500 sm:text-sm/6"
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
                  <div className="mb-4">
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="companyAddress">Company Address:</label>
                    <textarea
                      className="border rounded-md w-full py-2 px-3"
                      id="companyAddress"
                      name="companyAddress"
                      onChange={formik.handleChange}
                      value={formik.values.companyAddress}
                      rows="3"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="pincode">Pincode:</label>
                    <input
                      className="border rounded-md w-full py-2 px-3 text-base text-gray-500 sm:text-sm/6"
                      id="pincode"
                      placeholder='Enter your PIN code'
                      name="pincode"
                      type="number"
                      onChange={formik.handleChange}
                      value={formik.values.pincode}
                      required
                    />
                  </div>

                </div>
              </div>
            </form>
          </div>

          {/* Second layout (Second part of the form) */}
          <div className="min-h-[100px] sm:col-span-6 flex flex-col space-y-2">
            <div className="flex-1 rounded-md bg-white items-center relative border px-5">
              <h1 className="text-black font-bold flex justify-center items-center border-b">Upload Documents</h1>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Box 1 */}
                <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                  <div className="text-center py-2">
                    <label
                      htmlFor="companyCertificate"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Company Certificate/ Registration Certificate</span>
                      <input
                        id="companyCertificate"
                        name="companyCertificate"
                        type="file"
                        className="sr-only"
                        onChange={(file) => handleFileChange(file, 'companyCertificate')}
                      />
                    </label>
                    <p className="mt-2 text-xs text-gray-600 py-2">Upload a file (up to 10MB)</p>
                  </div>
                </div>

                <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                  <div className="text-center py-2">
                    <label
                      htmlFor="dpr"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Detailed Project Report</span>
                      <input
                        id="dpr"
                        name="dpr"
                        type="file"
                        className="sr-only"
                        onChange={(file) => handleFileChange(file, 'dpr')}
                      />
                    </label>
                    <p className="mt-2 text-xs text-gray-600 py-2">Upload a file (up to 10MB)</p>

                  </div>
                </div>



                <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                  <div className="text-center py-2">
                    <label
                      htmlFor="cancelChequeOrPassbook"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload Cancel Cheque (PDF)</span>
                      <input
                        id="cancelChequeOrPassbook"
                        name="cancelChequeOrPassbook"
                        type="file"
                        className="sr-only"
                        onChange={(file) => handleFileChange(file, 'cancelChequeOrPassbook')}
                      />
                    </label>
                    <p className="mt-2 text-xs text-gray-600 py-2">Upload a file (up to 10MB)</p>

                  </div>
                </div>


              </div>
              {/* Additional conditional boxes based on business entity */}
              {formik.values.businessEntityType === "Limited Liability Partnership (LLP)" ||formik.values.businessEntityType === "Partnership Firm" && (

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">

                  <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                    <div className="text-center py-2">
                      <label
                        htmlFor="partnershipAgreement"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Partnership Agreement</span>
                        <input
                          id="partnershipAgreement"
                          name="partnershipAgreement"
                          type="file"
                          className="sr-only"
                          onChange={(file) => handleFileChange(file, 'partnershipAgreement')}
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-600 py-2">Upload a file (up to 10MB)</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Additional conditional boxes based on business entity */}
              {formik.values.businessEntityType === "Private Limited Company/One Person Company (OPC)" && (

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">

                 

                  {/* // rest of the two boxex are here */}
                  {/* Box 2 */}
                  <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                    <div className="text-center py-2">
                      <label
                        htmlFor="inc33"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>INC33 (MOA)</span>
                        <input
                          id="inc33"
                          name="inc33"
                          type="file"
                          className="sr-only"
                          onChange={(file) => handleFileChange(file, 'inc33')}
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-600 py-2">Upload a file (up to 10MB)</p>
                    </div>
                  </div>

                  {/* Box 3 */}
                  <div className="flex items-center justify-center border border-dashed rounded-lg h-40">
                    <div className="text-center py-2">
                      <label
                        htmlFor="inc34"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>INC34 (AOA)</span>
                        <input
                          id="inc34"
                          name="inc34"
                          type="file"
                          className="sr-only"
                          onChange={(file) => handleFileChange(file, 'inc34')}
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-600 py-2">Upload a file (up to 10MB)</p>
                    </div>
                  </div>

                </div>
              )}
            </div>

            <div className="min-h-[100px] grid sm:col-span-12 md:col-span-6 space-y-2">
              <div className="flex-1 rounded-md bg-white flex flex-col items-center relative border px-5">
                <h1 className="text-black font-bold flex justify-center items-center border-b pt-4">Bank Detail</h1>

                {/* Wrap the input boxes in a flex container to arrange them horizontally */}
                <div className="mb-4 pt-4 grid grid-cols-12 gap-4">
                  <div className="w-full col-span-6">
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="bankName">Bank Name:</label>
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

                  <div className="w-full col-span-6">
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="ifscCode">IFSC Code:</label>
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

                  <div className="w-full col-span-6">
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="currentAccountNumber">Current Account Number:</label>
                    <input
                      className="border rounded w-full py-2 px-3"
                      id="currentAccountNumber"
                      name="currentAccountNumber"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.currentAccountNumber}
                      required
                    />
                  </div>

                  <div className="w-full col-span-6">
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="currentAccountHolderName">Current Account Holder Name:</label>
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

                  <div className="w-full col-span-6">
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="branchName">Branch Name:</label>
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

                  <div className="w-full col-span-6">
                    <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="branchAddress">Branch Address:</label>
                    <input
                      className="border rounded w-full py-2 px-3"
                      id="branchAddress"
                      name="branchAddress"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.branchAddress}
                      required
                    />
                  </div>
                </div>

                {/* Submit button */}

              </div>
            </div>


            <div className="mb-6 grid gap-3 sm:grid-cols-12">
              <div className="col-span-6">
                <button
                  type="submit"
                  className="w-full py-2 px-4 border text-black hover:bg-indigo-500 hover:text-white rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Canceling...' : 'Cancel Form'}
                </button>
              </div>
              <div className="col-span-6">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Form'}
                </button>
              </div>
            </div>



          </div>
        </div>
        {/* Third layout (Third part of the form) */}


      </div>
    </div>
  );
};

export default SeedFund;



