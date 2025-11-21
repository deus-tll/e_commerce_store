import {useEffect} from 'react';

import {useCategoryStore, DEFAULT_LIMIT} from "../stores/useCategoryStore.js";
import {useProductStore} from "../stores/useProductStore.js";

import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import CategoryItem from "../components/CategoryItem.jsx";
import FeaturedProducts from "../components/FeaturedProducts.jsx";
import Button from "../components/ui/Button.jsx";

const HomePage = () => {
	const { featuredProducts, loading: productsLoading, fetchFeaturedProducts } = useProductStore();
	const { categories, pagination, loading: categoriesLoading, fetchCategories } = useCategoryStore();

	useEffect(() => {
		fetchFeaturedProducts();
		fetchCategories();
	}, []);

	const hasMore = pagination && pagination.page < pagination.pages;

	const loadNextPage = () => {
		if (hasMore && !categoriesLoading) {
			const nextPage = pagination.page + 1;
			fetchCategories(nextPage, DEFAULT_LIMIT);
		}
	};

    return (
        <Container size="lg">
	        {!productsLoading && featuredProducts.length > 0 &&
		        <FeaturedProducts featuredProducts={featuredProducts} />
	        }

            <SectionHeader title="Explore Our Categories" subtitle="Discover high-quality, sustainable products for every part of your life" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                    <CategoryItem category={{
                        href: `/${category.slug}`,
                        name: category.name,
                        imageUrl: category.image
                    }} key={category.id} />
                ))}
            </div>

	        {categoriesLoading && categories.length === 0 ? (
		        <div className="text-center mt-8 text-gray-500">Loading initial categories...</div>
	        ) : hasMore && (
		        <div className="flex justify-center mt-8">
			        <Button
				        onClick={loadNextPage}
				        disabled={categoriesLoading}
				        variant="primary"
				        className="w-full sm:w-auto"
			        >
				        {categoriesLoading ? 'Loading...' : 'Load More Categories'}
			        </Button>
		        </div>
	        )}
        </Container>
    );
};

export default HomePage;