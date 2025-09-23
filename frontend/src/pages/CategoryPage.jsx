import {useEffect} from 'react';
import {useParams} from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";

import {useProductStore} from "../stores/useProductStore.js";

import ProductGrid from "../components/ProductGrid.jsx";

const CategoryPage = () => {
	const { fetchProductsByCategory, products } = useProductStore();

	const { category } = useParams();

	useEffect(() => {
		fetchProductsByCategory(category);
	}, [fetchProductsByCategory, category]);

    return (
        <Container size="lg">
            <SectionHeader title={category.charAt(0).toUpperCase() + category.slice(1)} />
            <ProductGrid products={products} />
        </Container>
    );
};

export default CategoryPage;