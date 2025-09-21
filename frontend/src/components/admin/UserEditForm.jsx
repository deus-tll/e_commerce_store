import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, User, Mail, Shield, CheckCircle } from "lucide-react";

import { useUserStore } from "../../stores/useUserStore.js";

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

		// Clear error when user starts typing
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

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={handleBackdropClick}
			>
				<motion.div
					className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
					initial={{ opacity: 0, scale: 0.95, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 20 }}
					transition={{ duration: 0.2 }}
				>
					{/* Header */}
					<div className="flex items-center justify-between p-6 border-b border-gray-700">
						<h2 className="text-xl font-semibold text-white flex items-center gap-2">
							<User className="h-5 w-5 text-emerald-400" />
							Edit User
						</h2>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-white transition-colors"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="p-6 space-y-6">
						{/* Name Field */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Full Name
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									className={`w-full pl-10 pr-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
										errors.name ? "border-red-500" : "border-gray-600"
									}`}
									placeholder="Enter full name"
								/>
							</div>
							{errors.name && (
								<p className="mt-1 text-sm text-red-400">{errors.name}</p>
							)}
						</div>

						{/* Email Field */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									className={`w-full pl-10 pr-4 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
										errors.email ? "border-red-500" : "border-gray-600"
									}`}
									placeholder="Enter email address"
								/>
							</div>
							{errors.email && (
								<p className="mt-1 text-sm text-red-400">{errors.email}</p>
							)}
						</div>

						{/* Role Field */}
						<div>
							<label className="block text-sm font-medium text-gray-300 mb-2">
								Role
							</label>
							<div className="relative">
								<Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<select
									name="role"
									value={formData.role}
									onChange={handleInputChange}
									className={`w-full pl-10 pr-4 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
										errors.role ? "border-red-500" : "border-gray-600"
									}`}
								>
									<option value="customer">Customer</option>
									<option value="admin">Admin</option>
								</select>
							</div>
							{errors.role && (
								<p className="mt-1 text-sm text-red-400">{errors.role}</p>
							)}
						</div>

						{/* Verification Status */}
						<div>
							<label className="flex items-center gap-3">
								<input
									type="checkbox"
									name="isVerified"
									checked={formData.isVerified}
									onChange={handleInputChange}
									className="w-4 h-4 text-emerald-600 bg-gray-700 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2"
								/>
								<div className="flex items-center gap-2">
									<CheckCircle className="h-4 w-4 text-emerald-400" />
									<span className="text-sm font-medium text-gray-300">
										Email Verified
									</span>
								</div>
							</label>
							<p className="mt-1 text-xs text-gray-400">
								Check this box if the user's email has been verified
							</p>
						</div>

						{/* Action Buttons */}
						<div className="flex gap-3 pt-4">
							<button
								type="button"
								onClick={onClose}
								className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
								disabled={isSubmitting}
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting || loading}
								className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
							>
								{isSubmitting || loading ? (
									<>
										<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
										Saving...
									</>
								) : (
									<>
										<Save className="h-4 w-4" />
										Save Changes
									</>
								)}
							</button>
						</div>
					</form>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default UserEditForm;
