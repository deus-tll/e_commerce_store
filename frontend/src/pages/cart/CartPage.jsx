import {useRef, useState} from "react";
import {Trash} from "lucide-react";

import {useCartStore} from "../../stores/useCartStore.js";

import EmptyCart from "../../components/cart/EmptyCart.jsx";
import CartItem from "../../components/cart/CartItem.jsx";
import OrderSummary from "../../components/cart/OrderSummary.jsx";
import GiftCouponCard from "../../components/cart/GiftCouponCard.jsx";
import PeopleAlsoBought from "../../components/cart/PeopleAlsoBought.jsx";

import Container from "../../components/ui/Container.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";
import Button from "../../components/ui/Button.jsx";
import CheckoutDetailsForm from "../../components/checkout/CheckoutDetailsForm.jsx";

const CartPage = () => {
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const checkoutFormRef = useRef(null);

	const {
        cart, clearingCart, paymentLoading, clearCart, createCheckoutSession
    } = useCartStore();

    const handleCheckoutSubmit = async (data) => {
        await createCheckoutSession(data);
    };

    if (cart.length === 0) {
        return (
            <Container size="lg">
                <SectionHeader title="Your Cart" />
                <EmptyCart />
            </Container>
        );
    }

    return (
        <Container size="lg">
            <SectionHeader title={isCheckingOut ? "Checkout Details" : "Your Cart"} />

            {!isCheckingOut && (
                <div className="flex justify-end mb-4">
                    <Button
                        variant="ghost"
                        className="text-red-400 hover:bg-red-400/10 inline-flex items-center gap-2"
                        onClick={clearCart}
                        disabled={clearingCart}
                    >
                        {clearingCart ? "Clearing..." : <><Trash size={18} /> Clear Cart</>}
                    </Button>
                </div>
            )}

            <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
	            <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
		            {isCheckingOut ? (
                        <CheckoutDetailsForm ref={checkoutFormRef} onSubmit={handleCheckoutSubmit} loading={paymentLoading} />
		            ) : (
			            <div className="space-y-6">
				            {cart.map((item) => (
					            <CartItem key={item.id} item={item} />
				            ))}
			            </div>
		            )}

                    <PeopleAlsoBought />
	            </div>

                <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                    <OrderSummary
                        isCheckingOut={isCheckingOut}
                        loading={paymentLoading}
                        onProceed={() => setIsCheckingOut(true)}
                        onBack={() => setIsCheckingOut(false)}
                        onPayClick={() => checkoutFormRef.current?.requestSubmit()}
                    />
                    {!isCheckingOut && <GiftCouponCard />}
                </div>
            </div>
        </Container>
	);
};

export default CartPage;