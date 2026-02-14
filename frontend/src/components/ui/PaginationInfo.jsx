const PaginationInfo = ({ pagination, page, resourceName }) => {
	if (!pagination) {
		return null;
	}

	const startItem = ((page - 1) * pagination.limit) + 1;
	const endItem = Math.min(page * pagination.limit, pagination.total);

	return (
		<div className="text-gray-300 text-sm">
			Showing {startItem} to {endItem} of {pagination.total} {resourceName}
		</div>
	);
};

export default PaginationInfo;