import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import SecondTrance from "../../UserForm/SecondTrance";
import PostSeed from "../../UserForm/PostSeed";
import Qpr from "../../UserForm/Qpr";
import Matchingloan from "../../UserForm/Matchingloan";
import Incubation from "../../UserForm/Incubation";
import Acceleration from "../../UserForm/Acceleration";
import Reimbursement from "../../UserForm/Reimbursement";
import Coworking from "../../UserForm/Coworking";
import UserProfile from "./Home";
import Grievance from "../../UserForm/Grievance";
import LeftBar from "./Navbar/LeftBar";
import SeedFunded from "../../UserForm/SeedFunded";
import Upload from "../../UserForm/Upload";
import StartupForm from "../../UserForm/Startupform";
import FormAccepted, { App } from "../../UserForm/FormAccepted";
import HomeSection from "./HomeSection";


const StartupProfileMain = () => {
    const [activePage, setActivePage] = useState('UserProfile');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDocumentChecking, setIsDocumentChecking] = useState(false);
    const [statusMessage, setStatusMessage] = useState('Checking form status...');
    const [statusColor, setStatusColor] = useState('text-black');
    const [timer, setTimer] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    // Function to handle panel change after status check
    const changePanel = async (newPanel) => {
        if (isFormPanel(newPanel)) {
            setIsDocumentChecking(true);
            const token = localStorage.getItem('token');
            if (!token) {
                return 'noToken';
            }
            // Check form status by calling the document status check logic
            try {
                const response = await axios.get('http://localhost:3007/api/StartupProfile/user-document', {
                    headers: { Authorization: token },
                });

                console.log("Response received:", response.data);

                const { document } = response.data;

                // Set the message based on the document status
                const formStatus=document.documentStatus;
                if (formStatus === 'null') {
                    setActivePage(newPanel);
                } else if (formStatus === 'Accepted') {
                    setStatusMessage('Form is accepted.');
                    setStatusColor('text-green-500');
                } else if (formStatus === 'Rejected') {
                    setStatusMessage('Form is rejected. Moving to page to refill the form.');
                    setStatusColor('text-red-500');
                    startTimer(newPanel);
                } else if (formStatus === 'created' || formStatus === 'Updated') {
                    setStatusMessage('Form is under review.');
                    setStatusColor('text-black');
                }

                //setStatusMessage(document.documentStatus || "Document status is unknown.");

            } catch (error) {
                console.error('Error fetching document status:', error);
                setStatusMessage("Failed to retrieve document status.");
            }
            
        } else {
            // Directly change to non-form panel
            setActivePage(newPanel);
        }
    };

   

    // Function to determine if the selected panel is a form
    const isFormPanel = (panel) => {
        const formPanels = [
            'SecondTranche',
            'Qpr',
            'Matchingloan',
            'Incubation',
            'Acceleration',
            'Reimbursement',
            'Coworking',
            'StartupForm',
            'Grievance',
            'Mpr',
            'PostSeed',
            'Query',
        ];
        return formPanels.includes(panel);
    };

    // Timer to redirect after rejection
    const startTimer = (newPanel) => {
        let countdown = 5;
        const interval = setInterval(() => {
            setTimer(countdown);
            countdown -= 1;
            if (countdown < 0) {
                clearInterval(interval);
                setActivePage(newPanel);
                setIsDocumentChecking(false);
            }
        }, 1000);
    };

    // Handle page rendering based on activePage state
    const handlePageChange = () => {

        switch (activePage) {
            case "UserProfile":
                return <HomeSection />;
            case "Matchingloan":
                return <Matchingloan />;
            case "Incubation":
                return <Incubation />;
            case "SeedFund":
                return <SeedFunded />;
            case "Qpr":
                return <Qpr />;
            case "Reimbursement":
                return <Reimbursement />;
            case "Coworking":
                return <Coworking />;
            case "Acceleration":
                return <Acceleration />;
            case "StartupForm":
                return <StartupForm />;
            case "SecondTranche":
                return <SecondTrance />;
            case "Bills":
                return <Bills />;
            case "Grievance":
                return <Grievance />;
            case "Mpr":
                return <Upload />;
            case "PostSeed":
                return <PostSeed />;
            case "Accepted":
                return <App />;
            case "Query":
                return <Query />;
            default:
                return <UserProfile changePanel={changePanel} />;
        }
    };

    return (
        <div className="flex w-screen">
            <LeftBar changePanel={changePanel} selectedItem={selectedItem} />
            {isDocumentChecking ? (
                <div className="flex-grow w-[75%]">

                    <div className="isolate bg-white px-6 py-24 h-screen flex flex-col items-center justify-center">
                        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
                            <div
                                className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                                style={{
                                    clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                }}
                            ></div>
                        </div>
                        <h3 className="font-semibold text-xl mb-6 text-center">Form Status</h3>
                        <p className={`text-lg text-center ${statusColor}`}>{statusMessage}</p>
                        {statusColor === 'text-red-500' && (
                            <p className="text-center mt-4">Redirecting to the form in {timer} seconds...</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex-grow w-[75%]">
                    {handlePageChange()}
                </div>
            )}
        </div>
    );
};

export default StartupProfileMain;
