// AssignExamDate.jsx
import React, { useState } from 'react';
import { Search, Calendar, Plus, ChevronLeft, ChevronRight, Clock, Download, RefreshCw } from 'lucide-react';
import AssignExamDateDetail from './AssignExamDateDetail';

const AssignExamDate = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotStartTime, setNewSlotStartTime] = useState('');
  const [newSlotEndTime, setNewSlotEndTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Track all assigned candidates globally
  const [assignedCandidates, setAssignedCandidates] = useState({
    // slotId: [candidateIds]
    // Start empty - candidates will be assigned by the user
  });

  // Mock data for available exam slots
  const [examSlots, setExamSlots] = useState([
    {
      id: 1,
      date: '5 Nov 2024',
      timeSlot: '1st Slot (9:00 AM - 11:00 AM)',
      assignedCount: 0,
      totalCapacity: 20,
      status: 'Active'
    },
    {
      id: 2,
      date: '5 Nov 2024',
      timeSlot: '2nd Slot (2:00 PM - 4:00 PM)',
      assignedCount: 0,
      totalCapacity: 20,
      status: 'Active'
    },
    {
      id: 3,
      date: '7 Nov 2024',
      timeSlot: '1st Slot (9:00 AM - 11:00 AM)',
      assignedCount: 0,
      totalCapacity: 25,
      status: 'Active'
    },
    {
      id: 4,
      date: '7 Nov 2024',
      timeSlot: '2nd Slot (2:00 PM - 4:00 PM)',
      assignedCount: 0,
      totalCapacity: 25,
      status: 'Active'
    },
    {
      id: 5,
      date: '10 Nov 2024',
      timeSlot: '1st Slot (9:00 AM - 11:00 AM)',
      assignedCount: 0,
      totalCapacity: 20,
      status: 'Active'
    },
  ]);

  // Filter slots based on search
  const filteredSlots = examSlots.filter((slot) =>
    slot.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.timeSlot.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredSlots.slice(startIndex, endIndex);

  const handleAddSlot = () => {
    if (newSlotDate && newSlotStartTime && newSlotEndTime) {
      const dateObj = new Date(newSlotDate);
      const formattedDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const timeSlot = `${newSlotStartTime} - ${newSlotEndTime}`;
      
      const newSlot = {
        id: examSlots.length + 1,
        date: formattedDate,
        timeSlot: timeSlot,
        assignedCount: 0,
        totalCapacity: 20,
        status: 'Active'
      };
      setExamSlots([...examSlots, newSlot]);
      setShowAddSlotModal(false);
      setNewSlotDate('');
      setNewSlotStartTime('');
      setNewSlotEndTime('');
    }
  };

  const getStatusColor = (status) => {
    return status === 'Full' 
      ? 'bg-red-50 text-red-600 border-red-200'
      : 'bg-green-50 text-green-600 border-green-200';
  };

  const getCapacityColor = (assigned, total) => {
    const percentage = (assigned / total) * 100;
    if (percentage >= 100) return 'text-red-600 font-bold';
    if (percentage >= 75) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  // Show detail view if a slot is selected
  if (selectedSlot) {
    return (
      <AssignExamDateDetail 
        slotData={selectedSlot}
        assignedCandidates={assignedCandidates}
        onBack={() => setSelectedSlot(null)}
        onSave={(selectedCandidateIds) => {
          // Add the newly assigned candidates to this slot
          const updatedAssignments = {
            ...assignedCandidates,
            [selectedSlot.id]: [...(assignedCandidates[selectedSlot.id] || []), ...selectedCandidateIds]
          };
          setAssignedCandidates(updatedAssignments);

          // Update the slot's assigned count
          const newAssignedCount = updatedAssignments[selectedSlot.id].length;
          setExamSlots(examSlots.map(slot => 
            slot.id === selectedSlot.id 
              ? { 
                  ...slot, 
                  assignedCount: newAssignedCount,
                  status: newAssignedCount >= slot.totalCapacity ? 'Full' : 'Active'
                }
              : slot
          ));
          setSelectedSlot(null);
        }}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen relative bg-slate-50">
        {/* Dotted Background Pattern */}
        <div className="absolute inset-0 z-0 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Assign Exam Date</h1>
              <p className="text-slate-500 mt-2 text-sm lg:text-base">
                Assign written exam dates to candidates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm transition-all"
                title="Refresh"
              >
                <RefreshCw size={20} />
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-sm transition-all" title="Export Schedule">
                <Download size={20} />
              </button>
              <button
                onClick={() => setShowAddSlotModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1a2845] text-white hover:bg-[#152138] rounded-lg font-medium shadow-md hover:shadow-lg transition-all text-sm"
              >
                <Plus size={18} />
                Add Exam Slot
              </button>
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
                placeholder="Search by date or time slot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm text-slate-900"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 tracking-wider">S.No</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Time Slot</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Capacity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentData.length > 0 ? (
                    currentData.map((slot, index) => (
                      <tr
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className="group hover:bg-slate-50/50 cursor-pointer transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-slate-600">{startIndex + index + 1}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-slate-400" />
                            <span className="text-sm  text-slate-900 group-hover:text-slate-900">{slot.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-slate-400" />
                            <span className="text-sm text-slate-600">{slot.timeSlot}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm  text-slate-900">{slot.assignedCount}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">{slot.totalCapacity}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            slot.status === 'Full'
                              ? 'bg-red-50 text-red-600 border-red-200'
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          }`}>
                            {slot.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                            <Search className="text-slate-300" size={20} />
                          </div>
                          <p className="text-sm font-medium text-slate-900">No exam slots found</p>
                          <p className="text-xs text-slate-500 mt-1">Try adjusting your search query</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredSlots.length > 0 && (
              <div className="border-t border-slate-100 bg-white px-6 py-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredSlots.length)} of {filteredSlots.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors">
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
                              : "text-slate-600 hover:bg-slate-50"
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
                    className="p-2 text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Slot Modal - Moved outside to overlay everything */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-[99999] p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 relative z-[100000]">
            <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Calendar size={22} className="text-slate-900" />
              Add New Exam Slot
            </h2>
            <p className="text-sm text-slate-500 mb-6">Create a new written exam time slot</p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Exam Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 text-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                />
              </div>

              <div className="border-t border-slate-100 pt-4">
                <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Clock size={16} className="text-slate-600" />
                  Time Slot <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newSlotStartTime}
                    onChange={(e) => setNewSlotStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newSlotEndTime}
                    onChange={(e) => setNewSlotEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 text-slate-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  />
                </div>
              </div>

              {newSlotStartTime && newSlotEndTime && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-600 font-semibold uppercase mb-1.5">Preview</p>
                  <p className="text-sm font-semibold text-slate-900">{newSlotStartTime} - {newSlotEndTime}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowAddSlotModal(false);
                  setNewSlotDate('');
                  setNewSlotStartTime('');
                  setNewSlotEndTime('');
                }}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSlot}
                disabled={!newSlotDate || !newSlotStartTime || !newSlotEndTime}
                className={`px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                  !newSlotDate || !newSlotStartTime || !newSlotEndTime
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-black shadow-md hover:shadow-lg'
                }`}
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignExamDate;
