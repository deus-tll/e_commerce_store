import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import Card from "./ui/Card.jsx";
import Button from "./ui/Button.jsx";
import { Link } from "react-router-dom";
import noImageIcon from "../assets/no-image-icon.png";

import { useAuthStore } from "../stores/useAuthStore.js";
import { useCartStore } from "../stores/useCartStore.js";
import { formatCurrency } from "../utils/format.js";

const ProductCard = ({ product }) => {
	const { user } = useAuthStore();
	const { itemLoadingId, addToCart } = useCartStore();

	const isLoading = itemLoadingId === product.id;

	const handleAddToCart = async () => {
		if (!user) {
			toast.error("Please, login to add products to cart", { id: "login" });
		}
		else {
			await addToCart(product);
		}
	};

    return (
        <Card className="overflow-hidden">
	        <Link to={`/product/${product.id}`}>
		        <div className="relative flex h-60 overflow-hidden">
			        <img src={product?.images?.mainImage || noImageIcon} alt="product main image" className="object-cover w-full" />
			        <div className="absolute inset-0 bg-black bg-opacity-20" />
		        </div>
		        <div className="mt-4 px-5 pb-5">
			        <p className="text-xl font-semibold tracking-tight text-white hover:underline">
				        {product.name}
			        </p>
			        <div className="mt-2 mb-5 flex items-center justify-between">
				        <span className="text-3xl font-bold text-emerald-400">{formatCurrency(product.price)}</span>
			        </div>
		        </div>
	        </Link>

	        <div className="px-5 pb-5">
		        <Button onClick={handleAddToCart} className="w-full justify-center" disabled={isLoading}>
			        {isLoading ? (
				        "Adding..."
			        ) : (
				        <>
					        <ShoppingCart size={20} />
					        Add to cart
				        </>
			        )}
		        </Button>
	        </div>
        </Card>
    );
};

export default ProductCard;