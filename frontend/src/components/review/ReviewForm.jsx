import {useEffect} from 'react';
import {Save, Send} from "lucide-react";

import useFormData from "../../hooks/useFormData.js";
import {validateRating, validateRequired} from "../../utils/validators.js";

import {useReviewStore} from "../../stores/useReviewStore.js";
import {useAuthStore} from "../../stores/useAuthStore.js";

import RatingSelector from "./RatingSelector.jsx";

import FormField from "../ui/FormField.jsx";
import {Textarea} from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const getInitialState = (data) => ({
	rating: data?.rating || 5,
	comment: data?.comment || ""
});

const validationRules = {
	rating: validateRating,
	comment: (val) => validateRequired(val, "Comment"),
};

const ReviewForm = ({ productId, initialData = null, onSuccess }) => {
	const isEdit = !!initialData;

	const {
		formData,
		errors,
		setFormData,
		handleInputChange,
		validate
	} = useFormData(getInitialState(initialData));

	const { user } = useAuthStore();
	const { loading, error: reviewApiError, createReview, updateReview, clearError } = useReviewStore();

	useEffect(() => {
		setFormData(getInitialState(initialData));
		clearError();
		return () => clearError();
	}, [initialData, setFormData, clearError]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		clearError();

		if (!validate(validationRules)) return;

		const success = isEdit
			? await updateReview(productId, initialData.id, formData)
			: await createReview(productId, formData);

		if (success) {
			if (!isEdit) setFormData(getInitialState(null));
			onSuccess?.();
		}
	};

	if (!user) {
		return (
			<div className="bg-gray-800 rounded-md p-4 text-center border border-gray-700">
				<p className="text-gray-300 text-sm">Please log in to submit a review.</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className={`${!isEdit ? 'bg-gray-800 p-6 border border-gray-700' : ''} rounded-md space-y-5`}>
			{!isEdit && <h3 className="text-lg font-semibold text-white">Write a Review</h3>}

			<ErrorMessage message={reviewApiError} />

			<FormField label="Rating" error={errors.rating}>
				<RatingSelector
					rating={formData.rating}
					name="rating"
					onChange={handleInputChange}
				/>
			</FormField>

			<FormField label="Comment" error={errors.comment}>
				<Textarea
					name="comment"
					value={formData.comment}
					onChange={handleInputChange}
					placeholder="Share your thoughts about this product..."
					rows={4}
					className="resize-none"
					error={!!errors.comment}
				/>
			</FormField>

			<div className="flex justify-end pt-2">
				<Button
					type="submit"
					disabled={loading}
					className={isEdit ? "w-full justify-center" : "min-w-32"}
				>
					{isEdit ? <Save className="h-4 w-4" /> : <Send className="h-4 w-4" />}
					{loading ? "Processing..." : (isEdit ? "Save Changes" : "Submit Review")}
				</Button>
			</div>
		</form>
	);
};

export default ReviewForm;