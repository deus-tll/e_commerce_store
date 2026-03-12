import {useEffect} from "react";
import {Link} from "react-router-dom";
import {ShoppingBag, Package, FilterX} from "lucide-react";

import {OrderFilterKeys, useOrderStore} from "../../../stores/useOrderStore.js";

import MyOrdersList from "../../order/MyOrdersList.jsx";
import OrderStatusFilter from "../../order/OrderStatusFilter.jsx";

import LoadingSpinner from "../../ui/LoadingSpinner.jsx";
import ErrorMessage from "../../ui/ErrorMessage.jsx";
import IconButton from "../../ui/IconButton.jsx";
import EmptyState from "../../ui/EmptyState.jsx";
import Button from "../../ui/Button.jsx";

const MyOrdersTab = () => {
	const {
		orders, filters, loading, error: apiError,
		fetchMyOrders, updateFilters, clearFilters, clearError
	} = useOrderStore();

	useEffect(() => {
		void fetchMyOrders();

		return () => clearError();
	}, [fetchMyOrders, clearError]);

	if (loading) return <LoadingSpinner />;
	if (apiError) return <ErrorMessage message={apiError} />;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<h2 className="text-xl font-bold text-white flex items-center gap-2">
					<Package className="text-emerald-500" />
					Order History
				</h2>

				<div className="flex items-end gap-2">
					<OrderStatusFilter
						value={filters.status}
						onChange={(val) => updateFilters(OrderFilterKeys.STATUS, val)}
					/>
					{filters.status && (
						<IconButton variant="danger" onClick={() => clearFilters()} className="mb-[1px]">
							<FilterX className="h-4 w-4" />
						</IconButton>
					)}
				</div>
			</div>

			{orders.length === 0
				? (
					<EmptyState
						title="No orders yet"
						description={filters.status
							? `You don't have any orders with status "${filters.status}".`
							: "You haven't placed any orders yet. Start exploring our amazing products!"}
						icon={ShoppingBag}
						action={
							<Link to="/">
								<Button variant="primary">Start Shopping</Button>
							</Link>
						}
					/>
				)
				: (
					<MyOrdersList orders={orders} />
				)
			}
		</div>
	);
};

export default MyOrdersTab;