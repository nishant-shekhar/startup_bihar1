import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { renderField, renderFileInput } from "./FormFieldUtils";

const EntityDetailsStep = ({ onSubmit, initialValues, onPrevious }) => {
	const entityTypeOptions = [
		"Pvt Ltd",
		"LLP",
		"Partnership",
		"Proprietorship",
		"OPC",
		"Other",
	];

	const sectorOptions = [
		"Agriculture",
		"AI & ML",
		"AR/VR",
		"Blockchain",
		"Clean Energy",
		"E-commerce",
		"EdTech",
		"FinTech",
		"Healthcare",
		"IoT",
		"Manufacturing",
		"Mobility",
		"Other",
	];

	const stageOptions = [
		"Ideation",
		"Validation",
		"Early Traction",
		"Scaling",
	];

	const validationSchema = Yup.object().shape({
		entityName: Yup.string().required("Entity name is required"),
		entityType: Yup.string().required("Entity type is required"),
		entityRegistrationNumber: Yup.string().required(
			"Registration number is required",
		),
		dateOfRegistration: Yup.date().required("Date of registration is required"),
		sector: Yup.string().required("Sector is required"),
		stage: Yup.string().required("Stage is required"),
		certificate: Yup.mixed().required("Registration certificate is required"),
	});

	return (
		<Formik
			initialValues={
				initialValues || {
					entityName: "",
					entityType: "",
					entityRegistrationNumber: "",
					dateOfRegistration: "",
					sector: "",
					stage: "",
					logo: null,
					certificate: null,
				}
			}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		>
			{(formik) => (
				<Form className="space-y-4">
					<h2 className="text-2xl font-semibold mb-4">Entity Details</h2>

					<div className="grid grid-cols-2 gap-6">
						{renderField({
							name: "entityName",
							label: "Entity Name",
							required: true,
						})}

						{renderField({
							name: "entityType",
							label: "Entity Type",
							as: "select",
							options: entityTypeOptions,
							required: true,
						})}
					</div>

					<div className="grid grid-cols-2 gap-6">
						{renderField({
							name: "entityRegistrationNumber",
							label: "Registration Number",
							required: true,
						})}

						{renderField({
							name: "dateOfRegistration",
							label: "Date of Registration",
							type: "date",
							required: true,
						})}
					</div>

					<div className="grid grid-cols-2 gap-6">
						{renderField({
							name: "sector",
							label: "Sector",
							as: "select",
							options: sectorOptions,
							required: true,
						})}

						{renderField({
							name: "stage",
							label: "Stage",
							as: "select",
							options: stageOptions,
							required: true,
						})}
					</div>

					<div className="grid grid-cols-2 gap-6">
						{renderFileInput({
							name: "logo",
							label: "Company Logo",
							accept: "image/*",
							setFieldValue: formik.setFieldValue,
						})}

						{renderFileInput({
							name: "certificate",
							label: "Registration Certificate",
							accept: ".pdf",
							required: true,
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

export default EntityDetailsStep;
