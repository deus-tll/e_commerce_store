import {useEffect, useMemo, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {AlertCircle, ShoppingCart} from "lucide-react";
import toast from "react-hot-toast";

import {formatCurrency} from "../utils/format.js";

import {useProductStore} from "../stores/useProductStore.js";
import {useAuthStore} from "../stores/useAuthStore.js";
import {useCartStore} from "../stores/useCartStore.js";
import {useReviewStore} from "../stores/useReviewStore.js";

import StockStatus from "../components/product/StockStatus.jsx";
import ReviewsList from "../components/review/ReviewsList.jsx";
import ReviewForm from "../components/review/ReviewForm.jsx";

import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import Button from "../components/ui/Button.jsx";
import LoadingSpinner from "../components/ui/LoadingSpinner.jsx";
import ImageGallery from "../components/ui/ImageGallery.jsx";
import PartialStars from "../components/ui/PartialStars.jsx";

import noImageIcon from "../assets/no-image-icon.png";

const ProductDetailsPage = () => {
    const { id } = useParams();

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const { user } = useAuthStore();
    const { itemLoadingId, addToCart } = useCartStore();
    const { currentProduct, loading, error, fetchProductById, clearCurrentProduct } = useProductStore();
    const { clearReviews } = useReviewStore();

    useEffect(() => {
        setSelectedImageIndex(0);
        void fetchProductById(id);

        return () => {
            clearCurrentProduct();
            clearReviews();
        };
    }, [id, fetchProductById, clearCurrentProduct, clearReviews]);

    const productImages = useMemo(() => {
        const images = currentProduct?.images;
        const main = images?.mainImage || noImageIcon;
        const additional = images?.additionalImages || [];
        return [main, ...additional];
    }, [currentProduct]);

    const currentDisplayImage = productImages[selectedImageIndex] || productImages[0];

    const handleAddToCart = async () => {
        if (!user || !currentProduct) return;
        await addToCart(currentProduct);
    };

    const handleReviewSuccess = async () => {
        toast.success("Review submitted successfully!");
        await fetchProductById(id);
    };

    if (loading) return <LoadingSpinner />;

    if (error || (!loading && !currentProduct)) {
        return (
            <Container size="lg" className="py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                    <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
                    <p className="text-gray-400">The item you are looking for doesn't exist or has been removed.</p>
                    <Link to="/" className="text-emerald-400 hover:underline">Back to Shop</Link>
                </div>
            </Container>
        );
    }

    if (currentProduct?.id !== id) return <LoadingSpinner />;

    const isAddingToCart = itemLoadingId === currentProduct.id;

    const productStock = currentProduct.stock ?? 0;
    const isAvailable = productStock > 0;

    return (
        <Container size="lg">
            {/* Product Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Product Image */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-square w-full bg-gray-800 rounded-lg overflow-hidden">
                        <img
                            src={currentDisplayImage}
                            alt={currentProduct.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Image Gallery */}
                    <ImageGallery
                        allImages={productImages}
                        selectedImageIndex={selectedImageIndex}
                        onSelectImage={setSelectedImageIndex}
                    />
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <Link to={`/category/${currentProduct.category?.slug}`} className="hover:underline">
                                <span>{currentProduct.category?.name}</span>
                            </Link>
                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-3">{currentProduct.name}</h1>

                        <div className="flex items-center gap-3 mb-4">
                            <PartialStars rating={currentProduct.ratingStats.averageRating} />
                            <span className="text-gray-300 text-sm">{currentProduct.ratingStats.averageRating} ({currentProduct.ratingStats.totalReviews} reviews)</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-lg leading-relaxed">{currentProduct.description}</p>

                    {/* Price & Stock */}
                    <div className="space-y-4">
                        <div className="text-4xl font-bold text-emerald-400">
                            {formatCurrency(currentProduct.price)}
                        </div>

                        {/* Stock Status */}
                        <StockStatus stock={productStock}/>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <Button
                                className="flex-1 flex items-center justify-center gap-2 py-3 text-lg"
                                onClick={handleAddToCart}
                                disabled={!user || isAddingToCart || !isAvailable}
                            >
                                {!isAvailable ? (
                                    "Out of Stock"
                                ) : isAddingToCart ? (
                                    "Adding..."
                                ) : (
                                    <>
                                        <ShoppingCart className="h-5 w-5" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                        </div>

                        {!user && (
                            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 p-3 rounded-lg">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">Please log in to add items to cart</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Attributes Section */}
            {currentProduct.attributes?.length > 0 && (
                <div className="mb-16">
                    <SectionHeader title="Attributes" subtitle="Technical details" />

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-700 rounded-lg overflow-hidden border border-gray-700">
                        {currentProduct.attributes.map((attr, index) => (
                            <div key={index} className="bg-gray-800 p-4 flex justify-between items-center">
                                <span className="text-gray-400 text-sm">{attr.name}</span>
                                <span className="text-white font-medium">{attr.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <div className="mt-12">
                <SectionHeader title="Reviews" subtitle="What customers say" />

                <div className="mt-6 space-y-8">
                    {/* Review Form */}
                    <ReviewForm
                        productId={id}
                        onSuccess={handleReviewSuccess}
                    />

                    {/* Reviews List */}
                    <ReviewsList productId={id} />
                </div>
            </div>
        </Container>
    );
};

export default ProductDetailsPage;