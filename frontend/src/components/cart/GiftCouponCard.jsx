import { useEffect, useState } from "react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";

import {useCartStore} from "../../stores/useCartStore.js";

import FormField from "../ui/FormField.jsx";
import { Input } from "../ui/Input.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const [localError, setLocalError] = useState(null);

	const { coupon, isCouponApplied, couponLoading, getMyCoupon, applyCoupon, unapplyCoupon } = useCartStore();

	useEffect(() => {
		void getMyCoupon();
	}, [getMyCoupon]);

	useEffect(() => {
		if (coupon) setUserInputCode(coupon.code);
	}, [coupon]);

	const handleApplyCoupon = async () => {
		setLocalError(null);

		if (!userInputCode) {
			setLocalError("Please enter a coupon code.");
			return;
		}

		try {
			await applyCoupon(userInputCode);
		}
		catch (err) {
			setLocalError(err.message || "Failed to apply coupon.");
		}
	};

	const handleRemoveCoupon = async () => {
		unapplyCoupon();
		setUserInputCode("");
		setLocalError(null);
	};

	const handleInputChange = (e) => {
		setUserInputCode(e.target.value);
		if (localError) setLocalError(null);
	}

	return (
		<Card className="space-y-4 p-4 sm:p-6">
			<div className="space-y-4">
				<FormField label="Do you have a voucher or gift card?">
					<Input
						id="voucher"
						name="voucher"
						type="text"
						value={userInputCode}
						onChange={handleInputChange}
						placeholder="Enter code here"
					/>
				</FormField>

				<ErrorMessage message={localError} />

				<Button
					type="button"
					onClick={handleApplyCoupon}
					className="w-full justify-center"
					disabled={!userInputCode || isCouponApplied || couponLoading}
				>
					{couponLoading ? "Applying..." : "Apply Code"}
				</Button>
			</div>

			{coupon && (
				<div className="mt-4">
					<h3 className="text-lg font-medium text-gray-300">
						{isCouponApplied ? "Applied Coupon" : "Your Available Coupon:"}
					</h3>

					<p className="mt-2 text-sm text-gray-400">
						{coupon.code} - {coupon.discountPercentage}% off
					</p>

					{isCouponApplied && (
						<Button type="button" variant="danger" className="mt-2" onClick={handleRemoveCoupon}>Unapply Coupon</Button>
					)}
				</div>
			)}
		</Card>
	);
};

export default GiftCouponCard;