import {Search} from "lucide-react";

import IconButton from "./IconButton.jsx";
import {Input} from "./Input.jsx";

const SearchForm = ({value, onChange, onSubmit, placeholder = "Search...", className = "", onFocus, onBlur }) => {
	const handleAction = (e) => {
		e.preventDefault();
		onSubmit(e);
	}

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			handleAction(e);
		}
	};

	return (
		<div onSubmit={onSubmit} className={`flex flex-1 items-center gap-2 ${className}`}>
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

			<IconButton type="button" onClick={handleAction} variant={"primary"} className="hidden lg:flex">
				<Search className="h-5 w-5" />
			</IconButton>
		</div>
	);
};

export default SearchForm;