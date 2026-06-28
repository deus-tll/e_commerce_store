export enum StripeEvents {
	CHECKOUT_SESSION_COMPLETED = "checkout.session.completed",
}

export enum StripeHeaders {
	SIGNATURE = "stripe-signature",
}

export enum IdempotencyPrefixes {
	CHECKOUT_SESSION = "session-order",
}

export enum StripeCouponDurations {
	ONCE = "once"
}