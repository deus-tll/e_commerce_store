import {useEffect} from 'react';
import {useSearchParams} from "react-router-dom";

import {ProductFilterKeys, useProductStore} from "../stores/useProductStore.js";

import ProductGrid from "../components/product/ProductGrid.jsx";

import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import SortSelector from "../components/ui/SortSelector.jsx";

const PRODUCT_SORT_OPTIONS = [
	{ label: "Newest First", value: "createdAt-desc" },
	{ label: "Price: Low to High", value: "price-asc" },
	{ label: "Price: High to Low", value: "price-desc" },
	{ label: "Top Rated", value: "ratingStats.averageRating-desc" },
];

const ProductsPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get("search") || "";

	const {
		products, pagination, filters, loading,
		updateFilter, setPage, clearFilters
	} = useProductStore();

	useEffect(() => {
		void updateFilter(ProductFilterKeys.SEARCH, searchTerm);
	}, [searchTerm, updateFilter]);

	useEffect(() => {
		return () => void clearFilters();
	}, [clearFilters]);

	const handleResetAll = () => {
		void clearFilters();
		setSearchParams({});
	};

	return (
		<Container size="lg" className="py-8">
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
				<SectionHeader
					title={searchTerm ? `Search: ${searchTerm}` : "All Products"}
					subtitle={searchTerm ? `Found ${pagination?.total || 0} matches` : "Browse our full collection"}
					className="mb-0"
				/>

				<SortSelector
					sortBy={filters.sort.sortBy}
					order={filters.sort.order}
					options={PRODUCT_SORT_OPTIONS}
					onSortChange={(newSort) => void updateFilter(ProductFilterKeys.SORT, newSort)}
				/>
			</div>

			{loading
				? <LoadingSpinner />
				: products.length === 0
					? (
						<div className="w-full">
							<EmptyState
								title="No products found"
								description={searchTerm
									? `We couldn't find anything matching "${searchTerm}".`
									: "Our catalog is currently empty."
								}
								action={searchTerm && (
									<Button variant="secondary" onClick={handleResetAll}>
										Clear Search & View All
									</Button>
								)}
							/>
						</div>
					)
					: (
						<>
							<ProductGrid products={products} />
							{pagination?.pages > 1 && (
								<div className="flex justify-center pt-10">
									<Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
								</div>
							)}
						</>
					)
			}
		</Container>
	);
};

export default ProductsPage;