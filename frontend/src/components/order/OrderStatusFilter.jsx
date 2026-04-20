import {ORDER_STATUS_STYLES, ORDER_STATUS_VALUES} from "../../constants/domain.js";
import {Select} from "../ui/Input.jsx";
import {formatStatusName} from "../../utils/format.js";

const OrderStatusFilter = ({ value, onChange, label = "Filter by Status" }) => {
	return (
		<div className="min-w-[180px]">
			{label && <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{label}</label>}

			<Select
				value={value}
				className={ORDER_STATUS_STYLES[value]}
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="">All Statuses</option>
				{ORDER_STATUS_VALUES.map((status) => (
					<option key={status} value={status}>
						{formatStatusName(status)}
					</option>
				))}
			</Select>
		</div>
	);
};

export default OrderStatusFilter;