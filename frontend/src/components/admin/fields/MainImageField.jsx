import FormField from "../../ui/FormField.jsx";
import {FileInput} from "../../ui/Input.jsx";

const MainImageField = ({ mainImage, onImageChange, error }) => {
	return (
		<FormField label="Main Image" error={error}>
			<FileInput
				id="mainImage"
				name="mainImage"
				label="Upload Main Image"
				value={mainImage}
				onChange={onImageChange}
			/>
			{mainImage && (
				<div className="relative w-32 h-32 p-1">
					<img src={mainImage} alt="Main Preview" className="w-full h-full object-cover rounded" />
				</div>
			)}
		</FormField>
	);
};

export default MainImageField;