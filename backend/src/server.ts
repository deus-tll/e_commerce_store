import {getContainer} from "./core/di/bootstrap.js";
import {Application} from "./Application.js";

const container = getContainer();

const server = new Application(container);

server.start().catch((err) => {
	console.error("[Server] Failed to start server", err);
	process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
	console.error("[Server] Unhandled Rejection at:", promise, "reason:", reason);
});

const shutdown = async () => {
	try {
		await server.stop();
	}
	catch (error) {
		console.error("[Server] Error during forced shutdown:", error);
		process.exit(1);
	}
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);