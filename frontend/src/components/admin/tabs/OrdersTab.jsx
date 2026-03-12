import {useEffect, useMemo, useState} from "react";
import {Filter, FilterX, Delete} from "lucide-react";

import {useOrderStore, OrderFilterKeys} from "../../../stores/useOrderStore.js";
import {createOrderColumns} from "../tableColumns.jsx";

import OrdersList from "../lists/OrdersList.jsx";
import OrderStatusFilter from "../../order/OrderStatusFilter.jsx";

import Card from "../../ui/Card.jsx";
import Toolbar from "../../ui/Toolbar.jsx";
import PaginationInfo from "../../ui/PaginationInfo.jsx";
import {Select} from "../../ui/Input.jsx";
import SearchForm from "../../ui/SearchForm.jsx";
import IconButton from "../../ui/IconButton.jsx";
import ErrorMessage from "../../ui/ErrorMessage.jsx";

const SEARCH_BY_VALUES = {
	ORDER_NUMBER: {
		value: "orderNumber",
		content: "Order Number"
	},
	PAYMENT_ID: {
		value: "paymentId",
		content: "Payment ID"
	}
};

const OrdersTab = () => {
	const [searchBy, setSearchBy] = useState(SEARCH_BY_VALUES.ORDER_NUMBER.value);
	const [search, setSearch] = useState("");
	const [showFilters, setShowFilters] = useState(false);

	const {
		orders, currentOrder, pagination, filters, loading, error: apiError,
		setPage, updateFilters, clearCurrentOrder, clearFilters, clearError, fetchOrders,
		fetchOrderByNumber, fetchOrderByPaymentSessionId, updateOrderStatus
	} = useOrderStore();

	const hasActiveFilters = Object.values(filters).some(v => v !== "");

	useEffect(() => {
		clearError();
		void fetchOrders();

		return () => clearError();
	}, [fetchOrders, clearError]);

	const handleSearch = async (e) => {
		e.preventDefault();

		if (!search) return;

		switch (searchBy) {
			case SEARCH_BY_VALUES.ORDER_NUMBER.value:
				await fetchOrderByNumber(search);
				break;
			case SEARCH_BY_VALUES.PAYMENT_ID.value:
				await fetchOrderByPaymentSessionId(search);
				break;
			default:
				console.warn(`Unknown SearchBy value: ${searchBy}`);
				break;
		}
	};

	const handleSearchReset = () => {
		clearCurrentOrder();
		clearError();
	}

	const columns = useMemo(() =>
		createOrderColumns({ loading, updateOrderStatus }),
		[loading, updateOrderStatus]
	);

	return (
		<div className="max-w-7xl mx-auto">
			<ErrorMessage message={apiError} className="mb-6" />

			<Card className="p-6 mb-6">
				<Toolbar>
					<div className="flex gap-2 items-center">
						<Select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
							{Object.values(SEARCH_BY_VALUES).map(option => (
								<option key={option.value} value={option.value}>{option.content}</option>
							))}
						</Select>

						<SearchForm
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onSubmit={handleSearch}
							placeholder="Search order..."
						/>

						{currentOrder && (
							<IconButton variant="danger" onClick={handleSearchReset}>
								<Delete className="h-5 w-5" />
							</IconButton>
						)}
					</div>

					{!currentOrder && (
						<div className="flex gap-2 items-center">
							<div className="flex gap-2 ">
								{hasActiveFilters && (
									<IconButton variant="danger" onClick={() => clearFilters()}>
										<FilterX className="h-4 w-4" />
									</IconButton>
								)}
								<IconButton variant="secondary" onClick={() => setShowFilters(!showFilters)}>
									<Filter className="h-4 w-4" /> Filters
								</IconButton>
							</div>

							<PaginationInfo pagination={pagination} resourceName="orders" />
						</div>
					)}
				</Toolbar>

				{!currentOrder && showFilters && (
					<div className="mt-4 pt-4 border-t border-gray-700">
						<div className="flex flex-col sm:flex-row gap-4">
							<OrderStatusFilter
								value={filters?.status}
								onChange={(val) => updateFilters(OrderFilterKeys.STATUS, val)}
								label="Status"
							/>
						</div>
					</div>
				)}
			</Card>

			{currentOrder
				? (
					<OrdersList
						orders={[currentOrder]}
						columns={columns}
					/>
				)
				: (
					<OrdersList
						orders={orders}
						columns={columns}
						pagination={pagination}
						setPage={setPage}
					/>
				)
			}
		</div>
	);
};

export default OrdersTab;