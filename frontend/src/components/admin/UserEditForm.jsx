import { useState, useEffect } from "react";
import { Save, User, Mail, Shield, CheckCircle } from "lucide-react";

import { useUserStore } from "../../stores/useUserStore.js";
import Modal from "../ui/Modal.jsx";
import FormField from "../ui/FormField.jsx";
import { Input, Select } from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

const UserEditForm = ({ user, onClose }) => {
	const { updateUser, loading } = useUserStore();
	
	const [formData, setFormData] = useState({
		name: user.name || "",
		email: user.email || "",
		role: user.role || "customer",
		isVerified: user.isVerified || false
	});
	
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setFormData({
			name: user.name || "",
			email: user.email || "",
			role: user.role || "customer",
			isVerified: user.isVerified || false
		});
	}, [user]);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		if (!["customer", "admin"].includes(formData.role)) {
			newErrors.role = "Please select a valid role";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === "checkbox" ? checked : value
		}));

		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ""
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);
		
		try {
			await updateUser(user._id, formData);
			onClose();
		} catch (error) {
			console.error("Error updating user:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

    return (
        <Modal open={true} onClose={onClose} title={
            <span className="flex items-center gap-2"><User className="h-5 w-5 text-emerald-400" /> Edit User</span>
        }>
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Full Name" error={errors.name}>
                    <Input leftIcon={User} name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter full name" />
                </FormField>

                <FormField label="Email Address" error={errors.email}>
                    <Input leftIcon={Mail} name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email address" />
                </FormField>

                <FormField label="Role" error={errors.role}>
                    <Select leftIcon={Shield} name="role" value={formData.role} onChange={handleInputChange}>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </Select>
                </FormField>

                <div>
                    <label className="flex items-center gap-3">
                        <input type="checkbox" name="isVerified" checked={formData.isVerified} onChange={handleInputChange} className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2" />
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm font-medium text-gray-300">Email Verified</span>
                        </div>
                    </label>
                    <p className="mt-1 text-xs text-gray-400">Check this box if the user's email has been verified</p>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button type="button" variant="secondary" className="flex-1" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" className="flex-1" disabled={isSubmitting || loading}>
                        <Save className="h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default UserEditForm;
