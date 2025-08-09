import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, Save, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/fetch";
import { User as U } from "../types/user";

const ProfilePage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);

  console.log(user?.address);
  const [profile, setProfile] = useState({
    // Personal Information
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth?.split("T")[0] || "",
    gender: user?.gender || "",
    address: user?.address || "",

    // Professional Information (for doctors)
    specialization: user?.department || "",
    licenseNumber: user?.licenseNumber,
    experience: user?.experience,
    qualifications: user?.qualifications,
    department: user?.department,
    patients: user?.patients || "",

    // Security
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // Preferences
    language: "en",
    timezone: "Africa/Nairobi",
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
  });

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "professional", label: "Professional", icon: Shield },
    // { id: "security", label: "Security", icon: Shield },
    // { id: "preferences", label: "Preferences", icon: Globe },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      console.log(profile);
      await api.put(`/users/${user?._id}`, profile, "Profile");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const handleNestedInputChange = (
  //   section: string,
  //   field: string,
  //   value: any
  // ) => {
  //   setProfile((prev) => ({
  //     ...prev,
  //     [section]: {
  //       ...prev[section],
  //       [field]: value,
  //     },
  //   }));
  // };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
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
          {/* <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
            <Camera className="h-4 w-4" />
          </button> */}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{user?.name}</h3>
          <p className="text-gray-600 capitalize">{user?.role}</p>
          {/* <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium">
            Change Photo
          </button> */}
        </div>
      </div>

      {/* Personal Details */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={() => {}}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profile?.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={profile.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={profile.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          value={profile.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={profile.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            value={profile.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Kenya">Kenya</option>
            <option value="Uganda">Uganda</option>
            <option value="Tanzania">Tanzania</option>
          </select>
        </div>
      </div> */}
    </div>
  );
  // consultationFee: { type: String, default: 0 },
  //   patients: { type: Number, default: 0 },
  //   experience: { type: String, default: 0 },
  //   qualifications: { type: String },
  //   licenseNumber: { type: String },
  const renderProfessionalInfo = () => (
    <div className="space-y-6">
      {user?.role === "doctor" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Patients Seen
              </label>
              <input
                type="text"
                value={profile.patients}
                onChange={(e) => handleInputChange("patients", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={profile.licenseNumber}
                onChange={(e) =>
                  handleInputChange("licenseNumber", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={profile.experience}
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications
            </label>
            <textarea
              value={profile.qualifications}
              onChange={(e) =>
                handleInputChange("qualifications", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="List your qualifications and certifications"
              required
            />
          </div>
        </>
      )}
    </div>
  );

  //    {user?.role === "patient" && (
  //       <div className="text-center py-8">
  //         <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
  //         <p className="text-gray-600">
  //           Professional information is not applicable for patient accounts.
  //         </p>
  //       </div>
  //     )}

  //     {user?.role === "admin" && (
  //       <div className="space-y-6">
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-2">
  //             Admin Level
  //           </label>
  //           <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  //             <option value="super">Super Admin</option>
  //             <option value="admin">Admin</option>
  //             <option value="manager">Manager</option>
  //           </select>
  //         </div>
  //         <div>
  //           <label className="block text-sm font-medium text-gray-700 mb-2">
  //             Permissions
  //           </label>
  //           <div className="space-y-2">
  //             {["User Management", "System Settings", "Reports", "Billing"].map(
  //               (permission) => (
  //                 <label
  //                   key={permission}
  //                   className="flex items-center space-x-2"
  //                 >
  //                   <input type="checkbox" defaultChecked className="rounded" />
  //                   <span className="text-sm text-gray-700">{permission}</span>
  //                 </label>
  //               )
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  // const renderSecurity = () => (
  //   <div className="space-y-6">
  //     <div>
  //       <label className="block text-sm font-medium text-gray-700 mb-2">
  //         Current Password
  //       </label>
  //       <div className="relative">
  //         <input
  //           type={showPassword ? "text" : "password"}
  //           value={profile.currentPassword}
  //           onChange={(e) =>
  //             handleInputChange("currentPassword", e.target.value)
  //           }
  //           className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         />
  //         <button
  //           type="button"
  //           onClick={() => setShowPassword(!showPassword)}
  //           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
  //         >
  //           {showPassword ? (
  //             <EyeOff className="h-4 w-4" />
  //           ) : (
  //             <Eye className="h-4 w-4" />
  //           )}
  //         </button>
  //       </div>
  //     </div>

  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           New Password
  //         </label>
  //         <input
  //           type="password"
  //           value={profile.newPassword}
  //           onChange={(e) => handleInputChange("newPassword", e.target.value)}
  //           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         />
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Confirm New Password
  //         </label>
  //         <input
  //           type="password"
  //           value={profile.confirmPassword}
  //           onChange={(e) =>
  //             handleInputChange("confirmPassword", e.target.value)
  //           }
  //           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         />
  //       </div>
  //     </div>

  //     <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
  //       <h4 className="font-medium text-yellow-900 mb-2">
  //         Password Requirements
  //       </h4>
  //       <ul className="text-sm text-yellow-800 space-y-1">
  //         <li>• At least 8 characters long</li>
  //         <li>• Contains uppercase and lowercase letters</li>
  //         <li>• Contains at least one number</li>
  //         <li>• Contains at least one special character</li>
  //       </ul>
  //     </div>

  //     <div className="space-y-4">
  //       <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
  //       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
  //         <div>
  //           <p className="font-medium text-gray-900">SMS Authentication</p>
  //           <p className="text-sm text-gray-600">
  //             Receive verification codes via SMS
  //           </p>
  //         </div>
  //         <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
  //           Enable
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  // const renderPreferences = () => (
  //   <div className="space-y-6">
  //     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Language
  //         </label>
  //         <select
  //           value={profile.language}
  //           onChange={(e) => handleInputChange("language", e.target.value)}
  //           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         >
  //           <option value="en">English</option>
  //           <option value="sw">Swahili</option>
  //           <option value="fr">French</option>
  //         </select>
  //       </div>
  //       <div>
  //         <label className="block text-sm font-medium text-gray-700 mb-2">
  //           Timezone
  //         </label>
  //         <select
  //           value={profile.timezone}
  //           onChange={(e) => handleInputChange("timezone", e.target.value)}
  //           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         >
  //           <option value="Africa/Nairobi">Africa/Nairobi</option>
  //           <option value="Africa/Lagos">Africa/Lagos</option>
  //           <option value="UTC">UTC</option>
  //         </select>
  //       </div>
  //     </div>

  //     <div className="space-y-4">
  //       <h4 className="font-medium text-gray-900">Notification Preferences</h4>

  //       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
  //         <div className="flex items-center space-x-3">
  //           <Mail className="h-5 w-5 text-gray-600" />
  //           <div>
  //             <p className="font-medium text-gray-900">Email Notifications</p>
  //             <p className="text-sm text-gray-600">Receive updates via email</p>
  //           </div>
  //         </div>
  //         <label className="relative inline-flex items-center cursor-pointer">
  //           <input
  //             type="checkbox"
  //             checked={profile.notifications.email}
  //             onChange={(e) =>
  //               handleNestedInputChange(
  //                 "notifications",
  //                 "email",
  //                 e.target.checked
  //               )
  //             }
  //             className="sr-only peer"
  //           />
  //           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //         </label>
  //       </div>

  //       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
  //         <div className="flex items-center space-x-3">
  //           <Phone className="h-5 w-5 text-gray-600" />
  //           <div>
  //             <p className="font-medium text-gray-900">SMS Notifications</p>
  //             <p className="text-sm text-gray-600">Receive updates via SMS</p>
  //           </div>
  //         </div>
  //         <label className="relative inline-flex items-center cursor-pointer">
  //           <input
  //             type="checkbox"
  //             checked={profile.notifications.sms}
  //             onChange={(e) =>
  //               handleNestedInputChange(
  //                 "notifications",
  //                 "sms",
  //                 e.target.checked
  //               )
  //             }
  //             className="sr-only peer"
  //           />
  //           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //         </label>
  //       </div>

  //       <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
  //         <div className="flex items-center space-x-3">
  //           <Bell className="h-5 w-5 text-gray-600" />
  //           <div>
  //             <p className="font-medium text-gray-900">Push Notifications</p>
  //             <p className="text-sm text-gray-600">
  //               Receive browser notifications
  //             </p>
  //           </div>
  //         </div>
  //         <label className="relative inline-flex items-center cursor-pointer">
  //           <input
  //             type="checkbox"
  //             checked={profile.notifications.push}
  //             onChange={(e) =>
  //               handleNestedInputChange(
  //                 "notifications",
  //                 "push",
  //                 e.target.checked
  //               )
  //             }
  //             className="sr-only peer"
  //           />
  //           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  //         </label>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          <span>{loading ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) =>
              tab.label === "Professional" ? (
                user &&
                user.role === "doctor" && (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              ) : (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "personal" && renderPersonalInfo()}
          {user && user.role === "doctor"
            ? (user.role === "doctor" ? activeTab === "professional" : null) &&
              renderProfessionalInfo()
            : null}

          {/* {activeTab === "security" && renderSecurity()} */}
          {/* {activeTab === "preferences" && renderPreferences()} */}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
