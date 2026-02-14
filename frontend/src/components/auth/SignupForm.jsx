import {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {UserPlus, Mail, Lock, User} from "lucide-react";

import useFormData from "../../hooks/useFormData.js";
import {validateConfirmPassword, validateEmail, validatePassword, validateRequired} from "../../utils/validators.js";

import {useAuthStore} from "../../stores/useAuthStore.js";

import FormField from "../ui/FormField.jsx";
import {Input} from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const getInitialState = () => ({
	name: "",
	email: "",
	password: "",
	confirmPassword: ""
});

const validationRules = {
	name: (val) => validateRequired(val, "Name"),
	email: validateEmail,
	password: validatePassword,
	confirmPassword: (val, data) => validateConfirmPassword(val, data.password)
};

const SignupForm = () => {
	const { formData, errors, handleInputChange, validate } = useFormData(getInitialState());

	const { loading, error: signupApiError, signup, clearError } = useAuthStore();

	const navigate = useNavigate();

	useEffect(() => {
		return () => clearError();
	}, [clearError]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		clearError();

		if (!validate(validationRules)) return;

		const success = await signup(formData);
		if (success) {
			navigate("/verify-email");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<ErrorMessage message={signupApiError} />

			<FormField label="Full name" error={errors.name}>
				<Input leftIcon={User} id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
			</FormField>
			<FormField label="Email address" error={errors.email}>
				<Input leftIcon={Mail} id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" />
			</FormField>
			<FormField label="Password" error={errors.password}>
				<Input leftIcon={Lock} id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
			</FormField>
			<FormField label="Confirm Password" error={errors.confirmPassword}>
				<Input leftIcon={Lock} id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" />
			</FormField>

			<Button type="submit" disabled={loading} className="w-full justify-center">
				<UserPlus className="h-4 w-4" />
				{loading ? "Creating account..." : "Sign up"}
			</Button>
		</form>
	);
};

export default SignupForm;