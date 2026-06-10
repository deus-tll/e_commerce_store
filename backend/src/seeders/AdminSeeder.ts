import {UserService} from "../application/user/UserService.js";
import {ISeeder} from "./ISeeder.js";

import {UserCreateInput} from "../application/types/user.js";

import {UserRole} from "../enums/application.js";

export class AdminSeeder implements ISeeder {
	constructor(
		private readonly userService: UserService,
		private readonly adminName: string,
		private readonly adminEmail: string,
		private readonly adminPassword: string
	) {}

	async seed(): Promise<void> {
		try {
			if (!this.adminName || !this.adminEmail || !this.adminPassword) {
				console.warn("[Seeder] Admin credentials missing in config. Skipping...");
				return;
			}

			const exists = await this.userService.existsByEmail(this.adminEmail);

			if (exists) {
				console.log("[Seeder] Admin user already exists.");
				return;
			}

			const userCreateInput: UserCreateInput = {
				name: this.adminName,
				email: this.adminEmail,
				password: this.adminPassword,
				role: UserRole.ADMIN,
				isVerified: true
			};

			await this.userService.create(userCreateInput);

			console.log("[Seeder] Admin account seeded successfully.");
		}
		catch (error) {
			console.error("[Seeder] Critical failure seeding admin:", error.message);
		}
	}
}