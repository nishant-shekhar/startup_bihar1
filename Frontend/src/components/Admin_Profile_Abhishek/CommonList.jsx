import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { RiFileExcel2Line } from "react-icons/ri"; // Import the icon
import { IoMdRefresh } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const CommonList = ({ onSelect, url, title, type = "StartupProfile" }) => {
  const [sdata, setSdata] = useState([]); // Initialize as an empty array
  const [searchTerm, setSearchTerm] = useState(""); // State to manage search input
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const [isExporting, setIsExporting] = useState(false); // State for export status
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useNavigate(); // Use this for redirection

  const token = localStorage.getItem("token");

  const handleClick = (id) => {
    setSelectedId(id); // Save the selected ID
    onSelect(id);
  };

  // Define the categories
  const categories = ["Pending", "Accepted", "Rejected", "All"];
  const [selectedCategory, setSelectedCategory] = useState("Pending");
  const [refreshKey, setRefreshKey] = useState(0); // State variable to trigger useEffect

  // Handle category click
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const refresh = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Increment the refreshKey to trigger useEffect
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
        //console.log(response.data?.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.clear(); // Optional: clear invalid token
          navigate("/login");
          console.error("Access forbidden. Please log in again.");
        }
      } finally {
        setIsLoading(false); // Loading complete
      }
    };

    fetchData();
  }, [url, refreshKey]); // Refetch when the URL changes

  // Automatically handle click for the first item in the list when sdata is updated
  useEffect(() => {
    if (sdata.length > 0) {
      handleClick(sdata[0]?.id); // Automatically call handleClick with the first item's ID
    }
  }, [sdata]);

  // Handle Excel Download (unchanged)
  const handleDownloadExcel = async () => {
    setIsExporting(true);
    try {
      // Filter sdata based on selectedCategory
      const filteredToDownload = sdata.filter((item) => {
        const status = item.documentStatus?.toLowerCase();
  
        if (selectedCategory === "All") return true;
        if (selectedCategory === "Accepted") return status === "accepted";
        if (selectedCategory === "Rejected")
          return status === "rejected" || status === "partially rejected";
        if (selectedCategory === "Pending")
          return (
            status !== "accepted" &&
            status !== "rejected" &&
            status !== "partially rejected"
          );
        return false;
      });
  
      // Fetch detailed data for each filtered item
      const promises = filteredToDownload.map(async (item) => {
        const response = await axios.get(
          `https://startupbihar.in/api/${type}/v1/${item.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        return response.data;
      });
  
      const detailedData = await Promise.all(promises);
  
      if (detailedData.length === 0) {
        alert("No data available to download.");
        return;
      }
  
      // Convert camelCase keys to readable format
      const formatKey = (key) =>
        key
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
  
      const formatValue = (value) => {
        if (typeof value === "boolean") return value ? "Yes" : "No";
        if (typeof value === "string") {
          return value
            .replace(/created/i, "Applied")
            .replace(/accepted/i, "Approved")
            .replace(/rejected/i, "Rejected");
        }
        return value;
      };
  
      const excelData = detailedData.map((item) => {
        let createdAtFormatted = formatValue(item.createdAt) || "N/A";
        let updatedAtFormatted =
          item.createdAt === item.updatedAt
            ? "No Action Yet"
            : formatValue(item.updatedAt);
  
        let formattedData = {
          "Registration No": item.user?.registration_no || "N/A",
          "User ID": item.user?.user_id || "N/A",
          "Company Name": item.user?.company_name || "N/A",
          "Founder Name": item.user?.founder_name || "N/A",
          "Date of Incorporation": item.user?.dateOfIncorporation || "N/A",
          "District RoC": item.user?.districtRoc || "N/A",
          "CIN": item.user?.cin || "N/A",
          "Mobile": item.user?.mobile || "N/A",
          "Email": item.user?.email || "N/A",
          "Created At": createdAtFormatted,
          "Updated At": updatedAtFormatted,
        };
  
        Object.keys(item).forEach((key) => {
          if (!["id", "ID", "user", "createdAt", "updatedAt"].includes(key)) {
            formattedData[formatKey(key)] = formatValue(item[key]) || "N/A";
          }
        });
  
        return formattedData;
      });
  
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Startups");
  
      XLSX.writeFile(workbook, `${type}_${selectedCategory}_details.xlsx`);
    } catch (error) {
      console.error("Error downloading Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };
  

  // Filter data based on the search term and selected category
  const filteredData = sdata.filter((item) => {
    const userId = item?.user?.user_id?.toLowerCase() || "";
    const status = item.documentStatus?.toLowerCase();
const regNo = item?.user?.registration_no?.toLowerCase() || "";
const companyName = item?.user?.company_name?.toLowerCase() || "";
const matchesSearchTerm = (
  userId.includes(searchTerm.toLowerCase()) ||
  regNo.includes(searchTerm.toLowerCase()) ||
  companyName.includes(searchTerm.toLowerCase())
);

    let matchesCategory = false;
    if (selectedCategory === "All") {
      matchesCategory = true;
    } else if (selectedCategory === "Accepted") {
      matchesCategory = status === "accepted";
    } else if (selectedCategory === "Rejected") {
      // For Rejected, include both "rejected" and "partially rejected"
      matchesCategory =
        status === "rejected" || status === "partially rejected";
    } else if (selectedCategory === "Pending") {
      // Pending: status that is not "accepted", "rejected", or "partially rejected"
      matchesCategory =
        status !== "accepted" &&
        status !== "rejected" &&
        status !== "partially rejected";
    }

    return matchesSearchTerm && matchesCategory;
  });

  // Helper function to count items for each category
  const getCountForCategory = (category) => {
    if (category === "All") {
      return sdata.length;
    } else if (category === "Accepted") {
      return sdata.filter(
        (item) => item.documentStatus?.toLowerCase() === "accepted"
      ).length;
    } else if (category === "Rejected") {
      return sdata.filter((item) => {
        const status = item.documentStatus?.toLowerCase();
        return status === "rejected" || status === "partially rejected";
      }).length;
    } else if (category === "Pending") {
      return sdata.filter((item) => {
        const status = item.documentStatus?.toLowerCase();
        return (
          status !== "accepted" &&
          status !== "rejected" &&
          status !== "partially rejected"
        );
      }).length;
    }
    return 0;
  };

  //console.log("Filtered data:", filteredData);

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
        <nav className="justify-start space-x-2 flex">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              title={`${getCountForCategory(category)} Forms`} // Display count on hover
              className={`py-1 px-4 transition-all duration-300 transform ${
                selectedCategory === category
                  ? `bg-gray-100 text-[#0E0C22] text-sm font-semibold rounded-full scale-105 ${
                      category === "Accepted"
                        ? "bg-green-200"
                        : category === "Rejected"
                        ? "bg-red-200"
                        : ""
                    }`
                  : "text-[#151334] text-sm font-medium hover:text-opacity-70 hover:bg-gray-100 hover:text-[#0E0C22] rounded-full"
              }`}
            >
              {category}
            </button>
          ))}
          <button onClick={refresh}>
            <IoMdRefresh />
          </button>
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
    className={`mx-5 bg-white rounded-lg mt-3 hover:shadow-lg cursor-pointer ${
      selectedId === item.id ? "border-2 border-indigo-500" : ""
    }`}
    onClick={() => handleClick(item.id)}
  >
    <div className="flex items-center py-5 px-5">
      <div>
        <img
          src={item?.user?.logo		|| "startup.png"}
          alt="Startup"
          className="w-12 h-12 rounded-full"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://img.freepik.com/premium-vector/startup-logo-business-project-business-concept-identity-symbol_136321-649.jpg";
          }}
        />
      </div>
      <div className="px-3 flex-grow">
        <h1 className="">{item?.user?.user_id?.toUpperCase()}</h1>
        <h1 className="">Reg no: {item?.user?.registration_no}</h1>
      </div>
      <div
        className={`flex-none rounded-full p-1 ${
          item.documentStatus === "Accepted"
            ? "bg-emerald-500/20"
            : item.documentStatus === "Rejected"
            ? "bg-red-500/20"
            : item.documentStatus === "Partially Rejected"
            ? "bg-yellow-500/20"
            : ""
        }`}
      >
        <div
          className={`size-1.5 rounded-full ${
            item.documentStatus === "Accepted"
              ? "bg-emerald-500"
              : item.documentStatus === "Rejected"
              ? "bg-red-500"
              : item.documentStatus === "Partially Rejected"
              ? "bg-yellow-500"
              : ""
          }`}
        ></div>
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
