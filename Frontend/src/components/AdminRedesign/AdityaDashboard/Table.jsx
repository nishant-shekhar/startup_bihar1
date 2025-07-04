// components/StartupTable.jsx
import React, { useState } from "react";
import { Download, CalendarDays, ChevronDown, Search, Plus, ArrowRightToLine, ArrowLeftToLine, FileSpreadsheet, ArrowRightToLineIcon } from "lucide-react";
import { RiFileExcel2Fill } from "react-icons/ri";
import {
  ArrowUpRight,
  Building2,
  BadgeCheck,
  Clock,
  Ticket,
} from "lucide-react";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { comment } from "postcss";
import axios from "axios";
import { useEffect } from "react";
import SecondTrancheModuleDetails from "../../Admin_Profile_Abhishek/Second_Tranche_module/SecondTrancheModule";




const statusColors = {
  Approved: "text-green-600 bg-green-100",
  Accepted: "text-green-600 bg-green-100",
  Pending: "text-yellow-600 bg-yellow-100",
  Rejected: "text-red-600 bg-red-100",
  "Partially Rejected": "text-orange-600 bg-orange-100",
  updated: "text-blue-600 bg-blue-100",
  created: "text-yellow-600 bg-yellow-100",
  null: "text-gray-500 bg-gray-100",
};



const rowsPerPage = 5;

const StartupTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState({ label: "All", value: "all" });
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [allStartups, setAllStartups] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
const [selectedId, setSelectedId] = useState(null);
  const rowsPerPage = 20;
  const [totalCounts, setTotalCounts] = useState({
    all: 0,
    Accepted: 0,
    Rejected: 0,
    "Partially Rejected": 0,
  });



  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3007/api/second-tranche/v5`, {
          params: {
            page: currentPage,
            status: statusFilter.value
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        console.log("Full API response:", response.data);

        setAllStartups(response.data.data || []);
        setTotalCount(response.data.pagination?.total || 0);
        setTotalCounts(response.data.totalCounts || {});


      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, statusFilter]);


  const handleDownloadExcelOption = () => {
    // Logic to handle Excel download
    setIsPopupOpen(true);
    setTimeout(() => {
      setIsPopupOpen(false);
    }, 2000); // Close popup after 2 seconds
  }

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Pending", value: "created" },
    { label: "Accepted", value: "Accepted" },
    { label: "Rejected", value: "Rejected" },
    { label: "Partially Rejected", value: "Partially Rejected" },
  ];

  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = allStartups.slice(startIndex, startIndex + rowsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="p-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] ">
      <div className="flex justify-between items-center bg-gray-800  rounded-xl p-4 mb-6 shadow-md">
        <h1 className="text-2xl font-semibold text-gray-100  mb-4 px-2 pt-5 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          Second Tranche
        </h1>
        <button onClick={handleDownloadExcelOption} className="text-emerald-500 text-xs mt-5 mr-5 border border-emerald-500 px-4 py-2 rounded-xl mb-4 hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-emerald-700 hover:border-emerald-700 hover:text-white transition-colors">
          <RiFileExcel2Fill className="inline mr-2 mb-0.5 text-emerald-500" size={14} />
          Export Excel
        </button>
      </div>
      {/* top info cards starts here  */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-6">

        {/* All Applications */}
        <div className="bg-white/70 backdrop-blur-md border border-gray-100/90 rounded-3xl p-5 relative overflow-hidden shadow ">
          <div className="absolute top-4 right-4 text-blue-500">
            <Building2 size={24} />
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-700 mb-2">{totalCounts.all}</p>
        </div>

        {/* Accepted */}
        <div className="bg-white/70 backdrop-blur-md border border-gray-100/90 rounded-3xl p-5 relative overflow-hidden shadow">
          <div className="absolute top-4 right-4 text-green-500">
            <BadgeCheck size={24} />
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Accepted</h3>
          <p className="text-3xl font-bold text-green-700 mb-2">{totalCounts.Accepted}</p>
        </div>

        {/* Rejected */}
        <div className="bg-white/70 backdrop-blur-md border border-gray-100/90 rounded-3xl p-5 relative overflow-hidden shadow">
          <div className="absolute top-4 right-4 text-red-500">
            <Clock size={24} />
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Rejected</h3>
          <p className="text-3xl font-bold text-red-600 mb-2">{totalCounts.Rejected}</p>
        </div>

        {/* Partially Rejected */}
        <div className="bg-white/70 backdrop-blur-md border border-gray-100/90 rounded-3xl p-5 relative overflow-hidden shadow">
          <div className="absolute top-4 right-4 text-orange-500">
            <Clock size={24} />
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Partially Rejected</h3>
          <p className="text-3xl font-bold text-orange-600 mb-2">{totalCounts["Partially Rejected"]}</p>
        </div>

      </div>

      {/* top info cards ends here  */}



      <div className=" bg-white rounded-xl border border-gray-200 ">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 px-8 pt-5">
          {/* Search Bar - stays on the left */}
          <div className="flex items-center px-3 py-2 rounded-md   w-full sm:w-1/3 focus-within:ring-2 focus-within:ring-orange-500">
            <Search className="text-gray-500 mr-2 " size={18} />
            <input
              type="text"
              placeholder="Search Startup..."
              className="bg-transparent outline-none text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Grid for right-aligned filters */}
          <div className="grid sm:grid-cols-2 gap-2 w-full sm:w-auto sm:ml-auto">
            {/* Date Range Selector */}
            <div className="flex items-center bg-white border  px-3 py-2 rounded-xl text-sm space-x-1 hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <CalendarDays className="text-gray-500" size={16} />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="From"
                className="outline-none bg-transparent w-[90px]"
                dateFormat="dd/MM/yyyy"
              />
              <span className="text-gray-400">-</span>
              <CalendarDays className="text-gray-500" size={16} />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="To"
                className="outline-none bg-transparent w-[90px]"
                dateFormat="dd/MM/yyyy"
              />
            </div>

            {/* Status Selector */}
            <div className="relative w-full">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center justify-between w-full px-4 py-2 bg-white border hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-xl text-sm text-gray-700 hover:bg-gray-50"
              >
                <span>{statusFilter.label}</span>
                <ChevronDown size={16} />
              </button>
              {showStatusDropdown && (
                <div className="absolute mt-1 w-full bg-white border rounded-xl hover:drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-10">
                  {statusOptions.map((status) => (
                    <div
                      key={status.value}
                      onClick={() => {
                        setStatusFilter(status);
                        setShowStatusDropdown(false);
                        setCurrentPage(1); // reset to page 1
                      }}
                      className="px-4 py-2 text-sm rounded-xl text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      {status.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Legends */}

          </div>
        </div>

<div className="w-full overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm text-left text-gray-700 border-t  border-gray-200 rounded-xl">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 border-r">Sr. No.</th>
                <th className="px-4 py-3 border-r">Startup Name</th>
                <th className="px-4 py-3 border-r">Registration Number</th>
                <th className="px-4 py-3 border-r">Date Of Application</th>
                <th className="px-4 py-3 border-r">Action Date</th>
                <th className="px-4 py-3 border-r">Status</th>
                <th className="px-4 py-3 border-r">Comments</th>
                <th className="px-4 py-3 text-center">Download</th>
              </tr>
            </thead>
            <tbody>
              {allStartups.map((startup, idx) => (
<tr
  key={idx}
  className="border-b hover:bg-gray-50 cursor-pointer transition-transform ease-in-out duration-1000"
  onClick={() => {
    setSelectedId(startup.id);
    setDialogOpen(true);
  }}
>                  <td className="px-4 py-3 text-xs">{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                  <td className="px-4 py-3 text-xs">{startup.user?.company_name}</td>
                  <td className="px-4 py-3 text-xs">{startup.user?.registration_no}</td>
                  <td className="px-4 py-3 text-xs">
                    {startup.createdAt ? new Date(startup.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-4 py-3 text-xs">{new Date(startup.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
  <span
    className={`px-2 py-1 rounded-md text-xs font-medium ${
      statusColors[startup.documentStatus] || ""
    }`}
  >
    {startup.documentStatus === "created" || startup.documentStatus === null
      ? "Pending"
      : startup.documentStatus}
  </span>
</td>

<td className="px-4 py-3 text-xs truncate max-w-[100px] sm:max-w-[150px]">

                    {startup.comment ? (
                      <span className="text-gray-600 text-xs">{startup.comment}</span>
                    ) : (
                      <span className="text-gray-400 text-xs">No comments</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button className="text-emerald-600 hover:text-blue-800 transition">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-6 px-6 pb-4">
            <p className="text-xs text-gray-500 mb-2 sm:mb-0">
              Showing <span className="text-emerald-600">
                {(currentPage - 1) * rowsPerPage + 1} to {(currentPage - 1) * rowsPerPage + allStartups.length}
              </span> of {totalCount} entries
            </p>




            <div className="flex justify-center items-center space-x-1 w-full sm:w-auto">
              {currentPage > 1 && (
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  className="px-2 py-1 text-xs rounded border hover:bg-gray-100 text-gray-700"
                >
                  <ArrowLeftToLine size={14} className="text-gray-700" />
                </button>
              )}

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 text-xs rounded border 
      ${currentPage === i + 1
                      ? "bg-gray-800 text-white font-semibold"
                      : "bg-white text-gray-700 hover:bg-gray-100"}`}
                >
                  {i + 1}
                </button>
              ))}


              {currentPage < totalPages && (
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  className="px-2 py-1 text-xs rounded border hover:bg-gray-100 text-gray-700"
                >
                  <ArrowRightToLine size={14} className="text-gray-700" />
                </button>
              )}
            </div>
          </div>


        </div>

      </div>


      {/* downloading excel animation pop up dialog box */}

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <RiFileExcel2Fill className="text-green-500 mb-4" size={48} />
            <video src={DownloadAnimation}>

            </video>
            <p className="text-sm text-gray-600">Your file is being prepared. Please wait.</p>
          </div>
        </div>
      )}
      {dialogOpen && (
  <div className="fixed inset-0 z-50 bg-white text-gray-800 overflow-auto">
    <div className="flex justify-between items-center px-6 py-4 border-b shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">Second Tranche Details</h2>
      <button
        onClick={() => setDialogOpen(false)}
        className="text-gray-600 hover:text-red-500 text-xl font-bold"
      >
        ✕
      </button>
    </div>
    <div className=" bg-slate-50">
      <SecondTrancheModuleDetails id={selectedId} />
    </div>
  </div>
)}

    </div>

  );
};

export default StartupTable;
