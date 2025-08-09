// import React, { useEffect, useState } from "react";
// import Layout from "../components/Layout";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   Calendar,
//   Clock,
//   Plus,
//   Search,
//   Filter,
//   CheckCircle,
//   AlertCircle,
//   X,
// } from "lucide-react";
// import { format, addDays, startOfWeek } from "date-fns";
// import { api } from "../utils/fetch";
// import { Appointment } from "../types/appointment";
// import { User } from "../types/user";

// type WeeklyAppointment = { date: string; count: number };

// const Appointments = () => {
//   const { user } = useAuth();
//   const [showBookingModal, setShowBookingModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedTime, setSelectedTime] = useState("");
//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [doctors, setDoctors] = useState<User[]>();
//   const [reason, setReason] = useState("");
//   const [selectedAppointmentType, setSelectedAppointmentType] = useState("");
//   const [weeklyAppointment, setWeeklyAppointment] = useState<
//     WeeklyAppointment[]
//   >([]);

//   const fetchData = async () => {
//     const { weeklyData } = await api.get("/appointments/weekly");
//     setWeeklyAppointment(weeklyData);
//     if (user?.role === "admin") setAppointments(await api.get("/appointments"));
//     if (user?.role === "doctor")
//       setAppointments(await api.get("/appointments/doctor"));
//     if (user?.role === "patient") {
//       const data = await api.get("/appointments/mine");
//       setAppointments(data);
//       const doctor = await api.get("/users?role=doctor");
//       setDoctors(doctor);
//     }
//   };
//   console.log(weeklyAppointment);
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const timeSlots = [
//     "9:00 AM",
//     "9:30 AM",
//     "10:00 AM",
//     "10:30 AM",
//     "11:00 AM",
//     "11:30 AM",
//     "2:00 PM",
//     "2:30 PM",
//     "3:00 PM",
//     "3:30 PM",
//     "4:00 PM",
//     "4:30 PM",
//   ];

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "confirmed":
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case "pending":
//         return <Clock className="h-4 w-4 text-yellow-500" />;
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-blue-500" />;
//       default:
//         return <AlertCircle className="h-4 w-4 text-red-500" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-green-100 text-green-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "completed":
//         return "bg-blue-100 text-blue-800";
//       default:
//         return "bg-red-100 text-red-800";
//     }
//   };

//   const generateCalendarDays = () => {
//     const start = startOfWeek(new Date());
//     const days = [];
//     for (let i = 0; i < 7; i++) {
//       days.push(addDays(start, i));
//     }
//     return days;
//   };

//   const handleBookAppointment = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle booking logic here
//     console.log("Booking appointment:", {
//       date: selectedDate,
//       time: selectedTime,
//       doctorId: selectedDoctor,
//       patientId: user?._id,
//       reason: reason,
//       type: selectedAppointmentType,
//     });
//     const body = {
//       date: selectedDate,
//       time: selectedTime,
//       doctorId: selectedDoctor,
//       patientId: user?._id,
//       reason: reason,
//       type: selectedAppointmentType,
//     };
//     try {
//       const data = await api.post("/appointments", body, "Appointment");
//       if (user?.role === "patient") {
//         const appData = await api.get("/appointments/mine");
//         setAppointments(appData);
//       }

//       const { weeklyData } = await api.get("/appointments/weekly");
//       setWeeklyAppointment(weeklyData);

//       console.log(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setReason("");
//       setSelectedAppointmentType("");
//       setSelectedDate(new Date());
//       setSelectedDoctor("");
//       setSelectedTime("");

//       setShowBookingModal(false);
//     }
//   };

//   return (
//     <Layout title="Appointments">
//       <div className="space-y-6">
//         {/* Header Actions */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 placeholder="Search appointments..."
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
//               />
//             </div>
//             <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//               <Filter className="h-4 w-4" />
//               <span>Filter</span>
//             </button>
//           </div>

//           {user?.role === "patient" && (
//             <button
//               onClick={() => setShowBookingModal(true)}
//               className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
//             >
//               <Plus className="h-4 w-4" />
//               <span>Book Appointment</span>
//             </button>
//           )}
//         </div>

//         {/* Calendar View */}
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
//             <div className="flex items-center space-x-2">
//               <button className="p-2 hover:bg-gray-100 rounded-lg">
//                 <Calendar className="h-4 w-4 text-gray-600" />
//               </button>
//             </div>
//           </div>

//           <div className="grid grid-cols-7 gap-4 mb-6">
//             {/* {generateCalendarDays().map((day, index) => (
//               <div key={index} className="text-center">
//                 <p className="text-sm font-medium text-gray-900 mb-2">
//                   {format(day, "EEE")}
//                 </p>
//                 <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors">
//                   <span className="text-sm font-medium">
//                     {format(day, "d")}
//                   </span>
//                 </div>
//               </div>
//             ))} */}

//             {generateCalendarDays().map((day, index) => (
//               <div key={index} className="text-center">
//                 <p className="text-sm font-medium text-gray-900 mb-2">
//                   {format(day, "EEE")}
//                 </p>
//                 <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors">
//                   <span className="text-sm font-medium">
//                     {/* {format(day, "d")} */}
//                     {weeklyAppointment[index]?.count || 0} appts
//                   </span>
//                 </div>
//                 {/* <p className="text-xs text-gray-600 mt-1">
//                   {weeklyAppointment[index]?.count || 0} appts
//                 </p> */}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Appointments List */}
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-6">
//             {user?.role === "patient" || user?.role === "doctor"
//               ? "My Appointments"
//               : "All Appointments"}
//           </h3>

//           <div className="space-y-4">
//             {appointments?.map((appointment: Appointment) => (
//               <div
//                 key={appointment._id}
//                 className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-start space-x-4">
//                     <p className="h-8 w-8 rounded-full bg-gray-400 text-white text-center flex justify-center items-center font-semibold">
//                       {user?.role === "patient"
//                         ? appointment?.doctorId?.name?.slice(0, 2)
//                         : appointment?.patientId?.name?.slice(0, 2)}
//                     </p>
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-2 mb-2">
//                         <h4 className="font-semibold text-gray-900">
//                           {user?.role === "patient"
//                             ? appointment?.doctorId?.name
//                             : appointment?.patientId?.name}
//                         </h4>
//                         {getStatusIcon(appointment.status)}
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//                         <div className="flex items-center space-x-2">
//                           <Calendar className="h-4 w-4" />
//                           <span>{appointment.date.split("T")[0]}</span>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Clock className="h-4 w-4" />
//                           <span>{appointment.time}</span>
//                         </div>
//                       </div>

//                       {/* {user?.role !== "patient" && (
//                         <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
//                           <Phone className="h-4 w-4" />
//                           <span>{appointment.phone}</span>
//                         </div>
//                       )} */}
//                     </div>
//                   </div>

//                   <div className="flex items-center space-x-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
//                         appointment.status
//                       )}`}
//                     >
//                       {appointment.status}
//                     </span>
//                     <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
//                       {appointment.type}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Booking Modal */}
//         {showBookingModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="text-lg font-semibold text-gray-900">
//                     Book Appointment
//                   </h3>
//                   <button
//                     onClick={() => setShowBookingModal(false)}
//                     className="p-2 hover:bg-gray-100 rounded-lg"
//                   >
//                     <X className="h-5 w-5 text-gray-600" />
//                   </button>
//                 </div>

//                 <form className="space-y-6" onSubmit={handleBookAppointment}>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Select Doctor
//                     </label>
//                     <select
//                       value={selectedDoctor}
//                       onChange={(e) => setSelectedDoctor(e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">Choose a doctor</option>
//                       {doctors?.map((doctor: User) => (
//                         <option key={doctor._id} value={doctor._id}>
//                           {doctor.name} - {doctor.department}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Select Date
//                     </label>
//                     <input
//                       type="date"
//                       value={format(selectedDate, "yyyy-MM-dd")}
//                       onChange={(e) =>
//                         setSelectedDate(new Date(e.target.value))
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Select Time
//                     </label>
//                     <div className="grid grid-cols-3 gap-2">
//                       {timeSlots.map((time) => (
//                         <button
//                           key={time}
//                           type="button"
//                           onClick={() => setSelectedTime(time)}
//                           className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
//                             selectedTime === time
//                               ? "bg-blue-600 text-white border-blue-600"
//                               : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                           }`}
//                         >
//                           {time}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Appointment Type
//                     </label>
//                     <select
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       value={selectedAppointmentType}
//                       onChange={(e) =>
//                         setSelectedAppointmentType(e.target.value)
//                       }
//                     >
//                       <option value={"consultation"}>Consultation</option>
//                       <option value={"follow-up"}>Follow-up</option>
//                       <option value={"check-up"}>Check-up</option>
//                       <option value={"emergency"}>Emergency</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Reason (Optional)
//                     </label>
//                     <textarea
//                       rows={3}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Any additional information..."
//                       value={reason}
//                       onChange={(e) => setReason(e.target.value)}
//                     />
//                   </div>

//                   <div className="flex space-x-3">
//                     <button
//                       type="button"
//                       onClick={() => setShowBookingModal(false)}
//                       className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       type="button"
//                       onClick={handleBookAppointment}
//                       className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
//                     >
//                       Book Appointment
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Appointments;

// src/pages/Appointments.tsx (updated)
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";
import { api } from "../utils/fetch";
import { Appointment } from "../types/appointment";
import { User } from "../types/user";

type WeeklyAppointment = { date: string; count: number };

const API_BASE = "/api"; // adjust if your API base differs

const Appointments = () => {
  const { user } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<User[]>();
  const [reason, setReason] = useState("");
  const [selectedAppointmentType, setSelectedAppointmentType] = useState("");
  const [weeklyAppointment, setWeeklyAppointment] = useState<
    WeeklyAppointment[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Reschedule modal state
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] =
    useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>("");
  const [rescheduleTime, setRescheduleTime] = useState<string>("");

  const fetchData = async () => {
    try {
      setLoading(true);
      // weekly: returns { weeklyData: [...] }
      const { weeklyData } = await api.get("/appointments/weekly");
      setWeeklyAppointment(weeklyData);

      if (user?.role === "admin") {
        const all = await api.get("/appointments");
        setAppointments(all);
      } else if (user?.role === "doctor") {
        const docApps = await api.get("/appointments/doctor");
        setAppointments(docApps);
      } else if (user?.role === "patient") {
        const mine = await api.get("/appointments/mine");
        setAppointments(mine);
        const docList = await api.get("/users?role=doctor");
        setDoctors(docList);
      }
    } catch (err) {
      console.error("fetchData error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const generateCalendarDays = () => {
    // use date-fns startOfWeek to match backend (both default to Sunday)
    const start = startOfWeek(new Date());
    const days = [];
    for (let i = 0; i < 7; i++) days.push(addDays(start, i));
    return days;
  };

  const updateWeeklyAndAppointments = async () => {
    try {
      const { weeklyData } = await api.get("/appointments/weekly");
      setWeeklyAppointment(weeklyData);
      if (user?.role === "patient") {
        const mine = await api.get("/appointments/mine");
        setAppointments(mine);
      } else if (user?.role === "doctor") {
        const docApps = await api.get("/appointments/doctor");
        setAppointments(docApps);
      } else {
        const all = await api.get("/appointments");
        setAppointments(all);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookAppointment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const body = {
      date: selectedDate,
      time: selectedTime,
      doctorId: selectedDoctor,
      patientId: user?._id,
      reason,
      type: selectedAppointmentType,
    };
    try {
      await api.post("/appointments", body, "Appointment");
      await updateWeeklyAndAppointments();
      // reset
      setReason("");
      setSelectedAppointmentType("");
      setSelectedDate(new Date());
      setSelectedDoctor("");
      setSelectedTime("");
      setShowBookingModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // doctor actions: confirm / cancel / complete (sends PATCH to /appointments/:id/status)
  const handleChangeStatus = async (appointmentId: string, status: string) => {
    try {
      setLoading(true);
      const res = await api.patch(
        `/appointments/${appointmentId}/status`,
        { status },
        "Appointment status"
      );
      // await fetch(`${API_BASE}/appointments/${appointmentId}/status`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ status }),
      // });
      await updateWeeklyAndAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openReschedule = (appointment: Appointment) => {
    setAppointmentToReschedule(appointment);
    // prefill with current appointment date/time
    setRescheduleDate(appointment.date ? appointment.date.split("T")[0] : "");
    setRescheduleTime(appointment.time || "");
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = async () => {
    if (!appointmentToReschedule) return;
    if (!rescheduleDate || !rescheduleTime) {
      alert("Please select date and time for reschedule");
      return;
    }
    try {
      setLoading(true);
      await api.patch(
        `/appointments/${appointmentToReschedule._id}/status`,
        { status: "rescheduled", date: rescheduleDate, time: rescheduleTime },
        "Appointment status"
      );
      
      setShowRescheduleModal(false);
      setAppointmentToReschedule(null);
      await updateWeeklyAndAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Appointments">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>

          {user?.role === "patient" && (
            <button
              onClick={() => setShowBookingModal(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Book Appointment</span>
            </button>
          )}
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 mb-6">
            {generateCalendarDays().map((day, index) => {
              const iso = day.toISOString().split("T")[0];
              const count =
                weeklyAppointment.find((d) => d.date === iso)?.count ?? 0;
              return (
                <div key={index} className="text-center">
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    {format(day, "EEE")}
                  </p>
                  <div className="h-12 w-12 mx-auto flex flex-col items-center justify-center rounded-lg bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors">
                    <span className="text-sm font-medium">
                      {format(day, "d")}
                    </span>
                    <span className="text-xs text-gray-500">{count} appts</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {user?.role === "patient" || user?.role === "doctor"
              ? "My Appointments"
              : "All Appointments"}
          </h3>

          <div className="space-y-4">
            {appointments?.map((appointment: Appointment) => (
              <div
                key={appointment._id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between flex-col md:flex-row md:items-center">
                  <div className="flex items-start space-x-4">
                    <p className="h-8 w-8 rounded-full bg-gray-400 text-white text-center flex justify-center items-center font-semibold">
                      {user?.role === "patient"
                        ? appointment?.doctorId?.name?.slice(0, 2)
                        : appointment?.patientId?.name?.slice(0, 2)}
                    </p>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {user?.role === "patient"
                            ? appointment?.doctorId?.name
                            : appointment?.patientId?.name}
                        </h4>
                        {getStatusIcon(appointment.status)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.date.split("T")[0]}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between h-[100%] gap-4 space-x-3 flex-col mt-4 md:mt-0">
                    <div>
                      {" "}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {appointment.type}
                      </span>
                    </div>

                    {/* DOCTOR ACTIONS */}
                    {user?.role === "doctor" && (
                      <div className="flex items-center space-x-2 flex-wrap gap-2 mt-6">
                        <button
                          onClick={() =>
                            handleChangeStatus(appointment._id, "confirmed")
                          }
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() =>
                            handleChangeStatus(appointment._id, "cancelled")
                          }
                          className="px-2 py-1 text-xs bg-red-500 text-white font-bold rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => openReschedule(appointment)}
                          className="px-2 py-1 text-xs bg-yellow-600 text-white font-bold rounded"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() =>
                            handleChangeStatus(appointment._id, "completed")
                          }
                          className="px-2 py-1 text-xs bg-blue-500 text-white font-bold rounded"
                        >
                          Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {appointments?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No appointments found.
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Book Appointment
                  </h3>
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <form className="space-y-6" onSubmit={handleBookAppointment}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Doctor
                    </label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a doctor</option>
                      {doctors?.map((doctor: User) => (
                        <option key={doctor._id} value={doctor._id}>
                          {doctor.name} - {doctor.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={format(selectedDate, "yyyy-MM-dd")}
                      onChange={(e) =>
                        setSelectedDate(new Date(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                            selectedTime === time
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={selectedAppointmentType}
                      onChange={(e) =>
                        setSelectedAppointmentType(e.target.value)
                      }
                    >
                      <option value={"consultation"}>Consultation</option>
                      <option value={"follow-up"}>Follow-up</option>
                      <option value={"check-up"}>Check-up</option>
                      <option value={"emergency"}>Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason (Optional)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Any additional information..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
                    >
                      Book Appointment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && appointmentToReschedule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reschedule Appointment
                  </h3>
                  <button
                    onClick={() => setShowRescheduleModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Date
                    </label>
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Time
                    </label>
                    <input
                      type="time"
                      value={rescheduleTime}
                      onChange={(e) => setRescheduleTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowRescheduleModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRescheduleSubmit}
                      className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Appointments;
