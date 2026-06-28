import {UserDTO} from "./user.js";

export class TokensDTO {
    constructor(
        public readonly accessToken: string,
        public readonly refreshToken: string
    ) {}
}

export class UserWithTokensDTO {
    constructor(
        public readonly user: UserDTO,
        public readonly tokens: TokensDTO
    ) {}
}