import React, { useEffect, useRef, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://startup.bihar.gov.in/newapi";

const PhoneVerificationModal = ({
  isOpen,
  onClose,
  onVerified,
  phoneNumber,
  title = "Verify Your Phone",
  subtitle = "We sent a verification code to",
  verifyButtonText = "Verify Phone",
  verifyingText = "Verifying OTP",
  resendingText = "Sending OTP",
  successMessage = "Phone verified successfully.",
}) => {
  const [otp, setOTP] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) return;

    setOTP(["", "", "", "", "", ""]);
    setError("");
    setMessage("");
    setCooldown(0);

    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 120);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!cooldown) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOTP(nextOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    e.preventDefault();

    const nextOtp = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i += 1) {
      nextOtp[i] = pasted[i];
    }

    setOTP(nextOtp);

    const lastIndex = Math.min(Math.max(pasted.length - 1, 0), 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch(`${API_BASE}/otp-auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: phoneNumber,
          otp: otpString,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "OTP verification failed.");
        return;
      }

      setMessage(successMessage);

      setTimeout(() => {
        onVerified?.();
      }, 300);
    } catch (err) {
      setError("Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      setResending(true);
      setError("");
      setMessage("");

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
        setError(data.message || "Could not resend OTP.");
        return;
      }

      setMessage("OTP resent successfully.");
      setCooldown(60);
      setOTP(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 60);
    } catch (err) {
      setError("Unable to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={loading || resending ? undefined : onClose}
      />

      <div className="relative mx-4 w-full max-w-md animate-fadeIn rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.62a2 2 0 0 1-.45 2.11L8 9.91a16 16 0 0 0 6.09 6.09l1.46-1.29a2 2 0 0 1 2.11-.45c.84.3 1.72.51 2.62.63A2 2 0 0 1 22 16.92Z"
                />
              </svg>
            </span>
          </div>

          <h3 className="mb-2 text-2xl font-bold text-gray-900">{title}</h3>

          <p className="text-gray-600">
            {subtitle}
            <br />
            <span className="font-medium text-gray-900">{phoneNumber}</span>
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={loading || resending}
              className="h-12 w-12 rounded-xl border border-gray-300 text-center text-xl font-semibold outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100"
            />
          ))}
        </div>

        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        ) : null}

        <button
          onClick={handleSubmit}
          disabled={loading || resending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 font-medium text-white transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Verifying...
            </>
          ) : (
            verifyButtonText
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || loading || cooldown > 0}
              className="font-medium text-black hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending
                ? "Sending..."
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend"}
            </button>
          </p>
        </div>

        {(loading || resending) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-[2px]">
            <div className="mx-6 w-full max-w-xs rounded-2xl border border-blue-100 bg-white px-5 py-5 text-center shadow-lg">
              <div className="mx-auto mb-3 inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
              <div className="text-base font-semibold text-slate-900">
                {loading ? verifyingText : resendingText}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                {loading
                  ? "Please wait while we verify your mobile number."
                  : "Please wait while we send a new OTP."}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneVerificationModal;