import MedicalRecord from "../models/medicalrecords.model.js";

// Get all medical records
export const getAllRecords = async (req, res) => {
  const user = req.user;

  // Apply filters if doctor/patient
  const matchFilter = {};
  if (user.role === "doctor") matchFilter.doctorId = user._id;
  if (user.role === "patient") matchFilter.patientId = user._id;
  try {
    const records = await MedicalRecord.find(matchFilter).populate(
      "doctorId patientId"
    );
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single record
export const getRecordById = async (req, res) => {
  const user = req.user;

  // Apply filters if doctor/patient
  const matchFilter = {};
  if (user.role === "doctor") matchFilter.doctorId = user._id;
  if (user.role === "patient") matchFilter.patientId = user._id;
  try {
    const record = await MedicalRecord.findOne({
      ...matchFilter,
      id: req.params.id,
    });
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get only vitals for a patient
export const getVitalsByPatientId = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const records = await MedicalRecord.find(
      { patientId },
      {
        vitalSigns: 1,
        _id: 0,
        date: 1,
        id: 1,
      }
    );
    res.json(records);
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message });
  }
};

// Create a record
export const createRecord = async (req, res) => {
  console.log(req.body);
  try {
    const record = new MedicalRecord(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const deleted = await MedicalRecord.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete" });
  }
};
