import {useEffect} from 'react';
import {Link} from "react-router-dom";
import {Mail, Lock, LogIn} from "lucide-react";

import useFormData from "../../hooks/useFormData.js";
import {validateEmail, validateRequired} from "../../utils/validators.js";

import {useAuthStore} from "../../stores/useAuthStore.js";

import FormField from "../ui/FormField.jsx";
import {Input} from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const getInitialState = () => ({
	email: "",
	password: ""
});

const validationRules = {
	email: validateEmail,
	password: (val) => validateRequired(val, "Password")
};

const LoginForm = () => {
	const { formData, errors, handleInputChange, validate } = useFormData(getInitialState());

	const { loading, error: loginApiError, login, clearError } = useAuthStore();

	useEffect(() => {
		return () => clearError();
	}, [clearError]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		clearError();

		if (!validate(validationRules)) return;

		await login(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<ErrorMessage message={loginApiError} />

			<FormField label="Email address" error={errors.email}>
				<Input leftIcon={Mail} id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" />
			</FormField>
			<FormField label="Password" error={errors.password}>
				<Input leftIcon={Lock} id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
			</FormField>

			<div className='flex items-center mb-6'>
				<Link to='/forgot-password' className='text-sm text-emerald-400 hover:text-emerald-300 hover:underline'>
					Forgot password?
				</Link>
			</div>

			<Button type="submit" disabled={loading} className="w-full justify-center">
				<LogIn className="h-4 w-4" />
				{loading ? "Logging in..." : "Login"}
			</Button>
		</form>
	);
};

export default LoginForm;