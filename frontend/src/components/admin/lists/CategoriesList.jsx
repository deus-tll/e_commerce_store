import {Layers} from "lucide-react";

import Table from "../../ui/Table.jsx";
import EmptyState from "../../ui/EmptyState.jsx";
import Pagination from "../../ui/Pagination.jsx";

const CategoriesList = ({ categories, columns, pagination, page, setPage }) => {
	return (
		<>
			{(!categories || categories.length === 0) ? (
				<EmptyState
					icon={Layers}
					title="No categories"
					description="Create a category to organize your products."
				/>
			) : (
				<>
					<Table columns={columns} data={categories} rowKey="id"/>

					{pagination && pagination.pages > 1 && (
						<div className="p-4">
							<Pagination page={page} pages={pagination.pages} onChange={setPage} />
						</div>
					)}
				</>
			)}
		</>
	);
};

export default CategoriesList;