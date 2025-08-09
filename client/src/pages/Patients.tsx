import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Heart,
  Clock,
  FileText,
  Trash,
} from "lucide-react";
import { api } from "../utils/fetch";
import { User as U } from "../types/user";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

interface Patient {
  _id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string[];
  allergies: string[];
  lastVisit: string;
  nextAppointment: string;
  status: "Active" | "Inactive";
  avatar: string;
  registrationDate: string;
  insurance: string;
  primaryDoctor: string;
}

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [patients, setPatients] = useState<U[]>([]);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    bloodGroup: "",
    // Security

    password: "",
    confirmPassword: "",
  });
  const handleInputChange = (field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const { user } = useAuth();
  const fetchPatients = async () => {
    setPatients(await api.get("/users?role=patient"));
  };
  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.phone?.includes(searchTerm);
    const matchesFilter = filterStatus === "All";
    return matchesSearch && matchesFilter;
  });

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    if (birthDate === null || birthDate === undefined || birthDate === "") {
      age = 0;
    }
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleDeletePatient = async (patient: U) => {
    setLoading(true);
    const data = prompt(
      "To delete Patient " +
        patient.name +
        " Type: I want to delete patient " +
        patient.name
    );
    const str = "I want to delete patient " + patient.name;
    if (!data) {
      toast.error("You never typed anything: " + str);
      setLoading(false);
      return;
    }

    try {
      if (data?.toLocaleLowerCase() == str?.toLocaleLowerCase()) {
        await api.delete(`/users/${patient?._id}`, "Patient");
        fetchPatients();
      } else {
        toast.error("Wrong!! " + str);
        return;
      }
    } catch (error) {
      console.error(error);
      // toast.error("Failed to delete patient");
    } finally {
      setLoading(false);
    }
  };
  console.log(profile);
  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (profile && profile?.password !== profile?.confirmPassword) {
      toast.error("passwords do not match");
      return;
    }

    try {
      const data = await toast.promise(
        fetch(`${import.meta.env.VITE_BASE_URL}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        }).then(async (res) => {
          if (!res.ok) {
            const { message } = await res.json();
            throw new Error(message || "Registeration failed");
          }
          fetchPatients();
          return res.json();
        }),
        {
          loading: "Registering...",
          success: "Registered successful",
          error: (err) =>
            typeof err === "string"
              ? err
              : err?.message || "Registration failed",
        }
      );
      console.log(data);
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setProfile({
        // Personal Information
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        bloodGroup: "",
        // Security

        password: "",
        confirmPassword: "",
      });
      setShowAddModal(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">
            Manage patient records and information
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div> */}
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div
            key={patient._id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {patient?.avatar ? (
                  <img
                    src={
                      patient?.avatar ||
                      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                    }
                    alt={patient?.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <p className="h-8 w-8 rounded-full bg-gray-400 text-white text-center flex justify-center items-center font-semibold">
                    {patient?.name.slice(0, 2)}
                  </p>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {patient.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {calculateAge(patient.dateOfBirth)} years • {patient.gender}
                  </p>
                </div>
              </div>
              {/* <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  patient.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {patient.status}
              </span> */}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {patient.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {patient.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Heart className="h-4 w-4 mr-2" />
                Blood Group: {patient.bloodGroup}
              </div>
              {/* <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Last Visit: {patient?.lastVisit}
              </div> */}
            </div>

            {/* {patient?.allergies?.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center text-sm text-orange-600 mb-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Allergies
                </div>
                <div className="flex flex-wrap gap-1">
                  {patient?.allergies?.map((allergy, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )} */}

            <div className="flex space-x-2">
              {/* <button
                onClick={() => handleViewPatient(patient)}
                className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm"
              >
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button> */}
              {user?.role === "admin" && (
                <button
                  className="flex-1 flex items-center justify-center space-x-1 bg-red-200 text-gray-800 hover:text-white py-2 px-3 rounded-lg hover:bg-red-500 transition-colors text-sm"
                  disabled={loading}
                  onClick={() => handleDeletePatient(patient)}
                >
                  <Trash className="h-4 w-4" />
                  <span>{loading ? "Deleting" : "Delete"}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No patients found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or add a new patient.
          </p>
        </div>
      )}

      {/* Patient Detail Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedPatient.avatar}
                    alt={selectedPatient.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedPatient.name}
                    </h2>
                    <p className="text-gray-600">
                      {selectedPatient.age} years • {selectedPatient.gender}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {selectedPatient.phone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {selectedPatient.email}
                      </span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <span className="text-gray-900">
                        {selectedPatient.address}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Medical Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="text-gray-900">
                        Blood Group: {selectedPatient.bloodGroup}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        Primary Doctor: {selectedPatient.primaryDoctor}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        Insurance: {selectedPatient.insurance}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Emergency Contact
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {selectedPatient.emergencyContact}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {selectedPatient.emergencyPhone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appointments */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Appointments
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        Last Visit: {selectedPatient.lastVisit}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-900">
                        Next Appointment: {selectedPatient.nextAppointment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              {selectedPatient.medicalHistory.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Medical History
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.medicalHistory.map((condition, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergies */}
              {selectedPatient.allergies.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Allergies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Add New Patient
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              <form className="space-y-6" onSubmit={handleCreatePatient}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date Of Birth
                    </label>
                    <input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange("dateOfBirth", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={profile.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.bloodGroup}
                      onChange={(e) =>
                        handleInputChange("bloodGroup", e.target.value)
                      }
                    >
                      <option value="">Select blood group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      value={profile.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+254 7xxxxxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.email}
                      required
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="patient@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    rows={3}
                    value={profile.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    placeholder="Enter full address"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      value={profile.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Enter password..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      placeholder="Enter confirm password..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
