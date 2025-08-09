import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  Heart,
  Stethoscope,
  UserPlus,
  Activity,
  User,
} from "lucide-react";

interface SideBarProps {
  isSideBarOpen: boolean;
}
const Sidebar = ({ isSideBarOpen }: SideBarProps) => {
  const { user } = useAuth();

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: UserPlus, label: "Doctors", path: "/admin/doctors" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: CreditCard, label: "Payments", path: "/payments" },
    { icon: Activity, label: "Analytics", path: "/admin/analytics" },
    // { icon: Settings, label: "Settings", path: "/admin/settings" },
    { icon: User, label: "Profile", path: "/admin/profile" },
  ];

  const doctorMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/doctor" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: Users, label: "Patients", path: "/doctor/patients" },
    { icon: FileText, label: "Records", path: "/doctor/records" },
    {
      icon: Stethoscope,
      label: "Prescriptions",
      path: "/doctor/prescriptions",
    },
    { icon: Settings, label: "Profile", path: "/doctor/profile" },
  ];

  const patientMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/patient" },
    { icon: Calendar, label: "Appointments", path: "/appointments" },
    { icon: FileText, label: "Medical Records", path: "/patient/records" },
    { icon: CreditCard, label: "Payments", path: "/payments" },
    { icon: Users, label: "Doctors", path: "/patient/doctors" },
    { icon: Settings, label: "Profile", path: "/patient/profile" },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case "admin":
        return adminMenuItems;
      case "doctor":
        return doctorMenuItems;
      case "patient":
        return patientMenuItems;
      default:
        return [];
    }
  };

  return (
    <>
      <div
        className={`bg-white w-64 shadow-lg h-full flex flex-col fixed md:static z-[999] md:z-0 duration-300 transition-all ease-in-out ${
          !isSideBarOpen ? "left-[-100%]" : "left-0"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MediCare</h1>
              <p className="text-xs text-gray-600 capitalize">
                {user?.role} Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {getMenuItems().map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            {user?.avatar ? (
              <img
                src={
                  user?.avatar ||
                  "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                }
                alt={user?.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <p className="h-8 w-8 rounded-full bg-gray-400 text-white text-center flex justify-center items-center font-semibold">
                {user?.name.slice(0, 2)}
              </p>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
