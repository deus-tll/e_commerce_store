import {useEffect, useCallback, useState} from "react";
import {PlusCircle, Save, Type, ImageIcon, X, ListPlus} from "lucide-react";

import useFormData from "../../../hooks/useFormData.js";
import {validateImage, validateRequired} from "../../../utils/validators.js";
import {readFileAsDataURL} from "../../../utils/fileReaders.js";
import {getFormDataPayloadForEdit} from "../../../utils/helpers.js";

import {useCategoryStore} from "../../../stores/useCategoryStore.js";

import FormField from "../../ui/FormField.jsx";
import {Input, FileInput} from "../../ui/Input.jsx";
import Button from "../../ui/Button.jsx";
import ErrorMessage from "../../ui/ErrorMessage.jsx";

const getInitialState = (category) => ({
	name: category?.name || "",
	image: "",
	allowedAttributes: category?.allowedAttributes || []
});

const validationRules = {
	name: (val) => validateRequired(val, "Category name"),
	image: (val, data) => validateImage(val, data.isEdit)
};

const CategoryForm = ({ initialData = null, onSuccess }) => {
	const isEdit = !!initialData;
	const [newAttr, setNewAttr] = useState("");

	const {
		formData,
		errors,
		setFormData,
		setFormField,
		setErrors,
		handleInputChange,
		validate
	} = useFormData(getInitialState(initialData));

	const { loading, error: categoryApiError, createCategory, updateCategory, clearError } = useCategoryStore();

	useEffect(() => {
		setFormData(getInitialState(initialData));
		clearError();
		return () => clearError();
	}, [initialData, setFormData, clearError]);

	const handleImageChange = useCallback(async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const base64 = await readFileAsDataURL(file);
			setFormField("image", base64);
		}
		// eslint-disable-next-line no-unused-vars
		catch (error) {
			setErrors(prev => ({ ...prev, image: "Failed to read image file." }));
		}
	}, [setFormField, setErrors]);

	const addAttribute = () => {
		const attr = newAttr.trim();

		if (!attr) return;
		if (formData.allowedAttributes.includes(attr)) {
			setErrors(prev => ({ ...prev, allowedAttributes: "Attribute already exists" }));
			return;
		}

		setFormField("allowedAttributes", [...formData.allowedAttributes, attr]);
		setNewAttr("");
	}

	const removeAttribute = (attrToRemove) => {
		setFormField("allowedAttributes", formData.allowedAttributes.filter(a => a !== attrToRemove));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		clearError();

		if (!validate(validationRules, { isEdit })) return;

		let payload = formData;

		if(isEdit) {
			payload = getFormDataPayloadForEdit(getInitialState(initialData), payload, { excludeIfEmpty: ["image"] });

			if (Object.keys(payload).length === 0) {
				onSuccess?.();
				return;
			}

			if (await updateCategory(initialData.id, payload)) {
				onSuccess?.();
			}
		}
		else {
			if (await createCategory(payload)) {
				setFormData(getInitialState(null));
				onSuccess?.();
			}
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<ErrorMessage message={categoryApiError} />

			<FormField label="Category Name" error={errors.name}>
				<Input
					leftIcon={Type}
					name="name"
					value={formData.name}
					onChange={handleInputChange}
					placeholder="Enter category name"
					error={!!errors.name}
				/>
			</FormField>

			{/* Allowed Attributes Logic */}
			<div className="space-y-3">
				<FormField label="Allowed Attributes" error={errors.allowedAttributes}>
					<div className="flex gap-2">
						<Input
							leftIcon={ListPlus}
							value={newAttr}
							onChange={(e) => setNewAttr(e.target.value)}
							placeholder="e.g. RAM, Material, Brand"
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									addAttribute();
								}
							}}
						/>
						<Button type="button" variant="secondary" onClick={addAttribute}>
							Add
						</Button>
					</div>
				</FormField>

				{/* Attribute Tags Display */}
				<div className="flex flex-wrap gap-2">
					{formData.allowedAttributes.map((attr) => (
						<span key={String(attr)} className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-white text-sm rounded-full border border-gray-600">
							{attr}
							<button
								type="button"
								onClick={() => removeAttribute(attr)}
								className="hover:text-red-400 transition-colors"
							>
								<X className="h-3 w-3" />
							</button>
						</span>
					))}
				</div>
			</div>

			<FileInput
				id="image"
				name="image"
				label={isEdit ? "Upload New Image (Optional)" : "Upload Category Image"}
				leftIcon={ImageIcon}
				error={errors.image}
				onChange={handleImageChange}
				preview={
					(formData.image || initialData?.image) && (
						<img
							src={formData.image || initialData?.image}
							alt="preview"
							className="ml-3 h-12 w-12 rounded object-cover"
						/>
					)
				}
			/>

			<Button disabled={loading} className="w-full justify-center">
				{isEdit ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
				{loading
					? (isEdit ? 'Saving...' : 'Creating...')
					: (isEdit ? 'Save Changes' : 'Create Category')
				}
			</Button>
		</form>
	);
};

export default CategoryForm;