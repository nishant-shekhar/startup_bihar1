import React from 'react';
import ProfileCard from './ProfileCard';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import './MovingPage.css'

const MovingPage = () => {
    // Profile data array for cards
    const profiles = [
        {
            status: "Seed Funded",
            statusColor: "bg-green-500",
            profileImage: "https://dummyimage.com/100x100/000/fff.png&text=Logo",
            companyName: "Floww",
            founderName: "Nishant Shekhar",
            since: "2021",
            sinceColor: "bg-yellow-500",
            category: "Education",
            categoryColor: "bg-teal-500",
        },
        {
            status: "Seed Funded",
            statusColor: "bg-green-500",
            profileImage: "https://dummyimage.com/100x100/000/fff.png&text=Logo",
            companyName: "NS APPS INNOVATIONS",
            founderName: "Nishant Shekhar",
            since: "2021",
            sinceColor: "bg-yellow-500",
            category: "Education",
            categoryColor: "bg-teal-500",
        },
        {
            status: "Seed Funded",
            statusColor: "bg-green-500",
            profileImage: "https://dummyimage.com/100x100/000/fff.png&text=Logo",
            companyName: "Medicare",
            founderName: "Nishant Shekhar",
            since: "2021",
            sinceColor: "bg-yellow-500",
            category: "Education",
            categoryColor: "bg-teal-500",
        },
        {
            status: "Seed Funded",
            statusColor: "bg-green-500",
            profileImage: "https://dummyimage.com/100x100/000/fff.png&text=Logo",
            companyName: "Medicare",
            founderName: "Nishant Shekhar",
            since: "2021",
            sinceColor: "bg-yellow-500",
            category: "Education",
            categoryColor: "bg-teal-500",
        },
        {
            status: "Seed Funded",
            statusColor: "bg-green-500",
            profileImage: "https://dummyimage.com/100x100/000/fff.png&text=Logo",
            companyName: "Medicare",
            founderName: "Nishant Shekhar",
            since: "2021",
            sinceColor: "bg-yellow-500",
            category: "Education",
            categoryColor: "bg-teal-500",
        },
        {
            status: "Seed Funded",
            statusColor: "bg-green-500",
            profileImage: "https://dummyimage.com/100x100/000/fff.png&text=Logo",
            companyName: "Medicare",
            founderName: "Nishant Shekhar",
            since: "2021",
            sinceColor: "bg-yellow-500",
            category: "Education",
            categoryColor: "bg-teal-500",
        },
        {
            status: "Seed Funded",
            statusColor: "bg-green-500",
            profileImage: "https://dummyimage.com/100x100/000/fff.png&text=Logo",
            companyName: "Medicare",
            founderName: "Nishant Shekhar",
            since: "2021",
            sinceColor: "bg-yellow-500",
            category: "Education",
            categoryColor: "bg-teal-500",
        },
    ];

    return (
        <div className='startups w-screen overflow-hidden'>
            <div className='flex m-4 justify-between'>
                <h1 className='text-2xl font-semibold px-10 lg:max-w-7xl lg:px-10'>Top Companies</h1>
                <Link to="/all-items" className="flex items-center  px-10 lg:max-w-7xl lg:px-10">
                    <span className="text-gray-700 font-semibold mr-2">See all</span>
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-500 rounded-full hover:bg-indigo-400 transition">
                        <FaArrowRight className="text-white text-sm" />
                    </div>
                </Link>
            </div>

            {/* Infinite Scrolling Section */}
            <div className="relative overflow-hidden mt-6">
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
            </div>
        </div>
    );
};

export default MovingPage;
