


const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable

const applyForMatchingLoan = async (req, res) => {
  try {
    // Extract the JWT from the request headers
    const token = req.headers.authorization?.split(' ')[1];

    // Verify and decode the JWT to get the user ID and userName
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    let userId, userName;
    try {
      const decoded = jwt.verify(token, JWT_SECRET); // Use your secret key
      userId = decoded.user_id;
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Prepare data for the Matching Loan application
    const matchingLoanData = {
      fundRaised: parseFloat(req.body.fundRaised),
      investorName: req.body.investorName,
      matchingGrantAmount: parseFloat(req.body.matchingGrantAmount),
      documentStatus : "created"
      
    };

    // Handle file uploads safely
    if (req.files) {
      if (req.files.proofOfInvestment && req.files.proofOfInvestment.length > 0) {
        const proofFile = req.files.proofOfInvestment[0];
        matchingLoanData.proofOfInvestmentName = proofFile.filename;
        matchingLoanData.proofOfInvestmentPath = proofFile.path;
      }

      if (req.files.accountStatement && req.files.accountStatement.length > 0) {
        const accountStatementFile = req.files.accountStatement[0];
        matchingLoanData.accountStatementName = accountStatementFile.filename;
        matchingLoanData.accountStatementPath = accountStatementFile.path;
      }

      if (req.files.investorUndertaking && req.files.investorUndertaking.length > 0) {
        const undertakingFile = req.files.investorUndertaking[0];
        matchingLoanData.investorUndertakingName = undertakingFile.filename;
        matchingLoanData.investorUndertakingPath = undertakingFile.path;
      }

      if (req.files.equityDilutionProof && req.files.equityDilutionProof.length > 0) {
        const equityProofFile = req.files.equityDilutionProof[0];
        matchingLoanData.equityDilutionProofName = equityProofFile.filename;
        matchingLoanData.equityDilutionProofPath = equityProofFile.path;
      }

      if (req.files.utilizationPlan && req.files.utilizationPlan.length > 0) {
        const utilizationPlanFile = req.files.utilizationPlan[0];
        matchingLoanData.utilizationPlanName = utilizationPlanFile.filename;
        matchingLoanData.utilizationPlanPath = utilizationPlanFile.path;
      }

      if (req.files.boardResolution && req.files.boardResolution.length > 0) {
        const boardResolutionFile = req.files.boardResolution[0];
        matchingLoanData.boardResolutionName = boardResolutionFile.filename;
        matchingLoanData.boardResolutionPath = boardResolutionFile.path;
      }
    }

    // Upsert: Create or update the matching loan application
    const matchingLoan = await prisma.matchingLoan.upsert({
      where: { userId }, // Check if there's already an application for this user
      update: {
        ...matchingLoanData
      },
      create: {
        ...matchingLoanData,
        userId, // Associate the loan application with the authenticated user
      },
    });

    // Return the created or updated loan application in the response
    return res.status(200).json({
      message: matchingLoan ? 'Loan application updated successfully' : 'Loan application created successfully',
      matchingLoan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};

const getAllmatchingWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.matchingLoan.findMany({
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

const getmatchingnById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.matchingLoan.findUnique({
      where: { id: id }, // Use the ID to query the database
      include: {
        user: {
          select: {
            user_id: true,          // Include specific fields from the User model
            registration_no: true,
            company_name: true,
          },
        },
      },
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

const updateMatchingStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.matchingLoan.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.matchingLoan.update({
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
  applyForMatchingLoan,
  getmatchingnById,
  getAllmatchingWithUserDetails,
  updateMatchingStatus
};
