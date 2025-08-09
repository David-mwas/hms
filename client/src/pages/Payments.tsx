import React, { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import {
  CreditCard,
  Smartphone,
  Receipt,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

const Payments = () => {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const paymentSummary = [
    {
      title: "Total Paid",
      value: "KSh 45,000",
      change: "+12%",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: "KSh 3,500",
      change: "-5%",
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "This Month",
      value: "KSh 8,500",
      change: "+8%",
      icon: CreditCard,
      color: "bg-blue-500",
    },
    {
      title: "Outstanding",
      value: "KSh 2,000",
      change: "-15%",
      icon: AlertCircle,
      color: "bg-red-500",
    },
  ];

  const invoices = [
    {
      id: "INV-001",
      date: "2025-01-20",
      service: "Cardiology Consultation",
      doctor: "Dr. Sarah Wilson",
      amount: 5000,
      status: "paid",
      paymentMethod: "M-Pesa",
      transactionId: "MPE12345678",
    },
    {
      id: "INV-002",
      date: "2025-01-18",
      service: "Blood Test",
      doctor: "Dr. Michael Brown",
      amount: 2500,
      status: "pending",
      paymentMethod: null,
      transactionId: null,
    },
    {
      id: "INV-003",
      date: "2025-01-15",
      service: "X-Ray",
      doctor: "Dr. Emily Davis",
      amount: 3000,
      status: "paid",
      paymentMethod: "Card",
      transactionId: "CARD9876543",
    },
    {
      id: "INV-004",
      date: "2025-01-10",
      service: "General Check-up",
      doctor: "Dr. Johnson",
      amount: 4000,
      status: "overdue",
      paymentMethod: null,
      transactionId: null,
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      date: "2025-01-20",
      description: "Cardiology Consultation",
      amount: 5000,
      method: "M-Pesa",
      status: "completed",
      reference: "MPE12345678",
    },
    {
      id: 2,
      date: "2025-01-15",
      description: "X-Ray Service",
      amount: 3000,
      method: "Card",
      status: "completed",
      reference: "CARD9876543",
    },
    {
      id: 3,
      date: "2025-01-12",
      description: "Lab Test",
      amount: 2000,
      method: "M-Pesa",
      status: "completed",
      reference: "MPE87654321",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleMpesaPayment = async (invoice: any) => {
    setLoading(true);
    try {
      // Simulate M-Pesa payment process
      toast.loading("Initiating M-Pesa payment...", { id: "mpesa-payment" });

      // Simulate API call to initiate STK push
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "Payment request sent to your phone. Please enter your M-Pesa PIN.",
        { id: "mpesa-payment" }
      );

      // Simulate payment completion
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success(
        "Payment successful! Transaction ID: MPE" +
          Math.random().toString().substr(2, 8),
        { id: "mpesa-payment" }
      );
      setShowPaymentModal(false);
    } catch (error) {
      toast.error("Payment failed. Please try again.", { id: "mpesa-payment" });
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async (invoice: any) => {
    setLoading(true);
    try {
      toast.loading("Processing card payment...", { id: "card-payment" });

      // Simulate card payment process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        "Payment successful! Transaction ID: CARD" +
          Math.random().toString().substr(2, 8),
        { id: "card-payment" }
      );
      setShowPaymentModal(false);
    } catch (error) {
      toast.error("Payment failed. Please try again.", { id: "card-payment" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Payments & Billing">
      <div className="space-y-6">
        {/* Payment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paymentSummary.map((stat, index) => (
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
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      from last month
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 border-2 border-green-200 bg-green-50 rounded-lg">
              <div className="bg-green-600 p-2 rounded-lg">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">M-Pesa</p>
                <p className="text-sm text-gray-600">Pay via mobile money</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 border-2 border-blue-200 bg-blue-50 rounded-lg">
              <div className="bg-blue-600 p-2 rounded-lg">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Credit/Debit Card</p>
                <p className="text-sm text-gray-600">
                  Visa, Mastercard accepted
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 border-2 border-purple-200 bg-purple-50 rounded-lg">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Bank Transfer</p>
                <p className="text-sm text-gray-600">Direct bank payment</p>
              </div>
            </div>
          </div>
        </div>

        {/* Invoices */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {user?.role === "admin" ? "All Invoices" : "My Invoices"}
            </h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Invoice
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Doctor
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {invoice.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {invoice.date}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {invoice.service}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {invoice.doctor}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      KSh {invoice.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(invoice.status)}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm">
                          <Download className="h-4 w-4" />
                        </button>
                        {(invoice.status === "pending" ||
                          invoice.status === "overdue") && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setShowPaymentModal(true);
                            }}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    {transaction.method === "M-Pesa" ? (
                      <Smartphone className="h-5 w-5 text-green-600" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.method} • {transaction.reference}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    KSh {transaction.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">
                      {transaction.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                    <CreditCard className="h-10 w-10 text-blue-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Make Payment
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Pay for {selectedInvoice.service}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Invoice:</span>
                    <span className="font-medium">{selectedInvoice.id}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">
                      {selectedInvoice.service}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount:</span>
                    <span className="text-xl font-bold text-gray-900">
                      KSh {selectedInvoice.amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Choose Payment Method
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="mpesa"
                          checked={paymentMethod === "mpesa"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-green-600"
                        />
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <span className="font-medium">M-Pesa</span>
                      </label>
                      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="text-blue-600"
                        />
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Credit/Debit Card</span>
                      </label>
                    </div>
                  </div>

                  {paymentMethod === "mpesa" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        M-Pesa Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="254700000000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (paymentMethod === "mpesa") {
                          handleMpesaPayment(selectedInvoice);
                        } else {
                          handleCardPayment(selectedInvoice);
                        }
                      }}
                      disabled={
                        loading || (paymentMethod === "mpesa" && !phoneNumber)
                      }
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? "Processing..."
                        : `Pay KSh ${selectedInvoice.amount.toLocaleString()}`}
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

export default Payments;
