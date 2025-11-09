// AssignExamDate.jsx
import React, { useState } from 'react';
import { Search, Calendar, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import AssignExamDateDetail from './AssignExamDateDetail';

const AssignExamDate = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');
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
    if (newSlotDate && newSlotTime) {
      const newSlot = {
        id: examSlots.length + 1,
        date: new Date(newSlotDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        timeSlot: newSlotTime,
        assignedCount: 0,
        totalCapacity: 20,
        status: 'Active'
      };
      setExamSlots([...examSlots, newSlot]);
      setShowAddSlotModal(false);
      setNewSlotDate('');
      setNewSlotTime('');
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
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assign Exam Date</h1>
        <p className="text-gray-600">Manage exam slots and assign candidates</p>
      </div>

      {/* Search and Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by date or time slot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => setShowAddSlotModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Time Slot
        </button>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredSlots.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredSlots.length)} of {filteredSlots.length} slots
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sr.No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Exam Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time Slot</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Assigned/Capacity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.length > 0 ? (
                currentData.map((slot, index) => (
                  <tr 
                    key={slot.id} 
                    onClick={() => setSelectedSlot(slot)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium">{startIndex + index + 1}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-900">{slot.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{slot.timeSlot}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={getCapacityColor(slot.assignedCount, slot.totalCapacity)}>
                        {slot.assignedCount}/{slot.totalCapacity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(slot.status)}`}>
                        {slot.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-500">
                    No exam slots found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Add New Exam Slot
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Exam Date *
                </label>
                <input
                  type="date"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Time Slot *
                </label>
                <select
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select time slot</option>
                  <option value="1st Slot (9:00 AM - 11:00 AM)">1st Slot (9:00 AM - 11:00 AM)</option>
                  <option value="2nd Slot (2:00 PM - 4:00 PM)">2nd Slot (2:00 PM - 4:00 PM)</option>
                  <option value="3rd Slot (5:00 PM - 7:00 PM)">3rd Slot (5:00 PM - 7:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddSlotModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSlot}
                disabled={!newSlotDate || !newSlotTime}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !newSlotDate || !newSlotTime
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignExamDate;
