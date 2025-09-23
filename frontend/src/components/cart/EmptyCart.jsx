import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";

const EmptyCart = () => {
    return (
        <div className="py-16">
			<Card className="flex flex-col items-center justify-center space-y-4 p-8">
				<ShoppingCart className="h-24 w-24 text-gray-300" />
				<h3 className="text-2xl font-semibold">Your cart is empty</h3>
				<p className="text-gray-400">Looks like you {"haven't"} added anything to your cart yet.</p>
				<Link to="/">
					<Button>Start Shopping</Button>
				</Link>
            </Card>
        </div>
	);
};

export default EmptyCart;