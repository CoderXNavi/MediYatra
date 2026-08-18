const User = require('../models/User');
const Doctor = require('../models/Doctor');
const mongoose = require('mongoose');

// In-memory registered users cache for fallback resilience
const registeredUsersCache = [
  { _id: 'u_patient_1', name: 'Demo Patient', email: 'patient@mediyatra.org', password: 'password123', role: 'Patient' },
  { _id: 'u_doctor_1', name: 'Dr. Naresh Trehan', email: 'doctor@mediyatra.org', password: 'password123', role: 'Doctor' },
  { _id: 'u_hospital_1', name: 'Max Hospital Admin', email: 'hospital@mediyatra.org', password: 'password123', role: 'Hospital' },
  { _id: 'u_admin_1', name: 'System Admin', email: 'admin@mediyatra.org', password: 'password123', role: 'Admin' }
];

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

      // If registered as Doctor, auto-create Doctor profile in directory
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

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: `jwt_${user._id}_${Date.now()}`
        }
      });
    }

    // Fallback cache check
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

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      dataSource: 'fallback-cache',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: `jwt_${newUser._id}_${Date.now()}`
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

      return res.status(200).json({
        success: true,
        message: 'Sign in successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: role || user.role,
          token: `jwt_${user._id}_${Date.now()}`
        }
      });
    }

    // Fallback cache check
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

    res.status(200).json({
      success: true,
      message: 'Sign in successful',
      dataSource: 'fallback-cache',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role || user.role,
        token: `jwt_${user._id}_${Date.now()}`
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
