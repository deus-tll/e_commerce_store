import bcrypt from "bcryptjs";

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
		return await bcrypt.hash(password, SALT_ROUNDS);
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
			throw new Error("Cannot compare password: hashed password string is missing.");
		}
		return await bcrypt.compare(plaintextPassword, hashedPassword);
	}
}