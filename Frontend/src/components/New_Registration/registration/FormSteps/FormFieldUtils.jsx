import React from "react";
import { Field, ErrorMessage } from "formik";

// Common qualifications list
export const qualificationOptions = [
  "10th",
  "12th",
  "ITI",
  "Diploma",
  "Graduate",
  "Post Graduate",
  "PhD",
  "B.A.",
  "B.Sc.",
  "B.Com",
  "BBA",
  "BCA",
  "B.Tech/B.E.",
  "LLB",
  "MBBS",
  "M.A.",
  "M.Sc.",
  "MBA/PGDBA",
  "MCA",
  "M.Tech",
  "CA",
  "CS",
];
// Common category list
export const categoryOptions = ["General", "SC", "ST", "OBC", "EWS"];

// Common gender list
export const genderOptions = ["Male", "Female", "Other"];

// Function to get appropriate icon class based on field name or type
export const getIconClass = (name, type) => {
	// Icons for common field types
	if (type === "email") return "mdi mdi-email-outline";
	if (type === "password") return "mdi mdi-lock-outline";
	if (type === "date") return "mdi mdi-calendar-outline";
	if (type === "tel" || name.includes("phone")) return "mdi mdi-phone-outline";

	// Icons for specific field names
	if (name.includes("name") || name.includes("first") || name.includes("last"))
		return "mdi mdi-account-outline";
	if (name.includes("startup")) return "mdi mdi-office-building-outline";
	if (name.includes("aadhar")) return "mdi mdi-card-account-details-outline";
	if (name.includes("gender")) return "mdi mdi-gender-male-female";
	if (name.includes("qualification")) return "mdi mdi-school-outline";
	if (name.includes("category")) return "mdi mdi-format-list-bulleted";
	if (name.includes("address")) return "mdi mdi-map-marker-outline";
	if (name.includes("website")) return "mdi mdi-web";
	if (name.includes("idea") || name.includes("description"))
		return "mdi mdi-lightbulb-outline";
	if (name.includes("file") || name.includes("photo") || name.includes("logo"))
		return "mdi mdi-file-document-outline";
	if (name.includes("business")) return "mdi mdi-briefcase-outline";

	// Default icon
	return "mdi mdi-form-textbox";
};

// Standard form field
export const renderField = ({
	name,
	label,
	type = "text",
	as,
	options,
	required = false,
	...props
}) => (
	<>
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css"
		/>
		<div className="form-group mb-4">
			<label
				htmlFor={name}
				className="block mb-2 text-sm font-semibold text-gray-900"
			>
				{label}
				{required && "*"}
			</label>
			<div className="relative">
				<Field
					id={name}
					name={name}
					as={as}
					type={type}
					className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10"
					{...props}
				>
					{options ? (
						<>
							<option value="">Select {label}</option>
							{options.map((option) => (
								<option key={option} value={option}>
									{option}
								</option>
							))}
						</>
					) : null}
				</Field>
				<i
					className={`${getIconClass(name, type)} text-gray-400 text-lg absolute left-3 top-1/2 transform -translate-y-1/2`}
				/>
			</div>
			<ErrorMessage
				name={name}
				component="div"
				className="mt-1 text-sm text-red-500"
			/>
		</div>
	</>
);

// File input field
export const renderFileInput = ({
	name,
	label,
	accept,
	required = false,
	setFieldValue,
}) => (
	<div className="form-group mb-4">
		<label
			htmlFor={name}
			className="block mb-2 text-sm font-semibold text-gray-900"
		>
			{label}
			{required && "*"}
		</label>
		<div className="relative">
			<input
				type="file"
				id={name}
				name={name}
				onChange={(event) => {
					setFieldValue(name, event.currentTarget.files[0]);
				}}
				className="bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10"
				accept={accept}
			/>
			<i className="mdi mdi-upload-outline text-gray-400 text-lg absolute left-3 top-1/2 transform -translate-y-1/2"></i>
		</div>
		<ErrorMessage
			name={name}
			component="div"
			className="mt-1 text-sm text-red-500"
		/>
	</div>
);
