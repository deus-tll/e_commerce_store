import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Lock} from "lucide-react";

import useFormData from "../../hooks/useFormData.js";
import {validateConfirmPassword, validatePassword} from "../../utils/validators.js";

import {useAuthStore} from "../../stores/useAuthStore.js";

import FormField from "../ui/FormField.jsx";
import {Input} from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";
import SuccessMessage from "../ui/SuccessMessage.jsx";

const getInitialState = () => ({
	password: "",
	confirmPassword: ""
});

const validationRules = {
	password: validatePassword,
	confirmPassword: (val, data) => validateConfirmPassword(val, data.password)
};

const ResetPasswordForm = () => {
	const { formData, errors, handleInputChange, validate } = useFormData(getInitialState());
	const [successMessage, setSuccessMessage] = useState(null);

	const { token } = useParams();

	const { loading, error: resetPasswordApiError, resetPassword, clearError } = useAuthStore();

	useEffect(() => {
		return () => clearError();
	}, [clearError]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		clearError();
		setSuccessMessage(null);

		if (!validate(validationRules)) return;

		const success = await resetPassword({ token, ...formData });
		if (success) {
			setSuccessMessage("Password reset successfully. You can now log in with your new password.");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<SuccessMessage message={successMessage} Icon={Lock} />
			<ErrorMessage message={resetPasswordApiError} />

			{!successMessage && (
				<>
					<FormField label="Password" error={errors.password}>
						<Input leftIcon={Lock} id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" />
					</FormField>

					<FormField label="Confirm Password" error={errors.confirmPassword}>
						<Input leftIcon={Lock} id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" />
					</FormField>

					<Button type="submit" disabled={loading} className="w-full justify-center">
						{loading ? "Resetting..." : "Set New Password"}
					</Button>
				</>
			)}
		</form>
	);
};

export default ResetPasswordForm;