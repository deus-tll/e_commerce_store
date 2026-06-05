import { SignOptions, VerifyOptions, JwtPayload } from "jsonwebtoken";

import {TokenType} from "../../enums/auth.js";
import {AuthMapper} from "../../application/auth/AuthMapper.js";
import {TokensDTO} from "../../application/types/auth.js";

import {InvalidTokenError, TokenExpiredError} from "../../errors/index.js";

export interface JwtClient {
	sign(payload: string | Buffer | object, secretOrPrivateKey: string | Buffer, options?: SignOptions): string;
	verify(token: string, secretOrPublicKey: string | Buffer, options?: VerifyOptions): JwtPayload | string;
}

export class JwtDecodedPayload {
	constructor(
		public readonly userId: string
	) {}
}

export class JwtService {
	constructor(
		private readonly jwt: JwtClient,
		private readonly accessTokenSecret: string,
		private readonly accessTokenTtlSeconds: number,
		private readonly refreshTokenSecret: string,
		private readonly refreshTokenTtlSeconds: number
	) {}

	private signAccessToken(userId: string): string {
		return this.jwt.sign({ userId }, this.accessTokenSecret, {
			expiresIn: this.accessTokenTtlSeconds
		});
	}

	private signRefreshToken(userId: string): string {
		return this.jwt.sign({ userId }, this.refreshTokenSecret, {
			expiresIn: this.refreshTokenTtlSeconds
		});
	}

	generateTokens(userId: string): TokensDTO {
		const accessToken = this.signAccessToken(userId);
		const refreshToken = this.signRefreshToken(userId);
		return AuthMapper.toTokensDTO(accessToken, refreshToken);
	}

	verifyToken(token: string, type: TokenType): JwtDecodedPayload {
		const secret = type === TokenType.ACCESS_TOKEN ? this.accessTokenSecret : this.refreshTokenSecret;

		try {
			const decoded = this.jwt.verify(token, secret) as JwtPayload;
			return new JwtDecodedPayload(decoded.userId);
		}
		catch (error) {
			const tokenName = type === TokenType.ACCESS_TOKEN ? "Access token" : "Refresh token";

			if (error.name === "TokenExpiredError") {
				throw new TokenExpiredError(`${tokenName} expired`);
			}

			throw new InvalidTokenError(`Invalid ${tokenName.toLowerCase()}`);
		}
	}
}