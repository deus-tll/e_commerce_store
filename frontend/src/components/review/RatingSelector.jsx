import React from 'react';
import {Star} from "lucide-react";

const RatingSelector = ({ rating, name, onChange }) => {
	const handleStarClick = (starValue) => {
		onChange({
			target: {
				name: name,
				value: starValue
			}
		});
	};

	return (
		<div className="flex space-x-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type="button"
					onClick={() => handleStarClick(star)}
					className={`p-1 transition-colors ${
						star <= rating
							? 'text-yellow-400 hover:text-yellow-300'
							: 'text-gray-500 hover:text-gray-400'
					}`}
				>
					<Star
						className={`h-5 w-5 ${
							star <= rating ? 'fill-current' : ''
						}`}
					/>
				</button>
			))}
		</div>
	);
};

export default RatingSelector;