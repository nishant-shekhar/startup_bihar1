import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react";
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

  // Mock data for candidates who passed Round 1
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
      {
        id: 4,
        sbNo: "SB2024004",
        startupName: "AgriDrone Tech",
        applicantName: "Surendra Singh",
        mobile: "9876543213",
        entityType: "Pvt Ltd",
        stage: "Ideation",
        date: "2024-11-04",
        round1Grade: "A",
        round1Comment: "High potential for agricultural automation",
        round1Status: "approved",
        userSignup: {
             founderName: "Surendra Singh",
             startupName: "AgriDrone Tech",
             email: "surendra@agridrone.com",
             phoneNumber: "9876543213",
        },
        basicDetails: {
           fullName: "Surendra Singh",
           dob: "1985-01-01",
           gender: "Male",
           category: "OBC",
           differentlyAbled: "No",
           email: "surendra@agridrone.com",
           mobile: "9876543213",
           whatsapp: "9876543213",
           address: "Kankarbagh, Patna",
           district: "Patna",
           pincode: "800020",
           qualification: "B.Sc Agriculture",
           institutionName: "Bihar Agricultural University",
           linkedin: ""
        },
        entityDetails: {
             entityName: "AgriDrone Tech",
             entityType: "Pvt Ltd",
             entityRegistrationNumber: "U01100BR2024PTC012345",
             dateOfRegistration: "2024-01-10",
             panNumber: "ABCDE1234F",
             tanNumber: "PTAD00004D",
             gstNumber: "10ABCDE1234F1Z8",
             registeredAddress: "Kankarbagh, Patna",
             entityDistrict: "Patna",
             entityPincode: "800020"
        },
        startupDetails: {
           stage: "Ideation",
           sector: "Agriculture",
           briefDescription: "Drone based pesticide spraying",
           servicesOffered: "Drone spraying",
           websiteUrl: "",
           employeeCount: "1-5",
           currentRevenue: "0-5 Lakhs",
           capitalInvested: "0-5 Lakhs",
           fundingReceived: "No",
           fundingAmount: "",
           fundingSource: "",
           intellectualProperty: "No",
           ipDetails: ""
        },
        cofounderDetails: {
            hasCoFounder: "No"
        },
        businessIdea: {
            problemStatement: "Labor shortage for pesticide spraying",
            solution: "Automated drones",
            innovation: "Low cost drones",
            targetMarket: "Farmers",
            pitchDeckName: "AgriDrone.pdf"
        },
        adminReviews: {
          admin1: {
            reviewed: false, // Pending review
            recommendation: "",
            rating: "",
            totalMarks: 0,
            businessIdeaMarks: {},
            comments: ""
          },
          admin2: {
             reviewed: false,
             recommendation: "",
             rating: "",
             totalMarks: 0,
             businessIdeaMarks: {},
             comments: ""
          }
        },
        submissionDate: "2024-11-04",
        status: "approved"
      }
    ];

    setTimeout(() => {
      setAllData(mockApprovedCandidates);
      setLoading(false);
    }, 500);
  }, []);

  const [activeTab, setActiveTab] = useState("Pending Review");

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

    let matchesTab = true;
    if (activeTab === "Pending Review") {
      // Example logic: Consider pending if any admin hasn't reviewed yet
      matchesTab = !item.adminReviews?.admin1?.reviewed || !item.adminReviews?.admin2?.reviewed;
    } else if (activeTab === "Accepted") {
      // Example logic: Both reviewed and recommended? (Adjust based on actual requirements)
      matchesTab = item.adminReviews?.admin1?.recommendation === "Recommended" && item.adminReviews?.admin2?.recommendation === "Recommended";
    } else if (activeTab === "Rejected") {
       matchesTab = item.adminReviews?.admin1?.recommendation === "Not Recommended" || item.adminReviews?.admin2?.recommendation === "Not Recommended";
    }

    // For now, if "All Applications", matchesTab remains true.
    // Note: The mock data sets all to 'reviewed: true' and 'Recommended', so 'Pending' might show nothing initially unless we tweak mock data or logic.
    // However, the user request is primarily visual ("make tabs... like this"). I will implement the visual tabs and keep logic simple.
    
    // OVERRIDE for visual demo if needed: 
    // If we want to show data regardless of logic for the "Pending" tab since mock data is all "reviewed", 
    // we might need to adjust logic or mock data. 
    // For now, let's strictly follow the visual request and allow "All Applications" to show everything. 
    if (activeTab === "All Applications") matchesTab = true;
    
    // To ensure the user sees data in "Pending Review" (default), I'll make it show all for now if logic isn't perfect, 
    // OR I should default to "All Applications". 
    // Let's default 'activeTab' to 'All Applications' to be safe, OR ensure logic works.
    // Given the user image shows "Pending Review" active, I will simulate it. 
    
    return matchesSearch && matchesStage && matchesGrade && (activeTab === "All Applications" ? true : matchesTab); 
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const stages = ["All", "Ideation", "Validation", "Early Traction", "Scaling"];
  const grades = ["All", "A", "B", "C", "D"];
  
  // Re-evaluating default state:
  // If I set default to "Pending Review" and my mock data has everything "Reviewed", the list will be empty.
  // I will change the default activeTab to "All Applications" in the useState initialization above, 
  // OR I will relax the "Pending Review" logic for this iteration.
  // actually, let's keep the filter logic commented/relaxed so data shows up, but implement the UI.

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStage("All");
    setSelectedGrade("All");
    setCurrentPage(1);
    setActiveTab("All Applications"); 
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getStageColor = (stage) => {
    const colors = {
      Ideation: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Validation: "bg-pink-50 text-pink-700 border-pink-200",
      "Early Traction": "bg-amber-50 text-amber-700 border-amber-200",
      Scaling: "bg-cyan-50 text-cyan-700 border-cyan-200",
    };
    return colors[stage] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getGradeColor = (grade) => {
    const colors = {
      A: "bg-emerald-50 text-emerald-700 border-emerald-200",
      B: "bg-blue-50 text-blue-700 border-blue-200",
      C: "bg-yellow-50 text-yellow-700 border-yellow-200",
      D: "bg-red-50 text-red-700 border-red-200",
    };
    return colors[grade] || "bg-gray-50 text-gray-700 border-gray-200";
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
    <div className="min-h-screen relative bg-gray-50/50">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Expert Review</h1>
            <p className="text-gray-500 mt-2 text-sm lg:text-base">
              Evaluate and manage applications approved in Round 1
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={handleRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-sm transition-all"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2845] text-white hover:bg-[#152138] rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* New Compact Tabs & Search Bar */}
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 ${showFilters ? 'mb-2' : 'mb-6'}`}>
          {/* Pill Tabs */}
          <div className="inline-flex bg-white rounded-full p-1.5 border border-gray-200 shadow-sm overflow-x-auto max-w-full">
            {["Pending Review", "All Applications", "Accepted", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#1a2845] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 w-full lg:w-auto relative">
             <div className="relative flex-1 lg:flex-none">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full lg:w-72 pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all shadow-sm text-gray-900"
                />
             </div>
             <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-full border transition-all ${
                  showFilters
                    ? "bg-[#1a2845] border-gray-900 text-white shadow-md scale-105"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                } shadow-sm active:scale-95`}
             >
               <Filter size={18} />
             </button>
          </div>
        </div>

        {/* Inline Filters (Right aligned, side-by-side) */}
        {showFilters && (
          <div className="flex justify-end mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 flex items-center gap-3">
                
                {/* Stage Filter */}
                <div className="relative group">
                    <select
                        value={selectedStage}
                        onChange={(e) => setSelectedStage(e.target.value)}
                        className="appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 text-gray-900 text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all cursor-pointer min-w-[180px]"
                    >
                        {stages.map((stage) => (
                        <option key={stage} value={stage}>
                            {stage === "All" ? "All Stages" : stage}
                        </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                {/* Grade Filter */}
                <div className="relative group">
                    <select
                        value={selectedGrade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="appearance-none bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 text-gray-900 text-sm font-medium rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-900/5 transition-all cursor-pointer min-w-[150px]"
                    >
                        {grades.map((grade) => (
                        <option key={grade} value={grade}>
                            {grade === "All" ? "All Grades" : grade}
                        </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>

                {/* Clear Button */}
                {(selectedStage !== "All" || selectedGrade !== "All") && (
                    <button
                        onClick={handleClearFilters}
                        className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Clear Filters"
                    >
                        <X size={18} />
                    </button>
                )}
             </div>
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-gray-200/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Review Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-5">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="animate-spin text-blue-500" size={24} />
                        <span className="mt-2">Loading applications...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentData.length > 0 ? (
                  currentData.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedRow(item)}
                      className="group hover:bg-gray-50/50 cursor-pointer transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.startupName}
                          </span>
                          <span className="text-xs text-gray-500 mt-0.5">
                            {item.applicantName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {item.sbNo}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStageColor(
                            item.stage
                          )}`}
                        >
                          {item.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getGradeColor(
                            item.round1Grade
                          )}`}
                        >
                          Grade {item.round1Grade}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {/* Admin 1 Status */}
                          <div className="relative group/tooltip">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                                item.adminReviews?.admin1?.reviewed
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                  : "bg-gray-50 border-gray-200 text-gray-300"
                              }`}
                            >
                              <CheckCircle size={14} />
                            </div>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                              Admin 1: {item.adminReviews?.admin1?.reviewed ? 'Reviewed' : 'Pending'}
                            </span>
                          </div>

                          {/* Admin 2 Status */}
                          <div className="relative group/tooltip">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                                item.adminReviews?.admin2?.reviewed
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                                  : "bg-gray-50 border-gray-200 text-gray-300"
                              }`}
                            >
                              <CheckCircle size={14} />
                            </div>
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                               Admin 2: {item.adminReviews?.admin2?.reviewed ? 'Reviewed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                            <MoreHorizontal size={16} />
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <Search className="text-gray-300" size={20} />
                            </div>
                            <p className="text-sm font-medium text-gray-900">No applications found</p>
                            <p className="text-xs text-gray-500 mt-1">Try adjusting your filters or search query</p>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="border-t border-gray-100 bg-white px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          currentPage === page
                            ? "bg-[#1a2845] text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50"
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
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertReview;
