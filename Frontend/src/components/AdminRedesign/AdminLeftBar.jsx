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
  FilePlus,
  UserCheck,
  CalendarCheck,
  Award,
  CalendarClock,
  ClipboardCheck,
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
        { label: 'Dashboard', icon: <LayoutDashboard size={16} />, badge: null },
      ],
    },
    {
      category: 'New Application Module',
      items: [
        { label: 'New Application', icon: <FilePlus size={16} />, badge: '12' },
        { label: 'Expert Review', icon: <UserCheck size={16} />, badge: '5' },
        { label: 'Assign Exam Date', icon: <CalendarCheck size={16} />, badge: null },
        { label: 'Assign Marks', icon: <Award size={16} />, badge: null },
        { label: 'Assign PI Date', icon: <CalendarClock size={16} />, badge: null },
        { label: 'Assign PI Marks', icon: <ClipboardCheck size={16} />, badge: null },

        {
          label: 'Data Analytics', icon:
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
            </svg>
          , badge: null
        },

      ],
    },
    {
      category: 'Startup Modules',
      items: [
        { label: 'Startup Profile', icon: <Building size={16} />, badge: null },
        { label: 'Startup List', icon: <FileText size={16} />, badge: '48' },
        { label: 'Startup Progress Report', icon: <FileText size={16} />, badge: null },
        { label: 'Register New Startups', icon: <PlusSquare size={16} />, badge: null },
        { label: 'Update Startup', icon: <Edit3 size={16} />, badge: null },
      ],
    },
    {
      category: 'Funding Modules',
      items: [
        { label: 'Seed Fund Module', icon: <DollarSign size={16} />, badge: null },
        { label: 'Second Tranche Module', icon: <TrendingUp size={16} />, badge: null },
        { label: 'Post Seed Fund Module', icon: <BarChart3 size={16} />, badge: null },
        { label: 'Matching Loan', icon: <Handshake size={16} />, badge: null },
      ],
    },
    {
      category: 'Support Tools',
      items: [
        { label: 'Incubation Module', icon: <Briefcase size={16} />, badge: null },
        { label: 'Acceleration Programme Module', icon: <Rocket size={16} />, badge: null },
        { label: 'IPR Reimbursement Module', icon: <BadgeCheck size={16} />, badge: null },
        { label: 'Coworking Module', icon: <Building size={16} />, badge: null },
        { label: 'CoWorking Map', icon: <MapPin size={16} />, badge: null },
        { label: 'Mentors List', icon: <Users size={16} />, badge: '23' },
      ],
    },
    {
      category: 'Utilities & Updates',
      items: [
        { label: 'Data Mining', icon: <Database size={16} />, badge: null },
        { label: 'Grievance Redressal System', icon: <HelpCircle size={16} />, badge: '3' },
      ],
    },
  ];

  return (
    <aside className="w-full md:w-64 h-screen bg-white flex flex-col border-r border-gray-200">
      {/* Header Section - More subtle */}
      <div className="flex items-center gap-3 border-b border-gray-200 p-4 bg-gray-50">
        <div className=" p-1.5 rounded-lg flex items-center justify-center">
          <img
            src="/startup_bihar_logo1.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-gray-900">Startup Admin</h1>
          <div className="flex items-center text-[11px] text-gray-500 gap-1 mt-0.5">
            <Clock3 size={11} className="text-gray-400" />
            <span>{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* Menu Sections - Compact and subtle */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <div className="flex-1 overflow-y-auto p-3 space-y-5 hide-scrollbar">
        {categorizedMenu.map(({ category, items }) => (
          <div key={category}>
            <h2 className="text-[10px] uppercase text-gray-400 font-semibold mb-2 pl-2 tracking-wide">
              {category}
            </h2>
            <div className="space-y-0.5">
              {items.map(({ label, icon, badge }) => (
                <button
                  key={label}
                  onClick={() => {
                    setActiveLabel(label);
                    changePanel(label);
                  }}
                  className={`group flex items-center w-full text-left gap-2.5 px-3 py-2 rounded-lg transition-all duration-150
                    ${activeLabel === label
                      ? 'bg-blue-50 text-blue-600 border border-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  {/* Icon */}
                  <span className="flex-shrink-0">
                    {icon}
                  </span>

                  {/* Label */}
                  <span className="text-[13px] font-medium flex-1 truncate">
                    {label}
                  </span>

                  {/* Badge - More subtle */}
                  {badge && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md min-w-[18px] text-center
                      ${activeLabel === label
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}>
                      {badge}
                    </span>
                  )}
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
