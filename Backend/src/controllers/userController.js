


const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const JWT_SECRET = 'your_jwt_secret_key'; // Store securely in env vars

// User login controller
const userLogin = async (req, res) => {
  try {
    const { user_id, password } = req.body;

    // Check if user_id and password are provided
    if (!user_id || !password) {
      return res.status(400).json({ error: 'user_id and password are required' });
    }

    // Find user by user_id
    const user = await prisma.user.findUnique({
      where: { user_id },
    });

    // If user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return token, user_id, and registration_no
    res.status(200).json({
      message: 'Login successful',
      token,
      user_id: user.user_id,
      registration_no: user.registration_no
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
};


const createUser = async (req, res) => {
  try {
    const { user_id, password, registration_no, company_name } = req.body;

    // Check if all required fields are provided
    if (!user_id || !password || !registration_no || !company_name) {
      return res.status(400).json({ error: 'All fields are required: user_id, password, registration_no, and company_name' });
    }

    // Check if user_id or registration_no already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { user_id },
          { registration_no }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this user_id or registration_no already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await prisma.user.create({
      data: {
        user_id,
        password: hashedPassword,
        registration_no,
        company_name,
      },
    });

    // Respond with the created user's details (without the password)
    res.status(201).json({
      message: 'User created successfully',
      user: {
        user_id: newUser.user_id,
        registration_no: newUser.registration_no,
        company_name: newUser.company_name,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
};

module.exports = {
  userLogin,
  createUser
};
