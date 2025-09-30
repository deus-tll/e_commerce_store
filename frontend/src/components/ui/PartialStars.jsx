import {Star} from "lucide-react";

const PartialStars = ({ rating }) => {
	const fullStars = Math.floor(rating);
	const partialStarPercentage = (rating - fullStars) * 100;
	const emptyStars = 5 - Math.ceil(rating);

	return (
		<div className="flex items-center space-x-1">
			{/* Fully filled stars */}
			{[...Array(fullStars)].map((_, index) => (
				<Star
					key={`full-${index}`}
					className="h-4 w-4 text-yellow-400 fill-current"
				/>
			))}

			{/* Partially filled star  */}
			{partialStarPercentage > 0 && (
				<div className="relative h-4 w-4">
					<Star className="absolute h-4 w-4 text-gray-500" />
					<div
						className="absolute top-0 left-0 overflow-hidden"
						style={{ width: `${partialStarPercentage}%` }}
					>
						<Star className="h-4 w-4 text-yellow-400 fill-current" />
					</div>
				</div>
			)}

			{/* Empty stars */}
			{[...Array(emptyStars)].map((_, index) => (
				<Star
					key={`empty-${index}`}
					className="h-4 w-4 text-gray-500"
				/>
			))}
		</div>
	);
};

export default PartialStars;