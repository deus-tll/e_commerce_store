import {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";

import {useAuthStore} from "../../stores/useAuthStore.js";

import Container from "../../components/ui/Container.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import { Input } from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

const SignupPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [errors, setErrors] = useState({});

	const navigate = useNavigate();

	const { loading, signup } = useAuthStore();

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

		if (!validate()) return;

		try {
			await signup(formData);
			navigate("/verify-email");
		}
		catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Signup failed";
			setErrors((prev) => ({ ...prev, form: msg }));
		}
	};

	return (
		<Container size="sm">
			<SectionHeader title="Create your account" />
			<Card className="py-8 px-4 sm:px-10">
				<form onSubmit={handleSubmit} className="space-y-6">
					{errors.form && (
						<div className="bg-red-600 text-white p-3 rounded">{errors.form}</div>
					)}
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
					{(errors.name || errors.email || errors.password || errors.confirmPassword) && (
						<p className="text-sm text-red-400">{errors.name || errors.email || errors.password || errors.confirmPassword}</p>
					)}
					<Button disabled={loading} className="w-full justify-center">
						<UserPlus className="h-4 w-4" />
						Sign up
					</Button>
				</form>
				<p className="mt-8 text-center text-sm text-gray-400">
					Already have an account?{" "}
					<Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
						Login here <ArrowRight className="inline h-4 w-4" />
					</Link>
				</p>
			</Card>
		</Container>
	);
};

export default SignupPage;