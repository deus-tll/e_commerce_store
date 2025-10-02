import {UserMongooseRepository} from "../repositories/mongoose/UserMongooseRepository.js";

import {UserService} from "../services/UserService.js";
import {EmailService} from "../services/EmailService.js";
import {AuthService} from "../services/AuthService.js";

import {UserController} from "../controllers/UserController.js";
import {AuthController} from "../controllers/AuthController.js";

import {createAuthRouter} from "../routers/authRouterFactory.js";

import {AdminSeeder} from "../seeders/AdminSeeder.js";
import {createUsersRouter} from "../routers/usersRouterFactory.js";

class Container {
	constructor() {
		this.services = new Map();
	}

	/**
	 * Registers a singleton service.
	 * @param {string} name - A unique name (token) for the service.
	 * @param {function} definition - A factory function that creates a service and its dependencies.
	 */
	register(name, definition) {
		this.services.set(name, { definition, instance: null });
	}

	/**
	 * Gets a registered service.
	 * @param {string} name
	 */
	get(name) {
		const service = this.services.get(name);

		if (!service) {
			throw new Error(`Service "${name}" is not registered.`);
		}

		if (!service.instance) {
			service.instance = service.definition(this);
		}

		return service.instance;
	}
}

const container = new Container();

// 1. Repositories (lowest level dependency, have no dependencies)
container.register('IUserRepository', () => new UserMongooseRepository());

// 2. Services (depends on repositories)
container.register('IUserService', (c) => {
	const userRepository = c.get('IUserRepository');
	return new UserService(userRepository);
});
container.register('IEmailService', () => new EmailService());
container.register('IAuthService', (c) => {
	const userService = c.get('IUserService');
	const emailService = c.get('IEmailService');
	return new AuthService(userService, emailService);
});

// 3. Controllers (depends on services)
container.register('UserController', (c) => {
	const userService = c.get('IUserService');
	return new UserController(userService);
});
container.register('AuthController', (c) => {
	const authService = c.get('IAuthService');
	return new AuthController(authService);
});

// 4. Routers (Depends on Controller and Middleware/Service)
container.register('usersRouter', (c) => {
	const userController = c.get('UserController');
	const authService = c.get('IAuthService');

	return createUsersRouter(userController, authService);
});
container.register('authRouter', (c) => {
	const authController = c.get('AuthController');
	const authService = c.get('IAuthService');

	return createAuthRouter(authController, authService);
});

// 5. Seeders (depends on services)
container.register('AdminSeeder', (c) => {
	const userService = c.get('IUserService');
	return new AdminSeeder(userService);
});

export default container;