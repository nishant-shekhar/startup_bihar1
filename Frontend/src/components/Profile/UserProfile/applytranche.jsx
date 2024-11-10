import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import apply_now from '../../../assets/apply_now_.png';

const Applytranche = ({ text, text1,navigateTo }) => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleClick = () => {
    navigate(navigateTo); // Programmatic navigation
  };

  return (
    <div
      className="w-72 h-30 flex relative justify-between items-start mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-900 to-purple-400 transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer" // Fixed width and height
      onClick={handleClick} // Trigger navigation on click
    >
      <div className="flex flex-col items-start">
        <span>{text ? <span className="text-white text-sm font-normal">{text}</span> : null}</span>
        <div className="w-8 h-1 mt-2 mb-2 bg-white rounded"></div> {/* Adjusted width of the divider */}
        <span>{text1 ? <span className="text-white text-xs font-normal leading-relaxed">{text1}</span> : null}</span>
      </div>
      <div className="flex flex-col justify-center items-center self-start">
        <img
          alt="image"
          src={apply_now}
          className="w-16 h-16 object-cover" // Adjusted image size
        />
      </div>
    </div>
  );
};

Applytranche.defaultProps = {
  text: undefined,
  text1: undefined,

};

Applytranche.propTypes = {
  
  text: PropTypes.string,
  text1: PropTypes.string,
  
};

export default Applytranche;
