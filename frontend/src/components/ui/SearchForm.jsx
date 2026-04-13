import {Search} from "lucide-react";

import IconButton from "./IconButton.jsx";
import {Input} from "./Input.jsx";

const SearchForm = ({value, onChange, onSearch, placeholder = "Search...", className = "", onFocus, onBlur }) => {
	const handleAction = (e) => {
		if (e) e.preventDefault();
		onSearch();
	}

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleAction(e);
		}
	};

	return (
		<div className={`flex flex-1 items-center gap-2 ${className}`}>
			<Input
				leftIcon={Search}
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onKeyDown={handleKeyDown}
				onFocus={onFocus}
				onBlur={onBlur}
			/>

			<IconButton onClick={handleAction} variant={"primary"} className="hidden lg:flex">
				<Search className="h-5 w-5" />
			</IconButton>
		</div>
	);
};

export default SearchForm;