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
			const { name: adminName, email: adminEmail, password: adminPassword } = config.business.initialAdmin;

			if (!adminName || !adminEmail || !adminPassword) {
				console.warn("[Seeder] Admin credentials missing in config. Skipping...");
				return;
			}

			const exists = await this.#userService.existsByEmail(adminEmail);

			if (exists) {
				console.log("[Seeder] Admin user already exists.");
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

			console.log("[Seeder] Admin account seeded successfully.");
		}
		catch (error) {
			console.error("[Seeder] Critical failure seeding admin:", error.message);
		}
	}
}