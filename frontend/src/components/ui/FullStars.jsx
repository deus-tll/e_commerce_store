import {Star} from "lucide-react";

const FullStars = ({ rating }) => {
	return (
		<div className="flex items-center space-x-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<Star
					key={star}
					className={`h-4 w-4 ${
						star <= rating
							? 'text-yellow-400 fill-current'
							: 'text-gray-500'
					}`}
				/>
			))}
		</div>
	);
};

export default FullStars;