import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import StatusDialog from "../../../UserForm/StatusDialog";

const UpdateMetrics = ({ startup, onClose }) => {
    const [dialogStatus, setDialogStatus] = useState({
        isVisible: false,
        title: "",
        subtitle: "",
        buttonVisible: false,
        status: "",
    });

    const handleUpdate = async (field, value) => {
        try {
            setDialogStatus({
                isVisible: true,
                title: "Updating Metrics",
                subtitle: "Wait while we update your metrics!",
                buttonVisible: false,
                status: "checking",
            });

            await axios.put(
                "http://localhost:3007/api/userlogin/update-data",
                { [field]: value },
                {
                    headers: {
                        Authorization: `${localStorage.getItem("token")}`,
                    },
                }
            );
            setDialogStatus({
                isVisible: true,
                title: "Metrics Updated",
                subtitle: `Your Data Metrics updated successfully`,
                buttonVisible: true,
                status: "success",
            });



        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            setDialogStatus({
                isVisible: true,
                title: "Metrics Update Failed",
                subtitle: "Error updating metrics",
                buttonVisible: true,
                status: "failed",
            });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 rounded-lg shadow-xl w-96 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-[#3B82F6] hover:text-blue-600"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-semibold mb-4 text-center">Update Business Details</h2>
                <Formik
                    initialValues={{
                        employeeCount: startup.employeeCount || "",
                        workOrders: startup.workOrders || "",
                        projects: startup.projects || "",
                        revenueLY: startup.revenueLY || "",
                    }}
                    onSubmit={async (values, { resetForm }) => {
                        for (const [field, value] of Object.entries(values)) {
                            if (value) {
                                await handleUpdate(field, value);
                            }
                        }
                        resetForm();
                    }}
                >
                    {() => (
                        <Form>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Employee Count</label>
                                <Field
                                    type="number"
                                    name="employeeCount"
                                    placeholder="Enter Employee Count"
                                    className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Work Orders</label>
                                <Field
                                    type="number"
                                    name="workOrders"
                                    placeholder="Enter Work Orders"
                                    className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Projects</label>
                                <Field
                                    type="number"
                                    name="projects"
                                    placeholder="Enter Projects"
                                    className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Revenue Last Year</label>
                                <Field
                                    type="number"
                                    name="revenueLY"
                                    placeholder="Enter Revenue Last Year"
                                    className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-[#3B82F6] text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                                >
                                    Update Details
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <div className="z-60">
                <StatusDialog
                    isVisible={dialogStatus.isVisible}
                    title={dialogStatus.title}
                    subtitle={dialogStatus.subtitle}
                    buttonVisible={dialogStatus.buttonVisible}
                    onClose={() => {
                        setDialogStatus({ ...dialogStatus, isVisible: false }); // Close the dialog
                        if (dialogStatus.status === "success") {
                            onClose(); // Trigger onClose only when the status is "success"
                        }
                    }}
                    status={dialogStatus.status}
                />
            </div>
        </div>
    );
};

export default UpdateMetrics;
