// controllers/prescriptionController.js
import Prescription from "../models/prescription.model.js";

/**
 * GET /api/prescriptions
 */
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find().sort({ date: -1 }).populate("patientId");
    res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
};

/**
 * GET /api/prescriptions/:id
 */
export const getPrescriptionById = async (req, res) => {
  try {
    const presc = await Prescription.findById(req.params.id);
    if (!presc)
      return res.status(404).json({ message: "Prescription not found" });
    res.json(presc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch prescription" });
  }
};

/**
 * POST /api/prescriptions
 * Body: JSON matching Prescription model
 */
export const createPrescription = async (req, res) => {
  try {
    const payload = req.body;

    // Basic server-side validation
    if (!payload.id) payload.id = `RX-${Date.now()}`;
    if (!payload.patientId) {
      return res.status(400).json({ message: "Patient required" });
    }

    // Normalize date fields
    if (payload.date) payload.date = new Date(payload.date);
    if (payload.nextRefill) payload.nextRefill = new Date(payload.nextRefill);
    if (payload.validUntil) payload.validUntil = new Date(payload.validUntil);

    const created = await Prescription.create(payload);
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: err.message || "Failed to create prescription" });
  }
};

/**
 * PUT /api/prescriptions/:id
 * Update a prescription
 */
export const updatePrescription = async (req, res) => {
  try {
    const updated = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Prescription not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Failed to update" });
  }
};

/**
 * DELETE /api/prescriptions/:id
 */
export const deletePrescription = async (req, res) => {
  try {
    const deleted = await Prescription.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Prescription not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete" });
  }
};
