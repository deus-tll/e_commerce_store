import bcrypt from "bcryptjs";

import {PasswordService} from "../../../infrastructure/security/PasswordService.js";

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
}

export default registerInfrastructureServices;