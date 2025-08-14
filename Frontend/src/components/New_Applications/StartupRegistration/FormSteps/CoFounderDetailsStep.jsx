import React from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { renderField, qualificationOptions } from "./FormFieldUtils";

const CoFounderDetailsStep = ({ onSubmit, initialValues, onPrevious }) => {
	const validationSchema = Yup.object().shape({
		coFounders: Yup.array().of(
			Yup.object().shape({
				name: Yup.string().required("Name is required"),
				email: Yup.string()
					.email("Invalid email")
					.required("Email is required"),
				phoneNumber: Yup.string().required("Phone number is required"),
				qualification: Yup.string().required("Qualification is required"),
				linkedinProfile: Yup.string().url("Must be a valid URL"),
			}),
		),
	});

	return (
		<Formik
			initialValues={
				initialValues || {
					coFounders: [
						{
							name: "",
							email: "",
							phoneNumber: "",
							qualification: "",
							linkedinProfile: "",
						},
					],
				}
			}
			validationSchema={validationSchema}
			onSubmit={onSubmit}
		>
			{(formik) => (
				<Form className="space-y-6">
					<h2 className="text-2xl font-semibold mb-4">Co-Founder Details</h2>

					<FieldArray name="coFounders">
						{({ push, remove }) => (
							<div className="space-y-8">
								{formik.values.coFounders.map((cofounder, index) => (
									<div key={index} className="border p-4 rounded-lg space-y-4">
										<div className="flex justify-between items-center">
											<h3 className="text-xl font-medium">
												Co-Founder {index + 1}
											</h3>
											{index > 0 && (
												<button
													type="button"
													onClick={() => remove(index)}
													className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
												>
													Remove
												</button>
											)}
										</div>

										<div className="grid grid-cols-2 gap-6">
											{renderField({
												name: `coFounders.${index}.name`,
												label: "Full Name",
												required: true,
											})}

											{renderField({
												name: `coFounders.${index}.email`,
												label: "Email",
												type: "email",
												required: true,
											})}
										</div>

										<div className="grid grid-cols-2 gap-6">
											{renderField({
												name: `coFounders.${index}.phoneNumber`,
												label: "Phone Number",
												required: true,
											})}

											{renderField({
												name: `coFounders.${index}.qualification`,
												label: "Qualification",
												as: "select",
												options: qualificationOptions,
												required: true,
											})}
										</div>

										<div>
											{renderField({
												name: `coFounders.${index}.linkedinProfile`,
												label: "LinkedIn Profile",
												type: "url",
												placeholder: "https://linkedin.com/in/yourprofile",
											})}
										</div>
									</div>
								))}

								<div className="flex justify-center mt-4">
									<button
										type="button"
										onClick={() =>
											push({
												name: "",
												email: "",
												phoneNumber: "",
												qualification: "",
												linkedinProfile: "",
											})
										}
										className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
									>
										Add Another Co-Founder
									</button>
								</div>
							</div>
						)}
					</FieldArray>

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

export default CoFounderDetailsStep;
