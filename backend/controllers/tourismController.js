const TourismOrder = require('../models/TourismOrder');
const mongoose = require('mongoose');

const fallbackTourismOrders = [
  {
    _id: 'tour_001',
    patientEmail: 'patient@mediyatra.org',
    patientName: 'Demo Patient',
    serviceType: 'Fast-Track e-Medical Visa Invitation Letter',
    serviceDetails: 'Official VIL requested for patient and two attendants.',
    contactPhone: '+1 555 0192',
    preferredDate: '2026-08-25T00:00:00.000Z',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'tour_002',
    patientEmail: 'sarah@example.com',
    patientName: 'Sarah Miller',
    serviceType: 'Arabic Language Interpreter (Tariq Al-Mansoor)',
    serviceDetails: 'Arabic medical translator required for 3-day cardiology OPD.',
    contactPhone: '+971 50 123 4567',
    preferredDate: '2026-08-28T00:00:00.000Z',
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
];

// @desc    Book a medical tourism concierge service
// @route   POST /api/tourism
// @access  Public / Authenticated Patient
const createTourismOrder = async (req, res, next) => {
  try {
    const { patientEmail, patientName, serviceType, serviceDetails, contactPhone, preferredDate } = req.body;

    if (!patientEmail || !patientName || !serviceType) {
      return res.status(400).json({
        success: false,
        error: 'Please provide patientEmail, patientName, and serviceType'
      });
    }

    const cleanEmail = patientEmail.trim().toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const order = await TourismOrder.create({
        patientEmail: cleanEmail,
        patientName,
        serviceType,
        serviceDetails: serviceDetails || '',
        contactPhone: contactPhone || '',
        preferredDate: preferredDate ? new Date(preferredDate) : new Date(),
        status: 'Pending'
      });

      return res.status(201).json({
        success: true,
        message: 'Medical tourism service booked successfully',
        data: order
      });
    }

    const newOrder = {
      _id: `tour_${Date.now()}`,
      patientEmail: cleanEmail,
      patientName,
      serviceType,
      serviceDetails: serviceDetails || '',
      contactPhone: contactPhone || '',
      preferredDate: preferredDate ? new Date(preferredDate).toISOString() : new Date().toISOString(),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    fallbackTourismOrders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'Medical tourism service booked successfully',
      dataSource: 'fallback-cache',
      data: newOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all booked medical tourism services (Admin / Operations management)
// @route   GET /api/tourism
// @access  Public / Admin
const getTourismOrders = async (req, res, next) => {
  try {
    const { patientEmail, status } = req.query;

    let query = {};
    if (patientEmail) query.patientEmail = patientEmail.trim().toLowerCase();
    if (status) query.status = status;

    if (mongoose.connection.readyState === 1) {
      const orders = await TourismOrder.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    }

    let filtered = [...fallbackTourismOrders];
    if (patientEmail) {
      filtered = filtered.filter(o => o.patientEmail && o.patientEmail.toLowerCase() === patientEmail.trim().toLowerCase());
    }
    if (status) {
      filtered = filtered.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      dataSource: 'fallback-cache',
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update medical tourism order status
// @route   PATCH /api/tourism/:id/status
// @access  Public / Admin
const updateTourismOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Please provide status' });
    }

    if (mongoose.connection.readyState === 1) {
      const order = await TourismOrder.findByIdAndUpdate(id, { status }, { new: true });
      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      return res.status(200).json({ success: true, data: order });
    }

    const order = fallbackTourismOrders.find(o => o._id === id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.status = status;
    res.status(200).json({ success: true, dataSource: 'fallback-cache', data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTourismOrder,
  getTourismOrders,
  updateTourismOrderStatus
};
