import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {Mail, Lock, LogIn} from "lucide-react";

import {useAuthStore} from "../../stores/useAuthStore.js";
import {getErrorMessage} from "../../utils/errorParser.js";

import FormField from "../ui/FormField.jsx";
import {Input} from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const LoginForm = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});
	const [errors, setErrors] = useState({});

	const { loading, login } = useAuthStore();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	const validate = () => {
		const next = {};
		if (!formData.email.trim()) next.email = "Email is required";
		if (!formData.password.trim()) next.password = "Password is required";
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});

		if (!validate()) return;

		try {
			await login(formData);
		} catch (err) {
			const msg = getErrorMessage(err, "Login failed. Please check your credentials.");
			setErrors((prev) => ({ ...prev, form: msg }));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<ErrorMessage message={errors.form} />

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

			<Button disabled={loading} className="w-full justify-center">
				<LogIn className="h-4 w-4" />
				Login
			</Button>
		</form>
	);
};

export default LoginForm;