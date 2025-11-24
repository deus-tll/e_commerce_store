import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, LogOut } from 'lucide-react';

import { useAuthStore } from "../../stores/useAuthStore.js";
import { getErrorMessage } from "../../utils/errorParser.js";

import Button from "../ui/Button.jsx";
import FormField from "../ui/FormField.jsx";
import { Input } from "../ui/Input.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const ChangePasswordForm = () => {
	const [formData, setFormData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: ""
	});
	const [errors, setErrors] = useState({});

	const { loading, changePassword } = useAuthStore();

	const navigate = useNavigate();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setErrors({});
	}

	const validate = () => {
		const next = {};
		if (!formData.currentPassword.trim()) next.currentPassword = "Current password is required";
		if (!formData.newPassword.trim()) next.newPassword = "New password is required";
		if (formData.newPassword !== formData.confirmPassword) next.confirmPassword = "New passwords don't match";
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrors({});

		if (!validate()) return;

		try {
			await changePassword(formData);

			toast.success("Password changed successfully! Please log in with your new password.");

			setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });

			navigate('/login');
		}
		catch (err) {
			const msg = getErrorMessage(err, "Password change failed.");
			setErrors((prev) => ({ ...prev, form: msg }));
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 pt-4">
			<h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Change Password</h3>

			<ErrorMessage message={errors.form} />

			<FormField label="Current Password" error={errors.currentPassword}>
				<Input leftIcon={Lock} id="currentPassword" name="currentPassword" type="password" value={formData.currentPassword} onChange={handleInputChange} placeholder="••••••••" />
			</FormField>

			<FormField label="New Password" error={errors.newPassword}>
				<Input leftIcon={Lock} id="newPassword" name="newPassword" type="password" value={formData.newPassword} onChange={handleInputChange} placeholder="••••••••" />
			</FormField>

			<FormField label="Confirm New Password" error={errors.confirmPassword}>
				<Input leftIcon={Lock} id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" />
			</FormField>

			<Button disabled={loading} className="w-full justify-center">
				<LogOut className="h-4 w-4" />
				Change & Log Out
			</Button>
		</form>
	);
}

export default ChangePasswordForm;