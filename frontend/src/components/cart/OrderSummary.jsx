import {Link} from "react-router-dom";
import {useShallow} from 'zustand/react/shallow'
import {MoveRight, CreditCard} from "lucide-react";

import {useCartStore} from "../../stores/useCartStore.js";

import {formatCurrency} from "../../utils/format.js";

import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";

const OrderSummary = ({ isCheckingOut, loading, onProceed, onBack, onPayClick }) => {
	const { totalPrice, originalPrice, savings } = useCartStore(
		useShallow((state) => state.getTotals())
	);

	const { coupon, isCouponApplied } = useCartStore();

	const dlClasses = "flex items-center justify-between gap-4";
	const dtClasses = "text-base font-normal text-gray-300";

	return (
		<Card className="space-y-4 p-4 sm:p-6">
			<p className="text-xl font-semibold text-emerald-400">
				Order summary
			</p>

			<div className="space-y-4">
				<div className="space-y-2">
					<dl className={dlClasses}>
						<dt className={dtClasses}>Original price</dt>
                        <dd className="text-base font-medium text-white">{formatCurrency(originalPrice)}</dd>
					</dl>

					{coupon && isCouponApplied && (
						<>
							<dl className={dlClasses}>
								<dt className={dtClasses}>Coupon ({coupon.code})</dt>
								<dd className="text-base font-medium text-emerald-400">-{coupon.discountPercentage}%</dd>
							</dl>

							{savings > 0 && (
								<dl className={dlClasses}>
									<dt className={dtClasses}>Savings</dt>
									<dd className="text-base font-medium text-emerald-400">-{formatCurrency(savings)}</dd>
								</dl>
							)}
						</>
					)}

					<dl className={`${dlClasses} border-t border-gray-600 pt-2`}>
						<dt className="text-base font-bold text-white">Total</dt>
                        <dd className="text-base font-bold text-emerald-400">{formatCurrency(totalPrice)}</dd>
					</dl>
				</div>

				<Button
					type="button"
					onClick={isCheckingOut ? onPayClick : onProceed}
					className="w-full justify-center"
					disabled={loading}
				>
					{isCheckingOut ? <CreditCard className="mr-2 h-4 w-4" /> : null}
					{loading ? "Redirecting..." : isCheckingOut ? "Pay Now" : "Proceed to Checkout"}
				</Button>

				{isCheckingOut && (
					<Button
						variant="ghost"
						onClick={onBack}
						className="w-full text-gray-400 hover:text-white"
						disabled={loading}
					>
						Back to Cart
					</Button>
				)}

				{!isCheckingOut && (
					<div className="flex items-center justify-center gap-2">
						<span className="text-sm font-normal text-gray-400">or</span>

						<Link
							to="/"
							className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
						>
							Continue Shopping
							<MoveRight size={16} />
						</Link>
					</div>
				)}
			</div>
		</Card>
	);
};

export default OrderSummary;