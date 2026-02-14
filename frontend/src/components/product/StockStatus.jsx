import {getStockStatus} from "../../utils/helpersUI.js";

const StockStatus = ({ stock }) => {
	const { label, dotClass, textClass } = getStockStatus(stock);
	return (
		<div className="flex items-center gap-2">
			<div className={`w-2 h-2 rounded-full ${dotClass}`}></div>
			<span className={`${textClass} text-sm font-medium`}>{label}</span>
		</div>
	);
};

export default StockStatus;