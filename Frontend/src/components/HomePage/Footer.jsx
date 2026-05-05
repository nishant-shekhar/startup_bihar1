import React from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="footer-base" id="footer">
        {/* ── Top CTA Banner ── */}
        <div className="footer-cta-banner">
          <div className="footer-cta-inner">
            <div className="footer-cta-text">
              <h3 className="footer-cta-title">
                Ready to Start Your Entrepreneurial Journey?
              </h3>
              <p className="footer-cta-desc">
                Register your startup today and unlock Bihar's innovation
                ecosystem.
              </p>
            </div>
            <Link to="/startupregistration" className="footer-cta-btn">
              Register Now <FaArrowRight className="footer-cta-arrow" />
            </Link>
          </div>
        </div>

        {/* ── Main Footer Grid ── */}
        <div className="footer-main">
          {/* Column 1 — Brand */}
          <div className="footer-brand-col">
            <div className="footer-brand-top">
              <img
                src="Seal_of_Bihar.svg"
                className="footer-seal"
                alt="Seal of Bihar"
              />
              <div className="footer-brand-info">
                <span className="footer-brand-name">Startup Bihar</span>
                <span className="footer-brand-dept">
                  Department of Industries
                </span>
                <span className="footer-brand-govt">Government of Bihar</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              Driving innovation, growth, and entrepreneurial success by
              supporting startups across diverse sectors in Bihar.
            </p>

            {/* Contact details */}
            <div className="footer-contact-list">
              <a href="mailto:startup-bihar@gov.in" className="footer-contact-item">
                <HiOutlineMail className="footer-contact-icon" />
                <span>startup-bihar@gov.in</span>
              </a>
              <a href="tel:18003456214" className="footer-contact-item">
                <HiOutlinePhone className="footer-contact-icon" />
                <span>1800 345 6214 (Toll Free)</span>
              </a>
              <div className="footer-contact-item">
                <HiOutlineLocationMarker className="footer-contact-icon" />
                <span>Udyog Bhawan, Patna, Bihar</span>
              </div>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="footer-link-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="footer-link">
                  Startup Team
                </Link>
              </li>
              <li>
                <Link to="/AllStartups" className="footer-link">
                  All Startups
                </Link>
              </li>
              <li>
                <Link to="/PublicDashboard" className="footer-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/Events" className="footer-link">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Ecosystem */}
          <div className="footer-link-col">
            <h4 className="footer-col-title">Ecosystem</h4>
            <ul className="footer-link-list">
              <li>
                <Link to="/ecosystem" className="footer-link">
                  Startup Ecosystem
                </Link>
              </li>
              <li>
                <Link to="/StartupCell" className="footer-link">
                  Startup Cell
                </Link>
              </li>
              <li>
                <Link to="/IncubationCell" className="footer-link">
                  Incubation Cell
                </Link>
              </li>
              <li>
                <Link to="/Mentors" className="footer-link">
                  Mentors
                </Link>
              </li>
              <li>
                <a
                  href="https://iciitp.com/zerolab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Zero Lab
                </a>
              </li>
              <li>
                <a
                  href="https://bhub.org.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  B-Hub
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 — Legal & Resources */}
          <div className="footer-link-col">
            <h4 className="footer-col-title">Legal & Resources</h4>
            <ul className="footer-link-list">
              <li>
                <a
                  href="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FPRIVACY%20POLICY.pdf?alt=media&token=5feaa5fd-2e0d-4a01-bc44-09ab8ad9b0cd"
                  className="footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FTERMS%20OF%20USE_DRAFT.pdf?alt=media&token=5831df8f-0a32-4480-88c1-59e88fa76537"
                  className="footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </a>
              </li>
              <li>
                <a
                  href="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FCopyright%20Policy.pdf?alt=media&token=0ba2d4c6-36a3-436d-a58f-2654ff621050"
                  className="footer-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Copyright Policy
                </a>
              </li>
              <li>
                <Link to="/startupregistration" className="footer-link">
                  Register Startup
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-link">
                  Login / Sign In
                </Link>
              </li>
              <li>
                <a href="/DeveloperTeam" className="footer-link">
                  Developer Team
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="footer-divider" />

        {/* ── Bottom Bar ── */}
        <div className="footer-bottom">
          <span className="footer-copyright">
            © {new Date().getFullYear()} Department of Industries, Government of
            Bihar. All Rights Reserved.
          </span>

          <a href="/DeveloperTeam" className="footer-dev-credit">
            Developed & maintained by{" "}
            <span className="footer-dev-name">NS Apps Innovations</span>, a
            product of Startup Bihar.
          </a>

          {/* Social icons */}
          <div className="footer-social-row">
            <a
              href="https://www.facebook.com/startupbihar2022/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://x.com/startup_bihar"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/startupbihar23/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/company/startup-bihar/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://www.youtube.com/@StartupBihar"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-icon"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </footer>

      {/* ===== Footer Scoped Styles ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .footer-base {
          background: #090E34;
          font-family: 'Inter', sans-serif;
          color: #c8cdd8;
          position: relative;
          overflow: hidden;
        }

        /* Subtle gradient glow at the top */
        .footer-base::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #4A6CF7, transparent);
        }

        /* ── CTA Banner ── */
        .footer-cta-banner {
          background: linear-gradient(135deg, #4A6CF7 0%, #3b5de7 100%);
          padding: 48px 32px;
          position: relative;
          overflow: hidden;
        }
        .footer-cta-banner::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 300px;
          height: 300px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 50%;
          pointer-events: none;
        }
        .footer-cta-inner {
          max-width: 1280px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          flex-wrap: wrap;
        }
        .footer-cta-text {
          flex: 1;
          min-width: 280px;
        }
        .footer-cta-title {
          font-size: clamp(1.25rem, 2.5vw, 1.6rem);
          font-weight: 800;
          color: #fff;
          margin: 0 0 8px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .footer-cta-desc {
          font-size: 0.92rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          line-height: 1.6;
        }
        .footer-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: #fff;
          color: #4A6CF7;
          font-weight: 700;
          font-size: 0.92rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
          flex-shrink: 0;
        }
        .footer-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
          background: #f8faff;
        }
        .footer-cta-arrow {
          font-size: 0.75rem;
          transition: transform 0.2s ease;
        }
        .footer-cta-btn:hover .footer-cta-arrow {
          transform: translateX(3px);
        }

        /* ── Main Grid ── */
        .footer-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 32px 40px;
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px;
        }

        /* Brand column */
        .footer-brand-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .footer-brand-top {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .footer-seal {
          width: 56px;
          height: 56px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.9;
        }
        .footer-brand-info {
          display: flex;
          flex-direction: column;
        }
        .footer-brand-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.01em;
        }
        .footer-brand-dept {
          font-size: 0.78rem;
          color: #959CB1;
          font-weight: 500;
          margin-top: 2px;
        }
        .footer-brand-govt {
          font-size: 0.72rem;
          color: #7a7f94;
          font-weight: 500;
        }
        .footer-brand-desc {
          font-size: 0.88rem;
          line-height: 1.7;
          color: #959CB1;
          margin: 0;
          max-width: 320px;
        }

        /* Contact list */
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 4px;
        }
        .footer-contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.84rem;
          color: #b0b5c7;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-contact-item:hover {
          color: #4A6CF7;
        }
        .footer-contact-icon {
          font-size: 1rem;
          color: #4A6CF7;
          flex-shrink: 0;
        }

        /* Link columns */
        .footer-link-col {
          display: flex;
          flex-direction: column;
        }
        .footer-col-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 20px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .footer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-link {
          font-size: 0.88rem;
          color: #959CB1;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          display: inline-block;
        }
        .footer-link:hover {
          color: #4A6CF7;
          transform: translateX(4px);
        }

        /* ── Divider ── */
        .footer-divider {
          max-width: 1280px;
          margin: 0 auto;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74, 108, 247, 0.2), transparent);
        }

        /* ── Bottom Bar ── */
        .footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .footer-copyright {
          font-size: 0.78rem;
          color: #6b7090;
        }
        .footer-dev-credit {
          font-size: 0.78rem;
          color: #6b7090;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-dev-credit:hover {
          color: #959CB1;
        }
        .footer-dev-name {
          font-weight: 700;
          color: #4A6CF7;
        }

        /* Social icons */
        .footer-social-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .footer-social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          color: #959CB1;
          font-size: 0.88rem;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .footer-social-icon:hover {
          background: #4A6CF7;
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(74, 108, 247, 0.35);
          border-color: transparent;
        }

        /* ── Responsive ── */

        /* Tablet — 2 columns */
        @media (max-width: 1024px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 40px 32px;
            padding: 48px 24px 36px;
          }
          .footer-brand-col {
            grid-column: 1 / -1;
          }
          .footer-cta-banner {
            padding: 40px 24px;
          }
          .footer-bottom {
            padding: 20px 24px;
          }
        }

        /* Mobile — single column */
        @media (max-width: 640px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 40px 20px 28px;
          }
          .footer-cta-inner {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          .footer-cta-text {
            min-width: auto;
          }
          .footer-cta-banner {
            padding: 36px 20px;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 12px;
            padding: 20px 20px;
          }
          .footer-brand-desc {
            max-width: 100%;
          }
          .footer-social-row {
            justify-content: center;
          }
        }

        /* Small mobile */
        @media (max-width: 400px) {
          .footer-cta-title {
            font-size: 1.1rem;
          }
          .footer-cta-btn {
            padding: 12px 24px;
            font-size: 0.85rem;
          }
          .footer-brand-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .footer-col-title {
            font-size: 0.82rem;
          }
          .footer-link {
            font-size: 0.84rem;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;