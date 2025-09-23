import { useEffect, useState } from "react";
import { Save } from "lucide-react";

import { useProductStore } from "../../stores/useProductStore.js";
import { useCategoryStore } from "../../stores/useCategoryStore.js";

import Modal from "../ui/Modal.jsx";
import FormField from "../ui/FormField.jsx";
import { Input, Textarea, Select, FileInput } from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

const ProductEditForm = ({ product, onClose }) => {
    const { updateProduct, loading } = useProductStore();
    const { categories, fetchCategories } = useCategoryStore();

    const [formData, setFormData] = useState({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: typeof product.category === "object" && product.category ? product.category.slug : product.category || "",
        image: ""
    });

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    useEffect(() => {
        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            category: typeof product.category === "object" && product.category ? product.category.slug : product.category || "",
            image: ""
        });
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result }));
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(product._id, formData);
            onClose();
        } catch (error) {
            console.error("Error updating product", error);
        }
    };

    return (
        <Modal open={true} onClose={onClose} title="Edit Product">
            <form onSubmit={handleSubmit} className="space-y-5">
                <FormField label="Product Name">
                    <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} />
                </FormField>

                <FormField label="Product Description">
                    <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} />
                </FormField>

                <FormField label="Product Price">
                    <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} step="0.01" />
                </FormField>

                <FormField label="Product Category">
                    <Select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category.slug}>
                                {category.name}
                            </option>
                        ))}
                    </Select>
                </FormField>

                <FileInput id="image" name="image" label="Upload Image" value={formData.image} onChange={handleImageChange} />

                <Button type="submit" className="w-full justify-center" disabled={loading}>
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </form>
        </Modal>
    );
};

export default ProductEditForm;
