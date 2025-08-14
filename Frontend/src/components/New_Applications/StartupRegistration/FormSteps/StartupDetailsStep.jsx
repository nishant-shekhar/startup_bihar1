import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { renderField, renderFileInput } from "./FormFieldUtils";

const StartupDetailsStep = ({ onSubmit, initialValues, onPrevious }) => {
	const stateOptions = [
		"Andhra Pradesh",
		"Bihar",
		"Delhi",
		"Gujarat",
		"Karnataka",
		"Maharashtra",
		"Tamil Nadu",
		"Telangana",
		"Uttar Pradesh",
		"West Bengal",
		"Other",
	];

	const validationSchema = Yup.object().shape({
		teamSize: Yup.number()
			.min(1, "Team size must be at least 1")
			.required("Team size is required"),
		registeredAddress: Yup.string().required("Registered address is required"),
		city: Yup.string().required("City is required"),
		state: Yup.string().required("State is required"),
		pincode: Yup.string().required("Pincode is required"),
	});

	return (
		<Formik
			initialValues={
				initialValues || {
					teamSize: "",
					website: "",
					registeredAddress: "",
					city: "",
					state: "",
					pincode: "",
					auditedBalanceSheet: null,
					gstReturn: null,
				}
			}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		>
			{(formik) => (
				<Form className="space-y-4">
					<h2 className="text-2xl font-semibold mb-4">Startup Details</h2>

					<div className="grid grid-cols-2 gap-6">
						{renderField({
							name: "teamSize",
							label: "Team Size",
							type: "number",
							min: 1,
							required: true,
						})}

						{renderField({
							name: "website",
							label: "Website",
							type: "url",
							placeholder: "https://example.com",
						})}
					</div>

					<div className="col-span-2">
						{renderField({
							name: "registeredAddress",
							label: "Registered Address",
							as: "textarea",
							rows: 3,
							required: true,
						})}
					</div>

					<div className="grid grid-cols-3 gap-6">
						{renderField({
							name: "city",
							label: "City",
							required: true,
						})}

						{renderField({
							name: "state",
							label: "State",
							as: "select",
							options: stateOptions,
							required: true,
						})}

						{renderField({
							name: "pincode",
							label: "Pincode",
							required: true,
						})}
					</div>

					<div className="grid grid-cols-2 gap-6">
						{renderFileInput({
							name: "auditedBalanceSheet",
							label: "Audited Balance Sheet",
							accept: ".pdf",
							setFieldValue: formik.setFieldValue,
						})}

						{renderFileInput({
							name: "gstReturn",
							label: "GST Return (if applicable)",
							accept: ".pdf",
							setFieldValue: formik.setFieldValue,
						})}
					</div>

					<div className="flex justify-between mt-6">
						<button
							type="button"
							onClick={() => onPrevious(formik.values)}
							className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
						>
							Previous
						</button>
						<button
							type="submit"
							className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
						>
							Save & Continue
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default StartupDetailsStep;
