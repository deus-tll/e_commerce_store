/**
 * @interface IPasswordProvider
 * @description Contract for providers responsible for generating passwords.
 */
export class IPasswordProvider {
    /**
     * Hashes a plaintext password.
     * @param {string} password - The plaintext password.
     * @returns {Promise<string>} The hashed password.
     */
    async hashPassword(password) { throw new Error("Method not implemented."); }

    /**
     * Compares a plaintext password with a stored hash.
     * @param {string} plaintextPassword - The password to check.
     * @param {string} hashedPassword - The stored password hash.
     * @returns {Promise<boolean>} True if the passwords match, false otherwise.
     */
    async comparePassword(plaintextPassword, hashedPassword){ throw new Error("Method not implemented."); }
}