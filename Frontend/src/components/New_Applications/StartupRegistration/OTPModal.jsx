import React, { useState } from "react";

const OTPModal = ({ isOpen, onClose, onVerify, email }) => {
	const [otp, setOTP] = useState(["", "", "", "", "", ""]);

	if (!isOpen) return null;

	const handleChange = (element, index) => {
		if (isNaN(element.value)) return;

		setOTP([...otp.map((d, idx) => (idx === index ? element.value : d))]);

		// Focus next input
		if (element.value && element.nextSibling) {
			element.nextSibling.focus();
		}
	};

	const handleKeyDown = (e, index) => {
		// Handle backspace
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			const prev = e.target.previousSibling;
			if (prev) {
				prev.focus();
			}
		}
	};

	const handleSubmit = () => {
		const otpString = otp.join("");
		if (otpString.length === 6) {
			onVerify(otpString);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black bg-opacity-50"
				onClick={onClose}
			></div>
			<div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-fadeIn">
				<div className="text-center mb-8">
					<h3 className="text-2xl font-bold text-gray-900 mb-2">
						Verify Your Email
					</h3>
					<p className="text-gray-600">
						We've sent a verification code to
						<br />
						<span className="font-medium text-gray-900">{email}</span>
					</p>
				</div>

				<div className="flex justify-center gap-2 mb-6">
					{otp.map((digit, index) => (
						<input
							key={index}
							type="text"
							maxLength="1"
							value={digit}
							onChange={(e) => handleChange(e.target, index)}
							onKeyDown={(e) => handleKeyDown(e, index)}
							className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
						/>
					))}
				</div>

				<button
					onClick={handleSubmit}
					className="w-full py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors font-medium"
				>
					Verify Email
				</button>

				<div className="text-center mt-6">
					<p className="text-gray-600">
						Didn't receive the code?{" "}
						<button className="text-black font-medium hover:underline">
							Resend
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default OTPModal;
