import React, { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PhoneVerificationModal from "./modals/PhoneVerificationModal";
import { useLanguage } from "../shared/LanguageContext";
import { FaCheckCircle, FaLock, FaShieldAlt } from "react-icons/fa";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://startup.bihar.gov.in/newapi";

const getValidationSchema = (isLoggedIn) => {
  if (isLoggedIn) {
    return Yup.object().shape({
      startupName: Yup.string().trim().required("Startup name is required"),
    });
  }

  return Yup.object().shape({
    founderName: Yup.string().trim().required("Applicant name is required"),
    startupName: Yup.string().trim().required("Startup name is required"),
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
  const [updatingName, setUpdatingName] = useState(false);

  const validationSchema = useMemo(
    () => getValidationSchema(isLoggedIn),
    [isLoggedIn]
  );

  const sendOtp = async (phoneNumber) => {
    const res = await fetch(`${API_BASE}/otp-auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mobile: phoneNumber,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to send OTP");
    }

    return data;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError("");

    if (isReadOnly) {
      setSubmitting(false);
      return;
    }

    if (isLoggedIn) {
      try {
        setUpdatingName(true);

        const result = await onSubmit?.({
          startupName: values.startupName?.trim() || "",
          type: "updateStartupName",
        });

        if (result?.ok === false) {
          setSubmitError(result.error || "Could not update startup name.");
        }
      } catch (error) {
        setSubmitError(error.message || "Could not update startup name.");
      } finally {
        setUpdatingName(false);
        setSubmitting(false);
      }
      return;
    }

    try {
      setSendingOtp(true);

      await sendOtp(values.phoneNumber);

      setFormValues(values);
      setUserPhone(values.phoneNumber);
      setIsPhoneModalOpen(true);
    } catch (error) {
      setSubmitError(error.message || "Could not send OTP.");
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
    founderName: initialValues?.founderName || "",
    startupName: initialValues?.startupName || "",
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
              Register your startup
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Start with founder and startup details. Login is available from this same screen for returning applicants.
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
                This application has already been submitted. Registration details cannot be edited now.
              </div>
            </div>
          ) : isLoggedIn ? (
            <div className="mb-6 rounded-[24px] border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-800 shadow-sm">
              <div className="font-semibold">You are already logged in.</div>
              <div className="mt-1">
                New registration is disabled. Only startup name can be updated here.
              </div>
            </div>
          ) : (
            <div className="mb-6 grid gap-4 md:grid-cols-[1.3fr_0.9fr]">
              <div className="rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-amber-50/70 p-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Registration note
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  A secure password is required. Returning applicants can log in using registration number, email or mobile number.
                </div>
              </div>

              <div className="rounded-[24px] border border-indigo-100 bg-indigo-50/70 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FaShieldAlt className="text-indigo-600" />
                  Verification note
                </div>
                <div className="mt-2 text-sm text-slate-500">
                  Your mobile number will be verified through OTP before registration is saved.
                </div>
              </div>
            </div>
          )}

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
                    name="founderName"
                    label={t("userSignup.applicantName")}
                    placeholder={t("userSignup.applicantNamePlaceholder")}
                    errors={errors}
                    touched={touched}
                    disabled={isReadOnly || isLoggedIn}
                  />

                  <InputField
                    name="startupName"
                    label={t("userSignup.startupName")}
                    placeholder={t("userSignup.startupNamePlaceholder")}
                    errors={errors}
                    touched={touched}
                    disabled={isReadOnly}
                  />

                  <InputField
                    name="email"
                    type="email"
                    label={t("userSignup.email")}
                    placeholder={t("userSignup.emailPlaceholder")}
                    errors={errors}
                    touched={touched}
                    disabled={isReadOnly || isLoggedIn}
                  />

                  <InputField
                    name="phoneNumber"
                    type="tel"
                    maxLength={10}
                    label={t("userSignup.phoneNumber")}
                    placeholder={t("userSignup.phoneNumberPlaceholder")}
                    errors={errors}
                    touched={touched}
                    disabled={isReadOnly || isLoggedIn}
                  />

                  <InputField
                    name="aadharNumber"
                    type="text"
                    maxLength={12}
                    label={t("userSignup.aadharNumber")}
                    placeholder={t("userSignup.aadharNumberPlaceholder")}
                    errors={errors}
                    touched={touched}
                    disabled={isReadOnly || isLoggedIn}
                  />

                  <div className="hidden md:block" />

                  {!isLoggedIn ? (
                    <>
                      <InputField
                        name="password"
                        type="password"
                        label={t("userSignup.password")}
                        placeholder="••••••••"
                        errors={errors}
                        touched={touched}
                        disabled={isReadOnly}
                      />

                      <InputField
                        name="confirmPassword"
                        type="password"
                        label={t("userSignup.confirmPassword")}
                        placeholder="••••••••"
                        errors={errors}
                        touched={touched}
                        disabled={isReadOnly}
                      />
                    </>
                  ) : null}
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

                {updatingName ? (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      Updating startup name. Please wait...
                    </div>
                  </div>
                ) : null}

                {!isReadOnly ? (
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-slate-500">
                      {isLoggedIn
                        ? "You can update only the startup name."
                        : "Your details will be saved as a draft after phone verification."}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || sendingOtp || updatingName}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting || sendingOtp || updatingName ? (
                        <>
                          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          {isLoggedIn ? "Updating..." : "Sending OTP..."}
                        </>
                      ) : isLoggedIn ? (
                        "Update Startup Name"
                      ) : (
                        t("userSignup.register")
                      )}
                    </button>
                  </div>
                ) : null}
              </Form>
            )}
          </Formik>
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
  const hasError = errors[name] && touched[name];

  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        maxLength={maxLength}
        disabled={disabled}
        className={`block w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500"
            : hasError
            ? "border-red-400 bg-red-50"
            : "border-slate-200 bg-white/85 focus:border-slate-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(148,163,184,0.10)]"
        }`}
        placeholder={placeholder}
      />
      <ErrorMessage
        name={name}
        component="p"
        className="mt-2 text-sm text-red-500"
      />
    </div>
  );
}