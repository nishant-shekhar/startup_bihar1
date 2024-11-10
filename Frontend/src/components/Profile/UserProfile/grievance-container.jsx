import React from 'react';
import PropTypes from 'prop-types';
import apply_now from '../../../assets/apply_now_.png';
import { useNavigate } from 'react-router-dom';

const GrievanceContainer = ({ text, text1, navigateTo}) => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleClick = () => {
    navigate(navigateTo); // Programmatic navigation
  };
  return (
    <div className="w-72 h-30 cursor-pointer flex relative justify-between items-start mt-6 p-4 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 transition-transform duration-300 ease-in-out hover:scale-105" onClick={handleClick}> {/* Match width and height with Applytranche */}
      <div className="flex flex-col items-start">
        <span className="text-white text-sm">
          {text}
        </span>
        <div className="w-8 h-1 mt-2 mb-2 bg-white rounded"></div> {/* Adjusted width of the divider */}
        <span className="text-white text-xs">
          {text1}
        </span>
      </div>
      <div className="flex flex-col justify-center items-center self-start">
        <img
          alt="image"
          src={apply_now}
          className="w-16 h-16 object-cover" // Keep the image size consistent
        />
      </div>
    </div>
  );
};

GrievanceContainer.propTypes = {
  text: PropTypes.string.isRequired,
  text1: PropTypes.string.isRequired,
};

export default GrievanceContainer;
