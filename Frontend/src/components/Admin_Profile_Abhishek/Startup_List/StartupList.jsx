import React, { useState, useEffect } from "react";
import axios from "axios";
import StartupDetailsDialog from "./StartupDetailsDialog";
import SearchBox from "../../HomePage/StartupList/SearchBox";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


import { Globe, CircleCheck, CircleX } from "lucide-react";



const categories = [
  "Smart Innovations", "Finance", "Technology", "Food", "Art & Entertainment",
  "Logistics", "Edu-tech", "Health", "Retail", "E-comm", "Manufacturing",
  "Environment", "General", "Travel", "All"
];

const StartupList = () => {
  const [selectedCategory, setSelectedCategory] = useState("Smart Innovations");
  const [startups, setStartups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const navigate = useNavigate(); // Use this for redirection

  useEffect(() => {
    fetchStartups(selectedCategory);
  }, [selectedCategory]);

  const fetchStartups = async (category) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // assuming stored after login
      const url = `https://startupbihar.in/api/adminlogin/startups/category/${category}`;

      
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      console.log("Fetched startups:", response.data.startups);

      setStartups(response.data.startups || []);
    } catch (error) {
      console.error("Failed to fetch startups:", error);
      
      setStartups([]);
      if (error.response?.status === 403) {
        localStorage.clear(); // Optional: clear invalid token
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const filteredStartups = startups.filter((startup) =>
    (startup.company_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (startup.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );
  

  const openStartupDialog = (startup) => {
    setSelectedStartup(startup);
    setOpenDialog(true);
  };

  const refreshList = () => {
    fetchStartups(selectedCategory);
  };
  const downloadExcel = () => {
    if (!startups.length) return alert("No data to download");
  
    // Flatten data
    const formatted = startups.map((s) => ({
      "User ID": s.user_id,
      "Company Name": s.company_name,
      "Founder": s.founder_name || "",
      "Mobile": s.mobile || "",
      "Email": s.email || "",
      "Website": s.website || "",
      "Registration No": s.registration_no || "",
      "Registration Year": s.registration_year || "",
      "Startup Since": s.startup_since || "",
      "Category": s.category || "",
      "Top Startup": s.topStartup ? "Yes" : "No",
      "CIN": s.cin || "",
      "Address": s.address || "",
      "District ROC": s.districtRoc || "",
      "DPIIT Certificate": s.dpiitCert || "",
      "Revenue Last Year": s.revenueLY || "",
      "Employee Count": s.employeeCount || "",
      "Seed Fund Amount": s.seedFundAmount || 0,
      "Second Tranche Amount": s.secondTrancheAmount || 0,
      "Post Seed Amount": s.postSeedAmount || 0,
      "Matching Loan Amount": s.matchingLoanAmount || 0,
    }));
  
    const ws = XLSX.utils.json_to_sheet(formatted);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, selectedCategory);
  
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `StartupList_${selectedCategory}.xlsx`);
  };
  

  return (
    <div className="h-screen overflow-auto bg-gray-50">

      <div className="relative bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16 px-6 shadow-lg overflow-hidden">

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[500px] bg-indigo-400 opacity-20 rounded-full blur-3xl z-0"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">


          <h1 className="text-5xl font-extrabold mb-3 drop-shadow-lg">
            Startup Admin Panel
          </h1>


          <p className="text-sm font-medium opacity-90">
            Manage and edit startup details with ease and clarity.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Category Tags */}
        <div className="mb-6 flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 shadow-sm ${selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="mb-6">
          <SearchBox onSearch={setSearchTerm} />
        </div>

        {/* Startup Table */}
        <button
  onClick={downloadExcel}
  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-sm rounded-md flex items-center gap-1 shadow-md transition-all duration-200 mb-4"
>
  <RiFileExcel2Fill className="text-white text-2xl" />
  Download Excel
</button>

        <div className="overflow-auto shadow rounded-lg border border-gray-200 bg-white">

          {isLoading ? (

            <div className="flex gap-3 flex-wrap justify-center p-4 md:p-12">
              <button
                disabled=""
                type="button"
                className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-full text-sm px-6 py-3 text-center inline-flex items-center animate-pulse dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-800"
              >
                <svg
                  aria-hidden="true"
                  role="status"
                  className="inline w-5 h-5 mr-2 text-white animate-spin"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  ></path>
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  ></path>
                </svg>
                Table Loading
              </button>
            </div>

          ) : (
            <table className="min-w-full table-auto text-xs bg-white border border-gray-900 rounded-md shadow">
              <thead className="bg-gray-900 text-white">
                <tr>
                  {[
                    "User ID", "Logo", "Company Name", "Phone", "Email", "District ROC", "DPIIT", "Website",
                    "Seed Fund", "Second Tranche", "Post Seed", "Matching Loan", "Top Startup"
                  ].map((header) => (
                    <th key={header} className="px-4 py-3 text-left font-semibold border-b border-gray-200">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredStartups.map((startup) => (
                  <tr
                    key={startup.user_id}
                    className="hover:bg-indigo-50 transition cursor-pointer border-b border-gray-200"
                    onClick={() => openStartupDialog(startup)}
                  >
                    <td className="px-4 py-3">{startup.user_id}</td>
                    <td className="px-4 py-3">
                      <img
                        src={
                          startup.logo ||
                          "https://media.istockphoto.com/id/924915448/vector/startup-icon-simple-element-illustration.jpg?s=612x612&w=0&k=20&c=CQhjbpi6bX9F8Ajv8ZT2xEgpuCHaO_4UQ4mb1tHJJwE="
                        }
                        alt="Logo"
                        className="h-10 w-10 rounded-full border shadow object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {startup.company_name}
                    </td>
                    {/* Mobile Column */}
                    <td className="px-4 py-3 text-gray-600 whitespace-pre-line">
                      {startup.mobile?.split(";").map((num, idx) => (
                        <div key={idx}>{num.trim()}</div>
                      ))}
                    </td>

                    {/* Email Column */}
                    <td className="px-4 py-3 text-gray-600 whitespace-pre-line">
                      {startup.email?.split(";").map((mail, idx) => (
                        <div key={idx}>{mail.trim()}</div>
                      ))}
                    </td>

                    <td className="px-4 py-3 text-gray-600">{startup.districtRoc}</td>
                    <td className="px-4 py-3 text-gray-600">{startup.dpiitCert || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <a
                          href={
                            startup.website?.startsWith("http")
                              ? startup.website
                              : `https://${startup.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 transition"
                          title="Visit Website"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                        <span className="truncate max-w-[160px] text-gray-500 text-xs">
                          {startup.website}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      ₹ {startup.seedFundAmount}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      ₹ {startup.secondTrancheAmount}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      ₹ {startup.postSeedAmount}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      ₹ {startup.matchingLoanAmount}
                    </td>
                    <td className="px-4 py-3">
                      {startup.topStartup ? (
                        <CircleCheck className="text-green-500 w-5 h-5" />
                      ) : (
                        <CircleX className="text-red-500 w-5 h-5" />
                      )}
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
