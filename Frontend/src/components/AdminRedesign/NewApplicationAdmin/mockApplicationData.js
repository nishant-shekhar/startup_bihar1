// mockApplicationData.js

// Complete application data structure
export const mockApplicationData = {
  basicDetails: {
    fullName: "Rajesh Kumar Sharma",
    gender: "Male",
    category: "General",
    dateOfBirth: "1995-03-15",
    qualification: "B.Tech in Computer Science",
    institution: "IIT Patna",
    otherInstitution: "",
    linkedinProfile: "https://linkedin.com/in/rajeshkumar",
    profilePhoto: "photo1.jpg",
    state: "Bihar",
    district: "Patna",
  },
  entityDetails: {
    hasRegisteredEntity: true,
    entityName: "Tech Innovators Pvt Ltd",
    entityType: "Private Limited",
    entityRegistrationNumber: "U72900BR2023PTC123456",
    dateOfRegistration: "2023-01-15",
    businessAddress: "123 Tech Park, Boring Road, Patna",
    state: "Bihar",
    district: "Patna",
    certificate: "certificate1.pdf",
    sector: "Information Technology",
    stage: "Seed",
  },
  startupDetails: {
    teamSize: "5-10",
    website: "https://techinnovators.com",
    sector: "Technology",
    stage: "Seed",
    city: "Patna",
    state: "Bihar",
    pincode: "800001",
    registeredAddress: "123 Tech Park, Boring Road, Patna - 800001",
  },
  cofounderDetails: {
    coFounders: [
      {
        name: "Priya Sharma",
        email: "priya@techinnovators.com",
        phoneNumber: "+91 9876543210",
        qualification: "MBA from IIM Bangalore",
        linkedinProfile: "https://linkedin.com/in/priyasharma",
      },
      {
        name: "Amit Verma",
        email: "amit@techinnovators.com",
        phoneNumber: "+91 9876543211",
        qualification: "B.Tech from NIT Patna",
        linkedinProfile: "https://linkedin.com/in/amitverma",
      },
    ],
  },
  businessIdea: {
    problemStatement:
      "Small businesses in rural Bihar lack affordable digital payment solutions, limiting their ability to serve customers who prefer cashless transactions.",
    solution:
      "We provide a low-cost, easy-to-use mobile app that enables small merchants to accept digital payments through QR codes, with multi-language support and offline transaction capabilities.",
    innovation:
      "Our solution uses AI-powered fraud detection and works in low-connectivity areas by queuing transactions. We also provide business analytics in regional languages, helping merchants understand their sales patterns.",
    targetMarket:
      "We target 50,000+ small retailers and vendors across Bihar's tier-2 and tier-3 cities, focusing initially on grocery stores, medical shops, and local service providers.",
  },
  businessIdeaRatings: {
    questions: {
      problemStatement: "What problem are you trying to solve?",
      solution: "How does your product/service solve this problem?",
      innovation: "What makes your solution innovative or unique?",
      targetMarket:
        "Who are your target customers and what is the market size?",
    },
    answers: {
      problemStatement:
        "Small businesses in rural Bihar lack affordable digital payment solutions, limiting their ability to serve customers who prefer cashless transactions.",
      solution:
        "We provide a low-cost, easy-to-use mobile app that enables small merchants to accept digital payments through QR codes, with multi-language support and offline transaction capabilities.",
      innovation:
        "Our solution uses AI-powered fraud detection and works in low-connectivity areas by queuing transactions. We also provide business analytics in regional languages, helping merchants understand their sales patterns.",
      targetMarket:
        "We target 50,000+ small retailers and vendors across Bihar's tier-2 and tier-3 cities, focusing initially on grocery stores, medical shops, and local service providers.",
    },
    pitchDeckName: "TechInnovators_PitchDeck_2024.pdf",
  },
};

// Multiple applications list for NewApplication component
export const mockNewApplicationsList = [
  {
    srNo: 1,
    id: 1,
    status: "accepted",
    submissionDate: "2024-11-01",
    reviews: {
      admin1: true,
      admin2: true,
    },
    userSignup: {
      founderName: "Rajesh Kumar Sharma",
      startupName: "Tech Innovators",
      email: "rajesh.kumar@techinnovators.com",
      phoneNumber: "9876543210",
      aadharNumber: "123456789012",
    },
    ...mockApplicationData,
  },
  {
    srNo: 2,
    id: 2,
    status: "submitted",
    submissionDate: "2024-11-02",
    reviews: {
      admin1: true,
      admin2: false,
    },
    userSignup: {
      founderName: "Priya Sharma",
      startupName: "Green Solutions",
      email: "priya.sharma@greensolutions.in",
      phoneNumber: "9876543211",
      aadharNumber: "234567890123",
    },
    basicDetails: {
      fullName: "Priya Sharma",
      gender: "Female",
      category: "OBC",
      dateOfBirth: "1997-08-22",
      qualification: "M.Sc Environmental Science",
      institution: "Patna University",
      otherInstitution: "",
      linkedinProfile: "https://linkedin.com/in/priyasharma",
      profilePhoto: "photo2.jpg",
      state: "Bihar",
      district: "Gaya",
    },
    entityDetails: {
      hasRegisteredEntity: true,
      entityName: "Green Solutions LLP",
      entityType: "LLP",
      entityRegistrationNumber: "REG2024002",
      dateOfRegistration: "2023-09-15",
      businessAddress: "67 Eco Park, Buddha Marg, Gaya",
      state: "Bihar",
      district: "Gaya",
      certificate: "certificate2.pdf",
      sector: "Agriculture",
      stage: "Validation",
    },
    startupDetails: {
      teamSize: "5",
      website: "https://greensolutions.in",
      sector: "Agriculture",
      stage: "Validation",
      city: "Gaya",
      state: "Bihar",
      pincode: "823001",
      registeredAddress: "22 Station Road, Gaya, Bihar",
    },
    cofounderDetails: {
      coFounders: [
        {
          name: "Rahul Verma",
          email: "rahul@greensolutions.in",
          phoneNumber: "9876543221",
          qualification: "B.Sc Agriculture",
          linkedinProfile: "https://linkedin.com/in/rahulverma",
        },
      ],
    },
    businessIdea: {
      problemStatement:
        "Inefficient waste management and lack of organic farming practices",
      solution:
        "Providing composting solutions and organic farming training to farmers",
      innovation:
        "Mobile composting units with IoT monitoring for quality control",
      businessModel:
        "Subscription-based service for farmers with equipment rental",
      pitchDeck: "pitchdeck2.pdf",
    },
    businessIdeaRatings: {
      questions: {
        problemStatement: "What problem are you trying to solve?",
        solution: "How does your product/service solve this problem?",
        innovation: "What makes your solution innovative or unique?",
        targetMarket:
          "Who are your target customers and what is the market size?",
      },
      answers: {
        problemStatement:
          "Inefficient waste management and lack of organic farming practices",
        solution:
          "Providing composting solutions and organic farming training to farmers",
        innovation:
          "Mobile composting units with IoT monitoring for quality control",
        targetMarket:
          "Rural farmers in Bihar looking for sustainable farming solutions",
      },
      pitchDeckName: "GreenSolutions_PitchDeck_2024.pdf",
    },
  },
  {
    srNo: 3,
    id: 3,
    status: "rejected",
    submissionDate: "2024-11-03",
    reviews: {
      admin1: true,
      admin2: true,
    },
    userSignup: {
      founderName: "Amit Verma",
      startupName: "EduTech Solutions",
      email: "amit.verma@edutech.co.in",
      phoneNumber: "9876543212",
      aadharNumber: "345678901234",
    },
    basicDetails: {
      fullName: "Amit Verma",
      gender: "Male",
      category: "General",
      dateOfBirth: "1994-03-10",
      qualification: "M.Tech",
      institution: "NIT Patna",
      otherInstitution: "",
      linkedinProfile: "https://linkedin.com/in/amitverma",
      profilePhoto: "photo3.jpg",
      state: "Bihar",
      district: "Muzaffarpur",
    },
    entityDetails: {
      hasRegisteredEntity: true,
      entityName: "EduTech Solutions Pvt Ltd",
      entityType: "Private Limited",
      entityRegistrationNumber: "REG2024003",
      dateOfRegistration: "2022-12-05",
      businessAddress: "89 University Road, Muzaffarpur",
      state: "Bihar",
      district: "Muzaffarpur",
      certificate: "certificate3.pdf",
      sector: "Education",
      stage: "Early Traction",
    },
    startupDetails: {
      teamSize: "12",
      website: "https://edutech-solutions.com",
      sector: "Education",
      stage: "Early Traction",
      city: "Muzaffarpur",
      state: "Bihar",
      pincode: "842001",
      registeredAddress: "34 College Lane, Muzaffarpur, Bihar",
    },
    cofounderDetails: {
      coFounders: [
        {
          name: "Neha Gupta",
          email: "neha@edutech.co.in",
          phoneNumber: "9876543222",
          qualification: "B.Ed",
          linkedinProfile: "https://linkedin.com/in/nehagupta",
        },
        {
          name: "Sanjay Kumar",
          email: "sanjay@edutech.co.in",
          phoneNumber: "9876543223",
          qualification: "M.A Education",
          linkedinProfile: "https://linkedin.com/in/sanjaykumar",
        },
      ],
    },
    businessIdea: {
      problemStatement:
        "Poor quality education and lack of digital learning tools in rural areas",
      solution:
        "Interactive video-based learning platform with local language support",
      innovation:
        "Adaptive learning algorithms that adjust to student pace and comprehension",
      businessModel:
        "B2C subscription for students and B2B licensing for schools",
      pitchDeck: "pitchdeck3.pdf",
    },
    businessIdeaRatings: {
      questions: {
        problemStatement: "What problem are you trying to solve?",
        solution: "How does your product/service solve this problem?",
        innovation: "What makes your solution innovative or unique?",
        targetMarket:
          "Who are your target customers and what is the market size?",
      },
      answers: {
        problemStatement:
          "Poor quality education and lack of digital learning tools in rural areas",
        solution:
          "Interactive video-based learning platform with local language support",
        innovation:
          "Adaptive learning algorithms that adjust to student pace and comprehension",
        targetMarket:
          "Students in rural Bihar and schools looking for digital education solutions",
      },
      pitchDeckName: "EduTech_PitchDeck_2024.pdf",
    },
  },
  {
    srNo: 4,
    id: 4,
    status: "submitted",
    submissionDate: "2024-11-04",
    reviews: {
      admin1: false,
      admin2: false,
    },
    userSignup: {
      founderName: "Sneha Patel",
      startupName: "HealthTech Plus",
      email: "sneha.patel@healthtechplus.in",
      phoneNumber: "9876543213",
      aadharNumber: "456789012345",
    },
    basicDetails: {
      fullName: "Sneha Patel",
      gender: "Female",
      category: "General",
      dateOfBirth: "1996-11-28",
      qualification: "MBBS",
      institution: "AIIMS Patna",
      otherInstitution: "",
      linkedinProfile: "https://linkedin.com/in/snehapatel",
      profilePhoto: "photo4.jpg",
      state: "Bihar",
      district: "Bhagalpur",
    },
    entityDetails: {
      hasRegisteredEntity: true,
      entityName: "HealthTech Plus Pvt Ltd",
      entityType: "Private Limited",
      entityRegistrationNumber: "REG2024004",
      dateOfRegistration: "2023-04-20",
      businessAddress: "156 Medical Complex, Tilka Manjhi Road, Bhagalpur",
      state: "Bihar",
      district: "Bhagalpur",
      certificate: "certificate4.pdf",
      sector: "Healthcare",
      stage: "Ideation",
    },
    startupDetails: {
      teamSize: "15",
      website: "https://healthtechplus.in",
      sector: "Healthcare",
      stage: "Ideation",
      city: "Bhagalpur",
      state: "Bihar",
      pincode: "812001",
      registeredAddress: "78 Hospital Road, Bhagalpur, Bihar",
    },
    cofounderDetails: {
      coFounders: [
        {
          name: "Dr. Rajiv Mishra",
          email: "rajiv@healthtechplus.in",
          phoneNumber: "9876543224",
          qualification: "MD",
          linkedinProfile: "https://linkedin.com/in/rajivmishra",
        },
      ],
    },
    businessIdea: {
      problemStatement:
        "Limited access to quality healthcare in rural Bihar and long wait times",
      solution:
        "Telemedicine platform connecting rural patients with qualified doctors",
      innovation:
        "AI-based preliminary diagnosis with regional language support and low bandwidth optimization",
      businessModel:
        "Pay-per-consultation for patients and partnerships with government health programs",
      pitchDeck: "pitchdeck4.pdf",
    },
    businessIdeaRatings: {
      questions: {
        problemStatement: "What problem are you trying to solve?",
        solution: "How does your product/service solve this problem?",
        innovation: "What makes your solution innovative or unique?",
        targetMarket:
          "Who are your target customers and what is the market size?",
      },
      answers: {
        problemStatement:
          "Limited access to quality healthcare in rural Bihar and long wait times",
        solution:
          "Telemedicine platform connecting rural patients with qualified doctors",
        innovation:
          "AI-based preliminary diagnosis with regional language support and low bandwidth optimization",
        targetMarket:
          "Rural patients in Bihar and government healthcare programs",
      },
      pitchDeckName: "HealthTechPlus_PitchDeck_2024.pdf",
    },
  },
  {
    srNo: 5,
    id: 5,
    status: "accepted",
    submissionDate: "2024-11-05",
    reviews: {
      admin1: true,
      admin2: true,
    },
    userSignup: {
      founderName: "Vikram Singh",
      startupName: "AgriSmart",
      email: "vikram.singh@agrismart.co.in",
      phoneNumber: "9876543214",
      aadharNumber: "567890123456",
    },
    basicDetails: {
      fullName: "Vikram Singh",
      gender: "Male",
      category: "SC",
      dateOfBirth: "1993-07-18",
      qualification: "B.Sc Agriculture",
      institution: "Bihar Agricultural University",
      otherInstitution: "",
      linkedinProfile: "https://linkedin.com/in/vikramsingh",
      profilePhoto: "photo5.jpg",
      state: "Bihar",
      district: "Darbhanga",
    },
    entityDetails: {
      hasRegisteredEntity: true,
      entityName: "AgriSmart Solutions Partnership",
      entityType: "Partnership",
      entityRegistrationNumber: "REG2024005",
      dateOfRegistration: "2023-01-12",
      businessAddress: "234 Krishi Bhawan, NH 57, Darbhanga",
      state: "Bihar",
      district: "Darbhanga",
      certificate: "certificate5.pdf",
      sector: "Agriculture",
      stage: "Scaling",
    },
    startupDetails: {
      teamSize: "10",
      website: "https://agrismart.co.in",
      sector: "Agriculture",
      stage: "Scaling",
      city: "Darbhanga",
      state: "Bihar",
      pincode: "846004",
      registeredAddress: "90 Farmer Colony, Darbhanga, Bihar",
    },
    cofounderDetails: {
      coFounders: [
        {
          name: "Ravi Shankar",
          email: "ravi@agrismart.co.in",
          phoneNumber: "9876543225",
          qualification: "M.Sc Agronomy",
          linkedinProfile: "https://linkedin.com/in/ravishankar",
        },
        {
          name: "Pooja Kumari",
          email: "pooja@agrismart.co.in",
          phoneNumber: "9876543226",
          qualification: "B.Tech Agricultural Engineering",
          linkedinProfile: "https://linkedin.com/in/poojakumari",
        },
      ],
    },
    businessIdea: {
      problemStatement:
        "Farmers lack real-time information about weather, crop prices, and modern farming techniques",
      solution:
        "Mobile app providing weather forecasts, market prices, and farming best practices",
      innovation:
        "Satellite imagery integration for crop health monitoring and pest detection",
      businessModel:
        "Freemium app with premium features and commission on agricultural product sales",
      pitchDeck: "pitchdeck5.pdf",
    },
    businessIdeaRatings: {
      questions: {
        problemStatement: "What problem are you trying to solve?",
        solution: "How does your product/service solve this problem?",
        innovation: "What makes your solution innovative or unique?",
        targetMarket:
          "Who are your target customers and what is the market size?",
      },
      answers: {
        problemStatement:
          "Farmers lack real-time information about weather, crop prices, and modern farming techniques",
        solution:
          "Mobile app providing weather forecasts, market prices, and farming best practices",
        innovation:
          "Satellite imagery integration for crop health monitoring and pest detection",
        targetMarket:
          "Farmers across Bihar with focus on progressive farmers in tier-2 and tier-3 cities",
      },
      pitchDeckName: "AgriSmart_PitchDeck_2024.pdf",
    },
  },
];

// Single application list for Response component (backward compatibility)
export const mockApplicationsList = [
  {
    id: 1,
    entityName: "Tech Innovators Pvt Ltd",
    fullName: "Rajesh Kumar Sharma",
    entityRegistrationNumber: "U72900BR2023PTC123456",
    data: mockApplicationData,
  },
];
