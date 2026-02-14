import {useCallback, useEffect, useMemo, useState} from "react";
import {PlusCircle} from "lucide-react";

import {useCategoryStore} from "../../../stores/useCategoryStore.js";

import {createCategoryColumns} from "../tableColumns.jsx";

import CategoriesList from "../lists/CategoriesList.jsx";
import CategoryForm from "../forms/CategoryForm.jsx";

import Modal from "../../ui/Modal.jsx";
import Card from "../../ui/Card.jsx";
import Toolbar from "../../ui/Toolbar.jsx";
import Button from "../../ui/Button.jsx";
import SearchForm from "../../ui/SearchForm.jsx";
import PaginationInfo from "../../ui/PaginationInfo.jsx";

const CategoriesTab = () => {
    const [page, setPage] = useState(1);
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const { categories, pagination, fetchCategories, deleteCategory } = useCategoryStore();

    const handleFetchCategories = useCallback((currentPage, currentSearchTerm) => {
        const filters = currentSearchTerm ? { search: currentSearchTerm } : {};

        void fetchCategories({
            page: currentPage,
            append: false,
            filters: filters
        });
    }, [fetchCategories]);

    useEffect(() => {
        handleFetchCategories(page, searchTerm);
    }, [page, searchTerm, handleFetchCategories]);

    const handleCloseCreate = () => setShowCreate(false);
    const handleCloseEdit = () => setEditing(null);

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        setPage(1);
        setSearchTerm(search);
    }, [search]);

    const columns = useMemo(() =>
            createCategoryColumns({ startEdit: setEditing, deleteCategory }),
        [setEditing, deleteCategory]
    );

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="p-6 mb-6">
                <Toolbar>
                    <SearchForm
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onSubmit={handleSearch}
                        placeholder="Search categories..."
                    />

                    <Button onClick={() => setShowCreate(true)} className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" /> Create Category
                    </Button>

                    <PaginationInfo
                        pagination={pagination}
                        page={page}
                        resourceName="categories"
                    />
                </Toolbar>
            </Card>

            <Card className="overflow-hidden">
                <CategoriesList
                    categories={categories}
                    columns={columns}
                    pagination={pagination}
                    page={page}
                    setPage={setPage}
                />

                <Modal title="Create Category" open={showCreate} onClose={handleCloseCreate}>
                    {showCreate && <CategoryForm />}
                </Modal>

                <Modal title="Edit Category" open={!!editing} onClose={handleCloseEdit}>
                    {editing && <CategoryForm initialData={editing} onSuccess={handleCloseEdit} />}
                </Modal>
            </Card>
        </div>
    );
};

export default CategoriesTab;