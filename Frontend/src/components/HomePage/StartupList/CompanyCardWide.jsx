import React from 'react';
import { Link } from 'react-router-dom';

const CompanyCardWide = ({
  user_id,
  logo,
  fundingStatus,
  name,
  founder,
  founderLogo,
  startupSince,
  Category,
  tagline,
}) => {
  const dotColor = fundingStatus === 'Seed Funded' ? 'bg-green-500' : 'bg-red-500';

  return (
    <Link to={`/Startup/${user_id}`}>
      <div className="grid grid-cols-7 items-center bg-[#FAFAFA] p-2 rounded-lg border-2 border-[#F5F5F5] w-full sm:max-w-sm max-w-full transform transition-transform duration-300 hover:scale-105 cursor-pointer">
        {/* Logo Section */}
        <div className="col-span-2 flex justify-center items-center">
          <img
            src={logo}
            alt={name}
            className="h-20 w-20 rounded-full border-2"
            style={{ borderColor: '#4C51BF' }}
          />
        </div>

        {/* Details Section */}
        <div className="col-span-5 justify-between p-2">
          {/* Tagline */}
          <div className="flex items-center space-x-1 text-xs text-gray-600">
            <h3
              className="text-sm sm:text-base font-medium text-gray-700 text-justify italic"
            >
              “{tagline}”
            </h3>
          </div>

          {/* Founder & Company */}
          <div className="flex mt-4 items-center">
            <img
              src={founderLogo || "startup.png"}
              alt={name}
              className="h-9 w-9 rounded-full"
            />
            <div className="ml-2">
              <p className="text-xs sm:text-sm font-bold text-gray-800">{name}</p>
              <p className="text-xs sm:text-sm font-normal text-gray-800">
                {founder + ", Founder"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCardWide;