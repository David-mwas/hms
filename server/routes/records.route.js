import express from "express";
import {
  createRecord,
  deleteRecord,
  getAllRecords,
  getRecordById,
  getVitalsByPatientId,
} from "../controllers/records.controller.js";
import { patientOrdoctorOnly, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// All records
router.get("/", protect, patientOrdoctorOnly, getAllRecords);

// Single record by record ID
router.get("/:id", protect, patientOrdoctorOnly, getRecordById);

// Get vitals for a patient
router.get(
  "/vitals/:patientId",
  protect,
  patientOrdoctorOnly,
  getVitalsByPatientId
);

// Create a new record
router.post("/", protect, patientOrdoctorOnly, createRecord);
router.delete("/:id", protect, patientOrdoctorOnly, deleteRecord);

export default router;
