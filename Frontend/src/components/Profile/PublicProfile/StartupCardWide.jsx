import React from 'react';
import { Link } from 'react-router-dom';



const StartupCardWide = ({ logo, fundingStatus, name, founder, founderLogo,startupSince, Category, tagline }) => {
  const dotColor = fundingStatus === 'Seed Funded' ? 'bg-green-500' : 'bg-red-500';

  return (
    <Link to="/Profile">
      <div className="grid grid-cols-7 items-center bg-[#FAFAFA] p-2 rounded-lg border-2 border-[#F5F5F5] w-full max-w-sm transform transition-transform duration-300 hover:scale-105 focus:scale-105 cursor-pointer">
        {/* Image Section */}
        <div className="col-span-2 flex justify-center items-center">
          <img
            src={logo} // founder's image
            alt={name}
            className="h-20 w-20 rounded-full border-2" // 80px * 80px image
            style={{ borderColor: '#4C51BF' }} // Border color
          />
        </div>

        {/* Company Details Section */}
        <div className="col-span-5 justify-between p-2 ">
          {/* Funding Status and Small Details */}
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <h3 className="text-sm font-medium text-gray-700 text-justify" style={{ fontStyle: 'italic' }}>
              {"\"" + tagline + "\""}
            </h3>
          </div>
          <div className="flex mt-4 items-center ">
          <img
            src={founderLogo} // founder's image
            alt={name}
            className="h-9 w-9 rounded-full" // 80px * 80px image
          />

          {/* Founder and Company Name */}
          <div className="justify-between mx-2 "> {/* Adjusted height for content */}
            <p className="text-sm font-bold text-gray-800">{name}</p>
            <p className="text-sm font-normal text-gray-800">{founder + ", Founder"}</p>
          </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StartupCardWide;
