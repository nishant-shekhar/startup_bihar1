import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";

import { Link as RouterLink } from "react-router-dom";

const NavBarNew = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);

      // Determine scroll direction
      if (window.scrollY > lastScrollY) {
        setVisible(false); // Scrolling down
      } else {
        setVisible(true); // Scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setMobileMenu((prev) => !prev);
  };

  /* ── Shared link style for desktop nav ── */
  const navLinkClass =
    "nav-link-base text-sm font-medium leading-6 cursor-pointer transition-colors duration-200";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          background: sticky ? "rgba(255, 255, 255, 0.92)" : "transparent",
          backdropFilter: sticky ? "blur(12px)" : "none",
          WebkitBackdropFilter: sticky ? "blur(12px)" : "none",
          boxShadow: sticky ? "0 2px 16px rgba(0,0,0,0.06)" : "none",
        }}
      >
        <nav className="nav-bar-base" aria-label="Global">
          {/* ── Logo ── */}
          <div className="flex items-center">
            <Link
              onClick={() => scroll.scrollToTop()}
              to="/"
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                className="h-10 w-auto"
                src="startup_bihar_logo1.png"
                alt="Startup Bihar Logo"
              />
            </Link>
          </div>

          {/* ── Desktop Menu ── */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8">
            <ScrollLink
              to="startups"
              smooth={true}
              offset={-50}
              duration={500}
              className={navLinkClass}
            >
              <Link to="/">Home</Link>
            </ScrollLink>

            <Link to="/PublicDashboard" className={navLinkClass}>
              Dashboard
            </Link>

            <Link to="/about-us" className={navLinkClass}>
              About Us
            </Link>

            <ScrollLink
              to="contact"
              smooth={true}
              offset={-50}
              duration={500}
              className={navLinkClass}
            >
              <Link to="/">Contact Us</Link>
            </ScrollLink>

            <Link to="/contact-us" className={navLinkClass}>
              Startup Team
            </Link>

            <Link to="/Events" className={navLinkClass}>
              Events
            </Link>

            <ScrollLink
              to="notification"
              smooth={true}
              offset={-50}
              duration={500}
              className={navLinkClass}
            >
              <Link to="/">Notifications</Link>
            </ScrollLink>
<RouterLink
  to="/ssurecruitment"
  onClick={toggleMenu}
  className="nav-mobile-link"
>
  SSU Recruitment
</RouterLink>
            {/* Startup Ecosystem dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setIsDropDownOpen(true)}
              onMouseLeave={() => setIsDropDownOpen(false)}
            >
              <RouterLink
                to="/ecosystem"
                className={`${navLinkClass} flex items-center gap-1 py-2`}
              >
                Ecosystem
                <FiChevronDown
                  className={`transition-transform duration-300 text-xs ${
                    isDropDownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </RouterLink>

              {isDropDownOpen && (
                <div className="nav-dropdown-base">
                  <a
                    href="https://iciitp.com/zerolab/"
                    target="_blank"
                    className="nav-dropdown-item"
                  >
                    Zero Lab
                  </a>
                  <RouterLink
                    to="/ecosystem#bfsc-image"
                    className="nav-dropdown-item"
                  >
                    BSFT
                  </RouterLink>
                  <RouterLink
                    to="/ecosystem#psc-image"
                    className="nav-dropdown-item"
                  >
                    PSC
                  </RouterLink>
                  <RouterLink
                    to="/ecosystem#smic-image"
                    className="nav-dropdown-item"
                  >
                    SMIC
                  </RouterLink>
                  <RouterLink
                    to="/ecosystem#ssu-image"
                    className="nav-dropdown-item"
                  >
                    SSU
                  </RouterLink>
                  <RouterLink to="/StartupCell" className="nav-dropdown-item">
                    Startup Cell
                  </RouterLink>
                  <RouterLink
                    to="/IncubationCell"
                    className="nav-dropdown-item"
                  >
                    Incubation Cell
                  </RouterLink>
                  <RouterLink to="/Mentors" className="nav-dropdown-item">
                    Mentors
                  </RouterLink>

                  <hr className="border-t border-gray-100 my-1" />

                  <a
                    href="https://bhub.org.in/"
                    target="_blank"
                    className="nav-dropdown-item"
                  >
                    B-Hub
                  </a>
                  <a
                    href="https://startup.bihar.gov.in/static/media/Acceleration%20Program.bf71b2d74535485bfc5f.pdf"
                    target="_blank"
                    className="nav-dropdown-item"
                  >
                    Acceleration Program
                  </a>
                  <a
                    href="https://startup.bihar.gov.in/static/media/SOP%20for%20Early%20Stage%20Funding-%20Revised.51d15bea123ee299bd5f.pdf"
                    target="_blank"
                    className="nav-dropdown-item"
                  >
                    Post-seed Fund Support
                  </a>
                  <a
                    href="https://startup.bihar.gov.in/static/media/Exit%20Policy.929b6eb912040f50f1f7.pdf"
                    target="_blank"
                    className="nav-dropdown-item"
                  >
                    Exit Policy
                  </a>
                  <a
                    href="https://startup.bihar.gov.in/static/media/Intellectual%20Property%20Rights.fb6778157b1d80402ab0.pdf"
                    target="_blank"
                    className="nav-dropdown-item"
                  >
                    Intellectual Property Rights
                  </a>
                  <a
                    href="https://startup.bihar.gov.in/static/media/Matching%20Loan.14234dba2d6580a941c6.pdf"
                    target="_blank"
                    className="nav-dropdown-item"
                  >
                    Matching Loan
                  </a>
                  <a
                    href="https://startup.bihar.gov.in/static/media/Second%20Tranche.beabb8973b7e3b174e5d.pdf"
                    target="_blank"
                    className="nav-dropdown-item"
                  >
                    Second Tranche
                  </a>
                  <a
                    href="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FPdf%2FSeed%20Fund%20Document%20List.pdf?alt=media&token=adff7f46-1060-4d64-9740-bfe16cdd2362"
                    target="_blank"
                    className="nav-dropdown-item"
                  >
                    Documents for Seed Fund
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* ── Right side: Login button ── */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            <Link to="/login" className="nav-login-link">
              Login
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200"
            style={{
              color: sticky ? "#1e293b" : "#1e293b",
            }}
          >
            {mobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </nav>

        {/* ── Mobile Menu ── */}
        {mobileMenu && (
          <div className="nav-mobile-menu">
            <RouterLink to="/" onClick={toggleMenu} className="nav-mobile-link">
              Home
            </RouterLink>

            <RouterLink
              to="/PublicDashboard"
              onClick={toggleMenu}
              className="nav-mobile-link"
            >
              Dashboard
            </RouterLink>

            <RouterLink
              to="/about-us"
              onClick={toggleMenu}
              className="nav-mobile-link"
            >
              About Us
            </RouterLink>

            <RouterLink
              to="/contact-us"
              onClick={toggleMenu}
              className="nav-mobile-link"
            >
              Startup Team
            </RouterLink>

            <RouterLink
              to="/Events"
              onClick={toggleMenu}
              className="nav-mobile-link"
            >
              Events
            </RouterLink>

            <ScrollLink
              to="notification"
              smooth={true}
              offset={-50}
              duration={500}
              className="nav-mobile-link"
              onClick={toggleMenu}
            >
              <Link to="/">Notifications</Link>
            </ScrollLink>
<Link to="/ssurecruitment" className={navLinkClass}>
  SSU Recruitment
</Link>
            {/* Startup Ecosystem dropdown for mobile */}
            <details className="group">
              <summary className="nav-mobile-link flex justify-between items-center cursor-pointer list-none">
                Startup Ecosystem
                <span className="ml-1 transition-transform group-open:rotate-180">
                  <FiChevronDown />
                </span>
              </summary>
              <div className="pl-4 flex flex-col space-y-1 mt-1">
                <a
                  href="https://iciitp.com/zerolab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Zero Lab
                </a>
                <RouterLink
                  to="/ecosystem#bfsc-image"
                  onClick={toggleMenu}
                  className="nav-mobile-sub-link"
                >
                  BSFT
                </RouterLink>
                <RouterLink
                  to="/ecosystem#psc-image"
                  onClick={toggleMenu}
                  className="nav-mobile-sub-link"
                >
                  PSC
                </RouterLink>
                <RouterLink
                  to="/ecosystem#smic-image"
                  onClick={toggleMenu}
                  className="nav-mobile-sub-link"
                >
                  SMIC
                </RouterLink>
                <RouterLink
                  to="/ecosystem#ssu-image"
                  onClick={toggleMenu}
                  className="nav-mobile-sub-link"
                >
                  SSU
                </RouterLink>
                <RouterLink
                  to="/StartupCell"
                  onClick={toggleMenu}
                  className="nav-mobile-sub-link"
                >
                  Startup Cell
                </RouterLink>
                <RouterLink
                  to="/IncubationCell"
                  onClick={toggleMenu}
                  className="nav-mobile-sub-link"
                >
                  Incubation Cell
                </RouterLink>
                <RouterLink
                  to="/Mentors"
                  onClick={toggleMenu}
                  className="nav-mobile-sub-link"
                >
                  Mentors
                </RouterLink>
                <hr className="my-2 border-gray-200" />
                <a
                  href="https://bhub.org.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  B-Hub
                </a>
                <a
                  href="https://startup.bihar.gov.in/static/media/Acceleration%20Program.bf71b2d74535485bfc5f.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Acceleration Program
                </a>
                <a
                  href="https://startup.bihar.gov.in/static/media/SOP%20for%20Early%20Stage%20Funding-%20Revised.51d15bea123ee299bd5f.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Post-seed Fund Support
                </a>
                <a
                  href="https://startup.bihar.gov.in/static/media/Exit%20Policy.929b6eb912040f50f1f7.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Exit Policy
                </a>
                <a
                  href="https://startup.bihar.gov.in/static/media/Intellectual%20Property%20Rights.fb6778157b1d80402ab0.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Intellectual Property Rights
                </a>
                <a
                  href="https://startup.bihar.gov.in/static/media/Matching%20Loan.14234dba2d6580a941c6.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Matching Loan
                </a>
                <a
                  href="https://startup.bihar.gov.in/static/media/Second%20Tranche.beabb8973b7e3b174e5d.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Second Tranche
                </a>
                <a
                  href="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FPdf%2FSeed%20Fund%20Document%20List.pdf?alt=media&token=adff7f46-1060-4d64-9740-bfe16cdd2362"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Documents for Seed Fund
                </a>
              </div>
            </details>

            {/* Mobile login */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
              <Link to="/login" onClick={toggleMenu} className="nav-login-link">
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ===== Navbar Scoped Styles ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .nav-bar-base {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          max-width: 1280px;
          margin: 0 auto;
          width: 100%;
          font-family: 'Inter', sans-serif;
        }

        .nav-logo-text {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1e293b;
          letter-spacing: -0.02em;
        }

        /* ── Desktop nav links ── */
        .nav-link-base {
          color: #475569;
          text-decoration: none;
          position: relative;
          padding: 4px 0;
        }
        .nav-link-base:hover {
          color: #4A6CF7 !important;
        }
        .nav-link-base a {
          color: inherit;
          text-decoration: none;
        }

        /* ── Dropdown ── */
        .nav-dropdown-base {
          position: absolute;
          left: 0;
          top: 100%;
          margin-top: 8px;
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1px solid #f1f5f9;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          border-radius: 12px;
          overflow: hidden;
          width: 260px;
          z-index: 50;
          padding: 6px 0;
          animation: dropdownFade 0.2s ease;
        }

        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nav-dropdown-item {
          padding: 8px 18px;
          font-size: 0.85rem;
          color: #475569;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .nav-dropdown-item:hover {
          background: #f0f4ff;
          color: #4A6CF7;
        }

        /* ── Login buttons ── */
        .nav-login-link {
          font-size: 0.9rem;
          font-weight: 600;
          color: #000000;
          text-decoration: none;
          padding: 8px 20px;
          background: #ffffff;
          border-radius: 40px;
		  opacity: 0.8;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        .nav-login-link:hover {
          color: #4A6CF7;
          border-color: #4A6CF7;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .nav-login-btn {
          font-size: 0.9rem;
          font-weight: 600;
          color: #4A6CF7;
          background: #ffffff;
		  
          text-decoration: none;
          padding: 8px 24px;
          border-radius: 10px;
          border: 1px solid #4A6CF7;
          transition: all 0.2s ease;
          box-shadow: 0 2px 10px rgba(74, 108, 247, 0.1);
        }
        .nav-login-btn:hover {
          background: #f8faff;
          box-shadow: 0 4px 14px rgba(74, 108, 247, 0.15);
          transform: translateY(-1px);
        }

        /* ── Mobile menu ── */
        .nav-mobile-menu {
          display: flex;
          flex-direction: column;
          padding: 16px 24px 24px;
          background: #fff;
          border-top: 1px solid #f1f5f9;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          animation: dropdownFade 0.25s ease;
        }

        .nav-mobile-link {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
          text-decoration: none;
          padding: 10px 0;
          border-bottom: 1px solid #f8fafc;
          transition: color 0.2s ease;
        }
        .nav-mobile-link:hover {
          color: #4A6CF7;
        }
        .nav-mobile-link a {
          color: inherit;
          text-decoration: none;
        }

        .nav-mobile-sub-link {
          font-size: 0.82rem;
          color: #64748b;
          text-decoration: none;
          padding: 6px 0;
          transition: color 0.2s ease;
        }
        .nav-mobile-sub-link:hover {
          color: #4A6CF7;
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .nav-bar-base {
            padding: 14px 20px;
          }
        }
      `}</style>
    </>
  );
};

export default NavBarNew;
