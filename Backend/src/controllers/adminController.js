

const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const JWT_SECRET = 'your'; // Store securely in env vars

const adminLogin = async (req, res) => {
  try {
    const { admin_id, password} = req.body;

    // Check if admin_id and password are provided
    if (!admin_id || !password ) {
      return res.status(400).json({ error: 'admin_id and password are required' });
    }

    // Find admin by admin_id
    const admin = await prisma.admin.findUnique({
      where: { admin_id },
    });

    // If admin doesn't exist, return an error
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Compare provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { admin_id: admin.admin_id },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 1 hour
    );

    // Return the token
    res.status(200).json({
      message: 'Admin login successful',
      token,
      
      admin_id: admin.admin_id,
      role: admin.role,       
      designation: admin.designation,       
      name: admin.name,      
      contact: admin.contact,      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while logging in' });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { admin_id, password ,  name, role,designation,contact } = req.body;

    // Check if admin_id and password are provided
    if (!admin_id || !password ||!role ||!name ||!designation||!contact) {
      return res.status(400).json({ error: 'admin_id , password, name, designation, role and contact are required' });
    }

    // Check if an admin with the same admin_id already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { admin_id },
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this admin_id already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new admin in the database
    const newAdmin = await prisma.admin.create({
      data: {
        admin_id,
        password: hashedPassword,
        name:name,
        role:role,
        designation:designation,
        contact:contact
      },
    });

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        admin_id: newAdmin.admin_id,
      },
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'An error occurred while creating the admin' });
  }
};

module.exports = {
  adminLogin,
  createAdmin
};
