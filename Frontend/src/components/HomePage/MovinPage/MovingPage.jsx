import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileCard from './ProfileCard';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './MovingPage.css';

const MovingPage = () => {
    // State to store fetched profiles
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetching data from the backend API
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get('http://localhost:3007/api/userlogin/top-startups');
                if (response.data && response.data.startups) {
                    const startups = response.data.startups.map((startup) => ({
                        status: "Seed Funded", // Assuming default status
                        statusColor: "bg-green-500", // Assuming default status color
                        profileImage: startup.logo || "https://dummyimage.com/100x100/000/fff.png&text=Logo",
                        companyName: startup.company_name,
                        founderName: startup.founder_name,
                        since: startup.registration_year || "N/A",
                        sinceColor: "bg-yellow-500", // Assuming default since color
                        category: startup.about || "N/A", // Assuming about as category
                        categoryColor: "bg-teal-500", // Assuming default category color
                    }));
                    setProfiles(startups);
                }
            } catch (error) {
                console.error("Error fetching profiles:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfiles();
    }, []);

    return (
        <div className='startups w-screen overflow-hidden'>
            <div className='flex m-4 justify-between'>
                <h1 className='text-2xl font-semibold px-10 lg:max-w-7xl lg:px-10'>Top Startups</h1>
                <Link to="/all-items" className="flex items-center px-10 lg:max-w-7xl lg:px-10">
                    <span className="text-gray-700 font-semibold mr-2">See all</span>
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-full hover:bg-indigo-400 transition">
                        <FaArrowRight className="text-white text-sm" />
                    </div>
                </Link>
            </div>

            {/* Infinite Scrolling Section */}
            <div className="relative overflow-hidden mt-6">
                {isLoading ? (
                    <div className="flex justify-center items-center">
                        <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                    </div>
                ) : (
                    <div className="flex animate-scroll">
                        {/* Primary set of profile cards */}
                        {profiles.map((profile, index) => (
                            <div key={index} className="flex-shrink-0 w-60">
                                <div className="profile-card"> {/* Add the hover effect class here */}
                                    <ProfileCard {...profile} />
                                </div>
                            </div>
                        ))}
                        {/* Duplicate set of profile cards for seamless looping */}
                        {profiles.map((profile, index) => (
                            <div key={`duplicate-${index}`} className="flex-shrink-0 w-60">
                                <div className="profile-card"> {/* Add the hover effect class here */}
                                    <ProfileCard {...profile} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovingPage;
