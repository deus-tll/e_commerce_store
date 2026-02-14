import {useState, useEffect, useMemo, useCallback} from "react";
import {PlusCircle} from "lucide-react";

import {useProductStore} from "../../../stores/useProductStore.js";

import {createProductColumns} from "../tableColumns.jsx";

import ProductsList from "../lists/ProductsList.jsx";

import ProductForm from "../forms/ProductForm.jsx";

import Toolbar from "../../ui/Toolbar.jsx";
import Button from "../../ui/Button.jsx";
import Card from "../../ui/Card.jsx";
import SearchForm from "../../ui/SearchForm.jsx";
import PaginationInfo from "../../ui/PaginationInfo.jsx";
import Modal from "../../ui/Modal.jsx";

const ProductsTab = () => {
    const [page, setPage] = useState(1);
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const { products, pagination, loading, fetchProducts, toggleFeaturedProduct, deleteProduct } = useProductStore();

    const handleFetchProducts = useCallback((currentPage, currentSearchTerm) => {
        const filters = currentSearchTerm ? { search: currentSearchTerm } : {};

        void fetchProducts({
            page: currentPage,
            filters: filters
        });
    }, [fetchProducts])

    useEffect(() => {
        handleFetchProducts(page, searchTerm);
    }, [page, searchTerm, handleFetchProducts]);

    const handleCloseCreate = () => setShowCreate(false);
    const handleCloseEdit = () => setEditing(null);

    const handleSearch = useCallback((e) => {
        e.preventDefault();

        setPage(1);
        setSearchTerm(search);
    }, [search]);

    const columns = useMemo(() =>
            createProductColumns({ loading, toggleFeaturedProduct, startEdit: setEditing, deleteProduct }),
        [loading, toggleFeaturedProduct, setEditing, deleteProduct]
    );

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="p-6 mb-6">
                <Toolbar>
                    <SearchForm
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onSubmit={handleSearch}
                        placeholder="Search products..."
                    />

                    <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" /> Create Product
                    </Button>

                    <PaginationInfo
                        pagination={pagination}
                        page={page}
                        resourceName="products"
                    />
                </Toolbar>
            </Card>

            <Card className="overflow-hidden">
                <ProductsList
                    products={products}
                    columns={columns}
                    pagination={pagination}
                    page={page}
                    setPage={setPage}
                />

                <Modal title="Create Product" open={showCreate} onClose={handleCloseCreate}>
                    {showCreate && <ProductForm />}
                </Modal>

                <Modal title="Edit Product" open={!!editing} onClose={handleCloseEdit}>
                    {editing && (
                        <ProductForm initialData={editing} onSuccess={handleCloseEdit} />
                    )}
                </Modal>
            </Card>
        </div>
    );
};

export default ProductsTab;