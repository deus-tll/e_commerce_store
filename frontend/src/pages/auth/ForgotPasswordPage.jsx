import {useState} from 'react';
import {Link} from "react-router-dom";
import {ArrowLeft, Mail} from "lucide-react";
import { motion } from 'framer-motion';

import {useAuthStore} from "../../stores/useAuthStore.js";

import AuthFormContainer from "../../components/auth/AuthFormContainer.jsx";
import FormInput from "../../components/FormInput.jsx";
import SubmitButton from "../../components/SubmitButton.jsx";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { loading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await forgotPassword(email);
			setIsSubmitted(true);
		}
		catch (error) {

		}
	}

	return (
		<AuthFormContainer title="Forgot Password">
			{!isSubmitted ? (
				<form onSubmit={handleSubmit} className="space-y-6">
					<p className='text-center text-gray-300 mb-6'>
						Enter your email address and we'll send you a link to reset your password.
					</p>

					<FormInput
						icon={Mail}
						inputElement="input"
						id="email"
						name="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@example.com"
					/>

					<SubmitButton loading={loading} text="Send Reset Link" />
				</form>
			) : (
				<div className='text-center'>
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ type: "spring", stiffness: 500, damping: 30 }}
						className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'
					>
						<Mail className='h-8 w-8 text-white' />
					</motion.div>
					<p className='text-gray-300 mb-6'>
						If an account exists for
						{<span className="text-lime-500 font-semibold"> {email}</span>}
						, you will receive a password reset link shortly.
					</p>
				</div>
			)}

			<p className="mt-8 text-center text-sm text-gray-400">
				<Link to="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
					<ArrowLeft className="inline h-4 w-4" /> Back to Login
				</Link>
			</p>
		</AuthFormContainer>
	);
};

export default ForgotPasswordPage;