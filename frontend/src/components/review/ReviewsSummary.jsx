import React from 'react';

const ReviewsSummary = ({ total, showing }) => {
	if (!total) return null;

	return (
		<div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
			<div className="text-center">
				<div className="text-lg font-semibold text-white mb-2">
					Customer Reviews
				</div>

				<div className="text-gray-400 text-sm">
					{total} total review{total !== 1 ? 's' : ''}
				</div>

				<div className="text-xs text-gray-500 mt-2">
					Showing {showing} of {total} reviews
				</div>
			</div>
		</div>
	);
};

export default ReviewsSummary;