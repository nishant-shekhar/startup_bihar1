import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({
  user_id,
  status,
  statusColor,
  profileImage,
  companyName,
  founderName,
  since,
  sinceColor,
  category,
  categoryColor,
  moto,
}) => {
  const navigate = useNavigate();

  // Handle card click
  const handleCardClick = () => {
    navigate(`/Startup/${user_id}`);
  };

  return (
    <div className="pc-card" onClick={handleCardClick}>
      {/* Top accent line */}
      <div className="pc-accent-line" />

      {/* Logo / Profile Image */}
      <div className="pc-avatar-wrap">
        <img src={profileImage} alt={companyName} className="pc-avatar" />
      </div>

      {/* Company name */}
      <h3 className="pc-company">{companyName}</h3>

      {/* Founder */}
      <p className="pc-founder">{founderName}</p>

      {/* Motto */}
      <p className="pc-moto" title={moto}>
        "{moto}"
      </p>

      {/* Meta tags */}
      <div className="pc-tags">
        {since && since !== "N/A" && (
          <span className="pc-tag pc-tag--yellow">
            <span className="pc-tag-dot pc-tag-dot--yellow" />
            Since {since}
          </span>
        )}
        {category && category !== "N/A" && (
          <span className="pc-tag pc-tag--blue">
            <span className="pc-tag-dot pc-tag-dot--blue" />
            {category}
          </span>
        )}
      </div>

      {/* ===== Card Scoped Styles ===== */}
      <style>{`
        .pc-card {
          position: relative;
          background: #fff;
          border-radius: 14px;
          padding: 28px 22px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 320px;
          cursor: pointer;
          border: 1px solid #eef0f6;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .pc-card:hover {
          border-color: #4A6CF7;
          box-shadow: 0 12px 32px rgba(74, 108, 247, 0.1);
          transform: translateY(-4px);
        }

        .pc-accent-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #4A6CF7, #7b93fa);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .pc-card:hover .pc-accent-line {
          opacity: 1;
        }

        .pc-avatar-wrap {
          width: 72px;
          height: 72px;
          overflow: hidden;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
       

        .pc-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pc-company {
          font-size: 0.95rem;
          font-weight: 700;
          color: #090E34;
          text-align: center;
          margin: 0 0 4px;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }

        .pc-founder {
          font-size: 0.78rem;
          color: #959CB1;
          margin: 0 0 12px;
          font-weight: 500;
        }

        .pc-moto {
          font-size: 0.78rem;
          color: #637099;
          text-align: center;
          line-height: 1.5;
          font-style: italic;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          margin: 0 0 auto;
          padding: 0 4px;
        }

        .pc-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 14px;
        }

        .pc-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.01em;
        }

        .pc-tag--yellow {
          background: #fffbeb;
          color: #b45309;
        }
        .pc-tag--blue {
          background: #eef4ff;
          color: #4A6CF7;
        }

        .pc-tag-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        .pc-tag-dot--yellow {
          background: #f59e0b;
        }
        .pc-tag-dot--blue {
          background: #4A6CF7;
        }
      `}</style>
    </div>
  );
};

export default ProfileCard;
