import React, { useState } from 'react';
import Upload from './Upload'; // Make sure to adjust the import path if necessary
import { useFormik } from 'formik';

const SecondTrance = () => {
  const [uploadedFiles, setUploadedFiles] = useState({
    utilizationCertificate: null,
    statusReport: null,
    expenditurePlan: null,
    bankStatement: null,
    expenditureInvoice: null,
    geoTaggedPhotos: null,
  });

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
      const formData = new FormData();
      
      // Only append files that are not null
      Object.entries(uploadedFiles).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });

      try {
        const response = await fetch('http://localhost:3007/api/second-tranche', {
          method: 'POST',
          headers: {
            Authorization: `${localStorage.getItem('token')}`, // Adjust according to your token storage
          },
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          alert('Form submitted successfully!');
          console.log(data);
        } else {
          alert('Error: ' + data.error);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred while submitting the form.');
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
      <div className="flex w-full max-w-5xl mt-10 space-x-10">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="w-1/2 p-8 rounded-lg">
          <h3 className="font-semibold text-xl mb-6">Application Form for Second Tranche</h3>

          {/* Registration Number Field */}
          <div className="mb-6">
            <Upload 
              label="C.A certified utilization certificate"
              name="utilizationCertificate"
              onChange={(file) => handleFileChange(file, 'utilizationCertificate')}
            />
          </div>

          {/* Status Report Field */}
          <div className="mb-6">
            <Upload 
              label="Status Report"
              name="statusReport"
              onChange={(file) => handleFileChange(file, 'statusReport')}
            />
          </div>

          {/* Expenditure Plan Field */}
          <div className="mb-6">
            <Upload 
              label="Upload Self-declared second tranche expenditure plan in the letterhead of the entity"
              name="expenditurePlan"
              onChange={(file) => handleFileChange(file, 'expenditurePlan')}
            />
          </div>
        </form>

        {/* Right Form (Optional, if needed) */}
        <form onSubmit={handleSubmit} className="w-1/2 p-8 mt-11 rounded-lg">
          {/* Bank Statement Field */}
          <div className="mb-6">
            <Upload 
              label="Bank statement (Highlight the fund received and expenditure made)"
              name="bankStatement"
              onChange={(file) => handleFileChange(file, 'bankStatement')}
            />
          </div>

          {/* Expenditure Invoice Field */}
          <div className="mb-6">
            <Upload 
              label="Upload Expenditure Invoice"
              name="expenditureInvoice"
              onChange={(file) => handleFileChange(file, 'expenditureInvoice')}
            />
          </div>

          {/* Geo-tagged Photos Field */}
          <div className="mb-6">
            <Upload 
              label="Upload geo-tagged photos of your offices/ units"
              name="geoTaggedPhotos"
              onChange={(file) => handleFileChange(file, 'geoTaggedPhotos')}
            />
          </div>
        </form>
      </div>
      {/* Submit Button */}
      <button onClick={handleSubmit} className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg bg-blue-500 text-white hover:bg-blue-600">
        Submit
      </button>
    </div>
  );
};

export default SecondTrance;
