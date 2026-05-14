import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {PasswordService} from "../../../infrastructure/security/PasswordService.js";
import {JwtService} from "../../../infrastructure/security/JwtService.js";

import {InfrastructureServiceTypes} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerInfrastructureServices = (container) => {
    container.register(InfrastructureServiceTypes.PASSWORD, () => {
        const saltRounds = config.providers.password.bcrypt.saltRounds;
        return new PasswordService(bcrypt, saltRounds);
    });
    container.register(InfrastructureServiceTypes.JWT, () => {
        return new JwtService(
            jwt,
            config.auth.access.secret,
            config.auth.access.ttl,
            config.auth.refresh.secret,
            config.auth.refresh.ttl
        );
    });
}

export default registerInfrastructureServices;