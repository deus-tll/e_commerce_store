import {AuthCacheManager} from "../../cache/AuthCacheManager.js";
import {ProductCacheManager} from "../../cache/ProductCacheManager.js";

import {CacheManagerTypes, ProviderTypes, UtilityTypes} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerCacheManagers = (container) => {
    container.register(CacheManagerTypes.AUTH, () => {
        const cacheProvider = container.get(ProviderTypes.CACHE);
        const dateTimeUtility = container.get(UtilityTypes.DATE);

        return new AuthCacheManager(
            cacheProvider,
            dateTimeUtility,
            config.auth.refresh.ttl
        );
    });
    container.register(CacheManagerTypes.PRODUCT, ProductCacheManager, [ProviderTypes.CACHE]);
}
export default registerCacheManagers;