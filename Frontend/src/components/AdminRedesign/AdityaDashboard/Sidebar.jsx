import { LayoutDashboard, UserRoundCog, Cog } from 'lucide-react';
 // Make sure you have a logo at this path or update accordingly

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Profile", icon: UserRoundCog },
    { label: "Settings", icon: Cog },
  ];

  return (
    <div className="w-64 h-screen bg-gray-100 shadow-lg p-4 ">
      {/* 🔥 Header with Logo + Text */}
      <div className="flex items-center gap-3 p-3 mb-6  rounded-full bg-white/10 backdrop-blur-md ">
        <img src="/4.png" alt="Startup Bihar Logo" className="w-8 h-8 object-contain" />
        <h2 className="text-xl font-bold text-gray-800">Startup Bihar</h2>
      </div>

      <ul className="space-y-3">
        {menuItems.map(({ label, icon: Icon }) => {
          const isActive = activePage === label;

          return (
            <li
              key={label}
              className={`flex items-center gap-3 cursor-pointer px-4 py-2 rounded-full transition-all duration-200 ${
                isActive
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                  : "hover:bg-gray-200 text-black"
              }`}
              onClick={() => setActivePage(label)}
            >
              <div
                className={`p-2 rounded-full ${
                  isActive
                    ? "text-white bg-white/10 backdrop-blur-md border border-white/20"
                    : "text-black bg-white border border-gray-300"
                }`}
              >
                <Icon size={18} />
              </div>
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
