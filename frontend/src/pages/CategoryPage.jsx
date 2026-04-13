import {useCallback, useEffect, useRef} from 'react';
import {useParams} from "react-router-dom";

import {ProductFilterKeys, useProductStore} from "../stores/useProductStore.js";
import {useCategoryStore} from "../stores/useCategoryStore.js";

import ProductGrid from "../components/product/ProductGrid.jsx";

import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Button from "../components/ui/Button.jsx";
import SortSelector from "../components/ui/SortSelector.jsx";

const PRODUCT_SORT_OPTIONS = [
	{ label: "Newest First", value: "createdAt-desc" },
	{ label: "Price: Low to High", value: "price-asc" },
	{ label: "Price: High to Low", value: "price-desc" },
	{ label: "Top Rated", value: "ratingStats.averageRating-desc" },
];

const CategoryPage = () => {
	const { category: categorySlug } = useParams();
	const lastSlug = useRef(categorySlug);

	const {
		products,
		pagination,
		filters,
		facets,
		loading: productsLoading,
		facetsLoading,
		setPage,
		fetchFacets,
		updateFilter,
		clearFilters,
		clearFiltersAndFetch
	} = useProductStore();
	const {
		currentCategory,
		loading: categoryLoading,
		fetchCategoryBySlug,
		clearCurrentCategory
	} = useCategoryStore();

	useEffect(() => {
		const loadData = async () => {
			if (!categorySlug) return;

			if (categorySlug !== lastSlug.current) {
				void clearFilters();
				lastSlug.current = categorySlug;
			}

			const success = await fetchCategoryBySlug(categorySlug);
			const categoryId = useCategoryStore.getState().currentCategory?.id;

			if (success && categoryId) {
				void fetchFacets(categoryId);
			}

			void updateFilter(ProductFilterKeys.CATEGORY_SLUG, categorySlug);
		};

		void loadData();

		return () => {
			clearCurrentCategory();
			void clearFilters();
		};
	}, [categorySlug, fetchCategoryBySlug, fetchFacets, updateFilter, clearFilters, clearCurrentCategory]);

	const handleAttributeToggle = useCallback((name, value) => {
		void updateFilter(ProductFilterKeys.ATTRIBUTES, { name, value });
	}, [updateFilter]);

	const isLoading = productsLoading || categoryLoading;
	const selectedAttributes = filters.attributes;

    return (
        <Container size="lg">
	        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
		        <SectionHeader
			        title={currentCategory?.name || categorySlug.replace(/-/g, ' ')}
			        className="mb-0"
		        />

		        <SortSelector
			        sortBy={filters.sort.sortBy}
			        order={filters.sort.order}
			        options={PRODUCT_SORT_OPTIONS}
			        onSortChange={(newSort) => void updateFilter(ProductFilterKeys.SORT, newSort)}
		        />
	        </div>

	        <div className="flex flex-col md:flex-row gap-8">
		        <aside className="w-full md:w-64 flex-shrink-0">
			        <div className="sticky top-24 space-y-8 bg-gray-900/50 p-5 rounded-xl border border-gray-800">
				        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
					        Filters
						</h3>

				        {facetsLoading
					        ? (
								<div className="flex justify-center py-10">
									<LoadingSpinner fullscreen={false} />
								</div>
					        )
					        : (
								<>
									{facets?.map(facet => (
										<div key={facet.name} className="space-y-3">
											<label className="text-xs font-semibold text-gray-500 uppercase tracking-tight">
												{facet.name}
											</label>
											<div className="flex flex-wrap gap-2">
												{facet.values?.map(val => {
													const isSelected = selectedAttributes[facet.name]?.includes(val);
													return (
														<button
															key={val}
															onClick={() => handleAttributeToggle(facet.name, val)}
															className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
																isSelected
																	? "bg-emerald-500 border-emerald-500 text-white"
																	: "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
															}`}
														>
															{val}
														</button>
													);
												})}
											</div>
										</div>
									))}

									{Object.keys(selectedAttributes).length > 0 && (
										<button
											onClick={clearFiltersAndFetch}
											className="w-full py-2 text-xs font-semibold text-red-400 hover:bg-red-400/10 rounded-lg border border-red-400/20 transition-colors"
										>
											Clear All Filters
										</button>
									)}
								</>
					        )
						}
			        </div>
		        </aside>

		        <div className="flex-1">
			        {isLoading ? (
				        <LoadingSpinner fullscreen={false} />
			        ) : products.length === 0 ? (
				        <EmptyState
					        title="No matches found"
					        description="Try changing your filters."
					        action={(
						        <Button variant="secondary" onClick={clearFiltersAndFetch}>
							        Clear All Filters
						        </Button>
					        )}
				        />
			        ) : (
				        <>
					        <ProductGrid products={products} />
					        {pagination?.pages > 1 && (
						        <div className="flex justify-center pt-10">
							        <Pagination
								        page={pagination.page}
								        pages={pagination.pages}
								        onChange={setPage}
							        />
						        </div>
					        )}
				        </>
			        )}
		        </div>
	        </div>
        </Container>
    );
};

export default CategoryPage;