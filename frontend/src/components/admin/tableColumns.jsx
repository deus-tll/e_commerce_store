import {Link} from "react-router-dom";
import {Edit, Star, Trash2, BadgeCheck, BadgeX, LucideUserStar, User} from "lucide-react";

import {formatCurrency, formatDate} from "../../utils/format.js";

import IconButton from "../ui/IconButton.jsx";

const editButtonClasses = "text-blue-400 hover:text-blue-300";
const deleteButtonClasses = "text-red-400 hover:text-red-300";
const iconClasses = "h-5 w-5";
const simpleValueClasses = "text-sm text-gray-300";

export const createCategoryColumns = ({ startEdit, deleteCategory }) => [
	{
		key: "category",
		title: "Category",
		dataIndex: "category",
		render: (_, category) => (
			<Link to={`/category/${category.slug}`} className="flex items-center">
				<div className="flex-shrink-0">
					<img src={category.image} alt={category.name} className="h-20 w-20 object-cover rounded" />
				</div>

				<div className="ml-4 text-sm font-medium text-white hover:underline">
					{category.name}
				</div>
			</Link>
		)
	},
	{
		key: "slug",
		title: "Slug",
		dataIndex: "slug",
		render: (_, category) => (
			<Link to={`/category/${category.slug}`}>
				<span className={`${simpleValueClasses} hover:underline`}>
					{category.slug}
				</span>
			</Link>
		)
	},
	{
		key: "actions",
		title: "Actions",
		dataIndex: "actions",
		render: (_, category) => (
			<>
				<IconButton onClick={() => startEdit(category)} className={editButtonClasses}>
					<Edit className={iconClasses} />
				</IconButton>
				<IconButton
					onClick={async () => {
						if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
							await deleteCategory(category.id);
						}
					}}
					className={deleteButtonClasses}
				>
					<Trash2 className={iconClasses} />
				</IconButton>
			</>
		)
	}
];

export const createProductColumns = ({ loading, toggleFeaturedProduct, startEdit, deleteProduct }) => [
	{
		key: 'product',
		title: 'Product',
		dataIndex: 'name',
		render: (_, product) => (
			<Link to={`/product/${product.id}`} className="flex items-center">
				<div className="flex-shrink-0 h-10 w-10">
					<img className='h-10 w-10 rounded-full object-cover' src={product?.images?.mainImage} alt={product.name} />
				</div>

				<div className="ml-4">
					<div className="text-sm font-medium text-white hover:underline">
						{product.name}
					</div>
				</div>
			</Link>
		)
	},
	{
		key: 'price',
		title: 'Price',
		dataIndex: 'price',
		render: (value) =>
			<div className={simpleValueClasses}>
				{formatCurrency(value)}
			</div>
	},
	{
		key: 'category',
		title: 'Category',
		dataIndex: 'category',
		render: (value) => (
			<Link to={`/category/${value.slug}`} className={`${simpleValueClasses} hover:underline`} >
				{value?.name}
			</Link>
		)
	},
	{
		key: 'featured',
		title: 'Featured',
		dataIndex: 'isFeatured',
		render: (_, product) => (
			<IconButton
				variant={product.isFeatured ? 'warning' : 'secondary'}
				onClick={() => toggleFeaturedProduct(product.id)}
				className={`p-2 rounded-full ${product.isFeatured ? 'bg-yellow-500 text-gray-900' : ''}`}
				disabled={loading}
			>
				<Star className={iconClasses} />
			</IconButton>
		)
	},
	{
		key: 'ratingStats',
		title: 'Rating | Reviews',
		dataIndex: 'ratingStats',
		render: (value) => (
			<div className={`${simpleValueClasses}`}>
				{value?.averageRating + " | " + value?.totalReviews}
			</div>
		)
	},
	{
		key: 'actions',
		title: 'Actions',
		dataIndex: 'actions',
		render: (_, product) => (
			<div className="flex gap-2">
				<IconButton variant="ghost" onClick={() => startEdit(product)} className={editButtonClasses}>
					<Edit className={iconClasses} />
				</IconButton>

				<IconButton
					variant="ghost"
					onClick={async () => {
						if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
							await deleteProduct(product.id);
						}
					}}
					className={deleteButtonClasses}
					disabled={loading}
				>
					<Trash2 className={iconClasses} />
				</IconButton>
			</div>
		)
	}
];

export const createUserColumns = ({ startEdit, deleteUser }) => [
	{
		key: 'user',
		title: 'User',
		dataIndex: 'name',
		render: (_, user) => (
			<div className="flex items-center">
				<div className="flex-shrink-0 h-10 w-10">
					<div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center">
						<span className="text-white font-medium text-sm">{user.name.charAt(0).toUpperCase()}</span>
					</div>
				</div>
				<div className="ml-4">
					<div className="text-sm font-medium text-white">{user.name}</div>
					<div className="text-sm text-gray-400">{user.email}</div>
				</div>
			</div>
		)
	},
	{
		key: 'role',
		title: 'Role',
		dataIndex: 'role',
		render: (role) => (
			<>
				{role === "admin"
					? (<LucideUserStar color="gold"/>)
					: (<User color="green"/>)
				}
			</>
		)
	},
	{
		key: 'status',
		title: 'Status',
		dataIndex: 'isVerified',
		render: (isVerified) => (
			<>
				{isVerified
					? (<BadgeCheck color="green"/>)
					: (<BadgeX color="red"/>)
				}
			</>
		)
	},
	{
		key: 'lastLogin',
		title: 'Last Login',
		dataIndex: 'lastLogin',
		render: (value) => (<span className="text-sm text-gray-300">{value ? formatDate(value) : 'Never'}</span>)
	},
	{
		key: 'actions',
		title: 'Actions',
		dataIndex: 'actions',
		render: (_, user) => (
			<div className="flex items-center gap-2">
				<IconButton onClick={() => startEdit(user)} className={editButtonClasses} title="Edit user">
					<Edit className={iconClasses} />
				</IconButton>
				<IconButton
					onClick={async () => {
						if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
							await deleteUser(user.id);
						}
					}}
					className={deleteButtonClasses}
					title="Delete user"
				>
					<Trash2 className={iconClasses} />
				</IconButton>
			</div>
		)
	}
];