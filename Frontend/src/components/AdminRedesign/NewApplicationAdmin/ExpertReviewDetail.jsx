// ExpertReviewDetail.jsx
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Award,
  MessageSquare,
  CheckCircle,
  XCircle,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Lightbulb,
} from "lucide-react";

const ExpertReviewDetail = ({ rowData, onBack }) => {
  const [expertRecommendation, setExpertRecommendation] = useState(null);
  const [expertGrade, setExpertGrade] = useState(null);
  const [expertComments, setExpertComments] = useState("");
  const [saveStatus, setSaveStatus] = useState("idle");
  const [activeTab, setActiveTab] = useState("basic");

  // Expert business idea ratings (1-10 per question, max 40)
  const [expertBusinessIdeaMarks, setExpertBusinessIdeaMarks] = useState({
    problemStatement: 0,
    solution: 0,
    innovation: 0,
    targetMarket: 0,
  });

  // Transform businessIdea data to structured format for display
  const [businessIdeaRatings, setBusinessIdeaRatings] = useState(null);

  useEffect(() => {
    if (rowData?.businessIdea) {
      const transformedRatings = {
        questions: {
          problemStatement: "What problem does your startup solve?",
          solution: "What is your solution?",
          innovation: "What makes your solution innovative?",
          targetMarket: "Who is your target market?",
        },
        answers: {
          problemStatement: rowData.businessIdea.problemStatement || "N/A",
          solution: rowData.businessIdea.solution || "N/A",
          innovation: rowData.businessIdea.innovation || "N/A",
          targetMarket: rowData.businessIdea.targetMarket || "N/A",
        },
        pitchDeckName: rowData.businessIdea.pitchDeckName || null,
      };
      setBusinessIdeaRatings(transformedRatings);
    }
  }, [rowData]);

  const handleExpertRating = (question, marks) => {
    setExpertBusinessIdeaMarks((prev) => ({
      ...prev,
      [question]: marks,
    }));
  };

  const totalExpertMarks = Object.values(expertBusinessIdeaMarks).reduce(
    (sum, mark) => sum + mark,
    0
  );

  const getQuestionRatingColor = (rating) => {
    if (rating >= 8) return "bg-green-100 text-green-700 border-green-400";
    if (rating >= 6) return "bg-blue-100 text-blue-700 border-blue-400";
    if (rating >= 4) return "bg-yellow-100 text-yellow-700 border-yellow-400";
    return "bg-red-100 text-red-700 border-red-400";
  };

  const handleSubmit = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      console.log("Expert Review Submitted:", {
        sbNo: rowData.sbNo,
        recommendation: expertRecommendation,
        grade: expertGrade,
        businessIdeaMarks: expertBusinessIdeaMarks,
        totalMarks: totalExpertMarks,
        comments: expertComments,
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  const getGradeColor = (grade) => {
    const colors = {
      A: "bg-green-50 text-green-600 border-green-200",
      B: "bg-blue-50 text-blue-600 border-blue-200",
      C: "bg-yellow-50 text-yellow-600 border-yellow-200",
      D: "bg-red-50 text-red-600 border-red-200",
    };
    return colors[grade] || "bg-gray-50 text-gray-600 border-gray-200";
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
          <p className="text-purple-100 mt-2">
            Applicant: {rowData.applicantName}
          </p>
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

        {/* Round 1 Review Section - HIGHLIGHTED WITH BOTH ADMIN REVIEWS */}
        <div className="border-b-4 border-orange-400 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="text-orange-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">
                Round 1 Admin Reviews
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Review Status:
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    rowData.adminReviews?.admin1?.reviewed
                      ? "bg-green-100 border-green-500"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <CheckCircle
                    size={18}
                    className={
                      rowData.adminReviews?.admin1?.reviewed
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  />
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    rowData.adminReviews?.admin2?.reviewed
                      ? "bg-green-100 border-green-500"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  <CheckCircle
                    size={18}
                    className={
                      rowData.adminReviews?.admin2?.reviewed
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Admin 1 Review */}
            <div className="bg-white p-5 rounded-lg border-2 border-orange-200 shadow-sm">
              <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center justify-between">
                <span>Admin 1 Review</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getGradeColor(
                    rowData.adminReviews?.admin1?.rating || "N/A"
                  )}`}
                >
                  {rowData.adminReviews?.admin1?.rating || "N/A"}
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    Recommendation
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {rowData.adminReviews?.admin1?.recommendation || "N/A"}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    Business Idea Marks
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      Problem:{" "}
                      <span className="font-bold">
                        {rowData.adminReviews?.admin1?.businessIdeaMarks
                          ?.problemStatement || 0}
                        /10
                      </span>
                    </div>
                    <div>
                      Solution:{" "}
                      <span className="font-bold">
                        {rowData.adminReviews?.admin1?.businessIdeaMarks
                          ?.solution || 0}
                        /10
                      </span>
                    </div>
                    <div>
                      Innovation:{" "}
                      <span className="font-bold">
                        {rowData.adminReviews?.admin1?.businessIdeaMarks
                          ?.innovation || 0}
                        /10
                      </span>
                    </div>
                    <div>
                      Market:{" "}
                      <span className="font-bold">
                        {rowData.adminReviews?.admin1?.businessIdeaMarks
                          ?.targetMarket || 0}
                        /10
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-300 text-sm font-bold text-gray-900">
                    Total: {rowData.adminReviews?.admin1?.totalMarks || 0}/40
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    Comments
                  </div>
                  <p className="text-sm text-gray-800 italic">
                    "{rowData.adminReviews?.admin1?.comments || "No comments"}"
                  </p>
                </div>
              </div>
            </div>

            {/* Admin 2 Review */}
            <div className="bg-white p-5 rounded-lg border-2 border-orange-200 shadow-sm">
              <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center justify-between">
                <span>Admin 2 Review</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getGradeColor(
                    rowData.adminReviews?.admin2?.rating || "N/A"
                  )}`}
                >
                  {rowData.adminReviews?.admin2?.rating || "N/A"}
                </span>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    Recommendation
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {rowData.adminReviews?.admin2?.recommendation || "N/A"}
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    Business Idea Marks
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      Problem:{" "}
                      <span className="font-bold">
                        {rowData.adminReviews?.admin2?.businessIdeaMarks
                          ?.problemStatement || 0}
                        /10
                      </span>
                    </div>
                    <div>
                      Solution:{" "}
                      <span className="font-bold">
                        {rowData.adminReviews?.admin2?.businessIdeaMarks
                          ?.solution || 0}
                        /10
                      </span>
                    </div>
                    <div>
                      Innovation:{" "}
                      <span className="font-bold">
                        {rowData.adminReviews?.admin2?.businessIdeaMarks
                          ?.innovation || 0}
                        /10
                      </span>
                    </div>
                    <div>
                      Market:{" "}
                      <span className="font-bold">
                        {rowData.adminReviews?.admin2?.businessIdeaMarks
                          ?.targetMarket || 0}
                        /10
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-300 text-sm font-bold text-gray-900">
                    Total: {rowData.adminReviews?.admin2?.totalMarks || 0}/40
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    Comments
                  </div>
                  <p className="text-sm text-gray-800 italic">
                    "{rowData.adminReviews?.admin2?.comments || "No comments"}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation for Application Details */}
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex gap-2" aria-label="Tabs">
            {[
              { id: "basic", label: "Basic Details", icon: User },
              { id: "entity", label: "Entity Details", icon: Building },
              { id: "startup", label: "Startup Details", icon: Lightbulb },
              { id: "cofounder", label: "Co-Founder", icon: User },
              { id: "business", label: "Business Idea", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content - Application Details */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-6 mb-6">
        {/* Basic Details Tab */}
        {activeTab === "basic" && rowData.basicDetails && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Basic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(rowData.basicDetails).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className="text-sm text-gray-900">
                    {value?.toString() || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Entity Details Tab */}
        {activeTab === "entity" && rowData.entityDetails && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Entity Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(rowData.entityDetails).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className="text-sm text-gray-900">
                    {value?.toString() || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Startup Details Tab */}
        {activeTab === "startup" && rowData.startupDetails && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Startup Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(rowData.startupDetails).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className="text-sm text-gray-900">
                    {value?.toString() || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Co-Founder Details Tab */}
        {activeTab === "cofounder" && rowData.cofounderDetails && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Co-Founder Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(rowData.cofounderDetails).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs font-semibold text-gray-600 mb-1">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </div>
                  <div className="text-sm text-gray-900">
                    {value?.toString() || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Idea Tab with Rating */}
        {activeTab === "business" && businessIdeaRatings && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Business Idea & Questions
            </h3>

            {/* Question 1: Problem Statement */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="mb-3">
                <h4 className="font-semibold text-gray-900 mb-2">
                  1. Problem Statement
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {businessIdeaRatings.questions?.problemStatement}
                </p>
                <p className="text-sm text-gray-800 italic border-l-4 border-blue-500 pl-3">
                  {businessIdeaRatings.answers?.problemStatement}
                </p>
              </div>
            </div>

            {/* Question 2: Solution */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="mb-3">
                <h4 className="font-semibold text-gray-900 mb-2">
                  2. Solution
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {businessIdeaRatings.questions?.solution}
                </p>
                <p className="text-sm text-gray-800 italic border-l-4 border-green-500 pl-3">
                  {businessIdeaRatings.answers?.solution}
                </p>
              </div>
            </div>

            {/* Question 3: Innovation */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="mb-3">
                <h4 className="font-semibold text-gray-900 mb-2">
                  3. Innovation
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {businessIdeaRatings.questions?.innovation}
                </p>
                <p className="text-sm text-gray-800 italic border-l-4 border-orange-500 pl-3">
                  {businessIdeaRatings.answers?.innovation}
                </p>
              </div>
            </div>

            {/* Question 4: Target Market */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="mb-3">
                <h4 className="font-semibold text-gray-900 mb-2">
                  4. Target Market
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  {businessIdeaRatings.questions?.targetMarket}
                </p>
                <p className="text-sm text-gray-800 italic border-l-4 border-purple-500 pl-3">
                  {businessIdeaRatings.answers?.targetMarket}
                </p>
              </div>
            </div>

            {/* Pitch Deck */}
            {businessIdeaRatings.pitchDeckName && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-xs text-blue-600 font-semibold uppercase mb-2">
                  Pitch Deck
                </p>
                <p className="text-sm font-bold text-blue-700">
                  📎 {businessIdeaRatings.pitchDeckName}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Expert Review Form */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare size={20} className="text-purple-600" />
          Expert Evaluation (Round 2)
        </h2>

        <div className="space-y-6">
          {/* Business Idea Scoring Section */}
          <div className="border-2 border-purple-200 rounded-lg p-5 bg-purple-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award size={20} className="text-purple-600" />
              Business Idea Evaluation (Rate each question out of 10)
            </h3>

            {/* Question 1: Problem Statement */}
            <div className="mb-4 bg-white p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                1. Problem Statement
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                {businessIdeaRatings?.questions?.problemStatement}
              </p>
              <p className="text-sm text-gray-800 italic border-l-4 border-blue-500 pl-3 mb-3">
                {businessIdeaRatings?.answers?.problemStatement}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() =>
                        handleExpertRating("problemStatement", num)
                      }
                      className={`w-7 h-7 rounded text-xs font-bold transition-all border ${
                        expertBusinessIdeaMarks.problemStatement === num
                          ? `${getQuestionRatingColor(num)} shadow-lg`
                          : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {expertBusinessIdeaMarks.problemStatement}/10
                </span>
              </div>
            </div>

            {/* Question 2: Solution */}
            <div className="mb-4 bg-white p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2">2. Solution</h4>
              <p className="text-xs text-gray-600 mb-2">
                {businessIdeaRatings?.questions?.solution}
              </p>
              <p className="text-sm text-gray-800 italic border-l-4 border-green-500 pl-3 mb-3">
                {businessIdeaRatings?.answers?.solution}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleExpertRating("solution", num)}
                      className={`w-7 h-7 rounded text-xs font-bold transition-all border ${
                        expertBusinessIdeaMarks.solution === num
                          ? `${getQuestionRatingColor(num)} shadow-lg`
                          : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {expertBusinessIdeaMarks.solution}/10
                </span>
              </div>
            </div>

            {/* Question 3: Innovation */}
            <div className="mb-4 bg-white p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                3. Innovation
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                {businessIdeaRatings?.questions?.innovation}
              </p>
              <p className="text-sm text-gray-800 italic border-l-4 border-orange-500 pl-3 mb-3">
                {businessIdeaRatings?.answers?.innovation}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleExpertRating("innovation", num)}
                      className={`w-7 h-7 rounded text-xs font-bold transition-all border ${
                        expertBusinessIdeaMarks.innovation === num
                          ? `${getQuestionRatingColor(num)} shadow-lg`
                          : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {expertBusinessIdeaMarks.innovation}/10
                </span>
              </div>
            </div>

            {/* Question 4: Target Market */}
            <div className="mb-4 bg-white p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2">
                4. Target Market
              </h4>
              <p className="text-xs text-gray-600 mb-2">
                {businessIdeaRatings?.questions?.targetMarket}
              </p>
              <p className="text-sm text-gray-800 italic border-l-4 border-purple-500 pl-3 mb-3">
                {businessIdeaRatings?.answers?.targetMarket}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleExpertRating("targetMarket", num)}
                      className={`w-7 h-7 rounded text-xs font-bold transition-all border ${
                        expertBusinessIdeaMarks.targetMarket === num
                          ? `${getQuestionRatingColor(num)} shadow-lg`
                          : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {expertBusinessIdeaMarks.targetMarket}/10
                </span>
              </div>
            </div>

            {/* Total Business Idea Marks */}
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 text-center border-2 border-purple-300">
              <p className="text-sm font-semibold text-purple-700 uppercase mb-1">
                Total Business Idea Marks
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {totalExpertMarks}/40
              </p>
            </div>
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Expert Recommendation *
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setExpertRecommendation("recommended")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                  expertRecommendation === "recommended"
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "bg-white border-gray-200 text-gray-700 hover:border-green-300"
                }`}
              >
                <CheckCircle size={18} />
                Recommended
              </button>
              <button
                onClick={() => setExpertRecommendation("not-recommended")}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                  expertRecommendation === "not-recommended"
                    ? "bg-red-50 border-red-500 text-red-700"
                    : "bg-white border-gray-200 text-gray-700 hover:border-red-300"
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
              {["A", "B", "C"].map((grade) => (
                <button
                  key={grade}
                  onClick={() => setExpertGrade(grade)}
                  className={`px-6 py-4 rounded-lg border-2 font-bold text-xl transition-all ${
                    expertGrade === grade
                      ? `${getGradeColor(grade)} border-current`
                      : "bg-white border-gray-200 text-gray-700 hover:border-gray-400"
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
              className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              disabled={
                !expertRecommendation ||
                !expertGrade ||
                !expertComments.trim() ||
                totalExpertMarks === 0 ||
                saveStatus === "saving"
              }
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                !expertRecommendation ||
                !expertGrade ||
                !expertComments.trim() ||
                totalExpertMarks === 0 ||
                saveStatus === "saving"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {saveStatus === "saving"
                ? "Submitting..."
                : saveStatus === "success"
                ? "Submitted"
                : "Submit Expert Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertReviewDetail;
