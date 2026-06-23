import express, {Express} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import {Container} from "./core/di/Container.js";

import {IDatabaseProvider} from "./infrastructure/providers/database/IDatabaseProvider.js";
import {ICacheProvider} from "./infrastructure/providers/cache/ICacheProvider.js";
import {IStorageProvider} from "./infrastructure/providers/storage/IStorageProvider.js";

import {PaymentController} from "./http/controllers/PaymentController.js";
import {SessionAuthService} from "./application/auth/SessionAuthService.js";
import {AnalyticsController} from "./http/controllers/AnalyticsController.js";
import {AuthController} from "./http/controllers/AuthController.js";
import {CartController} from "./http/controllers/CartController.js";
import {CategoryController} from "./http/controllers/CategoryController.js";
import {CouponController} from "./http/controllers/CouponController.js";
import {OrderController} from "./http/controllers/OrderController.js";
import {ProductController} from "./http/controllers/ProductController.js";
import {ReviewController} from "./http/controllers/ReviewController.js";
import {UserController} from "./http/controllers/UserController.js";
import {AdminSeeder} from "./seeders/AdminSeeder.js";
import {ProductsDummyJsonSeeder} from "./seeders/ProductsDummyJsonSeeder.js";

import {setupAppRouters} from "./http/routers/index.js";
import {setupPaymentWebhookRouter} from "./http/routers/payment.webhook.js";
import errorHandler from "./http/middleware/errorHandler.js";

import {config} from "./config.js";

const JSON_LIMIT = config.server.jsonLimit;
const API_BASE = config.server.apiBaseUrl;

/**
 * Encapsulates the configuration and execution of the Express application.
 */
export class Application {
	private readonly app: Express;
	private readonly port: number | string;
	private readonly database: IDatabaseProvider;
	private readonly cache: ICacheProvider;
	private readonly container: Container;

	constructor(container: Container) {
		this.app = express();
		this.port = config.server.port;
		this.database = container.get(IDatabaseProvider);
		this.cache = container.get(ICacheProvider);
		this.container = container;
	}

	/**
	 * Configures global middleware (CORS, body parsers, static files).
	 */
	configureMiddleware() {
		this.app.use(
			cors({
				origin: config.server.clientUrl,
				credentials: true,
			})
		);

		this.app.set('query parser', 'extended');
		this.app.use(express.json({ limit: JSON_LIMIT }));
		this.app.use(express.urlencoded({ limit: JSON_LIMIT, extended: true }));
		this.app.use(cookieParser());
	}

	/**
	 * Sets up webhook routes that must bypass global JSON parsing.
	 */
	setupWebhookRoutes() {
		const paymentController = this.container.get(PaymentController);

		const webhookRouter = setupPaymentWebhookRouter(paymentController);
		this.app.use("/api/payments/webhook", webhookRouter);
	}

	setupRoutes() {
		this.app.get("/", (_, res) => {
			res.status(200).send("OK")
		});

		const deps = {
			authService: this.container.get(SessionAuthService),

			analyticsController: this.container.get(AnalyticsController),
			authController: this.container.get(AuthController),
			cartController: this.container.get(CartController),
			categoryController: this.container.get(CategoryController),
			couponController: this.container.get(CouponController),
			orderController: this.container.get(OrderController),
			paymentController: this.container.get(PaymentController),
			productController: this.container.get(ProductController),
			reviewController: this.container.get(ReviewController),
			userController: this.container.get(UserController),
		}

		this.app.use(API_BASE, setupAppRouters(deps));
	}

	setupErrorHandling() {
		this.app.use(errorHandler);
	}

	async dropDatabase() {
		if (config.infrastructure.providers.database.dropOnStartup) {
			await this.database.drop();
		}
		else {
			console.log("[Database] Skipping drop.");
		}
	}

	async dropStorage() {
		if (config.infrastructure.providers.storage.dropOnStartup) {
			const storage = this.container.get(IStorageProvider)
			await storage.deleteAll();
		}
		else {
			console.log("[Storage] Skipping drop.");
		}
	}

	async runSeeders() {
		console.log("[Server] Starting seeders...");

		const adminSeeder = this.container.get(AdminSeeder);
		const dummyProductsSeeder = this.container.get(ProductsDummyJsonSeeder);

		await adminSeeder.seed();

		if (config.seeding.seedProductsOnStartup) {
			await dummyProductsSeeder.seed();
		}

		console.log("[Server] Seeding complete.");
	}

	async start() {
		try {
			await this.database.connect()
			await this.cache.connect();

			// only works in development and with DROP_DB_ON_STARTUP=true in .env
			await this.dropDatabase();
			// only works in development and with DROP_STORAGE_ON_STARTUP=true in .env
			await this.dropStorage();

			this.setupWebhookRoutes();
			this.configureMiddleware();
			this.setupRoutes();
			this.setupErrorHandling();

			await this.runSeeders();

			this.app.listen(this.port, () => {
				console.log(`[Server] Running on port ${this.port}`);
				console.log(`[Server] Environment: ${config.server.nodeEnv}`);
			});
		} catch (error) {
			console.error("[Server] Fatal error during server startup:", error);
			process.exit(1);
		}
	}

	/**
	 * Gracefully shuts down the server
	 */
	async stop() {
		console.log("[Server] Shutting down...");

		try {
			await Promise.allSettled([
				this.database.disconnect(),
				this.cache.disconnect()
			]);

			console.log("[Server] Cleanup complete. Exiting.");
			process.exit(0);
		}
		catch (error) {
			console.error("[Server] Error during shutdown:", error);
			process.exit(1);
		}
	}
}