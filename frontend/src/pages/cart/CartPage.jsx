import {useCartStore} from "../../stores/useCartStore.js";

import EmptyCart from "../../components/cart/EmptyCart.jsx";
import CartItem from "../../components/cart/CartItem.jsx";
import OrderSummary from "../../components/cart/OrderSummary.jsx";
import GiftCouponCard from "../../components/cart/GiftCouponCard.jsx";
import PeopleAlsoBought from "../../components/cart/PeopleAlsoBought.jsx";
import Container from "../../components/ui/Container.jsx";
import SectionHeader from "../../components/ui/SectionHeader.jsx";

const CartPage = () => {
	const { cart } = useCartStore();

    return (
        <Container size="lg">
            <SectionHeader title="Your Cart" />
            <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                    <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
						{cart.length === 0 ? (
							<EmptyCart />
						) : (
							<div className="space-y-6">
								{cart.map((item) => (
									<CartItem key={item._id} item={item} />
								))}
							</div>
						)}

						{cart.length > 0 && <PeopleAlsoBought />}
                    </div>

                    {cart.length > 0 && (
                        <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
							<OrderSummary />
							<GiftCouponCard />
                        </div>
					)}
            </div>
        </Container>
	);
};

export default CartPage;