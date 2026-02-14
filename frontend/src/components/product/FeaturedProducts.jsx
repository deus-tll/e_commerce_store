import Carousel from "../ui/Carousel.jsx";
import ProductCard from "./ProductCard.jsx";

const FeaturedProducts = ({ featuredProducts }) => {
	const responsiveSettings = [
		{ width: 0, items: 1 },
		{ width: 640, items: 2 },
		{ width: 1024, items: 3 },
		{ width: 1280, items: 4 }
	];

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
						<div key={product._id} className="w-full flex-shrink-0 px-2">
							<ProductCard product={product} />
						</div>
					)}
				/>
			</div>
		</div>
	);
};

export default FeaturedProducts;