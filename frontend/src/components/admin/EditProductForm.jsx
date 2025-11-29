import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import { useProductStore } from "../../stores/useProductStore.js";
import { useCategoryStore } from "../../stores/useCategoryStore.js";

import Modal from "../ui/Modal.jsx";
import FormField from "../ui/FormField.jsx";
import { Input, Textarea, Select, FileInput } from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import IconButton from "../ui/IconButton.jsx";

const getInitialFormData = (product) => ({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    category: typeof product.category === "object" && product.category
        ? product.category.slug
        : product.category || "",
    currentMainImage: product.images?.image || "",
    existingAdditionalImages: product.images?.additionalImages || [],
    newMainImage: "",
    newAdditionalImages: [],
});

const EditProductForm = ({ product, onClose }) => {
    const [formData, setFormData] = useState(() => getInitialFormData(product));

    const { updateProduct, loading } = useProductStore();
    const { categories, fetchCategories } = useCategoryStore();

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    useEffect(() => {
        setFormData(getInitialFormData(product));
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalAdditionalImages = [
            ...formData.existingAdditionalImages,
            ...formData.newAdditionalImages
        ].filter(img => img);

        const finalMainImage = formData.newMainImage || formData.currentMainImage;

        const updatePayload = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            images: {
                mainImage: finalMainImage,
                additionalImages: finalAdditionalImages,
            }
        };

        try {
            await updateProduct(product._id, updatePayload);
            onClose();
        } catch (error) {
            console.error("Error updating product", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNewMainImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, [e.target.name]: reader.result }));
        };

        reader.readAsDataURL(file);
    }

    const handleNewAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const promises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then(base64Images => {
            setFormData(prev => ({
                ...prev,
                [e.target.name]: [...prev.newAdditionalImages, ...base64Images]
            }));
        });
    }

    const removeExistingAdditionalImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            existingAdditionalImages: prev.existingAdditionalImages.filter((_, index) => index !== indexToRemove)
        }));
    }

    const removeNewAdditionalImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            newAdditionalImages: prev.newAdditionalImages.filter((_, index) => index !== indexToRemove)
        }));
    }

    const currentMainImageSource = formData.newMainImage || formData.currentMainImage;

    return (
        <Modal open={true} onClose={onClose} title="Edit Product" maxWidth="max-w-xl">
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

                <FormField label="Main Image">
                    {currentMainImageSource && (
                        <div className="relative w-32 h-32 mb-3">
                            <img src={currentMainImageSource} alt="Main Preview" className="w-full h-full object-cover rounded" />
                        </div>
                    )}

                    <FileInput id="mainImage" name="mainImage" label="Change Main Image (Optional)" onChange={handleNewMainImageChange} />
                </FormField>

                <FormField label="Additional Images">
                    <div className="flex flex-wrap gap-3 mb-3 border-b border-gray-700 pb-3">
                        {formData.existingAdditionalImages.map((image, index) => (
                            <div key={`existing-${index}`} className="relative w-20 h-20 group rounded-lg overflow-hidden">
                                <img src={image} alt={`Existing ${index}`} className="w-full h-full object-cover" />

                                <IconButton
                                    type="button"
                                    onClick={() => removeExistingAdditionalImage(index)}
                                    variant="danger"
                                    className="absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-0"
                                    applyBasePadding={false}
                                >
                                    <X className="h-4 w-4" />
                                </IconButton>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3 mb-3">
                        {formData.newAdditionalImages.map((image, index) => (
                            <div key={`new-${index}`} className="relative w-20 h-20">
                                <img src={image} alt={`New ${index}`} className="w-full h-full object-cover rounded" />

                                <IconButton
                                    type="button"
                                    onClick={() => removeNewAdditionalImage(index)}
                                    variant="danger"
                                    className="absolute -top-3 -right-3 h-6 w-6 p-0 rounded-full z-10"
                                    applyBasePadding={false}
                                >
                                    <X className="h-4 w-4" />
                                </IconButton>
                            </div>
                        ))}
                    </div>

                    <FileInput
                        id="newAdditionalImages"
                        name="newAdditionalImages"
                        label="Add More Images"
                        onChange={handleNewAdditionalImagesChange}
                        multiple
                    />
                </FormField>

                <Button type="submit" className="w-full justify-center" disabled={loading}>
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </form>
        </Modal>
    );
};

export default EditProductForm;
