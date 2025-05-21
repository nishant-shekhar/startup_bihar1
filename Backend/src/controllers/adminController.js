

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

const resetUserPassword = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin_id = decoded.admin_id;

    // Optional: Validate that the user has admin role, if your system has roles
    const admin = await prisma.admin.findUnique({ where: { admin_id } });
    if (!admin) return res.status(403).json({ error: "Access denied: Not a valid admin" });

    const { user_id, newPassword } = req.body;

    if (!user_id || !newPassword) {
      return res.status(400).json({ error: "user_id and newPassword are required" });
    }

    const user = await prisma.user.findUnique({ where: { user_id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { user_id },
      data: { password: hashedPassword },
    });

    // Optionally record admin activity
    await prisma.activity.create({
      data: {
        user_id: user_id,
        action: `Password Reset by Admin`,
        subtitle: `Admin ${admin_id} has reset your password.`,
      },
    });

    res.status(200).json({ message: "Password reset successfully by admin" });
  } catch (error) {
    console.error("Error resetting password by admin:", error);
    res.status(500).json({ error: "An error occurred while resetting password" });
  }
};

module.exports = {
  adminLogin,
  createAdmin,
  resetUserPassword,
};
