import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardPage from "./DashboardPage";

import Navbar from "./NavbarAdmin";

function DashboardAdmin() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <DashboardPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 ">
      {/* Left Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Right Section */}
      <div className="flex-1 relative bg-gradient-to-br from-[#f3e8ff] via-[#e0f2f1] to-[#fce4ec]">
        {/* Navbar only inside this right area */}
        <div className="fixed top-0 left-64 right-0 z-30 flex items-center px-6">
          <Navbar />
        </div>

        {/* Page Content */}
        <div className="pt-24 p-6">{renderPage()}</div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
