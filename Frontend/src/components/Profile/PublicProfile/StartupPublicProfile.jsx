import React from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGlobe,
  FaArrowLeft,
  FaEdit,
  FaLink,
  FaUsers,
  FaStar,
  FaMoneyBillWave,
  FaChartBar,
} from "react-icons/fa";
import { IoMdContact } from "react-icons/io";

import ShowcaseCard from "./ShowcaseCard";
import EmployeeDetails from "../StartupProfile/FieldsUpdate/EmployeeDetails";

/* ── Responsive helper ── */
const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
};

/* ─── Design tokens (FourthPage palette) ─── */
const P = "#000000";
const PL = "#eef2ff";
const BORDER = "#e8ecf0";
const TEXT = "#090E34";
const MUTED = "#959CB1";
const CARD = "#ffffff";
const BG = "#f4f6f9";

const cardBase = {
  background: CARD,
  borderRadius: "12px",
  border: `1px solid ${BORDER}`,
  boxShadow: "0 2px 12px rgba(74,108,247,0.06)",
};

/* ─── Stat Icon Wrappers ─── */
const StatIcon = ({ bg, children }) => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: 10,
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      color: "#fff",
    }}
  >
    {children}
  </div>
);

/* ════════════════════════════════════ */
const StartupPublicProfile = () => {
  const { id } = useParams();
  const vw = useWindowWidth();
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;

  const [startup, setStartup] = useState([]);
  const [showcases, setShowcases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactVisible, setIsContactVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);

  const categories = ["Overview", "About Startup", "Showcase"];
  const [selectedCategory, setSelectedCategory] = useState("Overview");

  const handleCategoryClick = (cat) => setSelectedCategory(cat);

  const getWebsiteUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `https://${url}`;
  };

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `https://startupbihar.in/api/userlogin/public-startup-details?user_id=${id}`,
      );
      setStartup(response.data.startup);

      const showcaseResponse = await axios.get(
        `https://startupbihar.in/api/showcase/get-showcase/${id}`,
      );
      setShowcases(showcaseResponse.data.showcase);

      const employeeResponse = await axios.get(
        `https://startupbihar.in/api/userlogin/getEmployees/${id}`,
      );
      setEmployees(employeeResponse.data.employee);
      console.log(employeeResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setIsLoading(false);
    }
  };
  console.log(showcases.id);

  useEffect(() => {
    fetchDetails();
  }, []);

  const SocialLink = ({ href, Icon, label, hoverColor }) => (
    <a
      href={href || "#"}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#f0f2ff",
        border: `1.5px solid ${BORDER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: P,
        fontSize: 13,
        textDecoration: "none",
        transition: "all 0.15s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = hoverColor + "18";
        e.currentTarget.style.color = hoverColor;
        e.currentTarget.style.borderColor = hoverColor + "55";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = "#f0f2ff";
        e.currentTarget.style.color = P;
        e.currentTarget.style.borderColor = BORDER;
      }}
    >
      <Icon />
    </a>
  );

  /* ══ Stats data ══ */
  const stats = [
    {
      label: "Work Orders",
      value: startup.workOrders || "—",
      icon: <FaMoneyBillWave />,
      bg: "#4A6CF7",
    },
    {
      label: "Total Employees",
      value: startup.employeeCount || "—",
      icon: <FaUsers />,
      bg: "#4A6CF7",
    },
    {
      label: "Total Projects",
      value: startup.projects || "—",
      icon: <FaChartBar />,
      bg: "#4A6CF7",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ── Decorative SVG Background ── */}
      <svg
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Blob gradients */}
          <radialGradient id="blob1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c7d7fd" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#c7d7fd" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ddd6fe" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blob4" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0" />
          </radialGradient>
          {/* Dot pattern */}
          <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#090E34" fillOpacity="0.045" />
          </pattern>
        </defs>

        {/* Dot grid — full page */}
        <rect width="100%" height="100%" fill="url(#dots)" />

        {/* Blob 1 — top-left */}
        <ellipse cx="-6%" cy="12%" rx="38%" ry="32%" fill="url(#blob1)" />

        {/* Blob 2 — top-right */}
        <ellipse cx="106%" cy="8%" rx="42%" ry="36%" fill="url(#blob2)" />

        {/* Blob 3 — bottom-left */}
        <ellipse cx="10%" cy="96%" rx="34%" ry="28%" fill="url(#blob3)" />

        {/* Blob 4 — center-right */}
        <ellipse cx="88%" cy="62%" rx="30%" ry="26%" fill="url(#blob4)" />

        {/* Thin arc ring — top-right decoration */}
        <circle
          cx="92%" cy="18%" r="120"
          fill="none"
          stroke="#4A6CF7"
          strokeOpacity="0.07"
          strokeWidth="1"
        />
        <circle
          cx="92%" cy="18%" r="190"
          fill="none"
          stroke="#4A6CF7"
          strokeOpacity="0.04"
          strokeWidth="1"
        />

        {/* Thin arc ring — bottom-left decoration */}
        <circle
          cx="8%" cy="88%" r="100"
          fill="none"
          stroke="#7c3aed"
          strokeOpacity="0.07"
          strokeWidth="1"
        />
        <circle
          cx="8%" cy="88%" r="160"
          fill="none"
          stroke="#7c3aed"
          strokeOpacity="0.04"
          strokeWidth="1"
        />

        {/* Diagonal hairline — subtle depth */}
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#4A6CF7" strokeOpacity="0.025" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#4A6CF7" strokeOpacity="0.018" strokeWidth="1" />
      </svg>

      {/* All page content sits above the SVG */}
      <div style={{ position: "relative", zIndex: 1 }}>
      {/* ── Cover Banner ── */}
      <div style={{ height: isMobile ? 150 : 220, overflow: "hidden", position: "relative" }}>
        <img
          src={
            startup.founder_dp ||
            "https://firebasestorage.googleapis.com/v0/b/iimv-ae907.appspot.com/o/Website%2Fcover_pic.png?alt=media&token=2f48030e-daa7-4e20-80c5-218bd6a93a25"
          }
          alt="Cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(9,14,52,0.35) 100%)",
          }}
        />
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          style={{
            position: "absolute",
            top: 18,
            left: 18,
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: TEXT,
            fontSize: 15,
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          }}
        >
          <FaArrowLeft />
        </button>
        {/* Go to website pill */}
        <a
          href={getWebsiteUrl(startup.website)}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            padding: "8px 18px",
            borderRadius: 100,
            background: "rgba(255,255,255,0.92)",
            border: "none",
            color: P,
            fontWeight: 700,
            fontSize: 13,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <FaGlobe style={{ fontSize: 12 }} /> Go to website
        </a>
      </div>

      {/* ── Page Layout ── */}
      <div
        style={{
          maxWidth: 1160,
          margin: "0 auto",
          padding: isMobile ? "0 12px 40px" : "0 20px 60px",
          display: "flex",
          flexDirection: isMobile || isTablet ? "column" : "row",
          gap: isMobile ? 14 : 20,
          alignItems: "flex-start",
        }}
      >
        {/* ════ MAIN COLUMN ════ */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* ── Profile Card ── */}
          <div
            style={{
              ...cardBase,
              marginTop: isMobile ? -36 : -56,
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Top row: logo + action buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                padding: "20px 28px 0",
              }}
            >
              {/* Circular Logo */}
              <div
                style={{
                  width: isMobile ? 64 : 84,
                  height: isMobile ? 64 : 84,
                  borderRadius: "50%",
                  flexShrink: 0,
                  border: `4px solid ${CARD}`,
                  boxShadow: "0 4px 20px rgba(74,108,247,0.22)",
                  overflow: "hidden",
                  background: "#090E34",
                  marginTop: isMobile ? -32 : -48,
                }}
              >
                <img
                  src={
                    startup.logo ||
                    "https://dummyimage.com/100x100/090E34/fff.png&text=S"
                  }
                  alt="Logo"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              {/* Buttons */}
              <div style={{ display: "flex", gap: 10, paddingTop: 10 }}>
                <button
                  onClick={() => setIsContactVisible(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 20px",
                    borderRadius: 8,
                    border: `1.5px solid ${BORDER}`,
                    background: CARD,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: TEXT,
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.borderColor = P)}
                  onMouseOut={(e) =>
                    (e.currentTarget.style.borderColor = BORDER)
                  }
                >
                  <IoMdContact style={{ color: P, fontSize: 13 }} /> View
                  Contact
                </button>
                <a
                  href={getWebsiteUrl(startup.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    border: `1.5px solid ${BORDER}`,
                    background: CARD,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: MUTED,
                    fontSize: 15,
                    textDecoration: "none",
                    transition: "all 0.15s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = P;
                    e.currentTarget.style.color = P;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = BORDER;
                    e.currentTarget.style.color = MUTED;
                  }}
                >
                  <FaLink />
                </a>
              </div>
            </div>

            {/* Info block */}
            <div style={{ padding: isMobile ? "12px 16px 0" : "14px 28px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <h1
                  style={{
                    fontSize: isMobile ? 20 : 24,
                    fontWeight: 800,
                    color: TEXT,
                    letterSpacing: "-0.03em",
                    margin: 0,
                  }}
                >
                  {startup.company_name}
                </h1>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 10px",
                    borderRadius: 100,
                    background: "linear-gradient(130deg,#7c3aed,#a855f7)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                  }}
                >
                  <svg style={{ width: 9, height: 9 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Top Startup
                </span>
              </div>
              {startup.founder_name && (
                <p
                  style={{
                    fontSize: 13.5,
                    color: MUTED,
                    margin: "0 0 8px",
                    fontWeight: 500,
                  }}
                >
                  {startup.address || "Bihar, India"}
                </p>
              )}
              <p
                style={{
                  fontSize: 14.5,
                  color: "#374151",
                  lineHeight: 1.65,
                  maxWidth: 580,
                  margin: "0 0 16px",
                }}
              >
                {startup.moto}
              </p>
              {/* Social links */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 18,
                }}
              >
                <SocialLink
                  href={startup.linkedin}
                  Icon={FaLinkedin}
                  label="LinkedIn"
                  hoverColor="#0a66c2"
                />
                <SocialLink
                  href={startup.twitter}
                  Icon={FaTwitter}
                  label="Twitter"
                  hoverColor="#1d9bf0"
                />
                <SocialLink
                  href={getWebsiteUrl(startup.website)}
                  Icon={FaGlobe}
                  label="Website"
                  hoverColor={P}
                />
                <SocialLink
                  href={startup.facebook}
                  Icon={FaFacebook}
                  label="Facebook"
                  hoverColor="#1877f2"
                />
                <SocialLink
                  href={startup.instagram}
                  Icon={FaInstagram}
                  label="Instagram"
                  hoverColor="#e1306c"
                />
              </div>
            </div>

            {/* ── Tab Bar ── */}
            <div
              style={{
                borderTop: `1px solid ${BORDER}`,
                padding: "0 28px",
                display: "flex",
                overflowX: "auto",
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  style={{
                    padding: "14px 4px",
                    marginRight: 28,
                    fontSize: 14,
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    color: selectedCategory === cat ? P : MUTED,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    borderBottom:
                      selectedCategory === cat
                        ? `3px solid ${P}`
                        : "3px solid transparent",
                    transition: "color 0.15s, border-color 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* ── Stats Row ── */}
          <div
            style={{
              ...cardBase,
              marginTop: 16,
              padding: isMobile ? "18px 16px" : "24px 28px",
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)",
              gap: isMobile ? 16 : 0,
            }}
          >
            {stats.map(({ label, value, icon, bg }, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  paddingLeft: isMobile ? 0 : (i > 0 ? 28 : 0),
                  paddingRight: isMobile ? 0 : (i < stats.length - 1 ? 28 : 0),
                  borderRight: isMobile ? "none" : (i < stats.length - 1 ? `1px solid ${BORDER}` : "none"),
                  borderBottom: isMobile ? `1px solid ${BORDER}` : "none",
                  paddingBottom: isMobile ? 12 : 0,
                }}
              >
                <StatIcon bg={bg}>{icon}</StatIcon>
                <span style={{ fontSize: 12.5, color: MUTED, fontWeight: 500 }}>
                  {label}
                </span>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: TEXT,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* ── Content Area ── */}
          <div style={{ ...cardBase, marginTop: 16, padding: "26px 28px" }}>
            {selectedCategory === "Overview" && (
              <>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: TEXT,
                    letterSpacing: "-0.025em",
                    margin: "0 0 14px",
                  }}
                >
                  About {startup.company_name}
                </h2>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    fontSize: 14.5,
                    color: "#374151",
                    lineHeight: 1.8,
                    letterSpacing: "-0.005em",
                    maxWidth: 660,
                  }}
                >
                  {startup.about || startup.moto}
                </p>
              </>
            )}

            {selectedCategory === "About Startup" && (
              <>
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: TEXT,
                    letterSpacing: "-0.025em",
                    marginBottom: 14,
                  }}
                >
                  About {startup.company_name}
                </h2>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    fontSize: 14.5,
                    color: "#374151",
                    lineHeight: 1.8,
                    letterSpacing: "-0.005em",
                    maxWidth: 660,
                  }}
                >
                  {startup.about}
                </p>
              </>
            )}

            {selectedCategory === "Showcase" && (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: TEXT,
                      letterSpacing: "-0.025em",
                      margin: 0,
                    }}
                  >
                    Showcase
                  </h2>
                  {showcases.length > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: P,
                        background: PL,
                        padding: "3px 10px",
                        borderRadius: 100,
                        border: `1px solid ${BORDER}`,
                      }}
                    >
                      {showcases.length} items
                    </span>
                  )}
                </div>
                {isLoading ? (
                  <div
                    style={{
                      padding: "48px 0",
                      textAlign: "center",
                      color: MUTED,
                      fontSize: 13,
                    }}
                  >
                    Loading…
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill,minmax(190px,1fr))",
                      gap: 16,
                    }}
                  >
                    {[...showcases].reverse().map((showcase, index) => (
                      <ShowcaseCard
                        key={index}
                        imgurl={showcase.picUrl}
                        dateandtime={showcase.date}
                        title={showcase.title}
                        subtitle={showcase.subtitle}
                        tag={showcase.location}
                        projectLink={showcase.projectLink}
                        delhidden={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ════ RIGHT SIDEBAR ════ */}
        <div
          style={{
            width: isMobile || isTablet ? "100%" : 280,
            flexShrink: 0,
            display: "flex",
            flexDirection: isMobile ? "column" : (isTablet ? "row" : "column"),
            flexWrap: isTablet ? "wrap" : "unset",
            gap: 16,
            paddingTop: isMobile || isTablet ? 0 : 16,
          }}
        >
          {/* Founder */}
          {startup.founder_name && (
            <div style={{ ...cardBase, padding: "20px", flex: isTablet ? "1 1 calc(50% - 8px)" : undefined }}>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: TEXT,
                  letterSpacing: "-0.02em",
                  margin: "0 0 14px",
                }}
              >
                Founder
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "#eef2ff",
                    border: `2px solid ${BORDER}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: P,
                    flexShrink: 0,
                  }}
                >
                  <FaUsers style={{ fontSize: 16 }} />
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 700,
                      color: TEXT,
                    }}
                  >
                    {startup.founder_name}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12.5,
                      color: MUTED,
                      fontWeight: 500,
                    }}
                  >
                    Founder & CEO
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Team */}
          <div style={{ ...cardBase, padding: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: TEXT,
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                Team
              </h3>
              {employees && employees.length > 0 && (
                <button
                  onClick={() => setShowEmployeeDetails(true)}
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: P,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  See all →
                </button>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                cursor: "pointer",
              }}
              onClick={() => setShowEmployeeDetails(true)}
            >
              {employees && employees.length > 0 ? (
                employees.slice(0, 12).map((employee, index) => (
                  <img
                    key={index}
                    alt={employee.name}
                    src={employee.dp}
                    title={employee.name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `2px solid ${CARD}`,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                ))
              ) : (
                <p style={{ fontSize: 13, color: MUTED }}>
                  No team members yet
                </p>
              )}
            </div>
          </div>

          {/* Locations */}
          <div style={{ ...cardBase, padding: "20px" }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: TEXT,
                letterSpacing: "-0.02em",
                margin: "0 0 12px",
              }}
            >
              Locations
            </h3>
            <p style={{ fontSize: 13.5, color: MUTED, margin: 0 }}>
              {startup.address || "Bihar, India"}
            </p>
          </div>

          {/* Quick Links */}
          <div style={{ ...cardBase, padding: "20px" }}>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: TEXT,
                letterSpacing: "-0.02em",
                margin: "0 0 12px",
              }}
            >
              Quick Links
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                {
                  label: "Website",
                  href: getWebsiteUrl(startup.website),
                  Icon: FaGlobe,
                },
                { label: "LinkedIn", href: startup.linkedin, Icon: FaLinkedin },
                { label: "Twitter", href: startup.twitter, Icon: FaTwitter },
                {
                  label: "Instagram",
                  href: startup.instagram,
                  Icon: FaInstagram,
                },
              ].map(({ label, href, Icon }, i) => (
                <a
                  key={i}
                  href={href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13.5,
                    color: TEXT,
                    fontWeight: 500,
                    textDecoration: "none",
                    padding: "7px 9px",
                    borderRadius: 8,
                    transition: "background 0.12s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = PL)}
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <span style={{ color: P, fontSize: 14 }}>
                    <Icon />
                  </span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Employee Details Modal ── */}
      {showEmployeeDetails && (
        <EmployeeDetails
          onClose={() => setShowEmployeeDetails(false)}
          deleteBtn={false}
          userId={id}
        />
      )}

      {/* ── Contact Modal ── */}
      {isContactVisible && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(9,14,52,0.42)",
              backdropFilter: "blur(5px)",
            }}
            onClick={() => setIsContactVisible(false)}
          />
          <div
            style={{
              position: "relative",
              zIndex: 10,
              background: CARD,
              borderRadius: 18,
              padding: "32px 32px 28px",
              width: "min(460px,92vw)",
              border: `1px solid ${BORDER}`,
              boxShadow:
                "0 24px 60px rgba(74,108,247,0.18), 0 4px 16px rgba(0,0,0,0.08)",
            }}
          >
            <button
              onClick={() => setIsContactVisible(false)}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 28,
                height: 28,
                borderRadius: 8,
                border: `1px solid ${BORDER}`,
                background: PL,
                cursor: "pointer",
                color: MUTED,
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: TEXT,
                letterSpacing: "-0.03em",
                marginBottom: 4,
              }}
            >
              {startup.company_name}
            </h2>
            <p
              style={{
                fontSize: 13,
                color: P,
                fontStyle: "italic",
                marginBottom: 22,
              }}
            >
              {startup.moto}
            </p>
            <div
              style={{
                background: PL,
                borderRadius: 12,
                border: `1px solid ${BORDER}`,
                padding: "16px 18px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  margin: 0,
                }}
              >
                Contact Details
              </p>
              {[
                {
                  label: "Phone",
                  value: startup.mobile,
                  href: `tel:${startup.mobile}`,
                },
                {
                  label: "Website",
                  value: startup.website,
                  href: startup.website || "#",
                },
                {
                  label: "Address",
                  value: startup.address,
                  href: startup.address || "#",
                },
              ].map(({ label, value, href }, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: MUTED,
                      fontWeight: 500,
                      minWidth: 58,
                    }}
                  >
                    {label}
                  </span>
                  <a
                    href={href}
                    style={{
                      fontSize: 13.5,
                      color: P,
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    {value || "—"}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>{/* end zIndex:1 content wrapper */}
    </div>
  );
};

export default StartupPublicProfile;
