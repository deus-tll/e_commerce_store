import {useState, useEffect, useMemo} from "react";
import {PlusCircle, Package, FilterX, Filter} from "lucide-react";

import {ProductFilterKeys, useProductStore} from "../../../stores/useProductStore.js";

import {ADMIN_PRODUCT_SORT_OPTIONS} from "../../../constants/productSortOptions.js";

import {createProductColumns} from "../tableColumns.jsx";

import DataList from "../DataList.jsx";
import ProductForm from "../forms/ProductForm.jsx";

import Toolbar from "../../ui/Toolbar.jsx";
import Button from "../../ui/Button.jsx";
import Card from "../../ui/Card.jsx";
import SearchForm from "../../ui/SearchForm.jsx";
import PaginationInfo from "../../ui/PaginationInfo.jsx";
import Modal from "../../ui/Modal.jsx";
import IconButton from "../../ui/IconButton.jsx";
import SortSelector from "../../ui/SortSelector.jsx";

const ProductsTab = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState("");

    const {
        products, pagination, filters, loading,
        fetchProducts, setPage, updateFilter, clearFilters, clearFiltersAndFetch, toggleFeaturedProduct, deleteProduct
    } = useProductStore();

    const hasActiveFilters = useMemo(() => {
        return Object.entries(filters).some(([key, value]) => {
            if (key === ProductFilterKeys.SORT) return false;

            return value !== "";
        });
    }, [filters]);

    useEffect(() => {
        void fetchProducts();
        return () => void clearFilters();
    }, [fetchProducts, clearFilters]);

    const handleCloseCreate = () => setIsCreateModalOpen(false);
    const handleCloseEdit = () => setEditingProduct(null);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        void updateFilter(ProductFilterKeys.SEARCH, search);
    };

    const handleResetAll = () => {
        setSearch("");
        void clearFiltersAndFetch();
    };

    const columns = useMemo(() =>
            createProductColumns({ loading, toggleFeaturedProduct, setEditingProduct, deleteProduct }),
        [loading, toggleFeaturedProduct, setEditingProduct, deleteProduct]
    );

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="p-6 mb-6">
                <Toolbar>
                    <SearchForm
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onSearch={handleSearch}
                        placeholder="Search products..."
                    />

                    <div className="flex gap-2">
                        {hasActiveFilters && (
                            <IconButton
                                variant="danger"
                                onClick={handleResetAll}
                                title="Clear Search & Filters"
                            >
                                <FilterX className="h-4 w-4" />
                            </IconButton>
                        )}

                        <Button
                            variant="secondary"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <Filter className="h-4 w-4" /> Sorting
                        </Button>

                        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" /> Create Product
                        </Button>
                    </div>

                    <PaginationInfo
                        pagination={pagination}
                        resourceName="products"
                    />
                </Toolbar>

                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end">
                        <SortSelector
                            sortBy={filters.sort.sortBy}
                            order={filters.sort.order}
                            options={ADMIN_PRODUCT_SORT_OPTIONS}
                            onSortChange={(newSort) => updateFilter(ProductFilterKeys.SORT, newSort)}
                        />
                    </div>
                )}
            </Card>

            <DataList
                data={products}
                columns={columns}
                pagination={pagination}
                onPageChange={setPage}
                emptyState={{
                    icon: Package,
                    title: "No products found",
                    description: "Create a product to fill up the list or try changing your search or filters."
                }}
            />

            <Modal title="Create Product" open={isCreateModalOpen} onClose={handleCloseCreate}>
                {isCreateModalOpen && <ProductForm onSuccess={handleCloseCreate} />}
            </Modal>

            <Modal title="Edit Product" open={!!editingProduct} onClose={handleCloseEdit}>
                {editingProduct && (
                    <ProductForm initialData={editingProduct} onSuccess={handleCloseEdit} />
                )}
            </Modal>
        </div>
    );
};

export default ProductsTab;