import {Container} from "../Container.js";

import {AuthCookieManager} from "../../../http/cookies/AuthCookieManager.js";

import {config} from "../../../config.js";

const registerCookieManagers = (container: Container): void => {
    container.register({
        token: AuthCookieManager
    }, [
        config.infrastructure.security.jwt.refresh.ttl,
        config.server.isProduction,
        config.server.forceDisableSecureCookies
    ]);
}

export default registerCookieManagers;