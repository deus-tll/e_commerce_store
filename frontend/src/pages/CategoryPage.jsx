import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";

import {useProductStore} from "../stores/useProductStore.js";

import ProductGrid from "../components/ProductGrid.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const DEFAULT_LIMIT = 36;

const CategoryPage = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const { category: categorySlug } = useParams();

	const { products, pagination, loading, fetchProducts } = useProductStore();

	useEffect(() => {
		setCurrentPage(1);
	}, [categorySlug]);

	useEffect(() => {
		if (categorySlug) {
			const filters = { categorySlug: categorySlug };
			fetchProducts(currentPage, DEFAULT_LIMIT, filters);
		}
	}, [categorySlug, currentPage, fetchProducts]);

	const handlePageChange = (newPage) => {
		if (newPage !== currentPage) {
			setCurrentPage(newPage);
		}
	};

    return (
        <Container size="lg">
	        <SectionHeader
		        title={categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' ')}
		        className="mb-8"
	        />

	        {loading ? (
		        <LoadingSpinner fullscreen={false} />
	        ) : (
		        <>
			        <ProductGrid products={products} />

			        {pagination && pagination.pages > 1 && (
				        <div className="flex justify-center pt-8">
					        <Pagination
						        page={currentPage}
						        pages={pagination.pages}
						        onChange={handlePageChange}
						        disabled={loading}
					        />
				        </div>
			        )}
		        </>
	        )}
        </Container>
    );
};

export default CategoryPage;