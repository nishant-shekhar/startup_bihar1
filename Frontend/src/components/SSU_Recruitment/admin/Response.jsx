// Response.jsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Tag,
  Globe,
  CheckCircle,
  XCircle,
  Save,
} from "lucide-react";
import { mockNewApplicationsList } from "../../AdminRedesign/NewApplicationAdmin/mockApplicationData";

const Response = ({ rowData, onBack }) => {
  const [formData, setFormData] = useState({
    basicDetails: null,
    entityDetails: null,
    startupDetails: null,
    cofounderDetails: null,
    businessIdea: null,
  });

  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("all");
  const [businessIdeaRatings, setBusinessIdeaRatings] = useState(null);


  const [adminRatings, setAdminRatings] = useState({
    problemStatement: 0,
    solution: 0,
    innovation: 0,
    targetMarket: 0,
  });
  const [totalMarks, setTotalMarks] = useState(0);


  const [recommendation, setRecommendation] = useState(null);
  const [rating, setRating] = useState("B");
  const [comments, setComments] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [saveStatus, setSaveStatus] = useState("idle");


  useEffect(() => {
    try {

      const applicationData = mockNewApplicationsList.find(
        (app) => app.id === rowData?.id
      );

      if (applicationData) {
        // Data is directly fetching on the application object
        setFormData({
          basicDetails: applicationData.basicDetails || null,
          entityDetails: applicationData.entityDetails || null,
          startupDetails: applicationData.startupDetails || null,
          cofounderDetails: applicationData.cofounderDetails || null,
          businessIdea: applicationData.businessIdea || null,
        });

        setBusinessIdeaRatings(applicationData.businessIdeaRatings || null);

        
        const savedAdminRatings = localStorage.getItem(
          `adminBusinessIdeaRatings_${rowData?.id}`
        );
        if (savedAdminRatings) {
          const parsed = JSON.parse(savedAdminRatings);
          setAdminRatings(parsed.ratings || {});
          setTotalMarks(parsed.totalMarks || 0);
        }

 
        const savedReview = localStorage.getItem(`adminReview_${rowData?.id}`);
        if (savedReview) {
          const review = JSON.parse(savedReview);
          setRecommendation(review.recommendation || null);
          setRating(review.rating || "B");
          setComments(review.comments || "");
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [rowData]);

  
  const handleAdminRating = (field, value) => {
    const newRatings = { ...adminRatings, [field]: value };
    setAdminRatings(newRatings);


    const total =
      newRatings.problemStatement +
      newRatings.solution +
      newRatings.innovation +
      newRatings.targetMarket;
    setTotalMarks(total);

  
    localStorage.setItem(
      `adminBusinessIdeaRatings_${rowData?.id}`,
      JSON.stringify({
        ratings: newRatings,
        totalMarks: total,
      })
    );
  };


  const getQuestionRatingColor = (rating) => {
    if (rating === 0) return "bg-slate-200 text-slate-600 border-slate-300";
    if (rating <= 2) return "bg-red-500 text-white border-red-600";
    if (rating <= 4) return "bg-orange-500 text-white border-orange-600";
    if (rating <= 6) return "bg-yellow-500 text-white border-yellow-600";
    if (rating <= 8) return "bg-lime-500 text-white border-lime-600";
    return "bg-green-500 text-white border-green-600";
  };


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      "Pre-Seed": "bg-purple-50 text-purple-600 border-purple-200",
      Seed: "bg-blue-50 text-blue-600 border-blue-200",
      "Series A": "bg-green-50 text-green-600 border-green-200",
      "Series B": "bg-orange-50 text-orange-600 border-orange-200",
      Ideation: "bg-indigo-50 text-indigo-600 border-indigo-200",
      Validation: "bg-pink-50 text-pink-600 border-pink-200",
      "Early Traction": "bg-yellow-50 text-yellow-600 border-yellow-200",
      Scaling: "bg-cyan-50 text-cyan-600 border-cyan-200",
    };
    return colors[stage] || "bg-slate-50 text-slate-600 border-slate-200";
  };


  const getTotalMarksColor = (marks) => {
    const percentage = (marks / 40) * 100;
    if (percentage < 25) return "bg-red-500 text-white";
    if (percentage < 50) return "bg-orange-500 text-white";
    if (percentage < 75) return "bg-yellow-500 text-white";
    if (percentage < 90) return "bg-lime-500 text-white";
    return "bg-green-500 text-white";
  };

  const handleSaveReview = async () => {
    setSaveStatus("saving");
    try {
      const reviewData = {
        applicationId: rowData?.id || "unknown",
        entityName: rowData?.entityName || formData.entityDetails?.entityName,
        recommendation,
        rating,
        comments,
        businessIdeaRatings: adminRatings,
        totalMarks: totalMarks,
        reviewedAt: new Date().toISOString(),
      };

      // Save review with unique key per application
      localStorage.setItem(
        `adminReview_${rowData?.id}`,
        JSON.stringify(reviewData)
      );

      setSaveStatus("success");
      setNotification({
        show: true,
        message: "✅ Review saved successfully!",
        type: "success",
      });

      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
        setSaveStatus("idle");
      }, 3000);
    } catch (error) {
      setSaveStatus("error");
      setNotification({
        show: true,
        message: "❌ Failed to save review",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Loading application details...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-2 mb-6 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors border border-slate-300 hover:text-slate-900"
      >
        <ArrowLeft size={18} />
        Back to Applications
      </button>

      {/* Notification */}
      {notification.show && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Header Section */}
        <div className="bg-[#1a2845] px-6 py-8 text-white border-b border-blue-900/30">
          <h1 className="text-3xl font-bold">
            {rowData?.entityName ||
              formData.entityDetails?.entityName ||
              "Application Details"}
          </h1>
          <p className="text-blue-300 mt-2">
            Applicant: {rowData?.fullName || formData.basicDetails?.fullName || "N/A"}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-blue-900/30 border border-blue-700/50 px-3 py-1 rounded-full text-sm font-medium">
              Entity Reg: {rowData?.entityRegistrationNumber ||
                formData.entityDetails?.entityRegistrationNumber ||
                "N/A"}
            </span>
            {formData.entityDetails?.stage && (
              <span className="bg-blue-900/30 border border-blue-700/50 px-3 py-1 rounded-full text-sm font-medium">
                {formData.entityDetails.stage}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 bg-white flex overflow-x-auto justify-between items-center">
          <div className="flex overflow-x-auto">
            {[
              "all",
              "business",
              "basic",
              "entity",
              "startup",
              "cofounder",
              "review",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSection(tab)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeSection === tab
                    ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6 space-y-6 bg-slate-50/50">
          {/* Basic Details */}
          {(activeSection === "all" || activeSection === "basic") &&
            formData.basicDetails && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-200">
                  Basic Details
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.basicDetails.fullName && (
                    <div className="bg-white border border-slate-200 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        Full Name
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formData.basicDetails.fullName}
                      </p>
                    </div>
                  )}
                  {formData.basicDetails.gender && (
                    <div className="bg-white border border-slate-200 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        Gender
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formData.basicDetails.gender}
                      </p>
                    </div>
                  )}
                  {formData.basicDetails.category && (
                    <div className="bg-white border border-slate-200 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        Category
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formData.basicDetails.category}
                      </p>
                    </div>
                  )}
                  {formData.basicDetails.dateOfBirth && (
                    <div className="bg-white border border-slate-200 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        Date of Birth
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formatDate(formData.basicDetails.dateOfBirth)}
                      </p>
                    </div>
                  )}
                  {formData.basicDetails.qualification && (
                    <div className="bg-white border border-slate-200 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        Qualification
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formData.basicDetails.qualification}
                      </p>
                    </div>
                  )}
                  {formData.basicDetails.district && (
                    <div className="bg-white border border-slate-200 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        District
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formData.basicDetails.district}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Entity Details */}
          {(activeSection === "all" || activeSection === "entity") &&
            formData.entityDetails && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-200">
                  Entity Details
                </h2>
                {formData.entityDetails.hasRegisteredEntity ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.entityDetails.entityName && (
                      <div className="bg-white border border-slate-200 p-4 rounded-lg">
                        <p className="text-xs text-slate-500 font-semibold uppercase">
                          Entity Name
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-1">
                          {formData.entityDetails.entityName}
                        </p>
                      </div>
                    )}
                    {formData.entityDetails.entityType && (
                      <div className="bg-white border border-slate-200 p-4 rounded-lg">
                        <p className="text-xs text-slate-500 font-semibold uppercase">
                          Entity Type
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-1">
                          {formData.entityDetails.entityType}
                        </p>
                      </div>
                    )}
                    {formData.entityDetails.entityRegistrationNumber && (
                      <div className="bg-white border border-slate-200 p-4 rounded-lg">
                        <p className="text-xs text-slate-500 font-semibold uppercase">
                          Reg. No.
                        </p>
                        <p className="text-sm font-mono font-bold text-slate-900 mt-1">
                          {formData.entityDetails.entityRegistrationNumber}
                        </p>
                      </div>
                    )}
                    {formData.entityDetails.dateOfRegistration && (
                      <div className="bg-white border border-slate-200 p-4 rounded-lg">
                        <p className="text-xs text-slate-500 font-semibold uppercase">
                          Reg. Date
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-1">
                          {formatDate(
                            formData.entityDetails.dateOfRegistration
                          )}
                        </p>
                      </div>
                    )}
                    {formData.entityDetails.sector && (
                      <div className="bg-white border border-slate-200 p-4 rounded-lg">
                        <p className="text-xs text-slate-500 font-semibold uppercase">
                          Sector
                        </p>
                        <p className="text-sm font-bold text-slate-900 mt-1">
                          {formData.entityDetails.sector}
                        </p>
                      </div>
                    )}
                    {formData.entityDetails.stage && (
                      <div className="bg-white border border-slate-200 p-4 rounded-lg">
                        <p className="text-xs text-slate-500 font-semibold uppercase">
                          Stage
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStageColor(
                            formData.entityDetails.stage
                          )} mt-1`}
                        >
                          {formData.entityDetails.stage}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                    No registered entity information provided
                  </div>
                )}
              </div>
            )}

          {/* Startup Details */}
          {(activeSection === "all" || activeSection === "startup") &&
            formData.startupDetails && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-200">
                  Startup Details
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.startupDetails.teamSize && (
                    <div className="bg-white border border-slate-200 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        Team Size
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formData.startupDetails.teamSize}
                      </p>
                    </div>
                  )}
                  {formData.startupDetails.website && (
                    <div className="bg-white border border-slate-200 p-4 rounded-lg col-span-2 md:col-span-1">
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        Website
                      </p>
                      <a
                        href={formData.startupDetails.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-blue-600 hover:underline mt-1 break-all"
                      >
                        {formData.startupDetails.website}
                      </a>
                    </div>
                  )}
                  {formData.startupDetails.city && (
                    <div className="bg-white border border-slate-200 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        City
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formData.startupDetails.city}
                      </p>
                    </div>
                  )}
                  {formData.startupDetails.state && (
                    <div className="bg-white border border-slate-200 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        State
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formData.startupDetails.state}
                      </p>
                    </div>
                  )}
                  {formData.startupDetails.pincode && (
                    <div className="bg-white border border-slate-200 p-4 rounded-lg">
                      <p className="text-xs text-slate-500 font-semibold uppercase">
                        Pincode
                      </p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {formData.startupDetails.pincode}
                      </p>
                    </div>
                  )}
                </div>
                {formData.startupDetails.registeredAddress && (
                  <div className="bg-white border border-slate-200 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 font-semibold uppercase">
                      Address
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {formData.startupDetails.registeredAddress}
                    </p>
                  </div>
                )}
              </div>
            )}

          {/* Co-Founder Details */}
          {(activeSection === "all" || activeSection === "cofounder") &&
            formData.cofounderDetails && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-200">
                  Co-Founder Details
                </h2>
                {formData.cofounderDetails.coFounders &&
                formData.cofounderDetails.coFounders.length > 0 ? (
                  <div className="space-y-4">
                    {formData.cofounderDetails.coFounders.map(
                      (founder, index) => (
                        <div
                          key={index}
                          className="border border-slate-200 rounded-lg p-4 bg-white"
                        >
                          <h3 className="font-bold text-slate-900 mb-3">
                            Co-Founder {index + 1}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {founder.name && (
                              <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">
                                  Name
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                  {founder.name}
                                </p>
                              </div>
                            )}
                            {founder.email && (
                              <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">
                                  Email
                                </p>
                                <p className="text-sm font-bold text-blue-600">
                                  {founder.email}
                                </p>
                              </div>
                            )}
                            {founder.phoneNumber && (
                              <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">
                                  Phone
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                  {founder.phoneNumber}
                                </p>
                              </div>
                            )}
                            {founder.qualification && (
                              <div>
                                <p className="text-xs text-slate-500 font-semibold uppercase">
                                  Qualification
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                  {founder.qualification}
                                </p>
                              </div>
                            )}
                            {founder.linkedinProfile && (
                              <div className="col-span-2">
                                <p className="text-xs text-slate-500 font-semibold uppercase">
                                  LinkedIn
                                </p>
                                <a
                                  href={founder.linkedinProfile}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-bold text-blue-600 hover:underline"
                                >
                                  View Profile
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
                    No co-founder information provided
                  </div>
                )}
              </div>
            )}

          {/* Business Idea with Admin Ratings */}
          {(activeSection === "all" || activeSection === "business") &&
            businessIdeaRatings && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900 pb-3 border-b border-slate-200">
                  Business Idea & Rating
                </h2>

                {/* Question 1: Problem Statement */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg">
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      1. Problem Statement
                    </h3>
                    <p className="text-xs text-slate-600 mb-2">
                      {businessIdeaRatings.questions?.problemStatement}
                    </p>
                    <p className="text-sm text-slate-800 italic border-l-4 border-slate-400 pl-3">
                      {businessIdeaRatings.answers?.problemStatement}
                    </p>
                  </div>

                  {/* Rating Buttons for Question 1 */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() =>
                            handleAdminRating("problemStatement", num)
                          }
                          className={`w-6 h-6 rounded text-xs font-bold transition-all border ${
                            adminRatings.problemStatement === num
                              ? `${getQuestionRatingColor(num)} `
                              : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {adminRatings.problemStatement}/10
                    </span>
                  </div>
                </div>

                {/* Question 2: Solution */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg">
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      2. Solution
                    </h3>
                    <p className="text-xs text-slate-600 mb-2">
                      {businessIdeaRatings.questions?.solution}
                    </p>
                    <p className="text-sm text-slate-800 italic border-l-4 border-slate-400 pl-3">
                      {businessIdeaRatings.answers?.solution}
                    </p>
                  </div>

                  {/* Rating Buttons for Question 2 */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleAdminRating("solution", num)}
                          className={`w-6 h-6 rounded text-xs font-bold transition-all border ${
                            adminRatings.solution === num
                              ? `${getQuestionRatingColor(num)} `
                              : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {adminRatings.solution}/10
                    </span>
                  </div>
                </div>

                {/* Question 3: Innovation */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg">
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      3. Innovation
                    </h3>
                    <p className="text-xs text-slate-600 mb-2">
                      {businessIdeaRatings.questions?.innovation}
                    </p>
                    <p className="text-sm text-slate-800 italic border-l-4 border-slate-400 pl-3">
                      {businessIdeaRatings.answers?.innovation}
                    </p>
                  </div>

                  {/* Rating Buttons for Question 3 */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleAdminRating("innovation", num)}
                          className={`w-6 h-6 rounded text-xs font-bold transition-all border ${
                            adminRatings.innovation === num
                              ? `${getQuestionRatingColor(num)}`
                              : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {adminRatings.innovation}/10
                    </span>
                  </div>
                </div>

                {/* Question 4: Target Market */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg">
                  <div className="mb-4">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      4. Target Market
                    </h3>
                    <p className="text-xs text-slate-600 mb-2">
                      {businessIdeaRatings.questions?.targetMarket}
                    </p>
                    <p className="text-sm text-slate-800 italic border-l-4 border-slate-400 pl-3">
                      {businessIdeaRatings.answers?.targetMarket}
                    </p>
                  </div>

                  {/* Rating Buttons for Question 4 */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleAdminRating("targetMarket", num)}
                          className={`w-6 h-6 rounded text-xs font-bold transition-all border ${
                            adminRatings.targetMarket === num
                              ? `${getQuestionRatingColor(num)} `
                              : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {adminRatings.targetMarket}/10
                    </span>
                  </div>
                </div>

                {/* Pitch Deck */}
                {businessIdeaRatings.pitchDeckName && (
                  <div className="bg-white border border-slate-200 p-4 rounded-lg">
                    <p className="text-xs text-slate-600 font-semibold uppercase mb-2">
                      Pitch Deck
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      📎 {businessIdeaRatings.pitchDeckName}
                    </p>
                  </div>
                )}
              </div>
            )}

          {/* Admin Review Section */}
          {(activeSection === "all" || activeSection === "review") && (
            <div className="space-y-4 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-bold text-slate-900">
                Admin Review & Decision
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recommendation */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Recommendation
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRecommendation("recommended")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        recommendation === "recommended"
                          ? "bg-green-600 text-white"
                          : "bg-white border border-slate-300 text-slate-700 hover:bg-green-50"
                      }`}
                    >
                      <CheckCircle size={16} />
                      Recommend
                    </button>
                    <button
                      onClick={() => setRecommendation("not-recommended")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        recommendation === "not-recommended"
                          ? "bg-red-600 text-white"
                          : "bg-white border border-slate-300 text-slate-700 hover:bg-red-50"
                      }`}
                    >
                      <XCircle size={16} />
                      Not Recommend
                    </button>
                  </div>
                </div>

                {/* Rating - A B C Grades */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {["A", "B", "C"].map((grade) => (
                      <button
                        key={grade}
                        onClick={() => setRating(grade)}
                        className={`w-10 h-10 rounded-lg font-bold transition-colors text-sm ${
                          rating === grade
                            ? `${
                                grade === "A"
                                  ? "bg-green-600 text-white"
                                  : grade === "B"
                                  ? "bg-blue-600 text-white"
                                  : grade === "C"
                                  ? "bg-yellow-600 text-white"
                                  : ""
                              }`
                            : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center border border-slate-200 p-4 rounded-lg bg-white">
                  <p className="text-sm font-semibold uppercase mb-2 text-slate-900">
                    Total Marks
                  </p>
                  <p className="text-4xl font-bold text-slate-900">{totalMarks}</p>
                  <p className="text-xs text-slate-600 mt-1">out of 40</p>
                </div>
              </div>

              {/* Comments */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Comments
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add your review comments here..."
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveReview}
                disabled={saveStatus === "saving"}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  saveStatus === "saving"
                    ? "bg-slate-400 text-white cursor-not-allowed"
                    : "bg-[#1a2845] text-white hover:bg-[#0f1829]"
                }`}
              >
                <Save size={18} />
                {saveStatus === "saving"
                  ? "Saving..."
                  : saveStatus === "success"
                  ? "✓ Saved"
                  : "Save Review"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Response
