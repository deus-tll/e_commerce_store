import Bcrypt from "bcryptjs";
import {SystemError} from "../../errors/index.js";

export class PasswordService {
    constructor(
        private readonly bcrypt: typeof Bcrypt,
        private readonly saltRounds: number
    ) {}

    async hashPassword(password: string): Promise<string> {
        try {
            return await this.bcrypt.hash(password, this.saltRounds);
        } catch (error) {
            throw new SystemError("Failed to secure password.");
        }
    }

    async comparePassword(plaintext: string, hashed: string): Promise<boolean> {
        if (!hashed) {
            throw new SystemError("Data mismatch during verification.");
        }

        try {
            return await this.bcrypt.compare(plaintext, hashed);
        } catch (error) {
            throw new SystemError("Error during password verification.");
        }
    }
}