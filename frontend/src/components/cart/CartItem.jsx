import { Minus, Plus, Trash } from "lucide-react";

import {useCartStore} from "../../stores/useCartStore.js";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";
import { formatCurrency } from "../../utils/format.js";
import IconButton from "../ui/IconButton.jsx";

const CartItem = ({ item }) => {
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<Card className="p-4 md:p-6">
			<div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
				<div className="shrink-0 md:order-1">
					<img src={item.image} alt="Cart item" className="h-20 md:h-32 rounded object-cover"/>
				</div>

				<label className="sr-only">Choose quantity:</label>

				<div className="flex items-center justify-between md:order-3 md:justify-end">
                <div className="flex items-center gap-2">
                    <IconButton
                        variant="secondary"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-2 rounded"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="h-4 w-4" />
                    </IconButton>

					<p>{item.quantity}</p>

                    <IconButton
                        variant="secondary"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-2 rounded"
                        aria-label="Increase quantity"
                    >
                        <Plus className="h-4 w-4" />
                    </IconButton>
					</div>

					<div className="text-end md:order-4 md:w-32">
                    <p className="text-base font-bold text-emerald-400">
                        {formatCurrency(item.price)}
                    </p>
					</div>
				</div>

				<div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
					<p className="text-base font-medium text-white hover:text-emerald-400 hover:underline">
						{item.name}
					</p>

					<p className="text-sm text-gray-400">
						{item.description}
					</p>

					<div className="flex items-center gap-4">
						<Button variant="danger" onClick={() => removeFromCart(item._id)} className="inline-flex items-center gap-2 text-sm">
							<Trash />
							Remove
						</Button>
					</div>
				</div>
			</div>
		</Card>
	);
};

export default CartItem;