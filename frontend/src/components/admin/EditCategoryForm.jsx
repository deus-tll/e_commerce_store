import { useEffect, useState } from "react";
import { ImageIcon, Type, Save } from "lucide-react";

import { useCategoryStore } from "../../stores/useCategoryStore.js";
import FormField from "../ui/FormField.jsx";
import { Input } from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

const EditCategoryForm = ({ category, onClose }) => {
    const { updateCategory, loading } = useCategoryStore();

    const [formData, setFormData] = useState({ name: category?.name || "", image: "" });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData({ name: category?.name || "", image: "" });
    }, [category]);

    const validate = () => {
        const next = {};
        if (!formData.name.trim()) next.name = "Name is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setFormData((prev) => ({ ...prev, image: reader.result }));
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            await updateCategory(category._id, formData);
            onClose?.();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Category Name" error={errors.name}>
                <Input
                    leftIcon={Type}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter category name"
                    error={!!errors.name}
                />
            </FormField>

            <FormField label="Image">
                <div className="flex items-center gap-3">
                    <label className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                        <ImageIcon className="h-5 w-5 inline-block mr-2" />
                        Upload Image
                        <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                    </label>
                    {(formData.image || category?.image) && (
                        <img src={formData.image || category?.image} alt="preview" className="h-12 w-12 rounded object-cover" />
                    )}
                </div>
            </FormField>

            <Button disabled={isSubmitting || loading} className="w-full justify-center">
                <Save className="h-4 w-4" />
                Save Changes
            </Button>
        </form>
    );
};

export default EditCategoryForm;


