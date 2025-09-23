import { useState, useEffect } from "react";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import { Trash, Edit, Search, Filter, UserPlus } from "lucide-react";
import Table from "../ui/Table.jsx";
import Pagination from "../ui/Pagination.jsx";
import Toolbar from "../ui/Toolbar.jsx";
import Button from "../ui/Button.jsx";
import IconButton from "../ui/IconButton.jsx";
import { Input, Select } from "../ui/Input.jsx";

import { useUserStore } from "../../stores/useUserStore.js";
import { formatDate } from "../../utils/format.js";
import LoadingSpinner from "../LoadingSpinner.jsx";
import UserEditForm from "./UserEditForm.jsx";
import Modal from "../ui/Modal.jsx";
import EmptyState from "../ui/EmptyState.jsx";

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
    const [showCreate, setShowCreate] = useState(false);
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

    const renderRoleBadge = (role) => (
        <Badge color={role === 'admin' ? 'purple' : 'blue'}>{role}</Badge>
    );

    const renderVerificationBadge = (isVerified) => (
        <Badge color={isVerified ? 'green' : 'red'}>{isVerified ? 'Verified' : 'Unverified'}</Badge>
    );

	if (loading && users.length === 0) {
		return <LoadingSpinner />;
	}

	return (
		<div className="max-w-7xl mx-auto">
            <Card className="p-6 mb-6">
                <Toolbar>
                    <div className="relative flex-1 max-w-md">
                        <Input leftIcon={Search} type="text" placeholder="Search users..." value={filters.search} onChange={handleSearch} />
                    </div>
                    <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" /> Create User
                    </Button>
                    <Button variant="secondary" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                    {pagination && (
                        <div className="text-gray-300 text-sm">
                            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, pagination.total)} of {pagination.total} users
                        </div>
                    )}
                </Toolbar>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <Select value={filters.role} onChange={(e) => handleFilterChange("role", e.target.value)}>
                                    <option value="">All Roles</option>
                                    <option value="customer">Customer</option>
                                    <option value="admin">Admin</option>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Verification Status</label>
                                <Select value={filters.isVerified} onChange={(e) => handleFilterChange("isVerified", e.target.value)}>
                                    <option value="">All Users</option>
                                    <option value="true">Verified</option>
                                    <option value="false">Unverified</option>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

			{/* Error Message */}
            {error && (
                <div className="bg-red-600 text-white p-4 rounded-lg mb-6 flex items-center justify-between">
					<span>{error}</span>
                    <IconButton onClick={clearError} className="text-red-200 hover:text-white">×</IconButton>
                </div>
			)}

			{/* Users Table */}
            <Card className="overflow-hidden">
                {users.length === 0 ? (
                    <EmptyState title="No users" description="Users will appear here once created." />
                ) : (
                    <Table
                        columns={[
                        { key: 'user', title: 'User', dataIndex: 'name', render: (_, u) => (
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center">
                                        <span className="text-white font-medium text-sm">{u.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-white">{u.name}</div>
                                    <div className="text-sm text-gray-400">{u.email}</div>
                                </div>
                            </div>
                        ) },
                        { key: 'role', title: 'Role', dataIndex: 'role', render: (v) => renderRoleBadge(v) },
                        { key: 'status', title: 'Status', dataIndex: 'isVerified', render: (v) => renderVerificationBadge(v) },
                        { key: 'lastLogin', title: 'Last Login', dataIndex: 'lastLogin', render: (v) => (<span className="text-sm text-gray-300">{v ? formatDate(v) : 'Never'}</span>) },
                        { key: 'createdAt', title: 'Created', dataIndex: 'createdAt', render: (v) => (<span className="text-sm text-gray-300">{formatDate(v)}</span>) },
                        { key: 'actions', title: 'Actions', dataIndex: 'actions', render: (_, u) => (
                            <div className="flex items-center gap-2">
                                <IconButton onClick={() => handleEditUser(u)} className="text-emerald-400 hover:text-emerald-300" title="Edit user"><Edit className="h-4 w-4" /></IconButton>
                                <IconButton onClick={() => handleDeleteUser(u._id, u.name)} className="text-red-400 hover:text-red-300" title="Delete user"><Trash className="h-4 w-4" /></IconButton>
                            </div>
                        ) }
                        ]}
                        data={users}
                        rowKey="_id"
                    />
                )}

                {pagination && pagination.pages > 1 && (
                    <Pagination page={currentPage} pages={pagination.pages} onChange={setCurrentPage} />
                )}
            </Card>

			{/* Edit User Modal */}
			{editingUser && (
				<UserEditForm
					user={editingUser}
					onClose={handleCloseEdit}
				/>
			)}

            {/* Create User Modal (simple inline) */}
            {showCreate && (
                <Modal open={true} onClose={() => setShowCreate(false)} title="Create User">
                    <CreateUserForm onClose={() => setShowCreate(false)} />
                </Modal>
            )}
		</div>
	);
};

const CreateUserForm = ({ onClose }) => {
    const { createUser, loading } = useUserStore();
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
    const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(form);
            onClose();
        } catch (_) {}
    };
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <label className="block text-sm mb-1 text-gray-300">Name</label>
                <input name="name" className="w-full bg-gray-800 rounded px-3 py-2" value={form.name} onChange={onChange} />
            </div>
            <div>
                <label className="block text-sm mb-1 text-gray-300">Email</label>
                <input type="email" name="email" className="w-full bg-gray-800 rounded px-3 py-2" value={form.email} onChange={onChange} />
            </div>
            <div>
                <label className="block text-sm mb-1 text-gray-300">Password</label>
                <input type="password" name="password" className="w-full bg-gray-800 rounded px-3 py-2" value={form.password} onChange={onChange} />
            </div>
            <div>
                <label className="block text-sm mb-1 text-gray-300">Role</label>
                <select name="role" className="w-full bg-gray-800 rounded px-3 py-2" value={form.role} onChange={onChange}>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="flex gap-2">
                <button type="button" className="px-4 py-2 rounded bg-gray-700" onClick={onClose}>Cancel</button>
                <button disabled={loading} className="px-4 py-2 rounded bg-emerald-600">Create</button>
            </div>
        </form>
    );
};

export default UsersList;
