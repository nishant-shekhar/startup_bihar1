import React, { useEffect, useRef, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE || "https://startup.bihar.gov.in/newapi";

const PhoneVerificationModal = ({
  isOpen,
  onClose,
  onVerified,
  phoneNumber,
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
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
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

    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
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

      setMessage("Phone verified successfully.");
      onVerified?.();
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
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError("Unable to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={loading || resending ? undefined : onClose}
      />
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 animate-fadeIn">
        <div className="mb-8 text-center">
          <div className="mb-4">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
              <i className="mdi mdi-phone text-3xl text-black"></i>
            </span>
          </div>
          <h3 className="mb-2 text-2xl font-bold text-gray-900">
            Verify Your Phone
          </h3>
          <p className="text-gray-600">
            We sent a verification code to
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
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="h-12 w-12 rounded-xl border border-gray-300 text-center text-xl font-semibold outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
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
          disabled={loading}
          className="w-full rounded-lg bg-black py-3 font-medium text-white transition-colors hover:bg-black/80 disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify Phone"}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
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
      </div>
    </div>
  );
};

export default PhoneVerificationModal;