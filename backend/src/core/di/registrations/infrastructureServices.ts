import {Container} from "../Container.js";

import {PasswordService} from "../../../infrastructure/security/PasswordService.js";
import {JwtService} from "../../../infrastructure/security/JwtService.js";
import {TemplateService} from "../../../infrastructure/templates/TemplateService.js";

import {DateTime} from "../../../utils/dateTime.js";

import {config} from "../../../config.js";

const registerInfrastructureServices = (container: Container): void => {
    container.register({
        token: PasswordService
    }, [
        config.infrastructure.security.bcrypt.saltRounds
    ]);

    container.register({
        token: JwtService
    }, [
        config.infrastructure.security.jwt.access.secret,
        DateTime.ttlToSeconds(config.infrastructure.security.jwt.access.ttl),
        config.infrastructure.security.jwt.refresh.secret,
        DateTime.ttlToSeconds(config.infrastructure.security.jwt.refresh.ttl)
    ]);

    container.register({
        token: TemplateService
    });
}

export default registerInfrastructureServices;