import {X} from "lucide-react";

import FormField from "../../ui/FormField.jsx";
import {FileInput} from "../../ui/Input.jsx";
import IconButton from "../../ui/IconButton.jsx";

const AdditionalImagesField = ({ additionalImages, onImagesChange, onImageRemove }) => {
	return (
		<FormField label="Additional Images">
			<FileInput
				id="additionalImages"
				name="additionalImages"
				label="Upload Additional Images"
				onChange={onImagesChange}
				multiple
			/>
			{additionalImages.length > 0 && (
				<div className="flex flex-wrap gap-3 mt-3">
					{additionalImages.map((image, index) => (
						<div key={index} className="relative w-20 h-20">
							<img
								src={image}
								alt={`Additional ${index}`}
								className="w-full h-full object-cover rounded"
							/>

							<IconButton
								type="button"
								onClick={() => onImageRemove(index)}
								variant="danger"
								className="absolute -top-3 -right-3 h-6 w-6 rounded-3xl z-10"
								applyBasePadding={false}
							>
								<X className="h-4 w-4" />
							</IconButton>
						</div>
					))}
				</div>
			)}
		</FormField>
	);
};

export default AdditionalImagesField;