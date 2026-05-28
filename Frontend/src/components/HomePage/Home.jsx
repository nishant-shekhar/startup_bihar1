import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavBarNew from "./NavBarNew";
import ThirdPage from "./ThirdPage";
import FourthPage from "./FourthPage";
import FifthPage from "./FifthPage";
import MovingPage from "./MovinPage/MovingPage";
import SixthPage from "./SixthPage";
import Countdown from "react-countdown";
import Footer from "./Footer";
import CountdownTimer from "./CountdownTimer";
import { Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

import { getDatabase, ref, get } from "firebase/database";

const HomePage = () => {
  const [isCountdownComplete, setCountdownComplete] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(2);
  const [totalIdeas, setTotalIdeas] = useState(null);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchIdeasCount = async () => {
      try {
        const response = await fetch(
          "https://9w19cua4ga.execute-api.ap-south-1.amazonaws.com/prod/count"
        );
        const data = await response.json();
        setTotalIdeas(data.count);
      } catch (error) {
        console.error("Error fetching ideas count:", error);
      }
    };

    fetchIdeasCount();
  }, []);

  useEffect(() => {
    const fetchTopNotices = async () => {
      try {
        const database = getDatabase();
        const noticeRef = ref(database, "startuptopnotice");
        const snapshot = await get(noticeRef);

        if (!snapshot.exists()) {
          setNotices([]);
          return;
        }

        const data = snapshot.val();

        const parsedNotices = Object.entries(data || {})
          .map(([id, item]) => ({
            id,
            notice: item?.notice || "",
            link: item?.link || "",
            color: item?.color || "indigo",
          }))
          .filter((item) => item.notice)
          .sort((a, b) => Number(a.id) - Number(b.id));

        setNotices(parsedNotices);
      } catch (error) {
        console.error("Error fetching top notices:", error);
        setNotices([]);
      }
    };

    fetchTopNotices();
  }, []);

  useEffect(() => {
    if (!showDialog) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showDialog]);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const targetDate = new Date("2025-01-14T12:00:00").getTime();

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      setCountdownComplete(true);
      return null;
    }

    return (
      <div>
        <CountdownTimer
          days={days}
          hours={hours}
          minutes={minutes}
          seconds={seconds}
        />
      </div>
    );
  };

  const getNoticeClass = (color) => {
    const normalized = String(color || "indigo").toLowerCase();

    switch (normalized) {
      case "red":
        return "notice-red";
      case "green":
        return "notice-green";
      case "blue":
        return "notice-blue";
      case "yellow":
        return "notice-yellow";
      case "indigo":
      default:
        return "notice-indigo";
    }
  };

  return (
    <div className="grid grid-cols-1 overflow-x-hidden">
      <NavBarNew />

      <div className="hero-section-base">
        <div className="hero-bg-grid" />
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="hero-orb hero-orb-three" />

        <div className="hero-content-wrapper">
          <motion.div
            className="hero-text-block"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {!isCountdownComplete && (
              <motion.div variants={fadeIn} className="hero-countdown-area">
                <h2 className="hero-countdown-title">Countdown to Launch</h2>
                <Countdown date={targetDate} renderer={renderer} />
              </motion.div>
            )}

            <motion.h1 variants={fadeIn} className="hero-brand-watermark">
              Startup Bihar
            </motion.h1>

            <motion.div variants={fadeIn} className="hero-familiar-pill-wrap">
              <div className="hero-familiar-pill">
                Get Familiar with Startup Bihar.
                <Link to="/ecosystem" className="hero-familiar-link">
                  Read more <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </motion.div>

            <motion.h2 variants={fadeIn} className="hero-headline">
              Empowering Startups, Shaping Tomorrow Together.
            </motion.h2>

            <motion.p variants={fadeIn} className="hero-description">
              Driving innovation, growth, and entrepreneurial success by
              supporting startups across diverse sectors in Bihar.
            </motion.p>

         <motion.div variants={fadeIn} className="hero-cta-row">
   {/* <Link to="/startupregistration" className="hero-cta-btn">
    Register New Startup <span aria-hidden="true">→</span>
  </Link>*/}
    <Link to="/ssurecruitment" className="hero-cta-btn">
    SSU Recruitment <span aria-hidden="true">→</span>
  </Link>

  <Link to="/AllStartups" className="hero-cta-btn-secondary">
    Explore Startups
  </Link>


</motion.div>

            {notices.length > 0 && (
              <motion.div variants={fadeIn} className="hero-notifications">
                {notices.map((item) => {
                  const className = `notif-pill ${getNoticeClass(item.color)}`;

                  if (item.link) {
                    return (
                      <a
                        key={item.id}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        <span className="notif-badge-new">New</span>
                        <span className="notif-text">{item.notice}</span>
                        <span className="notif-arrow">View →</span>
                      </a>
                    );
                  }

                  return (
                    <div key={item.id} className={className}>
                      <span className="notif-badge-new">New</span>
                      <span className="notif-text">{item.notice}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="hero-image-collage"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
          >
            <div className="hero-img-grid">
              <motion.div
                className="hero-img-col hero-img-col--left"
                animate={{ y: [0, -14, 0] }}
                transition={{
                  duration: 7.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="hero-img-card">
                  <img src="/hero-img-1.png" alt="Startup team collaborating" />
                </div>

                <div className="hero-img-card">
                  <img src="/hero-img-2.png" alt="Entrepreneur working" />
                </div>
              </motion.div>

              <motion.div
                className="hero-img-col hero-img-col--right"
                animate={{ y: [0, 14, 0] }}
                transition={{
                  duration: 7.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="hero-img-card hero-img-card--large">
                  <img src="/hero-img-3.png" alt="Team brainstorming" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div style={{ position: "relative", zIndex: 5 }}>
          <MovingPage />
        </div>
      </div>

      <ThirdPage />
      <FourthPage />
      <FifthPage />
      <SixthPage />
      <Footer />

      {showDialog && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShowDialog(false)}
        >
          <div
            className="relative bg-white rounded-2xl overflow-hidden w-[90%] max-w-7xl h-[80vh] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 left-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center z-10"
              onClick={() => setShowDialog(false)}
            >
              ×
            </button>

            <a
              href="https://thebharatproject.co.in/bihar-idea-festival.html"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <img
                src="/banneridea.png"
                alt="Idea Festival Banner"
                className="w-full h-full object-contain cursor-pointer"
              />
            </a>

            {totalIdeas !== null && (
              <div className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 bg-white/90 border border-yellow-400 shadow-lg rounded-xl px-6 py-3 flex items-center gap-2 backdrop-blur-sm">
                <Lightbulb className="text-yellow-500" size={20} />
                <span className="text-sm font-semibold text-gray-800">
                  Total ideas submitted:{" "}
                  <span className="text-yellow-600">{totalIdeas}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .hero-section-base {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          background:
            radial-gradient(circle at 85% 18%, rgba(59, 130, 246, 0.16), transparent 28%),
            radial-gradient(circle at 15% 75%, rgba(16, 185, 129, 0.12), transparent 30%),
            linear-gradient(120deg, #ffffff 0%, #f8fbff 45%, #eef6ff 100%);
        }

        .hero-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(37, 99, 235, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37, 99, 235, 0.045) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: linear-gradient(to bottom, black, transparent 85%);
          pointer-events: none;
        }

        .hero-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(55px);
          opacity: 0.55;
          pointer-events: none;
        }

        .hero-orb-one {
          width: 310px;
          height: 310px;
          right: 5%;
          top: 95px;
          background: rgba(56, 189, 248, 0.28);
          animation: orbFloatOne 9s ease-in-out infinite;
        }

        .hero-orb-two {
          width: 270px;
          height: 270px;
          left: 5%;
          bottom: 80px;
          background: rgba(99, 102, 241, 0.18);
          animation: orbFloatTwo 10s ease-in-out infinite;
        }

        .hero-orb-three {
          width: 220px;
          height: 220px;
          left: 48%;
          top: 38%;
          background: rgba(16, 185, 129, 0.14);
          animation: orbFloatThree 11s ease-in-out infinite;
        }

        @keyframes orbFloatOne {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-18px, 14px, 0);
          }
        }

        @keyframes orbFloatTwo {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(18px, -18px, 0);
          }
        }

        @keyframes orbFloatThree {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-14px, -14px, 0);
          }
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 5;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: 128px 48px 46px;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 60px;
        }

        .hero-text-block {
          max-width: 560px;
        }

        .hero-countdown-area {
          margin-bottom: 24px;
        }

        .hero-countdown-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 12px;
        }

        .hero-brand-watermark {
          font-family: 'Amsterdam', cursive;
          font-size: clamp(1.8rem, 3vw, 2.5rem);
          font-weight: 700;
          color: #cbd5e1;
          margin-bottom: 0;
          line-height: 1.1;
        }

        .hero-familiar-pill-wrap {
          margin: 42px 0 20px;
        }

        .hero-familiar-pill {
          display: inline-block;
          padding: 6px 16px;
          font-size: 0.82rem;
          color: #64748b;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          transition: border-color 0.2s ease, background 0.2s ease;
          backdrop-filter: blur(12px);
        }

        .hero-familiar-pill:hover {
          border-color: #94a3b8;
          background: rgba(255, 255, 255, 0.9);
        }

        .hero-familiar-link {
          font-weight: 600;
          color: #4A6CF7;
          margin-left: 8px;
          text-decoration: none;
        }

        .hero-headline {
          font-size: clamp(2.2rem, 5vw, 3.6rem);
          font-weight: 800;
          color: #1e293b;
          line-height: 1.15;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .hero-description {
          font-size: clamp(0.95rem, 1.5vw, 1.1rem);
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 40px;
          max-width: 480px;
        }

        .hero-cta-row {
          display: flex;
          align-items: center;
          gap: 28px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }

        .hero-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 15px 36px;
          background: #4A6CF7;
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 6px 20px rgba(74, 108, 247, 0.35);
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          position: relative;
          z-index: 1;
          animation: pulse-wave 2s infinite;
        }

        .hero-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(74, 108, 247, 0.5);
          background: #3b5de7;
          animation: none;
        }

        @keyframes pulse-wave {
          0% {
            box-shadow: 0 0 0 0 rgba(74, 108, 247, 0.6);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(74, 108, 247, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(74, 108, 247, 0);
          }
        }

        .hero-cta-btn-secondary {
          font-weight: 600;
          font-size: 0.95rem;
          color: #1e293b;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .hero-cta-btn-secondary:hover {
          color: #4A6CF7;
        }

        .hero-notifications {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 0;
        }

        .notif-pill {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: fit-content;
          backdrop-filter: blur(12px);
        }

        .notif-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(74, 108, 247, 0.08);
        }

        .notif-badge-new {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          flex-shrink: 0;
          animation: pulse 1s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .notif-text {
          font-size: 0.8rem;
          font-weight: 500;
          color: #1e293b;
          line-height: 1.4;
          flex: 1;
        }

        .notif-arrow {
          font-size: 0.78rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .notice-indigo {
          border-color: rgba(99, 102, 241, 0.22);
        }

        .notice-indigo .notif-badge-new {
          background: rgba(99, 102, 241, 0.12);
          color: #3730a3;
        }

        .notice-indigo .notif-arrow {
          color: #4f46e5;
        }

        .notice-red {
          border-color: rgba(239, 68, 68, 0.22);
        }

        .notice-red .notif-badge-new {
          background: rgba(239, 68, 68, 0.12);
          color: #b91c1c;
        }

        .notice-red .notif-arrow {
          color: #dc2626;
        }

        .notice-green {
          border-color: rgba(34, 197, 94, 0.24);
        }

        .notice-green .notif-badge-new {
          background: rgba(34, 197, 94, 0.13);
          color: #15803d;
        }

        .notice-green .notif-arrow {
          color: #16a34a;
        }

        .notice-blue {
          border-color: rgba(59, 130, 246, 0.24);
        }

        .notice-blue .notif-badge-new {
          background: rgba(59, 130, 246, 0.13);
          color: #1d4ed8;
        }

        .notice-blue .notif-arrow {
          color: #2563eb;
        }

        .notice-yellow {
          border-color: rgba(234, 179, 8, 0.30);
        }

        .notice-yellow .notif-badge-new {
          background: rgba(234, 179, 8, 0.18);
          color: #92400e;
        }

        .notice-yellow .notif-arrow {
          color: #b45309;
        }

        .hero-image-collage {
          position: relative;
          flex: 1;
          left: 80px;
          max-width: 520px;
          min-width: 340px;
          min-height: 520px;
        }

        .hero-img-grid {
          display: flex;
          gap: 20px;
          position: relative;
          z-index: 2;
        }

        .hero-img-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .hero-img-col--left {
          flex: 0 0 44%;
          padding-top: 0;
        }

        .hero-img-col--right {
          flex: 0 0 52%;
          padding-top: 60px;
        }

        .hero-img-card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hero-img-card:hover {
          transform: translateY(-4px);
          box-shadow: rgba(17, 12, 46, 0.18) 0px 48px 100px 0px;
        }

        .hero-img-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .hero-img-col--left .hero-img-card:first-child {
          height: 260px;
        }

        .hero-img-col--left .hero-img-card:last-child {
          height: 220px;
        }

        .hero-img-card--large {
          height: 400px;
        }

        @media (max-width: 1024px) {
          .hero-content-wrapper {
            padding: 120px 36px 42px;
            gap: 38px;
          }

          .hero-image-collage {
            left: 20px;
            max-width: 430px;
            min-width: 320px;
          }

          .hero-img-card--large {
            height: 360px;
          }

          .hero-img-col--left .hero-img-card:first-child {
            height: 220px;
          }

          .hero-img-col--left .hero-img-card:last-child {
            height: 190px;
          }
        }

        @media (max-width: 768px) {
          .hero-section-base {
            min-height: auto;
          }

          .hero-content-wrapper {
            padding: 105px 24px 36px;
            flex-direction: column;
            align-items: flex-start;
            gap: 34px;
          }

          .hero-text-block {
            max-width: 100%;
          }

          .hero-headline {
            font-size: 2rem;
          }

          .hero-description {
            margin-bottom: 30px;
          }

          .hero-cta-row {
            margin-bottom: 30px;
          }

          .hero-image-collage {
            display: block;
            left: 0;
            min-width: 0;
            max-width: 100%;
            width: 100%;
            min-height: auto;
          }

          .hero-img-grid {
            display: grid;
            grid-template-columns: 0.9fr 1fr;
            gap: 12px;
          }

          .hero-img-col {
            gap: 12px;
          }

          .hero-img-col--right {
            padding-top: 34px;
          }

          .hero-img-col--left .hero-img-card:first-child {
            height: 160px;
          }

          .hero-img-col--left .hero-img-card:last-child {
            height: 135px;
          }

          .hero-img-card--large {
            height: 275px;
          }

          .notif-pill {
            max-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .hero-content-wrapper {
            padding: 96px 16px 32px;
          }

          .hero-headline {
            font-size: 1.9rem;
            line-height: 1.16;
          }

          .hero-description {
            font-size: 0.92rem;
            line-height: 1.65;
          }

          .hero-cta-row {
            flex-direction: column;
            align-items: stretch;
            gap: 14px;
            width: 100%;
          }

          .hero-cta-btn,
          .hero-cta-btn-secondary {
            width: 100%;
            min-height: 46px;
          }

          .hero-cta-btn-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            border: 1px solid #e2e8f0;
            background: rgba(255, 255, 255, 0.76);
          }

          .notif-pill {
            width: 100%;
            max-width: 100%;
            align-items: flex-start;
            font-size: 0.75rem;
            padding: 8px 14px;
          }

          .notif-text {
            font-size: 0.72rem;
          }

          .notif-arrow {
            display: none;
          }

          .hero-img-grid {
            gap: 10px;
          }

          .hero-img-col {
            gap: 10px;
          }

          .hero-img-col--right {
            padding-top: 28px;
          }

          .hero-img-card {
            border-radius: 14px;
          }

          .hero-img-col--left .hero-img-card:first-child {
            height: 128px;
          }

          .hero-img-col--left .hero-img-card:last-child {
            height: 112px;
          }

          .hero-img-card--large {
            height: 240px;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;