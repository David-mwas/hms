import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Stethoscope,
} from "lucide-react";
import PrescriptionsPage from "./PrescriptionPage";
import ProfilePage from "./ProfilePage";
import MedicalRecords from "./MedicalRecords";
import Patients from "./Patients";
import { api } from "../utils/fetch";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
// import { User } from "../types/user";

type Stats = {
  todayAppointments: number;
  patientsSeen: number;
  pendingReviews: number;
  prescriptions: number;
  todaySchedule: [];
  recentPatients: [];
};

type Appointment = {
  id: string;
  patient: string;
  type: string;
  time: string;
  status: string;
};

type userData = {
  id: string;
  name: string;
  // condition: "Mock condition", // Replace if you have a health record model
  avatar?: string;
  lastVisit: string;
};
const DoctorOverview = () => {
  const [stats, setStats] = useState<Stats | undefined>(undefined);

  const fetchData = async () => {
    setStats(await api.get(`/stats/doctor`));
    // setTasks(await api.get("/tasks"));
  };
  useEffect(() => {
    fetchData();
  }, []);
  const todayStats = [
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      title: "Patients Seen",
      value: stats?.patientsSeen || 0,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingReviews || 0,
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      title: "Prescriptions",
      value: stats?.prescriptions || 0,
      icon: Stethoscope,
      color: "bg-purple-500",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "scheduled":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Today's Schedule
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Calendar
            </button>
          </div>
          <div className="space-y-4">
            {stats?.todaySchedule.length === 0 && (
              <p>No appointment found for today</p>
            )}
            {stats?.todaySchedule.map((appointment: Appointment, index) => (
              <div
                key={appointment.id + index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(appointment.status)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointment.patient}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {appointment?.time?.split("T")[0]}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      appointment.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "pending"
                        ? "bg-blue-100 text-blue-800"
                        : appointment.status === "confirmed"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appointment.status.replace("-", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Patients
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {stats?.recentPatients.length === 0 && (
              <p>No recent patients found</p>
            )}
            {stats?.recentPatients.map((patient: userData, index) => (
              <div
                key={patient.id + index}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {patient.name}
                  </p>
                  {/* <p className="text-xs text-gray-600">{patient.condition}</p> */}
                  <p className="text-xs text-gray-500">
                    Last visit: {patient.lastVisit?.split("T")[0]}
                  </p>
                </div>
                {/* <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    patient.status === "Stable"
                      ? "bg-green-100 text-green-800"
                      : patient.status === "Monitoring"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {patient.status}
                </span> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <FileText className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              New Prescription
            </span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
            <Users className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Add Patient
            </span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
            <Calendar className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Schedule Break
            </span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
            <AlertCircle className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Emergency Notes
            </span>
          </button>
        </div>
      </div> */}
    </div>
  );
};

const DoctorDashboard = () => {
  return (
    <Layout title="Doctor Dashboard">
      <Routes>
        <Route path="/" element={<DoctorOverview />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/records" element={<MedicalRecords />} />
        <Route path="/prescriptions" element={<PrescriptionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Layout>
  );
};

export default DoctorDashboard;
