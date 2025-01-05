import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ user_id, status, statusColor, profileImage, companyName, founderName, since, sinceColor, category, categoryColor, moto }) => {
    const navigate = useNavigate();

    // Handle card click
    const handleCardClick = () => {
        navigate(`/Startup/${user_id}`);
    };


    return (
        <div className="bg-[#f7effd] rounded-lg p-6 w-60 h-80 flex flex-col "
        onClick={handleCardClick}>
            {/* Status Indicator 
            <div className="justify-start flex items-center space-x-2 mb-4">
                <span className={`w-3 h-3 ${statusColor} rounded-full`}></span>
                <span className="text-gray-600 text-sm">{status}</span>
            </div>
            */}

            <div className="text-center">
                <p
                    className="text-indigo-500 text-sm font-semibold italic overflow-hidden text-ellipsis line-clamp-2 h-[3rem]"
                    title={moto} // Shows the full moto on hover
                >
                    {`"${moto}"`}
                </p>
            </div>
            {/* Profile Picture */}
            <div className="flex justify-center mb-4">
                <img
                    src={profileImage}
                    alt="Profile"
                    className="rounded-full"

                    style={{ width: '110px', height: '110px', borderColor: '#4C51BF', borderWidth: '0px' }}
                />
            </div>

            {/* Company and Founder Information */}
            <div className="text-center mb-4">
                <h2 className="text-base font-bold text-gray-800">{companyName}</h2>
                <p className="text-gray-500 text-sm">{`Founder, ${founderName}`}</p>
            </div>

           {/* Additional Information */}
            <div className="flex text-center">
                <div className="flex items-center justify-start space-x-2 mr-2">
                    <span className={`w-3 h-3 ${sinceColor} rounded-full`}></span>
                    <span className="text-gray-600 text-sm">{`Since ${since}`}</span>
                </div>

                <div className="flex items-center justify-start space-x-2">
                    <span className={`w-3 h-3 ${categoryColor} rounded-full`}></span>
                    <span className="text-gray-600 text-sm">{category}</span>
                </div>
            </div>
            
        </div>
    );
};

export default ProfileCard;
