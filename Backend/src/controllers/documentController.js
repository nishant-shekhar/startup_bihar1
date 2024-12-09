
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const uploadDocuments = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.user_id;
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

   
   
    const {
      registrationNo,
      founderName,
      founderAadharNumber,
      coFounderNames, // Use as a single string
      coFounderAadharNumbers, // Use as a single string
      sector,
      businessConcept,
      mobileNumbers, // Use as a single string
      email,
      websiteLink,
      category,
      gender,
      dpiitRecognitionNo,
      appliedIPR,
    } = req.body;
     // Extract the S3 URLs from the file upload response
     const logoPath = req.files.logo ? req.files.logo[0].location : null;
     const certPath = req.files.certificate ? req.files.certificate[0].location : null;
    const document = await prisma.document.upsert({
      where: { userId },
      update: {
        registrationNo,
        founderName,
        founderAadharNumber,
        coFounderNames: req.body.coFounderNames ? req.body.coFounderNames.trim() : null, // Use as a single string
        coFounderAadharNumbers: req.body.coFounderAadharNumbers ? req.body.coFounderAadharNumbers.trim() : null, // Use as a single string
        sector,
        businessConcept,
        mobileNumbers: req.body.mobileNumbers ? req.body.mobileNumbers.trim() : null, // Use as a single string
        email,
        websiteLink,
        category,
        gender,
        dpiitRecognitionNo,
        appliedIPR: req.body.appliedIPR === 'true',
        logoPath,
        certPath,
        documentStatus: "Updated"
      },
      create: {
        registrationNo,
        founderName,
        founderAadharNumber,
        coFounderNames: req.body.coFounderNames ? req.body.coFounderNames.trim() : null, // Use as a single string
        coFounderAadharNumbers: req.body.coFounderAadharNumbers ? req.body.coFounderAadharNumbers.trim() : null, // Use as a single string
        sector,
        businessConcept,
        mobileNumbers: req.body.mobileNumbers ? req.body.mobileNumbers.trim() : null, // Use as a single string
        email,
        websiteLink,
        category,
        gender,
        dpiitRecognitionNo,
        appliedIPR: req.body.appliedIPR === 'true',
        logoPath,
        certPath,
        documentStatus: "created",
        userId
      }
    });


   


    return res.status(200).json({
      message: document ? 'Document updated successfully' : 'Document created successfully',
      document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};

const getDocumentById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.document.findUnique({
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


const getAllDocumentsWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
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

const updateDocumentStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus, comment ,certPath} = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.document.findUnique({ where: { id } });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const updateData = { documentStatus, comment };

    if (certPath !== undefined) {
      updateData.certPath = certPath;
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      message: 'Document status and comment updated successfully',
      document: updatedDocument,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update document status and comment' });
  }
};
/*const updateDocumentStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.document.update({
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
};*/

const getUserDocument = async (req, res) => {
  try {
    // Extract the token from headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Decode the token to get the user ID
    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.user_id;
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Query for documents linked to this user ID
    const document = await prisma.document.findUnique({
      where: { userId },
      select: {
        id: true,
        registrationNo: true,
        documentStatus: true,
        comment: true,
        // add other fields as necessary
      },
    });

    if (!document) {
      return res.status(404).json({ error: 'No document found for this user' });
    }

    // Send the document and its status in response
    return res.status(200).json({
      message: 'Document retrieved successfully',
      document,
    });
  } catch (error) {
    console.error('Error retrieving user document:', error);
    res.status(500).json({ error: 'An error occurred while fetching the document' });
  }
};

module.exports = {
  uploadDocuments,
  getDocumentById,
  getAllDocumentsWithUserDetails,
  updateDocumentStatus,
  getUserDocument
};


