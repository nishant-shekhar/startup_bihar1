import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCard from "./ProfileCard";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "./MovingPage.css";

const MovingPage = () => {
  // State to store fetched profiles
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const startupMottos = [
    "Innovating for a better tomorrow.",
    "Empowering ideas, transforming industries.",
    "Where creativity meets technology.",
    "Revolutionizing the way the world works.",
    "Your vision, our innovation.",
    "Connecting people, changing lives.",
    "Building solutions for a smarter future.",
    "Redefining possibilities, one step at a time.",
    "Passion for progress, driven by purpose.",
    "Fueling growth, igniting potential.",
    "Making dreams a reality, every day.",
    "Think big, act bold, achieve greatness.",
    "Breaking barriers, shaping the future.",
    "Inspiring change, empowering communities.",
    "From concept to creation, we lead the way.",
    "Driving sustainability through innovation.",
    "Empowering startups, elevating success.",
    "Transforming challenges into opportunities.",
    "Dream it, build it, grow it.",
    "Innovation at the heart of everything we do.",
  ];

  // Fetching data from the backend API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(
          "https://startupbihar.in/api/userlogin/top-startups"
        );
        if (response.data && response.data.startups) {
          const startups = response.data.startups.map((startup) => ({
            user_id: startup.user_id,
            status: startup.status || "Seed Funded",
            statusColor: "bg-green-500",
            profileImage:
              startup.logo ||
              "https://dummyimage.com/100x100/000/fff.png&text=Logo",
            companyName: startup.company_name,
            founderName: startup.founder_name,
            since: startup.startup_since || "N/A",
            sinceColor: "bg-yellow-500",
            category: startup.category || "N/A",
            categoryColor: "bg-teal-500",
            moto:
              startup.moto ||
              startupMottos[Math.floor(Math.random() * startupMottos.length)],
          }));
          setProfiles(startups);
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <>
      <section id="startups" className="mp-section">
        {/* ── Section heading — centered like Base template ── */}
        <div className="mp-heading-block">
          <span className="mp-heading-badge">Top Startups</span>
          <h2 className="mp-heading-title">
            Meet the Innovators Shaping Bihar's Future
          </h2>
          <p className="mp-heading-desc">
            Discover top-performing startups that are driving innovation, growth,
            and entrepreneurial success across diverse sectors in Bihar.
          </p>
        </div>

        {/* ── Infinite Scrolling Carousel ── */}
        <div className="mp-carousel-wrapper">
          {isLoading ? (
            <div className="mp-loader-wrap">
              <div className="mp-loader">
                <div className="mp-loader-dot"></div>
                <div className="mp-loader-dot"></div>
                <div className="mp-loader-dot"></div>
              </div>
              <span className="mp-loader-text">Loading startups...</span>
            </div>
          ) : (
            <div className="mp-scroll-track">
              {/* 4 copies for seamless infinite scroll */}
              {[0, 1, 2, 3].map((setIdx) =>
                profiles.map((profile, index) => (
                  <div key={`${setIdx}-${index}`} className="mp-card-slot">
                    <ProfileCard {...profile} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* ── View All CTA ── */}
        <div className="mp-cta-row">
          <Link to="/AllStartups" className="mp-view-all-btn">
            <span>View All Startups</span>
            <FaArrowRight className="mp-arrow-icon" />
          </Link>
        </div>
      </section>

      {/* ===== Scoped Styles ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .mp-section {
          width: 100%;
          padding: 80px 0 60px;
          background: #f4f7ff;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* ── Heading block — centered, matches Base template ── */
        .mp-heading-block {
          text-align: center;
          max-width: 680px;
          margin: 0 auto 48px;
          padding: 0 24px;
        }

        .mp-heading-badge {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #4A6CF7;
          background: rgba(74, 108, 247, 0.08);
          padding: 6px 16px;
          border-radius: 9999px;
          margin-bottom: 16px;
        }

        .mp-heading-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: #090E34;
          line-height: 1.2;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }

        .mp-heading-desc {
          font-size: 1rem;
          line-height: 1.7;
          color: #959CB1;
          margin: 0;
        }

        /* ── Carousel ── */
        .mp-carousel-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 8px 0;
        }

        /* Gradient fade edges */
        .mp-carousel-wrapper::before,
        .mp-carousel-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          z-index: 2;
          pointer-events: none;
        }
        .mp-carousel-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #f4f7ff, transparent);
        }
        .mp-carousel-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #f4f7ff, transparent);
        }

        .mp-scroll-track {
          display: flex;
          gap: 20px;
          animation: mpScroll 40s linear infinite;
          width: max-content;
          padding: 12px 0;
        }
        .mp-scroll-track:hover {
          animation-play-state: paused;
        }

        @keyframes mpScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .mp-card-slot {
          flex-shrink: 0;
          width: 260px;
        }

        /* ── Loader ── */
        .mp-loader-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 60px 0;
        }
        .mp-loader {
          display: flex;
          gap: 8px;
        }
        .mp-loader-dot {
          width: 10px;
          height: 10px;
          background: #4A6CF7;
          border-radius: 50%;
          animation: mpBounce 1.4s ease-in-out infinite both;
        }
        .mp-loader-dot:nth-child(2) { animation-delay: 0.16s; }
        .mp-loader-dot:nth-child(3) { animation-delay: 0.32s; }
        @keyframes mpBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .mp-loader-text {
          font-size: 0.85rem;
          color: #959CB1;
          font-weight: 500;
        }

        /* ── CTA row ── */
        .mp-cta-row {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }
        .mp-view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: #4A6CF7;
          color: #fff;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(74, 108, 247, 0.25);
        }
        .mp-view-all-btn:hover {
          background: #3b5de7;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(74, 108, 247, 0.35);
        }
        .mp-arrow-icon {
          font-size: 0.75rem;
          transition: transform 0.2s ease;
        }
        .mp-view-all-btn:hover .mp-arrow-icon {
          transform: translateX(3px);
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .mp-section {
            padding: 48px 0 40px;
          }
          .mp-heading-title {
            font-size: 1.6rem;
          }
          .mp-heading-desc {
            font-size: 0.9rem;
          }
          .mp-card-slot {
            width: 240px;
          }
        }

        @media (max-width: 480px) {
          .mp-heading-title {
            font-size: 1.35rem;
          }
          .mp-card-slot {
            width: 220px;
          }
          .mp-carousel-wrapper::before,
          .mp-carousel-wrapper::after {
            width: 30px;
          }
        }
      `}</style>
    </>
  );
};

export default MovingPage;
