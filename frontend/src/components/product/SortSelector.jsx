const SortSelector = ({ sortConfig, onSortChange }) => {
	return (
		<div className="flex items-center gap-2">
			<span className="text-xs text-gray-500 uppercase font-bold">Sort By:</span>
			<select
				className="bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-emerald-500 transition-colors"
				value={`${sortConfig.sortBy}-${sortConfig.order}`}
				onChange={(e) => {
					const [sortBy, order] = e.target.value.split('-');
					onSortChange({ sortBy, order });
				}}
			>
				<option value="createdAt-desc">Newest First</option>
				<option value="price-asc">Price: Low to High</option>
				<option value="price-desc">Price: High to Low</option>
				<option value="ratingStats.averageRating-desc">Top Rated</option>
			</select>
		</div>
	);
};

export default SortSelector;