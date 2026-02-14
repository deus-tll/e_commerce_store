import {useCallback, useState} from "react";
import {X} from "lucide-react";

import {useCategoryStore} from "../../../stores/useCategoryStore.js";
import {PaginationMaxLimits} from "../../../constants/app.js";

import FormField from "../../ui/FormField.jsx";
import IconButton from "../../ui/IconButton.jsx";
import SearchForm from "../../ui/SearchForm.jsx";
import LoadingSpinner from "../../ui/LoadingSpinner.jsx";

const CategorySearchField = ({ selectedCategory, onSelectCategory, onDeselectCategory, error }) => {
	const [categorySearchInput, setCategorySearchInput] = useState("");
	const [hasSearched, setHasSearched] = useState(false);
	const [searchError, setSearchError] = useState(undefined);

	const { categories, loading: categoryLoading, fetchCategories } = useCategoryStore();

	const handleSearchCategory = useCallback(async (e) => {
		e.preventDefault();

		const term = categorySearchInput.trim();

		setSearchError(undefined);
		setHasSearched(false);

		try {
			await fetchCategories({
				limit: PaginationMaxLimits.CATEGORIES,
				append: false,
				filters: term ? { search: term } : {}
			});
			setHasSearched(true);
		}
		// eslint-disable-next-line no-unused-vars
		catch (_) {
			setSearchError("Failed to search categories.");
		}
	}, [categorySearchInput, fetchCategories]);

	const selectCategory = useCallback((category) => {
		onSelectCategory(category);
		setCategorySearchInput("");
		setHasSearched(false);
		setSearchError(undefined);
	}, [onSelectCategory]);

	const displayError = error || searchError;

	return (
		<FormField label="Product Category" error={displayError}>
			<div className="relative">
				<SearchForm
					value={categorySearchInput}
					onChange={(e) => setCategorySearchInput(e.target.value)}
					onSubmit={handleSearchCategory}
					placeholder="Search category (e.g., 'shoes')"
				/>

				{/* Display selected category name */}
				{selectedCategory && (
					<div className="mt-2 p-2 bg-emerald-700 text-white rounded flex justify-between items-center">
						<span>Selected: {selectedCategory.name}</span>
						<IconButton
							type="button"
							onClick={onDeselectCategory}
							variant="ghost"
							className="text-white hover:text-red-300"
						>
							<X className="h-4 w-4" />
						</IconButton>
					</div>
				)}

				{/* Display Search Results */}
				{categoryLoading && (
					<div className="absolute z-20 w-full bg-gray-800 p-3 rounded-b-lg shadow-xl border border-gray-700">
						<LoadingSpinner fullscreen={false} />
					</div>
				)}

				{!categoryLoading && hasSearched && categories?.length > 0 && (
					<div className="absolute z-20 w-full bg-gray-800 p-2 rounded-b-lg shadow-xl border border-gray-700 max-h-48 overflow-y-auto">
						{categories.map((category) => (
							<div key={category.id}
							     onClick={() => selectCategory(category)}
							     className="p-2 cursor-pointer hover:bg-gray-700 rounded transition-colors text-sm"
							>
								{category.name}
							</div>
						))}
						<div className="text-xs text-gray-500 mt-2 p-1">Click to select</div>
					</div>
				)}

				{/* Handle No Results */}
				{!categoryLoading && hasSearched && categories?.length === 0 && (
					<div className="absolute z-20 w-full bg-gray-800 p-3 rounded-b-lg shadow-xl border border-gray-700 text-sm text-gray-400">
						No results for "{categorySearchInput}"
					</div>
				)}
			</div>
		</FormField>
	);
};

export default CategorySearchField;