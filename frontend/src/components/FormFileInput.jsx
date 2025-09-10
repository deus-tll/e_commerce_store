import {Upload} from "lucide-react";

const FormFileInput = ({ label, id, name, value, onChange }) => {
	return (
		<div className="mt-1 flex items-center">
			<label htmlFor={id}
			       className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium
			       text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
			>
				<Upload className='h-5 w-5 inline-block mr-2' />
				{label}
			</label>

			<input
				id={id}
				name={name}
				type="file"
				accept="image/*"
				onChange={onChange}
				className="sr-only"
			/>
			{value && <span className="ml-3 text-sm text-gray-400">Image uploaded</span>}
		</div>
	);
};

export default FormFileInput;