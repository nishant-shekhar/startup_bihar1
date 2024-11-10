


const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = 'your_jwt_secret_key'; // Use your actual JWT secret

const submitPostSeedFund = async (req, res) => {
  try {
    // Check for authorization token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    const token = authHeader.split(' ')[1]; // Assuming "Bearer <token>" format
    let userId;

    // Verify the token and extract user ID
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.user_id; // Ensure this matches your JWT structure
      if (!userId) {
        return res.status(401).json({ error: 'Invalid token: user ID missing' });
      }
    } catch (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    // Extract form data from the request body
    const { currentStage, technicalKnowledge, raisedFunds, employment } = req.body;

    if (!currentStage) {
      return res.status(400).json({ error: 'Current stage is required' });
    }

    // Handle file uploads
    const auditedBalanceSheet = req.files?.auditedBalanceSheet?.[0]?.path || null;
    const gstReturn = req.files?.gstReturn?.[0]?.path || null;
    const projectReport = req.files?.projectReport?.[0]?.path || null;

    // Perform upsert operation
    const postSeedFundEntry = await prisma.postSeedFund.upsert({
      where: { userId },
      update: {
        currentStage,
        technicalKnowledge: technicalKnowledge === 'true', // Convert string to boolean
        auditedBalanceSheet,
        gstReturn,
        raisedFunds: raisedFunds === 'true',
        employment: employment === 'true',
        projectReport,
        documentStatus: "created",
      },
      create: {
        userId,
        currentStage,
        technicalKnowledge: technicalKnowledge === 'true',
        auditedBalanceSheet,
        gstReturn,
        raisedFunds: raisedFunds === 'true',
        employment: employment === 'true',
        projectReport,
        documentStatus: "created",
      },
    });

    // Successful response
    res.status(200).json({
      message: postSeedFundEntry ? 'Post Seed Fund entry updated successfully' : 'Post Seed Fund entry created successfully',
      data: postSeedFundEntry,
    });
  } catch (error) {
    console.error('Error in submitPostSeedFund:', error);
    res.status(500).json({
      error: 'An error occurred while submitting the form',
      details: error.message || error,
    });
  }
};

const getAllpostWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.postSeedFund.findMany({
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

const getpostById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.postSeedFund.findUnique({
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

const updatepostStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.postSeedFund.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.postSeedFund.update({
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
  submitPostSeedFund,
  getpostById,
  getAllpostWithUserDetails,
  updatepostStatus
}