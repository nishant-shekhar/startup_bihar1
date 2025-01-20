import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Startupdetails from '../Design/startupdetails';
import './LeftBar.css';
import menu from '../../../../assets/menu.png';
import LogOutDailogBox from './LogoutDialog';

// Import the icons you need from react-icons
import {
  FaLightbulb,
  FaHandshake,
  FaRocket,
  FaFileAlt,
  FaQuestionCircle,
  FaDoorOpen,
  FaHome,
  FaUser,
  FaMoneyBill,

} from 'react-icons/fa';

// Define your menu items, but use React Icon components directly
const menuItems = [
  { name: 'Home', panel: 'HomeSection', icon: <FaHome /> },
  { name: 'SSU', panel: 'SSU', icon: <FaUser /> },
];

// Define your forms items, again using React Icon components
const formsItems = [
  { name: 'Startup Details Form', panel: 'StartupForm', icon: <FaFileAlt /> },
  { name: 'Seed Fund Form', panel: 'SeedFund', icon: <FaFileAlt /> },
  { name: 'Second Tranche Form', panel: 'SecondTranche', icon: <FaFileAlt /> },
  { name: 'Post Seed Fund Form', panel: 'PostSeed', icon: <FaFileAlt /> },
  { name: 'QPR Form', panel: 'Qpr', icon: <FaFileAlt /> },
  { name: 'Matching Loan', panel: 'Matchingloan', icon: <FaHandshake /> },
  { name: 'IPR Reimbursement Form', panel: 'Reimbursement', icon: <FaMoneyBill /> },
  { name: 'Acceleration Programme', panel: 'Acceleration', icon: <FaRocket /> },
];

const LeftBar = ({ changePanel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const handleLogoutClick = () => {
    setIsDialogVisible(true);
  };

  const handleCancel = () => {
    setIsDialogVisible(false);
  };

  const handleClose = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    setIsDialogVisible(false);
    navigate('/login');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Button to toggle sidebar (mobile view) */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 z-50 md:hidden p-2 bg-gray-200 rounded"
      >
        <img src={menu} alt="menu icon" className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-[#1c2437] text-[#f5f7f6] h-screen overflow-y-scroll overflow-x-hidden flex flex-col justify-between p-4
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 fixed md:static`}
        style={{ width: isOpen ? '60%' : '22%' }}
      >
        <Startupdetails
          founderimage="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FPink%20Marble%20Background%20Reminder%20Instagram%20Post%20(1).png?alt=media&token=dd704bc5-5cc1-48f4-a80a-a8ec12fa9512"
          companyname=""
          year=""
        />

        {/* Menu section */}
        <div className="flex flex-col space-y-4 mb-4">
          <span className="text-sm font-semibold">Menu</span>
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedItem(item.panel);
                changePanel(item.panel);
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-md ${
                selectedItem === item.panel ? 'bg-gray-500' : 'hover:bg-gray-500'
              }`}
            >
              <span className="flex items-center space-x-2">
                {/* Render the React Icon */}
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </span>

              {/* Optional: If there's any notificationCount, show it */}
              {item.notificationCount && (
                <span className="bg-red-500 text-xs font-bold px-2 py-1 rounded-full">
                  {item.notificationCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <hr className="border-t border-gray-600 mb-2" />

        {/* Forms section */}
        <div className="flex flex-col space-y-4 mb-8">
          {formsItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedItem(item.panel);
                changePanel(item.panel);
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-md ${
                selectedItem === item.panel ? 'bg-gray-500' : 'hover:bg-gray-500'
              }`}
            >
              <span className="flex items-center space-x-2">
                {/* Render the React Icon */}
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </span>
              {item.notificationCount && (
                <span className="bg-red-500 text-xs font-bold px-2 py-1 rounded-full">
                  {item.notificationCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <hr className="border-t border-gray-600 my-2" />

        {/* Help & Logout */}
        <div>
          <Link
            to="/contact-us"
            className="flex items-center justify-between px-3 py-4 rounded-md hover:bg-gray-500"
          >
            <span className="flex items-center space-x-2">
              <FaQuestionCircle className="text-xl" />
              <span>Help</span>
            </span>
          </Link>
          <button
            onClick={handleLogoutClick}
            className="flex items-center justify-between px-3 py-4 hover:bg-gray-500 rounded-md"
          >
            {/* React icon for Logout */}
            <FaDoorOpen className="text-xl" />
            <span className="ml-2">Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Dialog Box */}
      <LogOutDailogBox
        isVisible={isDialogVisible}
        title="Confirm Logout"
        subtitle="Are you sure you want to log out?"
        buttonVisible={true}
        status="warning"
        actionButton="Logout"
        cancelButton="Cancel"
        onClose={handleClose}
        onCancel={handleCancel}
      />
    </>
  );
};

export default LeftBar;
