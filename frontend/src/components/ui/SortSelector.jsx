const SortSelector = ({ sortBy, order, onSortChange, options = [] }) => {
	return (
		<div className="flex items-center gap-2">
			<span className="text-xs text-gray-500 uppercase font-bold">Sort By:</span>
			<select
				className="bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition-colors"
				value={`${sortBy}-${order}`}
				onChange={(e) => {
					const [newSortBy, newOrder] = e.target.value.split('-');
					onSortChange({ sortBy: newSortBy, order: newOrder });
				}}
			>
				{options.map(opt => (
					<option key={opt.value} value={opt.value}>{opt.label}</option>
				))}
			</select>
		</div>
	);
};

export default SortSelector;