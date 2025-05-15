import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Install this package with: npm install uuid

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
});

const emergencyContactSchema = new mongoose.Schema({
  name: String,
  relationship: String,
  phone: String
});

const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say']
  },
  contactNumber: {
    type: String
  },
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  address: addressSchema,
  medicalRecordNumber: {
    type: String,
    unique: true,
    default: function() {
      // Generate a format like "MRN-YYYY-XXXXX" where XXXXX is unique
      const year = new Date().getFullYear();
      const uniqueId = Math.floor(10000 + Math.random() * 90000); // 5-digit number
      return `MRN-${year}-${uniqueId}`;
    }
  },
  profileImage: {
    type: String, // Store the image path or URL
    default: '' // Empty string as default (no image)
  },
  emergencyContact: emergencyContactSchema,
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the lastUpdated field on save
patientSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;