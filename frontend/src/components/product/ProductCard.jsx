import {Link, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {ShoppingCart, Star, Box} from "lucide-react";

import {formatCurrency} from "../../utils/format.js";

import {useAuthStore} from "../../stores/useAuthStore.js";
import {useCartStore} from "../../stores/useCartStore.js";

import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";

import noImageIcon from "../../assets/no-image-icon.png";

const ProductCard = ({ product }) => {
	const { category: categorySlug } = useParams();

	const { user } = useAuthStore();
	const { itemLoadingId, addToCart } = useCartStore();

	const isLoading = itemLoadingId === product.id;
	const isOutOfStock = product.stock <= 0;

	const handleAddToCart = async (e) => {
		e.preventDefault();

		if (!user) {
			toast.error("Please, login to add products to cart", { id: "login" });
		}
		else {
			await addToCart(product);
		}
	};

    return (
        <Card className="group flex flex-col h-full overflow-hidden border-gray-800 bg-gray-900/40 hover:border-emerald-500/50 transition-all duration-300">
	        <Link to={`/product/${product.id}`} className="relative h-56 overflow-hidden block">
		        <img
			        src={product?.images?.mainImage || noImageIcon}
			        alt={product.name}
			        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
		        />

		        {/* Category Badge */}
		        {!categorySlug && (
			        <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest bg-gray-900/80 text-emerald-400 backdrop-blur-sm rounded border border-emerald-500/20">
                                {product.category?.name || "General"}
                            </span>
			        </div>
		        )}

		        {/* Stock Status */}
		        {isOutOfStock && (
			        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="text-white font-bold uppercase tracking-tighter border-2 border-white px-3 py-1 rotate-[-10deg]">
                                Out of Stock
                            </span>
			        </div>
		        )}
	        </Link>

	        {/* Content Section */}
	        <div className="p-5 flex flex-col gap-2">
		        {/* Rating & Stock Count */}
		        <div className="flex items-center justify-between text-xs">
			        <div className="flex items-center gap-1 text-amber-400">
				        <Star size={14} fill="currentColor" />
				        <span className="font-medium">{product.ratingStats?.averageRating?.toFixed(1) || "0.0"}</span>
				        <span className="text-gray-500">({product.ratingStats?.totalReviews || 0})</span>
			        </div>
			        <div className="flex items-center gap-1 text-gray-500">
				        <Box size={14} />
				        <span>{product.stock > 0 ? `${product.stock} in stock` : "Unavailable"}</span>
			        </div>
		        </div>

		        <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition-colors line-clamp-1">
			        <Link to={`/product/${product.id}`}>
				        {product.name}
			        </Link>
		        </h3>

		        <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px]">
			        {product.description}
		        </p>

		        <div className="mt-2">
                        <span className="text-2xl font-bold text-white">
                            {formatCurrency(product.price)}
                        </span>
		        </div>
	        </div>

	        {/* Action Section */}
	        <div className="px-5 pb-5 mt-auto">
		        <Button
			        onClick={handleAddToCart}
			        className="w-full justify-center gap-2"
			        disabled={isLoading || isOutOfStock}
			        variant={isOutOfStock ? "secondary" : "primary"}
		        >
			        {isLoading ? (
				        "Adding..."
			        ) : isOutOfStock ? (
				        "Sold Out"
			        ) : (
				        <>
					        <ShoppingCart size={18} />
					        Add to cart
				        </>
			        )}
		        </Button>
	        </div>
        </Card>
    );
};

export default ProductCard;