import {useEffect} from 'react';

import {useProductStore} from "../stores/useProductStore.js";

import CategoryItem from "../components/CategoryItem.jsx";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import { useCategoryStore } from "../stores/useCategoryStore.js";



const HomePage = () => {
	const { fetchFeaturedProducts, featuredProducts, isLoading } = useProductStore();
	const { categories, fetchCategories } = useCategoryStore();

	useEffect(() => {
		fetchFeaturedProducts();
		fetchCategories();
	}, [fetchFeaturedProducts, fetchCategories]);

	return (
		<div className="relative min-h-screen text-white overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
					Explore Our Categories
				</h1>

				<p className="text-center text-xl text-gray-300 mb-12">
					Discover the latest trends in eco-friendly fashion
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{categories.map((category) => (
						<CategoryItem category={{
							href: `/${category.slug}`,
							name: category.name,
							imageUrl: category.image
						}} key={category._id} />
					))}
				</div>

				{!isLoading && featuredProducts.length > 0 &&
					<FeaturedProducts featuredProducts={featuredProducts} />
				}
			</div>
		</div>
	);
};

export default HomePage;