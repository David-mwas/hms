// import { useState } from "react";
// import {
//   Search,
//   Filter,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Eye,
//   Edit,
//   Printer,
//   Plus,
// } from "lucide-react";
// import toast from "react-hot-toast";

// const PrescriptionsPage = () => {
//   const [showNewPrescription, setShowNewPrescription] = useState(false);
//   const [selectedPrescription, setSelectedPrescription] = useState(null);

//   const prescriptions = [
//     {
//       id: "RX-001",
//       patient: {
//         name: "Alice Johnson",
//         age: 45,
//         id: "P-001",
//         avatar:
//           "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
//       },
//       date: "2025-01-20",
//       diagnosis: "Hypertension",
//       medications: [
//         {
//           name: "Amlodipine",
//           dosage: "5mg",
//           frequency: "Once daily",
//           duration: "30 days",
//           instructions: "Take with food",
//         },
//         {
//           name: "Lisinopril",
//           dosage: "10mg",
//           frequency: "Once daily",
//           duration: "30 days",
//           instructions: "Take in the morning",
//         },
//       ],
//       status: "active",
//       refills: 2,
//       nextRefill: "2025-02-19",
//     },
//     {
//       id: "RX-002",
//       patient: {
//         name: "Bob Smith",
//         age: 52,
//         id: "P-002",
//         avatar:
//           "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
//       },
//       date: "2025-01-18",
//       diagnosis: "Type 2 Diabetes",
//       medications: [
//         {
//           name: "Metformin",
//           dosage: "500mg",
//           frequency: "Twice daily",
//           duration: "90 days",
//           instructions: "Take with meals",
//         },
//       ],
//       status: "active",
//       refills: 5,
//       nextRefill: "2025-04-18",
//     },
//     {
//       id: "RX-003",
//       patient: {
//         name: "Carol Brown",
//         age: 38,
//         id: "P-003",
//         avatar:
//           "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
//       },
//       date: "2025-01-15",
//       diagnosis: "Migraine",
//       medications: [
//         {
//           name: "Sumatriptan",
//           dosage: "50mg",
//           frequency: "As needed",
//           duration: "30 days",
//           instructions: "Take at onset of headache",
//         },
//       ],
//       status: "completed",
//       refills: 0,
//       nextRefill: null,
//     },
//   ];

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "active":
//         return <CheckCircle className="h-4 w-4 text-green-500" />;
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-blue-500" />;
//       case "expired":
//         return <AlertCircle className="h-4 w-4 text-red-500" />;
//       default:
//         return <Clock className="h-4 w-4 text-yellow-500" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "active":
//         return "bg-green-100 text-green-800";
//       case "completed":
//         return "bg-blue-100 text-blue-800";
//       case "expired":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-yellow-100 text-yellow-800";
//     }
//   };

//   const handleNewPrescription = () => {
//     toast.success("New prescription created successfully!");
//     setShowNewPrescription(false);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
//           <p className="text-gray-600">
//             Manage patient prescriptions and medications
//           </p>
//         </div>
//         <button
//           onClick={() => setShowNewPrescription(true)}
//           className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//         >
//           <Plus className="h-4 w-4" />
//           <span>New Prescription</span>
//         </button>
//       </div>

//       {/* Search and Filters */}
//       <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//           <input
//             type="text"
//             placeholder="Search prescriptions..."
//             className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//         <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//           <Filter className="h-4 w-4" />
//           <span>Filter</span>
//         </button>
//       </div>

//       {/* Prescriptions List */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="text-left py-3 px-6 font-medium text-gray-700">
//                   Prescription ID
//                 </th>
//                 <th className="text-left py-3 px-6 font-medium text-gray-700">
//                   Patient
//                 </th>
//                 <th className="text-left py-3 px-6 font-medium text-gray-700">
//                   Date
//                 </th>
//                 <th className="text-left py-3 px-6 font-medium text-gray-700">
//                   Diagnosis
//                 </th>
//                 <th className="text-left py-3 px-6 font-medium text-gray-700">
//                   Medications
//                 </th>
//                 <th className="text-left py-3 px-6 font-medium text-gray-700">
//                   Status
//                 </th>
//                 <th className="text-left py-3 px-6 font-medium text-gray-700">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {prescriptions.map((prescription) => (
//                 <tr
//                   key={prescription.id}
//                   className="border-b border-gray-100 hover:bg-gray-50"
//                 >
//                   <td className="py-4 px-6 font-medium text-blue-600">
//                     {prescription.id}
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-3">
//                       <img
//                         src={prescription.patient.avatar}
//                         alt={prescription.patient.name}
//                         className="h-8 w-8 rounded-full object-cover"
//                       />
//                       <div>
//                         <p className="font-medium text-gray-900">
//                           {prescription.patient.name}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Age: {prescription.patient.age}
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6 text-gray-900">
//                     {prescription.date}
//                   </td>
//                   <td className="py-4 px-6 text-gray-900">
//                     {prescription.diagnosis}
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="space-y-1">
//                       {prescription.medications
//                         .slice(0, 2)
//                         .map((med, index) => (
//                           <div key={index} className="text-sm">
//                             <span className="font-medium">{med.name}</span>
//                             <span className="text-gray-600">
//                               {" "}
//                               - {med.dosage}
//                             </span>
//                           </div>
//                         ))}
//                       {prescription.medications.length > 2 && (
//                         <p className="text-xs text-gray-500">
//                           +{prescription.medications.length - 2} more
//                         </p>
//                       )}
//                     </div>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-2">
//                       {getStatusIcon(prescription.status)}
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
//                           prescription.status
//                         )}`}
//                       >
//                         {prescription.status}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="py-4 px-6">
//                     <div className="flex items-center space-x-2">
//                       <button
//                         //@ts-expect-error many types
//                         onClick={() => setSelectedPrescription(prescription)}
//                         className="text-blue-600 hover:text-blue-800"
//                       >
//                         <Eye className="h-4 w-4" />
//                       </button>
//                       <button className="text-gray-600 hover:text-gray-800">
//                         <Edit className="h-4 w-4" />
//                       </button>
//                       <button className="text-green-600 hover:text-green-800">
//                         <Printer className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* New Prescription Modal */}
//       {showNewPrescription && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   New Prescription
//                 </h3>
//                 <button
//                   onClick={() => setShowNewPrescription(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ×
//                 </button>
//               </div>

//               <form className="space-y-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Patient
//                     </label>
//                     <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                       <option>Select Patient</option>
//                       <option>Alice Johnson</option>
//                       <option>Bob Smith</option>
//                       <option>Carol Brown</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Date
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Diagnosis
//                   </label>
//                   <input
//                     type="text"
//                     placeholder="Enter diagnosis"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Medications
//                   </label>
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">
//                           Medication
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="Drug name"
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">
//                           Dosage
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="e.g., 5mg"
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">
//                           Frequency
//                         </label>
//                         <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                           <option>Once daily</option>
//                           <option>Twice daily</option>
//                           <option>Three times daily</option>
//                           <option>As needed</option>
//                         </select>
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">
//                           Duration
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="e.g., 30 days"
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                       </div>
//                       <div className="md:col-span-4">
//                         <label className="block text-xs text-gray-600 mb-1">
//                           Instructions
//                         </label>
//                         <input
//                           type="text"
//                           placeholder="Special instructions"
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                       </div>
//                     </div>
//                     <button
//                       type="button"
//                       className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
//                     >
//                       <Plus className="h-4 w-4" />
//                       <span>Add Another Medication</span>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Refills Allowed
//                     </label>
//                     <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
//                       <option>0</option>
//                       <option>1</option>
//                       <option>2</option>
//                       <option>3</option>
//                       <option>5</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Valid Until
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Additional Notes
//                   </label>
//                   <textarea
//                     rows={3}
//                     placeholder="Any additional notes or warnings"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 <div className="flex space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => setShowNewPrescription(false)}
//                     className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     onClick={handleNewPrescription}
//                     className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     Create Prescription
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Prescription Details Modal */}
//       {selectedPrescription && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Prescription Details
//                 </h3>
//                 <button
//                   onClick={() => setSelectedPrescription(null)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="space-y-6">
//                 <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
//                   <img
//                     src={selectedPrescription.patient.avatar}
//                     alt={selectedPrescription.patient.name}
//                     className="h-12 w-12 rounded-full object-cover"
//                   />
//                   <div>
//                     <h4 className="font-semibold text-gray-900">
//                       {selectedPrescription.patient.name}
//                     </h4>
//                     <p className="text-sm text-gray-600">
//                       Age: {selectedPrescription.patient.age} • ID:{" "}
//                       {selectedPrescription.patient.id}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">
//                       Prescription ID
//                     </p>
//                     <p className="text-gray-900">{selectedPrescription.id}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">Date</p>
//                     <p className="text-gray-900">{selectedPrescription.date}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">
//                       Diagnosis
//                     </p>
//                     <p className="text-gray-900">
//                       {selectedPrescription.diagnosis}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-700">Status</p>
//                     <div className="flex items-center space-x-2">
//                       {getStatusIcon(selectedPrescription.status)}
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
//                           selectedPrescription.status
//                         )}`}
//                       >
//                         {selectedPrescription.status}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="font-medium text-gray-900 mb-3">
//                     Medications
//                   </h4>
//                   <div className="space-y-3">
//                     {selectedPrescription.medications.map((med, index) => (
//                       <div
//                         key={index}
//                         className="p-4 border border-gray-200 rounded-lg"
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <h5 className="font-medium text-gray-900">
//                             {med.name}
//                           </h5>
//                           <span className="text-sm text-gray-600">
//                             {med.dosage}
//                           </span>
//                         </div>
//                         <div className="grid grid-cols-2 gap-4 text-sm">
//                           <div>
//                             <span className="text-gray-600">Frequency: </span>
//                             <span className="text-gray-900">
//                               {med.frequency}
//                             </span>
//                           </div>
//                           <div>
//                             <span className="text-gray-600">Duration: </span>
//                             <span className="text-gray-900">
//                               {med.duration}
//                             </span>
//                           </div>
//                         </div>
//                         <p className="text-sm text-gray-600 mt-2">
//                           {med.instructions}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {selectedPrescription.refills > 0 && (
//                   <div className="p-4 bg-blue-50 rounded-lg">
//                     <p className="text-sm text-blue-800">
//                       <strong>Refills:</strong> {selectedPrescription.refills}{" "}
//                       remaining
//                     </p>
//                     {selectedPrescription.nextRefill && (
//                       <p className="text-sm text-blue-800">
//                         <strong>Next refill available:</strong>{" "}
//                         {selectedPrescription.nextRefill}
//                       </p>
//                     )}
//                   </div>
//                 )}

//                 <div className="flex space-x-3">
//                   <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
//                     Edit Prescription
//                   </button>
//                   <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
//                     Print Prescription
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PrescriptionsPage;

// PrescriptionsPage.jsx
import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Printer,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../utils/fetch";

const API_BASE =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1";
const PRESC_ENDPOINT = `${API_BASE}/prescriptions`;

const getStatusIcon = (status) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    case "expired":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "expired":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const PrescriptionsPage = () => {
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [patients, setPatients] = useState<U[]>();

  // new prescription form state
  const [form, setForm] = useState({
    patientAge: "",
    patientId: "",
    date: "",
    diagnosis: "",
    medications: [
      {
        name: "",
        dosage: "",
        frequency: "Once daily",
        duration: "",
        instructions: "",
      },
    ],
    status: "active",
    refills: 0,
    nextRefill: "",
    validUntil: "",
    notes: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchPrescriptions();
  }, []);

  const fetchUsers = async () => {
    const patient = await api.get("/users?role=patient");

    setPatients(patient);
  };

  const fetchPrescriptions = async () => {
    const data = await api.get("/prescriptions");
    setPrescriptions(Array.isArray(data) ? data : []);
  };

  const handleFormChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
  };

  // medication helpers
  const updateMedication = (index, key, value) => {
    setForm((p) => {
      const meds = [...p.medications];
      meds[index] = { ...meds[index], [key]: value };
      return { ...p, medications: meds };
    });
  };
  const addMedication = () =>
    setForm((p) => ({
      ...p,
      medications: [
        ...p.medications,
        {
          name: "",
          dosage: "",
          frequency: "Once daily",
          duration: "",
          instructions: "",
        },
      ],
    }));
  const removeMedication = (index) =>
    setForm((p) => {
      const meds = [...p.medications];
      meds.splice(index, 1);
      return {
        ...p,
        medications: meds.length
          ? meds
          : [
              {
                name: "",
                dosage: "",
                frequency: "Once daily",
                duration: "",
                instructions: "",
              },
            ],
      };
    });

  const handleNewPrescription = async () => {
    // basic validation
    if (!form.patientId || !form.date) {
      toast.error("Please fill patient name, patient ID and date.");
      return;
    }

    const payload = {
      id: `RX-${Date.now()}`, // client-side id, server will accept or override
      patientId: form.patientId,
      date: form.date,
      diagnosis: form.diagnosis,
      medications: form.medications.filter((m) => m.name.trim()),
      status: form.status,
      refills: Number(form.refills || 0),
      nextRefill: form.nextRefill || null,
      validUntil: form.validUntil || null,
      notes: form.notes,
    };

    try {
      setLoading(true);
      const res = await api.post("/prescriptions", payload, "Prescription");

      setShowNewPrescription(false);
      // reset form
      setForm({
        patientAge: "",
        patientId: "",
        date: "",
        diagnosis: "",
        medications: [
          {
            name: "",
            dosage: "",
            frequency: "Once daily",
            duration: "",
            instructions: "",
          },
        ],
        status: "active",
        refills: 0,
        nextRefill: "",
        validUntil: "",
        notes: "",
      });
      // reload list
      await fetchPrescriptions();
    } catch (err) {
      console.error(err);
      toast.error("Create failed: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this prescription?")) return;
    try {
      setLoading(true);
      const res = await api.delete(
        `/prescriptions/${encodeURIComponent(id)}`,
        "Prescription"
      );
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  // client-side search filter
  const filtered = prescriptions.filter((p) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      p.id?.toLowerCase().includes(q) ||
      p.patientId?.name?.toLowerCase().includes(q) ||
      p.diagnosis?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prescriptions</h2>
          <p className="text-gray-600">
            Manage patient prescriptions and medications
          </p>
        </div>
        <button
          onClick={() => setShowNewPrescription(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>New Prescription</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search prescriptions..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* List */}
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
                    Prescription ID
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Patient
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Diagnosis
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Medications
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((prescription) => (
                  <tr
                    key={prescription._id || prescription.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6 font-medium text-blue-600">
                      {prescription.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {prescription.patientId?.avatar ? (
                          <img
                            src={
                              prescription.patientId?.avatar ||
                              "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                            }
                            alt={prescription.patientId?.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <p className="h-8 w-8 rounded-full bg-gray-400 text-white text-center flex justify-center items-center font-semibold">
                            {prescription.patientId?.name.slice(0, 2)}
                          </p>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {prescription.patientId?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Age: {prescription.patientAge?.age ?? "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {prescription.date
                        ? new Date(prescription.date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {prescription.diagnosis}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {Array.isArray(prescription.medications)
                          ? prescription.medications
                              .slice(0, 2)
                              .map((med, idx) => (
                                <div key={idx} className="text-sm">
                                  <span className="font-medium">
                                    {med.name}
                                  </span>
                                  <span className="text-gray-600">
                                    {" "}
                                    - {med.dosage}
                                  </span>
                                </div>
                              ))
                          : null}
                        {prescription.medications &&
                          prescription.medications.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{prescription.medications.length - 2} more
                            </p>
                          )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(prescription.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            prescription.status
                          )}`}
                        >
                          {prescription.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedPrescription(prescription)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alert("Edit not implemented")}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => alert("Printing not implemented")}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(prescription._id || prescription.id)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No prescriptions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* New Prescription Modal */}
      {showNewPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  New Prescription
                </h3>
                <button
                  onClick={() => setShowNewPrescription(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNewPrescription();
                }}
              >
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name
                    </label>

                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.patientId}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, patientId: e.target.value }))
                      }
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      value={form.patientAge}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, patientAge: e.target.value }))
                      }
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      value={form.date}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, date: e.target.value }))
                      }
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis
                  </label>
                  <input
                    value={form.diagnosis}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, diagnosis: e.target.value }))
                    }
                    type="text"
                    placeholder="Enter diagnosis"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medications
                  </label>
                  <div className="space-y-4">
                    {form.medications.map((med, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Medication
                          </label>
                          <input
                            value={med.name}
                            onChange={(e) =>
                              updateMedication(i, "name", e.target.value)
                            }
                            placeholder="Drug name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Dosage
                          </label>
                          <input
                            value={med.dosage}
                            onChange={(e) =>
                              updateMedication(i, "dosage", e.target.value)
                            }
                            placeholder="e.g., 5mg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Frequency
                          </label>
                          <select
                            value={med.frequency}
                            onChange={(e) =>
                              updateMedication(i, "frequency", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option>Once daily</option>
                            <option>Twice daily</option>
                            <option>Three times daily</option>
                            <option>As needed</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Duration
                          </label>
                          <input
                            value={med.duration}
                            onChange={(e) =>
                              updateMedication(i, "duration", e.target.value)
                            }
                            placeholder="e.g., 30 days"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-xs text-gray-600 mb-1">
                            Instructions
                          </label>
                          <input
                            value={med.instructions}
                            onChange={(e) =>
                              updateMedication(
                                i,
                                "instructions",
                                e.target.value
                              )
                            }
                            placeholder="Special instructions"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div className="md:col-span-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeMedication(i)}
                            className="text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addMedication}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Another Medication</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refills Allowed
                    </label>
                    <select
                      value={form.refills}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, refills: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={5}>5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valid Until
                    </label>
                    <input
                      value={form.validUntil}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, validUntil: e.target.value }))
                      }
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewPrescription(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {loading ? "Creating..." : "Create Prescription"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Prescription Details
                </h3>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  {selectedPrescription.patientId?.avatar ? (
                    <img
                      src={
                        selectedPrescription.patientId?.avatar ||
                        "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                      }
                      alt={selectedPrescription.patientId?.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <p className="h-8 w-8 rounded-full bg-gray-400 text-white text-center flex justify-center items-center font-semibold">
                      {selectedPrescription.patientId?.name.slice(0, 2)}
                    </p>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {selectedPrescription.patientId.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Age: {selectedPrescription?.patientAge} • ID:{" "}
                      {selectedPrescription.patientId._id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Prescription ID
                    </p>
                    <p className="text-gray-900">{selectedPrescription.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Date</p>
                    <p className="text-gray-900">
                      {selectedPrescription.date
                        ? new Date(
                            selectedPrescription.date
                          ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Diagnosis
                    </p>
                    <p className="text-gray-900">
                      {selectedPrescription.diagnosis}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedPrescription.status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          selectedPrescription.status
                        )}`}
                      >
                        {selectedPrescription.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Medications
                  </h4>
                  <div className="space-y-3">
                    {selectedPrescription.medications.map((med, idx) => (
                      <div
                        key={idx}
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
                        <p className="text-sm text-gray-600 mt-2">
                          {med.instructions}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedPrescription.refills > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Refills:</strong> {selectedPrescription.refills}{" "}
                      remaining
                    </p>
                    {selectedPrescription.nextRefill && (
                      <p className="text-sm text-blue-800">
                        <strong>Next refill available:</strong>{" "}
                        {new Date(
                          selectedPrescription.nextRefill
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Edit Prescription
                  </button>
                  <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Print Prescription
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

export default PrescriptionsPage;
