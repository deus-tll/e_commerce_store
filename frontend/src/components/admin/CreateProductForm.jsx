import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";

import {useProductStore} from "../../stores/useProductStore.js";
import {useCategoryStore} from "../../stores/useCategoryStore.js";

import FormInput from "../FormInput.jsx";
import SubmitButton from "../SubmitButton.jsx";
import FormFileInput from "../FormFileInput.jsx";

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
		<motion.div
			className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className="text-2xl font-semibold mb-6 text-emerald-300">
				Create New Product
			</h2>

			<form onSubmit={handleSubmit} className="space-y-5" >
				<FormInput
					label="Product Name"
					inputElement="input"
					id="name"
					name="name"
					type="text"
					value={formData.name}
					onChange={handleInputChange}
				/>

				<FormInput
					label="Product Description"
					inputElement="textarea"
					id="description"
					name="description"
					value={formData.description}
					onChange={handleInputChange}
					rows="4"
				/>

				<FormInput
					label="Product Price"
					inputElement="input"
					id="price"
					name="price"
					type="number"
					value={formData.price}
					onChange={handleInputChange}
					step="0.01"
				/>

				<FormInput
					label="Product Category"
					inputElement="select"
					id="category"
					name="category"
					value={formData.category}
					onChange={handleInputChange}
				>
					<option value="">Select a category</option>
					{categories.map((category) => (
						<option key={category._id} value={category.slug}>
							{category.name}
						</option>
					))}
				</FormInput>

				<FormFileInput
					label="Upload Image"
					id="image"
					name="image"
					value={formData.image}
					onChange={handleImageChange}
				/>

				<SubmitButton loading={loading} text="Create Product" icon={PlusCircle} />
			</form>
		</motion.div>
	);
};

export default CreateProductForm;