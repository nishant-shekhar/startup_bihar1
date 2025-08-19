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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const UserSignup = ({ onSubmit, onPrevious, initialValues }) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
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

  const handleSignIn = (signInData) => {
    console.log("User signed in:", signInData);
    // Mark the registration step as complete with sign-in data
    const registrationData = {
      type: "signin",
      email: signInData.email,
      signedInAt: new Date().toISOString(),
      ...signInData,
    };

    if (onSubmit) {
      onSubmit(registrationData);
    }
    setIsSignInModalOpen(false);
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    setIsSignInModalOpen(true);
  };

  const handlePhoneVerify = (otp) => {
    console.log("Verifying Phone OTP:", otp);
    // TODO: Verify phone OTP and complete registration
    setIsPhoneModalOpen(false);

    if (formValues) {
      // Mark as registration type and call onSubmit
      const registrationData = {
        type: "registration",
        registeredAt: new Date().toISOString(),
        ...formValues,
      };
      onSubmit(registrationData);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css"
      />
      <div className="flex flex-col items-center justify-center px-6 pb-10 mx-auto">
        <div className="w-full bg-white rounded-lg md:mt-0 sm:max-w-4xl xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 sm:pt-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl">
              Register your startup
            </h1>

            <hr />
            <Formik
              initialValues={
                initialValues || {
                  founderName: "",
                  startupName: "",
                  email: "",
                  phoneNumber: "",
                  aadharNumber: "",
                  password: "",
                  confirmPassword: "",
                  remember: false,
                }
              }
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
                          className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${errors.founderName && touched.founderName
                              ? "border-red-500"
                              : ""
                            }`}
                          placeholder="Abhinav Kumar"
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
                          className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${errors.startupName && touched.startupName
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
                          className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${errors.email && touched.email
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
                          maxLength={10}   // ✅ restricts to 10 digits
                          className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${errors.phoneNumber && touched.phoneNumber ? "border-red-500" : ""
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
                          maxLength={12}   // ✅ restricts to 12 digits
                          className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${errors.aadharNumber && touched.aadharNumber ? "border-red-500" : ""
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
                          className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${errors.password && touched.password
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

                    {/* Column - Confirm Password (last) */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="confirmPassword"
                        className="block mb-2 text-sm font-semibold text-gray-900"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Field
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          placeholder="••••••••"
                          className={`bg-white border border-gray-400 text-gray-900 rounded-2xl focus:ring-indigo-600 focus:border-indigo-600 block w-full p-2.5 pl-10 ${errors.confirmPassword && touched.confirmPassword
                              ? "border-red-500"
                              : ""
                            }`}
                        />
                        <i className="mdi mdi-lock-check-outline text-gray-400 text-lg absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                      </div>
                      <ErrorMessage
                        name="confirmPassword"
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
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white bg-black hover:bg-black/80 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Register
                  </button>
                  <p className="text-sm font-light text-gray-500 text-center">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={handleSignInClick}
                      className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                    >
                      Sign in here
                    </button>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

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

      {/* Sign In Modal */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Sign In</h2>
              <button
                onClick={() => setIsSignInModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={Yup.object({
                email: Yup.string()
                  .email("Invalid email")
                  .required("Email is required"),
                password: Yup.string().required("Password is required"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                // Simulate sign in process
                setTimeout(() => {
                  handleSignIn(values);
                  setSubmitting(false);
                }, 1000);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <Field
                      name="password"
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setIsSignInModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>
                  </div>

                  <p className="text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignInModalOpen(false)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Register instead
                    </button>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default UserSignup;
