import React, { useState } from "react";
import {
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa";

const SixthPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    // Basic email and phone validation
    const email = form.email.value;
    const phone = form.phone.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!emailRegex.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(phone)) {
      setFormError("Please enter a valid 10-digit phone number.");
      return;
    }

    // If all validations pass
    setFormError("");

    // Web3Forms API - Mock submit without redirection
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: new FormData(form),
    })
      .then((response) => {
        if (response.ok) {
          setIsSubmitted(true);
          form.reset();
          setTimeout(() => setIsSubmitted(false), 3010);
        }
      })
      .catch(() => {
        setFormError("Submission failed. Please try again later.");
      });
  };

  return (
    <>
      <section id="contact" className="sp-section">
        <div className="sp-container">
          {/* ── Section heading ── */}
          <div className="sp-heading-block">
            <span className="sp-heading-badge">Contact Us</span>
            <h2 className="sp-heading-title">We'd Love to Hear From You</h2>
            <p className="sp-heading-desc">
              Have questions about Startup Bihar? Fill out the form below and
              our team will get back to you shortly.
            </p>
          </div>

          {/* ── Content Grid ── */}
          <div className="sp-content-grid">
            {/* Left — Contact Info Cards + Map Image */}
            <div className="sp-info-col">
              {/* Info cards */}
              <div className="sp-info-cards">
                <div className="sp-info-card">
                  <div className="sp-info-icon-wrap">
                    <HiOutlineLocationMarker className="sp-info-icon" />
                  </div>
                  <div>
                    <h4 className="sp-info-label">Visit Us</h4>
                    <p className="sp-info-value">
                      Department of Industries, 2nd Floor, Vikas Bhawan, New
                      Secretariat, Bailey Road, Patna 800015
                    </p>
                  </div>
                </div>

                <div className="sp-info-card">
                  <div className="sp-info-icon-wrap">
                    <HiOutlinePhone className="sp-info-icon" />
                  </div>
                  <div>
                    <h4 className="sp-info-label">Call Us</h4>
                    <p className="sp-info-value">1800 345 6214 (Toll Free)</p>
                  </div>
                </div>

                <div className="sp-info-card">
                  <div className="sp-info-icon-wrap">
                    <HiOutlineMail className="sp-info-icon" />
                  </div>
                  <div>
                    <h4 className="sp-info-label">Email Us</h4>
                    <p className="sp-info-value">startup-bihar@gov.in</p>
                  </div>
                </div>
              </div>

              {/* Office image */}
              <div className="sp-office-img-wrap">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/gatishaktibihar.firebasestorage.app/o/startup_bihar%2FWhatsApp%20Image%202025-01-10%20at%2015.50.22.jpeg?alt=media&token=554e04ba-2da5-4265-b2a8-315af9449c47"
                  alt="Startup Bihar Office"
                  className="sp-office-img"
                />
                <div className="sp-office-img-overlay" />
              </div>
            </div>

            {/* Right — Form */}
            <div className="sp-form-col">
              <div className="sp-form-card">
                <h3 className="sp-form-title">Send us a Message</h3>
                <p className="sp-form-subtitle">
                  Fill the form and we will get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} method="POST" className="sp-form">
                  <input
                    type="hidden"
                    name="access_key"
                    value="d6295a64-037f-47f0-adb4-cf487d753a74"
                  />

                  {/* Name & Email row */}
                  <div className="sp-form-row">
                    <div className="sp-form-group">
                      <label className="sp-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        className="sp-input"
                        required
                      />
                    </div>
                    <div className="sp-form-group">
                      <label className="sp-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        className="sp-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone & Topic row */}
                  <div className="sp-form-row">
                    <div className="sp-form-group">
                      <label className="sp-label">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="10-digit number"
                        className="sp-input"
                        required
                      />
                    </div>
                    <div className="sp-form-group">
                      <label className="sp-label">Topic</label>
                      <select
                        name="topic"
                        className="sp-input sp-select"
                        required
                      >
                        <option value="">Choose topic</option>
                        <option>Startup</option>
                        <option>Startup Cell</option>
                        <option>Incubation Center</option>
                        <option>Funding</option>
                        <option>Acceleration</option>
                        <option>Co-working Space</option>
                        <option>State Government</option>
                        <option>Central Government</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="sp-form-group">
                    <label className="sp-label">Message</label>
                    <textarea
                      name="message"
                      placeholder="Tell us how we can help..."
                      className="sp-input sp-textarea"
                      required
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className={`sp-submit-btn ${isSubmitted ? "sp-submit-btn--success" : ""}`}
                  >
                    {isSubmitted ? (
                      <>
                        <svg
                          className="sp-check-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Sent Successfully!
                      </>
                    ) : (
                      <>
                        Send Message
                        <FaArrowRight className="sp-btn-arrow" />
                      </>
                    )}
                  </button>

                  {/* Feedback messages */}
                  {isSubmitted && (
                    <div className="sp-msg sp-msg--success">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      We will contact you shortly.
                    </div>
                  )}
                  {formError && (
                    <div className="sp-msg sp-msg--error">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
                      </svg>
                      {formError}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Scoped Styles ===== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .sp-section {
          width: 100%;
          padding: 80px 0;
          background: #fff;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .sp-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
        }

        /* ── Heading ── */
        .sp-heading-block {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 56px;
        }
        .sp-heading-badge {
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
        .sp-heading-title {
          font-size: clamp(1.8rem, 4vw, 2.25rem);
          font-weight: 800;
          color: #090E34;
          line-height: 1.2;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }
        .sp-heading-desc {
          font-size: 1rem;
          line-height: 1.7;
          color: #959CB1;
          margin: 0;
        }

        /* ── Content Grid ── */
        .sp-content-grid {
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 40px;
          align-items: start;
        }

        /* ── Left — Info Column ── */
        .sp-info-col {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .sp-info-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .sp-info-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: #f8faff;
          border: 1px solid #eef2ff;
          border-radius: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sp-info-card:hover {
          border-color: #4A6CF7;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(74, 108, 247, 0.08);
        }
        .sp-info-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(74, 108, 247, 0.1);
          flex-shrink: 0;
        }
        .sp-info-icon {
          font-size: 1.2rem;
          color: #4A6CF7;
        }
        .sp-info-label {
          font-size: 0.88rem;
          font-weight: 700;
          color: #090E34;
          margin: 0 0 4px;
        }
        .sp-info-value {
          font-size: 0.84rem;
          color: #959CB1;
          line-height: 1.6;
          margin: 0;
        }

        /* Office image */
        .sp-office-img-wrap {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 16 / 9;
        }
        .sp-office-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sp-office-img-wrap:hover .sp-office-img {
          transform: scale(1.03);
        }
        .sp-office-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(9, 14, 52, 0.4) 100%);
          pointer-events: none;
        }

        /* ── Right — Form Column ── */
        .sp-form-col {
          position: relative;
        }
        .sp-form-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
          transition: box-shadow 0.3s ease;
        }
        .sp-form-card:hover {
          box-shadow: 0 8px 40px rgba(74, 108, 247, 0.08);
        }
        .sp-form-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #090E34;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }
        .sp-form-subtitle {
          font-size: 0.88rem;
          color: #959CB1;
          margin: 0 0 28px;
          line-height: 1.6;
        }

        .sp-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .sp-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .sp-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sp-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: #1e293b;
        }
        .sp-input {
          padding: 12px 16px;
          font-size: 0.88rem;
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          background: #f8faff;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          outline: none;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sp-input::placeholder {
          color: #b0b5c7;
        }
        .sp-input:focus {
          border-color: #4A6CF7;
          box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
          background: #fff;
        }
        .sp-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23959CB1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .sp-textarea {
          min-height: 120px;
          resize: vertical;
        }

        /* Submit button */
        .sp-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px 28px;
          background: #4A6CF7;
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(74, 108, 247, 0.3);
          margin-top: 4px;
        }
        .sp-submit-btn:hover {
          background: #3b5de7;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(74, 108, 247, 0.4);
        }
        .sp-submit-btn:active {
          transform: translateY(0);
        }
        .sp-submit-btn--success {
          background: #10b981;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
        }
        .sp-submit-btn--success:hover {
          background: #059669;
          box-shadow: 0 8px 28px rgba(16, 185, 129, 0.4);
        }
        .sp-btn-arrow {
          font-size: 0.72rem;
          transition: transform 0.2s ease;
        }
        .sp-submit-btn:hover .sp-btn-arrow {
          transform: translateX(3px);
        }
        .sp-check-icon {
          width: 18px;
          height: 18px;
        }

        /* Feedback messages */
        .sp-msg {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 0.84rem;
          font-weight: 500;
          animation: spFadeIn 0.3s ease;
        }
        .sp-msg--success {
          background: rgba(16, 185, 129, 0.08);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }
        .sp-msg--error {
          background: rgba(239, 68, 68, 0.08);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.15);
        }

        @keyframes spFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .sp-content-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .sp-form-card {
            padding: 32px;
          }
        }

        @media (max-width: 640px) {
          .sp-section {
            padding: 48px 0;
          }
          .sp-container {
            padding: 0 20px;
          }
          .sp-form-row {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .sp-form-card {
            padding: 24px 20px;
            border-radius: 16px;
          }
          .sp-heading-title {
            font-size: 1.5rem;
          }
          .sp-info-card {
            padding: 16px;
          }
        }

        @media (max-width: 400px) {
          .sp-form-card {
            padding: 20px 16px;
          }
          .sp-submit-btn {
            padding: 12px 20px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
};

export default SixthPage;
