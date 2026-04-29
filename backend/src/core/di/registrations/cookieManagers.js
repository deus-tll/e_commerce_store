import {AuthCookieManager} from "../../../http/cookies/AuthCookieManager.js";

import {CookieManagerTypes, UtilityTypes} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerCookieManagers = (container) => {
    container.register(CookieManagerTypes.AUTH, () => {
        const dateTimeUtility = container.get(UtilityTypes.DATE);
        return new AuthCookieManager(dateTimeUtility, config.auth.refresh.ttl, config.app.isProduction);
    });
}

export default registerCookieManagers;