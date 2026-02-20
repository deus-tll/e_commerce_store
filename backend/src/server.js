import {AppServer} from "./AppServer.js";
import container from "./infrastructure/dependencyContainer.js";

const server = new AppServer(container);

server.start().catch((err) => {
	console.error("[Server] Failed to start server", err);
});