import { useEffect, useState } from "react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";

import {useCartStore} from "../../stores/useCartStore.js";

import FormField from "../ui/FormField.jsx";
import { Input } from "../ui/Input.jsx";

const GiftCouponCard = () => {
	const [userInputCode, setUserInputCode] = useState("");
	const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } = useCartStore();

	useEffect(() => {
		getMyCoupon();
	}, [getMyCoupon]);

	useEffect(() => {
		if (coupon) setUserInputCode(coupon.code);
	}, [coupon]);

	const handleApplyCoupon = async () => {
		if (!userInputCode) return;
		await applyCoupon(userInputCode);
	};

	const handleRemoveCoupon = async () => {
		await removeCoupon(userInputCode);
		setUserInputCode("");
	};

	return (
		<Card className="space-y-4 p-4 sm:p-6">
			<div className="space-y-4">
				<FormField label="Do you have a voucher or gift card?">
					<Input id="voucher" name="voucher" type="text" value={userInputCode} onChange={(e) => setUserInputCode(e.target.value)} placeholder="Enter code here" />
				</FormField>

				<Button type="button" onClick={handleApplyCoupon} className="w-full justify-center">Apply Code</Button>
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
						<Button type="button" variant="danger" className="mt-2" onClick={handleRemoveCoupon}>Remove Coupon</Button>
					)}
				</div>
			)}
		</Card>
	);
};

export default GiftCouponCard;