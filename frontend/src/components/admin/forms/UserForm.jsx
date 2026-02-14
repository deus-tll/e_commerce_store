import {useEffect} from "react";
import {Save, User, Mail, Shield, CheckCircle, Lock, UserPlus} from "lucide-react";

import useFormData from "../../../hooks/useFormData.js";
import {validateEmail, validatePassword, validateRequired} from "../../../utils/validators.js";
import {getFormDataPayloadForEdit} from "../../../utils/helpers.js";
import {UserRoles} from "../../../constants/app.js";

import {useUserStore} from "../../../stores/useUserStore.js";

import FormField from "../../ui/FormField.jsx";
import {Input, Select} from "../../ui/Input.jsx";
import Button from "../../ui/Button.jsx";
import ErrorMessage from "../../ui/ErrorMessage.jsx";

const getInitialState = (user) => ({
	name: user?.name || "",
	email: user?.email || "",
	role: user?.role || UserRoles.CUSTOMER,
	password: "",
	isVerified: user?.isVerified || false
});

const validationRules = {
	name: (val) => validateRequired(val, "Full name"),
	email: validateEmail,
	password: (val, data) => {
		if (data.isEdit) return null;
		return validatePassword(val);
	}
};

const UserForm = ({ initialData = null, onSuccess }) => {
	const isEdit = !!initialData;

	const {
		formData,
		errors,
		setFormData,
		setFormField,
		handleInputChange,
		validate
	} = useFormData(getInitialState(initialData));

	const { loading, error: userApiError, createUser, updateUser, clearError } = useUserStore();

	useEffect(() => {
		setFormData(getInitialState(initialData));
		clearError();
		return () => clearError();
	}, [initialData, setFormData, clearError]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		clearError();

		if (!validate(validationRules, { isEdit })) return;

		let payload = formData;

		if (isEdit) {
			payload = getFormDataPayloadForEdit(getInitialState(initialData), payload, { exclude: ["password"] });

			if (Object.keys(payload).length === 0) {
				onSuccess?.();
				return;
			}

			if (await updateUser(initialData.id, payload)) {
				onSuccess?.();
			}
		}
		else {
			if (await createUser(payload)) {
				setFormData(getInitialState(null));
				onSuccess?.();
			}
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<ErrorMessage message={userApiError} />

			<FormField label="Full Name" error={errors.name}>
				<Input
					leftIcon={User}
					name="name"
					value={formData.name}
					onChange={handleInputChange}
					placeholder="John Doe"
				/>
			</FormField>

			<FormField label="Email Address" error={errors.email}>
				<Input
					leftIcon={Mail}
					type="email"
					name="email"
					value={formData.email}
					onChange={handleInputChange}
					placeholder="john@example.com"
				/>
			</FormField>

			{!isEdit && (
				<FormField label="Password" error={errors.password}>
					<Input
						leftIcon={Lock}
						type="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
						placeholder="••••••••"
					/>
				</FormField>
			)}

			<FormField label="Role">
				<Select leftIcon={Shield} name="role" value={formData.role} onChange={handleInputChange}>
					<option value="customer">Customer</option>
					<option value="admin">Admin</option>
				</Select>
			</FormField>

			{isEdit && (
				<div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
					<label className="flex items-center gap-3 cursor-pointer">
						<input
							type="checkbox"
							name="isVerified"
							checked={formData.isVerified}
							onChange={(e) => setFormField("isVerified", e.target.checked)}
							className="w-4 h-4 text-emerald-600 bg-gray-900 border-gray-600 rounded focus:ring-emerald-500"
						/>
						<div className="flex items-center gap-2">
							<CheckCircle className={`h-4 w-4 ${formData.isVerified ? 'text-emerald-400' : 'text-gray-500'}`} />
							<span className="text-sm font-medium text-gray-200">Account Verified</span>
						</div>
					</label>
				</div>
			)}

			<div className="flex gap-3 pt-2">
				<Button
					disabled={loading}
					type="submit"
					className="w-full justify-center"
				>
					{isEdit ? <Save className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
					{loading
						? (isEdit ? 'Saving...' : 'Creating...')
						: (isEdit ? 'Save Changes' : 'Create User')
					}
				</Button>
			</div>
		</form>
	);
};

export default UserForm;