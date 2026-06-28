import {Router} from "express";

import {SessionAuthService} from "../../application/auth/SessionAuthService.js";

import {AnalyticsController} from "../controllers/AnalyticsController.js";
import {AuthController} from "../controllers/AuthController.js";
import {CartController} from "../controllers/CartController.js";
import {CategoryController} from "../controllers/CategoryController.js";
import {CouponController} from "../controllers/CouponController.js";
import {OrderController} from "../controllers/OrderController.js";
import {PaymentController} from "../controllers/PaymentController.js";
import {ProductController} from "../controllers/ProductController.js";
import {ReviewController} from "../controllers/ReviewController.js";
import {UserController} from "../controllers/UserController.js";

import {setupAnalyticsRouter} from "./analytics.js";
import {setupAuthRouter} from "./auth.js";
import {setupCartRouter} from "./cart.js";
import {setupCategoriesRouter} from "./categories.js";
import {setupCouponsRouter} from "./coupons.js";
import {setupOrdersRouter} from "./orders.js";
import {setupPaymentRouter} from "./payment.js";
import {setupProductsRouter} from "./products.js";
import {setupReviewsRouter} from "./reviews.js";
import {setupUsersRouter} from "./users.js";

interface Dependencies {
    authService: SessionAuthService,

    analyticsController: AnalyticsController,
    authController: AuthController,
    cartController: CartController,
    categoryController: CategoryController,
    couponController: CouponController,
    orderController: OrderController,
    paymentController: PaymentController,
    productController: ProductController,
    reviewController: ReviewController,
    userController: UserController
}

export function setupAppRouters(deps: Dependencies): Router {
    const router = Router();

    router.use("/analytics", setupAnalyticsRouter(deps.analyticsController, deps.authService));
    router.use("/auth", setupAuthRouter(deps.authController, deps.authService));
    router.use("/cart", setupCartRouter(deps.cartController, deps.authService));
    router.use("/categories", setupCategoriesRouter(deps.categoryController, deps.authService));
    router.use("/coupons", setupCouponsRouter(deps.couponController, deps.authService));
    router.use("/orders", setupOrdersRouter(deps.orderController, deps.authService));
    router.use("/payments", setupPaymentRouter(deps.paymentController, deps.authService));
    router.use("/products", setupProductsRouter(deps.productController, deps.authService));
    router.use("/reviews", setupReviewsRouter(deps.reviewController, deps.authService));
    router.use("/users", setupUsersRouter(deps.userController, deps.authService));

    return router;
}