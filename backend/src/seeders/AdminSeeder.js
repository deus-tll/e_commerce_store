import {UserService} from "../services/UserService.js";

export class AdminSeeder {
	constructor() {
		this.userService = new UserService();
	}

	async seed() {
		try {
			const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

			if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
				console.log("Admin credentials missing in environment variables, skipping seeding.");
				return;
			}

			const adminData = {
				name: ADMIN_NAME,
				email: ADMIN_EMAIL,
				password: ADMIN_PASSWORD
			};

			const admin = await this.userService.findOrCreateAdmin(adminData);

			if (admin) {
				console.log("Admin created successfully!");
			}
			else {
				console.log("Admin already exists, skipping seeding.");
			}
		}
		catch (error) {
			console.error("Error while seeding admin:", error.message);
		}
	}
}