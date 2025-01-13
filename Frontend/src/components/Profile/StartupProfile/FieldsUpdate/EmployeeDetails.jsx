import React, { useEffect, useState } from "react";
import axios from "axios";
import StatusDialog from "../../../UserForm/StatusDialog";

const EmployeeDetails = ({ onClose, deleteBtn }) => {
  const [employee, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Manage the status dialog (confirmation / success / error)
  const [dialogStatus, setDialogStatus] = useState({
    isVisible: false,
    title: "",
    subtitle: "",
    buttonVisible: false,
    status: "",
    cancelButton: "",
    actionButton: "",
  });

  const userId = localStorage.getItem("user_id");

  // Fetch employee from API
  const fetchStaff = async () => {
    try {
      const response = await axios.get(`https://startupbihar.in/api/userlogin/getEmployees/${userId}`);

      setStaff(response.data.employee || []);
    } catch (error) {
      console.log(`Error fetching employee: ${error}`);
    }
  };

  useEffect(() => {
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Opens the larger popup with more details
  const handleStaffClick = (staffMember) => {
    setSelectedStaff(staffMember);
  };

  // Closes the popup
  const handleClosePopup = () => {
    setSelectedStaff(null);
  };

  // Opens the confirmation dialog for deletion
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

  // Deletes the employee on dialog confirm
  const confirmDeleteStaff = async () => {
    if (!selectedStaff) return;

    try {
      await axios.delete(
        `https://startupbihar.in/api/userlogin/deleteEmployee/${selectedStaff.id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      // Show success
      setDialogStatus({
        isVisible: true,
        title: "Deleting Employee",
        subtitle: "Employee member has been successfully deleted.",
        buttonVisible: true,
        status: "success",
      });

      // Update state & close popup
      const updated = employee.filter((s) => s.id !== selectedStaff.id);
      setStaff(updated);
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

  // Closes the status dialog (after confirm or success)
  const handleCloseDialog = () => {
    setDialogStatus({ ...dialogStatus, isVisible: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay behind the content */}
      <div className="absolute inset-0 bg-black opacity-30" />

      {/* Main container */}
      <div className="relative h-3/4 bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto my-8">
        {/* Close "X" to close the entire EmployeeDetails popup */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-[#3B82F6] hover:text-blue-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Employee List
        </h2>

        {/* Grid of employee "cards" */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {employee.map((staffMember, index) => (
            <div
              key={index}
              className="rounded-md shadow cursor-pointer hover:shadow-lg transition p-4 bg-white flex flex-col items-center text-center"
              onClick={() => handleStaffClick(staffMember)}
            >
              <img
                src={staffMember.dp}
                alt={staffMember.name}
                className="w-16 h-16 object-cover rounded-full border mb-2"
              />
              <h3 className="text-md font-semibold line-clamp-1">
                {staffMember.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">
                {staffMember.designation}
              </p>
            </div>
          ))}
        </div>

        {/* Popup for the selected employee (similar to Showcase design) */}
        {selectedStaff && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay behind the popup */}
            <div className="absolute inset-0 bg-black opacity-40" />
            {/* Popup itself */}
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-96">
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={handleClosePopup}
              >
                &times;
              </button>

              {/* Large (square-ish) photo with rounded corners */}
              <div className="mx-auto mb-4 h-40 w-full overflow-hidden rounded-lg">
                <img
                  src={selectedStaff.dp}
                  alt={selectedStaff.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-semibold mb-1 text-center">
                {selectedStaff.name}
              </h3>
              <p className="text-center text-gray-600 mb-1">
                {selectedStaff.designation}
              </p>
              <p className="text-center text-gray-600 mb-4">
                {selectedStaff.qualification}
              </p>

              {/* Delete Employee button */}
              {deleteBtn && <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 block mx-auto"
                onClick={handleDeleteStaff}
              >
                Delete Employee
              </button>
              }
            </div>
          </div>
        )}
      </div>

      {/* Status Dialog for confirming or showing deletion result */}
      <StatusDialog
        isVisible={dialogStatus.isVisible}
        title={dialogStatus.title}
        subtitle={dialogStatus.subtitle}
        buttonVisible={dialogStatus.buttonVisible}
        status={dialogStatus.status}
        cancelButton={dialogStatus.cancelButton}
        actionButton={dialogStatus.actionButton}
        // "No" or "Ok" closes the dialog
        onClose={handleCloseDialog}
        // "Yes" triggers the actual deletion
        onCancel={() => {
          handleCloseDialog();
          confirmDeleteStaff();
        }}
      />
    </div>
  );
};

export default EmployeeDetails;
