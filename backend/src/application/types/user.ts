import {UserEntity} from "../../entities/user/UserEntity.js";
import {UserRole} from "../../enums/application.js";
import {PaginationMetadata} from "./shared.js";

// INPUT DATA STRUCTURES
//=======================

export interface UserCreateInput {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isVerified: boolean;
}

export type UserUpdateInput = Partial<Omit<UserCreateInput, "password">>;

export interface UserFindOneOptionsInput {
    withPassword?: boolean;
}

export interface UserFindOneQueryInput {
    email?: string;
}

export interface UserFiltersInput {
    role?: UserRole;
    isVerified?: boolean;
    search?: string;
}

export type UserCreatePersistence = UserCreateInput;

export type UserUpdatePersistence =
    UserUpdateInput &
    {
        password?: string;
        lastLogin?: Date;
        verificationToken?: string | null;
        verificationTokenExpiresAt?: Date | null;
        resetPasswordToken?: string | null;
        resetPasswordTokenExpiresAt?: Date | null;
    };

export type UserFiltersPersistence = UserFiltersInput & {
    sortBy?: "createdAt";
    order?: "asc" | "desc";
};

export type UserCountFilters = UserFiltersInput;

// OUTPUT DATA STRUCTURES
//=======================

export class UserDTO {
    public readonly id: string;
    public readonly name: string;
    public readonly email: string;
    public readonly role: UserRole;
    public readonly isVerified: boolean;
    public readonly lastLogin: Date;
    public readonly createdAt: Date;

    constructor(entity: UserEntity) {
        this.id = entity.id;
        this.name = entity.name;
        this.email = entity.email;
        this.role = entity.role;
        this.isVerified = entity.isVerified;
        this.lastLogin = entity.lastLogin;
        this.createdAt = entity.createdAt;

        Object.freeze(this);
    }
}

export class ShortUserDTO {
    public readonly id: string;
    public readonly name: string;
    public readonly email: string;

    constructor(entity: UserEntity) {
        this.id = entity.id;
        this.name = entity.name;
        this.email = entity.email;

        Object.freeze(this);
    }
}

export class UserPaginationResultDTO {
    public readonly users: readonly UserDTO[];
    public readonly pagination: PaginationMetadata;

    constructor(users: readonly UserDTO[], pagination: PaginationMetadata) {
        this.users = Object.freeze([...users]);
        this.pagination = pagination;

        Object.freeze(this);
    }
}

export class UserStatsDTO {
    public readonly total: number;
    public readonly verified: number;
    public readonly unverified: number;
    public readonly admins: number;
    public readonly customers: number;

    constructor(data: {
        total: number;
        verified: number;
        unverified: number;
        admins: number;
        customers: number;
    }) {
        this.total = data.total;
        this.verified = data.verified;
        this.unverified = data.unverified;
        this.admins = data.admins;
        this.customers = data.customers;

        Object.freeze(this);
    }
}