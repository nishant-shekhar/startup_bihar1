import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaIdCard,
  FaLock,
  FaMobileAlt,
  FaShieldAlt,
  FaSpinner,
  FaUserPlus,
} from "react-icons/fa";

import { doc, getDoc } from "firebase/firestore";
import {
  get,
  ref as rtdbRef,
  remove,
  serverTimestamp as rtdbServerTimestamp,
  set,
} from "firebase/database";

import { db, rtdb } from "../../AdminRedesign/NewApplicationAdmin/firebase";
import SSUPhoneVerificationModal from "./modals/SSUPhoneVerificationModal";
import { SSU_DEV_MODE } from "../ssuDevMode";
import { ssuDocPath } from "./ssuFirebasePaths";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://startup.bihar.gov.in/newapi";

const NAME_REGEX = /^[A-Za-z.' ]+$/;

const normalizeEmail = (value = "") => String(value || "").trim().toLowerCase();

const normalizePhone = (value = "") =>
  String(value || "").replace(/\D/g, "").slice(0, 10);

const normalizeAadhaar = (value = "") =>
  String(value || "").replace(/\D/g, "").slice(0, 12);

const sanitizeName = (value = "") => {
  return String(value || "")
    .replace(/[^A-Za-z.' ]/g, "")
    .replace(/\s+/g, " ")
    .trimStart();
};

const uniqueArray = (items = []) => {
  return Array.from(
    new Set(
      items
        .filter(Boolean)
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    )
  );
};

const formatDeadline = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(Number(timestamp));
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getServerNowFromRTDB = async () => {
  const tempKey = `ssu_signup_ts_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;

  const tempRef = rtdbRef(rtdb, `SSURecruitment/tempServerTime/${tempKey}`);

  await set(tempRef, { ts: rtdbServerTimestamp() });

  const snap = await get(tempRef);
  const serverNow = snap.exists() ? snap.val()?.ts : null;

  try {
    await remove(tempRef);
  } catch (error) {
    console.warn("Could not remove temporary server time node", error);
  }

  if (!serverNow || Number.isNaN(Number(serverNow))) {
    throw new Error("Could not fetch trusted server time.");
  }

  return Number(serverNow);
};

const readIdentifierApplicationIds = async (pathParts) => {
  const snap = await getDoc(doc(db, ...pathParts));

  if (!snap.exists()) return [];

  const data = snap.data() || {};

  return uniqueArray([
    ...(Array.isArray(data.applicationIds) ? data.applicationIds : []),
    data.applicationId,
    data.latestApplicationId,
  ]);
};

const checkDuplicateIdentifiers = async ({
  email,
  phoneNumber,
  aadharNumber,
}) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phoneNumber);
  const normalizedAadhaar = normalizeAadhaar(aadharNumber);

  const checks = [];

  if (normalizedEmail) {
    checks.push({
      field: "email",
      label: "Email ID",
      value: normalizedEmail,
      ids: await readIdentifierApplicationIds(
        ssuDocPath.blockedEmail(normalizedEmail)
      ),
    });
  }

  if (normalizedPhone) {
    checks.push({
      field: "mobile",
      label: "Mobile Number",
      value: normalizedPhone,
      ids: await readIdentifierApplicationIds(
        ssuDocPath.blockedPhone(normalizedPhone)
      ),
    });
  }

  if (normalizedAadhaar) {
    checks.push({
      field: "aadhaar",
      label: "Aadhaar Number",
      value: normalizedAadhaar,
      ids: await readIdentifierApplicationIds(
        ssuDocPath.blockedAadhaar(normalizedAadhaar)
      ),
    });
  }

  const matches = checks
    .filter((item) => item.ids.length > 0)
    .map((item) => ({
      field: item.field,
      label: item.label,
      existingApplicationIds: item.ids,
      count: item.ids.length,
    }));

  return {
    hasDuplicate: matches.length > 0,
    matchedFields: matches.map((item) => item.field),
    existingApplicationIds: uniqueArray(
      matches.flatMap((item) => item.existingApplicationIds)
    ),
    matches,
  };
};

const getValidationSchema = (isLoggedIn) => {
  if (isLoggedIn) {
    return Yup.object().shape({});
  }

  return Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .matches(
        NAME_REGEX,
        "Only alphabets, spaces, dot and apostrophe are allowed"
      )
      .min(2, "Enter a valid full name")
      .required("Full name is required"),

    email: Yup.string()
      .trim()
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

const buildInitialValues = (initialValues) => ({
  fullName: initialValues?.fullName || "",
  email: initialValues?.email || "",
  phoneNumber: initialValues?.phoneNumber || "",
  aadharNumber:
    initialValues?.aadharNumber || initialValues?.aadhaarNumber || "",
  password: "",
  confirmPassword: "",
});

const getClosedMessage = (settingsData, serverNow) => {
  const isManuallyClosed =
    settingsData?.close === true || settingsData?.isOpen === false;

  const lastDate = Number(settingsData?.lastDate || 0);
  const hasDeadline = lastDate > 0;
  const deadlinePassed = hasDeadline ? Number(serverNow) > lastDate : false;

  if (isManuallyClosed) {
    return (
      settingsData?.message ||
      "SSU Recruitment application form is currently closed."
    );
  }

  if (deadlinePassed) {
    return `SSU Recruitment application form closed on ${formatDeadline(
      lastDate
    )}. New registration is not allowed.`;
  }

  return "";
};

export default function SSUUserSignup({
  onSubmit,
  initialValues,
  isReadOnly = false,
  isLoggedIn = false,
  loginIdentity = "",
  onRequestLogin,
}) {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [userPhone, setUserPhone] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const [duplicateWarning, setDuplicateWarning] = useState({
    open: false,
    cleanedValues: null,
    duplicateInfo: null,
  });

  const [formWindow, setFormWindow] = useState({
    checked: false,
    loading: true,
    isOpen: true,
    message: "",
    lastDate: null,
    serverNow: null,
  });

  const validationSchema = useMemo(
    () => getValidationSchema(isLoggedIn),
    [isLoggedIn]
  );

  const signupInitialValues = useMemo(
    () => buildInitialValues(initialValues),
    [initialValues]
  );

  const verifyFormWindow = async () => {
    try {
      setFormWindow((prev) => ({
        ...prev,
        loading: true,
      }));

      const [settingsSnap, serverNow] = await Promise.all([
        getDoc(doc(db, ...ssuDocPath.settingFormOpen())),
        getServerNowFromRTDB(),
      ]);

      const settingsData = settingsSnap.exists() ? settingsSnap.data() : null;
      const closedMessage = getClosedMessage(settingsData, serverNow);

      const nextState = {
        checked: true,
        loading: false,
        isOpen: !closedMessage,
        message: closedMessage,
        lastDate: settingsData?.lastDate || null,
        serverNow,
      };

      setFormWindow(nextState);
      return nextState;
    } catch (error) {
      console.error("Failed to verify SSU form window", error);

      const nextState = {
        checked: true,
        loading: false,
        isOpen: false,
        message:
          "Unable to verify application window right now. New registration is temporarily blocked.",
        lastDate: null,
        serverNow: null,
      };

      setFormWindow(nextState);
      return nextState;
    }
  };

  useEffect(() => {
    verifyFormWindow();
  }, []);

  const sendOtp = async (phoneNumber) => {
    if (SSU_DEV_MODE) {
      return { success: true };
    }

    const res = await fetch(`${API_BASE}/otp-auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile: phoneNumber }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to send OTP");
    }

    return data;
  };

  const cleanSignupValues = (values) => ({
    fullName: sanitizeName(values.fullName),
    email: normalizeEmail(values.email),
    phoneNumber: normalizePhone(values.phoneNumber),
    aadharNumber: normalizeAadhaar(values.aadharNumber),
    password: values.password || "",
    confirmPassword: values.confirmPassword || "",
  });

  const startOtpFlow = async (cleanedValues, duplicateInfo = null) => {
    try {
      setSendingOtp(true);
      setSubmitError("");

      await sendOtp(cleanedValues.phoneNumber);

      const duplicateIdentifierWarning = duplicateInfo?.hasDuplicate
        ? {
            shown: true,
            accepted: true,
            acceptedAt: new Date().toISOString(),
            matchedFields: duplicateInfo.matchedFields || [],
            existingApplicationIds: duplicateInfo.existingApplicationIds || [],
            matches: duplicateInfo.matches || [],
          }
        : null;

      setFormValues({
        ...cleanedValues,
        duplicateIdentifierWarning,
      });

      setUserPhone(cleanedValues.phoneNumber);
      setIsPhoneModalOpen(true);

      return { ok: true };
    } catch (error) {
      setSubmitError(error.message || "Could not send OTP.");
      return { ok: false };
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError("");

    if (isReadOnly) {
      setSubmitting(false);
      return;
    }

    try {
      const windowState = await verifyFormWindow();

      if (!windowState.isOpen && !isLoggedIn) {
        setSubmitError(
          windowState.message ||
            "SSU Recruitment application form is currently closed."
        );
        return;
      }

      const cleanedValues = cleanSignupValues(values);

      if (cleanedValues.phoneNumber.length !== 10) {
        setSubmitError("Enter a valid 10-digit mobile number.");
        return;
      }

      if (cleanedValues.aadharNumber.length !== 12) {
        setSubmitError("Enter a valid 12-digit Aadhaar number.");
        return;
      }

      const duplicateInfo = await checkDuplicateIdentifiers(cleanedValues);

      if (duplicateInfo.hasDuplicate) {
        setDuplicateWarning({
          open: true,
          cleanedValues,
          duplicateInfo,
        });
        return;
      }

      await startOtpFlow(cleanedValues, null);
    } catch (error) {
      setSubmitError(error.message || "Could not continue registration.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneVerified = async () => {
    setIsPhoneModalOpen(false);
    setSubmitError("");

    if (!formValues || !onSubmit) return;

    const windowState = await verifyFormWindow();

    if (!windowState.isOpen && !isLoggedIn) {
      setSubmitError(
        windowState.message ||
          "SSU Recruitment application form is currently closed."
      );
      return;
    }

    const result = await onSubmit({
      type: "registration",
      registeredAt: new Date().toISOString(),
      phoneVerified: true,
      ...formValues,
    });

    if (result?.ok === false) {
      setSubmitError(result.error || "Registration failed.");
    }
  };

  const signupBlocked = !isLoggedIn && !formWindow.loading && !formWindow.isOpen;
  const signupDisabled =
    isReadOnly || sendingOtp || formWindow.loading || signupBlocked;

  return (
    <>
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              <FaUserPlus />
              Step 1
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Create Your Account
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Register with your personal contact details. Your mobile number
              will be verified through OTP before the application is created.
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
          {formWindow.loading ? (
            <div className="mb-6 rounded-[24px] border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-800">
              <div className="flex items-center gap-3 font-semibold">
                <FaSpinner className="animate-spin" />
                Checking application window...
              </div>
              <div className="mt-1">
                Please wait while we verify whether new registration is open.
              </div>
            </div>
          ) : signupBlocked ? (
            <div className="mb-6 rounded-[24px] border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
              <div className="flex items-center gap-2 font-semibold">
                <FaLock />
                New registration is closed
              </div>

              <div className="mt-1">
                {formWindow.message ||
                  "SSU Recruitment application form is currently closed."}
              </div>
            </div>
          ) : formWindow.checked && !isLoggedIn ? (
            <div className="mb-6 rounded-[24px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
              <div className="flex items-center gap-2 font-semibold">
                <FaCheckCircle />
                New registration is open
              </div>

              {formWindow.lastDate ? (
                <div className="mt-1">
                  Last date: {formatDeadline(formWindow.lastDate)}
                </div>
              ) : (
                <div className="mt-1">
                  You may register and complete the application.
                </div>
              )}
            </div>
          ) : null}

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
                Your account is verified. Continue to the application form.
              </div>
            </div>
          ) : (
            <div className="mb-6 grid gap-4 md:grid-cols-[1.3fr_0.9fr]">
              <div className="rounded-[24px] border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-amber-50/70 p-5">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                  Registration note
                </div>

                <div className="mt-2 text-sm leading-relaxed text-slate-600">
                  After OTP verification, your Application ID will be generated.
                  Returning applicants may log in using their Application ID,
                  email, or mobile number.
                </div>
              </div>

              <div className="rounded-[24px] border border-indigo-100 bg-indigo-50/70 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <FaShieldAlt className="text-indigo-600" />
                  Duplicate identifier note
                </div>

                <div className="mt-2 text-sm leading-relaxed text-slate-500">
                  If the same mobile, email, or Aadhaar is already used, you
                  will see a warning. Continue only if you are intentionally
                  creating another application.
                </div>
              </div>
            </div>
          )}

          {!isLoggedIn ? (
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
                      label="Full Name"
                      placeholder="Enter full name"
                      required
                      errors={errors}
                      touched={touched}
                      disabled={signupDisabled}
                      icon={<FaIdCard />}
                      onSanitize={sanitizeName}
                    />

                    <InputField
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="you@example.com"
                      required
                      errors={errors}
                      touched={touched}
                      disabled={signupDisabled}
                    />

                    <InputField
                      name="phoneNumber"
                      type="tel"
                      maxLength={10}
                      label="Mobile Number"
                      placeholder="10-digit mobile number"
                      required
                      errors={errors}
                      touched={touched}
                      disabled={signupDisabled}
                      icon={<FaMobileAlt />}
                      onSanitize={normalizePhone}
                    />

                    <InputField
                      name="aadharNumber"
                      type="text"
                      maxLength={12}
                      label="Aadhaar Number"
                      placeholder="12-digit Aadhaar number"
                      required
                      errors={errors}
                      touched={touched}
                      disabled={signupDisabled}
                      icon={<FaIdCard />}
                      onSanitize={normalizeAadhaar}
                    />

                    <InputField
                      name="password"
                      type="password"
                      label="Password"
                      placeholder="Minimum 6 characters"
                      required
                      errors={errors}
                      touched={touched}
                      disabled={signupDisabled}
                    />

                    <InputField
                      name="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      placeholder="Re-enter password"
                      required
                      errors={errors}
                      touched={touched}
                      disabled={signupDisabled}
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
                        {signupBlocked
                          ? "New registration is not allowed because the application window is closed."
                          : "Application ID will be generated after mobile OTP verification."}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting || signupDisabled}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSubmitting || sendingOtp ? (
                          <>
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Sending OTP...
                          </>
                        ) : signupBlocked ? (
                          "Registration Closed"
                        ) : formWindow.loading ? (
                          "Checking Form Status..."
                        ) : (
                          "Register & Continue"
                        )}
                      </button>
                    </div>
                  ) : null}
                </Form>
              )}
            </Formik>
          ) : null}

          {isLoggedIn && !isReadOnly ? (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => onSubmit?.({ type: "skipToNext" })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
              >
                Continue to Personal Details →
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <DuplicateIdentifierWarningModal
        open={duplicateWarning.open}
        duplicateInfo={duplicateWarning.duplicateInfo}
        loading={sendingOtp}
        onCancel={() =>
          setDuplicateWarning({
            open: false,
            cleanedValues: null,
            duplicateInfo: null,
          })
        }
        onLoginExisting={() => {
          setDuplicateWarning({
            open: false,
            cleanedValues: null,
            duplicateInfo: null,
          });
          onRequestLogin?.();
        }}
        onContinue={async () => {
          const cleanedValues = duplicateWarning.cleanedValues;
          const duplicateInfo = duplicateWarning.duplicateInfo;

          setDuplicateWarning({
            open: false,
            cleanedValues: null,
            duplicateInfo: null,
          });

          await startOtpFlow(cleanedValues, duplicateInfo);
        }}
      />

      {!isReadOnly && !isLoggedIn ? (
        <SSUPhoneVerificationModal
          isOpen={isPhoneModalOpen}
          onClose={() => setIsPhoneModalOpen(false)}
          onVerified={handlePhoneVerified}
          phoneNumber={userPhone}
          title="Verify Mobile Number"
          subtitle="We sent a verification code to"
          verifyButtonText="Verify & Create Application"
          verifyingText="Verifying OTP"
          resendingText="Sending OTP"
          successMessage="Mobile number verified successfully."
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
  required = false,
  icon = null,
  onSanitize,
}) {
  const [field, , helpers] = useField(name);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = errors?.[name] && touched?.[name];
  const isPasswordField = type === "password";

  const handleChange = (e) => {
    const rawValue = e.target.value;
    const value = onSanitize ? onSanitize(rawValue) : rawValue;
    helpers.setValue(value);
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-800"
      >
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>

      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {icon}
          </span>
        ) : null}

        <input
          id={name}
          name={name}
          value={field.value || ""}
          type={isPasswordField && showPassword ? "text" : type}
          maxLength={maxLength}
          disabled={disabled}
          onChange={handleChange}
          onBlur={field.onBlur}
          className={`block w-full rounded-2xl border px-4 py-3 text-slate-900 outline-none transition ${
            icon ? "pl-10" : ""
          } ${isPasswordField ? "pr-12" : ""} ${
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

function DuplicateIdentifierWarningModal({
  open,
  duplicateInfo,
  loading,
  onCancel,
  onLoginExisting,
  onContinue,
}) {
  if (!open) return null;

  const matches = duplicateInfo?.matches || [];

  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center bg-black/45 p-4">
      <div
        className="absolute inset-0"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative z-10 w-full max-w-lg rounded-[32px] border border-white/80 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.22)]">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <FaExclamationTriangle />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Existing Application Found
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              An application already exists with the same mobile number, Aadhaar
              number, or email ID. Continue only if you are intentionally
              submitting a new application, for example for another post.
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-3xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-sm font-bold text-amber-900">
            Matched duplicate field(s)
          </div>

          {matches.map((item) => (
            <div
              key={item.field}
              className="rounded-2xl border border-amber-200 bg-white px-4 py-3"
            >
              <div className="text-sm font-semibold text-slate-900">
                {item.label}
              </div>

              <div className="mt-1 text-xs text-slate-500">
                Existing Application ID(s):{" "}
                <span className="font-mono font-semibold">
                  {item.existingApplicationIds.join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-700">
          Duplicate or false applications may be rejected during scrutiny. This
          confirmation will be recorded with your new application.
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onLoginExisting}
            disabled={loading}
            className="rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
          >
            Login Existing Application
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={loading}
            className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Continue Anyway"}
          </button>
        </div>
      </div>
    </div>
  );
}