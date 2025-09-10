import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {useCartStore} from "../../stores/useCartStore.js";

import FormInput from "../FormInput.jsx";

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

	const buttonClasses = (color) => {
		const colorClasses = {
			emerald: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-300",
			red: "bg-red-600 hover:bg-red-700 focus:ring-red-300",
		};

		const commonClasses = `flex w-full items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-4`;

		return `${commonClasses} ${colorClasses[color]}`;
	};

	return (
		<motion.div
			className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className="space-y-4">
				<FormInput
					label="Do you have a voucher or gift card?"
					inputElement="input"
					id="voucher"
					name="voucher"
					type="text"
					value={userInputCode}
					onChange={(e) => setUserInputCode(e.target.value)}
					placeholder="Enter code here"
				/>

				<motion.button
					type="button"
					className={buttonClasses("emerald")}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleApplyCoupon}
				>
					Apply Code
				</motion.button>
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
						<motion.button
							type="button"
							className={`mt-2 ${buttonClasses("red")}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleRemoveCoupon}
						>
							Remove Coupon
						</motion.button>
					)}
				</div>
			)}
		</motion.div>
	);
};

export default GiftCouponCard;