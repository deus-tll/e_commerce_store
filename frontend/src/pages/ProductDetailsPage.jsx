import React, {useEffect, useMemo, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {AlertCircle, Check, ShoppingCart, Truck, RotateCcw, Shield} from "lucide-react";

import {useProductStore} from "../stores/useProductStore.js";
import {useAuthStore} from "../stores/useAuthStore.js";
import {useCartStore} from "../stores/useCartStore.js";
import {useReviewStore} from "../stores/useReviewStore.js";

import {formatCurrency} from "../utils/format.js";

import Container from "../components/ui/Container.jsx";
import SectionHeader from "../components/ui/SectionHeader.jsx";
import Button from "../components/ui/Button.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import CreateReviewForm from "../components/review/CreateReviewForm.jsx";
import ReviewsList from "../components/review/ReviewsList.jsx";
import ImageGallery from "../components/ui/ImageGallery.jsx";
import PartialStars from "../components/ui/PartialStars.jsx";

import noImageIcon from "../assets/no-image-icon.png";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuthStore();
    const { addToCart } = useCartStore();
    const { fetchProductById, currentProduct, clearCurrentProduct, loading } = useProductStore();
    const { clearReviews, getAverageRating, getTotalReviews } = useReviewStore();

    const averageRating = getAverageRating();
    const totalReviews = getTotalReviews();

    const defaultImages = {
        mainImage: noImageIcon,
        additionalImages: [],
        allImages: [noImageIcon]
    };

    const features = [
        "High quality materials",
        "Durable construction",
        "Easy to use",
        "Satisfaction guaranteed"
    ];

    const specifications = [
        { label: "Brand", value: "Premium Brand" },
        { label: "Model", value: currentProduct?.name || "N/A" },
        { label: "Weight", value: "1.2 kg" },
        { label: "Size", value: "S" },
        { label: "Material", value: "Premium Quality" },
        { label: "Warranty", value: "1 year" }
    ];

    useEffect(() => {
        fetchProductById(id);
        return () => {
            clearCurrentProduct();
            clearReviews();
        };
    }, [id, fetchProductById, clearCurrentProduct, clearReviews]);

    const productImages = useMemo(() => {
        if (!currentProduct || !currentProduct.images) {
            return defaultImages;
        }

        const { mainImage, additionalImages } = currentProduct.images;

        const finalMainImage = mainImage || noImageIcon;
        const finalAdditionalImages = additionalImages || [];

        return {
            mainImage: finalMainImage,
            additionalImages: finalAdditionalImages,
            allImages: [finalMainImage, ...finalAdditionalImages]
        };
    }, [currentProduct]);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const currentDisplayImage = productImages.allImages[selectedImageIndex] || productImages.allImages[0];

    const handleAddToCart = async () => {
        if (!user) return;
        if (!currentProduct) return;
        await addToCart(currentProduct);
    };

    const handleReviewSuccess = () => {
        // Optional: show success message or trigger additional actions
        console.log("Review submitted successfully!");
    };

    if (loading || !currentProduct) {
        return <LoadingSpinner />;
    }

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
                        allImages={productImages.allImages}
                        selectedImageIndex={selectedImageIndex}
                        onSelectImage={setSelectedImageIndex}
                    />
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <Link to={`/category/${currentProduct.category?.slug}`}>
                                <span>{currentProduct.category?.name}</span>
                            </Link>
                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-3">{currentProduct.name}</h1>

                        {/* Dummy Rating */}
                        <div className="flex items-center gap-3 mb-4">
                            <PartialStars rating={averageRating} />
                            <span className="text-gray-300 text-sm">{averageRating} ({totalReviews} reviews)</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-lg leading-relaxed">{currentProduct.description}</p>

                    {/* Key Features */}
                    {features && features.length > 0 && (
                        <div className="bg-gray-800 rounded-lg p-4">
                            <h3 className="font-semibold text-white mb-3">Key Features</h3>
                            <ul className="space-y-2">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <Check className="h-4 w-4 text-emerald-400 mr-3 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Price & Stock */}
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-3">
                            <div className="text-4xl font-bold text-emerald-400">
                                {formatCurrency(currentProduct.price)}
                            </div>
                            <div className="text-lg text-gray-400 line-through">
                                {formatCurrency(currentProduct.price * 1.2)}
                            </div>
                            <div className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                                Save 20%
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-green-400 text-sm font-medium">In Stock - Ready to ship</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <Button
                                className="flex-1 flex items-center justify-center gap-2 py-3 text-lg"
                                onClick={handleAddToCart}
                                disabled={!user}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Add to Cart
                            </Button>
                        </div>

                        {!user && (
                            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 p-3 rounded-lg">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">Please log in to add items to cart</span>
                            </div>
                        )}
                    </div>

                    {/* Shipping & Returns */}
                    <div className="border-t border-gray-700 pt-6 space-y-3">
                        <div className="flex items-center gap-3 text-gray-300">
                            <Truck className="h-5 w-5 text-emerald-400" />
                            <span>Free shipping on orders over $50</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <RotateCcw className="h-5 w-5 text-emerald-400" />
                            <span>30-day return policy</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <Shield className="h-5 w-5 text-emerald-400" />
                            <span>2-year manufacturer warranty</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specifications Section */}
            <div className="mb-16">
                <SectionHeader title="Specifications" subtitle="Technical details" />
                <div className="mt-6 bg-gray-800 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {specifications.map((spec, index) => (
                            <div
                                key={index}
                                className={`p-4 border-b border-gray-700 ${index % 2 === 0 ? 'md:border-r' : ''} ${index >= specifications.length - 2 ? 'border-b-0' : ''}`}
                            >
                                <div className="flex">
                                    <span className="text-gray-400 w-1/3 min-w-[80px] flex-shrink-0 mr-4">
                                        {spec.label}
                                    </span>

                                    <span className="text-white font-medium text-right flex-grow break-words">
                                        {spec.value}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
                <SectionHeader title="Reviews" subtitle="What customers say" />

                <div className="mt-6 space-y-8">
                    {/* Review Form */}
                    <CreateReviewForm
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


