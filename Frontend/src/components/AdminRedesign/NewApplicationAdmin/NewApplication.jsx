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
  const [selectedStatus, setSelectedStatus] = useState("all");
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
    <div className="p-6 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Applications</h1>
        <p className="text-sm text-gray-500 mt-1">
          View all submitted startup applications
        </p>
      </div>

      {/* Status Tabs */}
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-6">
            <button
              onClick={() => {
                setSelectedStatus("all");
                setCurrentPage(1);
              }}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedStatus === "all"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Applications
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  selectedStatus === "all"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {allData.length}
              </span>
            </button>
            <button
              onClick={() => {
                setSelectedStatus("submitted");
                setCurrentPage(1);
              }}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedStatus === "submitted"
                  ? "border-yellow-600 text-yellow-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending Review
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  selectedStatus === "submitted"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {allData.filter((item) => item.status === "submitted").length}
              </span>
            </button>
            <button
              onClick={() => {
                setSelectedStatus("accepted");
                setCurrentPage(1);
              }}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedStatus === "accepted"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Accepted
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  selectedStatus === "accepted"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {allData.filter((item) => item.status === "accepted").length}
              </span>
            </button>
            <button
              onClick={() => {
                setSelectedStatus("rejected");
                setCurrentPage(1);
              }}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                selectedStatus === "rejected"
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Rejected
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  selectedStatus === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {allData.filter((item) => item.status === "rejected").length}
              </span>
            </button>
          </nav>
        </div>
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, entity, registration number, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-black border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Filter size={16} />
              Filters
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium border border-gray-200 transition-colors">
              <Download size={16} />
              Export
            </button>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Stage Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entity Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Entity Type
                </label>
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {entities.map((entity) => (
                    <option key={entity} value={entity}>
                      {entity}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium border border-red-200 transition-colors"
              >
                <X size={16} />
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
          results
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sr.No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Entity Registration No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Entity Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Entity Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Review Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    Loading applications...
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => onRowClick(item)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-mono">
                      {item.entityDetails?.entityRegistrationNumber || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">
                      {item.entityDetails?.entityName ||
                        item.userSignup?.startupName ||
                        "N/A"}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">
                      {item.basicDetails?.fullName ||
                        item.userSignup?.founderName ||
                        "N/A"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {item.userSignup?.phoneNumber || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {item.entityDetails?.entityType || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStageColor(
                          item.startupDetails?.stage || "N/A"
                        )}`}
                      >
                        {item.startupDetails?.stage || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {item.submissionDate ||
                        item.entityDetails?.dateOfRegistration ||
                        "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                            item.reviews?.admin1
                              ? "bg-green-100 border-green-500"
                              : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          <CheckCircle
                            size={14}
                            className={
                              item.reviews?.admin1
                                ? "text-green-600"
                                : "text-gray-400"
                            }
                          />
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                            item.reviews?.admin2
                              ? "bg-green-100 border-green-500"
                              : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          <CheckCircle
                            size={14}
                            className={
                              item.reviews?.admin2
                                ? "text-green-600"
                                : "text-gray-400"
                            }
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No applications found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
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
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewApplication;
