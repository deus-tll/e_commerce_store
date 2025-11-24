import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {UserPlus, Mail, Lock, User} from "lucide-react";

import {useAuthStore} from "../../stores/useAuthStore.js";
import {getErrorMessage} from "../../utils/errorParser.js";

import FormField from "../ui/FormField.jsx";
import {Input} from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const SignupForm = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [errors, setErrors] = useState({});

	const { loading, signup } = useAuthStore();

	const navigate = useNavigate();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	const validate = () => {
		const next = {};
		if (!formData.name.trim()) next.name = "Name is required";
		if (!formData.email.trim()) next.email = "Email is required";
		if (!formData.password.trim()) next.password = "Password is required";
		if (formData.password !== formData.confirmPassword) next.confirmPassword = "Passwords don't match";
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});

		if (!validate()) return;

		try {
			await signup(formData);
			navigate("/verify-email");
		}
		catch (err) {
			const msg = getErrorMessage(err, "Signup failed. Please try again.");
			setErrors((prev) => ({ ...prev, form: msg }));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<ErrorMessage message={errors.form} />

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

			<Button disabled={loading} className="w-full justify-center">
				<UserPlus className="h-4 w-4" />
				Sign up
			</Button>
		</form>
	);
};

export default SignupForm;