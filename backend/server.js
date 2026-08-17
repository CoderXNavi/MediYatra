const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MediYatra API Service is active',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'MediYatra Backend',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/hospitals/:hospitalId/doctors', require('./routes/doctorRoutes'));
app.use('/api/hospitals/:hospitalId/treatments', require('./routes/treatmentRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/treatments', require('./routes/treatmentRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

// Enhanced Medical Tourism Feature Routes
app.use('/api/ambulance', require('./routes/ambulanceRoutes'));
app.use('/api/ngos', require('./routes/ngoRoutes'));
app.use('/api/insurance', require('./routes/insuranceRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Fallback 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route not found - ${req.originalUrl}`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 MediYatra Backend Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
