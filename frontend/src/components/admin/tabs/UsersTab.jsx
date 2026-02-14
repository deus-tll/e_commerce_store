import {useState, useEffect, useCallback, useMemo} from "react";
import {Filter, UserPlus} from "lucide-react";

import { useUserStore } from "../../../stores/useUserStore.js";

import {createUserColumns} from "../tableColumns.jsx";

import UsersList from "../lists/UsersList.jsx";

import Modal from "../../ui/Modal.jsx";
import SearchForm from "../../ui/SearchForm.jsx";
import PaginationInfo from "../../ui/PaginationInfo.jsx";
import Card from "../../ui/Card.jsx";
import Toolbar from "../../ui/Toolbar.jsx";
import Button from "../../ui/Button.jsx";
import {Select} from "../../ui/Input.jsx";
import UserForm from "../forms/UserForm.jsx";

const UsersTab = () => {
	const [page, setPage] = useState(1);
	const [showCreate, setShowCreate] = useState(false);
	const [editing, setEditing] = useState(null);
	const [showFilters, setShowFilters] = useState(false);

	const [search, setSearch] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [filters, setFilters] = useState({ role: "", isVerified: "" });

	const {
		users,
		pagination,
		fetchUsers,
		deleteUser
	} = useUserStore();

	const handleFetchUsers = useCallback((currentPage, currentSearch, currentFilters) => {
		const cleanFilters = { ...currentFilters };
		if (currentSearch) cleanFilters.search = currentSearch;

		Object.keys(cleanFilters).forEach(key => {
			if (cleanFilters[key] === "") delete cleanFilters[key];
		});

		void fetchUsers({ page: currentPage, filters: cleanFilters });
	}, [fetchUsers]);

	useEffect(() => {
		handleFetchUsers(page, searchTerm, filters);
	}, [page, searchTerm, filters, handleFetchUsers]);

	const handleCloseCreate = () => setShowCreate(false);
	const handleCloseEdit = () => setEditing(null);

	const handleSearch = (e) => {
		e.preventDefault();
		setPage(1);
		setSearchTerm(search);
	};

	const handleFilterChange = (key, value) => {
		setPage(1);
		setFilters(prev => ({ ...prev, [key]: value }));
	};

	const columns = useMemo(() =>
			createUserColumns({ startEdit: setEditing, deleteUser }),
		[deleteUser]
	);

	return (
		<div className="max-w-7xl mx-auto">
            <Card className="p-6 mb-6">
                <Toolbar>
	                <SearchForm
		                value={search}
		                onChange={(e) => setSearch(e.target.value)}
		                onSubmit={handleSearch}
		                placeholder="Search users..."
	                />

	                <div className="flex gap-2">
		                <Button variant="secondary" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
			                <Filter className="h-4 w-4" /> Filters
		                </Button>
		                <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2">
			                <UserPlus className="h-4 w-4" /> Create User
		                </Button>
	                </div>

	                <PaginationInfo pagination={pagination} page={page} resourceName="users" />
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

			{/* Users Table */}
            <Card className="overflow-hidden">
	            <UsersList
		            users={users}
		            columns={columns}
		            pagination={pagination}
		            page={page}
		            setPage={setPage}
	            />
            </Card>

			<Modal title="Create User" open={showCreate} onClose={handleCloseCreate}>
				{showCreate && <UserForm />}
			</Modal>

			<Modal title="Edit User" open={!!editing} onClose={handleCloseEdit}>
				{editing && <UserForm initialData={editing} onSuccess={handleCloseEdit} />}
			</Modal>
		</div>
	);
};

export default UsersTab;