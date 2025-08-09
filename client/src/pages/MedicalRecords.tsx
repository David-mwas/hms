// MedicalRecords.jsx
import { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  User,
  Activity,
  Pill,
  TestTube,
  Eye,
  Download,
  Edit,
  Trash2,
} from "lucide-react";
import { User as U } from "../types/user";
import { api } from "../utils/fetch";
import { useAuth } from "../contexts/AuthContext";

// Base API URL (can set REACT_APP_API_BASE in .env)
const API_BASE =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1";
const RECORDS_ENDPOINT = `${API_BASE}/medical-records`;

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = useState<U[]>();
  const [patients, setPatients] = useState<U[]>();

  const { user } = useAuth();

  // form state for new record (controlled form)
  const [form, setForm] = useState({
    patientId: "",
    type: "Consultation",
    date: "", // YYYY-MM-DD
    doctorId: "",
    department: "",
    diagnosis: "",
    symptoms: "", // comma separated
    // vitals
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    height: "",
    // single medication input (we convert to array on submit if provided)
    medName: "",
    medDosage: "",
    medFrequency: "",
    medDuration: "",
    // single lab test input (optional)
    labTestName: "",
    labTestResult: "",
    labTestNormalRange: "",
    labTestStatus: "",
    notes: "",
    followUp: "",
    status: "completed",
  });

  const recordTypes = [
    { value: "all", label: "All Records" },
    { value: "consultation", label: "Consultations" },
    { value: "lab-test", label: "Lab Tests" },
    { value: "surgery", label: "Surgeries" },
    { value: "prescription", label: "Prescriptions" },
    { value: "imaging", label: "Imaging" },
  ];

  useEffect(() => {
    fetchUsers();
    fetchRecords();
  }, []);

  const fetchUsers = async () => {
    const doctor = await api.get("/users?role=doctor");
    const patient = await api.get("/users?role=patient");
    setDoctors(doctor);
    setPatients(patient);
  };

  async function fetchRecords() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/medical-records");
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load records");
    } finally {
      setLoading(false);
    }
  }

  const getTypeIcon = (type) => {
    if (!type) return <FileText className="h-4 w-4" />;
    switch (type.toLowerCase()) {
      case "consultation":
        return <User className="h-4 w-4" />;
      case "lab test":
        return <TestTube className="h-4 w-4" />;
      case "surgery":
        return <Activity className="h-4 w-4" />;
      case "prescription":
        return <Pill className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    if (!type) return "bg-gray-100 text-gray-800";
    switch (type.toLowerCase()) {
      case "consultation":
        return "bg-blue-100 text-blue-800";
      case "lab test":
        return "bg-green-100 text-green-800";
      case "surgery":
        return "bg-red-100 text-red-800";
      case "prescription":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLabTestStatus = (status) => {
    switch ((status || "").toLowerCase()) {
      case "normal":
        return "text-green-600";
      case "high":
        return "text-red-600";
      case "low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  // Filter + search applied to fetched records
  const filteredRecords = records.filter((record) => {
    // filterType
    if (
      filterType !== "all" &&
      record.type.toLowerCase().replace(" ", "-") !== filterType
    ) {
      return false;
    }

    // search
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    const fields = [
      record.id,
      record.patient?.name,
      record.patient?.id,
      record.doctor,
      record.diagnosis,
      record.type,
    ]
      .filter(Boolean)
      .map((s) => String(s).toLowerCase())
      .join(" ");

    return fields.includes(q);
  });

  // helper that updates form fields
  const handleFormChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // create a new record from the form state and POST to API
  const handleCreateRecord = async () => {
    // Basic validation (you can expand)
    if (!form.patientId || !form.type || !form.date) {
      alert("Please fill patient name, patient id, record type and date.");
      return;
    }

    // Build payload matching your backend model
    const payload = {
      // create a client-side ID (server may override)
      id: `MR-${Date.now()}`,
      date: form.date,
      type: form.type,
      patientId: form.patientId,
      doctorId: form.doctorId,
      department: form.department,
      diagnosis: form.diagnosis,
      symptoms:
        form.symptoms
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean) || [],
      vitalSigns: {
        bloodPressure: form.bloodPressure,
        heartRate: form.heartRate,
        temperature: form.temperature,
        weight: form.weight,
        height: form.height,
      },
      medications: form.medName
        ? [
            {
              name: form.medName,
              dosage: form.medDosage,
              frequency: form.medFrequency,
              duration: form.medDuration,
            },
          ]
        : [],
      labTests: form.labTestName
        ? [
            {
              test: form.labTestName,
              result: form.labTestResult,
              normalRange: form.labTestNormalRange,
              status: form.labTestStatus,
            },
          ]
        : [],
      notes: form.notes,
      followUp: form.followUp,
      status: form.status,
    };

    try {
      setLoading(true);
      const res = api.post("/medical-records", payload, "Medical Record");

      // if (!res.ok) {
      //   const errText = await res.text();
      //   throw new Error(
      //     `Failed to create record (${res.status}) - ${
      //       errText || res.statusText
      //     }`
      //   );
      // }

      // const created = await res.json();
      // refresh the list (server is source of truth)
      await fetchRecords();

      // clear form and close modal
      setForm({
        patientId: "",
        type: "Consultation",
        date: "",
        doctorId: "",
        department: "",
        diagnosis: "",
        symptoms: "",
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        weight: "",
        height: "",
        medName: "",
        medDosage: "",
        medFrequency: "",
        medDuration: "",
        labTestName: "",
        labTestResult: "",
        labTestNormalRange: "",
        labTestStatus: "",
        notes: "",
        followUp: "",
        status: "completed",
      });
      setShowNewRecord(false);
      alert("Record created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create record: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Optional: delete record if backend supports DELETE /:id
  const handleDelete = async (id) => {
    if (!confirm("Delete this record?")) return;
    try {
      setLoading(true);
      const res = api.delete(
        `/medical-records/${encodeURIComponent(id)}`,
        "Medical record"
      );
      await fetchRecords();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Records</h2>
          <p className="text-gray-600">
            Comprehensive patient medical history and records
          </p>
        </div>
        {user?.role === "doctor" && (
          <button
            onClick={() => setShowNewRecord(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span>New Record</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search medical records..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {recordTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          <span>More Filters</span>
        </button>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">Loading...</div>
          ) : error ? (
            <div className="p-6 text-red-600">Error: {error}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Record ID
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Patient
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Doctor
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Diagnosis
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6 font-medium text-blue-600">
                      {record.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {record.patientId?.avatar ? (
                          <img
                            src={
                              record.patientId?.avatar ||
                              "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                            }
                            alt={record.patientId?.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <p className="h-8 w-8 rounded-full bg-gray-400 text-white text-center flex justify-center items-center font-semibold">
                            {record.patientId?.name.slice(0, 2)}
                          </p>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {record.patientId?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {record.patientId?._id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {record.date
                        ? new Date(record.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(record.type)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            record.type
                          )}`}
                        >
                          {record.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {record.doctorId.name}
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {record.diagnosis}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alert("Edit not implemented")}
                          className="text-gray-600 hover:text-gray-800"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            alert("Download (implement server PDF endpoint)")
                          }
                          className="text-green-600 hover:text-green-800"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* New Record Modal */}
      {showNewRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  New Medical Record
                </h3>
                <button
                  onClick={() => setShowNewRecord(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateRecord();
                }}
              >
                <div className="grid grid-cols-1  gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Choose a Patient
                    </label>

                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.patientId}
                      onChange={handleFormChange("patientId")}
                    >
                      <option value="">Choose a Patient</option>
                      {patients?.map((patient: U) => (
                        <option key={patient._id} value={patient._id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Record Type
                    </label>
                    <select
                      value={form.type}
                      onChange={handleFormChange("type")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Consultation</option>
                      <option>Lab Test</option>
                      <option>Surgery</option>
                      <option>Prescription</option>
                      <option>Imaging</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      value={form.date}
                      onChange={handleFormChange("date")}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      choose a Doctor
                    </label>

                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.doctorId}
                      onChange={handleFormChange("doctorId")}
                    >
                      <option value="">Choose a patient</option>
                      {doctors?.map((doctor: U) => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.name} - {doctor.department}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>

                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.department}
                      onChange={handleFormChange("department")}
                    >
                      <option>Cardiology</option>
                      <option>Neurology</option>
                      <option>Orthopedics</option>
                      <option>Pediatrics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diagnosis
                    </label>
                    <input
                      value={form.diagnosis}
                      onChange={handleFormChange("diagnosis")}
                      placeholder="Enter diagnosis"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms (comma separated)
                  </label>
                  <textarea
                    value={form.symptoms}
                    onChange={handleFormChange("symptoms")}
                    rows={2}
                    placeholder="Headache, Dizziness"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Vital Signs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Vital Signs
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Blood Pressure
                      </label>
                      <input
                        value={form.bloodPressure}
                        onChange={handleFormChange("bloodPressure")}
                        placeholder="120/80"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Heart Rate
                      </label>
                      <input
                        value={form.heartRate}
                        onChange={handleFormChange("heartRate")}
                        placeholder="72"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Temperature
                      </label>
                      <input
                        value={form.temperature}
                        onChange={handleFormChange("temperature")}
                        placeholder="98.6"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        value={form.weight}
                        onChange={handleFormChange("weight")}
                        placeholder="70"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Height (cm)
                      </label>
                      <input
                        value={form.height}
                        onChange={handleFormChange("height")}
                        placeholder="165"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Medication & Lab quick inputs (optional single entries) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medication (optional)
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        value={form.medName}
                        onChange={handleFormChange("medName")}
                        placeholder="Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={form.medDosage}
                          onChange={handleFormChange("medDosage")}
                          placeholder="Dosage (e.g. 5mg)"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          value={form.medFrequency}
                          onChange={handleFormChange("medFrequency")}
                          placeholder="Frequency"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          value={form.medDuration}
                          onChange={handleFormChange("medDuration")}
                          placeholder="Duration"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lab Test (optional)
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        value={form.labTestName}
                        onChange={handleFormChange("labTestName")}
                        placeholder="Test name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          value={form.labTestResult}
                          onChange={handleFormChange("labTestResult")}
                          placeholder="Result"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          value={form.labTestNormalRange}
                          onChange={handleFormChange("labTestNormalRange")}
                          placeholder="Normal range"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                          value={form.labTestStatus}
                          onChange={handleFormChange("labTestStatus")}
                          placeholder="Status (normal/high/low)"
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinical Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={handleFormChange("notes")}
                    rows={4}
                    placeholder="Enter detailed clinical notes and observations"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Follow-up Date
                    </label>
                    <input
                      value={form.followUp}
                      onChange={handleFormChange("followUp")}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={handleFormChange("status")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>completed</option>
                      <option>in progress</option>
                      <option>pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewRecord(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {loading ? "Creating..." : "Create Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Medical Record Details
                </h3>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Patient Info */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  {selectedRecord.patientId?.avatar ? (
                    <img
                      src={
                        selectedRecord.patientId?.avatar ||
                        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                      }
                      alt={selectedRecord.patientId?.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <p className="h-8 w-8 rounded-full bg-gray-400 text-white text-center flex justify-center items-center font-semibold">
                      {selectedRecord.patientId?.name.slice(0, 2)}
                    </p>
                  )}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {selectedRecord.patientId?.name}
                    </h4>
                    <p className="text-gray-600">
                      Patient ID: {selectedRecord.patientId?._id}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTypeIcon(selectedRecord.type)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          selectedRecord.type
                        )}`}
                      >
                        {selectedRecord.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Record ID
                    </p>
                    <p className="text-gray-900">{selectedRecord.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date</p>
                    <p className="text-gray-900">
                      {selectedRecord.date
                        ? new Date(selectedRecord.date).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Doctor</p>
                    <p className="text-gray-900">
                      {selectedRecord.doctorId.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Department
                    </p>
                    <p className="text-gray-900">{selectedRecord.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Diagnosis
                    </p>
                    <p className="text-gray-900">{selectedRecord.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Follow-up
                    </p>
                    <p className="text-gray-900">
                      {selectedRecord.followUp
                        ? new Date(selectedRecord.followUp).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* Symptoms */}
                {selectedRecord.symptoms?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Symptoms</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vital Signs */}
                {selectedRecord.vitalSigns &&
                  Object.keys(selectedRecord.vitalSigns).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Vital Signs
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(selectedRecord.vitalSigns).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="p-3 bg-blue-50 rounded-lg"
                            >
                              <p className="text-xs text-blue-600 font-medium capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </p>
                              <p className="text-lg font-semibold text-blue-900">
                                {value || "-"}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Medications */}
                {selectedRecord.medications?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Medications
                    </h4>
                    <div className="space-y-3">
                      {selectedRecord.medications.map((med, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">
                              {med.name}
                            </h5>
                            <span className="text-sm text-gray-600">
                              {med.dosage}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Frequency: </span>
                              <span className="text-gray-900">
                                {med.frequency}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Duration: </span>
                              <span className="text-gray-900">
                                {med.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lab Tests */}
                {selectedRecord.labTests?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Lab Test Results
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left py-2 px-4 font-medium text-gray-700">
                              Test
                            </th>
                            <th className="text-left py-2 px-4 font-medium text-gray-700">
                              Result
                            </th>
                            <th className="text-left py-2 px-4 font-medium text-gray-700">
                              Normal Range
                            </th>
                            <th className="text-left py-2 px-4 font-medium text-gray-700">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRecord.labTests.map((test, index) => (
                            <tr
                              key={index}
                              className="border-t border-gray-200"
                            >
                              <td className="py-2 px-4 font-medium">
                                {test.test}
                              </td>
                              <td className="py-2 px-4">{test.result}</td>
                              <td className="py-2 px-4 text-gray-600">
                                {test.normalRange}
                              </td>
                              <td className="py-2 px-4">
                                <span
                                  className={`font-medium capitalize ${getLabTestStatus(
                                    test.status
                                  )}`}
                                >
                                  {test.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Clinical Notes */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Clinical Notes
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{selectedRecord.notes}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Edit Record
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
