import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { RiFileExcel2Line } from "react-icons/ri"; // Import the icon


const CommonList = ({ onSelect, url, title, type = "seed-fund" }) => {
    const [sdata, setSdata] = useState([]); // Initialize as an empty array
    const [searchTerm, setSearchTerm] = useState(""); // State to manage search input
    const [isLoading, setIsLoading] = useState(true); // State for loading status
    const [isExporting, setIsExporting] = useState(false); // State for export status

    const token = localStorage.getItem("token");

    const handleClick = (id) => {
        onSelect(id);
    };

    const categories = ['All', "Accepted", "Rejected"];

    const [selectedCategory, setSelectedCategory] = useState('All');

    // Handle category click
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };


    useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await axios.get(url, {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `${token}`,
                  },
              });
              setSdata(response.data?.data || []); // Ensure data fallback
          } catch (error) {
              console.error("Error fetching data:", error);
          } finally {
              setIsLoading(false); // Loading complete
          }
      };
  
      fetchData();
  }, [url]); // Refetch when the URL changes
  
  // Automatically handle click for the first item in the list when sdata is updated
  useEffect(() => {
      if (sdata.length > 0) {
          handleClick(sdata[0]?.id); // Automatically call handleClick with the first item's ID
      }
  }, [sdata]);

    // Handle Excel Download
    const handleDownloadExcel = async () => {
        setIsExporting(true); // Set exporting state
        try {
            const promises = sdata.map(async (item) => {
                const response = await axios.get(
                    `http://localhost:3007/api/${type}/v1/${item.id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `${token}`,
                        },
                    }
                );
                return response.data; // Return the detailed data
            });

            const detailedData = await Promise.all(promises);

            if (detailedData.length === 0) {
                alert("No data available to download.");
                return;
            }

            // Generate Excel-compatible data
            const excelData = detailedData.map((item) => ({
                ID: item.id,
                ...item, // Include all keys dynamically
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Startups");

            // Download Excel
            XLSX.writeFile(workbook, `${type}_details.xlsx`);
        } catch (error) {
            console.error("Error downloading Excel:", error);
        } finally {
            setIsExporting(false); // Reset exporting state
        }
    };

    // Filter data based on the search term
    const filteredData = sdata.filter((item) =>
        item?.user?.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div
            className="w-full bg-slate-200 h-screen overflow-y-auto"
            style={{
                msOverflowStyle: "none",
                scrollbarWidth: "none",
            }}
        >
            <div className="flex justify-between items-center px-5 pt-8 pb-4">
                <h1 className="text-2xl">{title}</h1>
                <RiFileExcel2Line
        onClick={handleDownloadExcel}
        className={`text-blue-500 text-3xl cursor-pointer hover:text-blue-700 ${
            isExporting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title={isExporting ? "Exporting..." : "Download Excel"}
        disabled={isExporting}
    />
            </div>
            {/* Tabs Section */}
				<div className="border-2 border-white rounded-2xl px-2 py-2 bg-transparent mx-4 mb-2">
					<nav className="justify-start space-x-2">
						{categories.map((category) => (
							<button
								key={category}
								onClick={() => handleCategoryClick(category)}
								className={`py-1 px-4 transition-all duration-300 transform ${selectedCategory === category
										? "bg-[#bac2cd] text-[#0E0C22] font-semibold rounded-full scale-105" // Selected styles with slight scale animation
										: "text-[#151334] font-medium hover:text-opacity-70 hover:bg-[#F8F7F3] hover:text-[#0E0C22] rounded-full" // Unselected styles with hover effect
									}`}
							>
								{category}
							</button>
						))}
					</nav>
				</div>

            {/* Search Box */}
            <div className="flex items-center pl-5 mb-4">
                <input
                    type="text"
                    placeholder="Search by User ID"
                    className="w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Display "No data" message or results */}
            {isLoading ? (
                <p className="text-center text-gray-500 mt-10">Loading data...</p>
            ) : filteredData?.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">
                    No data available. Please try searching again.
                </p>
            ) : (
                <ul>
                    {filteredData.map((item) => (
                        <div
                            key={item.id}
                            className="mx-5 bg-white rounded-lg mt-3 hover:shadow-lg cursor-pointer"
                            onClick={() => handleClick(item.id)}
                        >
                            <div className="flex items-center py-5 px-5">
                                <div>
                                    <img
                                        src="startup.png"
                                        alt="Startup"
                                        className="w-12 h-12 rounded-full"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "https://img.freepik.com/premium-vector/startup-logo-business-project-business-concept-identity-symbol_136321-649.jpg";
                                        }}
                                    />
                                </div>
                                <div className="px-3">
                                    <h1 className="">{item?.user?.user_id?.toUpperCase()}</h1>
                                    <h1 className="">Reg no: {item?.user?.registration_no}</h1>
                                </div>
                            </div>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CommonList;
