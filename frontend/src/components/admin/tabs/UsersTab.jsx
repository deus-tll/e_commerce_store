import {useState, useEffect, useMemo} from "react";
import {Filter, FilterX, UserPlus, Users} from "lucide-react";

import {UserFilterKeys, useUserStore} from "../../../stores/useUserStore.js";
import {UserRoleValues} from "../../../constants/domain.js";

import {createUserColumns} from "../tableColumns.jsx";

import DataList from "../DataList.jsx";
import UserForm from "../forms/UserForm.jsx";

import Modal from "../../ui/Modal.jsx";
import SearchForm from "../../ui/SearchForm.jsx";
import PaginationInfo from "../../ui/PaginationInfo.jsx";
import Card from "../../ui/Card.jsx";
import Toolbar from "../../ui/Toolbar.jsx";
import Button from "../../ui/Button.jsx";
import {Select} from "../../ui/Input.jsx";
import IconButton from "../../ui/IconButton.jsx";

const UsersTab = () => {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [showFilters, setShowFilters] = useState(false);

	const [search, setSearch] = useState("");

	const {
		users, pagination, filters,
		setPage, updateFilter, clearFilters, clearFiltersAndFetch, fetchUsers, deleteUser
	} = useUserStore();

	const hasActiveFilters = Object.values(filters).some(v => v !== "");

	useEffect(() => {
		void fetchUsers();
		return () => void clearFilters();
	}, [fetchUsers, clearFilters]);

	const handleCloseCreate = () => setIsCreateModalOpen(false);
	const handleCloseEdit = () => setEditingUser(null);

	const handleResetAll = () => {
		setSearch("");
		void clearFiltersAndFetch();
	};

	const columns = useMemo(() =>
		createUserColumns({ setEditingUser, deleteUser }),
		[setEditingUser, deleteUser]
	);

	return (
		<div className="max-w-7xl mx-auto">
            <Card className="p-6 mb-6">
                <Toolbar>
	                <SearchForm
		                value={search}
		                onChange={(e) => setSearch(e.target.value)}
		                onSearch={() => updateFilter(UserFilterKeys.SEARCH, search)}
		                placeholder="Search users..."
	                />

	                <div className="flex gap-2">
		                {hasActiveFilters && (
			                <IconButton variant="danger" onClick={handleResetAll}>
				                <FilterX className="h-4 w-4" />
			                </IconButton>
		                )}
		                <Button variant="secondary" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
			                <Filter className="h-4 w-4" /> Filters
		                </Button>
		                <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
			                <UserPlus className="h-4 w-4" /> Create User
		                </Button>
	                </div>

	                <PaginationInfo pagination={pagination} resourceName="users" />
                </Toolbar>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
	                            <Select
		                            value={filters?.role}
		                            onChange={(e) => updateFilter(UserFilterKeys.ROLE, e.target.value)}
	                            >
		                            <option value="">All Roles</option>
		                            {UserRoleValues.map((role) => (
			                            <option key={role} value={role}>
				                            {role.charAt(0).toUpperCase() + role.slice(1)}
			                            </option>
		                            ))}
	                            </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Verification Status</label>
                                <Select
	                                value={filters?.isVerified}
	                                onChange={(e) => updateFilter(UserFilterKeys.IS_VERIFIED, e.target.value)}
                                >
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
			<DataList
				data={users}
				columns={columns}
				pagination={pagination}
				onPageChange={setPage}
				emptyState={{
					icon: Users,
					title: "No users found"
				}}
			/>

			<Modal title="Create User" open={isCreateModalOpen} onClose={handleCloseCreate}>
				{isCreateModalOpen && <UserForm />}
			</Modal>

			<Modal title="Edit User" open={!!editingUser} onClose={handleCloseEdit}>
				{editingUser && <UserForm initialData={editingUser} onSuccess={handleCloseEdit} />}
			</Modal>
		</div>
	);
};

export default UsersTab;