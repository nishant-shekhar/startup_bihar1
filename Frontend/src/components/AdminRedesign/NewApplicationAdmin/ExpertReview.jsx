import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
} from "lucide-react";

// ExpertReview.jsx
// import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import ExpertReviewDetail from "./ExpertReviewDetail";

const ExpertReview = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("All");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for candidates who passed Round 1 (only 3 candidates approved from initial 5)
  useEffect(() => {
    // Simulate loading data - Replace with actual API call
    const mockApprovedCandidates = [
      {
        id: 1,
        sbNo: "SB2024001",
        startupName: "Tech Innovators Pvt Ltd",
        applicantName: "Rajesh Kumar",
        mobile: "9876543210",
        entityType: "Pvt Ltd",
        stage: "Ideation",
        date: "2024-11-01",
        round1Grade: "A",
        round1Comment: "Excellent business model with strong market potential",
        round1Status: "approved",
        // Full application data synced from NewApplication
        userSignup: {
          founderName: "Rajesh Kumar",
          startupName: "Tech Innovators Pvt Ltd",
          email: "rajesh.kumar@techinnovators.com",
          phoneNumber: "9876543210",
        },
        basicDetails: {
          fullName: "Rajesh Kumar",
          dob: "1990-05-15",
          gender: "Male",
          category: "General",
          differentlyAbled: "No",
          email: "rajesh.kumar@techinnovators.com",
          mobile: "9876543210",
          whatsapp: "9876543210",
          address: "123, Tech Park, Patna",
          district: "Patna",
          pincode: "800001",
          qualification: "B.Tech in Computer Science",
          institutionName: "IIT Patna",
          linkedin: "https://linkedin.com/in/rajeshkumar",
        },
        entityDetails: {
          entityName: "Tech Innovators Pvt Ltd",
          entityType: "Pvt Ltd",
          entityRegistrationNumber: "U72200BR2023PTC054321",
          dateOfRegistration: "2023-06-15",
          panNumber: "AABCT1234C",
          tanNumber: "PTAT00001A",
          gstNumber: "10AABCT1234C1Z5",
          registeredAddress: "Tech Park, Bailey Road, Patna",
          entityDistrict: "Patna",
          entityPincode: "800001",
        },
        startupDetails: {
          stage: "Ideation",
          sector: "Technology",
          briefDescription: "AI-powered solutions for agriculture",
          servicesOffered: "Smart irrigation systems, crop monitoring",
          websiteUrl: "https://techinnovators.com",
          employeeCount: "5-10",
          currentRevenue: "5-10 Lakhs",
          capitalInvested: "10-25 Lakhs",
          fundingReceived: "Yes",
          fundingAmount: "50 Lakhs",
          fundingSource: "Angel Investor",
          intellectualProperty: "Yes",
          ipDetails: "Patent pending for AI algorithm",
        },
        cofounderDetails: {
          hasCoFounder: "Yes",
          cofounderName: "Priya Sharma",
          cofounderEmail: "priya@techinnovators.com",
          cofounderPhone: "9876543211",
          cofounderRole: "CTO",
          cofounderQualification: "M.Tech in AI/ML",
        },
        businessIdea: {
          problemStatement:
            "Farmers lack real-time data for irrigation decisions",
          solution: "IoT sensors with AI-based recommendations",
          innovation: "Machine learning models trained on local crop patterns",
          targetMarket: "Small and medium farmers in Bihar",
          pitchDeckName: "TechInnovators_Pitch.pdf",
        },
        // Admin reviews from Round 1
        adminReviews: {
          admin1: {
            reviewed: true,
            recommendation: "Recommended",
            rating: "A",
            totalMarks: 36,
            businessIdeaMarks: {
              problemStatement: 9,
              solution: 9,
              innovation: 9,
              targetMarket: 9,
            },
            comments:
              "Excellent business model with strong market potential. Team has good technical expertise.",
          },
          admin2: {
            reviewed: true,
            recommendation: "Recommended",
            rating: "A",
            totalMarks: 38,
            businessIdeaMarks: {
              problemStatement: 10,
              solution: 9,
              innovation: 10,
              targetMarket: 9,
            },
            comments:
              "Innovative approach to solving agricultural challenges. Clear monetization strategy.",
          },
        },
        submissionDate: "2024-11-01",
        status: "approved",
      },
      {
        id: 2,
        sbNo: "SB2024002",
        startupName: "Green Solutions LLP",
        applicantName: "Priya Sharma",
        mobile: "9876543211",
        entityType: "LLP",
        stage: "Validation",
        date: "2024-11-02",
        round1Grade: "B",
        round1Comment: "Good concept, needs more clarity on revenue model",
        round1Status: "approved",
        // Full application data
        userSignup: {
          founderName: "Priya Sharma",
          startupName: "Green Solutions LLP",
          email: "priya@greensolutions.in",
          phoneNumber: "9876543211",
        },
        basicDetails: {
          fullName: "Priya Sharma",
          dob: "1992-08-20",
          gender: "Female",
          category: "OBC",
          differentlyAbled: "No",
          email: "priya@greensolutions.in",
          mobile: "9876543211",
          whatsapp: "9876543211",
          address: "456, Green Avenue, Muzaffarpur",
          district: "Muzaffarpur",
          pincode: "842001",
          qualification: "MBA in Sustainability",
          institutionName: "Xavier Institute of Management",
          linkedin: "https://linkedin.com/in/priyasharma",
        },
        entityDetails: {
          entityName: "Green Solutions LLP",
          entityType: "LLP",
          entityRegistrationNumber: "AAM-2468",
          dateOfRegistration: "2023-03-10",
          panNumber: "AACGS5678B",
          tanNumber: "PTGS00002B",
          gstNumber: "10AACGS5678B1Z6",
          registeredAddress: "Green Avenue, Muzaffarpur",
          entityDistrict: "Muzaffarpur",
          entityPincode: "842001",
        },
        startupDetails: {
          stage: "Validation",
          sector: "Environment & Sustainability",
          briefDescription: "Waste management and recycling solutions",
          servicesOffered: "E-waste collection, plastic recycling",
          websiteUrl: "https://greensolutions.in",
          employeeCount: "10-20",
          currentRevenue: "10-25 Lakhs",
          capitalInvested: "25-50 Lakhs",
          fundingReceived: "Yes",
          fundingAmount: "1 Crore",
          fundingSource: "State Government Grant",
          intellectualProperty: "No",
          ipDetails: "",
        },
        cofounderDetails: {
          hasCoFounder: "Yes",
          cofounderName: "Amit Verma",
          cofounderEmail: "amit@greensolutions.in",
          cofounderPhone: "9876543212",
          cofounderRole: "COO",
          cofounderQualification: "B.Tech in Environmental Engineering",
        },
        businessIdea: {
          problemStatement:
            "Improper waste disposal causing environmental damage",
          solution: "Door-to-door waste collection with segregation",
          innovation: "Mobile app for tracking and rewards program",
          targetMarket: "Urban households and commercial establishments",
          pitchDeckName: "GreenSolutions_Pitch.pdf",
        },
        adminReviews: {
          admin1: {
            reviewed: true,
            recommendation: "Recommended",
            rating: "B",
            totalMarks: 30,
            businessIdeaMarks: {
              problemStatement: 8,
              solution: 7,
              innovation: 7,
              targetMarket: 8,
            },
            comments:
              "Good concept, needs more clarity on revenue model and scalability.",
          },
          admin2: {
            reviewed: true,
            recommendation: "Recommended",
            rating: "B",
            totalMarks: 32,
            businessIdeaMarks: {
              problemStatement: 8,
              solution: 8,
              innovation: 8,
              targetMarket: 8,
            },
            comments:
              "Strong social impact. Revenue streams need better definition.",
          },
        },
        submissionDate: "2024-11-02",
        status: "approved",
      },
      {
        id: 3,
        sbNo: "SB2024003",
        startupName: "EduTech Solutions",
        applicantName: "Amit Verma",
        mobile: "9876543212",
        entityType: "Pvt Ltd",
        stage: "Early Traction",
        date: "2024-11-03",
        round1Grade: "A",
        round1Comment: "Strong team and innovative approach to education",
        round1Status: "approved",
        // Full application data
        userSignup: {
          founderName: "Amit Verma",
          startupName: "EduTech Solutions",
          email: "amit@edutech.com",
          phoneNumber: "9876543212",
        },
        basicDetails: {
          fullName: "Amit Verma",
          dob: "1988-12-10",
          gender: "Male",
          category: "General",
          differentlyAbled: "No",
          email: "amit@edutech.com",
          mobile: "9876543212",
          whatsapp: "9876543212",
          address: "789, Knowledge Park, Bhagalpur",
          district: "Bhagalpur",
          pincode: "812001",
          qualification: "M.Sc in Education Technology",
          institutionName: "Delhi University",
          linkedin: "https://linkedin.com/in/amitverma",
        },
        entityDetails: {
          entityName: "EduTech Solutions",
          entityType: "Pvt Ltd",
          entityRegistrationNumber: "U80300BR2022PTC051234",
          dateOfRegistration: "2022-09-20",
          panNumber: "AABET9012D",
          tanNumber: "PTET00003C",
          gstNumber: "10AABET9012D1Z7",
          registeredAddress: "Knowledge Park, Bhagalpur",
          entityDistrict: "Bhagalpur",
          entityPincode: "812001",
        },
        startupDetails: {
          stage: "Early Traction",
          sector: "Education",
          briefDescription: "Online learning platform for rural students",
          servicesOffered: "Video courses, live classes, doubt solving",
          websiteUrl: "https://edutech.com",
          employeeCount: "20-50",
          currentRevenue: "50 Lakhs - 1 Crore",
          capitalInvested: "50 Lakhs - 1 Crore",
          fundingReceived: "Yes",
          fundingAmount: "2 Crores",
          fundingSource: "Venture Capital",
          intellectualProperty: "Yes",
          ipDetails: "Trademark for brand name and logo",
        },
        cofounderDetails: {
          hasCoFounder: "Yes",
          cofounderName: "Sneha Gupta",
          cofounderEmail: "sneha@edutech.com",
          cofounderPhone: "9876543213",
          cofounderRole: "Head of Content",
          cofounderQualification: "M.A in English Literature",
        },
        businessIdea: {
          problemStatement:
            "Quality education not accessible to rural students",
          solution: "Affordable online courses in local languages",
          innovation: "AI-based personalized learning paths",
          targetMarket: "Students in Tier 2 and Tier 3 cities",
          pitchDeckName: "EduTech_Pitch.pdf",
        },
        adminReviews: {
          admin1: {
            reviewed: true,
            recommendation: "Recommended",
            rating: "A",
            totalMarks: 35,
            businessIdeaMarks: {
              problemStatement: 9,
              solution: 9,
              innovation: 8,
              targetMarket: 9,
            },
            comments:
              "Strong team and innovative approach to education. Good traction metrics.",
          },
          admin2: {
            reviewed: true,
            recommendation: "Recommended",
            rating: "A",
            totalMarks: 37,
            businessIdeaMarks: {
              problemStatement: 10,
              solution: 9,
              innovation: 9,
              targetMarket: 9,
            },
            comments:
              "Excellent product-market fit. Scalable business model with clear growth path.",
          },
        },
        submissionDate: "2024-11-03",
        status: "approved",
      },
    ];

    setTimeout(() => {
      setAllData(mockApprovedCandidates);
      setLoading(false);
    }, 500);
  }, []);

  // Filter logic
  const filteredData = allData.filter((item) => {
    const matchesSearch =
      item.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sbNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mobile.includes(searchQuery) ||
      item.applicantName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      selectedStage === "All" || item.stage === selectedStage;
    const matchesGrade =
      selectedGrade === "All" || item.round1Grade === selectedGrade;

    return matchesSearch && matchesStage && matchesGrade;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const stages = ["All", "Ideation", "Validation", "Early Traction", "Scaling"];
  const grades = ["All", "A", "B", "C", "D"];

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStage("All");
    setSelectedGrade("All");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getStageColor = (stage) => {
    const colors = {
      Ideation: "bg-indigo-50 text-indigo-600 border-indigo-200",
      Validation: "bg-pink-50 text-pink-600 border-pink-200",
      "Early Traction": "bg-yellow-50 text-yellow-600 border-yellow-200",
      Scaling: "bg-cyan-50 text-cyan-600 border-cyan-200",
    };
    return colors[stage] || "bg-gray-50 text-gray-600 border-gray-200";
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

  // Show detail view if a row is selected
  if (selectedRow) {
    return (
      <ExpertReviewDetail
        rowData={selectedRow}
        onBack={() => setSelectedRow(null)}
      />
    );
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expert Review</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review applications approved in Round 1
        </p>
      </div>

      {/* Filters & Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by SB No, startup name, applicant name, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Filter size={16} />
              Filters
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium border border-gray-200 transition-colors">
              <Download size={16} />
              Export
            </button>

            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 items-end">
              {/* Stage Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-3 py-2 border text-black border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Round 1 Grade
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium border border-red-200 transition-colors"
              >
                <X size={16} />
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredData.length > 0 ? startIndex + 1 : 0} to{" "}
          {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
          results
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Sr.No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  SB No
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Startup Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Applicant Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Entity Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Round 1 Grade
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Round 1 Review
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    Loading expert review applications...
                  </td>
                </tr>
              ) : currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedRow(item)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-gray-600 font-medium">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-mono font-semibold">
                      {item.sbNo}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">
                      {item.startupName}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-900">
                      {item.applicantName}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {item.mobile}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {item.entityType}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStageColor(
                          item.stage
                        )}`}
                      >
                        {item.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getGradeColor(
                          item.round1Grade
                        )}`}
                      >
                        {item.round1Grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                            item.adminReviews?.admin1?.reviewed
                              ? "bg-green-100 border-green-500"
                              : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          <CheckCircle
                            size={14}
                            className={
                              item.adminReviews?.admin1?.reviewed
                                ? "text-green-600"
                                : "text-gray-400"
                            }
                          />
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                            item.adminReviews?.admin2?.reviewed
                              ? "bg-green-100 border-green-500"
                              : "bg-gray-100 border-gray-300"
                          }`}
                        >
                          <CheckCircle
                            size={14}
                            className={
                              item.adminReviews?.admin2?.reviewed
                                ? "text-green-600"
                                : "text-gray-400"
                            }
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {item.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No applications found for expert review.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertReview;
