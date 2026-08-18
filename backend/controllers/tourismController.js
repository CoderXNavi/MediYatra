const TourismOrder = require('../models/TourismOrder');
const mongoose = require('mongoose');

const fallbackTourismOrders = [
  {
    _id: 'tour_pipeline_101',
    patientEmail: 'patient@mediyatra.org',
    patientName: 'Demo Patient',
    patientPhone: '+1 555 0192',
    patientCountry: 'United States',
    serviceType: 'Fast-Track e-Medical Visa Invitation Letter',
    serviceDetails: 'Official VIL requested for patient and two attendants.',
    hospitalId: 'hosp_1',
    hospitalName: 'Max Super Speciality Hospital Saket',
    doctorId: 'doc_1',
    doctorName: 'Dr. Naresh Trehan',
    medicalReason: 'Pre-Surgical Evaluation for CABG Cardiac Surgery',
    status: 'Pending Hospital Approval',
    hospitalNotes: '',
    adminLogisticsNotes: '',
    doctorNotes: '',
    createdAt: new Date().toISOString()
  }
];

// @desc    Step 1: Patient submits Medical Tourism Request
// @route   POST /api/tourism
// @access  Public / Authenticated Patient
const createTourismOrder = async (req, res, next) => {
  try {
    const {
      patientEmail,
      patientName,
      patientPhone,
      patientCountry,
      serviceType,
      serviceDetails,
      hospitalId,
      hospitalName,
      doctorId,
      doctorName,
      medicalReason
    } = req.body;

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
        patientPhone: patientPhone || '',
        patientCountry: patientCountry || 'International',
        serviceType,
        serviceDetails: serviceDetails || '',
        hospitalId: hospitalId || 'hosp_1',
        hospitalName: hospitalName || 'Max Super Speciality Hospital Saket',
        doctorId: doctorId || 'doc_1',
        doctorName: doctorName || 'Dr. Naresh Trehan',
        medicalReason: medicalReason || 'General Medical Assessment & Treatment',
        status: 'Pending Hospital Approval'
      });

      return res.status(201).json({
        success: true,
        message: 'Medical Tourism request submitted! Sent to Hospital for Visa & Bed approval.',
        data: order
      });
    }

    const newOrder = {
      _id: `tour_${Date.now()}`,
      patientEmail: cleanEmail,
      patientName,
      patientPhone: patientPhone || '',
      patientCountry: patientCountry || 'International',
      serviceType,
      serviceDetails: serviceDetails || '',
      hospitalId: hospitalId || 'hosp_1',
      hospitalName: hospitalName || 'Max Super Speciality Hospital Saket',
      doctorId: doctorId || 'doc_1',
      doctorName: doctorName || 'Dr. Naresh Trehan',
      medicalReason: medicalReason || 'General Medical Assessment & Treatment',
      status: 'Pending Hospital Approval',
      hospitalNotes: '',
      adminLogisticsNotes: '',
      doctorNotes: '',
      createdAt: new Date().toISOString()
    };
    fallbackTourismOrders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'Medical Tourism request submitted! Sent to Hospital for Visa & Bed approval.',
      dataSource: 'fallback-cache',
      data: newOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Tourism Orders (Filterable by patientEmail, hospitalName, doctorName, status)
// @route   GET /api/tourism
// @access  Public / Authenticated
const getTourismOrders = async (req, res, next) => {
  try {
    const { patientEmail, hospitalName, doctorName, status } = req.query;

    let query = {};
    if (patientEmail) query.patientEmail = patientEmail.trim().toLowerCase();
    if (status) query.status = status;
    if (hospitalName) query.hospitalName = { $regex: new RegExp(hospitalName.trim(), 'i') };
    if (doctorName) query.doctorName = { $regex: new RegExp(doctorName.trim(), 'i') };

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
    if (hospitalName) {
      filtered = filtered.filter(o => o.hospitalName && o.hospitalName.toLowerCase().includes(hospitalName.trim().toLowerCase()));
    }
    if (doctorName) {
      filtered = filtered.filter(o => o.doctorName && o.doctorName.toLowerCase().includes(doctorName.trim().toLowerCase()));
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

// @desc    Step 2: Hospital Approves Visa Letter & Bed Readiness
// @route   PATCH /api/tourism/:id/hospital-approve
// @access  Hospital Provider
const approveByHospital = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { hospitalNotes } = req.body;

    const newStatus = 'Approved by Hospital';
    const notesText = hospitalNotes || 'Official Embassy Visa Invitation Letter (VIL) issued & Inpatient bed reserved.';

    if (mongoose.connection.readyState === 1) {
      const order = await TourismOrder.findByIdAndUpdate(
        id,
        { status: newStatus, hospitalNotes: notesText },
        { new: true }
      );
      if (!order) return res.status(404).json({ success: false, error: 'Request not found' });
      return res.status(200).json({ success: true, message: 'Hospital approved VIL & sent to Admin logistics', data: order });
    }

    const order = fallbackTourismOrders.find(o => o._id === id);
    if (!order) return res.status(404).json({ success: false, error: 'Request not found' });

    order.status = newStatus;
    order.hospitalNotes = notesText;

    res.status(200).json({
      success: true,
      message: 'Hospital approved VIL & sent to Admin logistics',
      dataSource: 'fallback-cache',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Step 3: Admin Dispatches Logistics & Translators (Forwards to Doctor Desk)
// @route   PATCH /api/tourism/:id/admin-dispatch
// @access  Admin
const dispatchByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminLogisticsNotes } = req.body;

    const newStatus = 'Dispatched by Admin';
    const notesText = adminLogisticsNotes || 'Certified Translator assigned, Recovery Suite reserved, Airport Driver scheduled.';

    if (mongoose.connection.readyState === 1) {
      const order = await TourismOrder.findByIdAndUpdate(
        id,
        { status: newStatus, adminLogisticsNotes: notesText },
        { new: true }
      );
      if (!order) return res.status(404).json({ success: false, error: 'Request not found' });
      return res.status(200).json({ success: true, message: 'Admin dispatched travel logistics. Case ready for Doctor!', data: order });
    }

    const order = fallbackTourismOrders.find(o => o._id === id);
    if (!order) return res.status(404).json({ success: false, error: 'Request not found' });

    order.status = newStatus;
    order.adminLogisticsNotes = notesText;

    res.status(200).json({
      success: true,
      message: 'Admin dispatched travel logistics. Case ready for Doctor!',
      dataSource: 'fallback-cache',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Step 4: Doctor Evaluates Clinical Case & Issues Clinical Response
// @route   PATCH /api/tourism/:id/doctor-complete
// @access  Doctor
const completeByDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { doctorNotes } = req.body;

    if (!doctorNotes) {
      return res.status(400).json({ success: false, error: 'Please provide doctorNotes clinical advice' });
    }

    const newStatus = 'Completed';

    if (mongoose.connection.readyState === 1) {
      const order = await TourismOrder.findByIdAndUpdate(
        id,
        { status: newStatus, doctorNotes },
        { new: true }
      );
      if (!order) return res.status(404).json({ success: false, error: 'Request not found' });
      return res.status(200).json({ success: true, message: 'Doctor clinical evaluation completed!', data: order });
    }

    const order = fallbackTourismOrders.find(o => o._id === id);
    if (!order) return res.status(404).json({ success: false, error: 'Request not found' });

    order.status = newStatus;
    order.doctorNotes = doctorNotes;

    res.status(200).json({
      success: true,
      message: 'Doctor clinical evaluation completed!',
      dataSource: 'fallback-cache',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTourismOrder,
  getTourismOrders,
  approveByHospital,
  dispatchByAdmin,
  completeByDoctor
};
