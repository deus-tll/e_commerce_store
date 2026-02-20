import bcrypt from "bcryptjs";
import {SystemError} from "../../errors/index.js";

const SALT_ROUNDS = 10;

/**
 * Service dedicated to handling password security operations (hashing, comparing).
 */
export class PasswordService {
	/**
	 * Hashes a plaintext password.
	 * @param {string} password - The plaintext password.
	 * @returns {Promise<string>} The hashed password.
	 */
	async hashPassword(password) {
		try {
			return bcrypt.hash(password, SALT_ROUNDS);
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
			return bcrypt.compare(plaintextPassword, hashedPassword);
		}
		catch (error) {
			throw new SystemError("Error during password verification.");
		}
	}
}