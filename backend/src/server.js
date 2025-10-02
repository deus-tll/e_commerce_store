import "dotenv/config";
import { AppServer } from "./AppServer.js";

const server = new AppServer();
server.start().then();