// AssignExamDateDetail.jsx
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, CheckSquare, Square, Save, CheckCircle } from 'lucide-react';

const AssignExamDateDetail = ({ slotData, assignedCandidates, onBack, onSave }) => {
  const slot = slotData; // Alias for clarity
  
  // Get candidates currently assigned to THIS specific slot
  const currentlyAssignedCandidates = assignedCandidates[slot.id] || [];

  // All available candidates (mock data) - only 10 total
  // These are candidates who PASSED Expert Review (round1 + expert approved)
  const allCandidates = [
    { id: 1, sbNo: 'SB2024001', name: 'Rajesh Kumar', mobile: '9876543210', grade: 'A', stage: 'Ideation', round1Status: 'approved', expertStatus: 'approved' },
    { id: 2, sbNo: 'SB2024002', name: 'Priya Sharma', mobile: '9876543211', grade: 'B', stage: 'Validation', round1Status: 'approved', expertStatus: 'approved' },
    { id: 3, sbNo: 'SB2024003', name: 'Amit Verma', mobile: '9876543212', grade: 'A', stage: 'Early Traction', round1Status: 'approved', expertStatus: 'approved' },
    { id: 4, sbNo: 'SB2024004', name: 'Sneha Patel', mobile: '9876543213', grade: 'B', stage: 'Ideation', round1Status: 'approved', expertStatus: 'approved' },
    { id: 5, sbNo: 'SB2024005', name: 'Vikram Singh', mobile: '9876543214', grade: 'A', stage: 'Scaling', round1Status: 'approved', expertStatus: 'approved' },
    { id: 6, sbNo: 'SB2024006', name: 'Anjali Gupta', mobile: '9876543215', grade: 'C', stage: 'Validation', round1Status: 'approved', expertStatus: 'approved' },
    { id: 7, sbNo: 'SB2024007', name: 'Rahul Jain', mobile: '9876543216', grade: 'B', stage: 'Early Traction', round1Status: 'approved', expertStatus: 'approved' },
    { id: 8, sbNo: 'SB2024008', name: 'Neha Reddy', mobile: '9876543217', grade: 'A', stage: 'Ideation', round1Status: 'approved', expertStatus: 'approved' },
    { id: 9, sbNo: 'SB2024009', name: 'Karan Mehta', mobile: '9876543218', grade: 'B', stage: 'Scaling', round1Status: 'approved', expertStatus: 'approved' },
    { id: 10, sbNo: 'SB2024010', name: 'Pooja Iyer', mobile: '9876543219', grade: 'A', stage: 'Validation', round1Status: 'approved', expertStatus: 'approved' },
  ];

  // Get candidates assigned to OTHER slots (exclude from this view)
  // Compare both as strings to avoid type mismatch
  const candidatesAssignedToOtherSlots = Object.entries(assignedCandidates)
    .filter(([slotId]) => String(slotId) !== String(slot.id))
    .flatMap(([, candidateIds]) => candidateIds);

  // Show candidates that are either:
  // 1. Assigned to THIS slot (so they can be unchecked/unassigned)
  // 2. Not assigned to any other slot (available for assignment)
  const availableCandidates = allCandidates.filter(candidate => 
    !candidatesAssignedToOtherSlots.includes(candidate.id)
  );

  // State: Initialize with currently assigned candidates (so they appear checked)
  const [selectedCandidates, setSelectedCandidates] = useState(currentlyAssignedCandidates);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSelectAll = () => {
    // Select all available candidates
    setSelectedCandidates(availableCandidates.map(c => c.id));
  };

  const handleUnselectAll = () => {
    setSelectedCandidates([]);
  };

  const handleToggleCandidate = (candidateId) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      console.log('Assigned candidates:', selectedCandidates, 'to slot:', slotData);
      setSaveStatus('success');
      setShowSuccessMessage(true);
      
      // Wait for success message to show, then redirect back
      setTimeout(() => {
        onSave(selectedCandidates); // Pass the selected candidate IDs to parent
      }, 1500);
    }, 1000);
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': 'bg-green-50 text-green-600 border-green-200',
      'B': 'bg-blue-50 text-blue-600 border-blue-200',
      'C': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'D': 'bg-red-50 text-red-600 border-red-200',
    };
    return colors[grade] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Dates Assigned Successfully!</h2>
            <p className="text-gray-600 mb-1">
              {selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''} assigned to
            </p>
            <p className="text-lg font-semibold text-indigo-600">
              {slotData.date} - {slotData.timeSlot}
            </p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 mb-6 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors border border-blue-200"
      >
        <ArrowLeft size={18} />
        Back to Exam Slots
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-8 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={24} />
            <h1 className="text-3xl font-bold">{slotData.date}</h1>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
              <Clock size={16} />
              <span className="text-sm font-medium">{slotData.timeSlot}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg">
              <span className="text-sm font-medium">
                Capacity: {slotData.assignedCount}/{slotData.totalCapacity}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              <CheckSquare size={16} />
              Select All
            </button>
            <button
              onClick={handleUnselectAll}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
            >
              <Square size={16} />
              Unselect All
            </button>
          </div>
          <div className="text-sm font-semibold text-gray-700">
            {selectedCandidates.length} selected
          </div>
        </div>

        {/* Candidates Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={availableCandidates.length > 0 && selectedCandidates.length === availableCandidates.length}
                    onChange={(e) => e.target.checked ? handleSelectAll() : handleUnselectAll()}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sr.No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">SB No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Applicant Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Grade</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {availableCandidates.length > 0 ? (
                availableCandidates.map((candidate, index) => (
                  <tr
                    key={candidate.id}
                    className={`hover:bg-blue-50 transition-colors ${
                      selectedCandidates.includes(candidate.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleToggleCandidate(candidate.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium">{index + 1}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-mono font-semibold">{candidate.sbNo}</td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">{candidate.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{candidate.mobile}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getGradeColor(candidate.grade)}`}>
                        {candidate.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{candidate.stage}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">
                    All candidates have been assigned to other slots
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Save Button */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selectedCandidates.length === 0 || saveStatus === 'saving'}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
              selectedCandidates.length === 0 || saveStatus === 'saving'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            <Save size={18} />
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? '✓ Saved' : 'Save Assignments'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignExamDateDetail;
