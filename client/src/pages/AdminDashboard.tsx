import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import {
  Users,
  Calendar,
  CreditCard,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { api } from "../utils/fetch";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./SettingsPage";
import ProfilePage from "./ProfilePage";
import Doctors from "./Doctors";
import Patients from "./Patients";

type RecentAppointments = {
  createdAt: Date;
  date: Date;
  doctorId: {
    createdAt: Date;
    department: string;
    email: string;
    name: string;
    role: string;
    _id: string;
  };

  patientId: {
    createdAt: Date;
    department: string;
    email: string;
    name: string;
    role: string;
    _id: string;
  };
  reason: string;
  status: string;
  time: string;
  type: string;

  _id: string;
};
export type statData = {
  adminCount: number;
  appointmentCount: number;
  doctorsCount: number;
  patientCount: number;
  paymentSum: number;
  userCount: number;
  recentAppointments: RecentAppointments[];

  paymentMethodData: [];
  patientDemographics: [];
  appointmentTrends: [];
  monthlyRevenueData: [];
  weeklyAppointmentData: [];
  departmentData: [];
};

const AdminOverview = () => {
  const [stats1, setStats] = useState<statData | undefined>(undefined);
  // const [recentAppointments, setRecentAppointments]=useState([]);
  console.log(stats1);
  const stats = [
    {
      title: "Total Patients",
      value: stats1?.patientCount,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Doctors",
      value: stats1?.doctorsCount,
      icon: Activity,
      color: "bg-green-500",
    },
    {
      title: "Total Appointments",
      value: stats1?.appointmentCount,
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      title: "Revenue (This Month)",
      value: `Ksh ${stats1?.paymentSum}`,
      icon: CreditCard,
      color: "bg-orange-500",
    },
  ];

  const departmentColor = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];
  const fetchData = async () => {
    setStats(await api.get("/stats"));
    // setTasks(await api.get("/tasks"));
  };
  useEffect(() => {
    fetchData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Weekly Appointments
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats1?.weeklyAppointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats1?.monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `KSh ${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats1?.departmentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent! * 100)?.toFixed(0)}%`
                }
              >
                {stats1?.departmentData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={departmentColor[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Appointments
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {stats1?.recentAppointments?.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(appointment.status)}
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointment.patientId?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.doctorId?.name} • {appointment.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {appointment.time}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      appointment.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <Layout title="Admin Dashboard">
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/users" element={<Patients />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;
