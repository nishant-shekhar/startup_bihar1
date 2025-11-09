// AssignPIDate.jsx
import React, { useState } from 'react';
import { Search, Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import AssignPIDateDetail from './AssignPIDateDetail';

const AssignPIDate = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Track all assigned candidates globally (candidates who passed written exam)
  const [assignedCandidates, setAssignedCandidates] = useState({
    // slotId: [candidateIds]
    // Start empty - candidates will be assigned by the user
  });

  // Mock data for available PI slots
  const [piSlots, setPiSlots] = useState([
    {
      id: 1,
      date: '15 Nov 2024',
      timeSlot: '1st Slot (10:00 AM - 12:00 PM)',
      assignedCount: 0,
      totalCapacity: 15,
      status: 'Active'
    },
    {
      id: 2,
      date: '15 Nov 2024',
      timeSlot: '2nd Slot (2:00 PM - 4:00 PM)',
      assignedCount: 0,
      totalCapacity: 15,
      status: 'Active'
    },
    {
      id: 3,
      date: '17 Nov 2024',
      timeSlot: '1st Slot (10:00 AM - 12:00 PM)',
      assignedCount: 0,
      totalCapacity: 20,
      status: 'Active'
    },
    {
      id: 4,
      date: '17 Nov 2024',
      timeSlot: '2nd Slot (2:00 PM - 4:00 PM)',
      assignedCount: 0,
      totalCapacity: 20,
      status: 'Active'
    },
  ]);

  // Filter slots based on search
  const filteredSlots = piSlots.filter((slot) =>
    slot.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.timeSlot.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredSlots.slice(startIndex, endIndex);

  const handleAddSlot = () => {
    if (newSlotDate && newSlotTime) {
      const newSlot = {
        id: piSlots.length + 1,
        date: newSlotDate,
        timeSlot: newSlotTime,
        assignedCount: 0,
        totalCapacity: 20,
        status: 'Active'
      };
      setPiSlots([...piSlots, newSlot]);
      setNewSlotDate('');
      setNewSlotTime('');
      setShowAddSlotModal(false);
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSaveAssignments = (slotId, selectedCandidateIds) => {
    // Update assigned candidates for this slot
    setAssignedCandidates(prev => ({
      ...prev,
      [slotId]: selectedCandidateIds
    }));

    // Update slot's assigned count
    setPiSlots(prev =>
      prev.map(slot => {
        if (slot.id === slotId) {
          const newAssignedCount = selectedCandidateIds.length;
          return {
            ...slot,
            assignedCount: newAssignedCount,
            status: newAssignedCount >= slot.totalCapacity ? 'Full' : 'Active'
          };
        }
        return slot;
      })
    );

    // Go back to list view
    setSelectedSlot(null);
  };

  if (selectedSlot) {
    return (
      <AssignPIDateDetail
        slotData={selectedSlot}
        assignedCandidates={assignedCandidates}
        onBack={() => setSelectedSlot(null)}
        onSave={(selectedCandidateIds) => handleSaveAssignments(selectedSlot.id, selectedCandidateIds)}
      />
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assign PI Date</h1>
        <p className="text-sm text-gray-500 mt-1">
          Assign Personal Interview dates to candidates who passed written exam
        </p>
      </div>

      {/* Controls Bar */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          
          {/* Search Bar */}
          <div className="flex-1 relative w-full lg:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by date or time slot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Add Slot Button */}
          <button
            onClick={() => setShowAddSlotModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            <Plus size={16} />
            Add PI Slot
          </button>
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredSlots.length} PI slot{filteredSlots.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sr.No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time Slot</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Assigned</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Capacity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.length > 0 ? (
                currentData.map((slot, index) => (
                  <tr
                    key={slot.id}
                    onClick={() => handleSlotClick(slot)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium">{startIndex + index + 1}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900 flex items-center gap-2">
                      <Calendar size={14} className="text-blue-600" />
                      {slot.date}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{slot.timeSlot}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-blue-600">{slot.assignedCount}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{slot.totalCapacity}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        slot.status === 'Full'
                          ? 'bg-red-50 text-red-600 border-red-200'
                          : 'bg-green-50 text-green-600 border-green-200'
                      }`}>
                        {slot.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-sm text-gray-500">
                    No PI slots found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSlots.length > itemsPerPage && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

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

      {/* Add Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New PI Slot</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="text"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  placeholder="e.g., 15 Nov 2024"
                  className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time Slot</label>
                <input
                  type="text"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  placeholder="e.g., 1st Slot (10:00 AM - 12:00 PM)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddSlot}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add Slot
              </button>
              <button
                onClick={() => {
                  setShowAddSlotModal(false);
                  setNewSlotDate('');
                  setNewSlotTime('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignPIDate;
