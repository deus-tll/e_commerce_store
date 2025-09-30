import React, {useState} from 'react';
import { Star } from "lucide-react";
import {useAuthStore} from "../../stores/useAuthStore.js";
import {useReviewStore} from "../../stores/useReviewStore.js";
import FormField from "../ui/FormField.jsx";
import {Textarea} from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import RatingSelector from "./RatingSelector.jsx";

const reviewTemplate = {
	rating: 5,
	comment: ""
};

const CreateReviewForm = ({ productId, onSuccess }) => {
	const [formData, setFormData] = useState({ ...reviewTemplate });

	const { user } = useAuthStore();
	const { submitting, createReview } = useReviewStore();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!user) {
			console.error("User must be logged in to submit review");
			return;
		}

		if (!formData.rating || !formData.comment.trim()) {
			console.error("Rating and comment are required");
			return;
		}

		try {
			await createReview(productId, formData);
			setFormData({...reviewTemplate});
			onSuccess?.();
		} catch (error) {
			console.error("Error creating review:", error);
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	if (!user) {
		return (
			<div className="bg-gray-800 rounded-md p-4 text-center">
				<p className="text-gray-300">Please log in to submit a review.</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="bg-gray-800 rounded-md p-6 space-y-4">
			<h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>

			<div>
				<FormField label="Rating">
					<div className="flex space-x-1">
						<RatingSelector
							rating={formData.rating}
							name="rating"
							onChange={handleInputChange}
						/>
					</div>
				</FormField>
			</div>

			<div>
				<FormField label="Comment">
					<Textarea
						name="comment"
						value={formData.comment}
						onChange={handleInputChange}
						placeholder="Share your thoughts about this product..."
						rows={4}
						className="resize-none"
					/>
				</FormField>
			</div>

			<div className="flex justify-end">
				<Button
					type="submit"
					disabled={submitting || !formData.comment.trim()}
					className="min-w-32"
				>
					{submitting ? "Submitting..." : "Submit Review"}
				</Button>
			</div>
		</form>
	);
};

export default CreateReviewForm;