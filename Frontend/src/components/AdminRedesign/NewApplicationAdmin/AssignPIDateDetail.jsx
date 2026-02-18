// AssignPIDateDetail.jsx
import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, CheckSquare, Square, Save, CheckCircle } from 'lucide-react';

const AssignPIDateDetail = ({ slotData, assignedCandidates, onBack, onSave }) => {
  const slot = slotData; // Alias for clarity
  
  // Get candidates currently assigned to THIS specific slot
  const currentlyAssignedCandidates = assignedCandidates[slot.id] || [];

  // Mock data - candidates who PASSED written exam (only those with marks >= 50)
  const allCandidates = [
    { id: 1, sbNo: 'SB2024001', name: 'Rajesh Kumar', mobile: '9876543210', writtenMarks: 85, grade: 'A', stage: 'Ideation', examStatus: 'passed' },
    { id: 2, sbNo: 'SB2024002', name: 'Priya Sharma', mobile: '9876543211', writtenMarks: 72, grade: 'B', stage: 'Validation', examStatus: 'passed' },
    { id: 3, sbNo: 'SB2024003', name: 'Amit Verma', mobile: '9876543212', writtenMarks: 90, grade: 'A', stage: 'Early Traction', examStatus: 'passed' },
    { id: 4, sbNo: 'SB2024004', name: 'Sneha Patel', mobile: '9876543213', writtenMarks: 68, grade: 'B', stage: 'Ideation', examStatus: 'passed' },
    { id: 5, sbNo: 'SB2024005', name: 'Vikram Singh', mobile: '9876543214', writtenMarks: 88, grade: 'A', stage: 'Scaling', examStatus: 'passed' },
    { id: 7, sbNo: 'SB2024007', name: 'Rahul Jain', mobile: '9876543216', writtenMarks: 75, grade: 'B', stage: 'Early Traction', examStatus: 'passed' },
    { id: 8, sbNo: 'SB2024008', name: 'Neha Reddy', mobile: '9876543217', writtenMarks: 92, grade: 'A', stage: 'Ideation', examStatus: 'passed' },
    { id: 10, sbNo: 'SB2024010', name: 'Pooja Iyer', mobile: '9876543219', writtenMarks: 82, grade: 'A', stage: 'Validation', examStatus: 'passed' },
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
      console.log('Assigned candidates:', selectedCandidates, 'to PI slot:', slotData);
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
    return colors[grade] || 'bg-slate-50 text-slate-600 border-slate-200';
  };

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">PI Dates Assigned Successfully!</h2>
            <p className="text-slate-600 mb-1">
              {selectedCandidates.length} candidate{selectedCandidates.length !== 1 ? 's' : ''} assigned to
            </p>
            <p className="text-lg font-semibold text-slate-900">
              {slotData.date} - {slotData.timeSlot}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 mb-6 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors border border-slate-300 hover:text-slate-900"
      >
        <ArrowLeft size={18} />
        Back to PI Slots
      </button>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-6">
        <div className="bg-[#1a2845] px-6 py-8 text-white border-b border-blue-900/30">
          <h1 className="text-3xl font-bold">Personal Interview Assignment</h1>
          <p className="text-blue-300 mt-2">
            {slotData.date}
          </p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="bg-blue-900/30 border border-blue-700/50 px-3 py-1 rounded-full text-sm font-medium">
              Time: {slotData.timeSlot}
            </span>
            <span className="bg-blue-900/30 border border-blue-700/50 px-3 py-1 rounded-full text-sm font-medium">
              Capacity: {slotData.assignedCount}/{slotData.totalCapacity}
            </span>
          </div>
        </div>
      </div>

      {/* Candidates Selection Section */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Action Buttons */}
       <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between flex-row-reverse">
  <div className="flex gap-3">
    <button
      onClick={handleSelectAll}
      className="flex items-center gap-2 px-4 py-2 bg-[#1a2845] text-white rounded-lg font-medium hover:bg-[#152138] transition-colors text-sm"
    >
      <CheckSquare size={16} />
      Select All
    </button>

    <button
      onClick={handleUnselectAll}
      className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors text-sm"
    >
      Unselect All
    </button>
  </div>

  <div className="text-sm font-semibold text-slate-700">
    {selectedCandidates.length} selected
  </div>
</div>

        {/* Candidates Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={availableCandidates.length > 0 && selectedCandidates.length === availableCandidates.length}
                    onChange={(e) => e.target.checked ? handleSelectAll() : handleUnselectAll()}
                    className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Registration No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Applicant Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Written Marks</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Grade</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {availableCandidates.length > 0 ? (
                availableCandidates.map((candidate, index) => (
                  <tr
                    key={candidate.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      selectedCandidates.includes(candidate.id) ? 'bg-slate-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedCandidates.includes(candidate.id)}
                        onChange={() => handleToggleCandidate(candidate.id)}
                        className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 font-medium">{index + 1}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 font-mono font-semibold">{candidate.sbNo}</td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-900">{candidate.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{candidate.mobile}</td>
                    <td className="px-4 py-3 text-xs  text-slate-900">{candidate.writtenMarks}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getGradeColor(candidate.grade)}`}>
                        {candidate.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{candidate.stage}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center text-sm text-slate-500">
                    All candidates have been assigned to other slots
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Save Button */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving' || selectedCandidates.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-[#1a2845] text-white rounded-lg font-medium hover:bg-[#152138] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {saveStatus === 'saving' ? 'Saving...' : `Save Assignment (${selectedCandidates.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignPIDateDetail;
