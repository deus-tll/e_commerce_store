import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash, Edit, Search, Filter, ChevronLeft, ChevronRight, UserCheck, UserX } from "lucide-react";

import { useUserStore } from "../../stores/useUserStore.js";
import LoadingSpinner from "../LoadingSpinner.jsx";
import UserEditForm from "./UserEditForm.jsx";

const UsersList = () => {
	const { 
		users, 
		pagination, 
		loading, 
		error, 
		fetchUsers, 
		deleteUser,
		clearError 
	} = useUserStore();

	const [currentPage, setCurrentPage] = useState(1);
	const [filters, setFilters] = useState({
		search: "",
		role: "",
		isVerified: ""
	});
	const [editingUser, setEditingUser] = useState(null);
	const [showFilters, setShowFilters] = useState(false);

	const limit = 10;

	useEffect(() => {
		// Clean filters - don't send empty strings for isVerified
		const cleanFilters = { ...filters };
		if (cleanFilters.isVerified === "") {
			delete cleanFilters.isVerified;
		}
		if (cleanFilters.role === "") {
			delete cleanFilters.role;
		}
		if (cleanFilters.search === "") {
			delete cleanFilters.search;
		}
		
		fetchUsers(currentPage, limit, cleanFilters);
	}, [currentPage, filters, fetchUsers]);

	const handleSearch = (e) => {
		const value = e.target.value;
		setFilters(prev => ({ ...prev, search: value }));
		setCurrentPage(1);
	};

	const handleFilterChange = (key, value) => {
		setFilters(prev => ({ ...prev, [key]: value }));
		setCurrentPage(1);
	};

	const handleDeleteUser = async (userId, userName) => {
		if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
			try {
				await deleteUser(userId);
			} catch (error) {
				console.error("Error deleting user:", error);
			}
		}
	};

	const handleEditUser = (user) => {
		setEditingUser(user);
	};

	const handleCloseEdit = () => {
		setEditingUser(null);
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString();
	};

	const getRoleBadge = (role) => {
		const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
		return role === "admin" 
			? `${baseClasses} bg-purple-600 text-white`
			: `${baseClasses} bg-blue-600 text-white`;
	};

	const getVerificationBadge = (isVerified) => {
		const baseClasses = "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1";
		return isVerified
			? `${baseClasses} bg-green-600 text-white`
			: `${baseClasses} bg-red-600 text-white`;
	};

	const thClasses = "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider";

	if (loading && users.length === 0) {
		return <LoadingSpinner />;
	}

	return (
		<div className="max-w-7xl mx-auto">
			{/* Header with Search and Filters */}
			<motion.div
				className="bg-gray-800 rounded-lg p-6 mb-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
					<div className="flex flex-col sm:flex-row gap-4 flex-1">
						{/* Search */}
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<input
								type="text"
								placeholder="Search users..."
								value={filters.search}
								onChange={handleSearch}
								className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
							/>
						</div>

						{/* Filter Toggle */}
						<button
							onClick={() => setShowFilters(!showFilters)}
							className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
						>
							<Filter className="h-4 w-4" />
							Filters
						</button>
					</div>

					{/* Results Count */}
					{pagination && (
						<div className="text-gray-300 text-sm">
							Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} users
						</div>
					)}
				</div>

				{/* Filters */}
				{showFilters && (
					<motion.div
						className="mt-4 pt-4 border-t border-gray-700"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
					>
						<div className="flex flex-col sm:flex-row gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
								<select
									value={filters.role}
									onChange={(e) => handleFilterChange("role", e.target.value)}
									className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
								>
									<option value="">All Roles</option>
									<option value="customer">Customer</option>
									<option value="admin">Admin</option>
								</select>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-300 mb-2">Verification Status</label>
								<select
									value={filters.isVerified}
									onChange={(e) => handleFilterChange("isVerified", e.target.value)}
									className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
								>
									<option value="">All Users</option>
									<option value="true">Verified</option>
									<option value="false">Unverified</option>
								</select>
							</div>
						</div>
					</motion.div>
				)}
			</motion.div>

			{/* Error Message */}
			{error && (
				<motion.div
					className="bg-red-600 text-white p-4 rounded-lg mb-6 flex items-center justify-between"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
				>
					<span>{error}</span>
					<button
						onClick={clearError}
						className="text-red-200 hover:text-white"
					>
						×
					</button>
				</motion.div>
			)}

			{/* Users Table */}
			<motion.div
				className="bg-gray-800 shadow-lg rounded-lg overflow-hidden"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-700">
						<thead className="bg-gray-700">
							<tr>
								<th className={thClasses}>
									User
								</th>
								<th className={thClasses}>
									Role
								</th>
								<th className={thClasses}>
									Status
								</th>
								<th className={thClasses}>
									Last Login
								</th>
								<th className={thClasses}>
									Created
								</th>
								<th className={thClasses}>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-gray-800 divide-y divide-gray-700">
							{users.map((user) => (
								<tr key={user._id} className="hover:bg-gray-700 transition-colors">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="flex-shrink-0 h-10 w-10">
												<div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center">
													<span className="text-white font-medium text-sm">
														{user.name.charAt(0).toUpperCase()}
													</span>
												</div>
											</div>
											<div className="ml-4">
												<div className="text-sm font-medium text-white">
													{user.name}
												</div>
												<div className="text-sm text-gray-400">
													{user.email}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={getRoleBadge(user.role)}>
											{user.role}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={getVerificationBadge(user.isVerified)}>
											{user.isVerified ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
											{user.isVerified ? "Verified" : "Unverified"}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
										{user.lastLogin ? formatDate(user.lastLogin) : "Never"}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
										{formatDate(user.createdAt)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
										<div className="flex items-center gap-2">
											<button
												onClick={() => handleEditUser(user)}
												className="text-emerald-400 hover:text-emerald-300 transition-colors"
												title="Edit user"
											>
												<Edit className="h-4 w-4" />
											</button>
											<button
												onClick={() => handleDeleteUser(user._id, user.name)}
												className="text-red-400 hover:text-red-300 transition-colors"
												title="Delete user"
											>
												<Trash className="h-4 w-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				{pagination && pagination.pages > 1 && (
					<div className="bg-gray-700 px-6 py-3 flex items-center justify-between">
						<div className="flex items-center">
							<p className="text-sm text-gray-300">
								Page {currentPage} of {pagination.pages}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<button
								onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
								disabled={currentPage === 1}
								className="p-2 rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								<ChevronLeft className="h-4 w-4" />
							</button>
							
							{/* Page Numbers */}
							{Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
								const pageNum = Math.max(1, Math.min(pagination.pages - 4, currentPage - 2)) + i;
								if (pageNum > pagination.pages) return null;
								
								return (
									<button
										key={pageNum}
										onClick={() => setCurrentPage(pageNum)}
										className={`px-3 py-1 rounded-lg text-sm transition-colors ${
											currentPage === pageNum
												? "bg-emerald-600 text-white"
												: "bg-gray-600 text-gray-300 hover:bg-gray-500"
										}`}
									>
										{pageNum}
									</button>
								);
							})}

							<button
								onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
								disabled={currentPage === pagination.pages}
								className="p-2 rounded-lg bg-gray-600 text-gray-300 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							>
								<ChevronRight className="h-4 w-4" />
							</button>
						</div>
					</div>
				)}
			</motion.div>

			{/* Edit User Modal */}
			{editingUser && (
				<UserEditForm
					user={editingUser}
					onClose={handleCloseEdit}
				/>
			)}
		</div>
	);
};

export default UsersList;
