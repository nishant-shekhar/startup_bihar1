import React, { useState } from 'react';

const DatePicker = ({ label, placeholder, value, onChange ,name}) =>{


  // State to store selected date
  

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Date input field */}
      <input 
        type="date"
        name={name}
        placeholder = {placeholder}
               className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
        value={value}
        onChange={onChange}
      />
      
      {/* Display selected date */}
    
    </div>
  );
};

export default DatePicker;
