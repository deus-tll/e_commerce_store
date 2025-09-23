import {useEffect} from 'react';
import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";

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
        <Container size="lg">
            <SectionHeader title="Explore Our Categories" subtitle="Discover the latest trends in eco-friendly fashion" />
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
        </Container>
    );
};

export default HomePage;