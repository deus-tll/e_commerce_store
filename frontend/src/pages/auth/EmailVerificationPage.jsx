import React, {useState, useRef, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {Verified} from "lucide-react";
import {toast} from "react-hot-toast";

import AuthFormContainer from "../../components/auth/AuthFormContainer.jsx";
import SubmitButton from "../../components/SubmitButton.jsx";
import {useUserStore} from "../../stores/useUserStore.js";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { loading, verifyEmail } = useUserStore();

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
			inputRefs.current[focusIndex].focus();
		}
		else {
			newCode[index] = value;
			setCode(newCode);

			if (value && index < 5) {
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

		const verificationCode = code.join("");

		await verifyEmail(verificationCode);

		navigate("/");

		toast.success("Email verified successfully");
	}

	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

	return (
		<AuthFormContainer title="Verify Your Email">
			<p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>

			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className="flex justify-between">
					{code.map((digit, index) => (
						<input
							key={index}
							ref={(el) => (inputRefs.current[index] = el)}
							type="text"
							maxLength="6"
							value={digit}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
						/>
					))}
				</div>

				<SubmitButton loading={loading} text="Verify" icon={Verified} />
			</form>
		</AuthFormContainer>
	);
};

export default EmailVerificationPage;