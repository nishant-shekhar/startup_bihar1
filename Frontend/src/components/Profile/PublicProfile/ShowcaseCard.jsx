import React from "react";
import { useState } from "react";
import StatusDialog from "../../UserForm/StatusDialog";
import axios from "axios";

/* ── design tokens (matches StartupPublicProfile) ── */
const P = "#000000";
const BORDER = "#e8ecf0";
const TEXT = "#090E34";
const MUTED = "#959CB1";

const ShowcaseCard = ({
  imgurl,
  dateandtime,
  title,
  subtitle,
  tag,
  projectLink,
  id,
  delhidden,
}) => {
  const [dialogStatus, setDialogStatus] = useState({
    isVisible: false,
    title: "",
    subtitle: "",
    buttonVisible: false,
    status: "",
    cancelButton: "",
    actionButton: "",
  });

  const deletePost = () => {
    setDialogStatus({ ...dialogStatus, isVisible: false });
    console.log("Delete Clicked", id);
    axios
      .delete(`https://startupbihar.in/api/showcase/delete/${id}`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      })
      .then((response) => {
        console.log("Data Deleted successfully:", response.data);
        setDialogStatus({
          title: "Deleting Showcase",
          subtitle: "Your post has been deleted.",
          isVisible: true,
          buttonVisible: true,
          status: "success",
        });
      })
      .catch((error) => {
        console.error("Error posting data:", error);
        setDialogStatus({
          title: "Deleting Showcase",
          subtitle: "Some problem occur",
          isVisible: true,
          buttonVisible: true,
          status: "failed",
        });
      });
  };

  const handleDeleteClick = () => {
    setDialogStatus({
      title: "Delete Showcase",
      subtitle: "Are you sure you want to delete this showcase?",
      isVisible: true,
      buttonVisible: true,
      status: "delete",
      cancelButton: "Yes",
      actionButton: "No",
    });
  };

  return (
    <div>
      <div
        style={{
          background: "#ffffff",
          borderRadius: 12,
          border: `1px solid ${BORDER}`,
          boxShadow: "0 2px 12px rgba(74,108,247,0.06)",
          overflow: "hidden",
          fontFamily: "'Inter', sans-serif",
          transition: "box-shadow 0.2s, transform 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow =
            "0 8px 28px rgba(74,108,247,0.13)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow =
            "0 2px 12px rgba(74,108,247,0.06)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Image */}
        <div style={{ height: 148, overflow: "hidden", position: "relative" }}>
          <img
            src={imgurl}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Tag pill over image */}
          {tag && (
            <span
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(6px)",
                border: `1px solid ${BORDER}`,
                borderRadius: 100,
                padding: "3px 10px",
                fontSize: 11,
                fontWeight: 600,
                color: TEXT,
              }}
            >
              {tag}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "14px 16px 16px" }}>
          {/* Date */}
          {dateandtime && (
            <p style={{ fontSize: 11.5, color: MUTED, fontWeight: 500, margin: "0 0 6px" }}>
              {dateandtime}
            </p>
          )}

          {/* Title */}
          <h3
            style={{
              fontSize: 14.5,
              fontWeight: 700,
              color: TEXT,
              margin: "0 0 4px",
              letterSpacing: "-0.02em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </h3>

          {/* Subtitle */}
          {subtitle && (
            <p
              style={{
                fontSize: 12.5,
                color: MUTED,
                margin: "0 0 12px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Divider + Actions */}
          {(projectLink || !delhidden) && (
            <>
              <div style={{ height: 1, background: BORDER, margin: "0 0 12px" }} />
              <div style={{ display: "flex", gap: 8 }}>
                {projectLink && (
                  <button
                    type="button"
                    onClick={() => {
                      const url =
                        projectLink.startsWith("http://") ||
                        projectLink.startsWith("https://")
                          ? projectLink
                          : `https://${projectLink}`;
                      window.open(url, "_blank");
                    }}
                    style={{
                      flex: 1,
                      padding: "7px 0",
                      borderRadius: 8,
                      border: `1.5px solid ${P}`,
                      background: P,
                      color: "#fff",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "opacity 0.15s",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    View Link
                  </button>
                )}
                {!delhidden && (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    style={{
                      padding: "7px 14px",
                      borderRadius: 8,
                      border: `1.5px solid #fecaca`,
                      background: "#fff5f5",
                      color: "#ef4444",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.15s",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#fee2e2")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "#fff5f5")}
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <StatusDialog
        isVisible={dialogStatus.isVisible}
        title={dialogStatus.title}
        subtitle={dialogStatus.subtitle}
        buttonVisible={dialogStatus.buttonVisible}
        cancelButton={dialogStatus.cancelButton}
        actionButton={dialogStatus.actionButton}
        onClose={() => setDialogStatus({ ...dialogStatus, isVisible: false })}
        onCancel={() => deletePost()}
        status={dialogStatus.status}
      />
    </div>
  );
};

export default ShowcaseCard;
