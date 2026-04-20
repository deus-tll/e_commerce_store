import {useCallback, useEffect, useState} from "react";
import {FilterX, X} from "lucide-react";

import {useCategoryStore} from "../../../stores/useCategoryStore.js";

import FormField from "../../ui/FormField.jsx";
import IconButton from "../../ui/IconButton.jsx";
import SearchForm from "../../ui/SearchForm.jsx";
import LoadingSpinner from "../../ui/LoadingSpinner.jsx";

const CategorySearchField = ({ selectedCategory, onSelectCategory, onDeselectCategory, error }) => {
	const [categorySearchInput, setCategorySearchInput] = useState("");
	const [hasSearched, setHasSearched] = useState(false);
	const [searchError, setSearchError] = useState(undefined);

	const {
		searchResults, searchLoading,
		searchCategories, clearSearchResults
	} = useCategoryStore();

	useEffect(() => {
		return () => clearSearchResults();
	}, [clearSearchResults]);

	const handleSearchCategory = useCallback(async (e) => {
		if (e) e.preventDefault();

		const term = categorySearchInput.trim();
		if (!term) return;

		setSearchError(undefined);
		setHasSearched(false);

		await searchCategories(term);
		setHasSearched(true);
	}, [categorySearchInput, searchCategories]);

	const handleResetSearchResults = useCallback((e = {}) => {
		if (e) e.preventDefault();

		setCategorySearchInput("");
		setHasSearched(false);
		setSearchError(undefined);
		clearSearchResults();
	}, [clearSearchResults]);

	const selectCategory = useCallback((category) => {
		onSelectCategory(category);
		handleResetSearchResults();
	}, [onSelectCategory, handleResetSearchResults]);

	const displayError = error || searchError;

	return (
		<FormField label="Product Category" error={displayError}>
			<div className="relative">
				<div className="flex">
					<SearchForm
						value={categorySearchInput}
						onChange={(e) => setCategorySearchInput(e.target.value)}
						onSearch={handleSearchCategory}
						placeholder="Search category (e.g., 'shoes')"
					/>

					{searchResults.length > 0 && categorySearchInput.length > 0 &&
						<div className="flex items-center gap-2">
							<IconButton
								variant="danger"
								onClick={handleResetSearchResults}
								title="Clear Search Results"
							>
								<FilterX className="h-5 w-5" />
							</IconButton>
						</div>
					}
				</div>

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
				{searchLoading && (
					<div className="absolute z-20 w-full bg-gray-800 p-3 rounded-b-lg shadow-xl border border-gray-700">
						<LoadingSpinner fullscreen={false} />
					</div>
				)}

				{!searchLoading && hasSearched && searchResults.length > 0 && (
					<div className="absolute z-20 w-full bg-gray-800 p-2 rounded-b-lg shadow-xl border border-gray-700 max-h-48 overflow-y-auto">
						{searchResults.map((category) => (
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
				{!searchLoading && hasSearched && searchResults.length === 0 && (
					<div className="absolute z-20 w-full bg-gray-800 p-3 rounded-b-lg shadow-xl border border-gray-700 text-sm text-gray-400">
						No results for "{categorySearchInput}"
					</div>
				)}
			</div>
		</FormField>
	);
};

export default CategorySearchField;