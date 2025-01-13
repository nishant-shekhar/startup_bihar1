import React, { useState, useRef } from "react";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import StatusDialog from "../../../UserForm/StatusDialog";

const UpdateEmployees = ({ startup, onClose, onUpdate }) => {
	const [dialogStatus, setDialogStatus] = useState({
		isVisible: false,
		title: "",
		subtitle: "",
		buttonVisible: false,
		status: "",
	});

	const fileInputRef = useRef(null);

	const handleFileChange = (event, setFieldValue) => {
		const file = event.target.files[0];
		if (file) {
			setFieldValue("dp", file);
		}
	};

	const handleUpdate = async (values) => {
		try {
			setDialogStatus({
				isVisible: true,
				title: "Adding Employee",
				subtitle: "Wait while we add the new employee!",
				buttonVisible: false,
				status: "checking",
			});

			const formData = new FormData();
			Object.entries(values).forEach(([key, value]) => {
				formData.append(key, value);
			});

			console.log("FormData being sent:", Array.from(formData.entries())); // Debug log

			await axios.post(
				`https://startupbihar.in/api/userlogin/addEmployees`,
				formData,
				{
					headers: {
						Authorization: `${localStorage.getItem("token")}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			setDialogStatus({
				isVisible: true,
				title: "Employee Added",
				subtitle: "Employee added successfully",
				buttonVisible: true,
				status: "success",
			});
		} catch (error) {
			console.error("Error adding employee:", error);
			setDialogStatus({
				isVisible: true,
				title: "Employee Addition Failed",
				subtitle: error.response?.data?.error || "Error adding employee",
				buttonVisible: true,
				status: "failed",
			});
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="bg-white bg-opacity-75 backdrop-filter backdrop-blur-lg border border-white border-opacity-30 rounded-lg shadow-xl w-96 p-6 relative">
				<button
					type="button"
					onClick={onClose}
					className="absolute top-2 right-2 text-[#3B82F6] hover:text-blue-600"
				>
					✕
				</button>
				<h2 className="text-2xl font-semibold mb-4 text-center">
					Add Employees
				</h2>

				<Formik
					initialValues={{
						name: "",
						designation: "",
						qualification: "",
						display: "",
						rank: 0,
						dp: null,
					}}
					validate={(values) => {
						const errors = {};

						if (!values.name) {
							errors.name = "Name is required";
						}
						if (!values.designation) {
							errors.designation = "Designation is required";
						}
						if (!values.qualification) {
							errors.qualification = "Qualification is required";
						}
						// Photo required
						if (!values.dp) {
							errors.dp = "Photo is required";
						}
						return errors;
					}}
					onSubmit={async (values, { resetForm }) => {
						values.rank = parseInt(values.rank, 10);
						await handleUpdate(values);
						resetForm();
						onUpdate();
					}}
				>
					{({ setFieldValue, errors, touched }) => (
						<Form>
							<div className="mb-4">
								<label className="block text-gray-700 mb-2">
									Employee Name
								</label>
								<Field
									type="text"
									name="name"
									placeholder="Enter Employee Name"
									className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div className="mb-4">
								<label className="block text-gray-700 mb-2">designation</label>
								<Field
									type="text"
									name="designation"
									placeholder="Enter designation"
									className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div className="mb-4">
								<label className="block text-gray-700 mb-2">
									qualification
								</label>
								<Field
									type="text"
									name="qualification"
									placeholder="Enter qualification"
									className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>

							<div className="mb-4 flex items-center gap-2 ">
								<label className="block text-gray-700 ">Show on Screen</label>
								<Field
									type="checkbox"
									name="display"
									className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
									onChange={(e) => setFieldValue('display', e.target.checked)}
								/>
							</div>

							<div className="mb-4">
								<label className="block text-gray-700 mb-2">Rank</label>
								<Field
									type="number"
									as="select"
									name="rank"
									className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
									onChange={(e) => setFieldValue('rank', parseInt(e.target.value, 10))}
								>
									<option value="">Select Rank</option>
									<option value={0}>Founding Team</option>
									<option value={1}>Top-Level Employees</option>
									<option value={2}>Middle-Level Employees</option>
									<option value={3}>Entry-Level Employees</option>
								</Field>
							</div>

							<div className="mb-4">
								<label className="block text-gray-700 mb-2">Photo</label>
								<input
									type="file"
									ref={fileInputRef}
									onChange={(event) => handleFileChange(event, setFieldValue)}
									className="w-full p-2 bg-transparent border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.dp && touched.dp && (
									<p className="text-red-600 text-sm mt-1">{errors.dp}</p>
								)}
							</div>
							<div className="text-center">
								<button
									type="submit"
									className="bg-[#3B82F6] text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
								>
									Add Employee
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
						setDialogStatus({ ...dialogStatus, isVisible: false });
						onClose();
					}}
					status={dialogStatus.status}
				/>
			</div>
		</div>
	);
};

export default UpdateEmployees;
