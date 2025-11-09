// ExpertReviewDetail.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, MessageSquare, CheckCircle, XCircle, User, Building, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';

const ExpertReviewDetail = ({ rowData, onBack }) => {
  const [expertRecommendation, setExpertRecommendation] = useState(null);
  const [expertGrade, setExpertGrade] = useState(null);
  const [expertComments, setExpertComments] = useState('');
  const [saveStatus, setSaveStatus] = useState('idle');
  const [activeSection, setActiveSection] = useState('all');
  
  // Form data loaded from localStorage (mock data for now)
  const [formData, setFormData] = useState({
    basicDetails: null,
    entityDetails: null,
    startupDetails: null,
    cofounderDetails: null,
    businessIdea: null,
  });

  useEffect(() => {
    // Load saved data from localStorage
    const basicDetails = localStorage.getItem('basicDetails');
    const entityDetails = localStorage.getItem('entityDetails');
    const startupDetails = localStorage.getItem('startupDetails');
    const cofounderDetails = localStorage.getItem('cofounderDetails');
    const businessIdea = localStorage.getItem('businessIdea');

    setFormData({
      basicDetails: basicDetails ? JSON.parse(basicDetails) : null,
      entityDetails: entityDetails ? JSON.parse(entityDetails) : null,
      startupDetails: startupDetails ? JSON.parse(startupDetails) : null,
      cofounderDetails: cofounderDetails ? JSON.parse(cofounderDetails) : null,
      businessIdea: businessIdea ? JSON.parse(businessIdea) : null,
    });
  }, []);

  const handleSubmit = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      console.log('Expert Review Submitted:', {
        sbNo: rowData.sbNo,
        recommendation: expertRecommendation,
        grade: expertGrade,
        comments: expertComments,
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
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

  // Helper function to format date strings
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Helper function to render a field
  const renderField = (key, value) => {
    if (value === null || value === undefined) return null;
    if (key === 'logo') return null; // Skip logo field

    const formattedKey = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());

    let displayValue = value;
    if (typeof value === 'boolean') {
      displayValue = value ? 'Yes' : 'No';
    } else if (key.toLowerCase().includes('date')) {
      displayValue = formatDate(value);
    } else if (typeof value === 'object' && value instanceof File) {
      displayValue = value.name;
    }

    return (
      <div key={key} className="bg-gray-50 p-3 rounded-lg">
        <div className="text-xs font-semibold text-gray-600 mb-1">{formattedKey}</div>
        <div className="text-sm text-gray-900">{displayValue?.toString() || 'N/A'}</div>
      </div>
    );
  };

  // Helper function to render a section
  const renderSection = (title, data, icon) => {
    if (!data) return null;
    if (activeSection !== 'all' && activeSection !== title.toLowerCase().replace(/\s+/g, '-')) return null;

    return (
      <div className="mb-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
          {icon}
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(data).map(([key, value]) => renderField(key, value))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 mb-6 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors border border-blue-200"
      >
        <ArrowLeft size={18} />
        Back to Expert Review List
      </button>

      {/* Main Content Container */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden mb-6">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold">{rowData.startupName}</h1>
          <p className="text-purple-100 mt-2">Applicant: {rowData.applicantName}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              SB No: {rowData.sbNo}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              {rowData.entityType}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
              {rowData.stage}
            </span>
          </div>
        </div>

        {/* Round 1 Review Section - HIGHLIGHTED */}
        <div className="border-b-4 border-orange-400 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="text-orange-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Round 1 Admin Review</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-lg border-2 border-orange-200 shadow-sm">
              <div className="text-sm font-semibold text-gray-600 mb-3">Grade Received</div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold border-2 ${getGradeColor(rowData.round1Grade)}`}>
                {rowData.round1Grade}
              </span>
            </div>
            
            <div className="bg-white p-5 rounded-lg border-2 border-orange-200 shadow-sm">
              <div className="text-sm font-semibold text-gray-600 mb-3">Admin Comments</div>
              <p className="text-sm text-gray-800 italic leading-relaxed">"{rowData.round1Comment}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {['all', 'basic-details', 'entity-details', 'startup-details', 'cofounder-details', 'business-idea'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === section
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </button>
        ))}
      </div>

      {/* Application Details Sections */}
      <div className="mb-6">
        {renderSection('Basic Details', formData.basicDetails, <User size={18} className="text-blue-600" />)}
        {renderSection('Entity Details', formData.entityDetails, <Building size={18} className="text-purple-600" />)}
        {renderSection('Startup Details', formData.startupDetails, <MapPin size={18} className="text-green-600" />)}
        {renderSection('Co-Founder Details', formData.cofounderDetails, <User size={18} className="text-orange-600" />)}
        {renderSection('Business Idea', formData.businessIdea, <FileText size={18} className="text-pink-600" />)}
      </div>

      {/* Expert Review Form */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare size={20} className="text-purple-600" />
          Expert Evaluation
        </h2>

        <div className="space-y-6">
          {/* Recommendation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Expert Recommendation *
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setExpertRecommendation('recommended')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                  expertRecommendation === 'recommended'
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-green-300'
                }`}
              >
                <CheckCircle size={18} />
                Recommended
              </button>
              <button
                onClick={() => setExpertRecommendation('not-recommended')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                  expertRecommendation === 'not-recommended'
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-red-300'
                }`}
              >
                <XCircle size={18} />
                Not Recommended
              </button>
            </div>
          </div>

          {/* Grade Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Assign Grade *
            </label>
            <div className="grid grid-cols-4 gap-3">
              {['A', 'B', 'C'].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setExpertGrade(grade)}
                  className={`px-6 py-4 rounded-lg border-2 font-bold text-xl transition-all ${
                    expertGrade === grade
                      ? `${getGradeColor(grade)} border-current`
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Expert Comments *
            </label>
            <textarea
              value={expertComments}
              onChange={(e) => setExpertComments(e.target.value)}
              placeholder="Provide detailed feedback on the application..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!expertRecommendation || !expertGrade || !expertComments.trim() || saveStatus === 'saving'}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                !expertRecommendation || !expertGrade || !expertComments.trim() || saveStatus === 'saving'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {saveStatus === 'saving' ? 'Submitting...' : saveStatus === 'success' ? '✓ Submitted' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertReviewDetail;
