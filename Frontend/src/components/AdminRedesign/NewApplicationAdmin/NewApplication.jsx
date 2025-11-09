import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, ChevronLeft, ChevronRight, X } from 'lucide-react';

const NewApplication = ({ onRowClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedEntity, setSelectedEntity] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load data from localStorage on component mount
  useEffect(() => {
    const loadDataFromLocalStorage = () => {
      try {
        // Mock data for NEW applications (submitted but not yet reviewed)
        const mockNewApplications = [
          {
            srNo: 1,
            entityRegistrationNumber: 'REG2024001',
            entityName: 'Tech Innovators Pvt Ltd',
            fullName: 'Rajesh Kumar',
            mobile: '9876543210',
            entityType: 'Pvt Ltd',
            stage: 'Ideation',
            date: '2024-11-01',
            id: 1,
            status: 'submitted'
          },
          {
            srNo: 2,
            entityRegistrationNumber: 'REG2024002',
            entityName: 'Green Solutions LLP',
            fullName: 'Priya Sharma',
            mobile: '9876543211',
            entityType: 'LLP',
            stage: 'Validation',
            date: '2024-11-02',
            id: 2,
            status: 'submitted'
          },
          {
            srNo: 3,
            entityRegistrationNumber: 'REG2024003',
            entityName: 'EduTech Solutions',
            fullName: 'Amit Verma',
            mobile: '9876543212',
            entityType: 'Pvt Ltd',
            stage: 'Early Traction',
            date: '2024-11-03',
            id: 3,
            status: 'submitted'
          },
          {
            srNo: 4,
            entityRegistrationNumber: 'REG2024004',
            entityName: 'HealthTech Inc',
            fullName: 'Sneha Patel',
            mobile: '9876543213',
            entityType: 'Pvt Ltd',
            stage: 'Ideation',
            date: '2024-11-04',
            id: 4,
            status: 'submitted'
          },
          {
            srNo: 5,
            entityRegistrationNumber: 'REG2024005',
            entityName: 'AgriSmart Solutions',
            fullName: 'Vikram Singh',
            mobile: '9876543214',
            entityType: 'Partnership',
            stage: 'Scaling',
            date: '2024-11-05',
            id: 5,
            status: 'submitted'
          },
        ];

        // Try to load from localStorage first
        const basicDetails = JSON.parse(localStorage.getItem("basicDetails") || "{}");
        const entityDetails = JSON.parse(localStorage.getItem("entityDetails") || "{}");

        // If localStorage has data, add it to the mock data
        if (basicDetails.fullName && entityDetails.entityName) {
          const transformedData = {
            srNo: mockNewApplications.length + 1,
            entityRegistrationNumber: entityDetails.entityRegistrationNumber || "N/A",
            entityName: entityDetails.entityName || "N/A",
            fullName: basicDetails.fullName || "N/A",
            mobile: basicDetails.mobile || "N/A",
            entityType: entityDetails.entityType || "N/A",
            stage: entityDetails.stage || "N/A",
            date: entityDetails.dateOfRegistration || new Date().toLocaleDateString(),
            id: mockNewApplications.length + 1,
            status: 'submitted'
          };
          setAllData([...mockNewApplications, transformedData]);
        } else {
          // Use mock data if no localStorage data
          setAllData(mockNewApplications);
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        setAllData([]);
      } finally {
        setLoading(false);
      }
    };

    loadDataFromLocalStorage();
  }, []);

  // Filter logic
  const filteredData = allData.filter(item => {
    const matchesSearch = 
      item.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entityRegistrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mobile.includes(searchQuery) ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStage = selectedStage === 'All' || item.stage === selectedStage;
    const matchesEntity = selectedEntity === 'All' || item.entityType === selectedEntity;
    
    return matchesSearch && matchesStage && matchesEntity;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const stages = ['All', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Ideation', 'Validation', 'Early Traction', 'Scaling'];
  const entities = ['All', 'Pvt Ltd', 'LLP', 'Partnership', 'OPC', 'Private Limited'];

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStage('All');
    setSelectedEntity('All');
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setLoading(true);
    // Reload data from localStorage
    setTimeout(() => {
      const mockNewApplications = [
        {
          srNo: 1,
          entityRegistrationNumber: 'REG2024001',
          entityName: 'Tech Innovators Pvt Ltd',
          fullName: 'Rajesh Kumar',
          mobile: '9876543210',
          entityType: 'Pvt Ltd',
          stage: 'Ideation',
          date: '2024-11-01',
          id: 1,
          status: 'submitted'
        },
        {
          srNo: 2,
          entityRegistrationNumber: 'REG2024002',
          entityName: 'Green Solutions LLP',
          fullName: 'Priya Sharma',
          mobile: '9876543211',
          entityType: 'LLP',
          stage: 'Validation',
          date: '2024-11-02',
          id: 2,
          status: 'submitted'
        },
        {
          srNo: 3,
          entityRegistrationNumber: 'REG2024003',
          entityName: 'EduTech Solutions',
          fullName: 'Amit Verma',
          mobile: '9876543212',
          entityType: 'Pvt Ltd',
          stage: 'Early Traction',
          date: '2024-11-03',
          id: 3,
          status: 'submitted'
        },
        {
          srNo: 4,
          entityRegistrationNumber: 'REG2024004',
          entityName: 'HealthTech Inc',
          fullName: 'Sneha Patel',
          mobile: '9876543213',
          entityType: 'Pvt Ltd',
          stage: 'Ideation',
          date: '2024-11-04',
          id: 4,
          status: 'submitted'
        },
        {
          srNo: 5,
          entityRegistrationNumber: 'REG2024005',
          entityName: 'AgriSmart Solutions',
          fullName: 'Vikram Singh',
          mobile: '9876543214',
          entityType: 'Partnership',
          stage: 'Scaling',
          date: '2024-11-05',
          id: 5,
          status: 'submitted'
        },
      ];

      const basicDetails = JSON.parse(localStorage.getItem("basicDetails") || "{}");
      const entityDetails = JSON.parse(localStorage.getItem("entityDetails") || "{}");

      if (basicDetails.fullName && entityDetails.entityName) {
        const transformedData = {
          srNo: mockNewApplications.length + 1,
          entityRegistrationNumber: entityDetails.entityRegistrationNumber || "N/A",
          entityName: entityDetails.entityName || "N/A",
          fullName: basicDetails.fullName || "N/A",
          mobile: basicDetails.mobile || "N/A",
          entityType: entityDetails.entityType || "N/A",
          stage: entityDetails.stage || "N/A",
          date: entityDetails.dateOfRegistration || new Date().toLocaleDateString(),
          id: mockNewApplications.length + 1,
          status: 'submitted'
        };
        setAllData([...mockNewApplications, transformedData]);
      } else {
        setAllData(mockNewApplications);
      }
      setLoading(false);
    }, 500);
  };

  const getStageColor = (stage) => {
    const colors = {
      'Pre-Seed': 'bg-purple-50 text-purple-600 border-purple-200',
      'Seed': 'bg-blue-50 text-blue-600 border-blue-200',
      'Series A': 'bg-green-50 text-green-600 border-green-200',
      'Series B': 'bg-orange-50 text-orange-600 border-orange-200',
      'Ideation': 'bg-indigo-50 text-indigo-600 border-indigo-200',
      'Validation': 'bg-pink-50 text-pink-600 border-pink-200',
      'Early Traction': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'Scaling': 'bg-cyan-50 text-cyan-600 border-cyan-200',
    };
    return colors[stage] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="p-6  min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Applications</h1>
        <p className="text-sm text-gray-500 mt-1">View all submitted startup applications</p>
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
                showFilters ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
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
                <label className="block text-xs font-semibold text-gray-700 mb-2">Stage</label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              {/* Entity Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Entity Type</label>
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {entities.map(entity => (
                    <option key={entity} value={entity}>{entity}</option>
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
          Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sr.No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Entity Registration No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Entity Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Full Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Entity Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
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
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium">{startIndex + index + 1}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-mono">{item.entityRegistrationNumber}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">{item.entityName}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">{item.fullName}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{item.mobile}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{item.entityType}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStageColor(item.stage)}`}>
                        {item.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{item.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                    No applications found. Try adjusting your filters or submit a new application.
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
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
