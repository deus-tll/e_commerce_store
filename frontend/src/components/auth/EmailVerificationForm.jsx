import React, {useState, useRef, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {ArrowRight, Verified} from "lucide-react";

import {useAuthStore} from "../../stores/useAuthStore.js";
import {getErrorMessage} from "../../utils/errorParser.js";

import Button from "../ui/Button.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const EmailVerificationForm = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const [formError, setFormError] = useState(null);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { loading, verifyEmail } = useAuthStore();

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormError(null);

		const verificationCode = code.join("");
		if (verificationCode.length !== 6) {
			setFormError("Please enter the full 6-digit code.");
			return;
		}

		try {
			await verifyEmail(verificationCode);
			navigate("/");
		}
		catch (err) {
			const msg = getErrorMessage(err, "Verification failed. Please check the code.");
			setFormError(msg);
		}
	}

	const stableHandleSubmit = React.useCallback(handleSubmit, [code, navigate, verifyEmail]);

	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			stableHandleSubmit(new Event("submit"));
		}
	}, [code, stableHandleSubmit]);

	return (
		<>
			<p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>
			<form onSubmit={handleSubmit} className='space-y-6'>
				<ErrorMessage message={formError} />

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
				<Button disabled={loading} className="w-full justify-center">
					<Verified className="h-4 w-4" />
					Verify
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