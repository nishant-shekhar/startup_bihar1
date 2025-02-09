


const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret_key'; // Store securely in env vars



const postShowcase = async (req, res) => {
  
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

    const user_id = getUserIdFromToken(token);
    const { title, subtitle,location,projectLink,date} = req.body;

    if (!user_id || !title || !subtitle || !location) {
      return res.status(400).json({ error: 'All fields are required: title,location,pic url' });
    }

    const picUrl = req.files.picUrl ? req.files.picUrl[0].location : null;
    


    const newShowcase = await prisma.showcase.create({
      data: {
        user_id,
        title,
        subtitle,
        projectLink,
        picUrl,
        location,
        date,
   
      },
    });

    res.status(201).json({
      message: 'Showcase created successfully',
      user: {
        user_id:newShowcase.user_id,
        title:newShowcase.title,
        subtitle:newShowcase.subtitle,
        projectLink:newShowcase.projectLink,
        picUrl:newShowcase.picUrl,
        location:newShowcase.location,
        date:newShowcase.date,
      },
    });
    
  } catch (error) {
    console.error('Error creating Showcase:', error);
    res.status(500).json({ error: 'An error occurred while creating the showcase' });
  }
};
// Utility function to verify JWT and get user_id
const getUserIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.user_id;
  } catch (err) {
    throw new Error('Unauthorized: Invalid token');
  }
};

// Fetch all top startups
const getShowcaseUser = async (req, res) => {
  let { user_id } = req.params; // Retrieve id from the request parameters

  try {

    // Ensure that a user_id is provided
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required to fetch showcase' });
    }

    console.log('Fetching details for user_id:', user_id);

    // Find the user by user_id and select only basic fields
    const showcase = await prisma.showcase.findMany({
      where: { user_id },
      select: {
        id: true,
        title: true,
        subtitle: true,
        projectLink: true,
        picUrl: true,
        date: true,
        location: true,
        createdAt: true,
        
      }
    });

    // If the user is not found, return an error
    if (!showcase) {
      console.log(`No showcase found for user_id: ${user_id}`);
      return res.status(404).json({ error: 'showcase not found' });
    }

    //console.log('showcase details:', showcase);

    // Respond with the basic details
    res.status(200).json({ showcase });
  } catch (error) {
    console.error('Error fetching showcase details:', error);
    res.status(500).json({ error: 'An error occurred while fetching showcase details', details: error.message });
  }
};
const deleteShowcase = async (req, res) => {
  const { id } = req.params; // Retrieve the showcase ID from the request parameters

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const user_id = getUserIdFromToken(token);

    // Ensure the ID is provided
    if (!id || !user_id) {
      return res.status(400).json({ error: 'Showcase ID and token are required' });
    }

    console.log('Deleting showcase with ID:', id);

    // Check if the showcase exists
    const existingShowcase = await prisma.showcase.findUnique({
      where: { id },
    });

    if (!existingShowcase) {
      console.log(`No showcase found with ID: ${id}`);
      return res.status(404).json({ error: 'Showcase not found' });
    }

    // Ensure the user_id matches the one in the showcase model
    if (existingShowcase.user_id !== user_id) {
      console.log(`Unauthorized delete attempt by user: ${user_id}`);
      return res.status(403).json({ error: 'Unauthorized: You do not own this showcase' });
    }

    // Delete the showcase
    await prisma.showcase.delete({
      where: { id },
    });

    console.log('Showcase deleted successfully with ID:', id);

    // Respond with success
    res.status(200).json({ message: 'Showcase deleted successfully' });
  } catch (error) {
    console.error('Error deleting showcase:', error);
    res.status(500).json({ error: 'An error occurred while deleting the showcase', details: error.message });
  }
};



module.exports = {
  postShowcase,
  getShowcaseUser,
  deleteShowcase

};
