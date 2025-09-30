import React, {useEffect, useState} from 'react';

import {useReviewStore} from "../../stores/useReviewStore.js";

import LoadingSpinner from "../LoadingSpinner.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import Pagination from "../ui/Pagination.jsx";
import ReviewsSummary from "./ReviewsSummary.jsx";
import ReviewItem from "./ReviewItem.jsx";
import EditReviewForm from "./EditReviewForm.jsx";

const ReviewsList = ({ productId }) => {
	const [page, setPage] = useState(1);
	const [editingReviewObject, setEditingReviewObject] = useState(null);

	const {
		reviews,
		pagination,
		loading,
		fetchReviewsByProduct,
		deleteReview
	} = useReviewStore();

	useEffect(() => {
		fetchReviewsByProduct(productId, page, 10);
	}, [productId, page, fetchReviewsByProduct]);

	const handleEdit = (review) => {
		setEditingReviewObject(review);
	}

	const handleCloseEdit = () => {
		setEditingReviewObject(null);
	}

	const handleDelete = async (reviewId) => {
		try {
			await deleteReview(reviewId);
		} catch (error) {
			console.error("Error deleting review:", error);
		}
	};

	if (loading && reviews.length === 0) {
		return (
			<div className="flex justify-center py-8">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Summary */}
			<ReviewsSummary
				total={pagination?.total}
				showing={reviews.length}
			/>

			{/* Reviews Content */}
			{reviews.length === 0 ? (
				<EmptyState
					title="No reviews yet"
					description="Be the first to review this product and help other customers make informed decisions."
				/>
			) : (
				<>
					{/* Reviews List */}
					<div className="space-y-4">
						{reviews.map((review) => (
							<ReviewItem
								key={review._id}
								review={review}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>

					{/* Pagination */}
					{pagination && pagination.pages > 1 && (
						<div className="flex justify-center pt-4">
							<Pagination
								page={page}
								pages={pagination.pages}
								onChange={setPage}
								disabled={loading}
							/>
						</div>
					)}
				</>
			)}

			{editingReviewObject && (
				<EditReviewForm
					review={editingReviewObject}
					onClose={handleCloseEdit}
				/>
			)}

			{/* Loading overlay for pagination */}
			{loading && reviews.length > 0 && (
				<div className="flex justify-center py-4">
					<div className="text-gray-400 text-sm">Loading more reviews...</div>
				</div>
			)}
		</div>
	);
};

export default ReviewsList;