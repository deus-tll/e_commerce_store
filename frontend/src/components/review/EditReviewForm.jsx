import React, {useState} from 'react';
import {useReviewStore} from "../../stores/useReviewStore.js";
import Modal from "../ui/Modal.jsx";
import FormField from "../ui/FormField.jsx";
import {Textarea} from "../ui/Input.jsx";
import {Save} from "lucide-react";
import Button from "../ui/Button.jsx";
import RatingSelector from "./RatingSelector.jsx";

const EditReviewForm = ({ review, onClose }) => {
	const [formData, setFormData] = useState({
		rating: review.rating || "",
		comment: review.comment || ""
	});

	const { submitting, updateReview } = useReviewStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await updateReview(review._id, formData);
			onClose();
		} catch (error) {
			console.error("Error updating review", error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	return (
		<Modal open={true} onClose={onClose} title="Edit Review">
			<form onSubmit={handleSubmit} className="space-y-5">
				<FormField label="Rating">
					<div className="flex space-x-1">
						<RatingSelector
							rating={formData.rating}
							name="rating"
							onChange={handleInputChange}
						/>
					</div>
				</FormField>

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

				<Button type="submit" className="w-full justify-center" disabled={submitting}>
					<Save className="h-4 w-4" />
					Save Changes
				</Button>
			</form>
		</Modal>
	);
};

export default EditReviewForm;