

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use environment variable

const applyForCoWorkingSpace = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers

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

    const { coworkingCenter, seatNo, status } = req.body;

    if (!coworkingCenter || !seatNo || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const application = await prisma.coWorkingApplication.upsert({
      where: { userId },
      update: {
        coworkingCenter,
        seatNo,
        status,
        documentStatus : "created"
      },
      create: {
        coworkingCenter,
        seatNo,
        status,
        userId,
      },
    });

    return res.status(200).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while submitting the application' });
  }
};

const getAllCoworkingWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.coWorkingApplication.findMany({
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

const getcoworkingById = async (req, res) => {
  let { id } = req.params; // Retrieve id from the request parameters

  try {
  
    // Check if id is provided
    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    // Fetch the document from the database
    const document = await prisma.coWorkingApplication.findUnique({
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

const updateCoworkinStatus = async (req, res) => {
  const { id } = req.params;
  const { documentStatus } = req.body;

  if (!documentStatus) {
    return res.status(400).json({ error: 'Document status is required' });
  }

  try {
    const document = await prisma.coWorkingApplication.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updatedDocument = await prisma.coWorkingApplication.update({
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
  applyForCoWorkingSpace,
  getAllCoworkingWithUserDetails,
  getcoworkingById,
  updateCoworkinStatus
};
