const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = 'your_jwt_secret_key';

// Seed fund form submission controller
const submitSeedFund = async (req, res) => {
  try {
    // Ensure a token is provided in the request headers
    const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer <token> format
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    // Decode the JWT to get the user ID
    const decoded = jwt.verify(token, JWT_SECRET); // Use your JWT secret
    const userId = decoded.user_id; // Adjust according to your token payload structure

    // Extract form data from the request body
    const {
      companyName,
      registrationNumber,
      dateOfIncorporation,
      businessEntityType,
      rocDistrict,
      companyAddress,
      pincode,
      bankName,
      ifscCode,
      currentAccountNumber,
      currentAccountHolderName,
      branchName,
      branchAddress,
      panNumber,
      gstNumber
    } = req.body;

    // Handle file uploads
    const companyCertificate = req.files.companyCertificate ? req.files.companyCertificate[0].path : null;
    const cancelChequeOrPassbook = req.files.cancelChequeOrPassbook ? req.files.cancelChequeOrPassbook[0].path : null;

    // Upsert: Create or update the seed fund entry
    const seedFundEntry = await prisma.seedFund.upsert({
      where: { userId }, // Use userId to find existing entry
      update: {
        companyName,
        registrationNumber,
        dateOfIncorporation: new Date(dateOfIncorporation),
        businessEntityType,
        companyCertificate,
        rocDistrict,
        companyAddress,
        pincode,
        bankName,
        ifscCode,
        currentAccountNumber,
        currentAccountHolderName,
        branchName,
        branchAddress,
        cancelChequeOrPassbook,
        panNumber,
        gstNumber,
        documentStatus: "created"
      },
      create: {
        companyName,
        registrationNumber,
        dateOfIncorporation: new Date(dateOfIncorporation),
        businessEntityType,
        companyCertificate,
        rocDistrict,
        companyAddress,
        pincode,
        bankName,
        ifscCode,
        currentAccountNumber,
        currentAccountHolderName,
        branchName,
        branchAddress,
        cancelChequeOrPassbook,
        panNumber,
        gstNumber,
        documentStatus: "created",
        userId // Associate the entry with the user ID
      }
    });

    res.status(200).json({
      message: seedFundEntry ? 'Seed fund entry updated successfully' : 'Seed fund entry created successfully',
      data: seedFundEntry
    });
  } catch (error) {
    console.error('Error creating/updating seed fund entry:', error);
    res.status(500).json({ error: 'An error occurred while submitting the form.' });
  }
};

const getAllSeedWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.seedFund.findMany({
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

const getseedById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.seedFund.findUnique({
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

const updateSeedStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.seedFund.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.seedFund.update({
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
  submitSeedFund,
  getseedById,
  getAllSeedWithUserDetails,
  updateSeedStatus
}