import { Trash, Star } from "lucide-react";
import IconButton from "../ui/IconButton.jsx";
import Card from "../ui/Card.jsx";
import Table from "../ui/Table.jsx";
import {useProductStore} from "../../stores/useProductStore.js";
import { formatCurrency } from "../../utils/format.js";
import EmptyState from "../ui/EmptyState.jsx";

const ProductsList = () => {
    const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

    const columns = [
        {
            key: 'product',
            title: 'Product',
            dataIndex: 'name',
            render: (_, product) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className='h-10 w-10 rounded-full object-cover' src={product.image} alt={product.name} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-white">{product.name}</div>
                    </div>
                </div>
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
                <IconButton variant="ghost" onClick={() => deleteProduct(product._id)} className="text-red-400 hover:text-red-300">
                    <Trash className="h-5 w-5" />
                </IconButton>
            )
        }
    ];

    return (
        <Card className="overflow-hidden max-w-4xl mx-auto">
            {(!products || products.length === 0) ? (
                <EmptyState title="No products" description="Create a product to get started." />
            ) : (
                <Table columns={columns} data={products} rowKey="_id" />
            )}
        </Card>
    );
};

export default ProductsList;