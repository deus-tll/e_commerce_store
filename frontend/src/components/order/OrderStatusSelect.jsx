import {OrderStatusStyles, OrderStatusValues} from "../../constants/domain.js";
import {Select} from "../ui/Input.jsx";

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
			className={`${OrderStatusStyles[status]} ${className} cursor-pointer`}
			onChange={handleStatusChange}
		>
			{OrderStatusValues.map((s) => (
				<option key={s} value={s} className="bg-gray-900 text-white">
					{s.charAt(0).toUpperCase() + s.slice(1)}
				</option>
			))}
		</Select>
	);
};

export default OrderStatusSelect;