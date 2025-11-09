// mainAdmin.jsx
import React, { useState } from 'react';
import AdminLeftbar from './AdminLeftBar';
import AdminTopNavbar from './AdminTopNavbar';
import Render1 from './Render1';

const MainAdmin = () => {
  const [activePanel, setActivePanel] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePanelChange = (panel) => {
    setActivePanel(panel);
    setSelectedRowData(null);
    setIsSidebarOpen(false);
  };

  // ✅ Make sure this function is defined
  const handleRowClick = (rowData) => {
    setSelectedRowData(rowData);
  };

  // ✅ Make sure this function is defined
  const handleBackToTable = () => {
    setSelectedRowData(null);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-100">
      <div className="w-full">
        <AdminTopNavbar toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white shadow-lg transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <AdminLeftbar changePanel={handlePanelChange} />
        </div>

        <div className="flex-1 text-white overflow-y-auto">
          <Render1 
            activePanel={activePanel} 
            selectedRowData={selectedRowData}
            onRowClick={handleRowClick}  // ✅ Pass function
            onBack={handleBackToTable}   // ✅ Pass function
          />
        </div>
      </div>
    </div>
  );
};

export default MainAdmin;
