import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Building,
  FileText,
  DollarSign,
  TrendingUp,
  BarChart3,
  Handshake,
  Briefcase,
  Rocket,
  BadgeCheck,
  MapPin,
  Database,
  Users,
  PlusSquare,
  Edit3,
  HelpCircle,
  Clock3,
} from 'lucide-react';
import { FaLightbulb } from 'react-icons/fa';

const AdminLeftbar = ({ changePanel }) => {
  const [startTime] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState('');
const [activeLabel, setActiveLabel] = useState("Dashboard");

  const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = now - startTime;
      const remaining = SESSION_DURATION - elapsed;

      if (remaining <= 0) {
        setTimeLeft('Session expired');
        clearInterval(interval);
      } else {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s left`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // 🧭 Categorized menu structure
  const categorizedMenu = [
    {
      category: 'Dashboard',
      items: [
        { label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      ],
    },
    {
      category: 'Startup Modules',
      items: [
        { label: 'Startup Profile', icon: <Building size={18} /> },
        { label: 'Startup List', icon: <FileText size={18} /> },
        { label: 'Startup Progress Report', icon: <FileText size={18} /> },
        { label: 'Register New Startups', icon: <PlusSquare size={18} /> },
        { label: 'Update Startup', icon: <Edit3 size={18} /> },
      ],
    },
    {
      category: 'Funding Modules',
      items: [
        { label: 'Seed Fund Module', icon: <DollarSign size={18} /> },
        { label: 'Second Tranche Module', icon: <TrendingUp size={18} /> },
        { label: 'Post Seed Fund Module', icon: <BarChart3 size={18} /> },
        { label: 'Matching Loan', icon: <Handshake size={18} /> },
      ],
    },
    {
      category: 'Support Tools',
      items: [
        { label: 'Incubation Module', icon: <Briefcase size={18} /> },
        { label: 'Acceleration Programme Module', icon: <Rocket size={18} /> },
        { label: 'IPR Reimbursement Module', icon: <BadgeCheck size={18} /> },
        { label: 'Coworking Module', icon: <Building size={18} /> },
        { label: 'CoWorking Map', icon: <MapPin size={18} /> },
        { label: 'Mentors List', icon: <Users size={18} /> },
      ],
    },
    {
      category: 'Utilities & Updates',
      items: [
        { label: 'Data Mining', icon: <Database size={18} /> },
        { label: 'Grievance Redressal System', icon: <HelpCircle size={18} /> },
      ],
    },
  ];

  return (
    <aside className="w-full md:w-72 h-screen bg-white text-white flex flex-col border-r border-gray-300 shadow-lg">
      {/* Header Section */}
      <div className="flex items-center gap-4 border-b border-gray-300 p-4">
        <div className="bg-white border drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-1 rounded-xl w-12 h-12 flex items-center justify-center">
          <img
            src="/startup.png"
            alt="Logo"
            className=""
          />
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-800">Startup Admin</h1>
          <div className="flex items-center text-xs text-gray-400 gap-1 mt-1">
            <Clock3 size={14} className="text-gray-400" />
            <span>{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {categorizedMenu.map(({ category, items }) => (
          <div key={category}>
            <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2 pl-2 tracking-wide">
              {category}
            </h2>
            <div className="space-y-1">
              {items.map(({ label, icon }) => (
  <button
    key={label}
    onClick={() => {
      setActiveLabel(label);
      changePanel(label);
    }}
    className={`flex items-center w-full text-left gap-3 px-4 py-2 rounded-xl transition-all
      ${activeLabel === label
        ? "bg-gray-800 text-white"
        : "text-gray-800 hover:bg-gray-800 hover:text-white"}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </button>
))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default AdminLeftbar;
