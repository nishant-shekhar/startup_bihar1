import React, { useEffect, useState } from "react";
import axios from "axios";
import NotificationActivity from "../StartupNotificationActivity";

const MatchingLoanModuleDetails = ({ id }) => {
  const [data, setData] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isPdfModalVisible, setIsPdfModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [showNotificationActivity, setNotificationActivity] = useState(false);

  const token = localStorage.getItem("token");
  const adminRole = localStorage.getItem("admin_role") || "admin";
  const adminId = localStorage.getItem("admin_id") || "admin";

  // ✅ comment modal
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [comment, setComment] = useState("•");

  // ✅ for partial reject selection (same pattern as 2nd tranche)
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [pendingAction, setPendingAction] = useState(null); // "Rejected" | "Partially Rejected"

  const handleDialog = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
    setTimeout(() => setShowDialog(false), 2000);
  };

  const fetchData = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`https://startupbihar.in/api/matchingLoan/v1/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      setData(res.data || {});
    } catch (err) {
      console.error("Error fetching matching loan details:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleViewPdf = (url) => {
    if (!url) return;
    const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
    setPdfUrl(viewerUrl);
    setIsPdfModalVisible(true);
  };

  const closePdfModal = () => {
    setIsPdfModalVisible(false);
    setPdfUrl("");
  };

  const getStatusColor = () => {
    const st = (data?.documentStatus || "").toLowerCase();
    if (st === "accepted") return "text-green-600";
    if (st === "rejected") return "text-red-600";
    if (st === "partially rejected") return "text-yellow-600";
    return "";
  };

  // ✅ notification (same style as 2nd tranche)
  const postNotification = async (notificationMessage, docLink = null, subtitle = "Matching Loan Application") => {
    try {
      if (!data?.user?.user_id || !adminId || !adminRole || !notificationMessage) {
        console.error("Missing required fields to post notification");
        return;
      }

      const notificationData = {
        user_id: data.user.user_id,
        admin_id: adminId,
        admin_role: adminRole,
        notification: notificationMessage,
        subtitle,
        related_to: `Application ID: ${id}`,
      };

      if (docLink) notificationData.docLink = docLink;

      const response = await axios.post("https://startupbihar.in/api/notifications/", notificationData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      if (response.status === 201) console.log("Notification posted");
    } catch (error) {
      console.error("Notification error:", error.response?.data || error.message);
    }
  };

  // ✅ documents list (paths)
  const fileFields = [
    { key: "proofOfInvestmentPath", label: "Proof of Investment" },
    { key: "accountStatementPath", label: "Account Statement" },
    { key: "investorUndertakingPath", label: "Investor Undertaking" },
    { key: "equityDilutionProofPath", label: "Equity Dilution Proof" },
    { key: "utilizationPlanPath", label: "Utilization Plan" },
    { key: "boardResolutionPath", label: "Board Resolution" },
  ];

  // ✅ checkbox selection for partial reject
  const handleCheckboxChange = (event) => {
    const { value } = event.target;
    setSelectedOptions((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  };

  // ✅ bullet support like 2nd tranche
  const handleCommentChange = (e) => setComment(e.target.value);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setComment((prev) => `${prev}\n• `);
    }
  };

  // ✅ status update: sends comment + partial reject null selected doc fields (same as 2nd tranche)
  const updateStatus = async (nextStatus, commentText = "") => {
    if (!id) return;

    handleDialog(`Updating status to ${nextStatus}...`);

    try {
      let payload = {
        documentStatus: nextStatus,
        comment:
          nextStatus === "Accepted"
            ? "Document has been reviewed and approved."
            : `Document has been ${nextStatus.toLowerCase()} for reason: ${commentText || ""}`,
      };

      // ✅ Partial reject requires selecting documents
      if (nextStatus === "Partially Rejected") {
        if (!selectedOptions.length) {
          handleDialog("Select at least one document for partial reject.");
          return;
        }

        // set selected doc paths to null
        const updateFields = selectedOptions.reduce((acc, fieldKey) => {
          acc[fieldKey] = null;
          return acc;
        }, {});

        payload = { ...payload, ...updateFields };
      }

      await axios.patch(`https://startupbihar.in/api/matchingLoan/u1/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });

      await fetchData();

      // ✅ Notification docLinks (same format as 2nd tranche)
      if (nextStatus === "Accepted") {
        await postNotification("Your Matching Loan application has been accepted.");
      } else if (nextStatus === "Rejected") {
        await postNotification(
          "Your Matching Loan application has been rejected.",
          null,
          `Reason: ${commentText || ""}`
        );
      } else if (nextStatus === "Partially Rejected") {
        const docLinks = selectedOptions
          .map((k) => `${data?.[k] || ""}^${fileFields.find((f) => f.key === k)?.label || k}`)
          .join(", ");

        await postNotification(
          "Your Matching Loan application has been partially rejected.",
          docLinks,
          `Reason: ${commentText || ""}`
        );
      }

      handleDialog(`Application is ${nextStatus}.`);

      // cleanup
      setIsCommentVisible(false);
      setSelectedOptions([]);
      setPendingAction(null);
    } catch (err) {
      console.error("Status update error:", err);
      handleDialog("Failed to update status.");
    }
  };

  const downloadAllDocuments = () => {
    fileFields.forEach(({ key, label }) => {
      const url = data?.[key];
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = label;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const openAllDocuments = () => {
    fileFields.forEach(({ key }) => {
      const url = data?.[key];
      if (url) {
        const viewerUrl = `https://docs.google.com/viewerng/viewer?url=${encodeURIComponent(url)}`;
        window.open(viewerUrl, "_blank");
      }
    });
  };

  return (
    <div className="h-screen overflow-y-auto" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
      <h1 className="pt-5 pl-8 text-2xl">{data?.user?.company_name || "Matching Loan Details"}</h1>

      {/* Company summary tables */}
      <div className="overflow-x-auto p-4">
        <div className="grid grid-cols-12 gap-4">
          <table className="col-span-12 sm:col-span-6 bg-white border border-gray-300 shadow-md rounded-lg text-sm">
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium text-gray-600">Company Name</td>
                <td className="px-4 py-2 text-gray-900">
                  <a
                    href={`https://startupbihar.in/Startup/${data?.user?.user_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    {data?.user?.company_name || "N/A"}
                  </a>
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium text-gray-600">Registration No.</td>
                <td className="px-4 py-2 text-gray-900">{data?.user?.registration_no || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium text-gray-600">Email</td>
                <td className="px-4 py-2 text-indigo-600">{data?.user?.email || "N/A"}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-600">CIN</td>
                <td className="px-4 py-2 text-gray-900">{data?.user?.cin || "N/A"}</td>
              </tr>
            </tbody>
          </table>

          <table className="col-span-12 sm:col-span-6 bg-white border border-gray-300 shadow-md rounded-lg text-sm">
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium text-gray-600">Startup ID</td>
                <td className="px-4 py-2 text-gray-900">{data?.user?.user_id || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium text-gray-600">Founder</td>
                <td className="px-4 py-2 text-gray-900">{data?.user?.founder_name || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium text-gray-600">Mobile</td>
                <td className="px-4 py-2 text-gray-900">{data?.user?.mobile || "N/A"}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-600">District RoC</td>
                <td className="px-4 py-2 text-gray-900">{data?.user?.districtRoc || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Top info row */}
      <div className="flex items-center justify-between px-8 py-5">
        <p className="text-sm font-light text-gray-600">
          First Applied on: {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"} |{" "}
          Last Action on: {data?.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : "N/A"}
        </p>

        <button
          type="button"
          onClick={() => setNotificationActivity(true)}
          className="text-sm text-indigo-700 hover:text-indigo-900 underline hover:font-medium transition-all duration-200"
        >
          View Notifications
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={downloadAllDocuments}
            className="text-sm text-indigo-700 hover:text-indigo-900 underline hover:font-medium transition-all duration-200"
          >
            Download All Documents
          </button>
          <button
            type="button"
            onClick={openAllDocuments}
            className="text-sm text-indigo-700 hover:text-indigo-900 underline hover:font-medium transition-all duration-200"
          >
            Open All Documents
          </button>
        </div>
      </div>

      {/* Matching Loan fields */}
      <div className="px-8 pb-4">
        <table className="min-w-full bg-white">
          <tbody>
            {data?.documentStatus && (
              <tr>
                <td className="py-4 px-4 border">Application Status</td>
                <td className={`py-4 px-4 border ${getStatusColor()}`}>
                  {data.documentStatus}
                  {data?.comment ? ` | ${data.comment}` : ""}
                </td>
              </tr>
            )}

            <tr>
              <td className="py-4 px-4 border">Fund Raised</td>
              <td className="py-4 px-4 border">{data?.fundRaised ?? "N/A"}</td>
            </tr>
            <tr>
              <td className="py-4 px-4 border">Investor Name</td>
              <td className="py-4 px-4 border">{data?.investorName ?? "N/A"}</td>
            </tr>
            <tr>
              <td className="py-4 px-4 border">Matching Grant Amount</td>
              <td className="py-4 px-4 border">{data?.matchingGrantAmount ?? "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Documents table (View/Download) */}
      <div className="px-8 pb-6">
        <table className="min-w-full bg-white">
          <tbody>
            {fileFields.map(({ key, label }) => (
              <tr key={key}>
                <td className="py-4 px-4 border">{label}</td>
                <td className="border-b border-l border-t border-r w-[35vw]">
                  <div className="px-4 py-4">
                    <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                      <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
                        <div className="flex w-0 flex-1 items-center">
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">
                              {data?.[key] ? (
                                data[key]
                              ) : (
                                <span className="text-red-500">File is either rejected or not available</span>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="ml-4 shrink-0">
                          <button
                            disabled={!data?.[key]}
                            onClick={() => handleViewPdf(data[key])}
                            className={`font-medium ${
                              data?.[key] ? "text-indigo-600 hover:text-indigo-900" : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            View
                          </button>
                        </div>

                        <div className="ml-4 shrink-0">
                          <a
                            href={data?.[key] || "#"}
                            download
                            className={`font-medium ${
                              data?.[key] ? "text-indigo-600 hover:text-indigo-900" : "text-gray-400 pointer-events-none"
                            }`}
                          >
                            Download
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-x-2 pr-4 py-4">
          <button
            type="button"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
            onClick={() => updateStatus("Accepted")}
          >
            Approve
          </button>

          <button
            type="button"
            className="rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white"
            onClick={() => {
              setPendingAction("Rejected");
              setIsCommentVisible(true);
              setComment("•");
              setSelectedOptions([]);
            }}
          >
            Reject
          </button>

         
        </div>
      </div>

      {/* Comment modal */}
      {isCommentVisible && (
        <div className="fixed top-1/4 w-5/12 bg-white/40 rounded-md shadow-xl p-4 z-10 left-1/3 bg-opacity-30 backdrop-filter backdrop-blur-lg border border-white border-opacity-30">
          <h2 className="text-lg font-semibold">Add Comment</h2>

          <textarea
            value={comment}
            onChange={handleCommentChange}
            onKeyDown={handleKeyDown}
            className="mt-2 border rounded-md w-full h-20 pl-2 pt-2"
          />

          <button
            type="button"
            className="absolute top-24 right-6 bg-blue-500 px-2 my-1 rounded-md"
            onClick={() => setComment((prev) => `${prev}\n• `)}
          >
            •
          </button>

          {/* ✅ Only show checkbox list for partial reject */}
          {pendingAction === "Partially Rejected" && (
            <>
              <p className="my-2 text-slate-950">Select documents for partial reject</p>
              <hr />
              <div className="my-4 space-y-2">
                {fileFields.map(({ key, label }) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={key}
                      checked={selectedOptions.includes(key)}
                      onChange={handleCheckboxChange}
                      className="form-checkbox h-4 w-4 text-indigo-600 rounded-none"
                    />
                    <span className="text-sm text-slate-950">{label}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          <div className="flex justify-end gap-x-2 mt-4">
            <button
              type="button"
              className="mt-3 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => {
                setIsCommentVisible(false);
                setSelectedOptions([]);
                setPendingAction(null);
              }}
            >
              Cancel
            </button>

            {pendingAction === "Partially Rejected" && (
              <button
                type="button"
                className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white"
                onClick={() => updateStatus("Partially Rejected", comment)}
              >
                Partial Reject
              </button>
            )}

            <button
              type="button"
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white"
              onClick={() => updateStatus("Rejected", comment)}
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* PDF modal */}
      {isPdfModalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-3/4 h-[600px]">
            <div className="flex justify-end">
              <button type="button" className="text-gray-600 hover:text-gray-900" onClick={closePdfModal}>
                Close
              </button>
            </div>
            <iframe src={pdfUrl} className="w-full h-full" frameBorder="0" />
          </div>
        </div>
      )}

      {/* Toast dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="bg-white p-6 rounded-md shadow-lg z-10">
            <p className="text-lg font-semibold">{dialogMessage}</p>
          </div>
        </div>
      )}

      {/* Notifications */}
      {showNotificationActivity && (
        <NotificationActivity
          userId={data?.user?.user_id}
          startupName={data?.user?.company_name}
          onClose={() => setNotificationActivity(false)}
        />
      )}
    </div>
  );
};

export default MatchingLoanModuleDetails;
