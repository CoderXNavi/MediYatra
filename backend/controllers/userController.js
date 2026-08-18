const User = require('../models/User');
const Doctor = require('../models/Doctor');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const registeredUsersCache = [
  { _id: 'u_patient_1', name: 'Demo Patient', email: 'patient@mediyatra.org', password: 'password123', role: 'Patient' },
  { _id: 'u_doctor_1', name: 'Dr. Naresh Trehan', email: 'doctor@mediyatra.org', password: 'password123', role: 'Doctor' },
  { _id: 'u_hospital_1', name: 'Max Hospital Admin', email: 'hospital@mediyatra.org', password: 'password123', role: 'Hospital' },
  { _id: 'u_admin_1', name: 'System Admin', email: 'admin@mediyatra.org', password: 'password123', role: 'Admin' }
];

function generateToken(userObj) {
  return jwt.sign(
    { id: userObj._id, name: userObj.name, email: userObj.email, role: userObj.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const assignedRole = role || 'Patient';

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email: cleanEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          error: 'This email is already registered. Please sign in.'
        });
      }

      const user = await User.create({
        name,
        email: cleanEmail,
        password,
        role: assignedRole
      });

      if (assignedRole === 'Doctor') {
        try {
          await Doctor.create({
            hospitalId: '64f1a2b3c4d5e6f7a8b9c0d1',
            name,
            specialty: 'General Medicine & Senior Specialist',
            qualifications: 'MBBS, MD',
            experienceYears: 12,
            languages: ['English', 'Hindi'],
            consultationFeeUSD: 50,
            availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
          });
        } catch (e) {
          console.warn('Auto doctor profile creation skipped:', e.message);
        }
      }

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      });
    }

    const existingCache = registeredUsersCache.find(u => u.email === cleanEmail);
    if (existingCache) {
      return res.status(400).json({
        success: false,
        error: 'This email is already registered. Please sign in.'
      });
    }

    const newUser = {
      _id: `u_${Date.now()}`,
      name,
      email: cleanEmail,
      password,
      role: assignedRole,
      createdAt: new Date().toISOString()
    };
    registeredUsersCache.push(newUser);

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      dataSource: 'fallback-cache',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate / Sign in existing user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(400).json({
          success: false,
          error: 'Account not registered. Please click Register to create an account.'
        });
      }

      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          error: 'Incorrect password. Please try again.'
        });
      }

      const activeUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role || user.role
      };
      const token = generateToken(activeUser);

      return res.status(200).json({
        success: true,
        message: 'Sign in successful',
        data: {
          ...activeUser,
          token
        }
      });
    }

    const user = registeredUsersCache.find(u => u.email === cleanEmail);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Account not registered. Please click Register to create an account.'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password. Please try again.'
      });
    }

    const activeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: role || user.role
    };
    const token = generateToken(activeUser);

    res.status(200).json({
      success: true,
      message: 'Sign in successful',
      dataSource: 'fallback-cache',
      data: {
        ...activeUser,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser
};
