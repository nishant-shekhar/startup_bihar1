import React from 'react';
import { useNavigate } from 'react-router-dom';

const Mpr =({navigateTo}) => {
  const navigate = useNavigate(); // useNavigate hook for navigation

  const handleClick = () => {
    navigate(navigateTo); // Programmatic navigation
  };

  return (
    <div className=''
    onClick={handleClick} >
        <div className='mb-4'>Upload MPR</div>
    <button className="border-blue-700 hover:bg-blue-700 text-[#fff1f2] font-bold py-2 px-8 rounded-full border">
    MPR
    </button>
    </div>
  );
}

export default Mpr;