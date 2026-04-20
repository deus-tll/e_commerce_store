import {useEffect, useMemo, useState} from 'react';
import {MessageSquare} from "lucide-react";

import {useReviewStore} from "../../stores/useReviewStore.js";

import ReviewForm from "./ReviewForm.jsx";
import ReviewsSummary from "./ReviewsSummary.jsx";
import ReviewItem from "./ReviewItem.jsx";

import LoadingSpinner from "../ui/LoadingSpinner.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import Pagination from "../ui/Pagination.jsx";
import Modal from "../ui/Modal.jsx";

const ReviewsList = ({ productId }) => {
	const [editingReview, setEditingReview] = useState(null);

	const {
		reviews,
		pagination,
		loading,
		setPage,
		fetchReviewsByProduct,
		deleteReview,
		clearReviews
	} = useReviewStore();

	useEffect(() => {
		void fetchReviewsByProduct(productId);

		return () => clearReviews();
	}, [productId, fetchReviewsByProduct, clearReviews]);

	const handleCloseEdit = () => setEditingReview(null);

	const handleDelete = async (reviewId) => {
		await deleteReview(reviewId, productId);
	};

	const handlePageChange = useMemo(() =>
			(newPage) => setPage(newPage, productId),
		[setPage, productId]);

	if (loading && reviews.length === 0) {
		return (
			<div className="flex justify-center py-12">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<ReviewsSummary total={pagination.total} showing={reviews.length} />

			{reviews.length === 0 ? (
				<EmptyState
					icon={MessageSquare}
					title="No reviews yet"
					description="Be the first to share your experience with this product."
				/>
			) : (
				<>
					<div className="space-y-4">
						{reviews.map((review) => (
							<ReviewItem
								key={review.id}
								review={review}
								onEdit={setEditingReview}
								onDelete={handleDelete}
							/>
						))}
					</div>

					<Pagination
						page={pagination.page}
						pages={pagination.pages}
						onChange={handlePageChange}
					/>
				</>
			)}

			<Modal title="Edit Your Review" open={!!editingReview} onClose={handleCloseEdit}>
				{editingReview && (
					<ReviewForm productId={productId} initialData={editingReview} onSuccess={handleCloseEdit} />
				)}
			</Modal>
		</div>
	);
};

export default ReviewsList;