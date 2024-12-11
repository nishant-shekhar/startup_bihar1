import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import StatusDialog from "./StatusDialog"; // Import the new dialog component
import { faL } from "@fortawesome/free-solid-svg-icons";


export const App = () => {
	return (
		<div>
			<PostSeed />
		</div>
	);
};

const PostSeed = () => {
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [statusPopup, setStatusPopup] = useState(false);
	const [title, setTitle] = useState("");
	const [buttonVisible, setButtonVisible] = useState(true);
	const [subtitle, setSubtitle] = useState("");
	const [isSuccess, setIsSuccess] = useState(""); // Add success state


	const validationSchema = Yup.object({
		currentStage: Yup.string().required("Current Stage is required"),
		technicalKnowledge: Yup.string().required(
			"Technical Knowledge is required",
		),
		raisedFunds: Yup.string().required("Raised Funds is required"),
		employment: Yup.string().required("Employment is required"),
		auditedBalanceSheet: Yup.mixed().required(
			"Audited Balance Sheet is required",
		),
		gstReturn: Yup.mixed().required("GST Return is required"),
		projectReport: Yup.mixed().required("Project Report is required"),
	});
	// Formik setup for handling form submission
	const formik = useFormik({
		initialValues: {
			currentStage: "",
			technicalKnowledge: "",
			raisedFunds: "",
			employment: "",
			auditedBalanceSheet: null,
			gstReturn: null,
			projectReport: null,
		},
		validationSchema,
		validateOnChange: false, // Disable validation on change
		validateOnBlur: false,   // Disable validation on blur
		onSubmit: async (values) => {
			setTitle("Submitting Post Seed Fund Form");
			setSubtitle("Please wait while we submit your form");
			setButtonVisible(false);
			setStatusPopup(true);

			const formData = new FormData();

			for (const key in values) {
				formData.append(
					key,
					values[key] instanceof File ? values[key] : values[key],
				);
			}

			try {
				const response = await axios.post(
					"https://startup-bihar1.onrender.com/api/post-seed",
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
							Authorization: `${localStorage.getItem("token")}`,
						},
					},
				);
				formik.resetForm();



				setTitle("Submission Successful");
				setSubtitle(response.data.message);
				setButtonVisible(true);
				setSuccessMessage(response.data.message);
				setErrorMessage("");
				setIsSuccess("success"); // Set success state

				// Reset form fields after submission
			} catch (error) {
				setTitle("Submission Failed");
				setSubtitle(
					error.response?.data?.error || "An error occurred during submission"
				);
				setButtonVisible(true);
				setErrorMessage(
					error.response?.data?.error || "An error occurred during submission"
				);
				setSuccessMessage("");
				setIsSuccess("failed"); // Set success state

			}
		},
	});

	return (
		<div className="isolate bg-white px-6 py-24 sm:py-3 lg:px-8 h-screen overflow-y-auto flex flex-col items-center">
			<div
				className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
				aria-hidden="true"
			/>

			{/* Form Start */}
			<form
				onSubmit={formik.handleSubmit}
				className="w-full max-w-lg p-8 rounded-lg"
			>
				<h3 className="font-semibold text-xl mb-6">Post Seed Fund</h3>

				{/* Current Stage of Startup */}
				<div className="mb-6">
					<label
						htmlFor="currentStage"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Current stage of your startup
					</label>
					<select
						id="currentStage"
						name="currentStage"
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
						onChange={formik.handleChange}
						value={formik.values.currentStage}
					>
						<option value="">Select Stage</option>
						<option value="Ideation">Ideation</option>
						<option value="Prototype">Prototype</option>
						<option value="Validation">Validation</option>
						<option value="MVP">MVP</option>
						<option value="Scaling">Scaling</option>
					</select>
					{formik.errors.currentStage && (
						<div className="text-red-600">{formik.errors.currentStage}</div>
					)}
				</div>

				{/* Technical Knowledge */}
				<div className="mb-6">
					<label
						htmlFor="technicalKnowledge"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Do the founders/Key employees possess technical knowledge/necessary
						skills to operate and scale the business?
					</label>
					<select
						id="technicalKnowledge"
						name="technicalKnowledge"
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
						onChange={formik.handleChange}
						value={formik.values.technicalKnowledge}
					>
						<option value="">Select an option</option>
						<option value="Yes">Yes</option>
						<option value="No">No</option>
					</select>
					{formik.errors.technicalKnowledge && (
						<div className="text-red-600">
							{formik.errors.technicalKnowledge}
						</div>
					)}
				</div>

				{/* Raised Funds */}
				<div className="mb-6">
					<label
						htmlFor="raisedFunds"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Has the startup raised any fund/investment from recognized SEBI CAT
						1 AIF, angel investors, or venture capitalists?
					</label>
					<select
						id="raisedFunds"
						name="raisedFunds"
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
						onChange={formik.handleChange}
						value={formik.values.raisedFunds}
					>
						<option value="">Select an option</option>
						<option value="Yes">Yes</option>
						<option value="No">No</option>
					</select>
					{formik.errors.raisedFunds && (
						<div className="text-red-600">{formik.errors.raisedFunds}</div>
					)}
				</div>

				{/* Employment */}
				<div className="mb-6">
					<label
						htmlFor="employment"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Has the startup given employment to 5-10 employees working
						continuously for at least 6 months?
					</label>
					<select
						id="employment"
						name="employment"
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
						onChange={formik.handleChange}
						value={formik.values.employment}
					>
						<option value="">Select an option</option>
						<option value="Yes">Yes</option>
						<option value="No">No</option>
					</select>
					{formik.errors.employment && (
						<div className="text-red-600">{formik.errors.employment}</div>
					)}
				</div>

				{/* File Upload: Audited Balance Sheet */}
				<div className="mb-6">
					<label
						htmlFor="auditedBalanceSheet"
						className="block text-sm font-medium text-gray-700"
					>
						Upload Audited Balance Sheet:
					</label>
					<input
						id="auditedBalanceSheet"
						name="auditedBalanceSheet"
						type="file"
						onChange={(event) =>
							formik.setFieldValue(
								"auditedBalanceSheet",
								event.currentTarget.files[0],
							)
						}
					/>
					{formik.errors.auditedBalanceSheet && (
						<div className="text-red-600">
							{formik.errors.auditedBalanceSheet}
						</div>
					)}
				</div>

				{/* File Upload: GST Return */}
				<div className="mb-6">
					<label
						htmlFor="gstReturn"
						className="block text-sm font-medium text-gray-700"
					>
						Upload GST Return:
					</label>
					<input
						id="gstReturn"
						name="gstReturn"
						type="file"
						onChange={(event) =>
							formik.setFieldValue("gstReturn", event.currentTarget.files[0])
						}
					/>
					{formik.errors.gstReturn && (
						<div className="text-red-600">{formik.errors.gstReturn}</div>
					)}
				</div>

				{/* File Upload: Project Report */}
				<div className="mb-6">
					<label
						htmlFor="projectReport"
						className="block text-sm font-medium text-gray-700"
					>
						Upload Project Report:
					</label>
					<input
						id="projectReport"
						name="projectReport"
						type="file"
						onChange={(event) =>
							formik.setFieldValue(
								"projectReport",
								event.currentTarget.files[0],
							)
						}
					/>
					{formik.errors.projectReport && (
						<div className="text-red-600">{formik.errors.projectReport}</div>
					)}
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className="mt-6 w-full py-2 px-4 text-white bg-indigo-600 rounded-md"
				>
					Submit
				</button>



				{/* Success and Error Messages */}
				{successMessage && (
					<div className="text-green-500 mt-4">{successMessage}</div>
				)}
				{errorMessage && (
					<div className="text-red-500 mt-4">{errorMessage}</div>
				)}
			</form>
			<StatusDialog
				isVisible={statusPopup}
				title={title}
				subtitle={subtitle}
				buttonVisible={buttonVisible}
				status={isSuccess} // Pass success state

				onClose={() => setStatusPopup(false)}
			/>
		</div>
	);
};

export default PostSeed;
