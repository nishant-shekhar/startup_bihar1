import React, { useState, useEffect } from "react";
import axios from "axios";

import CardList from "./CardList";
import SearchBox from "./SearchBox";
import NavBarNew from "../NavBarNew";

const AllStartup = () => {
  // Define your categories
  const categories = [
    "All",
    "Finance",
    "Technology",
    "Food",
    "Art & Entertainment",
    "Logistics",
    "Edu-tech",
    "Health",
    "E-commerce",
    "Environment",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startups, setStartups] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // track what's typed in search
  const [isLoading, setIsLoading] = useState(false);

  // Handle category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Handle search input change
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Fetch startups from API based on category
  const fetchStartups = async (category) => {
    setIsLoading(true);
    try {
      let url;

      if (category === "All") {
        // EITHER use a dedicated "all" endpoint
        // url = "https://startupbihar.in/api/userlogin/startups/all";
        
        // OR pass "All" to the same endpoint if your backend handles it:
        url = `https://startupbihar.in/api/userlogin/startups/by-category/${category}`;
      } else {
        // For a specific category
        url = `http://localhost:3007/api/userlogin/startups/by-category/${category}`;
      }

      const response = await axios.get(url);
      // The backend should respond with { startups: [...] }
      setStartups(response.data.startups || []);
    } catch (error) {
      console.error("Failed to fetch startups:", error);
      setStartups([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Whenever `selectedCategory` changes, refetch data
  useEffect(() => {
    fetchStartups(selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Filter by search term on the client side
  const filteredStartups = startups.filter((startup) => {
    // Convert fields to lowercase for case-insensitive search
    const companyName = startup.company_name?.toLowerCase() || "";
    const category = startup.category?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    // Filter by company_name or category
    return companyName.includes(search) || category.includes(search);
  });

  return (
    <div className="grid grid-cols-1 overflow-x-hidden">
      <NavBarNew />

      {/* Outer container with responsive padding and vertical spacing */}
      <div className="isolate bg-white px-4 sm:px-6 py-12 sm:py-24 lg:px-8 min-h-screen flex flex-col items-center">
        <div className="max-w-7xl w-full">
          {/* Title Section */}
          <div className="mx-auto max-w-3xl text-center mt-20 sm:mt-4">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Innovators of Bihar: Our Startup Showcase
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Spotlighting Bihar&apos;s Pioneering Startups
            </p>
          </div>

          {/* Category Tabs Section */}
          <div className="flex flex-col items-center mt-10">
            <div className="border-2 border-white rounded-2xl px-4 py-2 bg-transparent">
              <nav className="flex justify-center space-x-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`py-1 px-4 mt-2 sm:mt-0 transition-all duration-300
                      ${
                        selectedCategory === category
                          ? "bg-[#F8F7F3] text-[#0E0C22] rounded-full"
                          : "text-[#151334] font-medium hover:text-opacity-50 hover:bg-transparent rounded-full"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Search Box */}
          <SearchBox onSearch={handleSearch} />

          {/* CardList Section */}
          <div className="mt-6 w-full">
            {isLoading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <CardList startups={filteredStartups} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllStartup;
