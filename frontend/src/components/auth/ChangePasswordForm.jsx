import {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {Lock, LogOut} from 'lucide-react';

import useFormData from "../../hooks/useFormData.js";
import {validateConfirmPassword, validatePassword, validateRequired} from "../../utils/validators.js";

import {useAuthStore} from "../../stores/useAuthStore.js";

import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";
import {Input} from "../ui/Input.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const getInitialState = () => ({
	currentPassword: "",
	newPassword: "",
	confirmPassword: ""
});

const validationRules = {
	currentPassword: (val) => validateRequired(val, "Current password"),
	newPassword: validatePassword,
	confirmPassword: (val, data) => validateConfirmPassword(val, data.newPassword, "New passwords")
};

const ChangePasswordForm = () => {
	const { formData, errors, handleInputChange, setFormData, validate } = useFormData(getInitialState());

	const { loading, error: changePasswordApiError, changePassword, clearError } = useAuthStore();

	const navigate = useNavigate();

	useEffect(() => {
		return () => clearError();
	}, [clearError]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		clearError();

		if (!validate(validationRules)) return;

		const success = await changePassword(formData);
		if (success) {
			toast.success("Password changed successfully! Please log in with your new password.");
			setFormData(getInitialState());
			navigate('/login');
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 pt-4">
			<h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
				Change Password
			</h3>

			<ErrorMessage message={changePasswordApiError} />

			<FormField label="Current Password" error={errors.currentPassword}>
				<Input leftIcon={Lock} id="currentPassword" name="currentPassword" type="password" value={formData.currentPassword} onChange={handleInputChange} placeholder="••••••••" />
			</FormField>

			<FormField label="New Password" error={errors.newPassword}>
				<Input leftIcon={Lock} id="newPassword" name="newPassword" type="password" value={formData.newPassword} onChange={handleInputChange} placeholder="••••••••" />
			</FormField>

			<FormField label="Confirm New Password" error={errors.confirmPassword}>
				<Input leftIcon={Lock} id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" />
			</FormField>

			<Button type="submit" disabled={loading} className="w-full justify-center">
				<LogOut className="h-4 w-4" />
				{loading ? "Updating..." : "Change & Log Out"}
			</Button>
		</form>
	);
}

export default ChangePasswordForm;