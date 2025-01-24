import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Startupdetails from '../Design/startupdetails';
import './LeftBar.css';
import menu from '../../../../assets/menu.png';
import LogOutDailogBox from './LogoutDialog';
import axios from 'axios';
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
  FaCheckCircle,
} from 'react-icons/fa';

const menuItems = [
  { name: 'Home', panel: 'HomeSection', icon: <FaHome /> },
  { name: 'SSU', panel: 'SSU', icon: <FaUser /> },
];

const LeftBar = ({ changePanel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  // State for storing startup details
  const [startup, setStartup] = useState({});

  // Manage formsItems state
  const [formsItems, setFormsItems] = useState([
    { name: 'Startup Details Form', panel: 'StartupForm', icon: <FaFileAlt />, open: true },
    { name: 'Seed Fund Form', panel: 'SeedFund', icon: <FaFileAlt />, open: true },
    { name: 'Second Tranche Form', panel: 'SecondTranche', icon: <FaFileAlt />, open: true },
    { name: 'Post Seed Fund Form', panel: 'PostSeed', icon: <FaFileAlt />, open: true },
    { name: 'QPR Form', panel: 'Qpr', icon: <FaFileAlt />, open: true },
    { name: 'Matching Loan', panel: 'Matchingloan', icon: <FaHandshake />, open: true },
    { name: 'IPR Reimbursement Form', panel: 'Reimbursement', icon: <FaMoneyBill />, open: true },
    { name: 'Acceleration Programme', panel: 'Acceleration', icon: <FaRocket />, open: true },
    { name: 'Apply For Incubation', panel: 'Incubation',icon: <FaFileAlt />, open: true  },
    { name: 'Apply for Coworking', panel: 'Coworking', icon: <FaFileAlt />, open: true },
  ]);

  // Fetch the startup details
  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3007/api/userlogin/startup-details?user_id=${localStorage.getItem('user_id')}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      setStartup(response.data.startup);
      console.log(response.data)

      const { seedFundAmount, secondTrancheAmount, postSeedAmount } = response.data.startup;

      setFormsItems((prevItems) =>
        prevItems.map((item) => {
          if (item.panel === 'SeedFund' && seedFundAmount !== 0) {
            return { ...item, open: false, icon: <FaCheckCircle className="text-green-600" /> };
          }
          if (item.panel === 'SecondTranche' && secondTrancheAmount !== 0) {
            return { ...item, open: false, icon: <FaCheckCircle className="text-green-600" /> };
          }
          if (item.panel === 'PostSeed' && postSeedAmount !== 0) {
            return { ...item, open: false, icon: <FaCheckCircle className="text-green-600" /> };
          }
          return item;
        })
      );
      
    } catch (error) {
      if (error.response && error.response.status === 403) {
        // Invalid token: handle logout
        handleClose();
      } else {
        console.error("Failed to fetch startup details:", error);
      }
    }
  };

  // Load details on component mount
  useEffect(() => {
    fetchDetails();

    // Close sidebar if clicked outside
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dialog handling
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

  // Sidebar toggle
  const toggleSidebar = () => setIsOpen(!isOpen);

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
        <Startupdetails startup={startup} />

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
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </span>
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
                if (item.open) {
                  setSelectedItem(item.panel);
                  changePanel(item.panel);
                }
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-md ${
                selectedItem === item.panel ? 'bg-gray-500' : 'hover:bg-gray-500'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </span>
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
