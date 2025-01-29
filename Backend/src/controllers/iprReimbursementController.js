


const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable

const applyForIPRReimbursement = async (req, res) => {
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
      iprType,
      feePaidForApplicationForm,
      consultancyFee,
    } = req.body;

    if (!iprType || !feePaidForApplicationForm) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const iprCertificateFile = req.files?.iprCertificate?.[0];
    const feePaidInvoiceFile = req.files?.feePaidInvoice?.[0];
    const consultancyInvoiceFile = req.files?.consultancyInvoice?.[0];

    if (!iprCertificateFile || !feePaidInvoiceFile) {
      return res.status(400).json({ error: 'IPR Certificate and Invoice files are required' });
    }

    const application = await prisma.iPRReimbursement.upsert({
      where: { userId },
      update: {
        iprType,
        feePaidForApplicationForm,
        consultancyFee,
        iprCertificateFileName: iprCertificateFile.filename,
        iprCertificateFilePath: iprCertificateFile.path,
        feePaidInvoiceFileName: feePaidInvoiceFile.filename,
        feePaidInvoiceFilePath: feePaidInvoiceFile.path,
        consultancyInvoiceFileName: consultancyInvoiceFile?.filename || null,
        consultancyInvoiceFilePath: consultancyInvoiceFile?.path || null,
        documentStatus : "created"
      },
      create: {
        iprType,
        feePaidForApplicationForm,
        consultancyFee,
        iprCertificateFileName: iprCertificateFile.filename,
        iprCertificateFilePath: iprCertificateFile.path,
        feePaidInvoiceFileName: feePaidInvoiceFile.filename,
        feePaidInvoiceFilePath: feePaidInvoiceFile.path,
        consultancyInvoiceFileName: consultancyInvoiceFile?.filename || null,
        consultancyInvoiceFilePath: consultancyInvoiceFile?.path || null,
        userId,
      },
    });

    return res.status(200).json({
      message: 'IPR Reimbursement application submitted successfully',
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the application' });
  }
};

const getAllIprnWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.iPRReimbursement.findMany({
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

const getIprnById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.iPRReimbursement.findUnique({
      where: { id: id }, // Use the ID to query the database
      include: {
        user: {
          select: {
            user_id: true,          // Include specific fields from the User model
            registration_no: true,
            company_name: true,
            founder_name: true,
            dateOfIncorporation: true,
            districtRoc:true,
            cin:true,
            mobile:true,
            email:true,
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

const updateiprStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.iPRReimbursement.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.iPRReimbursement.update({
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
  applyForIPRReimbursement,
  getIprnById,
  getAllIprnWithUserDetails,
  updateiprStatus
};
