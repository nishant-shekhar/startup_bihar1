


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
    const { title, subtitle,location,projectLink, picUrl,date} = req.body;

    if (!user_id || !title || !subtitle || !location ||!picUrl) {
      return res.status(400).json({ error: 'All fields are required: title,location,pic url' });
    }


    


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
  try {
    const { user_id } = req.query; // Expecting user_id as a query parameter

    // Ensure that a user_id is provided
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required to fetch showcase' });
    }

    console.log('Fetching details for user_id:', user_id);

    // Find the user by user_id and select only basic fields
    const showcase = await prisma.showcase.findUnique({
      where: { user_id },
      select: {
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

    console.log('showcase details:', showcase);

    // Respond with the basic details
    res.status(200).json({ showcase });
  } catch (error) {
    console.error('Error fetching showcase details:', error);
    res.status(500).json({ error: 'An error occurred while fetching showcase details', details: error.message });
  }
};



module.exports = {
  postShowcase,
  getShowcaseUser

};
