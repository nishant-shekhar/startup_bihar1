import React, { useState } from "react";
import { FaBell } from 'react-icons/fa';
import { LogOut } from 'lucide-react'; // Logout icon (already there as SVG, but now optional)
import { Pencil } from 'lucide-react'; // ✏️ Edit icon from Lucide



const AdminTopNavbar = () => {

 
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handleLogout = () => {
    console.log("User logged out");
  };

 

  return (
    <div className="h-16 flex items-center justify-between px-6 text-white w-full bg-gray-900">
      <h2 className="text-xl font-semibold text-white">Welcome! Admin</h2>

      <div className="flex items-center space-x-6 ">
       


        {/* TIMESTAMP */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 px-4 py-3 rounded-full">
          <span className="text-sm text-gray-200">{today}</span>
        </div>

        {/* NOTIFICATION */}
        <button className="relative bg-white/10 backdrop-blur-md border border-white/30 rounded-full p-2">
          <FaBell className="w-8 h-8 text-gray-50 hover:text-purple-500" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></span>
        </button>

        {/* PROFILE */}
        <div className="flex items-center gap-3 border bg-white/10 backdrop-blur-md border-white/30 py-1 px-3 rounded-full ">
          <img
            src="https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740"
            alt="user"
            className="w-10 h-10 rounded-full shadow-md"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-200">Mukesh Kumar</span>
            <p className="text-xs text-gray-400 -mt-1">Admin</p>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          className="group flex items-center justify-start w-11 h-11 bg-purple-500 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-full active:translate-x-1 active:translate-y-1"
          onClick={handleLogout}
        >
          <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
            <LogOut size={16} className="text-white" />
          </div>
          <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            Logout
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminTopNavbar;
