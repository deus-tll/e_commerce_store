import {useEffect, useState} from 'react';
import {useSearchParams} from "react-router-dom";

import {useProductStore} from "../stores/useProductStore.js";

import ProductGrid from "../components/product/ProductGrid.jsx";
import SortSelector from "../components/product/SortSelector.jsx";

import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import Button from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

const ProductsPage = () => {
	const [page, setPage] = useState(1);
	const [sortConfig, setSortConfig] = useState({ sortBy: 'createdAt', order: 'desc' });

	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get("search") || "";

	const { products, pagination, loading, fetchProducts } = useProductStore();

	useEffect(() => {
		const filters = { ...sortConfig };

		const trimmedSearch = searchTerm.trim();
		if (trimmedSearch) {
			filters.search = trimmedSearch;
		}

		void fetchProducts({
			page,
			filters: filters
		});
	}, [searchTerm, page, sortConfig, fetchProducts]);

	useEffect(() => {
		setPage(1);
	}, [searchTerm]);

	return (
		<Container size="lg" className="py-8">
			<div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
				<SectionHeader
					title={searchTerm ? `Search: ${searchTerm}` : "All Products"}
					subtitle={searchTerm ? `Found ${pagination?.totalPrice || 0} matches` : "Browse our full collection"}
					className="mb-0"
				/>

				<SortSelector
					sortConfig={sortConfig}
					onSortChange={(newSort) => {
						setSortConfig(newSort);
						setPage(1);
					}}
				/>
			</div>

			{loading ? (
				<LoadingSpinner />
			) : products.length === 0 ? (
				<div className="w-full">
					<EmptyState
						title="No products found"
						description={searchTerm
							? `We couldn't find anything matching "${searchTerm}".`
							: "Our catalog is currently empty."
						}
						action={searchTerm && (
							<Button variant="secondary" onClick={() => setSearchParams({})}>
								Clear Search & View All
							</Button>
						)}
					/>
				</div>
			) : (
				<>
					<ProductGrid products={products} />
					{pagination?.pages > 1 && (
						<div className="flex justify-center pt-10">
							<Pagination page={page} pages={pagination.pages} onChange={setPage} />
						</div>
					)}
				</>
			)}
		</Container>
	);
};

export default ProductsPage;