import {UserRole} from "../../enums/application.js";

export class UserEntity {
    public readonly id: string;
    public readonly name: string;
    public readonly email: string;
    public readonly role: UserRole;
    public readonly isVerified: boolean;
    public readonly lastLogin: Date;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    readonly #hashedPassword?: string;

    constructor(data: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        isVerified: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
        password?: string;
    }) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.role = data.role;
        this.isVerified = data.isVerified;
        this.lastLogin = data.lastLogin;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;

        this.#hashedPassword = data.password;

        Object.freeze(this);
    }

    get hashedPassword(): string | undefined { return this.#hashedPassword; }
}