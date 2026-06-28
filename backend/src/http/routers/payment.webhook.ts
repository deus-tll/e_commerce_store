import express, {Router} from "express";
import {PaymentController} from "../controllers/PaymentController.js";

export function setupPaymentWebhookRouter(paymentController: PaymentController): Router{
    const router = Router();

    router.post(
        "/",
        express.raw({ type: "application/json" }),
        paymentController.webhook
    );

    return router;
}