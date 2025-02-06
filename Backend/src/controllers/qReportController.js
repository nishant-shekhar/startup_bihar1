

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const prisma = new PrismaClient();

//const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable
const JWT_SECRET = 'your_jwt_secret_key';

const submitQuarterlyReport = async (req, res) => {
  try {
    // Ensure a token is provided (assuming Bearer <token> format)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    // Decode the JWT to get the user ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user_id; // Adjust according to your token payload structure

    // Extract fields from req.body
    // Optionally, the client may send an `id` field if updating an existing report.
    const {
      id, // optional: if provided, we update
      totalCoFounders,
      stage,
      sector,
      registeredDistrict,
      registeredBlock,
      aboutStartup,
      fundsTaken,       // expected as an array
      currentRevenue,
      netProfitOrLoss,
      fundsRaised,      // expected as "Yes" or "No"
      fundsDetails,
      fundAmount,
      iprReceived,      // expected as an array
      fullTimeMale,
      fullTimeFemale,
      partTimeMale,
      partTimeFemale,
      workOrders,
      totalWorkOrderAmount,
      customersAcquired,
   
      incubationBenefits, // "Yes" or "No"
      benefitsDetails,
      otherAchievements,
    } = req.body;

    const unitPhoto1 = req.files.unitPhoto1
    ? req.files.unitPhoto1[0].location
    : null;
    const unitPhoto2 = req.files.unitPhoto2
    ? req.files.unitPhoto2[0].location
    : null;

    const unitPhotos=unitPhoto1+";"+unitPhoto2

    const pitchdeck = req.files.pitchdeck
    ? req.files.pitchdeck[0].location
    : null;

    const auditedReport = req.files.auditedReport
    ? req.files.auditedReport[0].location
    : null;
    // Convert multi-select arrays into semicolon-separated strings
    
    

      

    // Build the data object to save/update
    const data = {
      totalCoFounders,
      stage,
      sector,
      registeredDistrict,
      registeredBlock,
      aboutStartup,
      fundsTaken,
      currentRevenue,
      netProfitOrLoss,
      fundsRaised: fundsRaised === "Yes", // Convert "Yes"/"No" to boolean
      fundsDetails,
      fundAmount,
      iprReceived,
      fullTimeMale,
      fullTimeFemale,
      partTimeMale,
      partTimeFemale,
      workOrders,
      totalWorkOrderAmount,
      customersAcquired,
      unitPhotos,
      pitchdeck,
      auditedReport,
      incubationBenefits,
      benefitsDetails,
      otherAchievements,
      userId,
      // Set a default documentStatus if needed:
      documentStatus: "created",
    };

    let qReport;
    if (id) {
      // Update existing record if id is provided
      qReport = await prisma.qReport.update({
        where: { id },
        data,
      });
    } else {
      // Create a new report
      qReport = await prisma.qReport.create({
        data,
      });
    }

    return res.status(200).json({
      message: id ? "Quarterly report updated successfully" : "Quarterly report created successfully",
      qReport,
    });
  } catch (error) {
    console.error("Error in submitQuarterlyReport:", error);
    return res.status(500).json({ error: "An error occurred while processing the request" });
  }
};


const getAllqReportWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.qReport.findMany({
      select: {
        id:true,
        updatedAt:true,
				user: {
					select: {
						user_id: true, // Fields from the User model
						registration_no: true,
						company_name: true,
						logo:true,
						
					},
				},
      },
    });

    return res.status(200).json({
      message: 'Documents with user and program details retrieved successfully',
      data: documents,
    });
  } catch (error) {
    console.error('Error fetching documents with user details:', error);
    res.status(500).json({ error: 'An error occurred while fetching documents' });
  }
};

const getQReportsByUserId = async (req, res) => {
  try {
    // Extract token from headers (assuming "Bearer <token>" format)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    // Decode the JWT to get the user ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user_id; // Adjust as needed based on your token payload

    // Fetch all QReport forms for the given userId
    const documents = await prisma.qReport.findMany({
      where: { userId },
     
    });

    if (!documents || documents.length === 0) {
      return res.status(404).json({ error: "No QReport forms found for this user" });
    }

    return res.status(200).json({
      message: "QReport forms retrieved successfully",
      data: documents,
    });
  } catch (error) {
    console.error("Error retrieving QReports for user:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving the QReport forms" });
  }
};


const updateQreportStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus,comment } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.qReport.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.qReport.update({
      where: { id },
      data: { documentStatus , comment},
    });

    res.status(200).json({
      message: 'Document status updated successfully',
      document: updatedDocument,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to update document status',
      details: error.message,
    });
  }
};

module.exports = {
  submitQuarterlyReport,
  getQReportsByUserId,
  getAllqReportWithUserDetails,
  updateQreportStatus
};
