import {Link} from "react-router-dom";
import { Trash, Star, Pencil, Search } from "lucide-react";
import IconButton from "../ui/IconButton.jsx";
import Card from "../ui/Card.jsx";
import Table from "../ui/Table.jsx";
import {useProductStore} from "../../stores/useProductStore.js";
import { formatCurrency } from "../../utils/format.js";
import EmptyState from "../ui/EmptyState.jsx";
import Pagination from "../ui/Pagination.jsx";
import { useState, useEffect } from "react";
import EditProductForm from "./EditProductForm.jsx";
import Toolbar from "../ui/Toolbar.jsx";
import Button from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";

const ProductsList = ({ onCreate }) => {
    const { deleteProduct, toggleFeaturedProduct, products, pagination, fetchAllProducts } = useProductStore();
    const [page, setPage] = useState(1);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchAllProducts(page, 10);
    }, [page, fetchAllProducts]);

    const columns = [
        {
            key: 'product',
            title: 'Product',
            dataIndex: 'name',
            render: (_, product) => (
                <Link to={`/product/${product._id}`} className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className='h-10 w-10 rounded-full object-cover' src={product?.images?.image} alt={product.name} />
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
            render: (value) => <div className="text-sm text-gray-300">{formatCurrency(value)}</div>
        },
        {
            key: 'category',
            title: 'Category',
            dataIndex: 'category',
            render: (value) => (
                <div className="text-sm text-gray-300">{typeof value === 'object' && value !== null ? value.name : value}</div>
            )
        },
        {
            key: 'featured',
            title: 'Featured',
            dataIndex: 'isFeatured',
            render: (_, product) => (
                <IconButton
                    variant={product.isFeatured ? 'warning' : 'secondary'}
                    onClick={() => toggleFeaturedProduct(product._id)}
                    className={`p-2 rounded-full ${product.isFeatured ? 'bg-yellow-500 text-gray-900' : ''}`}
                >
                    <Star className="h-5 w-5" />
                </IconButton>
            )
        },
        {
            key: 'actions',
            title: 'Actions',
            dataIndex: 'actions',
            render: (_, product) => (
                <div className="flex gap-2">
                    <IconButton variant="ghost" onClick={() => setEditing(product)} className="text-emerald-400 hover:text-emerald-300">
                        <Pencil className="h-5 w-5" />
                    </IconButton>

                    <IconButton variant="ghost" onClick={() => deleteProduct(product._id)} className="text-red-400 hover:text-red-300">
                        <Trash className="h-5 w-5" />
                    </IconButton>
                </div>
            )
        }
    ];

    const filtered = search.trim() ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.category && (typeof p.category === 'object' ? p.category.name : p.category).toLowerCase().includes(search.toLowerCase()))
    ) : products;

    return (
        <div className="max-w-7xl mx-auto">
            <Card className="p-6 mb-6">
                <Toolbar>
                    <div className="relative flex-1 max-w-md">
                        <Input leftIcon={Search} type="text" placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                    </div>

                    <Button onClick={onCreate} className="flex items-center gap-2">
                        <Pencil className="h-4 w-4" /> Create Product
                    </Button>

                    {pagination && (
                        <div className="text-gray-300 text-sm">
                            Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} products
                        </div>
                    )}
                </Toolbar>
            </Card>

            <Card className="overflow-hidden">
                {(!filtered || filtered.length === 0) ? (
                    <EmptyState title="No products" description="Create a product to get started." />
                ) : (
                    <>
                        <Table columns={columns} data={filtered} rowKey="_id" />
                        {pagination && pagination.pages > 1 && (
                            <div className="p-4">
                                <Pagination page={page} pages={pagination.pages} onChange={setPage} />
                            </div>
                        )}
                    </>
                )}
                {editing && (
                    <EditProductForm product={editing} onClose={() => setEditing(null)} />
                )}
            </Card>
        </div>
    );
};

export default ProductsList;