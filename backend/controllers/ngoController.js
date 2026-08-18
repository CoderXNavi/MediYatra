const NGO = require('../models/NGO');
const Equipment = require('../models/Equipment');
const AidRequest = require('../models/AidRequest');
const mongoose = require('mongoose');

// Mock fallback lists for instant zero-config availability
const mockNGOs = [
  {
    _id: 'ngo_1',
    name: 'MediYatra Charitable Care Foundation',
    focusArea: 'Medicine Donation & Free Medical Equipment Bank',
    city: 'New Delhi',
    maxGrantUSD: 5000,
    supportedCountries: ['Global', 'India', 'SAARC', 'Africa'],
    contactEmail: 'charity@mediyatra.org',
    phone: '+91 11 4000 8888',
    website: 'https://mediyatra.org/charity',
    description: 'Providing essential donated medicines, wheelchairs, and oxygen cylinders to patients in need.',
    isVerifiedByAdmin: true
  },
  {
    _id: 'ngo_2',
    name: 'Healing Hands International Trust',
    focusArea: 'Pediatric Cardiac & Surgical Subsidies',
    city: 'Gurugram',
    maxGrantUSD: 8000,
    supportedCountries: ['India', 'SAARC', 'East Africa'],
    contactEmail: 'aid@healinghands.org',
    phone: '+91 124 455 7788',
    website: 'https://healinghands.org',
    description: 'Subsidizing complex heart surgeries and organ transplants for underprivileged international children.',
    isVerifiedByAdmin: true
  },
  {
    _id: 'ngo_3',
    name: 'Surplus Lifeline Alliance',
    focusArea: 'Wheelchair & Oxygen Cylinder Relief Network',
    city: 'Mumbai',
    maxGrantUSD: 3500,
    supportedCountries: ['India', 'SAARC'],
    contactEmail: 'donations@lifeline.org',
    phone: '+91 22 2600 1122',
    website: 'https://surpluslifeline.org',
    description: 'Collecting surplus wheelchairs, oxygen concentrators, and hospital beds for home recovery.',
    isVerifiedByAdmin: true
  }
];

const mockEquipments = [
  {
    _id: 'eq_1',
    name: 'Lightweight Foldable Wheelchair',
    category: 'Wheelchairs',
    quantity: 4,
    city: 'New Delhi',
    donorName: 'Apollo Hospital Care Trust',
    donorEmail: 'hospital@mediyatra.org',
    ngoPartner: 'MediYatra Charitable Care Foundation',
    description: 'Heavy-duty aluminum foldable wheelchair with footrests in mint condition.',
    status: 'Available',
    isApprovedByAdmin: true
  },
  {
    _id: 'eq_2',
    name: '10L Portable Oxygen Concentrator',
    category: 'Oxygen Cylinders',
    quantity: 2,
    city: 'Gurugram',
    donorName: 'Dr. Naresh Trehan',
    donorEmail: 'doctor@mediyatra.org',
    ngoPartner: 'Surplus Lifeline Alliance',
    description: 'Continuous flow 10-liter medical oxygen concentrator with nasal cannula.',
    status: 'Available',
    isApprovedByAdmin: true
  },
  {
    _id: 'eq_3',
    name: 'Surplus Cardiac Medication Bundle (Atorvastatin 20mg)',
    category: 'Medicines',
    quantity: 15,
    city: 'New Delhi',
    donorName: 'Max Hospital Pharmacy',
    donorEmail: 'pharmacy@maxhealthcare.com',
    ngoPartner: 'MediYatra Charitable Care Foundation',
    description: 'Unopened sealed strips of cardiovascular medicine (Expiry 2027).',
    status: 'Available',
    isApprovedByAdmin: true
  },
  {
    _id: 'eq_4',
    name: 'Adjustable Electric ICU Patient Bed',
    category: 'Hospital Beds',
    quantity: 1,
    city: 'Mumbai',
    donorName: 'Fortis Healthcare Foundation',
    donorEmail: 'foundation@fortis.com',
    ngoPartner: 'Healing Hands International Trust',
    description: 'Remote-controlled 3-function hospital bed for home recovery.',
    status: 'Available',
    isApprovedByAdmin: true
  }
];

const mockAidRequests = [];

// @desc    Get verified NGOs
// @route   GET /api/ngo
const getNGOs = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const ngos = await NGO.find({ isVerifiedByAdmin: true }).sort({ createdAt: -1 });
      if (ngos.length > 0) {
        return res.status(200).json({ success: true, count: ngos.length, data: ngos });
      }
    }
    res.status(200).json({ success: true, count: mockNGOs.length, dataSource: 'fallback-cache', data: mockNGOs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get available medical aid / donated equipment
// @route   GET /api/equipment
const getEquipment = async (req, res, next) => {
  try {
    const { category } = req.query;
    if (mongoose.connection.readyState === 1) {
      let filter = { isApprovedByAdmin: true };
      if (category) filter.category = category;
      const list = await Equipment.find(filter).sort({ createdAt: -1 });
      if (list.length > 0) {
        return res.status(200).json({ success: true, count: list.length, data: list });
      }
    }
    let filteredMock = mockEquipments;
    if (category) filteredMock = mockEquipments.filter(e => e.category === category);
    res.status(200).json({ success: true, count: filteredMock.length, dataSource: 'fallback-cache', data: filteredMock });
  } catch (error) {
    next(error);
  }
};

// @desc    Donate surplus medicine or equipment
// @route   POST /api/equipment
const createEquipmentDonation = async (req, res, next) => {
  try {
    const { name, category, quantity, city, donorName, donorEmail, description } = req.body;

    if (!name || !donorEmail) {
      return res.status(400).json({ success: false, error: 'Please provide item name and donor email' });
    }

    const newItem = {
      _id: `eq_${Date.now()}`,
      name,
      category: category || 'Medical Equipment',
      quantity: Number(quantity) || 1,
      city: city || 'New Delhi',
      donorName: donorName || 'Healthcare Donor',
      donorEmail: donorEmail.trim().toLowerCase(),
      ngoPartner: 'MediYatra Charitable Care Foundation',
      description: description || 'Surplus medical aid donation',
      status: 'Available',
      isApprovedByAdmin: true,
      createdAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const created = await Equipment.create(newItem);
        return res.status(201).json({ success: true, message: 'Donation listed successfully!', data: created });
      } catch (e) {
        console.warn('MongoDB Equipment creation fallback:', e.message);
      }
    }

    mockEquipments.unshift(newItem);
    res.status(201).json({ success: true, message: 'Donation listed successfully!', dataSource: 'fallback-cache', data: newItem });
  } catch (error) {
    next(error);
  }
};

// @desc    Patient submits an aid request for free medicine/equipment
// @route   POST /api/ngo/request
const createAidRequest = async (req, res, next) => {
  try {
    const { patientName, patientEmail, patientPhone, city, requestedCategory, requestedItemName, medicalReason } = req.body;

    if (!patientName || !patientEmail || !requestedItemName) {
      return res.status(400).json({ success: false, error: 'Please fill in all required patient fields' });
    }

    const newRequest = {
      _id: `aid_req_${Date.now()}`,
      patientName,
      patientEmail: patientEmail.trim().toLowerCase(),
      patientPhone: patientPhone || '+91 98000 00000',
      city: city || 'New Delhi',
      requestedCategory: requestedCategory || 'Medicines',
      requestedItemName,
      medicalReason: medicalReason || 'Financial hardship aid request',
      status: 'Pending NGO Review',
      ngoNotes: 'Assigned to MediYatra Charitable Care Desk',
      createdAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const created = await AidRequest.create(newRequest);
        return res.status(201).json({ success: true, message: 'Aid request submitted successfully!', data: created });
      } catch (e) {
        console.warn('MongoDB AidRequest creation fallback:', e.message);
      }
    }

    mockAidRequests.unshift(newRequest);
    res.status(201).json({ success: true, message: 'Aid request submitted successfully!', dataSource: 'fallback-cache', data: newRequest });
  } catch (error) {
    next(error);
  }
};

// @desc    NGO / Admin fetches patient aid requests
// @route   GET /api/ngo/requests
const getAidRequests = async (req, res, next) => {
  try {
    const { patientEmail } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (patientEmail) query.patientEmail = patientEmail.trim().toLowerCase();
      const requests = await AidRequest.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: requests.length, data: requests });
    }

    let filtered = mockAidRequests;
    if (patientEmail) {
      filtered = mockAidRequests.filter(r => r.patientEmail === patientEmail.trim().toLowerCase());
    }
    res.status(200).json({ success: true, count: filtered.length, dataSource: 'fallback-cache', data: filtered });
  } catch (error) {
    next(error);
  }
};

// @desc    NGO updates aid request status (e.g. Approved / Dispatched)
// @route   PATCH /api/ngo/requests/:id/status
const updateAidRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, ngoNotes } = req.body;

    if (mongoose.connection.readyState === 1) {
      const updated = await AidRequest.findByIdAndUpdate(
        id,
        { status, ngoNotes },
        { new: true }
      );
      if (updated) {
        return res.status(200).json({ success: true, message: 'Status updated by NGO', data: updated });
      }
    }

    const item = mockAidRequests.find(r => r._id === id);
    if (item) {
      if (status) item.status = status;
      if (ngoNotes) item.ngoNotes = ngoNotes;
      return res.status(200).json({ success: true, message: 'Status updated by NGO', data: item });
    }

    res.status(404).json({ success: false, error: 'Aid Request not found' });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin verifies NGO
// @route   PATCH /api/ngo/:id/verify
const verifyNGOByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const updated = await NGO.findByIdAndUpdate(id, { isVerifiedByAdmin: true }, { new: true });
      if (updated) return res.status(200).json({ success: true, message: 'NGO verified', data: updated });
    }
    const ngo = mockNGOs.find(n => n._id === id);
    if (ngo) ngo.isVerifiedByAdmin = true;
    res.status(200).json({ success: true, message: 'NGO verified', data: ngo || { _id: id } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNGOs,
  getEquipment,
  createEquipmentDonation,
  createAidRequest,
  getAidRequests,
  updateAidRequestStatus,
  verifyNGOByAdmin
};
