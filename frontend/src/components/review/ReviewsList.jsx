import {useEffect, useState} from 'react';
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
	const [editingObject, setEditingObject] = useState(null);

	const {
		reviews,
		pagination,
		loading,
		page,
		setPage,
		fetchReviewsByProduct,
		deleteReview
	} = useReviewStore();

	useEffect(() => {
		void fetchReviewsByProduct(productId);
	}, [productId, page, fetchReviewsByProduct]);

	const handleEdit = (review) => setEditingObject(review);
	const handleCloseEdit = () => setEditingObject(null);

	const handleDelete = async (reviewId) => {
		await deleteReview(productId, reviewId);
	};

	if (loading && reviews.length === 0) {
		return (
			<div className="flex justify-center py-12">
				<LoadingSpinner />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<ReviewsSummary total={pagination?.totalPrice} showing={reviews.length} />

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
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>

					{pagination?.pages > 1 && (
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

			<Modal title="Edit Your Review" open={!!editingObject} onClose={handleCloseEdit}>
				{editingObject && (
					<ReviewForm productId={productId} initialData={editingObject} onSuccess={handleCloseEdit} />
				)}
			</Modal>
		</div>
	);
};

export default ReviewsList;