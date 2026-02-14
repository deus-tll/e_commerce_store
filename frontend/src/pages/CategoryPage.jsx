import {useCallback, useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";

import {useProductStore} from "../stores/useProductStore.js";
import {useCategoryStore} from "../stores/useCategoryStore.js";

import ProductGrid from "../components/product/ProductGrid.jsx";
import SortSelector from "../components/product/SortSelector.jsx";

import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Button from "../components/ui/Button.jsx";

const CategoryPage = () => {
	const { category: categorySlug } = useParams();

	const [page, setPage] = useState(1);
	const [selectedAttributes, setSelectedAttributes] = useState({});
	const [sortConfig, setSortConfig] = useState({ sortBy: 'createdAt', order: 'desc' });

	const lastSlug = useRef(categorySlug);

	const {
		products,
		pagination,
		facets,
		loading: productsLoading,
		fetchProducts,
		fetchFacets
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
				setPage(1);
				setSelectedAttributes({});
			}

			const success = await fetchCategoryBySlug(categorySlug);
			const categoryId = useCategoryStore.getState().currentCategory?.id;

			if (success && categoryId) {
				void fetchFacets(categoryId);
			}
		};

		void loadData();

		return () => clearCurrentCategory();
	}, [categorySlug, fetchCategoryBySlug, fetchFacets, clearCurrentCategory]);

	useEffect(() => {
		if (!categorySlug) return;

		const isMidReset = categorySlug !== lastSlug.current && page !== 1;

		if (!isMidReset) {
			void fetchProducts({
				page: page,
				filters: {
					categorySlug,
					attributes: selectedAttributes,
					...sortConfig
				}
			});

			lastSlug.current = categorySlug;
		}
	}, [categorySlug, page, selectedAttributes, sortConfig, fetchProducts]);

	const handleFilterChange = useCallback((name, value) => {
		setPage(1);

		setSelectedAttributes(prev => {
			const current = prev[name] || [];
			const isSelected = current.includes(value);

			const nextValues = isSelected
				? current.filter(v => v !== value)
				: [...current, value];

			const nextState = {...prev, [name]: nextValues };
			if (nextValues.length === 0) delete nextState[name];

			return nextState;
		});
	}, []);

	const isLoading = productsLoading || categoryLoading;

    return (
        <Container size="lg">
	        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
		        <SectionHeader
			        title={currentCategory?.name || categorySlug.replace(/-/g, ' ')}
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

	        <div className="flex flex-col md:flex-row gap-8">
		        <aside className="w-full md:w-64 flex-shrink-0">
			        <div className="sticky top-24 space-y-8 bg-gray-900/50 p-5 rounded-xl border border-gray-800">
				        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
					        Filters
						</h3>

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
										        onClick={() => handleFilterChange(facet.name, val)}
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
						        onClick={() => { setSelectedAttributes({}); setPage(1); }}
						        className="w-full py-2 text-xs font-semibold text-red-400 hover:bg-red-400/10 rounded-lg border border-red-400/20 transition-colors"
					        >
						        Clear All Filters
					        </button>
				        )}
			        </div>
		        </aside>

		        <div className="flex-1">
			        {isLoading ? (
				        <LoadingSpinner fullscreen={false} />
			        ) : products.length === 0 ? (
				        <EmptyState
					        title="No matches found"
					        description="Try changing your filters or sorting order."
					        action={(
						        <Button variant="secondary" onClick={() => { setSelectedAttributes({}); setPage(1); }}>
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
								        page={page}
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