const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const applyForCoWorkingSpace = async (req, res) => {
  try {
    // Extract token from headers (assumes "Bearer <token>" format)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.user_id; // Adjust as needed based on your JWT payload
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    const { id, coworkingCenter, seatNo, status } = req.body;
    if (!coworkingCenter || !seatNo || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let application;
    if (id) {
      // Update the existing application if id is provided
      application = await prisma.coWorkingApplication.update({
        where: { id },
        data: {
          coworkingCenter,
          seatNo,
          status,
          documentStatus: "created",
        },
      });
    } else {
      // Create a new application
      application = await prisma.coWorkingApplication.create({
        data: {
          coworkingCenter,
          seatNo,
          status,
          userId,
          documentStatus: "created",
        },
      });
    }

    return res.status(200).json({
      message: id
        ? "Application updated successfully"
        : "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Error in applyForCoWorkingSpace:", error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the application" });
  }
};


const getAllCoworkingWithUserDetails = async (req, res) => {
  try {
    const documents = await prisma.coWorkingApplication.findMany({
      select: {
        id:true,
        documentStatus:true,
        updatedAt:true,
				user: {
					select: {
						user_id: true, // Fields from the User model
						registration_no: true,
						company_name: true,
						logo:true,
						
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

const getCoWorkingByToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.user_id;

    const document = await prisma.coWorkingApplication.findUnique({
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

module.exports = {
  applyForCoWorkingSpace,
  getAllCoworkingWithUserDetails,
  getcoworkingById,
  updateCoworkinStatus,
  getCoWorkingByToken
};
