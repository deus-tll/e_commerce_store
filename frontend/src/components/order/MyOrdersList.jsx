import {Link} from "react-router-dom";
import {ChevronRight} from "lucide-react";

import {formatCurrency, formatDate} from "../../utils/format.js";
import {OrderStatusStyles} from "../../constants/domain.js";

import Card from "../ui/Card.jsx";

const MyOrdersList = ({ orders }) => {
	return orders.map((order) => (
		<Link key={order.id} to={`/order/${order.id}`} className="block group">
			<Card className="p-5 border border-transparent group-hover:border-emerald-500/50 transition-all duration-300">
				<div className="flex flex-col sm:flex-row justify-between gap-4">
					<div className="flex gap-4">
						<div className="flex -space-x-4 overflow-hidden">
							{order.products.slice(0, 3).map((product) => (
								<img
									key={product.id}
									src={product.image}
									alt={product.name}
									className="h-14 w-14 rounded-xl border-2 border-gray-900 object-cover bg-gray-800"
								/>
							))}

							{order.products.length > 3 && (
								<div className="h-14 w-14 rounded-xl border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-bold">
									+{order.products.length - 3}
								</div>
							)}
						</div>

						<div>
							<h4 className="text-white font-bold group-hover:text-emerald-400 transition-colors">
								Order #{order.orderNumber}
							</h4>
							<p className="text-gray-500 text-sm">{formatDate(order.createdAt)}</p>
							<p className="text-gray-400 text-sm mt-1">
								{order.products.length} {order.products.length === 1 ? 'item' : 'items'}
							</p>
						</div>
					</div>

					<div className="flex flex-row sm:flex-col justify-between items-end gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-800">
						<div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${OrderStatusStyles[order.status]}`}>
							{order.status}
						</div>

						<div className="flex items-center gap-3">
												<span className="text-lg font-black text-white">
                                                    {formatCurrency(order.totalAmount)}
                                                </span>
							<ChevronRight className="text-gray-600 group-hover:text-emerald-500 transition-colors" />
						</div>
					</div>
				</div>
			</Card>
		</Link>
	));
};

export default MyOrdersList;