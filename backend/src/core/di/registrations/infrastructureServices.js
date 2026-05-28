import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {PasswordService} from "../../../infrastructure/security/PasswordService.js";
import {JwtService} from "../../../infrastructure/security/JwtService.js";
import {TemplateService} from "../../../infrastructure/templates/TemplateService.js";

import {InfrastructureServiceTypes} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerInfrastructureServices = (container) => {
    container.register(InfrastructureServiceTypes.PASSWORD, () => {
        const saltRounds = config.infrastructure.security.bcrypt.saltRounds;
        return new PasswordService(bcrypt, saltRounds);
    });
    container.register(InfrastructureServiceTypes.JWT, () => {
        return new JwtService(
            jwt,
            config.infrastructure.security.jwt.access.secret,
            config.infrastructure.security.jwt.access.ttl,
            config.infrastructure.security.jwt.refresh.secret,
            config.infrastructure.security.jwt.refresh.ttl
        );
    });
    container.register(InfrastructureServiceTypes.TEMPLATE, () => {
        return new TemplateService();
    });
}

export default registerInfrastructureServices;