// NewApplication.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
} from "lucide-react";
import { mockNewApplicationsList } from "./mockApplicationData";

const NewApplication = ({ onRowClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");
  const [selectedEntity, setSelectedEntity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("submitted");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load data from mock file instead of localStorage
  useEffect(() => {
    try {
      // Simply use the imported mock data
      setAllData(mockNewApplicationsList);
    } catch (error) {
      console.error("Error loading data:", error);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter logic
  const filteredData = allData.filter((item) => {
    const entityName =
      item.entityDetails?.entityName || item.userSignup?.startupName || "";
    const entityRegNum = item.entityDetails?.entityRegistrationNumber || "";
    const mobile = item.userSignup?.phoneNumber || "";
    const fullName = item.basicDetails?.fullName || "";
    const entityType = item.entityDetails?.entityType || "";
    const stage = item.startupDetails?.stage || "";
    const status = item.status || "submitted";

    const matchesSearch =
      entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entityRegNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mobile.includes(searchQuery) ||
      fullName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = selectedStage === "All" || stage === selectedStage;
    const matchesEntity =
      selectedEntity === "All" || entityType === selectedEntity;

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "accepted" && status === "accepted") ||
      (selectedStatus === "rejected" && status === "rejected") ||
      (selectedStatus === "submitted" && status === "submitted");

    return matchesSearch && matchesStage && matchesEntity && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const stages = [
    "All",
    "Pre-Seed",
    "Seed",
    "Series A",
    "Series B",
    "Ideation",
    "Validation",
    "Early Traction",
    "Scaling",
  ];
  const entities = [
    "All",
    "Pvt Ltd",
    "LLP",
    "Partnership",
    "OPC",
    "Private Limited",
  ];

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStage("All");
    setSelectedEntity("All");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getStageColor = (stage) => {
    const colors = {
      "Pre-Seed": "bg-purple-50 text-purple-600 border-purple-200",
      Seed: "bg-blue-50 text-blue-600 border-blue-200",
      "Series A": "bg-green-50 text-green-600 border-green-200",
      "Series B": "bg-orange-50 text-orange-600 border-orange-200",
      Ideation: "bg-indigo-50 text-indigo-600 border-indigo-200",
      Validation: "bg-pink-50 text-pink-600 border-pink-200",
      "Early Traction": "bg-yellow-50 text-yellow-600 border-yellow-200",
      Scaling: "bg-cyan-50 text-cyan-600 border-cyan-200",
    };
    return colors[stage] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  return (
    <div className="min-h-screen relative bg-gray-50/50">
      {/* Dotted Background Pattern */}
      {/* <div className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      /> */}

      <div className="relative z-10 p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Startup Applications</h1>
            <p className="text-gray-500 mt-2 text-sm lg:text-base">
              View and manage all submitted startup applications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm transition-all"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2845] text-white hover:bg-[#152138] rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Status Tabs and Search/Filter Bar */}
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 ${showFilters ? 'mb-2' : 'mb-6'}`}>
          {/* Status Tabs */}
          <div className="inline-flex bg-white rounded-full p-1.5 border border-gray-200 shadow-sm overflow-x-auto max-w-full">
            <button
              onClick={() => {
                setSelectedStatus("submitted");
                setCurrentPage(1);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedStatus === "submitted"
                  ? "bg-[#1a2845] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Pending Review
            </button>
            <button
              onClick={() => {
                setSelectedStatus("all");
                setCurrentPage(1);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedStatus === "all"
                  ? "bg-[#1a2845] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              All Applications
            </button>
            <button
              onClick={() => {
                setSelectedStatus("accepted");
                setCurrentPage(1);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedStatus === "accepted"
                  ? "bg-[#1a2845] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => {
                setSelectedStatus("rejected");
                setCurrentPage(1);
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedStatus === "rejected"
                  ? "bg-[#1a2845] text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Rejected
            </button>
          </div>

          {/* Search Bar and Filter */}
          <div className="flex items-center gap-3 w-full lg:w-auto relative">
            <div className="relative flex-1 lg:flex-none">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full lg:w-72 pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-sm text-gray-900"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-full border transition-all ${
                showFilters
                  ? "bg-[#1a2845] border-gray-900 text-white shadow-md scale-105"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } shadow-sm active:scale-95`}
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="flex justify-end mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 flex items-center gap-3">
              {/* Stage Filter */}
              <div className="relative group">
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 text-gray-900 text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all cursor-pointer min-w-[180px]"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage === "All" ? "All Stages" : stage}
                    </option>
                  ))}
                </select>
                <X size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {/* Entity Filter */}
              <div className="relative group">
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 text-gray-900 text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all cursor-pointer min-w-[150px]"
                >
                  {entities.map((entity) => (
                    <option key={entity} value={entity}>
                      {entity === "All" ? "All Entities" : entity}
                    </option>
                  ))}
                </select>
                <X size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {/* Clear Filters Button */}
              {(selectedStage !== "All" || selectedEntity !== "All") && (
                <button
                  onClick={handleClearFilters}
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Clear Filters"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        )}

      {/* Results Summary */}
      {/* <div className="mb-4 text-sm text-gray-600">
        Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
        {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
        results
      </div> */}

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Entity Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Founder
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Entity Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Review Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="animate-spin text-gray-900" size={24} />
                        <span className="mt-2">Loading applications...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr
                      key={item.id}
                      onClick={() => onRowClick(item)}
                      className="group hover:bg-gray-50/50 cursor-pointer transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-600">
                          {startIndex + index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {item.entityDetails?.entityRegistrationNumber || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font- text-gray-900">
                          {item.entityDetails?.entityName ||
                            item.userSignup?.startupName ||
                            "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {item.basicDetails?.fullName ||
                            item.userSignup?.founderName ||
                            "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {item.userSignup?.phoneNumber || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {item.entityDetails?.entityType || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStageColor(
                            item.startupDetails?.stage || "N/A"
                          )}`}
                        >
                          {item.startupDetails?.stage || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {item.submissionDate ||
                            item.entityDetails?.dateOfRegistration ||
                            "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="relative group/tooltip">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                                item.reviews?.admin1
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                  : "bg-gray-50 border-gray-200 text-gray-300"
                              }`}
                            >
                              <CheckCircle size={14} />
                            </div>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                              Admin 1: {item.reviews?.admin1 ? 'Reviewed' : 'Pending'}
                            </span>
                          </div>
                          <div className="relative group/tooltip">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                                item.reviews?.admin2
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                  : "bg-gray-50 border-gray-200 text-gray-300"
                              }`}
                            >
                              <CheckCircle size={14} />
                            </div>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                              Admin 2: {item.reviews?.admin2 ? 'Reviewed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                          <Search className="text-gray-300" size={20} />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No applications found</p>
                        <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search query</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="border-t border-gray-100 bg-white px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? "bg-[#1a2845] text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewApplication;
