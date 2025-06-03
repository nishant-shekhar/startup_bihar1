import React, { useState, useEffect } from "react";
import SearchBox from "../HomePage/StartupList/SearchBox";
import { GrCompliance } from "react-icons/gr";
import { RiCloseCircleLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { CircleCheck, User } from 'lucide-react';
import { CircleX } from 'lucide-react';


import {
  Lightbulb,
  Banknote,
  Code2,
  Utensils,
  Palette,
  Truck,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Package,
  Leaf,
  Globe,
  Plane,
  MonitorSmartphone,
} from "lucide-react";
import { MdDevicesOther } from "react-icons/md";
import {
  FaRegTimesCircle,
  FaRegClock,
  FaBalanceScale,
  FaGavel,
  FaUserTie,
  FaClipboardList,
  FaInfoCircle,
} from "react-icons/fa";

const Startuplist = () => {
  const [selectedCategory, setSelectedCategory] = useState("Smart Innovations");
  const [startups, setStartups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
const [selectedData, setSelectedData] = useState(null);

const handleTableRowClick = (rowData) => {
  setSelectedData({ ...rowData }); 
  setOpenDialog(true);
};

const nonEditableFields = ['id', 'user_id', 'registration_no', 'createdAt'];


const handleInputChange = (e) => {
  const { name, value } = e.target;
  setSelectedData((prev) => ({
    ...prev,
    [name]: value
  }));
};

const handleSave = () => {
  console.log("Edited Data:", selectedData);

  setOpenDialog(false);
};




  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setStartups([
        {
    id: 1,
    logo: "https://t3.ftcdn.net/jpg/06/20/31/04/360_F_620310483_DNhQ5nSaAYi49PIatqddm3vRSGTST2ZK.jpg",
    StartupName: "Case vs State",
    FoundersName: "Mr. A",
    Email: "johndoe@example.com",
    SocialMedia: "@casevsstate",
    Mobile: "9876543210",
    moto: "Justice for All",
    startup_since: "2025-01-01",
    website: "https://casevsstate.com",
    category: "LegalTech",
    employeeCount: 10,
    projects: 2,
    workOrders: 1,
    matchingLoanAmount: <CircleCheck className="text-emerald-500" />,
    postSeedAmount: <CircleCheck className="text-emerald-500" />,
    secondTrancheAmount:<CircleX className="text-red-500" />,
    seedFundAmount: <CircleX className="text-red-500" />,
    address: "123 Civil Court Road",
    cin: "U12345BR2025PTC000001",
    dateOfIncorporation: "2025-01-01",
    districtRoc: "Patna",
  },
  {
    id: 1,
    logo: "https://t3.ftcdn.net/jpg/06/20/31/04/360_F_620310483_DNhQ5nSaAYi49PIatqddm3vRSGTST2ZK.jpg",
    StartupName: "Case vs State",
    FoundersName: "Mr. A",
    Email: "johndoe@example.com",
    SocialMedia: "@casevsstate",
    Mobile: "9876543210",
    moto: "Justice for All",
    startup_since: "2025-01-01",
    website: "https://casevsstate.com",
    category: "LegalTech",
    employeeCount: 10,
    projects: 2,
    workOrders: 1,
    matchingLoanAmount: <CircleX className="text-red-500" />,
    postSeedAmount: <CircleCheck className="text-emerald-500" />,
    secondTrancheAmount: <CircleCheck className="text-emerald-500" />,
    seedFundAmount: <CircleCheck className="text-emerald-500" />,
    address: "123 Civil Court Road",
    cin: "U12345BR2025PTC000001",
    dateOfIncorporation: "2025-01-01",
    districtRoc: "Patna",
  },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const categoryIcons = {
  "Smart Innovations": <Lightbulb size={10} />,
  "Finance": <Banknote size={10} />,
  "Technology": <Code2 size={10} />,
  "Food": <Utensils size={10} />,
  "Art & Entertainment": <Palette size={10} />,
  "Logistics": <Truck size={10} />,
  "Edu-tech": <GraduationCap size={10} />,
  "Health": <HeartPulse size={10} />,
  "Retail": <ShoppingBag size={10} />,
  "E-comm": <MonitorSmartphone size={10} />,
  "Manufacturing": <Package size={10} />,
  "Environment": <Leaf size={10} />,
  "General": <Globe size={10} />,
  "Travel": <Plane size={10} />,
};

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

  const filteredCases = startups.filter((caseItem) =>
  caseItem["StartupName"].toLowerCase().includes(searchTerm.toLowerCase())
);


  const calculateDaysLeft = (nextHearingDate) => {
    if (!nextHearingDate) return null;
    const today = new Date();
    const hearingDate = new Date(nextHearingDate);
    const diff = Math.ceil((hearingDate - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : null;
  };

  const getStageProgress = (stage) => {
    const stages = {
      Investigation: { percent: 20, color: "bg-blue-400" },
      Filing: { percent: 40, color: "bg-purple-400" },
      Hearing: { percent: 60, color: "bg-orange-400" },
      Trial: { percent: 80, color: "bg-pink-400" },
      Judgment: { percent: 100, color: "bg-green-500" },
    };
    return stages[stage] || { percent: 0, color: "bg-gray-300" };
  };

  const handleRowClick = (caseDetail) => {
    console.log("Row clicked:", caseDetail);
  };

  return (
    <div>
         <div className="relative bg-indigo-100 py-12 px-6 shadow-md">
  <div className="text-center">
    <h1 className="text-3xl text-left font-bold text-indigo-800">Startup List</h1>
    <p className="mt-2 text-indigo-700 text-left text-sm">Display all the data of all Startup</p>
    <div>
        <SearchBox onSearch={setSearchTerm} />
      </div>


  </div>
  </div>
     <div className="flex flex-col items-center px-3 mt-10">
  <div className="rounded-2xl px-4 py-2 bg-transparent">
    <nav className="flex justify-center space-y-2 space-x-2 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`flex items-center text-xs py-2 px-4 mt-2 sm:mt-0 transition-all  duration-300 rounded-full
            ${
              selectedCategory === category
                ? "bg-indigo-200 text-[#0E0C22]"
                : "text-[#151334] font-medium hover:text-opacity-80 hover:bg-indigo-100"
            }`}
        >
          <span>{category}</span>
        </button>
      ))}
    </nav>
  </div>
</div>

      <div>

    <div 
  style={{
    overflowX: 'auto',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE 10+
  }}
  className="mt-10 rounded  mx-10"
>
  <style>
    {`
      div::-webkit-scrollbar {
        display: none;
      }
    `}
  </style>

  <table className="min-w-full table-auto border-collapse border border-indigo-200 rounded-2xl">
    <thead>
      <tr className="bg-indigo-200 text-xs text-gray-600">
        {[
          "S No.", "logo", "Startup Name", "Founder's Name","E-mail", "Social Media",
          "Mobile", "website",
         "category", "Employee Count", "Projects",
          "Work Orders", "Matching Loan Amount", "Post Seed Amount", "Second Tranche Amount",
          "Seed Fund Amount", "Address", "CIN", "Date Of Incorporation", "District ROC"
        ].map((heading) => (
          <th key={heading} className="px-4 py-2 text-left whitespace-nowrap">
            {heading}
          </th>
        ))}
      </tr>
    </thead>
   <tbody>
  {filteredCases.map((startup) => (
    <tr
      key={startup.id}
      className="text-sm border-t hover:bg-gray-50 cursor-pointer"
      onClick={() => {
        setSelectedData(startup);  
        setOpenDialog(true);      
      }}
    >
      <td className="px-4 py-2">{startup.id}</td>
  <td className="px-4 py-2 align-middle">
    <div className="w-16 h-16">
      <img
        src={startup.logo || "https://via.placeholder.com/50"}
        alt="Startup Logo"
        className="w-10 h-10 object-cover rounded-full shadow border"
      />
    </div>
  </td>
  <td className="px-4 py-2">{startup.StartupName}</td>
  <td className="px-4 py-2">{startup.FoundersName}</td>
  <td className="px-4 py-2">{startup.Email}</td>
  <td className="px-4 py-2">{startup.SocialMedia}</td>
  <td className="px-4 py-2">{startup.Mobile}</td>
  <td className="px-4 py-2"><span>{startup.website}</span></td>
  <td className="px-4 py-2">{startup.category}</td>
  <td className="px-4 py-2">{startup.employeeCount}</td>
  <td className="px-4 py-2">{startup.projects}</td>
  <td className="px-4 py-2">{startup.workOrders}</td>
  <td className="px-4 py-2 ">{startup.matchingLoanAmount}</td>
  <td className="px-4 py-2">{startup.postSeedAmount}</td>
  <td className="px-4 py-2">{startup.secondTrancheAmount}</td>
  <td className="px-4 py-2">{startup.seedFundAmount}</td>
  <td className="px-4 py-2 whitespace-nowrap">{startup.address}</td>
  <td className="px-4 py-2">{startup.cin}</td>
  <td className="px-4 py-2">{startup.dateOfIncorporation}</td>
  <td className="px-4 py-2">{startup.districtRoc}</td>
    </tr>
  ))}
</tbody>

  </table>
</div>

    </div>
   {openDialog && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white w-full max-w-4xl rounded-3xl shadow-lg p-6 overflow-y-auto max-h-[80vh]">
    
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-xl text-center font-semibold text-gray-800">Edit Startup Details</h2>
        <button
          onClick={() => setOpenDialog(false)}
          className="text-gray-500 hover:text-red-600 text-2xl font-bold"
        >
          &times;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {/* Logo Display */}
      {selectedData?.logo && (
        <div className="flex justify-center mb-6">
          <img
            src={selectedData.logo}
            alt="Startup Logo"
            className="w-24 h-24 object-contain rounded-full shadow border"
          />
        </div>
      )}
        {selectedData &&
          Object.entries(selectedData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {key.replace(/_/g, " ")}
              </label>
              <input
                type="text"
                name={key}
                value={value || ""}
                onChange={handleInputChange}
                readOnly={nonEditableFields.includes(key)}
                className={`w-full px-4 py-2 border text-sm border-gray-300 rounded-3xl focus:outline-none 
                  ${
                    nonEditableFields.includes(key)
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "focus:ring-2 focus:ring-indigo-500"
                  }`}
              />
            </div>
          ))}
      </div>

      <div className="mt-6 flex space-x-3 w-full">
        <button
          onClick={() => setOpenDialog(false)}
          className="w-1/2 px-4 py-2 text-sm rounded-3xl border border-indigo-500 text-indigo-500 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="w-1/2 px-4 py-2 text-sm rounded-3xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Save
        </button>
      </div>

    </div>
  </div>
)}


      </div>
  );
};

export default Startuplist;
