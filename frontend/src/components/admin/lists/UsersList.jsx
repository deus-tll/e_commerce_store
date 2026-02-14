import {Users} from "lucide-react";

import Table from "../../ui/Table.jsx";
import EmptyState from "../../ui/EmptyState.jsx";
import Pagination from "../../ui/Pagination.jsx";

const UsersList = ({ users, columns, pagination, page, setPage }) => {
	return (
		<>
			{(!users || users.length === 0) ? (
				<EmptyState
					icon={Users}
					title="No users found"
					description="Try adjusting your filters or search."
				/>
			) : (
				<>
					<Table columns={columns} data={users} rowKey="id" />
					{pagination && pagination.pages > 1 && (
						<div className="p-4 border-t border-gray-700">
							<Pagination page={page} pages={pagination.pages} onChange={setPage} />
						</div>
					)}
				</>
			)}
		</>
	);
};

export default UsersList;