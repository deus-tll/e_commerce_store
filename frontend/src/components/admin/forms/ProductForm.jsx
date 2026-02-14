import {useCallback, useEffect, useState} from "react";
import {PlusCircle, Save, Package} from "lucide-react";

import useFormData from "../../../hooks/useFormData.js";
import {validatePrice, validateRequired, validateStock} from "../../../utils/validators.js";
import {readFileAsDataURL, readFilesAsDataURLs} from "../../../utils/fileReaders.js";
import {getFormDataPayloadForEdit} from "../../../utils/helpers.js";

import {useProductStore} from "../../../stores/useProductStore.js";

import MainImageField from "../fields/MainImageField.jsx";
import AdditionalImagesField from "../fields/AdditionalImagesField.jsx";
import CategorySearchField from "../fields/CategorySearchField.jsx";

import FormField from "../../ui/FormField.jsx";
import {Input, Textarea} from "../../ui/Input.jsx";
import Button from "../../ui/Button.jsx";
import ErrorMessage from "../../ui/ErrorMessage.jsx";

const getInitialState = (product) => ({
	name: product?.name || "",
	description: product?.description || "",
	price: product?.price !== undefined ? String(product.price) : "",
	stock: product?.stock !== undefined ? String(product.stock) : "0",
	categoryId: product?.category?.id || "",
	attributes: product?.attributes?.reduce((acc, attr) => ({
		...acc,
		[attr.name]: attr.value
	}), {}) || {},
	mainImage: product?.images?.mainImage || "",
	additionalImages: product?.images?.additionalImages || [],
});

const validationRules = {
	name: (val) => validateRequired(val, "Product name"),
	description: (val) => validateRequired(val, "Description"),
	price: validatePrice,
	stock: validateStock,
	categoryId: (val) => validateRequired(val, "Category selection"),
	mainImage: (val) => validateRequired(val, "Main image"),
};

const getAttributesArray = (allowedNames, attributesObject) => {
	return Object.entries(attributesObject)
		.filter(([name]) => allowedNames.includes(name))
		.map(([name, value]) => ({ name, value }));
}

const ProductForm = ({ initialData = null, onSuccess }) => {
	const isEdit = !!initialData;
	const [selectedCategory, setSelectedCategory] = useState(initialData?.category || null);

	const {
		formData,
		errors,
		setFormData,
		setFormField,
		setErrors,
		handleInputChange,
		validate
	} = useFormData(getInitialState(initialData));

	const {
		loading,
		error: productApiError,
		createProduct,
		updateProduct,
		clearError
	} = useProductStore();

	useEffect(() => {
		setFormData(getInitialState(initialData));
		setSelectedCategory(initialData?.category || null);
		clearError();
		return () => clearError();
	}, [initialData, setFormData, clearError]);

	const handleMainImageChange = useCallback(async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		try {
			const result = await readFileAsDataURL(file);
			setFormField("mainImage", result);
		}
		// eslint-disable-next-line no-unused-vars
		catch (error) {
			setErrors(prev => ({ ...prev, mainImage: "Failed to read image file." }));
		}
	}, [setFormField, setErrors]);

	const handleAdditionalImagesChange = useCallback(async (e) => {
		const fileList = e.target.files;
		if (!fileList || fileList.length === 0) return;

		try {
			const base64Images = await readFilesAsDataURLs(fileList);
			if (base64Images.length === 0) return;

			setFormData(prev => ({
				...prev,
				additionalImages: [...prev.additionalImages, ...base64Images]
			}));

			setErrors(prev => {
				if (!prev.additionalImages) return prev;
				const newErrors = { ...prev };
				delete newErrors.additionalImages;
				return newErrors;
			});
		}
		// eslint-disable-next-line no-unused-vars
		catch (error) {
			setErrors(prev => ({ ...prev, additionalImages: "Error reading additional images." }));
		}
	}, [setFormData, setErrors]);

	const removeAdditionalImage = useCallback((indexToRemove) => {
		setFormData(prev => ({
			...prev,
			additionalImages: prev.additionalImages.filter((_, index) => index !== indexToRemove)
		}));
	}, [setFormData]);

	const handleSelectCategory = useCallback((category) => {
		setFormField("categoryId", category.id);
		setSelectedCategory(category);
	}, [setFormField]);

	const handleDeselectCategory = useCallback(() => {
		setFormField("categoryId", "");
		setErrors(prev => ({ ...prev, categoryId: "Category selection is required." }));
	}, [setFormField, setErrors]);

	const handleAttributeChange = (name, value) => {
		setFormField("attributes", {
			...formData.attributes,
			[name]: value
		});
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		clearError();

		if (!validate(validationRules)) return;

		const allowedNames = selectedCategory?.allowedAttributes || [];
		const attributesArray = getAttributesArray(allowedNames, formData.attributes);

		if (isEdit) {
			const changedFields = getFormDataPayloadForEdit(getInitialState(initialData), formData, {
				excludeIfEmpty: ["mainImage"],
				exclude: ["attributes"]
			});

			const initialAttrs = (initialData.attributes || []).map(attr => ({
				name: attr.name,
				value: attr.value
			}));

			const attributesChanged = JSON.stringify(attributesArray) !== JSON.stringify(initialAttrs);

			if (Object.keys(changedFields).length === 0 && !attributesChanged) {
				onSuccess?.();
				return;
			}

			const { price, stock, mainImage, additionalImages, ...rest } = changedFields;

			let payload = {
				...rest
			};

			if (price !== undefined) payload.price = parseFloat(price);
			if (stock !== undefined) payload.stock = parseInt(stock, 10);

			if (attributesChanged) payload.attributes = attributesArray;

			const imageUpdate = {};
			if (mainImage !== undefined) imageUpdate.mainImage = mainImage;
			if (additionalImages !== undefined) imageUpdate.additionalImages = additionalImages;
			if (Object.keys(imageUpdate).length > 0) {
				payload.images = imageUpdate;
			}

			if (await updateProduct(initialData.id, payload)) {
				onSuccess?.();
			}
		}
		else {
			const { price, stock, mainImage, additionalImages, ...rest } = formData;

			const payload = {
				...rest,
				price: parseFloat(price),
				stock: parseInt(stock, 10),
				attributes: attributesArray,
				images: {
					mainImage: mainImage,
					additionalImages: additionalImages
				}
			};

			if (await createProduct(payload)) {
				setFormData(getInitialState(null));
				onSuccess?.();
			}
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<ErrorMessage message={productApiError} />

			<FormField label="Product Name" error={errors.name}>
				<Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
			</FormField>

			<FormField label="Product Description" error={errors.description}>
				<Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={4} />
			</FormField>

			<div className="grid grid-cols-2 gap-4">
				<FormField label="Price ($)" error={errors.price}>
					<Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} step="0.01" />
				</FormField>

				<FormField label="Quantity in Stock" error={errors.stock}>
					<Input
						id="stock"
						name="stock"
						type="number"
						leftIcon={Package}
						value={formData.stock}
						onChange={handleInputChange}
					/>
				</FormField>
			</div>

			<CategorySearchField
				selectedCategory={selectedCategory}
				onSelectCategory={handleSelectCategory}
				onDeselectCategory={handleDeselectCategory}
				error={errors.categoryId}
			/>

			{selectedCategory?.allowedAttributes?.length > 0 && (
				<div className="p-4 bg-gray-800/40 rounded-lg border border-gray-700 space-y-4">
					<h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
						Allowed attributes for {selectedCategory.name}
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{selectedCategory.allowedAttributes.map((attrName) => (
							<FormField key={String(attrName)} label={attrName}>
								<Input
									placeholder={`Value for ${attrName}`}
									value={formData.attributes[attrName] || ""}
									onChange={(e) => handleAttributeChange(attrName, e.target.value)}
								/>
							</FormField>
						))}
					</div>
				</div>
			)}

			<MainImageField
				mainImage={formData.mainImage}
				onImageChange={handleMainImageChange}
				error={errors.mainImage}
			/>

			<AdditionalImagesField
				additionalImages={formData.additionalImages}
				onImagesChange={handleAdditionalImagesChange}
				onImageRemove={removeAdditionalImage}
			/>

			<Button disabled={loading} type="submit" className="w-full justify-center">
				{isEdit ? <Save className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
				{loading
					? (isEdit ? 'Saving...' : 'Creating...')
					: (isEdit ? 'Save Changes' : 'Create Product')
				}
			</Button>
		</form>
	);
};

export default ProductForm;