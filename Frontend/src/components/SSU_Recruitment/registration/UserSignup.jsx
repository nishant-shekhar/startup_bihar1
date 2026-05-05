import React, { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneVerificationModal from "./modals/PhoneVerificationModal";
import { useLanguage } from "../shared/LanguageContext";
import {
  FaCheckCircle,
  FaLock,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaIdCard,
} from "react-icons/fa";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://startup.bihar.gov.in/newapi";

const getValidationSchema = (isLoggedIn) => {
  if (isLoggedIn) {
    return Yup.object().shape({});
  }

  return Yup.object().shape({
    fullName: Yup.string().trim().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    aadharNumber: Yup.string()
      .matches(/^[0-9]{12}$/, "Aadhaar number must be exactly 12 digits")
      .required("Aadhaar number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });
};

export default function UserSignup({
  onSubmit,
  initialValues,
  isReadOnly = false,
  isLoggedIn = false,
  loginIdentity = "",
}) {
  const { t } = useLanguage();
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [userPhone, setUserPhone] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const validationSchema = useMemo(
    () => getValidationSchema(isLoggedIn),
    [isLoggedIn]
  );

  const sendOtp = async (phoneNumber) => {
    // ── DEV MODE: OTP sending disabled for local testing ──
    // Uncomment below block before production deployment
    /*
    const res = await fetch(`${API_BASE}/otp-auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: phoneNumber }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to send OTP");
    }
    return data;
    */
    // DEV: just resolve immediately
    return { success: true };
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError("");

    if (isReadOnly) {
      setSubmitting(false);
      return;
    }

    try {
      setSendingOtp(true);
      // ── DEV MODE: skip OTP modal, go directly to verified ──
      // await sendOtp(values.phoneNumber);  // <-- restore for production
      // setFormValues({ ...values });
      // setUserPhone(values.phoneNumber);
      // setIsPhoneModalOpen(true);           // <-- restore for production

      // DEV: bypass OTP — treat as already verified
      const mockValues = { ...values };
      setFormValues(mockValues);
      setUserPhone(values.phoneNumber);
      // call handlePhoneVerified inline so modal is never shown
      const result = await onSubmit?.({
        type: "registration",
        registeredAt: new Date().toISOString(),
        ...mockValues,
      });
      if (result?.ok === false) {
        setSubmitError(result.error || "Registration failed.");
      }
    } catch (error) {
      setSubmitError(error.message || "Could not register.");
    } finally {
      setSendingOtp(false);
      setSubmitting(false);
    }
  };

  const handlePhoneVerified = async () => {
    setIsPhoneModalOpen(false);
    setSubmitError("");

    if (formValues && onSubmit) {
      const result = await onSubmit({
        type: "registration",
        registeredAt: new Date().toISOString(),
        ...formValues,
      });

      if (result?.ok === false) {
        setSubmitError(result.error || "Registration failed.");
      }
    }
  };

  const signupInitialValues = {
    fullName: initialValues?.fullName || "",
    email: initialValues?.email || "",
    phoneNumber: initialValues?.phoneNumber || "",
    aadharNumber: initialValues?.aadharNumber || "",
    password: "",
    confirmPassword: "",
  };

  return (
    <>
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Step 1 of 6
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Register with your personal and contact details. Returning
              applicants can log in from this same screen.
            </p>
          </div>

          {isLoggedIn ? (
            <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800 shadow-sm">
              <div className="flex items-center gap-2 font-semibold">
                <FaCheckCircle />
                Logged in
              </div>
              <div className="mt-1 text-emerald-700">
                {loginIdentity || "Authenticated applicant"}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-[32px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
          {isReadOnly ? (
            <div className="mb-6 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <FaLock />
                Registration details locked
              </div>
              <div className="mt-1">
                This application has already been submitted. Registration
                details cannot be edited now.
              </div>
            </div>
          ) : isLoggedIn ? (
            <div className="mb-6 rounded-[24px] border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-800 shadow-sm">
              <div className="font-semibold">You are already logged in.</div>
              <div className="mt-1">
                Your account is verified. Proceed to fill the application form.
              </div>
            </div>
          ) : (
            <div className="mb-6 grid gap-4 md:grid-cols-[1.3fr_0.9fr]">
              <div className="rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-amber-50/70 p-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Registration note
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  A secure password is required. Returning applicants can log in
                  using registration number, email or mobile number.
                </div>
              </div>

              <div className="rounded-[24px] border border-indigo-100 bg-indigo-50/70 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FaShieldAlt className="text-indigo-600" />
                  Verification note
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  Your mobile number will be verified through OTP before
                  registration is saved.
                </div>
              </div>
            </div>
          )}

          {!isLoggedIn && (
            <Formik
              initialValues={signupInitialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <InputField
                      name="fullName"
                      label="Full Name (as per records)"
                      placeholder="Enter your full name"
                      errors={errors}
                      touched={touched}
                      disabled={isReadOnly}
                    />

                    <InputField
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="you@example.com"
                      errors={errors}
                      touched={touched}
                      disabled={isReadOnly}
                    />

                    <InputField
                      name="phoneNumber"
                      type="tel"
                      maxLength={10}
                      label="Mobile Number"
                      placeholder="10-digit mobile number"
                      errors={errors}
                      touched={touched}
                      disabled={isReadOnly}
                    />

                    <InputField
                      name="aadharNumber"
                      type="text"
                      maxLength={12}
                      label="Aadhaar Number"
                      placeholder="12-digit Aadhaar number"
                      errors={errors}
                      touched={touched}
                      disabled={isReadOnly}
                    />

                    <InputField
                      name="password"
                      type="password"
                      label="Password"
                      placeholder="••••••••"
                      errors={errors}
                      touched={touched}
                      disabled={isReadOnly}
                    />

                    <InputField
                      name="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      placeholder="••••••••"
                      errors={errors}
                      touched={touched}
                      disabled={isReadOnly}
                    />
                  </div>

                  {submitError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {submitError}
                    </div>
                  ) : null}

                  {sendingOtp ? (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                      <div className="flex items-center gap-3">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                        Sending OTP to your mobile number. Please wait...
                      </div>
                    </div>
                  ) : null}

                  {!isReadOnly ? (
                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-between">
                      <div className="text-sm text-slate-500">
                        Your details will be saved after phone verification.
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || sendingOtp}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting || sendingOtp ? (
                          <>
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Sending OTP...
                          </>
                        ) : (
                          "Register & Continue"
                        )}
                      </button>
                    </div>
                  ) : null}
                </Form>
              )}
            </Formik>
          )}

          {isLoggedIn && !isReadOnly && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => onSubmit?.({ type: "skipToNext" })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Continue to Personal Details →
              </button>
            </div>
          )}
        </div>
      </div>

      {!isReadOnly && !isLoggedIn ? (
        <PhoneVerificationModal
          isOpen={isPhoneModalOpen}
          onClose={() => setIsPhoneModalOpen(false)}
          onVerified={handlePhoneVerified}
          phoneNumber={userPhone}
        />
      ) : null}
    </>
  );
}

function InputField({
  name,
  label,
  placeholder,
  type = "text",
  maxLength,
  errors,
  touched,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = errors[name] && touched[name];
  const isPasswordField = type === "password";

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>

      <div className="relative">
        <Field
          id={name}
          name={name}
          type={isPasswordField && showPassword ? "text" : type}
          maxLength={maxLength}
          disabled={disabled}
          className={`block w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${
            isPasswordField ? "pr-12" : ""
          } ${
            disabled
              ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
              : hasError
              ? "border-red-400 bg-red-50"
              : "border-slate-200 bg-white/85 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
          }`}
          placeholder={placeholder}
        />

        {isPasswordField ? (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        ) : null}
      </div>

      <ErrorMessage
        name={name}
        component="p"
        className="mt-2 text-sm text-red-500"
      />
    </div>
  );
}