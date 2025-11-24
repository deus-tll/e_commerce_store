import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {Lock} from "lucide-react";

import {useAuthStore} from "../../stores/useAuthStore.js";
import {getErrorMessage} from "../../utils/errorParser.js";

import FormField from "../ui/FormField.jsx";
import {Input} from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";
import SuccessMessage from "../ui/SuccessMessage.jsx";

const ResetPasswordForm = () => {
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: ""
	});
	const [successMessage, setSuccessMessage] = useState(null);
	const [errors, setErrors] = useState({});

	const { token } = useParams();

	const { loading, resetPassword } = useAuthStore();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	const validate = () => {
		const next = {};
		if (!formData.password.trim()) next.password = "Password is required";
		if (formData.password !== formData.confirmPassword) next.confirmPassword = "Passwords don't match";
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		setErrors({});
		setSuccessMessage(null);

		if (!validate()) return;

		try {
			await resetPassword({ token, ...formData });
			setSuccessMessage("Password reset successfully");
		}
		catch (err) {
			const msg = getErrorMessage(err, "Password reset failed. Please check the link or try again.");
			setErrors((prev) => ({ ...prev, form: msg }));
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<SuccessMessage message={successMessage} Icon={Lock} />

			<ErrorMessage message={errors.form} />

			{!successMessage && (
				<>
					<FormField label="Password" error={errors.password}>
						<Input leftIcon={Lock} id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
					</FormField>
					<FormField label="Confirm Password" error={errors.confirmPassword}>
						<Input leftIcon={Lock} id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" />
					</FormField>
				</>
			)}

			{!successMessage && (
				<Button disabled={loading} className="w-full justify-center">Set New Password</Button>
			)}
		</form>
	);
};

export default ResetPasswordForm;