import {ORDER_STATUS_STYLES, ORDER_STATUS_VALUES} from "../../constants/domain.js";
import {Select} from "../ui/Input.jsx";
import {formatStatusName} from "../../utils/format.js";

const OrderStatusSelect = ({ status, orderId, orderNumber, onStatusChange, disabled = false, className = "" }) => {
	const handleStatusChange = async (e) => {
		const newStatus = e.target.value;

		const confirmed = window.confirm(
			`Are you sure you want to change order #${orderNumber} to ${newStatus}?`
		);

		if (confirmed) {
			await onStatusChange(orderId, newStatus);
		}
	};

	return (
		<Select
			value={status}
			disabled={disabled}
			className={`${ORDER_STATUS_STYLES[status]} ${className} cursor-pointer`}
			onChange={handleStatusChange}
		>
			{ORDER_STATUS_VALUES.map((s) => (
				<option key={s} value={s} className="bg-gray-900 text-white">
					{formatStatusName(s)}
				</option>
			))}
		</Select>
	);
};

export default OrderStatusSelect;