import React, { useEffect, useState } from "react";
import {
  User,
  Search,
  Filter,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  Users,
  MessageCircle,
  Trash,
  Plus,
} from "lucide-react";

import { api } from "../utils/fetch";
import { User as U } from "../types/user";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<U | null>(null);
  const [doctors, setDoctors] = useState<U[]>([]);

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [profile, setProfile] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    department: "",
    // Security
    role: "doctor",

    password: "",
    confirmPassword: "",
  });

  const { user } = useAuth();
  const handleInputChange = (field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const fetchDoctors = async () => {
    setDoctors(await api.get("/users?role=doctor"));
  };
  useEffect(() => {
    fetchDoctors();
  }, []);

  const specialties = [
    { value: "all", label: "All Specialties" },
    { value: "cardiology", label: "Cardiology" },
    { value: "general-medicine", label: "General Medicine" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "neurology", label: "Neurology" },
  ];

  const handleDeleteDoctor = async (doctor: U) => {
    setLoading(true);
    const data = prompt(
      "To delete Doctor " +
        doctor.name +
        " Type: I want to delete doctor " +
        doctor.name
    );
    const str = "I want to delete doctor " + doctor.name;
    if (!data) {
      toast.error("You never typed anything: " + str);
      setLoading(false);
      return;
    }

    try {
      if (data?.toLocaleLowerCase() == str?.toLocaleLowerCase()) {
        await api.delete(`/users/${doctor?._id}`, "Doctor");
        fetchDoctors();
      } else {
        toast.error("Wrong!! " + str);
        return;
      }
    } catch (error) {
      console.error(error);
      // toast.error("Failed to delete doctor");
    } finally {
      setLoading(false);
    }
  };
  console.log(profile);
  const handleCreateDoctor = async (e: React.FormEvent) => {
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
          fetchDoctors();
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
        department: "",
        // Security
        role: "doctor",
        password: "",
        confirmPassword: "",
      });
      setShowAddModal(false);
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "all" ||
      doctor?.department?.toLowerCase().replace(" ", "-") === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Our Doctors</h2>
          <p className="text-gray-600">
            Find and connect with our experienced medical professionals
          </p>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Doctor</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {specialties.map((specialty) => (
            <option key={specialty.value} value={specialty.value}>
              {specialty.label}
            </option>
          ))}
        </select>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          <span>More Filters</span>
        </button>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor._id}
            className="bg-white rounded-xl shadow-sm p-6 card-hover"
          >
            <div className="flex items-start space-x-4 mb-4">
              {doctor?.avatar ? (
                <img
                  src={
                    doctor?.avatar ||
                    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                  }
                  alt={doctor?.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <p className="h-8 w-8 rounded-full bg-gray-400 text-white text-center flex justify-center items-center font-semibold">
                  {doctor?.name.slice(0, 2)}
                </p>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {doctor.name}
                </h3>
                <p className="text-blue-600 font-medium">{doctor.department}</p>
                {/* <div className="flex items-center space-x-1 mt-1">
                  {renderStars(doctor.rating)}
                  <span className="text-sm text-gray-600 ml-1">({doctor.rating})</span>
                </div> */}
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Award className="h-4 w-4" />
                <span>{doctor?.experience} years experience</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{doctor?.patients} patients treated</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{doctor.address}</span>
              </div>
              {/* <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Next available: {doctor.nextAvailable}</span>
              </div> */}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Consultation Fee</p>
                <p className="text-lg font-bold text-gray-900">
                  KSh {doctor?.consultationFee?.toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                {/* <button
                  onClick={() => setSelectedDoctor(doctor)}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Calendar className="h-4 w-4" />
                  <span>Book</span>
                </button> */}
                {user?.role === "admin" && (
                  <button
                    className="flex-1 flex items-center justify-center space-x-1 bg-red-200 text-gray-800 hover:text-white py-2 px-3 rounded-lg hover:bg-red-500 transition-colors text-sm"
                    disabled={loading}
                    onClick={() => handleDeleteDoctor(doctor)}
                  >
                    <Trash className="h-4 w-4" />
                    <span>{loading ? "Deleting" : "Delete"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Doctor Details
                </h3>
                <button
                  onClick={() => setSelectedDoctor(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Doctor Info */}
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <img
                    src={selectedDoctor.avatar}
                    alt={selectedDoctor.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-900">
                      {selectedDoctor.name}
                    </h4>
                    <p className="text-blue-600 font-medium text-lg">
                      {selectedDoctor.specialty}
                    </p>
                    <div className="flex items-center space-x-1 mt-2">
                      {renderStars(selectedDoctor.rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        ({selectedDoctor.rating})
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>{selectedDoctor.experience} years experience</span>
                      <span>•</span>
                      <span>{selectedDoctor.doctors} doctors</span>
                    </div>
                  </div>
                </div>

                {/* About */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">About</h4>
                  <p className="text-gray-700">{selectedDoctor.about}</p>
                </div>

                {/* Qualifications */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Qualifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.qualifications.map((qual, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact & Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      Contact Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-600" />
                        <span>{selectedDoctor.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-600" />
                        <span>{selectedDoctor.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-600" />
                        <span>{selectedDoctor.location}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Schedule</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span>{selectedDoctor.workingHours}</span>
                      </div>
                      <div className="text-sm">
                        <p className="text-gray-600 mb-1">
                          Available slots today:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedDoctor.availableSlots.map((slot, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                            >
                              {slot}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Consultation Fee
                      </p>
                      <p className="text-sm text-gray-600">Per session</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      KSh {selectedDoctor.consultationFee.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    <MessageCircle className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Calendar className="h-4 w-4" />
                    <span>Book Appointment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* doctor modal */}
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
              <form className="space-y-6" onSubmit={handleCreateDoctor}>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={profile.department}
                      onChange={(e) =>
                        handleInputChange("department", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="General Medicine">General Medicine</option>
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
                    Add Doctor
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

export default Doctors;
