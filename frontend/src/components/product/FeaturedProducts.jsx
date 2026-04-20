import Carousel from "../ui/Carousel.jsx";
import ProductCard from "./ProductCard.jsx";
import {useProductStore} from "../../stores/useProductStore.js";
import {useEffect} from "react";

const FeaturedProducts = () => {
	const {
		featuredProducts, featuredProductsLoading,
		fetchFeaturedProducts, clearFeaturedProducts
	} = useProductStore();

	const responsiveSettings = [
		{ width: 0, items: 1 },
		{ width: 640, items: 2 },
		{ width: 1024, items: 3 },
		{ width: 1280, items: 4 }
	];

	useEffect(() => {
		void fetchFeaturedProducts();
		return () => clearFeaturedProducts();
	}, [fetchFeaturedProducts, clearFeaturedProducts]);

	if (featuredProductsLoading && featuredProducts.length === 0) return null;
	if (featuredProducts.length === 0) return null;

	return (
		<div className="py-12">
			<div className="container mx-auto px-4">
				<h2 className="text-center text-2xl sm:text-3xl font-semibold text-emerald-400 mb-4">
					Featured
				</h2>

				<Carousel
					items={featuredProducts}
					responsive={responsiveSettings}
					renderItem={(product) => (
						<ProductCard product={product} />
					)}
				/>
			</div>
		</div>
	);
};

export default FeaturedProducts;