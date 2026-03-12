const PaginationInfo = ({ pagination, resourceName }) => {
	if (!pagination) {
		return null;
	}

	const startItem = ((pagination.page - 1) * pagination.limit) + 1;
	const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

	return (
		<div className="text-gray-300 text-sm">
			Showing {startItem} to {endItem} of {pagination.total} {resourceName}
		</div>
	);
};

export default PaginationInfo;