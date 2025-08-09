import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  Activity,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { statData } from "./AdminDashboard";
import { api } from "../utils/fetch";

const AnalyticsPage = () => {
  // const [dateRange, setDateRange] = useState("30");
  // const [selectedMetric, setSelectedMetric] = useState("revenue");
  const [stats, setStats] = useState<statData | undefined>(undefined);

  const fetchData = async () => {
    setStats(await api.get("/stats"));
    // setTasks(await api.get("/tasks"));
  };
  useEffect(() => {
    fetchData();
  }, []);

  const kpiData = [
    {
      title: "Total Revenue",
      value: stats?.paymentSum,
      icon: CreditCard,
      color: "bg-green-500",
    },
    {
      title: "Total Patients",
      value: stats?.patientCount,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Appointments",
      value: stats?.appointmentCount,
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      title: "Total Users",
      value: stats?.userCount,
      icon: Activity,
      color: "bg-orange-500",
    },
  ];

  const paymentMethodColor = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6"];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Comprehensive insights into hospital performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select> */}
          {/* <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button> */}
          {/* <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button> */}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {kpi.value}
                </p>
              </div>
              <div className={`${kpi.color} p-3 rounded-lg`}>
                <kpi.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </h3>
            <div className="flex items-center space-x-2">
              <LineChart className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats?.monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `KSh ${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Payment Methods
            </h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={stats?.paymentMethodData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent ?? 0 * 100).toFixed(0)}%`
                }
              >
                {stats?.paymentMethodData.map((entry,index) => (
                  <Cell key={`cell-${index}`} fill={paymentMethodColor[index]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Demographics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Patient Demographics
            </h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.patientDemographics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="male" fill="#3B82F6" name="Male" />
              <Bar dataKey="female" fill="#EC4899" name="Female" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Appointment Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Daily Appointment Trends
            </h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={stats?.appointmentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="appointments"
                stroke="#10B981"
                strokeWidth={3}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Performance Table */}
      {/* <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Department Performance
          </h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View Details
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Department
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Revenue
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Patients
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Satisfaction
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody>
              {departmentPerformance.map((dept, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {dept.department}
                  </td>
                  <td className="py-3 px-4 text-gray-900">
                    KSh {dept.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-gray-900">{dept.patients}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-gray-900">{dept.satisfaction}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(dept.satisfaction / 5) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
};

export default AnalyticsPage;
