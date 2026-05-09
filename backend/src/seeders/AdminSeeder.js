import {IUserService} from "../interfaces/user/IUserService.js";
import {BaseSeeder} from "./BaseSeeder.js";
import {CreateUserDTO} from "../domain/index.js";

import {UserRoles} from "../constants/app.js";

export class AdminSeeder  extends BaseSeeder {
	/** @type {IUserService} */ #userService;
	/** @type {string} */ #adminName;
	/** @type {string} */ #adminEmail;
	/** @type {string} */ #adminPassword;

	/**
	 * @param {IUserService} userService
	 * @param {string} adminName
	 * @param {string} adminEmail
	 * @param {string} adminPassword
	 */
	constructor(userService, adminName, adminEmail, adminPassword) {
		super();
		this.#userService = userService;
		this.#adminName = adminName;
		this.#adminEmail = adminEmail;
		this.#adminPassword = adminPassword;
	}

	async seed() {
		try {
			if (!this.#adminName || !this.#adminEmail || !this.#adminPassword) {
				console.warn("[Seeder] Admin credentials missing in config. Skipping...");
				return;
			}

			const exists = await this.#userService.existsByEmail(this.#adminEmail);

			if (exists) {
				console.log("[Seeder] Admin user already exists.");
				return;
			}

			const createAdminDTO = new CreateUserDTO({
				name: this.#adminName,
				email: this.#adminEmail,
				password: this.#adminPassword,
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