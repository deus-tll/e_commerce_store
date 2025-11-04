import {IUserService} from "../interfaces/user/IUserService.js";
import {BaseSeeder} from "./BaseSeeder.js";
import {CreateUserDTO} from "../domain/index.js";

import {UserRoles} from "../utils/constants.js";

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
			const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

			if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
				console.warn("Admin credentials missing in environment variables, skipping seeding.");
				return;
			}

			const exists = await this.#userService.existsByEmail(ADMIN_EMAIL);

			if (exists) {
				console.log("Admin already exists, skipping seeding.");
				return;
			}

			const createAdminDTO = new CreateUserDTO({
				name: ADMIN_NAME,
				email: ADMIN_EMAIL,
				password: ADMIN_PASSWORD,
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