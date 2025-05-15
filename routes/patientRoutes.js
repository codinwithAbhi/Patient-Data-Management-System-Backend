import express from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients
} from '../controllers/patientController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();


router.get('/search', searchPatients);
router.get('/', getPatients);
// Apply the upload middleware to the createPatient route
router.post('/', upload.single('profileImage'), createPatient);
router.get('/:id', getPatientById);
// Also allow image upload during updates
router.put('/:id', upload.single('profileImage'), updatePatient);
router.delete('/:id', deletePatient);

export default router;