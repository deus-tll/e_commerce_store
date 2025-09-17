import {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight } from "lucide-react";

import {useUserStore} from "../../stores/useUserStore.js";

import AuthFormContainer from "../../components/auth/AuthFormContainer.jsx";
import FormInput from "../../components/FormInput.jsx";
import SubmitButton from "../../components/SubmitButton.jsx";

const SignupPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: ""
	});

	const navigate = useNavigate();

	const { loading, signup } = useUserStore();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(formData);
		navigate("/verify-email");
	};

	return (
		<AuthFormContainer title="Create your account">
			<form onSubmit={handleSubmit} className="space-y-6">
				<FormInput
					label="Full name"
					icon={User}
					inputElement="input"
					id="name"
					name="name"
					type="text"
					value={formData.name}
					onChange={handleInputChange}
					placeholder="John Doe"
				/>
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
				<FormInput
					label="Confirm Password"
					icon={Lock}
					inputElement="input"
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					value={formData.confirmPassword}
					onChange={handleInputChange}
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