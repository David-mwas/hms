import express from "express";
import {
  createPrescription,
  deletePrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
} from "../controllers/prescription.controller.js";
const router = express.Router();
import {
  adminOnly,
  adminOrdoctorOnly,
  doctorOnly,
  protect,
} from "../middleware/authMiddleware.js";

router.get("/", protect, doctorOnly, getAllPrescriptions);
router.get("/:id", protect, doctorOnly, getPrescriptionById);
router.post("/", protect, doctorOnly, createPrescription);
router.put("/:id", protect, doctorOnly, updatePrescription);
router.delete("/:id", protect, doctorOnly, deletePrescription);

export default router;
