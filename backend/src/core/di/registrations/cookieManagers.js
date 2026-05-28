import {AuthCookieManager} from "../../../http/cookies/AuthCookieManager.js";

import {CookieManagerTypes} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerCookieManagers = (container) => {
    container.register(CookieManagerTypes.AUTH, () => {
        return new AuthCookieManager(config.infrastructure.security.jwt.refresh.ttl, config.server.isProduction, config.server.forceDisableSecureCookies);
    });
}

export default registerCookieManagers;