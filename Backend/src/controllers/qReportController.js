

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const prisma = new PrismaClient();

//const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable
const JWT_SECRET = 'your_jwt_secret_key';

const submitQuarterlyReport = async (req, res) => {
  try {
    // Ensure a token is provided in the request headers
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer <token> format
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    // Decode the JWT to get the user ID
    const decoded = jwt.verify(token, JWT_SECRET); // Use your JWT secret
    const userId = decoded.user_id; // Adjust according to your token payload structure

    const {
      currentStage,
      averageTurnover,
      currentRevenue,
      netProfitOrLoss,
      fundRaised,
      workOrders,
      directEmployment,
      indirectEmployment,
      maleEmployees,
      femaleEmployees,
      partnerships,
      nextQuarterGoals
    } = req.body;
    

      // Upsert: Create or update the PostSeedFund entry
      const qReport = await prisma.qReport.upsert({
        where: { userId }, // Use userId to find existing entry
        update: {
          currentStage , // Default to empty string
          averageTurnover, // Ensure string format
          currentRevenue,
          netProfitOrLoss,
          fundRaised: req.body.fundRaised === "Yes", // Convert "Yes" to boolean
          workOrders,
          directEmployment,
          indirectEmployment,
          maleEmployees,
          femaleEmployees,
          partnerships,
          nextQuarterGoals,
          documentStatus: 'Updates', // Default value
        },
        create: {
          currentStage , // Default to empty string
          averageTurnover, // Ensure string format
          currentRevenue,
          netProfitOrLoss,
          fundRaised: req.body.fundRaised === "Yes", // Convert "Yes" to boolean
          workOrders,
          directEmployment,
          indirectEmployment,
          maleEmployees,
          femaleEmployees,
          partnerships,
          nextQuarterGoals,
          userId,
          documentStatus: 'Created', // Default value
        },
      });

   

    return res.status(200).json({
      message: qReport ? 'Quarterly report updated successfully' : 'Quarterly report created successfully',
      qReport,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};

const getAllqReportWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.qReport.findMany({
      select: {
        id:true,
        user: {
          select: {
            user_id: true,             // Fields from the User model
            registration_no: true,
            company_name: true,
            document: {
              select: {                // Fields from the Document model
                coFounderNames: true,
                logoPath: true,
                category: true,
                founderName: true,
              },
            },
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

const getQReportnById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.qReport.findUnique({
      where: { id: id }, // Use the ID to query the database
    });

    if (!document) {
      // Return 404 if document is not found
      return res.status(404).json({ error: 'Document not found' });
    }

    // Return the document if found
    return res.status(200).json(document); // Explicitly set status to 200
  } catch (error) {
    // Handle any server error
    console.error(`Error retrieving document with id ${id}:`, error);
    return res.status(500).json({ error: 'An error occurred while retrieving the document' });
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
  getQReportnById,
  getAllqReportWithUserDetails,
  updateQreportStatus
};
