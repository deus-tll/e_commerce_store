import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button.jsx";

const Carousel = ({ items, renderItem, responsive = [{ width: 0, items: 1 }] }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(1);

	useEffect(() => {
		const handleResize = () => {
			let currentItems = 1;

			const sortedResponsive = [...responsive].sort((a, b) => a.width - b.width);
			for (let i = 0; i < sortedResponsive.length; i++) {
				if (window.innerWidth >= sortedResponsive[i].width) {
					currentItems = sortedResponsive[i].items;
				}
			}

			setItemsPerPage(currentItems);
		}

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [responsive]);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	if (!items || items.length === 0) {
		return null;
	}

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= items.length - itemsPerPage;

	return (
		<div className="relative w-full">
			<div className="overflow-hidden">
				<div
					className="flex transition-transform duration-300 ease-in-out"
					style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
				>
					{items.map((item, index) => (
						<div
							key={index}
							className="flex-shrink-0"
							style={{ width: `${100 / itemsPerPage}%` }}
						>
							{renderItem(item, index)}
						</div>
					))}
				</div>
			</div>

			{items.length > itemsPerPage && (
				<>
					<Button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full ${isStartDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						<ChevronLeft className="w-6 h-6" />
					</Button>

					<Button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full ${isEndDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
					>
						<ChevronRight className="w-6 h-6" />
					</Button>
				</>
			)}
		</div>
	);
};

export default Carousel;