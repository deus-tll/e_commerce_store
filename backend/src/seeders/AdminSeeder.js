import {UserService} from "../application/user/UserService.js";
import {BaseSeeder} from "./BaseSeeder.js";

import {UserRole} from "../enums/application.ts";

export class AdminSeeder  extends BaseSeeder {
	/** @type {UserService} */ #userService;
	/** @type {string} */ #adminName;
	/** @type {string} */ #adminEmail;
	/** @type {string} */ #adminPassword;

	/**
	 * @param {UserService} userService
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

			// UserCreateInput
			const userCreateInput = {
				name: this.#adminName,
				email: this.#adminEmail,
				password: this.#adminPassword,
				role: UserRole.ADMIN,
				isVerified: true
			};

			await this.#userService.create(userCreateInput);

			console.log("[Seeder] Admin account seeded successfully.");
		}
		catch (error) {
			console.error("[Seeder] Critical failure seeding admin:", error.message);
		}
	}
}