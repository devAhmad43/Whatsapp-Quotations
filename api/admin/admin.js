const express = require('express');
const router = express.Router();
const AdminPanel = require("../../models/adminModel")
const bcrypt = require("bcrypt")
const secretID = process.env.secret_ID_JWT
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await AdminPanel.findOne({ adminemail: email });
    if (!admin) {
      return res.status(401).json({ message: 'admin not found', userstatus: 0 });
    }
    if (!admin.isverified) {
      return res.status(401).json({ message: 'admin is not verified' });
    }

    // if (admin.password !== password) {
    //   return res.status(401).json({ message: 'Incorrect password' });
    // }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "invalid credationals" });
    }

    admin.sessionExpiration = new Date().getTime() + (30 * 24 * 60 * 60 * 1000);
    const UserToken = jwt.sign({ id: admin._id }, secretID, { expiresIn: '30d' });
    admin.jwtadmintoken = UserToken
    await admin.save();
    res.status(200).json({ message: 'Successfully Sign In', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to Sign-In , try Again Later' });
  }
});
// //Admin Signup  
router.post('/signup', async (req, res) => {
  const { name, phone, country, email, password } = req.body;
  try {
    // Check if the admin already exists
    const existingAdmin = await AdminPanel.findOne({ adminemail: email });

    if (existingAdmin) {
      return res.status(401).json({ message: 'Admin already exists', userstatus: 0 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new AdminPanel({
      name: name,                // Add the name field
      phone: phone,  
      country:country,            // Add the phone field
      adminemail: email,         // Email field
      password: hashedPassword,  // Hashed password
      isverified: true,          // Set verified as true
    });

    // Generate JWT token
    const UserToken = jwt.sign({ id: newAdmin._id }, secretID, { expiresIn: '30d' });
    // Assign token and session expiration
    newAdmin.jwtadmintoken = UserToken;
    newAdmin.sessionExpiration = new Date().getTime() + (30 * 24 * 60 * 60 * 1000); // 30 days

    // Save the new admin to the database
    await newAdmin.save();

    // Respond with success
    res.status(200).json({ message: 'Admin successfully signed up', admin: newAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to sign up admin, try again later' });
  }
});
// Fetch Admin by ID
router.get('/:id/get_admin', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the admin by ID
    const admin = await AdminPanel.findOne({ _id: id });

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    // Check if the admin is verified
    if (!admin.isverified) {
      return res.status(401).json({ message: 'Admin is not verified. Please complete the verification process.' });
    }

    // Check if the admin is suspended (you can replace the 'status' field based on your schema logic)
    if (!admin.status) {
      return res.status(401).json({ message: 'Admin is suspended' });
    }

    // Return the admin data
    res.status(200).json({ message: 'Admin Data fetched successfully', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch Admin Data, please try again later' });
  }
});

module.exports = router;
