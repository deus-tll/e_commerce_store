import {MongooseDatabaseProvider} from "../../../providers/database/MongooseDatabaseProvider.js";
import {RedisCacheProvider} from "../../../providers/cache/RedisCacheProvider.js";
import {MemoryCacheProvider} from "../../../providers/cache/MemoryCacheProvider.js";
import {CloudinaryStorageProvider} from "../../../providers/storage/CloudinaryStorageProvider.js";
import {FilesystemEmailContentProvider} from "../../../services/email/FilesystemEmailContentProvider.js";
import {MailTrapEmailProvider} from "../../../providers/email/MailTrapEmailProvider.js";
import {StripeProvider} from "../../../providers/payment/StripeProvider.js";

import {JwtProvider} from "../../../providers/auth/JwtProvider.js";
import {BcryptPasswordProvider} from "../../../providers/password/BcryptPasswordProvider.js";

import {CacheTypes} from "../../../constants/app.js";
import {ProviderTypes} from "../../../constants/ioc.js";

import {config} from "../../../config.js";

const CACHE_IMPLEMENTATIONS = {
    [CacheTypes.REDIS]: RedisCacheProvider,
    [CacheTypes.MEMORY]: MemoryCacheProvider
};
const SELECTED_CACHE_IMPL = CACHE_IMPLEMENTATIONS[config.providers.cache.type];

const SALT_ROUNDS = config.providers.password.bcrypt.saltRounds;

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerProviders = (container) => {
    container.register(ProviderTypes.DATABASE, MongooseDatabaseProvider, []);
    container.register(ProviderTypes.CACHE, SELECTED_CACHE_IMPL, []);
    container.register(ProviderTypes.STORAGE, CloudinaryStorageProvider, []);
    container.register(ProviderTypes.EMAIL_CONTENT, FilesystemEmailContentProvider, []);
    container.register(ProviderTypes.EMAIL, MailTrapEmailProvider, [ProviderTypes.EMAIL_CONTENT]);
    container.register(ProviderTypes.PAYMENT, StripeProvider, []);

    container.register(ProviderTypes.JWT, JwtProvider, []);
    container.register(ProviderTypes.PASSWORD, () => new BcryptPasswordProvider(SALT_ROUNDS));
}

export default registerProviders;