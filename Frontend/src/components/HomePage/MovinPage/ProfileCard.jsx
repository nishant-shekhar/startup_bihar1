import React from 'react';

const ProfileCard = ({ status, statusColor, profileImage, companyName, founderName, since, sinceColor, category, categoryColor }) => {
    return (
        <div className="bg-[#f7effd] rounded-lg p-6 w-60 h-80 flex flex-col">
            {/* Status Indicator */}
            <div className="justify-start flex items-center space-x-2 mb-4">
                <span className={`w-3 h-3 ${statusColor} rounded-full`}></span>
                <span className="text-gray-600 text-sm">{status}</span>
            </div>

            {/* Profile Picture */}
            <div className="flex justify-center mb-4">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="rounded-full"

                    style={{ width: '110px', height: '110px' ,borderColor: '#4C51BF',borderWidth:'5px'}}
                />
            </div>

            {/* Company and Founder Information */}
            <div className="text-start mb-4">
                <h2 className="text-base font-bold text-gray-800">{companyName}</h2>
                <p className="text-gray-500 text-sm">{`Founder, ${founderName}`}</p>
            </div>

            {/* Additional Information */}
            <div className="flex text-center">
                {/* Since Section */}
                <div className="flex items-center justify-start space-x-2 mr-2">
                    <span className={`w-3 h-3 ${sinceColor} rounded-full`}></span>
                    <span className="text-gray-600 text-sm">{`Since ${since}`}</span>
                </div>

                {/* Category Section */}
                <div className="flex items-center justify-start space-x-2">
                    <span className={`w-3 h-3 ${categoryColor} rounded-full`}></span>
                    <span className="text-gray-600 text-sm">{category}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
