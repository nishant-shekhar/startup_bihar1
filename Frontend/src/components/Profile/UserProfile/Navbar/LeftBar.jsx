import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests
import Startupdetails from '../startupdetails';
import './LeftBar.css';
import menu from '../../../../assets/menu.png';

const LeftBar = () => {
    const [isOpen, setIsOpen] = useState(false); // Sidebar visibility state
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the authentication token
        navigate('/login'); // Redirect to login page
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen); // Toggle sidebar visibility
    };

    // Function to check document status when "First Tranche" is clicked
    const checkDocumentStatus = async (url) => {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        try {
            const response = await axios.get(url, {
                headers: { Authorization: token },
            });
            const { document } = response.data;
    
            if (document && document.documentStatus) {
                // Check the status and perform actions based on each status
                if (document.documentStatus === 'created') {
                    alert('Document Status: Created - Your document is under review.');
                    // Perform any other action you need for "created" status
                } else if (document.documentStatus === 'accepted') {
                    alert('Document Status: Accepted - Your document has been approved.');
                    // Perform any other action you need for "accepted" status
                } else if (document.documentStatus === 'rejected') {
                    alert('Document Status: Rejected - Your document has been rejected.');
                    // Perform any other action you need for "rejected" status
                } else {
                    alert(`Document Status: ${document.documentStatus} - Unknown status.`);
                }
            } else {
                alert('No document found for this user.');
            }
        } catch (error) {
            console.error('Error fetching document status:', error);
            alert('Failed to retrieve document status.');
        }
    };
    

    // Close sidebar when clicking outside
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
            {/* Toggle Button for Smaller Screens */}
            <button 
                onClick={toggleSidebar} 
                className="absolute top-4 left-4 z-50 md:hidden p-2 bg-gray-200 rounded"
            >
                <img src={menu} alt="menu icon" className="h-6 w-6"/>
            </button>

            {/* Sidebar with smooth animation */}
            <div
                ref={sidebarRef}
                className={`bg-[#1c2437] text-[#f5f7f6] h-screen overflow-y-scroll overflow-x-hidden flex flex-col justify-between p-4 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static`}
                style={{
                    width: isOpen ? (window.innerWidth < 768 ? '60%' : window.innerWidth < 1024 ? '40%' : '20%') : '20%',
                }}
            >
                {/* Logo Section */}
                <div className="flex items-center space-x-2 mb-8">
                    <img
                        alt="logo"
                        src="https://startup.bihar.gov.in/static/media/new_logo.efdd49a20c5fb7fe0b73.png"
                        className="h-8"
                    />
                    <span className="text-xl font-bold"></span>
                </div>
                <Startupdetails
                    founderimage="https://cdn.brandfetch.io/massart.edu/fallback/transparent/theme/dark/h/512/w/512/icon?t=1719560097892"
                    companyname="AgriTech Firm pvt ltd"
                    year="2000"
                />

                {/* Menu Section */}
                <div className="flex flex-col space-y-4 mb-8">
                    <span className="text-sm font-semibold">Menu</span>
                    <Link to="/Userprofile" className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-500">
                        <span className="flex items-center space-x-2">
                            <i className="fas fa-chart-bar"></i>
                            <span>Home</span>
                        </span>
                    </Link>
                    <Link to="/" className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-500">
                        <span className="flex items-center space-x-2">
                            <i className="fas fa-chart-barr"></i>
                            <span>SSU</span>
                        </span>
                    </Link>
                    <Link to="/matchingloan" className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-500">
                        <span className="flex items-center space-x-2">
                            <i className="fas fa-chart-barrr"></i>
                            <span>Matching Loan</span>
                        </span>
                    </Link>
                    <Link to="/notification" className="flex items-center justify-between px-3 py-2 hover:bg-gray-500 rounded-md">
                        <span className="flex items-center space-x-2">
                            <i className="fas fa-bell"></i>
                            <span>Notification</span>
                        </span>
                        <span className="bg-red-500 text-xs font-bold px-2 py-1 rounded-full">21</span>
                    </Link>
                    <Link to="/incubation" className="flex items-center px-3 py-2 hover:bg-gray-500 rounded-md">
                        <i className="fas fa-lightbulb"></i>
                        <span className="ml-2">Incubation</span>
                    </Link>
                    <Link to="/seedfunded" className="flex items-center px-3 py-2 hover:bg-gray-500 rounded-md">
                        <i className="fas fa-lightbulbb"></i>
                        <span className="ml-2">SeedFund</span>
                    </Link>
                    <Link to="/qpr" className="flex items-center px-3 py-2 hover:bg-gray-500 rounded-md">
                        <i className="fas fa-file-alt"></i>
                        <span className="ml-2">QPR</span>
                    </Link>
                    <Link to="/reimbursement" className="flex items-center px-3 py-2 hover:bg-gray-500 rounded-md">
                        <i className="fas fa-dollar-sign"></i>
                        <span className="ml-2">Reimbursement</span>
                    </Link>
                    <Link to="/coworking" className="flex items-center px-3 py-2 hover:bg-gray-500 rounded-md">
                        <i className="fas fa-building"></i>
                        <span className="ml-2">Coworking</span>
                    </Link>
                    <Link to="/acceleration" className="flex items-center px-3 py-2 hover:bg-gray-500 rounded-md">
                        <i className="fas fa-rocket"></i>
                        <span className="ml-2">Acceleration</span>
                    </Link>
                </div>

                {/* Group Section */}
                <div className="flex flex-col space-y-4 mb-8">
                    <span className="text-sm font-semibold">Group</span>
                    <Link to="/StartupForm" onClick={checkDocumentStatus('http://localhost:3000/api/StartupProfile/user-document')} className="flex items-center px-3 py-2 hover:bg-gray-500 rounded-md">
                        <i className="fas fa-rockett"></i>
                        <span className="ml-2">First Tranche</span>
                    </Link>
                    <Link to="/SecondTrance" className="flex items-center px-3 py-2 hover:bg-gray-500 rounded-md">
                        <i className="fas fa-rockettt"></i>
                        <span className="ml-2">Second Tranche</span>
                    </Link>
                </div>
                <hr className="border-t border-gray-600 my-2 " />
                <div>
                    <Link to="/" className="flex items-center justify-between px-3 py-4 rounded-md hover:bg-gray-500">
                        <span className="flex items-center space-x-2">
                            <i className="fas fa-chart-barrrrr"></i>
                            <span>Help</span>
                        </span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center justify-between px-3 py-4 hover:bg-gray-500 rounded-md">
                        <i className="fas fa-sign-out-altttt"></i>
                        <span className="ml-2">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default LeftBar;
