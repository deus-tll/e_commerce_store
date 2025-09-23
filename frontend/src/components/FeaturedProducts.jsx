import { useState, useEffect } from 'react';
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./ui/Button.jsx";

import {useCartStore} from "../stores/useCartStore.js";
import { formatCurrency } from "../utils/format.js";

const FeaturedProducts = ({ featuredProducts }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(4);

	const { addToCart } = useCartStore();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);
			else if (window.innerWidth < 1024) setItemsPerPage(2);
			else if (window.innerWidth < 1280) setItemsPerPage(3);
			else setItemsPerPage(4);
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	const isStartDisabled = currentIndex === 0;
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<div className="py-12">
			<div className="container mx-auto px-4">
				<h2 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
					Featured
				</h2>

				<div className="relative">
					<div className="overflow-hidden">
						<div
							className="flex transition-transform duration-300 ease-in-out"
							style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%` }}
						>
							{featuredProducts?.map((product) => (
								<div key={product._id} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2">
									<div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30">
										<div className="overflow-hidden">
											<img
												src={product.image}
												alt={product.name}
												className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
											/>
										</div>

										<div className="p-4">
											<h3 className="text-lg font-semibold mb-2 text-white">
												{product.name}
											</h3>

                                            <p className="text-emerald-300 font-medium mb-4">
                                                {formatCurrency(product.price)}
                                            </p>

                                            <Button onClick={() => addToCart(product)} className="w-full justify-center">
                                                <ShoppingCart className="w-5 h-5" />
                                                Add to Cart
                                            </Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

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
				</div>
			</div>
		</div>
	);
};

export default FeaturedProducts;