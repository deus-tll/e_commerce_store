import bcrypt from "bcryptjs";
import {SystemError} from "../../errors/index.js";

export class PasswordService {
    constructor(
        private readonly saltRounds: number
    ) {}

    async hashPassword(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            throw new SystemError("Failed to secure password.");
        }
    }

    async comparePassword(plaintext: string, hashed: string): Promise<boolean> {
        if (!hashed) {
            throw new SystemError("Data mismatch during verification.");
        }

        try {
            return await bcrypt.compare(plaintext, hashed);
        } catch (error) {
            throw new SystemError("Error during password verification.");
        }
    }
}