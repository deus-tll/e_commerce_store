import { TokensDTO, UserWithTokensDTO, UserDTO } from "../index.js";

/**
 * Provides static methods to assemble raw data into complex, structured DTOs
 * for authentication responses.
 */
export class AuthResponseAssembler {
	/**
	 * Constructs the UserWithTokensDTO object from a UserDTO and raw token strings.
	 * @param {object} params - The parameters required for assembly.
	 * @param {UserDTO} params.user - The user object containing profile details.
	 * @param {string} params.accessToken - The raw JWT access token string.
	 * @param {string} params.refreshToken - The raw JWT refresh token string.
	 * @returns {UserWithTokensDTO} The assembled DTO ready for API response.
	 */
	static assembleUserWithTokens({ user, accessToken, refreshToken }) {
		const tokens = new TokensDTO(accessToken, refreshToken);
		return new UserWithTokensDTO(user, tokens);
	}
}