import React, { useState, useEffect } from "react";
import axios from "axios";
import StartupDetailsDialog from "./StartupDetailsDialog";
import SearchBox from "../../HomePage/StartupList/SearchBox";

const categories = [
  "Smart Innovations",
  "Finance",
  "Technology",
  "Food",
  "Art & Entertainment",
  "Logistics",
  "Edu-tech",
  "Health",
  "Retail",
  "E-comm",
  "Manufacturing",
  "Environment",
  "General",
  "Travel",
];

const StartupList = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [startups, setStartups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState(null);

  useEffect(() => {
    fetchStartups(selectedCategory);
  }, [selectedCategory]);

  const fetchStartups = async (category) => {
    setIsLoading(true);
    try {
      const url = `https://startupbihar.in/api/userlogin/startups/by-category/${category}`;
      const response = await axios.get(url);
      setStartups(response.data.startups || []);
    } catch (error) {
      console.error("Failed to fetch startups:", error);
      setStartups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredStartups = startups.filter(
    (startup) =>
      startup.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openStartupDialog = (startup) => {
    setSelectedStartup(startup);
    setOpenDialog(true);
  };

  const refreshList = () => {
    fetchStartups(selectedCategory);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">Startup Admin Panel</h1>
        <p className="mb-8 text-gray-600">Manage and edit startup details easily.</p>

        {/* Category Selection */}
        <nav className="mb-6 flex gap-2 overflow-x-auto py-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-100 text-indigo-700"
              }`}
            >
              {category}
            </button>
          ))}
        </nav>

        {/* Search Box */}
        <SearchBox onSearch={setSearchTerm} />

        {/* Startup Table */}
        <div className="mt-6 overflow-x-auto">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full bg-white border rounded-lg shadow overflow-hidden">
              <thead className="bg-indigo-500 text-white">
                <tr>
                  <th className="px-4 py-2">User ID</th>
                  <th className="px-4 py-2">Logo</th>
                  <th className="px-4 py-2">Company Name</th>
                  <th className="px-4 py-2">Registration No.</th>
                  <th className="px-4 py-2">Website</th>
                  <th className="px-4 py-2">Matching Loan</th>
                  <th className="px-4 py-2">Post Seed</th>
                  <th className="px-4 py-2">Second Tranche</th>
                  <th className="px-4 py-2">Seed Fund</th>
                  <th className="px-4 py-2">Top Startup</th>
                </tr>
              </thead>
              <tbody>
                {filteredStartups.map((startup) => (
                  <tr
                    key={startup.user_id}
                    className="cursor-pointer hover:bg-indigo-50"
                    onClick={() => openStartupDialog(startup)}
                  >
                    <td className="px-4 py-2">{startup.user_id}</td>
                    <td className="px-4 py-2">
                      <img src={startup.logo} alt="logo" className="h-8 w-8 rounded-full" />
                    </td>
                    <td className="px-4 py-2">{startup.company_name}</td>
                    <td className="px-4 py-2">{startup.registration_no}</td>
                    <td className="px-4 py-2">{startup.website}</td>
                    <td className="px-4 py-2">{startup.matchingLoanAmount}</td>
                    <td className="px-4 py-2">{startup.postSeedAmount}</td>
                    <td className="px-4 py-2">{startup.secondTrancheAmount}</td>
                    <td className="px-4 py-2">{startup.seedFundAmount}</td>
                    <td className="px-4 py-2">
                      {startup.topStartup ? "✅" : "❌"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Dialog */}
        {openDialog && (
          <StartupDetailsDialog
            data={selectedStartup}
            onClose={() => setOpenDialog(false)}
            onUpdate={refreshList}
          />
        )}
      </div>
    </div>
  );
};

export default StartupList;
