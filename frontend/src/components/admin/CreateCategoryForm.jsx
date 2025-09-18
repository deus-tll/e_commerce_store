import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";

import { useCategoryStore } from "../../stores/useCategoryStore.js";
import FormInput from "../FormInput.jsx";
import SubmitButton from "../SubmitButton.jsx";
import FormFileInput from "../FormFileInput.jsx";

const template = { name: "", image: "" };

const CreateCategoryForm = () => {
	const [formData, setFormData] = useState({ ...template });
	const { loading, createCategory } = useCategoryStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await createCategory(formData);
		setFormData({ ...template });
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];

		if (!file) return;

		const reader = new FileReader();
		reader.onloadend = () => setFormData({ ...formData, image: reader.result });
		reader.readAsDataURL(file);
	};

	return (
		<motion.div className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className="text-2xl font-semibold mb-6 text-emerald-300">Create Category</h2>

			<form onSubmit={handleSubmit} className="space-y-5">
				<FormInput
					label="Category Name"
					inputElement="input"
					id="name"
					name="name"
					type="text"
					value={formData.name}
					onChange={handleInputChange}
				/>

				<FormFileInput
					label="Upload Image"
					id="image"
					name="image"
					value={formData.image}
					onChange={handleImageChange}
				/>

				<SubmitButton loading={loading} text="Create Category" icon={PlusCircle} />
			</form>
		</motion.div>
	);
};

export default CreateCategoryForm;



