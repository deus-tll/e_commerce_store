import { useEffect, useState } from "react";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { useCategoryStore } from "../../stores/useCategoryStore.js";

const CategoriesList = () => {
	const { categories, fetchCategories, updateCategory, deleteCategory, loading } = useCategoryStore();
	const [editingId, setEditingId] = useState(null);
	const [draft, setDraft] = useState({ name: "", image: "" });

	useEffect(() => { fetchCategories(); }, [fetchCategories]);

	const startEdit = (cat) => {
		setEditingId(cat._id);
		setDraft({ name: cat.name, image: "" });
	};

	const cancelEdit = () => {
		setEditingId(null);
		setDraft({ name: "", image: "" });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onloadend = () => setDraft((d) => ({ ...d, image: reader.result }));
		reader.readAsDataURL(file);
	};

	const save = async (id) => {
		await updateCategory(id, draft);
		cancelEdit();
	};

	return (
		<div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto">
			<table className="min-w-full divide-y divide-gray-700">
				<thead className="bg-gray-700">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Image</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
					</tr>
				</thead>
				<tbody className="bg-gray-800 divide-y divide-gray-700">
					{categories.map((cat) => (
						<tr key={cat._id} className="hover:bg-gray-700">
							<td className="px-6 py-4 whitespace-nowrap">
								<img src={cat.image} alt={cat.name} className="h-10 w-10 object-cover rounded" />
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								{editingId === cat._id ? (
									<input
										value={draft.name}
										onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
										className="bg-gray-700 text-white px-2 py-1 rounded"
									/>
								) : (
									<span className="text-sm text-gray-300">{cat.name}</span>
								)}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
								{editingId === cat._id ? (
									<>
										<label className="text-gray-300 text-xs mr-2">
											New Image:
											<input type="file" accept="image/*" onChange={handleImageChange} className="ml-2" />
										</label>
										<button onClick={() => save(cat._id)} disabled={loading} className="text-emerald-400 hover:text-emerald-300">
											<Save className="h-5 w-5" />
										</button>
										<button onClick={cancelEdit} className="text-gray-400 hover:text-gray-300">
											<X className="h-5 w-5" />
										</button>
									</>
								) : (
									<>
										<button onClick={() => startEdit(cat)} className="text-blue-400 hover:text-blue-300">
											<Pencil className="h-5 w-5" />
										</button>
										<button onClick={() => deleteCategory(cat._id)} className="text-red-400 hover:text-red-300">
											<Trash2 className="h-5 w-5" />
										</button>
									</>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default CategoriesList;

