import express from "express";

/**
 * Factory for webhook-specific routes that require raw body parsing.
 * @param {PaymentController} paymentController
 * @returns {express.Router | core.Router} - Configured Express router.
 */
export function createPaymentsWebhookRouter(paymentController){
    const router = express.Router();

    router.post(
        "/webhook",
        express.raw({ type: "application/json" }),
        paymentController.webhook
    );

    return router;
}