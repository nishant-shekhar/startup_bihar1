import React, { useState } from "react";
import { FaBell } from 'react-icons/fa';
import { LogOut, Settings, ChevronDown, Menu } from 'lucide-react';

const AdminTopNavbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Left: Welcome Text */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Welcome, Admin</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your startup ecosystem</p>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">

        {/* DATE */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 font-medium hover:bg-gray-100 transition-colors">
          <span>{today}</span>
        </div>

        {/* NOTIFICATION BELL */}
        <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-150 group">
          <FaBell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            5 new notifications
          </div>
        </button>

        {/* SETTINGS */}
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-150 group">
          <Settings className="w-4 h-4" />

          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Settings
          </div>
        </button>

        {/* DIVIDER */}
        <div className="w-px h-6 bg-gray-200"></div>

        {/* PROFILE DROPDOWN */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 hover:bg-gray-50 rounded-lg transition-all duration-150 group"
          >
            <img
              src="https://img.freepik.com/premium-vector/male-face-avatar-icon-set-flat-design-social-media-profiles_1281173-3806.jpg?semt=ais_hybrid&w=740"
              alt="user"
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-medium text-gray-900">Mukesh Kumar</span>
              <span className="text-xs text-gray-500 -mt-0.5">Admin</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">Mukesh Kumar</p>
                <p className="text-xs text-gray-500">admin@startup.gov</p>
              </div>

              <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2 transition-colors">
                <Settings size={16} />
                Profile Settings
              </button>

              <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left flex items-center gap-2 transition-colors">
                <LogOut size={16} />
                Account Settings
              </button>

              <div className="border-t border-gray-100 p-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2 transition-colors font-medium"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTopNavbar;
