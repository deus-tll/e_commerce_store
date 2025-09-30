import React, {useState} from 'react';
import {useAuthStore} from "../../stores/useAuthStore.js";
import {MoreVertical, Pencil, Trash} from "lucide-react";
import IconButton from "../ui/IconButton.jsx";
import FullStars from "../ui/FullStars.jsx";

const ReviewItem = ({ review, onEdit, onDelete }) => {
	const [showActions, setShowActions] = useState(false);

	const { user } = useAuthStore();

	const isOwner = user && user._id === review.user?._id;

	const handleEdit = () => {
		onEdit(review);
		setShowActions(false);
	}

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this review?")) {
			onDelete(review._id);
		}
		setShowActions(false);
	};

	return (
		<div className="border border-gray-700 rounded-lg p-6 bg-gray-800/50 hover:bg-gray-800 transition-colors">
			<div className="flex items-start justify-between">
				<div className="flex-1">
					{/* Header with user info and rating */}
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center space-x-3">
							<div className="font-semibold text-white">
								{review.user?.name || "Anonymous"}
							</div>

							<FullStars rating={review.rating} />
						</div>

						{/* Actions menu for owner */}
						{isOwner && (
							<div className="relative">
								<IconButton
									size="sm"
									onClick={() => setShowActions(!showActions)}
								>
									<MoreVertical className="h-4 w-4" />
								</IconButton>

								{showActions && (
									<div className="absolute right-0 top-8 bg-gray-700 rounded-md shadow-lg py-1 z-10 min-w-32">
										<IconButton
											onClick={handleEdit}
											className="text-emerald-400 hover:text-emerald-300"
										>
											<Pencil className="h-4 w-4" />
											<span>Edit</span>
										</IconButton>

										<IconButton
											onClick={handleDelete}
											className="text-red-400 hover:text-red-300"
										>
											<Trash className="h-4 w-4" />
											<span>Delete</span>
										</IconButton>
									</div>
								)}
							</div>
						)}
					</div>

					{/* Comment */}
					<p className="text-gray-300 mb-3 leading-relaxed">
						{review.comment}
					</p>

					{/* Date */}
					<div className="text-xs text-gray-500">
						{new Date(review.createdAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ReviewItem;