// ApplicationAnalytics.jsx
import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Award,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  FileCheck,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const batchesData = [
  {
    id: 1,
    month: "January",
    year: 2025,
    totalApplications: 245,
    status: "completed",
    data: {
      applicationsReceived: 245,
      reviewed: 245,
      totalExpertReviewed: 200,
      rejectRound1: 45,
      expertAccepted: 155,
      expertRejected: 45,
      piQualified: 130,
      piRejected: 25,
      writtenAccepted: 110,
      writtenRejected: 20,
      startupAccepted: 95,
    },
  },
  {
    id: 2,
    month: "February",
    year: 2025,
    totalApplications: 312,
    status: "completed",
    data: {
      applicationsReceived: 312,
      reviewed: 290,
      totalExpertReviewed: 260,
      rejectRound1: 52,
      expertAccepted: 208,
      expertRejected: 52,
      piQualified: 180,
      piRejected: 28,
      writtenAccepted: 155,
      writtenRejected: 25,
      startupAccepted: 135,
    },
  },
  {
    id: 3,
    month: "March",
    year: 2025,
    totalApplications: 428,
    status: "completed",
    data: {
      applicationsReceived: 428,
      reviewed: 400,
      totalExpertReviewed: 370,
      rejectRound1: 58,
      expertAccepted: 312,
      expertRejected: 58,
      piQualified: 270,
      piRejected: 42,
      writtenAccepted: 230,
      writtenRejected: 40,
      startupAccepted: 200,
    },
  },
  {
    id: 4,
    month: "April",
    year: 2025,
    totalApplications: 385,
    status: "in-progress",
    data: {
      applicationsReceived: 385,
      reviewed: 340,
      totalExpertReviewed: 310,
      rejectRound1: 45,
      expertAccepted: 265,
      expertRejected: 45,
      piQualified: 220,
      piRejected: 45,
      writtenAccepted: 180,
      writtenRejected: 40,
      startupAccepted: 155,
    },
  },
  {
    id: 5,
    month: "May",
    year: 2025,
    totalApplications: 456,
    status: "in-progress",
    data: {
      applicationsReceived: 456,
      reviewed: 380,
      totalExpertReviewed: 350,
      rejectRound1: 76,
      expertAccepted: 274,
      expertRejected: 76,
      piQualified: 230,
      piRejected: 44,
      writtenAccepted: 195,
      writtenRejected: 35,
      startupAccepted: 165,
    },
  },
  {
    id: 6,
    month: "June",
    year: 2025,
    totalApplications: 523,
    status: "ongoing",
    data: {
      applicationsReceived: 523,
      reviewed: 450,
      totalExpertReviewed: 400,
      rejectRound1: 73,
      expertAccepted: 327,
      expertRejected: 73,
      piQualified: 280,
      piRejected: 47,
      writtenAccepted: 240,
      writtenRejected: 40,
      startupAccepted: 210,
    },
  },
];

const DataAnylatics = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);


  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-700 border-green-300",
      "in-progress": "bg-blue-100 text-blue-700 border-blue-300",
      ongoing: "bg-purple-100 text-purple-700 border-purple-300",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };


  if (!selectedBatch) {
    return (
      <div className="p-6 min-h-screen">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Application Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a batch to view detailed analytics
          </p>
        </div>


        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Applications</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Accepted</th>
              </tr>
            </thead>
            <tbody

              className="divide-y divide-gray-200">
              {batchesData.map((batch) => (
                <tr
                  onClick={() => setSelectedBatch(batch)}
                  key={batch.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-50 p-2 rounded-lg">
                        <Calendar className="text-purple-600" size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{batch.month}</p>
                        <p className="text-xs text-gray-500">{batch.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {batch.totalApplications}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-700 font-medium">
                    {batch.data.startupAccepted}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }


  const data = selectedBatch.data;


  const combinedChartData = {
    labels: [
      "Applications Received",
      "Round 1 Reviewed",
      "Round 1 Accepted",
      "Expert Reviewed",
      "Expert Accepted",
      "Qualified for written",
      "Appeared for written",
      "Passed written",
      "PI Qualified",
      "Passed PI",
      "Startup Accepted",
    ],
    datasets: [
      {
        label: "Count",
        data: [
          data.applicationsReceived,
          data.reviewed,
          data.totalExpertReviewed,
          data.rejectRound1,
          data.expertAccepted,
          data.expertRejected,
          data.piQualified,
          data.piRejected,
          data.writtenAccepted,
          data.writtenRejected,
          data.startupAccepted,
        ],
        backgroundColor: [
          "#8b5cf6",
          "#fbbf24",
          "#8b5cf6",
          "#f87171",
          "#10b981",
          "#f87171",
          "#10b981",
          "#f87171",
          "#10b981", // Green
          "#f87171", // Red
          "#10b981", // Emerald
        ],
        borderRadius: 8,
        barThickness: 50
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 8,
          color: "#4b5563",
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 11,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#e5e7eb",
        },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: { size: 11 },
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => setSelectedBatch(null)}
        className="flex items-center gap-2 px-4 py-2 mb-6 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors border border-purple-200"
      >
        <ArrowLeft size={18} />
        Back to Batches
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {selectedBatch.month} {selectedBatch.year} - Analytics Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Detailed breakdown of application metrics
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pb-10">
        <div className="bg-white/70 border border-purple-200 rounded-3xl p-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow">
          <h3 className="text-sm font-semibold text-purple-700 mb-2">
            Total Applications
          </h3>
          <p className="text-4xl font-bold text-purple-900">
            {data.applicationsReceived}
          </p>
        </div>

        <div className="bg-white/70 border border-purple-200 rounded-3xl p-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow">
          <h3 className="text-sm font-semibold text-green-700 mb-2">
            Final Accepted
          </h3>
          <p className="text-4xl font-bold text-green-900">
            {data.startupAccepted}
          </p>
          <p className="text-xs text-green-600 mt-2">
            {((data.startupAccepted / data.applicationsReceived) * 100).toFixed(
              1
            )}
            %
          </p>
        </div>

        <div className="bg-white/70 border border-purple-200 rounded-3xl p-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow">
          <h3 className="text-sm font-semibold text-red-700 mb-2">
            Total Rejected
          </h3>
          <p className="text-4xl font-bold text-red-900">
            {data.applicationsReceived - data.startupAccepted}
          </p>
          <p className="text-xs text-red-600 mt-2">
            {(
              ((data.applicationsReceived - data.startupAccepted) /
                data.applicationsReceived) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>

      {/* Single Combined Bar Graph Card */}
      <div className="bg-white/70 backdrop-blur-md border border-gray-100/90 rounded-3xl p-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-xl transition-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Application Metrics Overview
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete breakdown of all stages
            </p>
          </div>
        </div>

        {/* Combined Bar Chart */}
        <div className="w-full" style={{ height: "500px" }}>
          <Bar data={combinedChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default DataAnylatics;
