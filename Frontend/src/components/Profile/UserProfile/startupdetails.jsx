import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SocialMediaIcons from './SocialMediaIcons';

const Startupdetails = ({ founderimage, companyname, year }) => {
  const [foundername, setFounderName] = useState('');

  useEffect(() => {
    // Retrieve founder name from localStorage
    const storedFounderName = localStorage.getItem('user_id');
    if (storedFounderName) {
      setFounderName(storedFounderName);
    }
  }, []);

  return (
    <div className="mb-4 p-4 max-w-full md:max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row items-start justify-between w-full space-y-4 md:space-y-0 md:space-x-6">
        
        {/* Founder Profile Section */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="flex-shrink-0">
            <img
              alt="Founder"
              src={founderimage || 'https://via.placeholder.com/80'} // Fallback image if founderimage is not provided
              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-400"
            />
          </div>

          <div className="flex flex-col overflow-hidden">
            <p className="text-sm md:text-base  truncate">Welcome back,</p>
            <h1 className="text-lg md:text-xl font-bold  truncate">{foundername || 'Loading...'}</h1>
            <p className="text-sm md:text-lg  truncate">Founder, {companyname || 'Company Name'}</p>
            <div className="flex items-center space-x-2 mt-1 text-xs md:text-sm ">
              <span>• Startup</span>
              <span>• Since {year || 'Year'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Icons Section */}
      <div className="mt-4 flex justify-center">
        <SocialMediaIcons />
      </div>
    </div>
  );
};

// Define default prop values
Startupdetails.defaultProps = {
  founderimage: 'https://via.placeholder.com/80', // Default image placeholder
  companyname: 'Unknown Company',
  year: 'N/A',
};

// Define prop types for type checking
Startupdetails.propTypes = {
  founderimage: PropTypes.string,
  companyname: PropTypes.string,
  year: PropTypes.string,
};

export default Startupdetails;
