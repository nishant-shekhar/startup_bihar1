// NewApplicationDetail.jsx
import React from 'react';
import { ArrowLeft, Mail, Phone, Building, Calendar, Tag, Globe } from 'lucide-react';

const NewApplicationDetail = ({ rowData, onBack }) => {
  const getStageColor = (stage) => {
    const colors = {
      'Pre-Seed': 'bg-purple-50 text-purple-600 border-purple-200',
      'Seed': 'bg-blue-50 text-blue-600 border-blue-200',
      'Series A': 'bg-green-50 text-green-600 border-green-200',
      'Series B': 'bg-orange-50 text-orange-600 border-orange-200',
    };
    return colors[stage] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  return (
    <div className="p-6  min-h-screen">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 mb-6 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors border border-blue-200"
      >
        <ArrowLeft size={18} />
        Back to Applications
      </button>

      {/* Main Content Container */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold">{rowData.name}</h1>
          <p className="text-blue-100 mt-2">{rowData.entity}</p>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Building size={16} />
                <span className="text-sm font-semibold">Startup Number</span>
              </div>
              <p className="text-lg font-mono font-bold text-gray-900">{rowData.startupNo}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Tag size={16} />
                <span className="text-sm font-semibold">SB Number</span>
              </div>
              <p className="text-lg font-mono font-bold text-gray-900">{rowData.sbNo}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar size={16} />
                <span className="text-sm font-semibold">Registration Date</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{rowData.date}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Phone size={16} />
                <span className="text-sm font-semibold">Mobile Number</span>
              </div>
              <p className="text-lg font-mono font-bold text-gray-900">{rowData.mobile}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Globe size={16} />
                <span className="text-sm font-semibold">Stage</span>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getStageColor(rowData.stage)}`}>
                {rowData.stage}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Building size={16} />
                <span className="text-sm font-semibold">Entity Type</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{rowData.entity}</p>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Approve Application
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
              Reject Application
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
              Request Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewApplicationDetail;
