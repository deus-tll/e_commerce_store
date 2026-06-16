import {UserService} from "../application/user/UserService.js";
import {ISeeder} from "./ISeeder.js";

import {UserCreateInput} from "../application/types/user.js";

import {UserRole} from "../enums/application.js";

interface UserData {
	name: string;
	email: string;
	password: string;
}

export class AdminSeeder implements ISeeder {
	constructor(
		private readonly userService: UserService,
		private readonly defaultAdminData: UserData
	) {}

	async seed(): Promise<void> {
		try {
			const { name, email, password } = this.defaultAdminData;

			if (!name || !email || !password) {
				console.warn("[Seeder] Admin credentials missing in config. Skipping...");
				return;
			}

			const exists = await this.userService.existsByEmail(email);

			if (exists) {
				console.log("[Seeder] Admin user already exists.");
				return;
			}

			const userCreateInput: UserCreateInput = {
				name,
				email,
				password,
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