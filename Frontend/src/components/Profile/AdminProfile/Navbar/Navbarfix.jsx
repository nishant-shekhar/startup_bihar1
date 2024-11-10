import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";  // Import your Navbar component

const Navbarfix = ({ children }) => {
    const location = useLocation();

    // Define the admin routes where the Navbar should be shown
    const adminRoutes = [
        '/startupProfile',
        '/seedFund',
        '/secondTranche',
        '/accelerationAdmin',


        // Add other admin routes as needed
    ];

    // Check if the current route is in the admin routes list
    const showNavbar = adminRoutes.includes(location.pathname);

    return (
        <div className="flex">
            {showNavbar && (
                <>
                    <Navbar />
                </>
            )}
            {/* Render the children */}
            <div className="flex-grow">{children}</div>
        </div>
    );
};

export default Navbarfix;
