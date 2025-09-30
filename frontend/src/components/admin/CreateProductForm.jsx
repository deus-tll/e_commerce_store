import { useEffect, useState } from "react";
import { PlusCircle, X } from "lucide-react";

import {useProductStore} from "../../stores/useProductStore.js";
import {useCategoryStore} from "../../stores/useCategoryStore.js";

import FormField from "../ui/FormField.jsx";
import { Input, Textarea, Select, FileInput } from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import IconButton from "../ui/IconButton.jsx";

let productTemplate = {
	name: "",
	description: "",
	price: "",
	category: "",
	mainImage: "",
	additionalImages: [],
};

const CreateProductForm = () => {
	const [formData, setFormData] = useState({ ...productTemplate });

	const { loading, createProduct } = useProductStore();
	const { categories, fetchCategories } = useCategoryStore();

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const productData = {
			...formData,
			price: parseFloat(formData.price),
			images: {
				mainImage: formData.mainImage,
				additionalImages: formData.additionalImages.filter(img => img)
			}
		};

		try {
			await createProduct(productData);
			setFormData({ ...productTemplate });
		}
		catch (e) {
			console.error("Error creating product", e);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	const handleMainImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			setFormData(prev => ({ ...prev, [e.target.name]: reader.result }));
		};

		reader.readAsDataURL(file);
	}

	const handleAdditionalImagesChange = (e) => {
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
				[e.target.name]: [...prev.additionalImages, ...base64Images]
			}));
		});
	}

	const removeAdditionalImage = (indexToRemove) => {
		setFormData(prev => ({
			...prev,
			additionalImages: prev.additionalImages.filter((_, index) => index !== indexToRemove)
		}));
	}

    return (
	    <form onSubmit={handleSubmit} className="space-y-5" >
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
			    <FileInput
				    id="mainImage"
				    name="mainImage"
				    label="Upload Main Image"
				    value={formData.image}
				    onChange={handleMainImageChange}
			    />
			    {formData.mainImage && (
				    <div className="relative w-32 h-32 p-1">
					    <img src={formData.mainImage} alt="Main Preview" className="w-full h-full object-cover rounded" />
				    </div>
			    )}
		    </FormField>

		    <FormField label="Additional Images">
			    <FileInput
				    id="additionalImages"
				    name="additionalImages"
				    label="Upload Additional Images"
				    onChange={handleAdditionalImagesChange}
				    multiple
			    />
			    {formData.additionalImages.length > 0 && (
				    <div className="flex flex-wrap gap-3 mt-3">
					    {formData.additionalImages.map((image, index) => (
						    <div key={index} className="relative w-20 h-20">
							    <img src={image} alt={`Additional ${index}`} className="w-full h-full object-cover rounded" />

							    <IconButton
								    type="button"
								    onClick={() => removeAdditionalImage(index)}
								    variant="danger"
								    className="absolute -top-3 -right-3 h-6 w-6 rounded-3xl z-10"
								    applyBasePadding={false}
							    >
								    <X className="h-4 w-4" />
							    </IconButton>
						    </div>
					    ))}
				    </div>
			    )}
		    </FormField>

		    <Button disabled={loading} className="w-full justify-center">
			    <PlusCircle className="h-4 w-4" />
			    Create Product
		    </Button>
	    </form>
	);
};

export default CreateProductForm;