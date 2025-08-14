import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { renderField, renderFileInput } from "./FormFieldUtils";

const BusinessIdeaStep = ({ onSubmit, initialValues, onPrevious }) => {
	const validationSchema = Yup.object().shape({
		problemStatement: Yup.string().required("Problem statement is required"),
		solution: Yup.string().required("Solution is required"),
		targetMarket: Yup.string().required("Target market is required"),
		revenueModel: Yup.string().required("Revenue model is required"),
		fundingRequired: Yup.number().min(0).required("Funding amount is required"),
		fundingReason: Yup.string().required("Funding reason is required"),
	});

	return (
		<Formik
			initialValues={
				initialValues || {
					problemStatement: "",
					solution: "",
					targetMarket: "",
					revenueModel: "",
					fundingRequired: "",
					fundingReason: "",
					expenditurePlan: null,
					bankStatement: null,
					expenditureInvoice: null,
					geoTaggedPhotos: null,
				}
			}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		>
			{(formik) => (
				<Form className="space-y-4">
					<h2 className="text-2xl font-semibold mb-4">Business Idea</h2>

					<div>
						{renderField({
							name: "problemStatement",
							label: "Problem Statement",
							as: "textarea",
							rows: 3,
							placeholder: "What problem are you solving?",
							required: true,
						})}
					</div>

					<div>
						{renderField({
							name: "solution",
							label: "Solution",
							as: "textarea",
							rows: 3,
							placeholder: "How does your startup solve this problem?",
							required: true,
						})}
					</div>

					<div className="grid grid-cols-2 gap-6">
						{renderField({
							name: "targetMarket",
							label: "Business Model",
							as: "textarea",
							rows: 2,
							placeholder: "Who are your customers?",
							required: true,
						})}

						{renderField({
							name: "revenueModel",
							label: "Revenue Model",
							as: "textarea",
							rows: 2,
							placeholder: "How will you generate revenue?",
							required: true,
						})}
					</div>

					<div className="grid grid-cols-2 gap-6">
						{renderField({
							name: "fundingRequired",
							label: "Funding Required (₹)",
							type: "number",
							min: 0,
							required: true,
						})}

						{renderField({
							name: "fundingReason",
							label: "Reason for Funding",
							as: "textarea",
							rows: 2,
							placeholder: "What will you use the funds for?",
							required: true,
						})}
					</div>

					<div className="grid grid-cols-2 gap-6">
						{renderFileInput({
							name: "expenditurePlan",
							label: "Expenditure Plan",
							accept: ".pdf",
							setFieldValue: formik.setFieldValue,
						})}

						{renderFileInput({
							name: "bankStatement",
							label: "Bank Statement",
							accept: ".pdf",
							setFieldValue: formik.setFieldValue,
						})}
					</div>

					<div className="grid grid-cols-2 gap-6">
						{renderFileInput({
							name: "expenditureInvoice",
							label: "Expenditure Invoice (if applicable)",
							accept: ".pdf",
							setFieldValue: formik.setFieldValue,
						})}

						{renderFileInput({
							name: "geoTaggedPhotos",
							label: "Geo-Tagged Photos",
							accept: "image/*,.pdf",
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
							Submit
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default BusinessIdeaStep;
