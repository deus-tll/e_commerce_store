import {TokensDTO, UserWithTokensDTO} from "../types/auth.js";
import {UserDTO} from "../types/user.js";

export class AuthMapper {
    static toTokensDTO(accessToken: string, refreshToken: string) {
        return new TokensDTO(accessToken, refreshToken);
    }

    static toUserWithTokensDTO(userDTO: UserDTO, accessToken: string, refreshToken: string) {
        return new UserWithTokensDTO(
            userDTO,
            this.toTokensDTO(accessToken, refreshToken)
        );
    }
}