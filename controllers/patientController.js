import asyncHandler from '../utils/asyncHandler.js';
import Patient from '../models/patient.js';

// @desc    Get all patients with pagination
// @route   GET /api/patients
// @access  Public
const getPatients = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skipIndex = (page - 1) * limit;
  
  const patients = await Patient.find()
    .sort({ lastUpdated: -1 })
    .limit(limit)
    .skip(skipIndex);
    
  const total = await Patient.countDocuments();
  
  res.json({
    success: true,
    count: patients.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    data: patients
  });
});

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Public
const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }
  
  res.json({
    success: true,
    data: patient
  });
});

// @desc    Create new patient
// @route   POST /api/patients
// @access  Public
// @desc Create new patient
// @route POST /api/patients
// @access Public
const createPatient = asyncHandler(async (req, res) => {
  console.log("Request body received:", req.body);
  console.log("Request file received:", req.file);
  
  // Create a clean patient data object
  const patientData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    contactNumber: req.body.contactNumber,
    email: req.body.email
  };
  
  // Parse address JSON if exists
  if (req.body.address) {
    try {
      patientData.address = JSON.parse(req.body.address);
    } catch (err) {
      console.error("Error parsing address:", err);
    }
  }
  
  // Parse emergency contact JSON if exists
  if (req.body.emergencyContact) {
    try {
      patientData.emergencyContact = JSON.parse(req.body.emergencyContact);
    } catch (err) {
      console.error("Error parsing emergencyContact:", err);
    }
  }
  
  // Add file path if file was uploaded
  if (req.file) {
    patientData.profileImage = `/uploads/${req.file.filename}`;
    console.log("Setting profileImage to:", patientData.profileImage);
  } else {
    console.log("No file uploaded");
  }
  
  console.log("Final patientData for creation:", patientData);
  
  try {
    const patient = await Patient.create(patientData);
    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (err) {
    console.error("Error creating patient:", err);
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Public
const updatePatient = asyncHandler(async (req, res) => {
  let patient = await Patient.findById(req.params.id);
  
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }
  
  // Handle nested objects that were sent as strings
  if (req.body.address && typeof req.body.address === 'string') {
    try {
      req.body.address = JSON.parse(req.body.address);
    } catch (error) {
      // If parsing fails, handle appropriately
      console.error('Error parsing address:', error);
    }
  }
  
  if (req.body.emergencyContact && typeof req.body.emergencyContact === 'string') {
    try {
      req.body.emergencyContact = JSON.parse(req.body.emergencyContact);
    } catch (error) {
      // If parsing fails, handle appropriately
      console.error('Error parsing emergencyContact:', error);
    }
  }
  
  // Handle file upload if present
  if (req.file) {
    req.body.profileImage = `/uploads/${req.file.filename}`;
  }
  
  // Update the lastUpdated field
  req.body.lastUpdated = Date.now();
  
  patient = await Patient.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json({
    success: true,
    data: patient
  });
});
// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Public
const deletePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  
  if (!patient) {
    res.status(404);
    throw new Error('Patient not found');
  }
  
  await patient.deleteOne();
  
  res.json({
    success: true,
    data: {}
  });
});

// @desc    Search patients
// @route   GET /api/patients/search
// @access  Public
const searchPatients = asyncHandler(async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    res.status(400);
    throw new Error('Please provide a search query');
  }
  
  // Implement pagination for search results, similar to getPatients
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skipIndex = (page - 1) * limit;
  
  // Build search criteria
  const searchCriteria = {
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { medicalRecordNumber: { $regex: query, $options: 'i' } }
    ]
  };
  
  // Execute search with pagination
  const patients = await Patient.find(searchCriteria)
    .sort({ lastUpdated: -1 })
    .limit(limit)
    .skip(skipIndex);
  
  // Get total count for pagination info
  const total = await Patient.countDocuments(searchCriteria);
  
  // Return data with pagination info
  res.json({
    success: true,
    count: patients.length,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    data: patients
  });
});

export {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients
};