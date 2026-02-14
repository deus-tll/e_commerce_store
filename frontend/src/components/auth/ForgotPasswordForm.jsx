import {useEffect} from 'react';
import {Mail} from "lucide-react";

import useFormData from "../../hooks/useFormData.js";
import {validateEmail} from "../../utils/validators.js";

import {useAuthStore} from "../../stores/useAuthStore.js";

import FormField from "../ui/FormField.jsx";
import {Input} from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const getInitialState = () => ({
	email: ""
});

const validationRules = {
	email: validateEmail
};

const ForgotPasswordForm = ({ onSubmissionSuccess }) => {
	const { formData, errors, handleInputChange, validate } = useFormData(getInitialState());

	const { loading, error: forgotPasswordApiError, forgotPassword, clearError } = useAuthStore();

	useEffect(() => {
		return () => clearError();
	}, [clearError]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		clearError();

		if (!validate(validationRules)) return;

		const success = await forgotPassword(formData.email);
		if (success) {
			onSubmissionSuccess(formData.email);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<ErrorMessage message={forgotPasswordApiError} />

			<p className='text-center text-gray-300 mb-6'>
				Enter your email address and we'll send you a link to reset your password.
			</p>

			<FormField label="Email address" error={errors.email}>
				<Input leftIcon={Mail} id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" />
			</FormField>

			<Button type="submit" disabled={loading} className="w-full justify-center">
				{loading ? "Sending..." : "Send Reset Link"}
			</Button>
		</form>
	);
};

export default ForgotPasswordForm;