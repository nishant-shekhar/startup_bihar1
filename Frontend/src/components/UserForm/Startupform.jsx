import React, { useState } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import Upload from './Upload';
import * as Yup from 'yup';
import StatusDialog from "./StatusDialog"; // Import the new dialog component


const StartupForm = ( {onFormSubmitSuccess} ) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusPopup, setStatusPopup] = useState(false);
	const [title, setTitle] = useState("");
	const [buttonVisible, setButtonVisible] = useState(true);
	const [subtitle, setSubtitle] = useState("");
	const [isSuccess, setIsSuccess] = useState(""); // Add success state
  const [dialogStatus, setDialogStatus] = useState({ isVisible: false, title: "", subtitle: "", buttonVisible: false, status: "" });



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
      registrationNo: `${localStorage.getItem('registration_no')}`,
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
        const response = await axios.post('https://startupbihar.in/api/StartupProfile', formData, {
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
    if (fieldName === 'logo') {
      // Allow only images for the logo
      const allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedImageTypes.includes(file.type)) {
        setErrorMessage('Invalid file type. Only PNG, JPG, or JPEG files are allowed for the logo.');
        return;
      }
    } else {
      // For other fields, allow only PDFs
      if (file.type !== 'application/pdf') {
        setErrorMessage('Invalid file type. Only PDF files are allowed.');
        return;
      }
    }
  
    // Check for file size (e.g., less than 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('File size should be less than 2MB.');
      return;
    }
  
    // Set the field value
    formik.setFieldValue(fieldName, file);
    setErrorMessage('');
  };

  const goBacktoHome = () => {
    setDialogStatus({ ...dialogStatus, isVisible: false })
    console.log("navigate to home")
    onFormSubmitSuccess();
  }
  
  return (
    <div className="h-screen overflow-y-auto">
       

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
    <h1 className="text-3xl font-bold mb-2 relative top-10">Startup Profile Form</h1>
    <p className="text-lg max-w-xl relative top-10">
      Share your innovative ideas and secure funding to turn them into reality.
    </p>
  </div>
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

  <form onSubmit={formik.handleSubmit} className="gap-6 mx-6 space-x-2 border rounded-md px-5 py-5 ">
        {/* Left Column */}
        <div>
        <div className="grid sm:grid-cols-12 gap-4">
          <div className="mb-4 col-span-6">
            <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="registrationNo">Registration No:</label>
            <input
              className="border rounded-md w-full py-2 px-3"
              id="registrationNo"
              name="registrationNo"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.registrationNo}
              disabled
              required
            />
          </div>
          <div className="mb-4 col-span-6">
            <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="founderName">Founder Name:</label>
            <input
              className="border rounded-md w-full py-2 px-3"
              id="founderName"
              name="founderName"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.founderName}
              required
            />
            </div>
        </div>

        {/* second */}
        <div className="grid grid-cols-12 gap-4" >
          <div className="mb-4 col-span-6">
            <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="founderAadharNumber">Founder Aadhaar Number:</label>
            <input
              className="border rounded-md w-full py-2 px-3"
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

          <div className="mb-4 col-span-6">
            <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="coFounderNames">Co-Founder Names (comma-separated):</label>
            <input
              className="border rounded-md w-full py-2 px-3"
              id="coFounderNames"
              name="coFounderNames"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.coFounderNames}
            />
          </div>
         </div>

  
        <div className='grid grid-cols-12 gap-4'>
          <div className="mb-4 col-span-6">
            <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="coFounderAadharNumbers">Co-Founder Aadhaar Numbers (comma-separated):</label>
            <input
              className="border rounded-md w-full py-2 px-3"
              id="coFounderAadharNumbers"
              name="coFounderAadharNumbers"
              onInput={(e) => {
                if (e.target.value.length > 12) e.target.value = e.target.value.slice(0, 12);
              }}
              type="text"
              onChange={formik.handleChange}
              value={formik.values.coFounderAadharNumbers}
            />
          </div>
          <div className="mb-4 col-span-6">
            <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="sector">Sector:</label>
            <input
              className="border rounded-md w-full py-2 px-3"
              id="sector"
              name="sector"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.sector}
              required
            />
          </div>
          </div>
          
          <div className='grid grid-cols-12 gap-4'>
          <div className="mb-4 col-span-6">
            <label className="block mb-2 text-sm/6 font-medium text-gray-900" htmlFor="businessConcept">Business Concept:</label>
            <textarea
              className="border rounded-md w-full py-2 px-3"
              id="businessConcept"
              name="businessConcept"
              onChange={formik.handleChange}
              value={formik.values.businessConcept}
              required
            />
          </div>
          </div>

          <div className='grid sm:grid-cols-12 gap-4'>
          <div className="mb-4 col-span-3">
            <label className="text-sm/6 font-medium text-gray-900" htmlFor="mobileNumbers">Mobile Number:</label>
            <input
              className="border rounded-md w-full py-2 px-3"
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
     

        {/* Right Column */}
      
          <div className="mb-4 col-span-3">
            <label className="text-sm/6 font-medium text-gray-900" htmlFor="email">Email:</label>
            <input
              className="border rounded-md w-full py-2 px-3"
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              required
            />
          </div>
          <div className="mb-4 col-span-3">
            <label className="text-sm/6 font-medium text-gray-900" htmlFor="websiteLink">Website Link:</label>
            <input
              className="border rounded-md w-full py-2 px-3"
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
          <div className="mb-4 col-span-3">
            <label className="text-sm/6 font-medium text-gray-900" htmlFor="gender">Gender:</label>
            <select
              className="border rounded-md w-full py-2 px-3"
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
          </div>
        
           <div className='grid grid-cols-12 gap-4'>
          <div className="mb-4 col-span-6">
            <label className="text-sm/6 font-medium text-gray-900" htmlFor="category">Category:</label>
            <input
              className="border rounded-md w-full py-2 px-3"
              id="category"
              name="category"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.category}
              required
            />
          </div>
          <div className="mb-4 col-span-6">
            <label className="mb-2 text-sm/6 font-medium text-gray-900" htmlFor="dpiitRecognitionNo">DPIIT Recognition No:</label>
            <input
              className="border rounded w-full py-2 px-3"
              id="dpiitRecognitionNo"
              name="dpiitRecognitionNo"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.dpiitRecognitionNo}
            />
          </div>
           </div>   

          <div className="mb-4">
            <label className="mb-2 text-sm/6 font-medium text-gray-900" htmlFor="appliedIPR">Applied for IPR:</label>
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
  

          <div className="grid grid-cols-12 gap-4">
          <div className="mb-4 col-span-6 text-sm/6 font-medium text-gray-900">
            <Upload
              label="Upload Company Logo:"
              name="logo"
              onChange={(file) => handleFileChangeForm(file, 'logo')}
              allowImages={true} 
            />
          </div>
          <div className="mb-4 col-span-6 text-sm/6 font-medium text-gray-900">
            <Upload
              label="Upload Certificate:"
              name="certificate"
              onChange={(file) => handleFileChangeForm(file, 'certificate')}
              accept=".pdf"
            />
           </div>
          </div>

        </div>

        {/* Submit Section */}
        <div className="justify-center grid gap-3 sm:grid-cols-12">

          <div className='col-span-6'>
          <button
  type="button"
  className="w-full py-2 px-4 border text-black hover:bg-indigo-500 hover:text-white rounded"
  onClick={goBacktoHome}
>
  Cancel Form
</button>
          </div>

          <div className='col-span-6'>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
          >
            Submit Form
          </button>
          </div>

        </div>

      </form>
      <StatusDialog
				isVisible={statusPopup}
				title={title}
				subtitle={subtitle}
				buttonVisible={buttonVisible}
				status={isSuccess} // Pass success state

				onClose={() => goBacktoHome()}
			/>
    </div>
  );

};

export default StartupForm;
