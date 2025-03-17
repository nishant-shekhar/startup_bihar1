import React, { useState } from 'react';

const Upload = ({ label, onChange, name, allowImages = false }) => {
  const [fileName, setFileName] = useState('No file chosen');
  const [error, setError] = useState(''); // To store error message for file validation

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // Check if file size exceeds 5MB
        setError('File size exceeds 4MB. Please upload a smaller file.');
        setFileName('No file chosen'); // Reset file name
        onChange(null); // Reset file in parent
      } else {
        setError(''); // Clear any previous error
        setFileName(file.name); // Set the file name in the state
        onChange(file); // Pass the file to the parent component
      }
    } else {
      setFileName('No file chosen'); // Fallback if no file is chosen
      setError(''); // Clear any previous error
      onChange(null); // Reset file in parent
    }
  };

  // Determine the accepted file types based on the allowImages parameter
  const acceptedTypes = allowImages ? ".png,.jpg,.jpeg" : ".pdf";

  return (
    <div className="col-span-full">
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>

      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-4 min-h-[4rem] max-h-[6rem]">
        <div className="text-center flex flex-col items-center justify-center">
          <div className="mt-2 flex text-sm text-gray-600">
            <label
              htmlFor={name}
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>{fileName}</span> {/* Display file name */}
              <input
                id={name}
                name={name}
                type="file"
                accept={acceptedTypes} // Dynamically set accepted file types
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
      </div>
      {error && <p className="text-red-600 mt-2 text-sm">{error}</p>} {/* Display error */}
    </div>
  );
};

export default Upload;
