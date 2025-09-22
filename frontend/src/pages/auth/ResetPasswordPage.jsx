import {useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import {Lock} from "lucide-react";
import {toast} from "react-hot-toast";

import {useAuthStore} from "../../stores/useAuthStore.js";

import AuthFormContainer from "../../components/auth/AuthFormContainer.jsx";
import FormInput from "../../components/FormInput.jsx";
import SubmitButton from "../../components/SubmitButton.jsx";

const ResetPasswordPage = () => {
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: ""
	});

	const { token } = useParams();
	const navigate = useNavigate();

	const { loading, resetPassword } = useAuthStore();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await resetPassword({ token, ...formData });

			toast.success("Password reset successfully, redirecting...");
		}
		catch (error) {

		}
	}

	return (
		<AuthFormContainer title="Reset Password">
			<form onSubmit={handleSubmit} className="space-y-6">
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

				<SubmitButton loading={loading} text="Set New Password" />
			</form>
		</AuthFormContainer>
	);
};

export default ResetPasswordPage;