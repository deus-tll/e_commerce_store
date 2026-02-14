import {useState, useRef, useEffect, useCallback} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {ArrowRight, Verified} from "lucide-react";

import {useAuthStore} from "../../stores/useAuthStore.js";

import Button from "../ui/Button.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const EmailVerificationForm = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [localError, setLocalError] = useState(null);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { loading, error: verifyApiError, verifyEmail, clearError } = useAuthStore();

	useEffect(() => {
		return () => clearError();
	}, [clearError]);

	const handleChange = (index, value) => {
		const newCode = [...code];

		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");

			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}

			setCode(newCode);

			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			if (inputRefs.current[focusIndex]) {
				inputRefs.current[focusIndex].focus();
			}
		}
		else {
			newCode[index] = value;
			setCode(newCode);

			if (value && index < 5 && inputRefs.current[index + 1]) {
				inputRefs.current[index + 1].focus();
			}
		}
	}

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	}

	const submitCode = useCallback(async (verificationCode) => {
		clearError();
		setLocalError(null);

		if (verificationCode.length !== 6) {
			setLocalError("Please enter the full 6-digit code.");
			return;
		}

		const success = await verifyEmail(verificationCode);
		if (success) {
			navigate("/");
		}
	}, [verifyEmail, navigate, clearError]);

	const handleSubmit = (e) => {
		e.preventDefault();
		void submitCode(code.join(""));
	};

	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			void submitCode(code.join(""));
		}
	}, [code, submitCode]);

	return (
		<>
			<p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<ErrorMessage message={localError || verifyApiError} />

				<div className="flex justify-between">
					{code.map((digit, index) => (
						<input
							key={index}
							ref={(el) => (inputRefs.current[index] = el)}
							type="text"
							maxLength="1"
							value={digit}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
						/>
					))}
				</div>
				<Button type="submit" disabled={loading} className="w-full justify-center">
					<Verified className="h-4 w-4" />
					{loading ? "Verifying..." : "Verify"}
				</Button>
			</form>

			<p className="mt-8 text-center text-sm text-gray-400">
				<Link to="/" className="font-medium text-emerald-400 hover:text-emerald-300">
					Verify later <ArrowRight className="inline h-4 w-4" />
				</Link>
			</p>
		</>
	);
};

export default EmailVerificationForm;