import React, { useState } from 'react';
import CardList from './CardList';
import SearchBox from './SearchBox';
import NavBarNew from '../NavBarNew';


const AllStartup = () => {

    const categories = ['All', 'Tech', 'Health', 'Finance', 'Education', 'Food', 'Revenue Wise', 'Project Wise'];

    const [selectedCategory, setSelectedCategory] = useState('All');

    // Handle category click
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };


    return (
        <div className="grid grid-cols-1">
            <NavBarNew />


            <div className="isolate bg-white px-6 py-24 sm:py-3 lg:px-8 min-h-screen flex flex-col items-center">
               
                <div className="py-24 sm:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl lg:text-center">
                            <h2 className="text-base font-semibold leading-7 text-indigo-600">
                                Innovators of Bihar: Our Startup Showcase
                            </h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Spotlighting Bihar's Pioneering Startups
                            </p>
                        </div>


                        <div className="flex flex-col items-center mt-10">
                            {/* Tabs Section */}
                            <div className="border-2 border-white rounded-2xl px-4 py-2 bg-transparent">
                                <nav className="flex justify-center space-x-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => handleCategoryClick(category)}
                                            className={`py-1 px-4 transition-all duration-300
                                                ${selectedCategory === category
                                                    ? 'bg-[#F8F7F3] text-[#0E0C22] rounded-full'  // Selected styles
                                                    : 'text-[#151334] font-medium hover:text-opacity-50 hover:bg-transparent rounded-full'  // Unselected styles with hover effect
                                                }`}
                                        >
                                            {category}
                                        </button>

                                    ))}
                                </nav>
                            </div>

                        </div>
                    </div>

                    <SearchBox />

                    {/* CardList Section */}
                    <div className="mt-6 w-full">
                        <CardList category={selectedCategory} />
                    </div>
                </div>


            </div>

        </div >
    );
};

export default AllStartup;
