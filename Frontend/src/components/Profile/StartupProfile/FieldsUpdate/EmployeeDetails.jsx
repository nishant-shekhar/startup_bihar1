import React, { useEffect, useState } from "react";
import axios from "axios";
import StatusDialog from "../../../UserForm/StatusDialog";

/* ── Design tokens (matches StartupPublicProfile) ── */
const P      = "#000000";
const BORDER = "#e8ecf0";
const TEXT   = "#090E34";
const MUTED  = "#959CB1";
const CARD   = "#ffffff";
const BG     = "rgba(9,14,52,0.45)";

const EmployeeDetails = ({ userId, onClose, deleteBtn }) => {
  const [employee, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [dialogStatus, setDialogStatus] = useState({
    isVisible: false,
    title: "",
    subtitle: "",
    buttonVisible: false,
    status: "",
    cancelButton: "",
    actionButton: "",
  });

  // Fetch employees from API
  const fetchStaff = async () => {
    try {
      const response = await axios.get(
        `https://startupbihar.in/api/userlogin/getEmployees/${userId}`
      );
      setStaff(response.data.employee || []);
    } catch (error) {
      console.log(`Error fetching employee: ${error}`);
    }
  };

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStaffClick   = (s) => setSelectedStaff(s);
  const handleClosePopup   = () => setSelectedStaff(null);
  const handleCloseDialog  = () => setDialogStatus({ ...dialogStatus, isVisible: false });

  const handleDeleteStaff = () => {
    setDialogStatus({
      title: "Delete Employee",
      subtitle: "Are you sure you want to delete this employee member?",
      isVisible: true,
      buttonVisible: true,
      status: "delete",
      cancelButton: "Yes",
      actionButton: "No",
    });
  };

  const confirmDeleteStaff = async () => {
    if (!selectedStaff) return;
    try {
      await axios.delete(
        `https://startupbihar.in/api/userlogin/deleteEmployee/${selectedStaff.id}`,
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setDialogStatus({
        isVisible: true,
        title: "Deleting Employee",
        subtitle: "Employee member has been successfully deleted.",
        buttonVisible: true,
        status: "success",
      });
      setStaff(employee.filter((s) => s.id !== selectedStaff.id));
      setSelectedStaff(null);
    } catch (error) {
      console.error("Failed to delete employee:", error);
      setDialogStatus({
        isVisible: true,
        title: "Deleting Employee",
        subtitle: "Some problem occurred during deletion.",
        buttonVisible: true,
        status: "failed",
      });
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>

      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, background: BG, backdropFilter: "blur(6px)" }}
        onClick={onClose}
      />

      {/* Main Panel */}
      <div style={{
        position: "relative",
        background: CARD,
        borderRadius: 16,
        border: `1px solid ${BORDER}`,
        boxShadow: "0 24px 60px rgba(9,14,52,0.18), 0 4px 16px rgba(0,0,0,0.08)",
        width: "min(860px, 94vw)",
        maxHeight: "80vh",
        overflowY: "auto",
        padding: "28px 28px 32px",
      }}>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute", top: 14, right: 14,
            width: 30, height: 30, borderRadius: 8,
            border: `1px solid ${BORDER}`, background: "#f4f6f9",
            cursor: "pointer", color: MUTED, fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#e8ecf0")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#f4f6f9")}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ marginBottom: 22 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: TEXT, letterSpacing: "-0.03em", margin: "0 0 4px" }}>
            Team Members
          </h2>
          <p style={{ fontSize: 13, color: MUTED, margin: 0, fontWeight: 500 }}>
            {employee.length} {employee.length === 1 ? "member" : "members"}
          </p>
        </div>

        {/* Grid */}
        {employee.length === 0 ? (
          <div style={{ padding: "48px 0", textAlign: "center", color: MUTED, fontSize: 13 }}>
            No team members found.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
            {employee.map((s, i) => (
              <div
                key={i}
                onClick={() => handleStaffClick(s)}
                style={{
                  background: CARD,
                  borderRadius: 12,
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 2px 10px rgba(9,14,52,0.05)",
                  padding: "20px 14px 16px",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  cursor: "pointer",
                  transition: "box-shadow 0.18s, transform 0.18s",
                  textAlign: "center",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(9,14,52,0.12)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 10px rgba(9,14,52,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <img
                  src={s.dp}
                  alt={s.name}
                  style={{
                    width: 64, height: 64, borderRadius: "50%",
                    objectFit: "cover",
                    border: `3px solid ${CARD}`,
                    boxShadow: `0 0 0 2px ${BORDER}`,
                    marginBottom: 12,
                  }}
                />
                <h3 style={{ fontSize: 13.5, fontWeight: 700, color: TEXT, margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                  {s.name}
                </h3>
                <p style={{ fontSize: 12, color: MUTED, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                  {s.designation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Popup */}
      {selectedStaff && (
        <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{ position: "absolute", inset: 0, background: BG, backdropFilter: "blur(6px)" }}
            onClick={handleClosePopup}
          />
          <div style={{
            position: "relative",
            background: CARD,
            borderRadius: 18,
            border: `1px solid ${BORDER}`,
            boxShadow: "0 24px 60px rgba(9,14,52,0.2)",
            width: "min(360px, 92vw)",
            padding: "28px 24px 24px",
            textAlign: "center",
          }}>
            {/* Close */}
            <button
              type="button"
              onClick={handleClosePopup}
              style={{
                position: "absolute", top: 12, right: 12,
                width: 28, height: 28, borderRadius: 8,
                border: `1px solid ${BORDER}`, background: "#f4f6f9",
                cursor: "pointer", color: MUTED, fontSize: 18,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ×
            </button>

            {/* Photo */}
            <div style={{
              width: 88, height: 88, borderRadius: "50%",
              overflow: "hidden", margin: "0 auto 16px",
              border: `3px solid ${CARD}`,
              boxShadow: `0 0 0 2px ${BORDER}, 0 4px 16px rgba(9,14,52,0.12)`,
            }}>
              <img
                src={selectedStaff.dp}
                alt={selectedStaff.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <h3 style={{ fontSize: 17, fontWeight: 800, color: TEXT, margin: "0 0 4px", letterSpacing: "-0.025em" }}>
              {selectedStaff.name}
            </h3>
            <p style={{ fontSize: 13, color: P, fontWeight: 600, margin: "0 0 4px" }}>
              {selectedStaff.designation}
            </p>
            {selectedStaff.qualification && (
              <p style={{ fontSize: 12.5, color: MUTED, margin: "0 0 20px" }}>
                {selectedStaff.qualification}
              </p>
            )}

            {deleteBtn && (
              <button
                onClick={handleDeleteStaff}
                style={{
                  padding: "8px 24px", borderRadius: 8,
                  border: "1.5px solid #fecaca", background: "#fff5f5",
                  color: "#ef4444", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "background 0.15s",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#fee2e2")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#fff5f5")}
              >
                Delete Employee
              </button>
            )}
          </div>
        </div>
      )}

      {/* Status Dialog */}
      <StatusDialog
        isVisible={dialogStatus.isVisible}
        title={dialogStatus.title}
        subtitle={dialogStatus.subtitle}
        buttonVisible={dialogStatus.buttonVisible}
        status={dialogStatus.status}
        cancelButton={dialogStatus.cancelButton}
        actionButton={dialogStatus.actionButton}
        onClose={handleCloseDialog}
        onCancel={() => {
          handleCloseDialog();
          confirmDeleteStaff();
        }}
      />
    </div>
  );
};

export default EmployeeDetails;
