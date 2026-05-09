import {SystemError} from "../../errors/index.js";
import {IPasswordProvider} from "../../interfaces/providers/password/IPasswordProvider.js";

/**
 * Provider of the Bcrypt for handling password security operations (hashing, comparing).
 * @augments IPasswordProvider
 */
export class BcryptPasswordProvider extends IPasswordProvider {
	/** @type {import("bcryptjs")} */ #bcrypt;
	/** @type {number} */ #saltRounds;

	/**
	 * @param {import("bcryptjs")} bcrypt
	 * @param {number} saltRounds
	 */
	constructor(bcrypt, saltRounds) {
		super();
		this.#bcrypt = bcrypt;
		this.#saltRounds = saltRounds;
	}

	async hashPassword(password) {
		try {
			return await this.#bcrypt.hash(password, this.#saltRounds);
		}
		catch (error) {
			throw new SystemError("Failed to secure password.");
		}
	}

	async comparePassword(plaintext, hashed) {
		if (!hashed) throw new SystemError("Data mismatch during verification.");

		try {
			return await this.#bcrypt.compare(plaintext, hashed);
		}
		catch (error) {
			throw new SystemError("Error during password verification.");
		}
	}
}