import React, {useState} from 'react';
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";

import AuthFormContainer from "../components/auth/AuthFormContainer.jsx";
import FormInput from "../components/FormInput.jsx";
import SubmitButton from "../components/SubmitButton.jsx";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});

	// for now
	const loading = false;

	const handleSubmit = (e) => {
		e.preventDefault();

	};

	return (
		<AuthFormContainer title="Login to your account">
			<form onSubmit={handleSubmit} className="space-y-6">
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
				<SubmitButton loading={loading} text="Login" icon={LogIn} />
			</form>
			<p className="mt-8 text-center text-sm text-gray-400">
				Don't have an account?{" "}
				<Link to="/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
					Sign up here <ArrowRight className="inline h-4 w-4" />
				</Link>
			</p>
		</AuthFormContainer>
	);
};

export default LoginPage;