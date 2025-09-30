import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { useCategoryStore } from "../../stores/useCategoryStore.js";
import FormField from "../ui/FormField.jsx";
import { Input, FileInput } from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";

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
	    <form onSubmit={handleSubmit} className="space-y-5">
		    <FormField label="Category Name">
			    <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} />
		    </FormField>

		    <FileInput id="image" name="image" label="Upload Image" value={formData.image} onChange={handleImageChange} />

		    <Button disabled={loading} className="w-full justify-center">
			    <PlusCircle className="h-4 w-4" />
			    Create Category
		    </Button>
	    </form>
	);
};

export default CreateCategoryForm;



