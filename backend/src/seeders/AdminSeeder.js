import {IUserService} from "../interfaces/user/IUserService.js";
import {BaseSeeder} from "./BaseSeeder.js";
import {CreateUserDTO} from "../domain/index.js";

import {UserRoles} from "../constants/app.js";
import {config} from "../config.js";

export class AdminSeeder  extends BaseSeeder {
	/** @type {IUserService} */ #userService;

	/**
	 * @param {IUserService} userService
	 */
	constructor(userService) {
		super();
		this.#userService = userService;
	}

	async seed() {
		try {
			const { name: adminName, email: adminEmail, password: adminPassword } = config.admin;

			if (!adminName || !adminEmail || !adminPassword) {
				console.warn("Admin credentials missing in environment variables, skipping seeding.");
				return;
			}

			const exists = await this.#userService.existsByEmail(adminEmail);

			if (exists) {
				console.log("Admin already exists, skipping seeding.");
				return;
			}

			const createAdminDTO = new CreateUserDTO({
				name: adminName,
				email: adminEmail,
				password: adminPassword,
				role: UserRoles.ADMIN,
				isVerified: true
			});

			await this.#userService.create(createAdminDTO);

			console.log("Admin created successfully!");
		}
		catch (error) {
			console.error("Error while seeding admin:", error.message);
		}
	}
}