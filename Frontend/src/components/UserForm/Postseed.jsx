import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import Upload from './Upload';
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
					"http://localhost:3007/api/post-seed",
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
		<div className="isolate  h-screen overflow-y-auto ">
			<div
				className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
				aria-hidden="true"
			/>
			
			<div className="relative w-full h-[250px]">

<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="1440" height="250" preserveAspectRatio="none" viewBox="0 0 1440 250">
  <g mask="url(#SvgjsMask1000)" fill="none">
  <rect width="1440" height="250" x="0" y="0" fill="#0e2a47"></rect>
  <path d="M38 250L288 0L538.5 0L288.5 250z" fill="url(#SvgjsLinearGradient1001)"></path>
  <path d="M244.60000000000002 250L494.6 0L647.6 0L397.6 250z" fill="url(#SvgjsLinearGradient1001)"></path>
  <path d="M490.20000000000005 250L740.2 0L911.2 0L661.2 250z" fill="url(#SvgjsLinearGradient1001)"></path>
  <path d="M728.8000000000001 250L978.8000000000001 0L1289.3000000000002 0L1039.3000000000002 250z" fill="url(#SvgjsLinearGradient1001)"></path>
  <path d="M1406 250L1156 0L982 0L1232 250z" fill="url(#SvgjsLinearGradient1002)"></path>
  <path d="M1199.4 250L949.4000000000001 0L749.9000000000001 0L999.9000000000001 250z" fill="url(#SvgjsLinearGradient1002)"></path>
  <path d="M940.8 250L690.8 0L375.79999999999995 0L625.8 250z" fill="url(#SvgjsLinearGradient1002)"></path>
  <path d="M704.1999999999999 250L454.19999999999993 0L146.69999999999993 0L396.69999999999993 250z" fill="url(#SvgjsLinearGradient1002)"></path>
  <path d="M1205.2767553797382 250L1440 15.276755379738262L1440 250z" fill="url(#SvgjsLinearGradient1001)"></path>
  <path d="M0 250L234.72324462026174 250L 0 15.276755379738262z" fill="url(#SvgjsLinearGradient1002)"></path>
  </g>
  <defs>
  <mask id="SvgjsMask1000">
	<rect width="1440" height="250" fill="#ffffff"></rect>
  </mask>
	<linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="SvgjsLinearGradient1001">
	<stop stop-color="rgba(15, 70, 185, 0.2)" offset="0"></stop>
	<stop stop-opacity="0" stop-color="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
  </linearGradient>
 <linearGradient x1="100%" y1="100%" x2="0%" y2="0%" id="SvgjsLinearGradient1002">
  <stop stop-color="rgba(15, 70, 185, 0.2)" offset="0"></stop>
  <stop stop-opacity="0" stop-color="rgba(15, 70, 185, 0.2)" offset="0.66"></stop>
</linearGradient>
</defs>
</svg>


<div className="absolute top-9 left-0 w-full p-6 text-white">
<h1 className="text-3xl font-bold mb-2 px-5 relative top-10">Post Seed Form</h1>
<p className="text-lg max-w-xl px-5 relative top-10">
Share your innovative ideas and secure funding to turn them into reality.
</p>
</div>
</div>

           
			{/* Form Start */}
			<form
				onSubmit={formik.handleSubmit}
				className="px-10 py-10"
			>

			<div className="bg-white p-6 border rounded-md ">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Current Stage of Startup */}
				

				{/* Technical Knowledge */}
				<div className="mb-6">
					<label
						htmlFor="currentStage"
						className="block  text-sm/6 font-medium text-black  mb-2 break-words w-full max-w-[65%]"
					>
						Current stage of your 
						
						   Startup
					</label>
					<br />
					<select
						id="currentStage"
						name="currentStage"
						className="border  text-base text-gray-500 sm:text-sm/6   rounded w-3/4 py-2 px-3"
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
				{/* Employment */}
				<div className="mb-6">
					<label
						htmlFor="employment"
						className="block  text-sm/6 font-medium text-black  mb-2 break-words w-full max-w-[65%]"
					>
						Has the startup given employment to 5-10 employees working
						continuously for at least 6 months?
					</label>
					<select
						id="employment"
						name="employment"
						className="border rounded  text-base text-gray-500 sm:text-sm/6  w-3/4 py-2 px-3"
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
				<div className="mb-6">
					<label
						htmlFor="technicalKnowledge"

						className="block  text-sm/6 font-medium text-black  mb-2 break-words w-full max-w-[65%]"
					>
						Do the founders/Key employees possess technical knowledge/necessary
						skills to operate and scale the business?
					</label>
					<select
						id="technicalKnowledge"
						name="technicalKnowledge"
						className="border rounded   text-base text-gray-500 sm:text-sm/6  w-3/4 py-2 px-3"
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
						className="block text-sm/6 font-medium text-black mb-2 break-words w-full max-w-[65%]"
					>
						Has the startup raised any fund/investment from recognized SEBI CAT
						1 AIF, angel investors, or venture capitalists?
					</label>
					<select
						id="raisedFunds"
						name="raisedFunds"
						className="border text-base text-gray-500 sm:text-sm/6 rounded w-3/4 py-2 px-3"
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
				
				</div>
				<div className="border-b-2 botext-[#4b4b4b]/10 mb-8 pb-12"></div>
				{/* File Upload: Audited Balance Sheet */}
			 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="mb-6">
					<label
						htmlFor="auditedBalanceSheet"
						className="block text-sm/6 font-medium text-black"
					>
						Upload Audited Balance Sheet:
					</label>
					<Upload
						id="auditedBalanceSheet"
						name="auditedBalanceSheet"
						
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
				<label htmlFor="gstReturn" className="block text-sm/6 font-medium text-black  ">
                Upload GST Return: </label>
					
					<Upload
						id="gstReturn"
						name="gstReturn"
						
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
						className="block text-sm/6 font-medium text-black  "
					>
						Upload Project Report:
					</label>
					<Upload
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
				</div>
				{/* Submit Button */}
				<div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                        <button 
                            type="submit" 
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                           Submit
                        </button>
                    </div>


				</div>

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
