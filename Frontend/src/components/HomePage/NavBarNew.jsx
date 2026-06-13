import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Link as ScrollLink,
  animateScroll as scroll,
} from "react-scroll";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";

const NavBarNew = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const dropdownCloseTimerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setSticky(currentScrollY > 50);

      if (currentScrollY > lastScrollYRef.current && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (dropdownCloseTimerRef.current) {
        clearTimeout(dropdownCloseTimerRef.current);
      }
    };
  }, []);

  const toggleMenu = () => {
    setMobileMenu((previousValue) => !previousValue);
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  const openDropdown = () => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }

    setIsDropDownOpen(true);
  };

  const closeDropdownWithDelay = () => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
    }

    dropdownCloseTimerRef.current = setTimeout(() => {
      setIsDropDownOpen(false);
    }, 180);
  };

  const closeDropdownImmediately = () => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }

    setIsDropDownOpen(false);
  };

  const toggleDropdown = () => {
    if (dropdownCloseTimerRef.current) {
      clearTimeout(dropdownCloseTimerRef.current);
      dropdownCloseTimerRef.current = null;
    }

    setIsDropDownOpen((previousValue) => !previousValue);
  };

  const navLinkClass =
    "nav-link-base text-sm font-medium leading-6 cursor-pointer transition-colors duration-200";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          background: sticky ? "rgba(237, 242, 250, 0.94)" : "#EDF2FA",
          backdropFilter: sticky ? "blur(14px)" : "none",
          WebkitBackdropFilter: sticky ? "blur(14px)" : "none",
          boxShadow: sticky
            ? "0 4px 20px rgba(8, 22, 60, 0.08)"
            : "none",
        }}
      >
        <nav className="nav-bar-base" aria-label="Global navigation">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              onClick={() => scroll.scrollToTop()}
              to="/"
              className="flex items-center gap-3 cursor-pointer"
              aria-label="Startup Bihar home"
            >
              <img
                className="h-10 w-auto"
                src="startup_bihar_logo1.png"
                alt="Startup Bihar Logo"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8">
            <ScrollLink
              to="startups"
              smooth
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
              smooth
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
              smooth
              offset={-50}
              duration={500}
              className={navLinkClass}
            >
              <Link to="/">Notifications</Link>
            </ScrollLink>

            <Link
              to="/ssu-recruitment"
              className="text-sm font-semibold leading-6 cursor-pointer transition-all duration-200 px-3.5 py-1.5 rounded-full text-black hover:text-white"
            >
              SSU Recruitment
            </Link>

            {/* Desktop Ecosystem dropdown */}
            <div
              ref={dropdownRef}
              className="nav-dropdown-wrapper"
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdownWithDelay}
              onFocus={openDropdown}
              onBlur={(event) => {
                if (
                  dropdownRef.current &&
                  !dropdownRef.current.contains(event.relatedTarget)
                ) {
                  closeDropdownWithDelay();
                }
              }}
            >
              <button
                type="button"
                onClick={toggleDropdown}
                className={`${navLinkClass} nav-ecosystem-button`}
                aria-expanded={isDropDownOpen}
                aria-haspopup="menu"
              >
                <span>Ecosystem</span>
                <FiChevronDown
                  aria-hidden="true"
                  className={`transition-transform duration-300 text-xs ${
                    isDropDownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {isDropDownOpen && (
                <div
                  className="nav-dropdown-shell"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdownWithDelay}
                >
                  <div
                    className="nav-dropdown-base"
                    role="menu"
                    aria-label="Ecosystem menu"
                  >
                    <Link
                      to="/ecosystem"
                      className="nav-dropdown-item nav-dropdown-highlight"
                      onClick={closeDropdownImmediately}
                      role="menuitem"
                    >
                      Ecosystem Overview
                    </Link>

                    <a
                      href="https://iciitp.com/zerolab/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      Zero Lab
                    </a>

                    <Link
                      to="/ecosystem#bfsc-image"
                      className="nav-dropdown-item"
                      onClick={closeDropdownImmediately}
                      role="menuitem"
                    >
                      BSFT
                    </Link>

                    <Link
                      to="/ecosystem#psc-image"
                      className="nav-dropdown-item"
                      onClick={closeDropdownImmediately}
                      role="menuitem"
                    >
                      PSC
                    </Link>

                    <Link
                      to="/ecosystem#smic-image"
                      className="nav-dropdown-item"
                      onClick={closeDropdownImmediately}
                      role="menuitem"
                    >
                      SMIC
                    </Link>

                    <Link
                      to="/ecosystem#ssu-image"
                      className="nav-dropdown-item"
                      onClick={closeDropdownImmediately}
                      role="menuitem"
                    >
                      SSU
                    </Link>

                    <Link
                      to="/StartupCell"
                      className="nav-dropdown-item"
                      onClick={closeDropdownImmediately}
                      role="menuitem"
                    >
                      Startup Cell
                    </Link>

                    <Link
                      to="/IncubationCell"
                      className="nav-dropdown-item"
                      onClick={closeDropdownImmediately}
                      role="menuitem"
                    >
                      Incubation Cell
                    </Link>

                    <Link
                      to="/Mentors"
                      className="nav-dropdown-item"
                      onClick={closeDropdownImmediately}
                      role="menuitem"
                    >
                      Mentors
                    </Link>

                    <hr className="nav-dropdown-divider" />

                    <a
                      href="https://bhub.org.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      B-Hub
                    </a>

                    <a
                      href="/docs/AccelerationProgram.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      Acceleration Program
                    </a>

                    <a
                      href="/docs/PostSeedFundSupport.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      Post-seed Fund Support
                    </a>

                    <a
                      href="/docs/ExitPolicy.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      Exit Policy
                    </a>

                    <a
                      href="/docs/IntellectualPropertyRights.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      Intellectual Property Rights
                    </a>

                    <a
                      href="/docs/MatchingLoan.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      Matching Loan
                    </a>

                    <a
                      href="/docs/SecondTranche.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      Second Tranche
                    </a>

                    <a
                      href="/docs/SeedFundDocumentList.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-dropdown-item"
                      role="menuitem"
                    >
                      Documents for Seed Fund
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Login */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            <Link to="/login" className="nav-login-link">
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMenu}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200"
            style={{ color: "#1e293b" }}
            aria-label={mobileMenu ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="nav-mobile-menu">
            <Link to="/" onClick={closeMobileMenu} className="nav-mobile-link">
              Home
            </Link>

            <Link
              to="/PublicDashboard"
              onClick={closeMobileMenu}
              className="nav-mobile-link"
            >
              Dashboard
            </Link>

            <Link
              to="/about-us"
              onClick={closeMobileMenu}
              className="nav-mobile-link"
            >
              About Us
            </Link>

            <Link
              to="/contact-us"
              onClick={closeMobileMenu}
              className="nav-mobile-link"
            >
              Startup Team
            </Link>

            <Link
              to="/Events"
              onClick={closeMobileMenu}
              className="nav-mobile-link"
            >
              Events
            </Link>

            <ScrollLink
              to="notification"
              smooth
              offset={-50}
              duration={500}
              className="nav-mobile-link"
              onClick={closeMobileMenu}
            >
              <Link to="/">Notifications</Link>
            </ScrollLink>

            <Link
              to="/ssu-recruitment"
              onClick={closeMobileMenu}
              className="nav-mobile-link flex items-center justify-between text-[#4A6CF7] font-semibold"
              style={{ color: "#4A6CF7" }}
            >
              <span>SSU Recruitment</span>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#4A6CF7]/10 border border-[#4A6CF7]/20">
                New
              </span>
            </Link>

            {/* Mobile Ecosystem dropdown */}
            <details className="group nav-mobile-details">
              <summary className="nav-mobile-link flex justify-between items-center cursor-pointer list-none">
                <span>Startup Ecosystem</span>
                <span className="ml-1 transition-transform duration-200 group-open:rotate-180">
                  <FiChevronDown />
                </span>
              </summary>

              <div className="nav-mobile-submenu">
                <Link
                  to="/ecosystem"
                  onClick={closeMobileMenu}
                  className="nav-mobile-sub-link font-semibold"
                >
                  Ecosystem Overview
                </Link>

                <a
                  href="https://iciitp.com/zerolab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Zero Lab
                </a>

                <Link
                  to="/ecosystem#bfsc-image"
                  onClick={closeMobileMenu}
                  className="nav-mobile-sub-link"
                >
                  BSFT
                </Link>

                <Link
                  to="/ecosystem#psc-image"
                  onClick={closeMobileMenu}
                  className="nav-mobile-sub-link"
                >
                  PSC
                </Link>

                <Link
                  to="/ecosystem#smic-image"
                  onClick={closeMobileMenu}
                  className="nav-mobile-sub-link"
                >
                  SMIC
                </Link>

                <Link
                  to="/ecosystem#ssu-image"
                  onClick={closeMobileMenu}
                  className="nav-mobile-sub-link"
                >
                  SSU
                </Link>

                <Link
                  to="/StartupCell"
                  onClick={closeMobileMenu}
                  className="nav-mobile-sub-link"
                >
                  Startup Cell
                </Link>

                <Link
                  to="/IncubationCell"
                  onClick={closeMobileMenu}
                  className="nav-mobile-sub-link"
                >
                  Incubation Cell
                </Link>

                <Link
                  to="/Mentors"
                  onClick={closeMobileMenu}
                  className="nav-mobile-sub-link"
                >
                  Mentors
                </Link>

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
                  href="/docs/AccelerationProgram.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Acceleration Program
                </a>

                <a
                  href="/docs/PostSeedFundSupport.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Post-seed Fund Support
                </a>

                <a
                  href="/docs/ExitPolicy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Exit Policy
                </a>

                <a
                  href="/docs/IntellectualPropertyRights.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Intellectual Property Rights
                </a>

                <a
                  href="/docs/MatchingLoan.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Matching Loan
                </a>

                <a
                  href="/docs/SecondTranche.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Second Tranche
                </a>

                <a
                  href="/docs/SeedFundDocumentList.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-mobile-sub-link"
                >
                  Documents for Seed Fund
                </a>
              </div>
            </details>

            {/* Mobile Login */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="nav-login-link"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Navbar Scoped Styles */}
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

        .nav-link-base {
          color: #475569;
          text-decoration: none;
          position: relative;
          padding: 4px 0;
        }

        .nav-link-base:hover,
        .nav-link-base:focus-visible {
          color: #4A6CF7 !important;
        }

        .nav-link-base a {
          color: inherit;
          text-decoration: none;
        }

        /* Desktop Ecosystem dropdown */
        .nav-dropdown-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .nav-ecosystem-button {
          display: flex;
          align-items: center;
          gap: 4px;
          border: 0;
          outline: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.5rem;
          cursor: pointer;
        }

        .nav-ecosystem-button:focus-visible {
          outline: 2px solid rgba(74, 108, 247, 0.45);
          outline-offset: 5px;
          border-radius: 4px;
        }

        /*
         * Padding creates hoverable spacing between the trigger and menu.
         * Do not replace this with margin-top, because margin creates a dead gap.
         */
        .nav-dropdown-shell {
          position: absolute;
          left: 0;
          top: 100%;
          width: 270px;
          padding-top: 10px;
          z-index: 100;
        }

        .nav-dropdown-base {
          display: flex;
          flex-direction: column;
          width: 270px;
          max-height: calc(100vh - 105px);
          overflow-x: hidden;
          overflow-y: auto;
          padding: 6px 0;
          background: #EDF2FA;
          border: 1px solid #e2e8f0;
          box-shadow: 0 14px 42px rgba(8, 22, 60, 0.14);
          border-radius: 12px;
          animation: dropdownFade 0.18s ease;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .nav-dropdown-base::-webkit-scrollbar {
          width: 7px;
        }

        .nav-dropdown-base::-webkit-scrollbar-track {
          background: transparent;
        }

        .nav-dropdown-base::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 20px;
        }

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-dropdown-item {
          display: block;
          flex-shrink: 0;
          padding: 9px 18px;
          font-size: 0.85rem;
          line-height: 1.25rem;
          color: #475569;
          text-decoration: none;
          transition:
            background-color 0.15s ease,
            color 0.15s ease,
            padding-left 0.15s ease;
        }

        .nav-dropdown-item:hover,
        .nav-dropdown-item:focus-visible {
          background: #f0f4ff;
          color: #4A6CF7;
          padding-left: 21px;
          outline: none;
        }

        .nav-dropdown-highlight {
          color: #334155;
          font-weight: 700;
        }

        .nav-dropdown-divider {
          flex-shrink: 0;
          margin: 5px 12px;
          border: 0;
          border-top: 1px solid #dbe3ef;
        }

        /* Login */
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

        .nav-login-link:hover,
        .nav-login-link:focus-visible {
          color: #4A6CF7;
          border-color: #4A6CF7;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          outline: none;
        }

        /* Mobile menu */
        .nav-mobile-menu {
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 72px);
          overflow-y: auto;
          padding: 16px 24px 24px;
          background: #EDF2FA;
          border-top: 1px solid #f1f5f9;
          box-shadow: 0 8px 24px rgba(0,0,0,0.06);
          animation: dropdownFade 0.25s ease;
          font-family: 'Inter', sans-serif;
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

        .nav-mobile-details summary::-webkit-details-marker {
          display: none;
        }

        .nav-mobile-submenu {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 4px;
          padding: 2px 0 6px 16px;
        }

        .nav-mobile-sub-link {
          font-size: 0.82rem;
          line-height: 1.25rem;
          color: #64748b;
          text-decoration: none;
          padding: 7px 0;
          transition: color 0.2s ease;
        }

        .nav-mobile-sub-link:hover {
          color: #4A6CF7;
        }

        @media (max-width: 1279px) and (min-width: 1024px) {
          .nav-bar-base {
            padding-left: 20px;
            padding-right: 20px;
          }

          .nav-bar-base > div:nth-child(2) {
            column-gap: 1.25rem;
          }
        }

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
