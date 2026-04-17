export const StripeEvents = Object.freeze({
	CHECKOUT_SESSION_COMPLETED: "checkout.session.completed",
});

export const StripeHeaders = Object.freeze({
	SIGNATURE: "stripe-signature",
});

export const IdempotencyPrefixes = Object.freeze({
	CHECKOUT_SESSION: "session-order",
});

export const StripeCouponDurations = Object.freeze({
	ONCE: "once"
});