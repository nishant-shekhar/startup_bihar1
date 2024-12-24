import React, { useState } from 'react';
import Upload from './Upload'; // Make sure to adjust the import path if necessary
import { useFormik } from 'formik';
import StatusDialog from "./StatusDialog"; // Import the new dialog component


const SecondTranche = () => {
  const [uploadedFiles, setUploadedFiles] = useState({
    utilizationCertificate: null,
    statusReport: null,
    expenditurePlan: null,
    bankStatement: null,
    expenditureInvoice: null,
    geoTaggedPhotos: null,
  });

  const [statusPopup, setStatusPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [buttonVisible, setButtonVisible] = useState(true);
  const [subtitle, setSubtitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(""); // Add success state

  const requiredFiles = [
    'utilizationCertificate',
    'statusReport',
    'expenditurePlan',
    'bankStatement',
    'expenditureInvoice',
    'geoTaggedPhotos',
  ];

  const handleFileChange = (file, fieldName) => {
    setUploadedFiles((prev) => ({ ...prev, [fieldName]: file }));
  };

  const formik = useFormik({
    initialValues: {
      // Your other form fields can be added here if needed
    },
    onSubmit: async (values) => {
      setTitle("Submitting Post Seed Fund Form");
      setSubtitle("Please wait while we submit your form");
      setButtonVisible(false);
      setStatusPopup(true);

      const formData = new FormData();

      // Only append files that are not null
      Object.entries(uploadedFiles).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      try {
        const response = await fetch('https://startup-bihar1.onrender.com/api/second-tranche', {
          method: 'POST',
          headers: {
            Authorization: `${localStorage.getItem('token')}`, // Adjust according to your token storage
          },
          body: formData,
        });

        const data = await response.json();
        formik.resetForm();

        setTitle("Submission Successful");
        setSubtitle("Files uploaded successfully")
        setButtonVisible(true);
        setIsSuccess("success"); // Set success state

        console.log(data);

      } catch (error) {
        console.error('Error submitting form:', error);
        setTitle("Submission Failed");
        setSubtitle(
          error.response?.data?.error || "An error occurred during submission"
        );
        setButtonVisible(true);

        setIsSuccess("failed"); // Set success state
      }
    },
  });

  const checkMissingFiles = () => {
    const missingFiles = requiredFiles.filter((file) => !uploadedFiles[file]);
    if (missingFiles.length > 0) {
      alert(`Missing files: ${missingFiles.join(', ')}`);
      return false; // Prevent form submission if files are missing
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkMissingFiles()) {
      formik.handleSubmit();
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 flex flex-col items-center">
      {/* top bar poster  */}

      <div className="relative w-full h-[250px]">

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="1440" height="250" preserveAspectRatio="" viewBox="0 0 1440 250">
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
      <h1 className="text-3xl font-bold mb-2 relative top-10">Second Tranche</h1>
      <p className="text-lg max-w-xl relative top-10">
      Share your innovative ideas and secure funding to turn them into reality.
     </p>
    </div>
    </div>

    
      <div className="w-full max-w-5xl rounded-md mt-10 space-x-10 border">
        
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="rounded-lg grid grid-cols-12 gap-4 px-5 py-5">
          

          {/* Registration Number Field */}
          <div className="mb-6 col-span-6">
            <Upload
              label="C.A certified utilization certificate"
              name="utilizationCertificate"
              onChange={(file) => handleFileChange(file, 'utilizationCertificate')}
              className="max-w-[300px] mx-auto" 
            />
          </div>

          {/* Status Report Field */}
          <div className="mb-6 col-span-6">
            <Upload
              label="Status Report"
              name="statusReport"
              onChange={(file) => handleFileChange(file, 'statusReport')}
            />
          </div>

          {/* Expenditure Plan Field */}
          <div className="mb-6 col-span-6">
            <Upload
              label="Upload the second tranche plan on the entity's letterhead."
              name="expenditurePlan"
              onChange={(file) => handleFileChange(file, 'expenditurePlan')}
            />
          </div>
          {/* Bank Statement Field */}
          <div className="mb-6 col-span-6">
            <Upload
              label="Bank statement (Highlight the fund received and expenditure made)"
              name="bankStatement"
              onChange={(file) => handleFileChange(file, 'bankStatement')}
            />
          </div>

             {/* Expenditure Invoice Field */}
          <div className="mb- col-span-6">
            <Upload
              label="Upload Expenditure Invoice"
              name="expenditureInvoice"
              onChange={(file) => handleFileChange(file, 'expenditureInvoice')}
            />
          </div>

          {/* Geo-tagged Photos Field */}
          <div className="mb-6 col-span-6">
            <Upload
              label="Upload geo-tagged photos of your offices/ units"
              name="geoTaggedPhotos"
              onChange={(file) => handleFileChange(file, 'geoTaggedPhotos')}
            />
          </div>
          <div className="mt-6 flex items-center gap-x-6 relative left-96">
              <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                  <button 
                      type="submit" 
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onSubmit={handleSubmit}
                        >
                      Submit
                      </button>
          </div>
      
        </form>
      </div>
      {/* Submit Button */}
     
      
      <StatusDialog
        isVisible={statusPopup}
        title={title}
        subtitle={subtitle}
        buttonVisible={buttonVisible}
        status={isSuccess} // Pass success state

        onClose={() => setStatusPopup(false)}
      />
    </div>
  );
};

export default SecondTranche;
