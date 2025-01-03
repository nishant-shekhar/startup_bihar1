
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
      coFounderNames,
      coFounderAadharNumbers,
      sector,
      businessConcept,
      mobileNumbers,
      email,
      websiteLink,
      category,
      gender,
      dpiitRecognitionNo,
      appliedIPR,
    } = req.body;

    const updateData = {
      registrationNo,
      founderName,
      founderAadharNumber,
      coFounderNames: coFounderNames?.trim() || null,
      coFounderAadharNumbers: coFounderAadharNumbers?.trim() || null,
      sector,
      businessConcept,
      mobileNumbers: mobileNumbers?.trim() || null,
      email,
      websiteLink,
      category,
      gender,
      dpiitRecognitionNo,
      appliedIPR: appliedIPR === 'true',
      documentStatus: "Updated",
    };

    const logoPath = req.files.logo ? req.files.logo[0].location : null;
    const certPath = req.files.certificate ? req.files.certificate[0].location : null;

    if (logoPath) updateData.logoPath = logoPath;
    if (certPath) updateData.certPath = certPath;

    const createData = {
      ...updateData,
      logoPath,
      certPath,
      userId,
      documentStatus: "created",
    };

    const document = await prisma.document.upsert({
      where: { userId },
      update: updateData,
      create: createData,
    });

    res.status(200).json({
      message: 'Document updated successfully',
      document,
    });
  } catch (error) {
    console.error('Error updating documents:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};

const uploadCertificate = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user_id;

    const certPath = req.files.certPath ? req.files.certPath[0].location : null;

    if (!certPath) {
      return res.status(400).json({ error: "No certificate file uploaded" });
    }

    // Fetch the user document to ensure all required fields are provided
    const existingDocument = await prisma.document.findUnique({
      where: { userId },
    });

    if (!existingDocument) {
      return res.status(400).json({ 
        error: "Document does not exist. Please upload all required fields first."
      });
    }

    // Prepare data for update
    const updateData = { 
      certPath, 
      documentStatus: "Updated", 
      updatedAt: new Date(),
    };

    const createData = {
      logoPath: existingDocument.logoPath || "", // Required field
      registrationNo: existingDocument.registrationNo,
      founderName: existingDocument.founderName,
      founderAadharNumber: existingDocument.founderAadharNumber,
      coFounderNames: existingDocument.coFounderNames,
      coFounderAadharNumbers: existingDocument.coFounderAadharNumbers,
      sector: existingDocument.sector,
      businessConcept: existingDocument.businessConcept,
      mobileNumbers: existingDocument.mobileNumbers,
      email: existingDocument.email,
      websiteLink: existingDocument.websiteLink || null,
      category: existingDocument.category,
      gender: existingDocument.gender,
      dpiitRecognitionNo: existingDocument.dpiitRecognitionNo || null,
      appliedIPR: existingDocument.appliedIPR,
      userId,
      documentStatus: "created",
      certPath,
    };

    const document = await prisma.document.upsert({
      where: { userId },
      update: updateData,
      create: createData,
    });

    res.status(200).json({
      message: "Certificate updated successfully",
      document,
    });
  } catch (error) {
    console.error("Error updating certificate:", error);
    res.status(500).json({ error: "An error occurred while uploading the certificate." });
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
        documentStatus:true,
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
const getDocumentByToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user_id;

    const document = await prisma.document.findUnique({
      where: { userId },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    console.error("Error retrieving document:", error);
    res.status(500).json({ error: "An error occurred while retrieving the document" });
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
      // If document not found, return a response with documentStatus: null
      return res.status(200).json({
        message: 'No document status found for this user',
        document: { documentStatus: null, comment: null },
      });
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
  getUserDocument,
  getDocumentByToken,
  uploadCertificate
};


