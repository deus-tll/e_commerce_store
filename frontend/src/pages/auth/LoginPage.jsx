import {useState} from 'react';
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";

import {useAuthStore} from "../../stores/useAuthStore.js";

import Container from "../../components/ui/Container.jsx";
import Card from "../../components/ui/Card.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import FormField from "../../components/ui/FormField.jsx";
import { Input } from "../../components/ui/Input.jsx";
import Button from "../../components/ui/Button.jsx";

const LoginPage = () => {
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
		if (!validate()) return;
		try {
			await login(formData);
		} catch (err) {
			const msg = err?.response?.data?.message || err?.message || "Login failed";
			setErrors((prev) => ({ ...prev, form: msg }));
		}
	};

	return (
		<Container size="sm">
			<SectionHeader title="Login to your account" />
			<Card className="py-8 px-4 sm:px-10">
				<form onSubmit={handleSubmit} className="space-y-6">
					{errors.form && (
						<div className="bg-red-600 text-white p-3 rounded">{errors.form}</div>
					)}
					<FormField label="Email address" error={errors.email}>
						<Input leftIcon={Mail} id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" />
					</FormField>
					<FormField label="Password" error={errors.password}>
						<Input leftIcon={Lock} id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
					</FormField>
					{(errors.email || errors.password) && (
						<p className="text-sm text-red-400">{errors.email || errors.password}</p>
					)}

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
				<p className="mt-8 text-center text-sm text-gray-400">
					Don't have an account?{" "}
					<Link to="/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
						Sign up here <ArrowRight className="inline h-4 w-4" />
					</Link>
				</p>
			</Card>
		</Container>
	);
};

export default LoginPage;