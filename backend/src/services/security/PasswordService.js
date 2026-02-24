import bcrypt from "bcryptjs";

import {SystemError} from "../../errors/index.js";
import {config} from "../../config.js";

/**
 * Service dedicated to handling password security operations (hashing, comparing).
 */
export class PasswordService {
	#saltRounds = config.auth.password.saltRounds;

	/**
	 * Hashes a plaintext password.
	 * @param {string} password - The plaintext password.
	 * @returns {Promise<string>} The hashed password.
	 */
	async hashPassword(password) {
		try {
			return await bcrypt.hash(password, this.#saltRounds);
		}
		catch (error) {
			throw new SystemError("Failed to secure password.");
		}
	}

	/**
	 * Compares a plaintext password with a stored hash.
	 * @param {string} plaintextPassword - The password to check.
	 * @param {string} hashedPassword - The stored password hash.
	 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
	 * @throws {Error} If the hashedPassword is missing.
	 */
	async comparePassword(plaintextPassword, hashedPassword) {
		if (!hashedPassword) {
			throw new SystemError("Authentication failed due to a system data mismatch.");
		}

		try {
			return await bcrypt.compare(plaintextPassword, hashedPassword);
		}
		catch (error) {
			throw new SystemError("Error during password verification.");
		}
	}
}