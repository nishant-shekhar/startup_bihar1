import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Startupdetails from '../Design/startupdetails';
import './LeftBar.css';
import menu from '../../../../assets/menu.png';
import axios from 'axios';

const menuItems = [
    { name: 'Home', panel: 'HomeSection', iconClass: 'fas fa-chart-bar' },
    { name: 'SSU', panel: 'ssu', iconClass: 'fas fa-chart-bar' },

];
const formsItems = [
    
    { name: 'Startup Details', panel: 'StartupForm', iconClass: 'fas fa-lightbulb' },
    { name: 'SeedFund', panel: 'SeedFund', iconClass: 'fas fa-lightbulb' },
    { name: 'Second Tranche', panel: 'SecondTranche', iconClass: 'fas fa-lightbulb' },

    { name: 'Post Seed Fund', panel: 'PostSeed', iconClass: 'fas fa-lightbulb' },
    { name: 'QPR', panel: 'Qpr', iconClass: 'fas fa-file-alt' },

    { name: 'Matching Loan', panel: 'Matchingloan', iconClass: 'fas fa-handshake' },

    { name: 'Incubation', panel: 'Incubation', iconClass: 'fas fa-seedling' },

    { name: 'Matching Loan', panel: 'Matchingloan', iconClass: 'fas fa-handshake' },
    { name: 'Reimbursement Form', panel: 'Reimbursement', iconClass: 'fas fa-dollar-sign' },

    { name: 'Apply For Incubation', panel: 'Incubation', iconClass: 'fas fa-seedling' },
    { name: 'Apply for Coworking', panel: 'Coworking', iconClass: 'fas fa-building' },
    { name: 'Acceleration Programme', panel: 'Acceleration', iconClass: 'fas fa-rocket' },
];

const LeftBar = ({ changePanel }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            navigate('/login');
        }
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

    /*const checkDocumentStatus = async (url) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(url, {
                headers: { Authorization: token },
            });
            const { document } = response.data;
    
            if (document.documentStatus === null) {
                // If document status is null, open the 'StartupForm' panel
                changePanel('StartupForm');
            } else {
                // Set the message based on the document status
                const statusMessages = {
                    created: "Document Status: Initiated - Your document is under review.",
                    accepted: "Document Status: Accepted - Your document has been approved.",
                    rejected: "Document Status: Rejected - Your document has been rejected.",
                };
    
                const statusMessage = statusMessages[document.documentStatus];
                
                if (statusMessage) {
                    // Open the "Accepted" panel with the valid status message
                    changePanel("Accepted", {
                        statusText: statusMessage
                    });
                } else {
                    // If document status is not one of the specified statuses, open 'StartupForm' panel
                    changePanel('StartupForm');
                }
            }
        } catch (error) {
            console.error('Error fetching document status:', error);
    
            // If there’s an error, open the "StartupForm" panel
            changePanel('StartupForm');
        }
    };*/
    

    return (
        <>
            <button onClick={toggleSidebar} className="absolute top-4 left-4 z-50 md:hidden p-2 bg-gray-200 rounded">
                <img src={menu} alt="menu icon" className="h-6 w-6" />
            </button>

            <div
                ref={sidebarRef}
                className={`bg-[#1c2437] text-[#f5f7f6] h-screen overflow-y-scroll overflow-x-hidden flex flex-col justify-between p-4 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 fixed md:static`}
                style={{ width: isOpen ? '60%' : '22%' }}
            >
                <div className="flex items-center space-x-2 mb-8">
                    <img
                        alt="logo"
                        src="https://startup.bihar.gov.in/static/media/new_logo.efdd49a20c5fb7fe0b73.png"
                        className="h-8"
                    />
                </div>
                
                <Startupdetails
                    founderimage="https://cdn.brandfetch.io/massart.edu/fallback/transparent/theme/dark/h/512/w/512/icon?t=1719560097892"
                    companyname="AgriTech Firm Pvt Ltd"
                    year="2000"
                />
               

                <div className="flex flex-col space-y-4 mb-8">
                    <span className="text-sm font-semibold">Menu</span>
                    {menuItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setSelectedItem(item.panel);
                                changePanel(item.panel);
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-md ${selectedItem === item.panel ? 'bg-gray-500' : 'hover:bg-gray-500'}`}
                        >
                            <span className="flex items-center space-x-2">
                                <i className={item.iconClass}></i>
                                <span>{item.name}</span>
                            </span>
                            {item.notificationCount && (
                                <span className="bg-red-500 text-xs font-bold px-2 py-1 rounded-full">{item.notificationCount}</span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col space-y-4 mb-8">
                    <span className="text-sm font-semibold">Forms </span>
                    {formsItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setSelectedItem(item.panel);
                                changePanel(item.panel);
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-md ${selectedItem === item.panel ? 'bg-gray-500' : 'hover:bg-gray-500'}`}
                        >
                            <span className="flex items-center space-x-2">
                                <i className={item.iconClass}></i>
                                <span>{item.name}</span>
                            </span>
                            {item.notificationCount && (
                                <span className="bg-red-500 text-xs font-bold px-2 py-1 rounded-full">{item.notificationCount}</span>
                            )}
                        </button>
                    ))}
                </div>
               
                
                <hr className="border-t border-gray-600 my-2" />
                
                <div>
                    <Link to="/" className="flex items-center justify-between px-3 py-4 rounded-md hover:bg-gray-500">
                        <span className="flex items-center space-x-2">
                            <i className="fas fa-question-circle"></i>
                            <span>Help</span>
                        </span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center justify-between px-3 py-4 hover:bg-gray-500 rounded-md">
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="ml-2">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default LeftBar;
