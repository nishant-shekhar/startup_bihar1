import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import OTPModal from "./OTPModal";
import PhoneVerificationModal from "./PhoneVerificationModal";

const LoginSchema = Yup.object().shape({
	founderName: Yup.string().required("Founder name is required"),
	startupName: Yup.string().required("Startup name is required"),
	email: Yup.string()
		.email("Invalid email address")
		.required("Email is required"),
	phoneNumber: Yup.string()
		.matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
		.required("Phone number is required"),
	aadharNumber: Yup.string()
		.matches(/^[0-9]{12}$/, "Aadhar number must be exactly 12 digits")
		.required("Aadhar number is required"),
	password: Yup.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
});

const UserSignup = () => {
	const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
	const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const [userPhone, setUserPhone] = useState("");
	const [formValues, setFormValues] = useState(null);

	const handleSubmit = (values, { setSubmitting }) => {
		setFormValues(values);
		setUserEmail(values.email);
		setIsEmailModalOpen(true);
		setSubmitting(false);
		// TODO: Send email OTP
	};

	const handleEmailVerify = (otp) => {
		console.log("Verifying Email OTP:", otp);
		// TODO: Verify email OTP
		setIsEmailModalOpen(false);

		// After email verification, open phone verification
		if (formValues) {
			setUserPhone(formValues.phoneNumber);
			setIsPhoneModalOpen(true);
		}
	};

	const handlePhoneVerify = (otp) => {
		console.log("Verifying Phone OTP:", otp);
		// TODO: Verify phone OTP and complete registration
		setIsPhoneModalOpen(false);

		if (formValues) {
			// TODO: Submit registration with verified email and phone
			console.log("Registration complete", formValues);
		}
	};

	return (
		 <div
      className="min-h-screen w-full px-10 py-10 bg-cover bg-center"
      style={{ backgroundImage: `url('/bg1.jpg')` }}
    >
		<>
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css"
			/>
			<section className="bg-gradient-to-br from-pink-50 via-white to-purple-100">
				<div className="flex flex-col items-center justify-center px-6 pb-10 mx-auto md:min-h-screen">
					<img className="w-56 h-auto" src="favicon_full.png" alt="" />
					<div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-2xl xl:p-0 ">
						<div className="p-6 space-y-4 md:space-y-6 sm:p-8 sm:pt-6">
							<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl">
								Register your startup
							</h1>

							<hr />
							<Formik
								initialValues={{
									founderName: "",
									startupName: "",
									email: "",
									phoneNumber: "",
									aadharNumber: "",
									password: "",
									remember: false,
								}}
								validationSchema={LoginSchema}
								onSubmit={handleSubmit}
							>
								{({ isSubmitting, errors, touched }) => (
									<Form className="space-y-4 md:space-y-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{/* Column 1 - Founder Name */}
											<div>
												<label
													htmlFor="founderName"
													className="block mb-2 text-sm font-semibold text-gray-900"
												>
													Name of Founder
												</label>
												<div className="relative">
													<Field
														type="text"
														name="founderName"
														id="founderName"
														className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${
															errors.founderName && touched.founderName
																? "border-red-500"
																: ""
														}`}
														placeholder="John Doe"
													/>
													<i className="mdi mdi-account-outline text-gray-400 text-lg absolute left-3 top-1/2 transform -translate-y-1/2"></i>
												</div>
												<ErrorMessage
													name="founderName"
													component="p"
													className="mt-1 text-sm text-red-500"
												/>
											</div>

											{/* Column 2 - Startup Name */}
											<div>
												<label
													htmlFor="startupName"
													className="block mb-2 text-sm font-semibold text-gray-900"
												>
													Name of Startup
												</label>
												<div className="relative">
													<Field
														type="text"
														name="startupName"
														id="startupName"
														className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${
															errors.startupName && touched.startupName
																? "border-red-500"
																: ""
														}`}
														placeholder="My Startup Inc."
													/>
													<i className="mdi mdi-city text-gray-400 text-lg absolute left-3 top-1/2 transform -translate-y-1/2"></i>
												</div>
												<ErrorMessage
													name="startupName"
													component="p"
													className="mt-1 text-sm text-red-500"
												/>
											</div>

											{/* Column 1 - Email */}
											<div>
												<label
													htmlFor="email"
													className="block mb-2 text-sm font-semibold text-gray-900"
												>
													Email ID
												</label>
												<div className="relative">
													<Field
														type="email"
														name="email"
														id="email"
														className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${
															errors.email && touched.email
																? "border-red-500"
																: ""
														}`}
														placeholder="name@company.com"
													/>
													<i className="mdi mdi-email-outline text-gray-400 text-lg absolute left-3 top-1/2 transform -translate-y-1/2"></i>
												</div>
												<ErrorMessage
													name="email"
													component="p"
													className="mt-1 text-sm text-red-500"
												/>
											</div>

											{/* Column 2 - Phone Number */}
											<div>
												<label
													htmlFor="phoneNumber"
													className="block mb-2 text-sm font-semibold text-gray-900"
												>
													Phone Number
												</label>
												<div className="relative">
													<Field
														type="tel"
														name="phoneNumber"
														id="phoneNumber"
														className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${
															errors.phoneNumber && touched.phoneNumber
																? "border-red-500"
																: ""
														}`}
														placeholder="9876543210"
													/>
													<i className="mdi mdi-phone-outline text-gray-400 text-lg absolute left-3 top-1/2 transform -translate-y-1/2"></i>
												</div>
												<ErrorMessage
													name="phoneNumber"
													component="p"
													className="mt-1 text-sm text-red-500"
												/>
											</div>

											{/* Column 1 - Aadhar Number */}
											<div>
												<label
													htmlFor="aadharNumber"
													className="block mb-2 text-sm font-semibold text-gray-900"
												>
													Aadhar Number
												</label>
												<div className="relative">
													<Field
														type="text"
														name="aadharNumber"
														id="aadharNumber"
														className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${
															errors.aadharNumber && touched.aadharNumber
																? "border-red-500"
																: ""
														}`}
														placeholder="123456789012"
													/>
													<i className="mdi mdi-card-account-details-outline text-gray-400 text-lg absolute left-3 top-1/2 transform -translate-y-1/2"></i>
												</div>
												<ErrorMessage
													name="aadharNumber"
													component="p"
													className="mt-1 text-sm text-red-500"
												/>
											</div>

											{/* Column 2 - Password */}
											<div>
												<label
													htmlFor="password"
													className="block mb-2 text-sm font-semibold text-gray-900"
												>
													Password
												</label>
												<div className="relative">
													<Field
														type="password"
														name="password"
														id="password"
														placeholder="••••••••"
														className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${
															errors.password && touched.password
																? "border-red-500"
																: ""
														}`}
													/>
													<i className="mdi mdi-lock-outline text-gray-400 text-lg absolute left-3 top-1/2 transform -translate-y-1/2"></i>
												</div>
												<ErrorMessage
													name="password"
													component="p"
													className="mt-1 text-sm text-red-500"
												/>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div className="flex items-start">
												<div className="flex items-center h-5">
													<Field
														id="remember"
														name="remember"
														type="checkbox"
														className="w-4 h-4 border border-gray-400 rounded bg-white focus:ring-3 focus:ring-indigo-300"
													/>
												</div>
												<div className="ml-3 text-sm">
													<label htmlFor="remember" className="text-gray-500">
														Remember me
													</label>
												</div>
											</div>
											<a
												href="#"
												className="text-sm font-medium text-black hover:underline"
											>
												Forgot password?
											</a>
										</div>
										<button
											type="submit"
											disabled={isSubmitting}
											className="w-full text-white bg-black hover:bg-black/80 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
										>
											Register
										</button>
										<p className="text-sm font-light text-gray-500">
											Already have an account?{" "}
											<a
												href="#"
												className="font-medium text-black hover:underline"
											>
												Sign in
											</a>
										</p>
									</Form>
								)}
							</Formik>
						</div>
					</div>
				</div>
			</section>
			<OTPModal
				isOpen={isEmailModalOpen}
				onClose={() => setIsEmailModalOpen(false)}
				onVerify={handleEmailVerify}
				email={userEmail}
			/>
			<PhoneVerificationModal
				isOpen={isPhoneModalOpen}
				onClose={() => setIsPhoneModalOpen(false)}
				onVerify={handlePhoneVerify}
				phoneNumber={userPhone}
			/>
		</>
		</div>
	);
};

export default UserSignup;
