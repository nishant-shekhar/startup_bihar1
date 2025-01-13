import React, { useEffect, useState } from "react";
import axios from "axios";
import StatusDialog from "../../../UserForm/StatusDialog";

const EmployeeDetails = ({ onClose }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Manages the status dialog (confirmation / success / error)
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

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3007/api/userlogin/getEmployees?startupId=${userId}`
      );
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.log(`error :${error}`);
    }
  };

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Opens the larger popup with more details
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  // Closes the bigger popup
  const handleClosePopup = () => {
    setSelectedEmployee(null);
  };

  // Opens the confirmation dialog for deletion
  const handleDeleteEmployee = () => {
    setDialogStatus({
      title: "Delete Employee",
      subtitle: "Are you sure you want to delete this employee?",
      isVisible: true,
      buttonVisible: true,
      status: "delete",
      cancelButton: "Yes",
      actionButton: "No",
    });
  };

  // Actually deletes the employee on dialog confirm
  const confirmDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      // Example endpoint — adjust as needed
      await axios.delete(
        `http://localhost:3007/api/userlogin/deleteEmployee/${selectedEmployee.id}`,
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
        subtitle: "Employee has been successfully deleted.",
        buttonVisible: true,
        status: "success",
      });

      // Remove from local state & close popup
      const updated = employees.filter((e) => e.id !== selectedEmployee.id);
      setEmployees(updated);
      setSelectedEmployee(null);
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

  // Closes the status dialog (either after confirm or after success)
  const handleCloseDialog = () => {
    setDialogStatus({ ...dialogStatus, isVisible: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay behind the content */}
      <div className="absolute inset-0 bg-black opacity-30" />

      {/* Main container */}
      <div className="relative bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto my-8">
        {/* Close "X" to close the entire EmployeeDetails popup */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-[#3B82F6] hover:text-blue-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Employee Details
        </h2>

        {/* Grid of employee "cards" */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {employees.map((employee, index) => (
            <div
              key={index}
              className="rounded-md shadow cursor-pointer hover:shadow-lg transition p-4 bg-white flex flex-col items-center text-center"
              onClick={() => handleEmployeeClick(employee)}
            >
              <img
                src={employee.dp}
                alt={employee.name}
                className="w-16 h-16 object-cover rounded-full border mb-2"
              />
              <h3 className="text-md font-semibold line-clamp-1">
                {employee.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">
                {employee.designation}
              </p>
            </div>
          ))}
        </div>

        {/* Popup for the selected employee (similar to Showcase design) */}
        {selectedEmployee && (
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
                  src={selectedEmployee.dp}
                  alt={selectedEmployee.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-xl font-semibold mb-1 text-center">
                {selectedEmployee.name}
              </h3>
              <p className="text-center text-gray-600 mb-1">
                {selectedEmployee.designation}
              </p>
              <p className="text-center text-gray-600 mb-4">
                {selectedEmployee.qualification}
              </p>

              {/* Delete Employee button */}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 block mx-auto"
                onClick={handleDeleteEmployee}
              >
                Delete Employee
              </button>
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
          confirmDeleteEmployee();
        }}
      />
    </div>
  );
};

export default EmployeeDetails;
