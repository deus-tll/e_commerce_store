import { useEffect, useState } from "react";
import { Pencil, Trash2, Search } from "lucide-react";
import { useCategoryStore } from "../../stores/useCategoryStore.js";
import Modal from "../ui/Modal.jsx";
import IconButton from "../ui/IconButton.jsx";
import EmptyState from "../ui/EmptyState.jsx";
import Card from "../ui/Card.jsx";
import CategoryEditForm from "./CategoryEditForm.jsx";
import Toolbar from "../ui/Toolbar.jsx";
import Button from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";

const CategoriesList = ({ onCreate }) => {
    const { categories, fetchCategories, deleteCategory } = useCategoryStore();
    const [editingCategory, setEditingCategory] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const startEdit = (cat) => setEditingCategory(cat);
    const closeEdit = () => setEditingCategory(null);

    const filtered = search.trim() ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : categories;

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="p-6 mb-6">
                <Toolbar>
                    <div className="relative flex-1 max-w-md">
                        <Input leftIcon={Search} type="text" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <Button onClick={onCreate} className="flex items-center gap-2">
                        <Pencil className="h-4 w-4" /> Create Category
                    </Button>
                    <div className="text-gray-300 text-sm">
                        {filtered.length} categories
                    </div>
                </Toolbar>
            </Card>

            <Card className="overflow-hidden">
            {(!filtered || filtered.length === 0) ? (
                <EmptyState title="No categories" description="Create a category to organize your products." />
            ) : (
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {filtered.map((cat) => (
                        <tr key={cat._id} className="hover:bg-gray-700 ">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <img src={cat.image} alt={cat.name} className="h-20 w-20 object-cover rounded" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-300">{cat.name}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <>
                                    <IconButton onClick={() => startEdit(cat)} className="text-blue-400 hover:text-blue-300">
                                        <Pencil className="h-5 w-5" />
                                    </IconButton>
                                    <IconButton onClick={() => deleteCategory(cat._id)} className="text-red-400 hover:text-red-300">
                                        <Trash2 className="h-5 w-5" />
                                    </IconButton>
                                </>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
            <Modal open={!!editingCategory} onClose={closeEdit} title="Edit Category">
                {editingCategory && (
                    <CategoryEditForm category={editingCategory} onClose={closeEdit} />
                )}
            </Modal>
        </Card>
        </div>
    );
};

export default CategoriesList;

