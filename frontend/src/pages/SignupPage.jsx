import React, {useState} from 'react';
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";

import {useUserStore} from "../stores/useUserStore.js";

import AuthFormContainer from "../components/auth/AuthFormContainer.jsx";
import FormInput from "../components/FormInput.jsx";
import SubmitButton from "../components/SubmitButton.jsx";

const SignupPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: ""
	});

	const { loading, signup } = useUserStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(formData);
	};

	return (
		<AuthFormContainer title="Create your account">
			<form onSubmit={handleSubmit} className="space-y-6">
				<FormInput
					label="Full name"
					icon={User}
					id="name"
					type="text"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					placeholder="John Doe"
				/>
				<FormInput
					label="Email address"
					icon={Mail}
					id="email"
					type="email"
					value={formData.email}
					onChange={(e) => setFormData({ ...formData, email: e.target.value })}
					placeholder="you@example.com"
				/>
				<FormInput
					label="Password"
					icon={Lock}
					id="password"
					type="password"
					value={formData.password}
					onChange={(e) => setFormData({ ...formData, password: e.target.value })}
					placeholder="••••••••"
				/>
				<FormInput
					label="Confirm Password"
					icon={Lock}
					id="confirmPassword"
					type="password"
					value={formData.confirmPassword}
					onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
					placeholder="••••••••"
				/>
				<SubmitButton loading={loading} text="Sign up" icon={UserPlus} />
			</form>
			<p className="mt-8 text-center text-sm text-gray-400">
				Already have an account?{" "}
				<Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
					Login here <ArrowRight className="inline h-4 w-4" />
				</Link>
			</p>
		</AuthFormContainer>
	);
};

export default SignupPage;