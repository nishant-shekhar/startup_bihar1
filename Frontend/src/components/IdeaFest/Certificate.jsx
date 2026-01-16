// src/pages/Certificate.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import BgExpanded from "../../assets/bg_expanded.png";
import Newcertificate from "../../assets/cert.jpeg";    // certificate background art
import Nitishsign from "../../assets/sign.jpeg";        // signature image

const fetchUser = async (id) => {
  try {
    const { data } = await axios.get(`https://api.example.com/user/${id}`);
    return data;
  } catch {
    // Fallback demo data
    return {
      id,
      name: "Rahul Sharma Singh",
      event: "IdeaFest 2025",
      role: "Participant",
      date: "Aug 20, 2025",
    };
  }
};

const Certificate = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const u = await fetchUser(id);
      if (mounted) setUser(u);
    })();
    return () => (mounted = false);
  }, [id]);

  const initials = useMemo(() => {
    if (!user?.name) return "IF";
    return user.name
      .split(" ")
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }, [user]);

  // Adaptive font size for long names
  const nameFontSize = useMemo(() => {
    const n = user?.name?.length || 0;
    if (n > 28) return 30;
    if (n > 22) return 36;
    if (n > 16) return 42;
    return 48;
  }, [user]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const scale = 2; // increase for sharper PDF
      const canvas = await html2canvas(certRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale,
      });
      const imgData = canvas.toDataURL("image/png");
      // 4:3 layout, a bit larger than your old 800x600 for quality
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1100, 825] });
      pdf.addImage(imgData, "PNG", 0, 0, 1100, 825);
      pdf.save(`IdeaFest_Certificate_${user?.id || id}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-bottom"
      style={{ backgroundImage: `url('/bg1.jpg')` }}
    >
     

      {/* Glass card container */}
      <div className="px-4 md:px-10 py-6 md:py-10">
        <div className="flex flex-col md:flex-row w-full min-h-[calc(100svh-5rem)] md:min-h-[calc(100vh-5rem)] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-white/20 backdrop-blur-sm">
          {/* Left: Profile + actions */}
          <aside className="w-full md:w-1/3 p-6 md:p-8 bg-white/20 backdrop-blur">
            {!user ? (
              <div className="animate-pulse">
                <div className="h-16 w-16 rounded-full bg-gray-200 mb-4" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
                <div className="h-10 bg-gray-200 rounded w-full mb-3" />
                <div className="h-10 bg-gray-200 rounded w-2/3" />
              </div>
            ) : (
              <>
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-900 text-white grid place-items-center text-xl font-semibold">
                    {initials}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-600">ID: {user.id}</div>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-6 grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Event</span>
                    <span className="font-medium text-gray-800">{user.event || "IdeaFest"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Role</span>
                    <span className="font-medium text-gray-800">{user.role || "Participant"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium text-gray-800">{user.date || "—"}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col gap-3">
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className={`group relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900/30 ${
                      downloading
                        ? "bg-gray-300 text-gray-600 cursor-wait"
                        : "bg-gray-900 text-white hover:bg-black"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      <path d="M12 16.5l4-4-1.5-1.5-1.75 1.75V3h-1.5v9.75L9.5 11 8 12.5l4 4z" />
                      <path d="M5 18h14v1.5H5z" />
                    </svg>
                    {downloading ? "Preparing PDF…" : "Download PDF"}
                  </button>

                  <a
                    href={`mailto:support@ideafest.example?subject=Certificate%20Help%20(${encodeURIComponent(
                      user.id || ""
                    )})`}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 font-semibold bg-white text-gray-800 border border-gray-200 hover:bg-gray-50"
                  >
                    Need help?
                  </a>
                </div>
              </>
            )}
          </aside>

          {/* Right: Certificate Preview */}
            <div
                 ref={certRef}
                 className="w-[800px] h-[600px] rounded-2xl overflow-hidden mx-auto my-10 bg-white flex items-center justify-center relative shadow-2xl"
               >
                 {/* Certificate Background */}
                 <img
                   src={Newcertificate}
                   alt="Certificate Background"
                   className="w-full h-full object-cover absolute top-0 left-0 z-0"
                 />
         
                 {user && (
                   <>
                     
                     <div
                       className="absolute z-10 font-bold text-[32px] text-[#1F2937] tracking-wider"
                       style={{ top: "45%", left: "50%", transform: "translate(-50%, -50%)" }}
                     >
                       {user.name}
                     </div>
         
                    
                     <img
                       src={Nitishsign}
                       alt="Signature"
                       className="absolute z-10 w-[120px] right-[50px] bottom-[160px]"
                     />
                   </>
                 )}
               </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
