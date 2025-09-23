import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";

import {useProductStore} from "../../stores/useProductStore.js";
import {useCategoryStore} from "../../stores/useCategoryStore.js";

import FormField from "../ui/FormField.jsx";
import { Input, Textarea, Select, FileInput } from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";

let productTemplate = {
	name: "",
	description: "",
	price: "",
	category: "",
	image: ""
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

		try {
			await createProduct(formData);
			setFormData({ ...productTemplate });
		}
		catch {
			console.error("Error creating product");
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setFormData({ ...formData, [e.target.name]: reader.result });
			};

			reader.readAsDataURL(file);
		}
	}

    return (
        <Card className="p-8 mb-8 max-w-xl mx-auto">
			<h2 className="text-2xl font-semibold mb-6 text-emerald-300">
				Create New Product
			</h2>

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

                <FileInput id="image" name="image" label="Upload Image" value={formData.image} onChange={handleImageChange} />

				<Button disabled={loading} className="w-full justify-center">
					<PlusCircle className="h-4 w-4" />
					Create Product
				</Button>
			</form>
        </Card>
	);
};

export default CreateProductForm;