

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable

const submitQuarterlyReport = async (req, res) => {
  try {
    // Extract the JWT from the request headers
    const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is in the format "Bearer <token>"

    // Verify and decode the JWT to get the user ID and userName
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET); // Use your secret key
      userId = decoded.user_id; // Assuming the JWT payload contains the user ID as "user_id"
      
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Prepare data for the quarterly report
    const reportData = {
      currentStage: req.body.currentStage,
      averageTurnover: parseFloat(req.body.averageTurnover),
      currentRevenue: parseFloat(req.body.currentRevenue),
      netProfitOrLoss: req.body.netProfitOrLoss,
      fundRaised: req.body.fundRaised === 'Yes', // Convert to boolean
      workOrders: parseInt(req.body.workOrders, 10),
      directEmployment: parseInt(req.body.directEmployment, 10),
      indirectEmployment: parseInt(req.body.indirectEmployment, 10),
      maleEmployees: parseInt(req.body.maleEmployees, 10),
      femaleEmployees: parseInt(req.body.femaleEmployees, 10),
      partnerships: req.body.partnerships, // Assume this is a multiline string
      nextQuarterGoals: req.body.nextQuarterGoals, // Assume this is a multiline string
      documentStatus : "created"
    };

    // Upsert the quarterly report
    const qReport = await prisma.qReport.upsert({
      where: { userId }, // Check if report exists for this user
      update: {
        ...reportData
      },
      create: {
        ...reportData,
        userId, // Associate the report with the authenticated user
      },
    });

    // Return the created or updated report in the response
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
  const { documentStatus } = req.body;

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
      data: { documentStatus },
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
