// NewApplicationDetail.jsx
import React, { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Tag,
  Globe,
  User,
  Users,
  Briefcase,
  FileText,
  MapPin,
  Award,
  GraduationCap,
  Linkedin,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";

const NewApplicationDetail = ({ rowData, onBack }) => {
  const [activeTab, setActiveTab] = useState("userSignup");

  const getStageColor = (stage) => {
    const colors = {
      Ideation: "bg-purple-50 text-purple-600 border-purple-200",
      Validation: "bg-blue-50 text-blue-600 border-blue-200",
      "Early Traction": "bg-green-50 text-green-600 border-green-200",
      Scaling: "bg-orange-50 text-orange-600 border-orange-200",
    };
    return colors[stage] || "bg-gray-50 text-gray-600 border-gray-200";
  };

  const tabs = [
    { id: "userSignup", label: "User Registration", icon: User },
    { id: "basicDetails", label: "Basic Details", icon: User },
    { id: "entityDetails", label: "Entity Details", icon: Building },
    { id: "startupDetails", label: "Startup Details", icon: Briefcase },
    { id: "cofounderDetails", label: "Co-Founders", icon: Users },
    { id: "businessIdea", label: "Business Idea", icon: FileText },
  ];

  const InfoField = ({ label, value, icon: Icon }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 text-gray-600 mb-2">
        {Icon && <Icon size={16} />}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <p className="text-base text-gray-900 break-words">{value || "N/A"}</p>
    </div>
  );

  const SectionTitle = ({ title }) => (
    <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
      {title}
    </h3>
  );

  return (
    <div className="p-6 min-h-screen">
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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                {rowData.userSignup?.startupName ||
                  rowData.entityDetails?.entityName ||
                  "N/A"}
              </h1>
              <p className="text-blue-100 mt-2">
                Founded by{" "}
                {rowData.userSignup?.founderName ||
                  rowData.basicDetails?.fullName ||
                  "N/A"}
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Submitted: {rowData.submissionDate || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={16} />
                  <span>ID: {rowData.id || "N/A"}</span>
                </div>
              </div>
            </div>
            <div>
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border ${getStageColor(
                  rowData.startupDetails?.stage
                )}`}
              >
                {rowData.startupDetails?.stage || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600 bg-white"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* User Registration Tab */}
          {activeTab === "userSignup" && rowData.userSignup && (
            <div className="space-y-6">
              <SectionTitle title="Registration Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Founder Name"
                  value={rowData.userSignup.founderName}
                  icon={User}
                />
                <InfoField
                  label="Startup Name"
                  value={rowData.userSignup.startupName}
                  icon={Building}
                />
                <InfoField
                  label="Email Address"
                  value={rowData.userSignup.email}
                  icon={Mail}
                />
                <InfoField
                  label="Phone Number"
                  value={rowData.userSignup.phoneNumber}
                  icon={Phone}
                />
                <InfoField
                  label="Aadhar Number"
                  value={rowData.userSignup.aadharNumber}
                  icon={Award}
                />
              </div>
            </div>
          )}

          {/* Basic Details Tab */}
          {activeTab === "basicDetails" && rowData.basicDetails && (
            <div className="space-y-6">
              <SectionTitle title="Personal Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Applicant Name"
                  value={rowData.basicDetails.fullName}
                  icon={User}
                />
                <InfoField
                  label="Gender"
                  value={rowData.basicDetails.gender}
                  icon={User}
                />
                <InfoField
                  label="Category"
                  value={rowData.basicDetails.category}
                  icon={Tag}
                />
                <InfoField
                  label="Date of Birth"
                  value={rowData.basicDetails.dateOfBirth}
                  icon={Calendar}
                />
              </div>

              <SectionTitle title="Educational Background" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Qualification"
                  value={rowData.basicDetails.qualification}
                  icon={GraduationCap}
                />
                <InfoField
                  label="Institution"
                  value={
                    rowData.basicDetails.institution ||
                    rowData.basicDetails.otherInstitution
                  }
                  icon={Building}
                />
                <InfoField
                  label="LinkedIn Profile"
                  value={rowData.basicDetails.linkedinProfile}
                  icon={Linkedin}
                />
              </div>

              <SectionTitle title="Location" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="State"
                  value={rowData.basicDetails.state}
                  icon={MapPin}
                />
                <InfoField
                  label="District"
                  value={rowData.basicDetails.district}
                  icon={MapPin}
                />
              </div>

              {rowData.basicDetails.profilePhoto && (
                <div className="mt-6">
                  <SectionTitle title="Profile Photo" />
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <FileText size={16} />
                    <a href="#" className="hover:underline">
                      {rowData.basicDetails.profilePhoto}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Entity Details Tab */}
          {activeTab === "entityDetails" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    rowData.entityDetails?.hasRegisteredEntity
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {rowData.entityDetails?.hasRegisteredEntity ? (
                    <CheckCircle size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                  <span className="font-medium">
                    {rowData.entityDetails?.hasRegisteredEntity
                      ? "Registered Entity"
                      : "No Registered Entity"}
                  </span>
                </div>
              </div>

              {rowData.entityDetails?.hasRegisteredEntity && (
                <>
                  <SectionTitle title="Entity Information" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField
                      label="Entity Name"
                      value={rowData.entityDetails.entityName}
                      icon={Building}
                    />
                    <InfoField
                      label="Entity Type"
                      value={rowData.entityDetails.entityType}
                      icon={Tag}
                    />
                    <InfoField
                      label="Registration Number"
                      value={rowData.entityDetails.entityRegistrationNumber}
                      icon={FileText}
                    />
                    <InfoField
                      label="Date of Registration"
                      value={rowData.entityDetails.dateOfRegistration}
                      icon={Calendar}
                    />
                  </div>

                  <SectionTitle title="Business Address" />
                  <div className="grid grid-cols-1 gap-4">
                    <InfoField
                      label="Address"
                      value={rowData.entityDetails.businessAddress}
                      icon={MapPin}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoField
                        label="State"
                        value={rowData.entityDetails.state}
                        icon={MapPin}
                      />
                      <InfoField
                        label="District"
                        value={rowData.entityDetails.district}
                        icon={MapPin}
                      />
                    </div>
                  </div>

                  {rowData.entityDetails.certificate && (
                    <div className="mt-6">
                      <SectionTitle title="Registration Certificate" />
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <FileText size={16} />
                        <a href="#" className="hover:underline">
                          {rowData.entityDetails.certificate}
                        </a>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Startup Details Tab */}
          {activeTab === "startupDetails" && rowData.startupDetails && (
            <div className="space-y-6">
              <SectionTitle title="Startup Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label="Team Size"
                  value={rowData.startupDetails.teamSize}
                  icon={Users}
                />
                <InfoField
                  label="Stage"
                  value={rowData.startupDetails.stage}
                  icon={Tag}
                />
                <InfoField
                  label="Sector"
                  value={rowData.startupDetails.sector}
                  icon={Briefcase}
                />
                {rowData.startupDetails.website && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Globe size={16} />
                      <span className="text-sm font-semibold">Website</span>
                    </div>
                    <a
                      href={rowData.startupDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {rowData.startupDetails.website}
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>

              <SectionTitle title="Location Details" />
              <div className="grid grid-cols-1 gap-4">
                <InfoField
                  label="Applicant Address"
                  value={rowData.startupDetails.applicantAddress}
                  icon={MapPin}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InfoField
                    label="State"
                    value={rowData.startupDetails.state}
                    icon={MapPin}
                  />
                  <InfoField
                    label="District"
                    value={rowData.startupDetails.district}
                    icon={MapPin}
                  />
                  <InfoField
                    label="Pincode"
                    value={rowData.startupDetails.pincode}
                    icon={MapPin}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Co-Founders Tab */}
          {activeTab === "cofounderDetails" && (
            <div className="space-y-6">
              <SectionTitle title="Co-Founder Information" />
              {rowData.cofounderDetails?.coFounders &&
              rowData.cofounderDetails.coFounders.length > 0 ? (
                <div className="space-y-6">
                  {rowData.cofounderDetails.coFounders.map(
                    (cofounder, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                      >
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <User size={18} />
                          Co-Founder {index + 1}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InfoField
                            label="Name"
                            value={cofounder.name}
                            icon={User}
                          />
                          <InfoField
                            label="Email"
                            value={cofounder.email}
                            icon={Mail}
                          />
                          <InfoField
                            label="Phone Number"
                            value={cofounder.phoneNumber}
                            icon={Phone}
                          />
                          <InfoField
                            label="Qualification"
                            value={cofounder.qualification}
                            icon={GraduationCap}
                          />
                          {cofounder.linkedinProfile && (
                            <div className="bg-white p-4 rounded-lg">
                              <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <Linkedin size={16} />
                                <span className="text-sm font-semibold">
                                  LinkedIn Profile
                                </span>
                              </div>
                              <a
                                href={cofounder.linkedinProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base text-blue-600 hover:underline flex items-center gap-1"
                              >
                                View Profile
                                <ExternalLink size={14} />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No co-founders added</p>
                </div>
              )}
            </div>
          )}

          {/* Business Idea Tab */}
          {activeTab === "businessIdea" && rowData.businessIdea && (
            <div className="space-y-6">
              <SectionTitle title="Business Concept" />

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={18} />
                  Problem Statement
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {rowData.businessIdea.problemStatement || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={18} />
                  Solution
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {rowData.businessIdea.solution || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={18} />
                  Innovation
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {rowData.businessIdea.innovation || "N/A"}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Briefcase size={18} />
                  Business Model
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {rowData.businessIdea.businessModel || "N/A"}
                </p>
              </div>

              {rowData.businessIdea.pitchDeck && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <FileText size={18} />
                    Pitch Deck
                  </h4>
                  <div className="flex items-center gap-2 text-blue-700">
                    <FileText size={16} />
                    <a href="#" className="hover:underline font-medium">
                      {rowData.businessIdea.pitchDeck}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions Section */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Application Actions
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
              <CheckCircle size={18} />
              Approve Application
            </button>
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
              <XCircle size={18} />
              Reject Application
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Mail size={18} />
              Request Changes
            </button>
            <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2">
              <FileText size={18} />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewApplicationDetail;
