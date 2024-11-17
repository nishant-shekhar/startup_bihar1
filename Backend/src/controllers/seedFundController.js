const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = 'your_jwt_secret_key';

// Seed fund form submission controller
const submitSeedFund = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user_id;

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

    // Extract the S3 URLs from the file upload response
    const companyCertificate = req.files.companyCertificate ? req.files.companyCertificate[0].location : null;
    const cancelChequeOrPassbook = req.files.cancelChequeOrPassbook ? req.files.cancelChequeOrPassbook[0].location : null;

    const seedFundEntry = await prisma.seedFund.upsert({
      where: { userId },
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
        documentStatus: "Updated"
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
        userId
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
  const { documentStatus, comment } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Seed Fund Document status is required' });
  }

  try {
    const seedFund = await prisma.seedFund.findUnique({ where: { id } });

    if (!seedFund) {
      return res.status(404).json({ error: 'Seed Fund Document not found' });
    }

    const updatedDocument = await prisma.seedFund.update({
      where: { id },
      data: { documentStatus, comment },
    });

    res.status(200).json({
      message: 'Seed Fund Document status and comment updated successfully',
      document: updatedDocument,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update Seed Fund document status and comment' });
  }
};

module.exports = {
  submitSeedFund,
  getseedById,
  getAllSeedWithUserDetails,
  updateSeedStatus
}