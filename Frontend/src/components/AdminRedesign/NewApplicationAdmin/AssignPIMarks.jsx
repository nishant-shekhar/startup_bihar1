// AssignPIMarks.jsx
import React, { useState } from 'react';
import { Search, Edit2, Save, X, CheckCircle, XCircle } from 'lucide-react';

const AssignPIMarks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [passMarks, setPassMarks] = useState(50);
  const [isEditingPassMarks, setIsEditingPassMarks] = useState(false);
  const [tempPassMarks, setTempPassMarks] = useState(50);

  // Mock data - candidates who have been assigned PI dates (only those who PASSED written exam)
  const [candidatesData, setCandidatesData] = useState([
    { id: 1, sbNo: 'SB2024001', startupName: 'Tech Innovators Pvt Ltd', applicantName: 'Rajesh Kumar', piDate: '15 Nov 2024', timeSlot: '10:00 AM - 12:00 PM', writtenMarks: 85, piMarks: null, piAssigned: true },
    { id: 2, sbNo: 'SB2024002', startupName: 'Green Solutions LLP', applicantName: 'Priya Sharma', piDate: '15 Nov 2024', timeSlot: '10:00 AM - 12:00 PM', writtenMarks: 72, piMarks: null, piAssigned: true },
    { id: 3, sbNo: 'SB2024003', startupName: 'EduTech Solutions', applicantName: 'Amit Verma', piDate: '15 Nov 2024', timeSlot: '2:00 PM - 4:00 PM', writtenMarks: 90, piMarks: null, piAssigned: true },
    { id: 4, sbNo: 'SB2024004', startupName: 'HealthTech Inc', applicantName: 'Sneha Patel', piDate: '17 Nov 2024', timeSlot: '10:00 AM - 12:00 PM', writtenMarks: 68, piMarks: null, piAssigned: true },
    { id: 5, sbNo: 'SB2024005', startupName: 'AgriSmart Solutions', applicantName: 'Vikram Singh', piDate: '17 Nov 2024', timeSlot: '10:00 AM - 12:00 PM', writtenMarks: 88, piMarks: null, piAssigned: true },
    { id: 7, sbNo: 'SB2024007', startupName: 'EcoWaste Management', applicantName: 'Rahul Jain', piDate: '17 Nov 2024', timeSlot: '2:00 PM - 4:00 PM', writtenMarks: 75, piMarks: null, piAssigned: true },
    { id: 8, sbNo: 'SB2024008', startupName: 'Smart Logistics', applicantName: 'Neha Reddy', piDate: '15 Nov 2024', timeSlot: '2:00 PM - 4:00 PM', writtenMarks: 92, piMarks: null, piAssigned: true },
    { id: 10, sbNo: 'SB2024010', startupName: 'CloudSync Services', applicantName: 'Pooja Iyer', piDate: '17 Nov 2024', timeSlot: '2:00 PM - 4:00 PM', writtenMarks: 82, piMarks: null, piAssigned: true },
  ]);

  // Filter based on search
  const filteredData = candidatesData.filter(candidate => 
    candidate.sbNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.applicantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarksChange = (id, value) => {
    // Allow empty string or validate the input
    if (value === '') {
      setCandidatesData(prev => 
        prev.map(candidate => 
          candidate.id === id ? { ...candidate, piMarks: null } : candidate
        )
      );
      return;
    }
    
    // Parse the value
    const numValue = parseInt(value);
    
    // Only allow if it's a valid number between 0-100
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setCandidatesData(prev => 
        prev.map(candidate => 
          candidate.id === id ? { ...candidate, piMarks: numValue } : candidate
        )
      );
    }
    // If trying to enter more than 100, ignore the input
  };

  const handleSavePassMarks = () => {
    setPassMarks(tempPassMarks);
    setIsEditingPassMarks(false);
  };

  const handleCancelPassMarks = () => {
    setTempPassMarks(passMarks);
    setIsEditingPassMarks(false);
  };

  const getResultStatus = (marks) => {
    if (marks === null || marks === undefined) return null;
    return marks >= passMarks ? 'pass' : 'fail';
  };

  const stats = {
    total: candidatesData.length,
    marked: candidatesData.filter(c => c.piMarks !== null).length,
    passed: candidatesData.filter(c => c.piMarks !== null && c.piMarks >= passMarks).length,
    failed: candidatesData.filter(c => c.piMarks !== null && c.piMarks < passMarks).length,
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assign PI Marks</h1>
        <p className="text-sm text-gray-500 mt-1">Enter marks for candidates who appeared for Personal Interview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold uppercase">Total Candidates</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold uppercase">Marked</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.marked}</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
          <p className="text-xs text-green-600 font-semibold uppercase">Passed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.passed}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
          <p className="text-xs text-red-600 font-semibold uppercase">Failed</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          
          {/* Search Bar */}
          <div className="flex-1 relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by SB No, startup name, or applicant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Pass Marks Section */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Pass Marks:</span>
            {isEditingPassMarks ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tempPassMarks}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setTempPassMarks('');
                      return;
                    }
                    const numValue = parseInt(value);
                    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                      setTempPassMarks(numValue);
                    }
                  }}
                  className="w-20 text-gray-900 px-3 py-2 border border-purple-300 rounded-lg text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
                <button
                  onClick={handleSavePassMarks}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={handleCancelPassMarks}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-lg font-bold border border-purple-200">
                  {passMarks}
                </span>
                <button
                  onClick={() => {
                    setIsEditingPassMarks(true);
                    setTempPassMarks(passMarks);
                  }}
                  className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Edit Pass Marks"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredData.length} candidate{filteredData.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sr.No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SB No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Startup Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Applicant Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PI Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time Slot</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Written Marks</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PI Marks (Out of 100)</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((candidate, index) => {
                  const result = getResultStatus(candidate.piMarks);
                  return (
                    <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-xs text-gray-600 font-medium">{index + 1}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 font-mono font-semibold">{candidate.sbNo}</td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-900">{candidate.startupName}</td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-900">{candidate.applicantName}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{candidate.piDate}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">{candidate.timeSlot}</td>
                      <td className="px-4 py-3 text-xs font-bold text-blue-600">{candidate.writtenMarks}</td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={candidate.piMarks === null ? '' : candidate.piMarks}
                          onChange={(e) => handleMarksChange(candidate.id, e.target.value)}
                          placeholder="Enter"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-900 text-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {result === null ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-gray-50 text-gray-500 border-gray-200">
                            Not Marked
                          </span>
                        ) : result === 'pass' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border bg-green-50 text-green-700 border-green-200">
                            <CheckCircle size={14} />
                            PASS
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border bg-red-50 text-red-700 border-red-200">
                            <XCircle size={14} />
                            FAIL
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-8 text-center text-sm text-gray-500">
                    No candidates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignPIMarks;
