import {useEffect, useMemo} from "react";
import {Link} from "react-router-dom";
import {ShoppingBag, Package, FilterX} from "lucide-react";

import {OrderFilterKeys, OrderStoreScope, useOrderStore} from "../../../stores/useOrderStore.js";

import MyOrdersList from "../../order/MyOrdersList.jsx";
import OrderStatusFilter from "../../order/OrderStatusFilter.jsx";

import LoadingSpinner from "../../ui/LoadingSpinner.jsx";
import ErrorMessage from "../../ui/ErrorMessage.jsx";
import IconButton from "../../ui/IconButton.jsx";
import EmptyState from "../../ui/EmptyState.jsx";
import Button from "../../ui/Button.jsx";

const ORDER_STORE_SCOPE = OrderStoreScope.PROFILE;

const MyOrdersTab = () => {
	const {
		myOrders, myOrdersFilters, myOrdersPagination, loading, error: apiError,
		fetchOrders, setPage, updateFilter, clearFilters, clearFiltersAndFetch, clearError
	} = useOrderStore();

	useEffect(() => {
		void fetchOrders(ORDER_STORE_SCOPE);

		return () => {
			clearError();
			void clearFilters(ORDER_STORE_SCOPE);
		};
	}, [fetchOrders, clearError, clearFilters]);

	const handlePageChange = useMemo(() =>
			(page) => setPage(page, ORDER_STORE_SCOPE),
		[setPage]);

	if (loading) return <LoadingSpinner />;

	return (
		<div className="space-y-6">
			<ErrorMessage message={apiError} />

			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<h2 className="text-xl font-bold text-white flex items-center gap-2">
					<Package className="text-emerald-500" />
					Order History
				</h2>

				<div className="flex items-end gap-2">
					<OrderStatusFilter
						value={myOrdersFilters.status}
						onChange={(val) => updateFilter(OrderFilterKeys.STATUS, val, ORDER_STORE_SCOPE)}
					/>
					{myOrdersFilters.status && (
						<IconButton variant="danger" onClick={() => clearFiltersAndFetch(ORDER_STORE_SCOPE)} className="mb-[1px]">
							<FilterX className="h-4 w-4" />
						</IconButton>
					)}
				</div>
			</div>

			{myOrders.length === 0
				? (
					<EmptyState
						title="No orders yet"
						description={myOrdersFilters.status
							? `You don't have any orders with status "${myOrdersFilters.status}".`
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
					<MyOrdersList
						orders={myOrders}
						pagination={myOrdersPagination}
						onPageChange={handlePageChange}
					/>
				)
			}
		</div>
	);
};

export default MyOrdersTab;