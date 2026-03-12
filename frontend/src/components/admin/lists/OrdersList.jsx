import {Boxes} from "lucide-react";

import Table from "../../ui/Table.jsx";
import EmptyState from "../../ui/EmptyState.jsx";
import Pagination from "../../ui/Pagination.jsx";
import Card from "../../ui/Card.jsx";

const OrdersList = ({ orders, columns, pagination, setPage }) => {
	return (
		<Card className="overflow-hidden">
			{(!orders || orders.length === 0) ? (
				<EmptyState
					icon={Boxes}
					title="No orders"
					description="Orders will show up when customers buy something."
				/>
			) : (
				<>
					<Table columns={columns} data={orders} rowKey="id"/>

					{pagination && pagination.pages > 1 && (
						<div className="p-4">
							<Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
						</div>
					)}
				</>
			)}
		</Card>
	);
};

export default OrdersList;