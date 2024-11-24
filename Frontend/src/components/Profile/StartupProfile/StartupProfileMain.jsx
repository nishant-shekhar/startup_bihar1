import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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


const StartupProfileMain = () => {
    const [activePage, setActivePage] = useState("UserProfile");
    const [selectedItem, setSelectedItem] = useState(null); // For tracking the selected sidebar item
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token exists in localStorage
        const token = localStorage.getItem("token");

        // If token doesn't exist, navigate to login page
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    // Handle page change based on active page
    console.log(activePage);
    const handlePageChange = () => {
        switch (activePage) {
            case "UserProfile":
                return <UserProfile />;
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

    // Change the panel and update the URL
    const changePanel = (newPanel) => {
        setActivePage(newPanel);
    }


    return (
        <div className="flex w-screen">
            <LeftBar changePanel={changePanel} selectedItem={selectedItem} /> {/* Pass selectedItem for highlighting */}
            <div className="flex-grow w-[75%]">
                {handlePageChange()}
            </div>
        </div>
    );
};

export default StartupProfileMain;
