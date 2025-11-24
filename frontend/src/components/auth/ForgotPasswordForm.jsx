import React, {useState} from 'react';
import {Mail} from "lucide-react";

import {useAuthStore} from "../../stores/useAuthStore.js";
import {getErrorMessage} from "../../utils/errorParser.js";

import FormField from "../ui/FormField.jsx";
import {Input} from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const ForgotPasswordForm = ({ onSubmissionSuccess }) => {
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");

	const { loading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!email.trim()) {
			setError("Email address is required.");
			return;
		}

		try {
			await forgotPassword(email);
			onSubmissionSuccess(email);
		}
		catch (err) {
			const msg = getErrorMessage(err, "Could not send reset link. Please try again.");
			setError(msg);
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<ErrorMessage message={error} />

			<p className='text-center text-gray-300 mb-6'>
				Enter your email address and we'll send you a link to reset your password.
			</p>

			<FormField label="Email address" error={error}>
				<Input leftIcon={Mail} id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
			</FormField>

			<Button disabled={loading} className="w-full justify-center">Send Reset Link</Button>
		</form>
	);
};

export default ForgotPasswordForm;