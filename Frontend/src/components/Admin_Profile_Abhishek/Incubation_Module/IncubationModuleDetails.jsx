import React, { useEffect, useState } from "react";
import axios from "axios";

const IncubationModuleDetails = ({ id }) => {
  const [data, setData] = useState({});
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const token = localStorage.getItem("token");

  const [selectedCenter, setSelectedCenter] = useState("");
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const adminRole = localStorage.getItem("admin_role") || "admin";
  const adminId = localStorage.getItem("admin_id") || "admin";

  const incubationCenters = [
    "Chandragupt Institute of Management (CIMP) Patna",
    "Indian Institute of Technology (IIT), Patna",
    "Birla Institute of Technology (BIT), Patna",
    "Bihar Agricultural University (BAU), SABOUR, Bhagalpur",
    "Central Institute of Petrochemicals Engineering & Technology (CIPET), Hajipur",
    "Tool Room & Training Centre (TRTC)",
    "Dr. Rajendra Prasad Central Agricultural University (PUSA), Samastipur",
    "Amity University (AMITY), Patna",
    "Muzaffarpur Institute of Technology (MIT), Muzaffarpur",
    "Development Management Institute (DMI), Patna",
    "National Institute of Electronics & Information Technology (NIELIT), Patna",
    "Chanakya National Law University (CNLU), Patna",
    "National Institute of Technology (NIT), Patna",
    "Footwear Design and Development Institute (FDDI), Patna",
    "Upendra Maharathi Shilp Anusandhan Sansthan (UMSAS), Patna",
    "Indian Institute of Information Technology (IIIT), Bhagalpur",
    "Darbhanga College of Engineering (DCE), Darbhanga",
    "Indian Institute of Management (IIM), Gaya",
    "Software Technology Park of India (STPI), Patna",
    "Aryabhatt Knowledge University (AKU), Patna",
    "Loknayak Jai Prakash Institute of Technology",
  ];

  // Fetch application data by ID
  const fetchData = async () => {
    if (id) {
      try {
        const response = await axios.get(
          `http://localhost:3007/api/incubation/v1/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Handle dialog messages
  const handleDialog = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
    setTimeout(() => setShowDialog(false), 2000);
  };

  // Handle assigning the incubation center
  const handleAssign = async () => {
    if (!selectedCenter) {
      handleDialog("Please select an incubation center.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3007/api/incubation/u1/${id}`,
        {
          documentStatus: "Accepted",
          comment: `Assigned to ${selectedCenter}`,
          assignCenter: selectedCenter,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      handleDialog("Incubation center assigned successfully.");
      await fetchData();
    } catch (error) {
      console.error("Error assigning center:", error);
    }
  };

  // Handle rejecting the application
  const handleReject = async () => {
    if (!comment) {
      handleDialog("Please provide a reason for rejection.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3007/api/incubation/u1/${id}`,
        {
          documentStatus: "Rejected",
          comment: `Rejected: ${comment}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      handleDialog("Application rejected successfully.");
      setIsCommentVisible(false);
      await fetchData();
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  // Get status color dynamically
  const getStatusColor = () => {
    if (data.documentStatus === "Accepted") return "text-green-500";
    if (data.documentStatus === "Rejected") return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <div className="h-screen overflow-y-auto">
      <h1 className="pt-5 pl-8 text-2xl">Incubation Module Details</h1>
      <div className="px-8 py-5">
        <table className="min-w-full bg-white">
          <tbody>
            {/* Status */}
            {data.documentStatus && (
              <tr>
                <td className="py-4 px-4 border">Application Status</td>
                <td className={`py-4 px-4 border ${getStatusColor()}`}>
                  {data.documentStatus}
                </td>
              </tr>
            )}

            {/* Preferences */}
            <tr>
              <td className="py-4 px-4 border">Preference 1</td>
              <td className="py-4 px-4 border">{data.preference1 || "N/A"}</td>
            </tr>
            <tr>
              <td className="py-4 px-4 border">Preference 2</td>
              <td className="py-4 px-4 border">{data.preference2 || "N/A"}</td>
            </tr>
            <tr>
              <td className="py-4 px-4 border">Preference 3</td>
              <td className="py-4 px-4 border">{data.preference3 || "N/A"}</td>
            </tr>

            {/* Assign Center */}
            <tr>
              <td className="py-4 px-4 border">Assign Incubation Center</td>
              <td className="py-4 px-4 border">
                <select
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select</option>
                  {incubationCenters.map((center) => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-x-2 pr-4 py-3">
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
            onClick={handleAssign}
          >
            Assign
          </button>
          <button
            type="button"
            className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white"
            onClick={() => setIsCommentVisible(true)}
          >
            Reject
          </button>
        </div>

        {/* Reject Comment Modal */}
        {isCommentVisible && (
          <div className="absolute top-64 w-3/12 bg-white rounded-md shadow-xl p-4 z-10 left-[37%]">
            <h2 className="text-lg font-semibold">Add Comment</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2 border rounded-md w-full h-20 pl-2 pt-2"
            />
            <div className="flex justify-end gap-x-2 mt-4">
              <button
                type="button"
                className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white"
                onClick={() => setIsCommentVisible(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncubationModuleDetails;
