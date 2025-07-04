
import {
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  BadgeCheck,
  Clock,
  Users,
  CalendarDays,
  Ticket,
} from "lucide-react";



import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, // ✅ required for Doughnut & Pie
  Tooltip,
  PointElement,
  LineElement,
  Title,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement, 
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Title
);

const chartDataRevenue = {
  labels: [
    "₹50K–1L",
    "₹1L–3L",
    "₹3L–5L",
    "₹5L–10L",
    "₹10L–15L",
    "₹15L–20L",
    "₹20L–50L",

    "₹50L–1Cr",
    "₹1Cr–3Cr",
,
    "₹3Cr–5Cr",
    "5Cr+",

  ],
  datasets: [
    {
      label: "Number of Companies",
      data: [8, 14, 16, 12, 11, 10, 9, 13, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2], // Example data
      fill: true,
      backgroundColor: "rgba(139, 92, 246, 0.2)",
      borderColor: "#8b5cf6",
      tension: 0.4,
      pointRadius: 4,
    },
  ],
};

const chartOptionsRevenue = {
  responsive: true,
  maintainAspectRatio: false, // Important!
  plugins: {
    legend: { position: "top" },
    title: {
      display: true,
      text: "",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Number of Companies",
      },
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 30,
      },
      title: {
        display: true,
        text: "Revenue Range (INR)",
      },
    },
  },
};



const doughnutData = {
  labels: ["Occupied", "Available"],
  datasets: [
    {
      label: "Applications",
      data: [340, 80],
      backgroundColor: [ "#8b5cf6", "#34d399"],
      borderWidth: 2,
      borderColor: "#fff",
      hoverOffset: 6,
    },
  ],
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%", // Optional: Makes it look like a ring
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 10,
        color: "#4b5563",
        font: {
          size: 10,
        },
      },
    },
    tooltip: {
      enabled: true,
      callbacks: {
        label: function (context) {
          const label = context.label || '';
          const value = context.raw || 0;
          return `${label}: ${value}`;
        },
      },
    },
  },
  layout: {
    padding: 0,
  },
  // ❌ Hide all unnecessary elements
  scales: {
    x: {
      display: false,
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        display: false,
      },
    },
  },
};


const chartData = {
  labels: ["Seed Fund", "Second Tranche", "Post Seed Fund", "Matching Loan"],
  datasets: [
    {
      label: "Received",
      data: [200, 110, 60, 50],
      backgroundColor: "#8b5cf6", // purple
      borderRadius: 5,
    },
    
    {
      label: "Ongoing",
      data: [45, 25, 15, 13],
      backgroundColor: "#fbbf24", // yellow
      borderRadius: 5,
    },
    {
      label: "Approved",
      data: [150, 82, 39, 32],
      backgroundColor: "#34d399", // green
      borderRadius: 5,
    },
    {
      label: "Rejected",
      data: [5, 3, 4, 5],
      backgroundColor: "#f87171", // red
      borderRadius: 5,
    },
  ],
};



const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      
      labels: {
        boxWidth: 10,
        color: "#4b5563",
        usePointStyle: true,
      pointStyle: '',
        font: {
          size: 10,
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: "false",
      },
      ticks: {
        color: "#6b7280",
      },
    },
    y: {
      grid: {
        color: "#e5e7eb",
      },
      ticks: {
        color: "#6b7280",
      },
    },
  },
};

const chartDataEmployee = {
  labels: [
    "0-1 Employees",
    "1-5 Employees",
    "6-10 Employees",
    "11-20 Employees",
    "21-30 Employees",
    "31-40 Employees",
    "41-50 Employees"
  ],
  datasets: [
    {
      label: "Companies Count",
      data: [10, 25, 40, 60, 45, 30, 15],
      backgroundColor: "#3b82f6", // blue
      borderRadius: 5,
    },
  ],
};





const chartOptionsEmployee = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      
      labels: {
        boxWidth: 10,
        color: "#4b5563",
        usePointStyle: true,
      pointStyle: '',
        font: {
          size: 10,
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: "false",
      },
      ticks: {
        color: "#6b7280",
      },
    },
    y: {
      grid: {
        color: "#e5e7eb",
      },
      ticks: {
        color: "#6b7280",
      },
    },
  },
};


const DashboardPage = () => {
  return (
    <div className="  ">
  
      {/* Top 40% */}
     <div className="gap-4  p-8 flex flex-col">

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
  {/* Card 1 */}
  <div className="bg-white/70 backdrop-blur-md border border-gray-100/90 rounded-3xl p-5 relative overflow-hidden drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
    {/* Icon Top Right */}
    <div className="absolute top-4 right-4 text-purple-500 ">
      <Building2 className="" size={24} />
    </div>

    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Startup</h3>
    <p className="text-3xl font-bold text-purple-700 mb-2">1540</p>

    {/* Trend Section */}
    <div className="flex items-center gap-2 text-sm text-green-600">
      <ArrowUpRight  size={16} />
      <span>450 increase</span>
      <span className="text-gray-400 ml-auto text-xs">June 2025</span>
    </div>
  </div>

  {/* Card 2 */}
  <div className="bg-white/70 backdrop-blur-md  border-gray-100/90 rounded-3xl p-5 border border-gray-200 relative overflow-hidden drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
    <div className="absolute top-4 right-4 text-green-500">
      <BadgeCheck size={24} />
    </div>

    <h3 className="text-sm font-medium text-gray-500 mb-1">Fund Disbursed</h3>
    <p className="text-3xl font-bold text-green-700 mb-2">₹75 Cr</p>

    <div className="flex items-center gap-2 text-sm text-green-600">
      <ArrowUpRight size={16} />
      <span>5.7% increase</span>
      <span className="text-gray-400 ml-auto text-xs">June 2025</span>
    </div>
  </div>

  {/* Card 3 */}
  <div className="bg-white/70 backdrop-blur-md  border-gray-100/90 rounded-3xl p-5  border border-gray-200 relative overflow-hidden drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
    <div className="absolute top-4 right-4 text-yellow-500">
      <Clock size={24} />
    </div>

    <h3 className="text-sm font-medium text-gray-500 mb-1">DPIIT Resgistered Startups</h3>
    <p className="text-3xl font-bold text-yellow-600 mb-2">3500+</p>

    <div className="flex items-center gap-2 text-sm text-green-600">
      <ArrowUpRight size={16} />
      <span>42 increase</span>
      <span className="text-gray-400 ml-auto text-xs">Last Week</span>
    </div>
  </div>

  {/* Card 4 */}
  <div className="bg-white/70 backdrop-blur-md border-gray-100/90 rounded-3xl p-5 border border-gray-200 relative overflow-hidden drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
    <div className="absolute top-4 right-4 text-blue-500">
      <Ticket size={24} />
    </div>

    <h3 className="text-sm font-medium text-gray-500 mb-1">Events Conducted</h3>
    <p className="text-3xl font-bold text-blue-700 mb-2">850+</p>

    <div className="flex items-center gap-2 text-sm text-green-600">
      <ArrowUpRight size={16} />
      <span>15 increase</span>
      <span className="text-gray-400 ml-auto text-xs">Today</span>
    </div>
  </div>
</div>
      


<div className="flex flex-col md:flex-row gap-4 mt-4">
      {/* Bottom 60% */}
     <div className="w-3/5 bg-white/70 backdrop-blur-md  border-gray-100/90 border rounded-3xl p-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]  flex flex-col">
  {/* Header */}
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-2 text-lg font-semibold">

      <span className=" text-gray-700 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">Application Analytics</span>
    </div>

    {/* Filter Buttons */}
    <div className="flex gap-2">
      {["All", "1M", "1Y"].map((label) => (
        <button
          key={label}
          className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-full border-gray-300 text-sm hover:bg-purple-500 hover:text-white text-gray-600"
        >
          {label}
        </button>
      ))}
    </div>
  </div>

  {/* Chart */}
  {/* <div className="flex-1">
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Approved" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Rejected" fill="#f87171" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Ongoing" fill="#fbbf24" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Received" fill="#34d399" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div> */}
<div className="w-full" style={{ height: "240px" }}>
  <Bar data={chartData} options={chartOptions} />
</div>

  
</div>

        {/* Right 40% */}
        <div className="w-2/5 bg-white/70 backdrop-blur-md  border-gray-100/90 border drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-3xl p-4 ">
        <div className="flex items-center gap-2 text-lg font-semibold">

      <span className=" text-gray-700 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">Co-working Seat</span>
    </div>
          <div className="w-full" style={{ height: "240px" }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
        
    </div>
    <div className=" text-lg font-semibold bg-white/70 backdrop-blur-md  border-gray-100/90 border drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-3xl p-4 ">
    <div className="flex justify-between items-center mb-4">
  
     <span className=" text-gray-700 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">Employee Analytics</span>
     </div>
    <div className="w-full" style={{ height: "240px" }}>
  <Bar data={chartDataEmployee} options={chartOptionsEmployee} />
</div>

</div>
    <div className="text-lg font-semibold bg-white/70 backdrop-blur-md border-gray-100/90 border drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] rounded-3xl p-4">
  <div className="flex justify-between items-center mb-4">
    <span className="text-gray-700 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      Revenue Analytics
    </span>
  </div>
  <div className="w-full h-64"> {/* Adjust height as needed */}
    <Line data={chartDataRevenue} options={chartOptionsRevenue} />
  </div>
</div>
  </div>


  
</div>
  );
};

export default DashboardPage;
