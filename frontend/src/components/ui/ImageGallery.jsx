import React from 'react';

const ImageGallery = ({ allImages, selectedImageIndex, onSelectImage }) => {
	if (!allImages || allImages.length <= 1) {
		return null;
	}

	return (
		<div className="flex space-x-2 overflow-x-auto p-2 scrollbar-hide">
			{allImages.map((imageUrl, index) => (
				<div
					key={index}
					className={`flex-shrink-0 w-20 h-20 bg-gray-700 rounded-md overflow-hidden transition-all cursor-pointer ${
						selectedImageIndex === index
							? 'opacity-100 ring-2 ring-emerald-400'
							: 'opacity-50 hover:opacity-75'
					}`}
					onClick={() => onSelectImage(index)}
				>
					<img
						src={imageUrl}
						alt={`Product view ${index + 1}`}
						className="w-full h-full object-cover"
					/>
				</div>
			))}
		</div>
	);
};

export default ImageGallery;