import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaBuilding,
  FaInfoCircle,
  FaChartBar,
  FaUsers,
  FaLightbulb,
  FaEdit,
  FaCheck,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign,
  FaClipboardList,
} from "react-icons/fa";
import { useLanguage } from "./LanguageContext";

const Preview = ({
  formData,
  onPrevious,
  onSubmit,
  onFormSubmit,
  onNavigateToStep,
}) => {
  const { t } = useLanguage();
  const sections = [
    {
      title: "User Registration",
      icon: <FaUser />,
      data: formData?.userSignup,
      step: 1,
      fields: [
        { key: "founderName", label: "Applicant Name", icon: <FaUser /> },
        { key: "startupName", label: "Startup Name", icon: <FaBuilding /> },
        { key: "email", label: "Email Address", icon: <FaEnvelope /> },
        { key: "phoneNumber", label: "Phone Number", icon: <FaPhone /> },
        { key: "aadharNumber", label: "Aadhar Number", icon: <FaUser /> },
        { key: "password", label: "Password", icon: null, hidden: true },
      ],
    },
    {
      title: "Basic Details",
      icon: <FaInfoCircle />,
      data: formData?.basicDetails,
      step: 2,
      fields: [
        { key: "fullName", label: "Full Name", icon: <FaUser /> },
        { key: "gender", label: "Gender", icon: <FaUser /> },
        { key: "category", label: "Category", icon: <FaUser /> },
        { key: "dateOfBirth", label: "Date of Birth", icon: <FaCalendarAlt /> },
        { key: "qualification", label: "Qualification", icon: <FaUser /> },
        { key: "institution", label: "Institution", icon: <FaBuilding /> },
        {
          key: "otherInstitution",
          label: "Other Institution",
          icon: <FaBuilding />,
          optional: true,
        },
        {
          key: "linkedinProfile",
          label: "LinkedIn Profile",
          icon: <FaUser />,
          optional: true,
        },
        { key: "state", label: "State", icon: <FaMapMarkerAlt /> },
        { key: "district", label: "District", icon: <FaMapMarkerAlt /> },
        { key: "profilePhoto", label: "Profile Photo", icon: <FaUser /> },
      ],
    },
    {
      title: "Entity Details",
      icon: <FaBuilding />,
      data: formData?.entityDetails,
      step: 3,
      optional: true,
      fields: [
        {
          key: "hasRegisteredEntity",
          label: "Has Registered Entity",
          icon: <FaBuilding />,
        },
        {
          key: "entityName",
          label: "Entity Name (Firm Name)",
          icon: <FaBuilding />,
          optional: true,
        },
        {
          key: "entityType",
          label: "Entity Type",
          icon: <FaBuilding />,
          optional: true,
        },
        {
          key: "entityRegistrationNumber",
          label: "Registration No.",
          icon: <FaBuilding />,
          optional: true,
        },
        {
          key: "dateOfRegistration",
          label: "Date of Registration",
          icon: <FaCalendarAlt />,
          optional: true,
        },
        {
          key: "businessAddress",
          label: "Business Operating Address",
          icon: <FaMapMarkerAlt />,
          optional: true,
        },
        {
          key: "state",
          label: "State",
          icon: <FaMapMarkerAlt />,
          optional: true,
        },
        {
          key: "district",
          label: "District",
          icon: <FaMapMarkerAlt />,
          optional: true,
        },
        {
          key: "certificate",
          label: "Certificate",
          icon: <FaBuilding />,
          optional: true,
        },
      ],
    },
    {
      title: "Startup Details",
      icon: <FaChartBar />,
      data: formData?.startupDetails,
      step: 4,
      fields: [
        { key: "teamSize", label: "Team Size", icon: <FaUsers /> },
        { key: "website", label: "Website", icon: <FaInfoCircle /> },
        { key: "sector", label: "Sector", icon: <FaChartBar /> },
        { key: "stage", label: "Stage", icon: <FaChartBar /> },
        {
          key: "applicantAddress",
          label: "Applicant's Address",
          icon: <FaMapMarkerAlt />,
        },
        { key: "state", label: "State", icon: <FaMapMarkerAlt /> },
        { key: "district", label: "District", icon: <FaMapMarkerAlt /> },
        { key: "pincode", label: "PIN Code", icon: <FaMapMarkerAlt /> },
      ],
    },
    {
      title: "Co-Founder Details",
      icon: <FaUsers />,
      data: formData?.cofounderDetails,
      step: 5,
      fields: [
        {
          key: "coFounders",
          label: "Co-Founders",
          icon: <FaUsers />,
          isArray: true,
        },
      ],
    },
    {
      title: "Business Idea",
      icon: <FaLightbulb />,
      data: formData?.businessIdea,
      step: 6,
      fields: [
        {
          key: "problemStatement",
          label: "Problem Statement",
          icon: <FaLightbulb />,
        },
        { key: "solution", label: "Solution", icon: <FaLightbulb /> },
        { key: "innovation", label: "Innovation", icon: <FaLightbulb /> },
        {
          key: "businessModel",
          label: "Business Model & Revenue Model",
          icon: <FaChartBar />,
        },
        {
          key: "pitchDeck",
          label: "Pitch Deck (PDF/PPT)",
          icon: <FaClipboardList />,
        },
      ],
    },
  ];

  const renderFieldValue = (value, field) => {
    if (!value && value !== 0)
      return <span className="text-gray-400 italic">Not provided</span>;

    if (field?.hidden) {
      return <span className="text-gray-400 italic">••••••••</span>;
    }

    if (typeof value === "boolean") {
      return value ? (
        <span className="text-green-600">Yes</span>
      ) : (
        <span className="text-red-600">No</span>
      );
    }

    // Handle co-founders array
    if (field?.isArray && field?.key === "coFounders") {
      if (Array.isArray(value) && value.length > 0) {
        return (
          <div className="space-y-2">
            {value.map((cofounder, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded text-xs">
                <div>
                  <strong>Name:</strong> {cofounder.name || "Not provided"}
                </div>
                <div>
                  <strong>Email:</strong> {cofounder.email || "Not provided"}
                </div>
                <div>
                  <strong>Phone:</strong>{" "}
                  {cofounder.phoneNumber || "Not provided"}
                </div>
                <div>
                  <strong>Qualification:</strong>{" "}
                  {cofounder.qualification || "Not provided"}
                </div>
                <div>
                  <strong>LinkedIn:</strong>{" "}
                  {cofounder.linkedinProfile || "Not provided"}
                </div>
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <span className="text-gray-400 italic">No co-founders added</span>
        );
      }
    }

    // Handle file uploads
    if (
      field?.key === "certificate" ||
      field?.key === "profilePhoto" ||
      field?.key === "pitchDeck"
    ) {
      if (value && typeof value === "object" && Object.keys(value).length > 0) {
        return <span className="text-blue-600">File uploaded</span>;
      } else if (value && typeof value === "string") {
        return <span className="text-blue-600">File: {value}</span>;
      } else {
        return <span className="text-gray-400 italic">No file uploaded</span>;
      }
    }

    // Handle date fields
    if (
      field?.key === "dateOfBirth" ||
      field?.key === "dateOfIncorporation" ||
      field?.key === "dateOfRegistration"
    ) {
      const date = new Date(value);
      return date.toLocaleDateString("en-IN");
    }

    // Handle long text fields
    if (
      field?.key === "problemStatement" ||
      field?.key === "solution" ||
      field?.key === "innovation" ||
      field?.key === "targetMarket" ||
      field?.key === "applicantAddress"
    ) {
      return (
        <div className="text-sm text-gray-800">
          {value.length > 100 ? (
            <div>
              {value.substring(0, 100)}...
              <button className="text-blue-600 ml-1">Read more</button>
            </div>
          ) : (
            value
          )}
        </div>
      );
    }

    return <span className="text-gray-800">{value}</span>;
  };

  const isFormComplete = () => {
    return sections.every((section) => {
      // Entity Details is optional - just check if data exists (even if hasRegisteredEntity is false)
      if (section.optional) {
        return section.data !== null && section.data !== undefined;
      }
      // For required sections, check that data exists and has content
      return section.data && Object.keys(section.data).length > 0;
    });
  };

  const getCompletionPercentage = () => {
    // Only count required sections for completion percentage
    const requiredSections = sections.filter((section) => !section.optional);
    const completedRequiredSections = requiredSections.filter(
      (section) => section.data && Object.keys(section.data).length > 0
    ).length;
    return Math.round(
      (completedRequiredSections / requiredSections.length) * 100
    );
  };

  const handleFinalSubmit = () => {
    if (onFormSubmit) {
      onFormSubmit();
    } else if (onSubmit) {
      onSubmit({
        ...formData,
        submittedAt: new Date().toISOString(),
        status: "submitted",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Application Preview
        </h2>
        <p className="text-gray-600">
          Review your startup registration details before submission
        </p>

        {/* Progress Indicator */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-800 font-medium">Form Completion</span>
            <span className="text-blue-800 font-bold">
              {getCompletionPercentage()}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
          {!isFormComplete() && (
            <p className="text-blue-700 text-sm mt-2">
              Please complete all sections before final submission
            </p>
          )}
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => {
          const hasData = section.data && Object.keys(section.data).length > 0;

          return (
            <div
              key={sectionIndex}
              className={`border rounded-lg p-6 ${
                hasData
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-lg mr-3 ${
                      hasData
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {hasData ? <FaCheck /> : section.icon}
                  </div>
                  <h3
                    className={`text-xl font-semibold ${
                      hasData ? "text-green-800" : "text-gray-600"
                    }`}
                  >
                    {section.title}
                  </h3>
                </div>
                <button
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                  onClick={() => {
                    if (onNavigateToStep && section.step) {
                      onNavigateToStep(section.step);
                    }
                  }}
                >
                  <FaEdit className="mr-1" /> {t("preview.edit")}
                </button>
              </div>

              {hasData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.fields.map((field) => {
                    const value = section.data[field.key];
                    return (
                      <div
                        key={field.key}
                        className="bg-white p-3 rounded border"
                      >
                        <div className="flex items-center mb-1">
                          {field.icon && (
                            <span className="text-gray-500 mr-2">
                              {field.icon}
                            </span>
                          )}
                          <label className="text-sm font-medium text-gray-700">
                            {field.label}
                          </label>
                        </div>
                        <div className="text-sm">
                          {renderFieldValue(value, field)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 italic">
                    {t("preview.sectionNotCompleted")}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final Submission */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t("preview.finalSubmission")}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-2">
              {t("preview.confirmationText")}
            </p>
            <p className="text-sm text-gray-500">{t("preview.emailText")}</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        {onPrevious && (
          <button
            type="button"
            onClick={() => onPrevious()}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← {t("common.previous")}
          </button>
        )}

        <button
          onClick={handleFinalSubmit}
          disabled={!isFormComplete()}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            isFormComplete()
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isFormComplete()
            ? t("preview.submitApplication")
            : t("preview.completeAllSections")}
        </button>
      </div>
    </div>
  );
};

export default Preview;
