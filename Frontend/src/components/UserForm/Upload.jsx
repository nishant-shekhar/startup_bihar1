import React, { useState } from 'react';

const Upload = ({ label, onChange, name }) => {
  const [fileName, setFileName] = useState('No file chosen');

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    if (file) {
      setFileName(file.name); // Set the file name in the state
      onChange(file); // Pass the file to the parent component
    } else {
      setFileName('No file chosen'); // Fallback if no file is chosen
    }
  };

  return (
    <div className="col-span-full">
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
  
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
                className="sr-only" 
                onChange={handleFileChange} 
              /> 
            </label>
          </div>
          <p className="text-xs leading-5 text-gray-600 mt-1">Upload a file (up to 10MB)</p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
