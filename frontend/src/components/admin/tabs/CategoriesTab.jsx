import {useEffect, useMemo, useState} from "react";
import {PlusCircle, Layers} from "lucide-react";

import {CategoryFilterKeys, useCategoryStore} from "../../../stores/useCategoryStore.js";

import {createCategoryColumns} from "../tableColumns.jsx";

import DataList from "../DataList.jsx";
import CategoryForm from "../forms/CategoryForm.jsx";

import Modal from "../../ui/Modal.jsx";
import Card from "../../ui/Card.jsx";
import Toolbar from "../../ui/Toolbar.jsx";
import Button from "../../ui/Button.jsx";
import SearchForm from "../../ui/SearchForm.jsx";
import PaginationInfo from "../../ui/PaginationInfo.jsx";

const CategoriesTab = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [search, setSearch] = useState("");

    const {
        categories, pagination,
        fetchCategories, setPage, updateFilter, clearFilters, deleteCategory
    } = useCategoryStore();

    useEffect(() => {
        void fetchCategories();
        return () => void clearFilters();
    }, [fetchCategories, clearFilters]);

    const handleCloseCreate = () => setIsCreateModalOpen(false);
    const handleCloseEdit = () => setEditingCategory(null);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        void updateFilter(CategoryFilterKeys.SEARCH, search);
    };

    const columns = useMemo(() =>
            createCategoryColumns({ setEditingCategory, deleteCategory }),
        [setEditingCategory, deleteCategory]
    );

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="p-6 mb-6">
                <Toolbar>
                    <SearchForm
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onSearch={handleSearch}
                        placeholder="Search categories..."
                    />

                    <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" /> Create Category
                    </Button>

                    <PaginationInfo
                        pagination={pagination}
                        resourceName="categories"
                    />
                </Toolbar>
            </Card>

            <Card className="overflow-hidden">
                <DataList
                    data={categories}
                    columns={columns}
                    pagination={pagination}
                    onPageChange={setPage}
                    emptyState={{
                        icon: Layers,
                        title: "No categories found",
                        description: "Create a category to organize your products."
                    }}
                />

                <Modal title="Create Category" open={isCreateModalOpen} onClose={handleCloseCreate}>
                    {isCreateModalOpen && <CategoryForm onSuccess={handleCloseEdit} />}
                </Modal>

                <Modal title="Edit Category" open={!!editingCategory} onClose={handleCloseEdit}>
                    {editingCategory && <CategoryForm initialData={editingCategory} onSuccess={handleCloseEdit} />}
                </Modal>
            </Card>
        </div>
    );
};

export default CategoriesTab;