import {useState} from 'react';
import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";

import {useUserStore} from "../../stores/useUserStore.js";

import AuthFormContainer from "../../components/auth/AuthFormContainer.jsx";
import FormInput from "../../components/FormInput.jsx";
import SubmitButton from "../../components/SubmitButton.jsx";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});

	const { loading, login } = useUserStore();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(formData);
	};

	return (
		<AuthFormContainer title="Login to your account">
			<form onSubmit={handleSubmit} className="space-y-6">
				<FormInput
					label="Email address"
					icon={Mail}
					inputElement="input"
					id="email"
					name="email"
					type="email"
					value={formData.email}
					onChange={handleInputChange}
					placeholder="you@example.com"
				/>
				<FormInput
					label="Password"
					icon={Lock}
					inputElement="input"
					id="password"
					name="password"
					type="password"
					value={formData.password}
					onChange={handleInputChange}
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