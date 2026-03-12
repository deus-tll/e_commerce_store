import {OrderStatusStyles, OrderStatusValues} from "../../constants/domain.js";
import {Select} from "../ui/Input.jsx";

const OrderStatusFilter = ({ value, onChange, label = "Filter by Status" }) => {
	return (
		<div className="min-w-[180px]">
			{label && <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{label}</label>}

			<Select
				value={value}
				className={OrderStatusStyles[value]}
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="">All Statuses</option>
				{OrderStatusValues.map((status) => (
					<option key={status} value={status}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</option>
				))}
			</Select>
		</div>
	);
};

export default OrderStatusFilter;