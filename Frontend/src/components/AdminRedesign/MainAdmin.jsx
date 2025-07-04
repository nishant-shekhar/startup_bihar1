// mainAdmin.jsx
import React, { useState } from 'react';
import AdminLeftbar from './adminLeftbar';
import AdminTopNavbar from './adminTopNavbar';
import Render1 from './render1';

const MainAdmin = () => {
  const [activePanel, setActivePanel] = useState("Startup Profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePanelChange = (panel) => {
    setActivePanel(panel);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-100">
      {/* Top Navbar */}
      <div className="w-full">
        <AdminTopNavbar toggleSidebar={toggleSidebar} />
      </div>

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white  shadow-lg transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <AdminLeftbar changePanel={handlePanelChange} />
        </div>

        {/* Main Render Area */}
        <div className="flex-1  text-white overflow-y-auto">
          <Render1 activePanel={activePanel} />
        </div>
      </div>
    </div>
  );
};

export default MainAdmin;