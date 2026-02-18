// AssignPIMarks.jsx
import React, { useState } from 'react';
import { Search, Edit2, Save, X, CheckCircle, XCircle, Calendar, Clock, ArrowLeft, RefreshCw, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const AssignPIMarks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryMain, setSearchQueryMain] = useState('');
  const [passMarks, setPassMarks] = useState(50);
  const [isEditingPassMarks, setIsEditingPassMarks] = useState(false);
  const [tempPassMarks, setTempPassMarks] = useState(50);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageMain, setCurrentPageMain] = useState(1);
  const [itemsPerPage] = useState(10);
  const [itemsPerPageMain] = useState(10);

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

  // Group candidates by PI date and time slot
  const batches = candidatesData.reduce((acc, candidate) => {
    const key = `${candidate.piDate}|${candidate.timeSlot}`;
    if (!acc[key]) {
      acc[key] = {
        piDate: candidate.piDate,
        timeSlot: candidate.timeSlot,
        candidates: [],
      };
    }
    acc[key].candidates.push(candidate);
    return acc;
  }, {});

  const batchList = Object.values(batches);

  const handleMarksChange = (id, value) => {
    if (value === '') {
      setCandidatesData(prev =>
        prev.map(candidate =>
          candidate.id === id ? { ...candidate, piMarks: null } : candidate
        )
      );
      return;
    }

    const numValue = parseInt(value);

    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setCandidatesData(prev =>
        prev.map(candidate =>
          candidate.id === id ? { ...candidate, piMarks: numValue } : candidate
        )
      );
    }
  };

  const handleSavePassMarks = () => {
    setPassMarks(tempPassMarks);
    setIsEditingPassMarks(false);
  };

  const handleCancelPassMarks = () => {
    setTempPassMarks(passMarks);
    setIsEditingPassMarks(false);
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setCurrentPage(1);
    console.log('Refreshing data...');
  };

  const handleExport = () => {
    console.log('Exporting data...');
    alert('Export functionality will download PI marks data as CSV/Excel');
  };

  const handleRefreshMain = () => {
    setSearchQueryMain('');
    setCurrentPageMain(1);
    console.log('Refreshing main view data...');
  };

  const handleExportMain = () => {
    console.log('Exporting main view data...');
    alert('Export functionality will download PI batches data as CSV/Excel');
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


  if (selectedBatch) {
    const filteredCandidates = selectedBatch.candidates.filter(
      (candidate) =>
        candidate.sbNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.applicantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

    const batchStats = {
      total: selectedBatch.candidates.length,
      marked: selectedBatch.candidates.filter((c) => c.piMarks !== null).length,
      passed: selectedBatch.candidates.filter(
        (c) => c.piMarks !== null && c.piMarks >= passMarks
      ).length,
      failed: selectedBatch.candidates.filter(
        (c) => c.piMarks !== null && c.piMarks < passMarks
      ).length,
    };

    return (
      <div className="p-6 min-h-screen bg-slate-50">
        {/* Back Button and Action Buttons */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedBatch(null);
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors border border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
            Back to PI Batches
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm transition-all"
              title="Refresh"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={handleExport}
              className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm transition-all"
              title="Export"
            >
              <Download size={20} />
            </button>
          </div>
        </div>


        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6 shadow-sm">
          <div className="bg-[#1a2845] px-6 py-8 text-white border-b border-blue-900/30">
            <h1 className="text-3xl font-bold">
              Personal Interview Marks
            </h1>
            <p className="text-blue-300 mt-2">
              PI Date: {selectedBatch.piDate}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="bg-blue-900/30 border border-blue-700/50 px-3 py-1 rounded-full text-sm font-medium">
                Time: {selectedBatch.timeSlot}
              </span>
              <span className="bg-blue-900/30 border border-blue-700/50 px-3 py-1 rounded-full text-sm font-medium">
                Total Candidates: {selectedBatch.candidates.length}
              </span>
              <span className="bg-blue-900/30 border border-blue-700/50 px-3 py-1 rounded-full text-sm font-medium">
                PI Assessment
              </span>
            </div>
          </div>


          <div className="grid grid-cols-4 gap-4 p-6 bg-slate-50/50">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-500 font-semibold uppercase">Total</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{batchStats.total}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <p className="text-xs text-slate-600 font-semibold uppercase">Marked</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{batchStats.marked}</p>
            </div>
            <div className="bg-white rounded-lg border border-green-200 p-4">
              <p className="text-xs text-green-600 font-semibold uppercase">Passed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{batchStats.passed}</p>
            </div>
            <div className="bg-white rounded-lg border border-red-200 p-4">
              <p className="text-xs text-red-600 font-semibold uppercase">Failed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{batchStats.failed}</p>
            </div>
          </div>
        </div>

        {/* Search Bar and Pass Marks Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by Registration No, startup name, or applicant name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm text-slate-900"
              />
            </div>

            {/* Pass Marks Section */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">Pass Marks:</span>
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
                    className="w-20 text-slate-900 px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-slate-400"
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
                  <span className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg text-lg font-bold border border-slate-300">
                    {passMarks}
                  </span>
                  <button
                    onClick={() => {
                      setIsEditingPassMarks(true);
                      setTempPassMarks(passMarks);
                    }}
                    className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                    title="Edit Pass Marks"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 tracking-wider">S.No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Registration No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Startup Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Applicant Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Written Marks</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">PI Marks (Out of 100)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCandidates.length > 0 ? (
                  paginatedCandidates.map((candidate, index) => {
                    const result = getResultStatus(candidate.piMarks);
                    return (
                      <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{startIndex + index + 1}</td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-mono font-semibold">{candidate.sbNo}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{candidate.startupName}</td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{candidate.applicantName}</td>
                        <td className="px-6 py-4 text-sm font-bold text-blue-600">{candidate.writtenMarks}</td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={candidate.piMarks === "" ? "" : candidate.piMarks}
                            onChange={(e) => handleMarksChange(candidate.id, e.target.value)}
                            placeholder="Enter"
                            className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent placeholder:text-slate-400"
                          />
                        </td>
                        <td className="px-6 py-4">
                          {result === null ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-500 border-slate-200">
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
                    <td colSpan="7" className="px-6 py-8 text-center text-sm text-slate-500">
                      No candidates found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredCandidates.length > 0 && (
            <div className="border-t border-slate-100 bg-white px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredCandidates.length)} of {filteredCandidates.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages || 1)].map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          currentPage === pageNum
                            ? "bg-[#1a2845] text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages || 1, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Filter PI batches based on search query
  const filteredBatches = batchList.filter(
    (batch) =>
      batch.piDate.toLowerCase().includes(searchQueryMain.toLowerCase()) ||
      batch.timeSlot.toLowerCase().includes(searchQueryMain.toLowerCase())
  );

  // Pagination logic for main view
  const totalPagesMain = Math.ceil(filteredBatches.length / itemsPerPageMain);
  const startIndexMain = (currentPageMain - 1) * itemsPerPageMain;
  const endIndexMain = startIndexMain + itemsPerPageMain;
  const paginatedBatches = filteredBatches.slice(startIndexMain, endIndexMain);

  // Default view: Show list of PI batches
  return (
    <div className="p-6 min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Assign PI Marks</h1>
          <p className="text-slate-500 mt-2 text-sm lg:text-base">
            Select a PI batch to view candidates and assign marks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshMain}
            className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm transition-all"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={handleExportMain}
            className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm transition-all"
            title="Export"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Candidates</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 font-semibold uppercase">Marked</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.marked}</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-600 font-semibold uppercase">Passed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.passed}</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 ">
          <p className="text-xs text-red-600 font-semibold uppercase">Failed</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-start mb-6">
        <div className="relative w-full lg:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by PI date or time slot..."
            value={searchQueryMain}
            onChange={(e) => {
              setSearchQueryMain(e.target.value);
              setCurrentPageMain(1);
            }}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm text-slate-900"
          />
        </div>
      </div>

      {/* PI Batches List */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500  tracking-wider">
                  S. No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  PI Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Time Slot
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Candidates
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Marked
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Passed
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Failed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedBatches.length > 0 ? (
                paginatedBatches.map((batch, index) => {
                  const batchMarked = batch.candidates.filter((c) => c.piMarks !== null).length;
                  const batchPassed = batch.candidates.filter(
                    (c) => c.piMarks !== null && c.piMarks >= passMarks
                  ).length;
                  const batchFailed = batch.candidates.filter(
                    (c) => c.piMarks !== null && c.piMarks < passMarks
                  ).length;

                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setSelectedBatch(batch);
                        setCurrentPage(1);
                      }}
                      className="group hover:bg-slate-50/50 cursor-pointer transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                        {startIndexMain + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-slate-500" />
                          {batch.piDate}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          {batch.timeSlot}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm  text-slate-900 pl-8">
                        {batch.candidates.length}
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600 font-medium">
                        {batchMarked}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">
                        {batchPassed}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600 font-medium">
                        {batchFailed}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    No PI batches found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredBatches.length > 0 && (
          <div className="border-t border-slate-100 bg-white px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {startIndexMain + 1}-{Math.min(endIndexMain, filteredBatches.length)} of {filteredBatches.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPageMain((prev) => Math.max(prev - 1, 1))}
                disabled={currentPageMain === 1}
                className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPagesMain }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPageMain(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPageMain === page
                        ? "bg-[#1a2845] text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPageMain((prev) => Math.min(prev + 1, totalPagesMain))}
                disabled={currentPageMain === totalPagesMain}
                className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignPIMarks;
