import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [adminDetails, setAdminDetails] = useState({
    name: "",
    role: "",
    startup: "",
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const fetchAdminDetails = async () => {
      const data = {
        name: "Srishti",
        role: "Founder, Srishti.com",
        startup: "Startup • Since 2004",
      };

      setAdminDetails(data);
    };

    fetchAdminDetails();
  }, []);

  return (
    <div
      className={`  ${isDarkMode ? "bg-gray-900" : "bg-white"
        } transition duration-500`}
    >
      <nav
        className={`w-64 h-screen overflow-auto  p-4 font-mont-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          } transition duration-500`}
      >
        <div className="flex items-center mb-6">
          <div
            className={`w-10 h-10 ${isDarkMode ? "bg-blue-500" : "bg-blue-700"
              } rounded-full flex items-center justify-center`}
          >
            <span className="text-white font-bold text-lg">
              {adminDetails.name[0]}{" "}
            </span>
          </div>
          <div className="ml-3 py-5 ">
            <h2 className="text-xl font-mont">{adminDetails.name}</h2>
            <p className="text-lg">{adminDetails.role}</p>
            <p className="text-xs text-gray-400">{adminDetails.startup}</p>
          </div>
        </div>

        <div className="mb-6 py-15">
          <input
            type="text"
            placeholder="Search..."
            className={`w-full p-2 ${isDarkMode
              ? "bg-gray-800 text-gray-300"
              : "bg-gray-200 text-gray-900"
              } rounded-md focus:outline-none`}
          />
        </div>

        <ul className="space-y-4">
          <li>
            <Link
              to="/startupProfile"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Startup Profile
            </Link>
          </li>
          <li>
            <Link
              to="/seedFund"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Seed Fund Module
            </Link>
          </li>
          <li>
            <Link
              to="/secondTranche"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Second Tranche Module
            </Link>
          </li>
          <li>
            <Link
              to="/postSeedFund"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Post Seed Fund Module
            </Link>
          </li>
          <li>
            <Link
              to="/qprModule"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              QPR Module
            </Link>
          </li>
          <li>
            <Link
              to="/AdminmatchingLoan"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Matching Loan
            </Link>
          </li>
          <li>
            <Link
              to="/incubationModule"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Incubation Module
            </Link>
          </li>
          <li>
            <Link
              to="/accelerationAdmin"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Acceleration Programme Module
            </Link>
          </li>
          <li>
            <Link
              to="/iprReimbursement"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              IPR Reimbursement Module
            </Link>
          </li>
          <li>
            <Link
              to="/coworkingModule"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Coworking Module (BHUB)
            </Link>
          </li>
          <li>
            <Link
              to="/startupList"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Startup List
            </Link>
          </li>
          <li>
            <Link
              to="/dataMining"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Data Mining
            </Link>
          </li>
          <li>
            <Link
              to="/mentorsList"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Mentors List
            </Link>
          </li>
          <li>
            <Link
              to="/grievanceRedressal"
              className="block py-2 px-4 rounded-md hover:bg-gray-700"
            >
              Grievance Redressal System
            </Link>
          </li>
        </ul>

        <div className="mt-6">
          <button
            onClick={toggleDarkMode}
            className={`w-full p-3 rounded-lg flex justify-between items-center ${isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
          >
            <span>{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
            <span
              className={`material-icons ${isDarkMode ? "text-yellow-300" : "text-gray-900"
                }`}
            >
              {isDarkMode ? "brightness" : "wb_sunny"}
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
