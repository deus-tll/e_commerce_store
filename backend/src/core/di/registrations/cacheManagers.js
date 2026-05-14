import {AuthCacheManager} from "../../cache/AuthCacheManager.js";
import {ProductCacheManager} from "../../cache/ProductCacheManager.js";

import {CacheManagerTypes, ProviderTypes} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerCacheManagers = (container) => {
    container.register(CacheManagerTypes.AUTH, () => {
        const cacheProvider = container.get(ProviderTypes.CACHE);

        return new AuthCacheManager(
            cacheProvider,
            config.auth.refresh.ttl
        );
    });
    container.register(CacheManagerTypes.PRODUCT, ProductCacheManager, [ProviderTypes.CACHE]);
}
export default registerCacheManagers;