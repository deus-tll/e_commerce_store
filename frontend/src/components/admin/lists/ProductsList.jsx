import {Package} from "lucide-react";

import Table from "../../ui/Table.jsx";
import EmptyState from "../../ui/EmptyState.jsx";
import Pagination from "../../ui/Pagination.jsx";

const ProductsList = ({ products, columns, pagination, page, setPage }) => {
	return (
		<>
			{(!products || products.length === 0) ? (
				<EmptyState
					icon={Package}
					title="No products"
					description="Create a product to fill up the list."
				/>
			) : (
				<>
					<Table columns={columns} data={products} rowKey="id" />

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

export default ProductsList;