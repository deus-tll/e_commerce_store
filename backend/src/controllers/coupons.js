import Coupon from "../models/Coupon.js";

export const getCoupon = async (req, res) => {
	try {
		const userId = req.user._id;
		const coupon = await Coupon.findOne({ userId, isActive: true });

		if (!coupon) {
			return res.status(404).json({ message: "Active coupon not found for this user" });
		}

		return res.status(200).json(coupon);
	}
	catch (error) {
		console.error("Error while getting coupon", error.message);
		return res.status(500).json({ message: error.message });
	}
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		const userId = req.user._id;
		const coupon = await Coupon.findOne({ code, userId, isActive: true });

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(410).json({ message: "Coupon expired" });
		}

		const { discountPercentage } = coupon;
		return res.status(200).json({
			message: "Coupon is valid",
			code,
			discountPercentage
		});
	}
	catch (error) {
		console.error("Error while validating coupon", error.message);
		return res.status(500).json({ message: error.message });
	}
};