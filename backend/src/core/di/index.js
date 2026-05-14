import {DIContainer} from "./DIContainer.js";

import registerRepositories from "./registrations/repositories.js";
import registerInfrastructureServices from "./registrations/infrastructureServices.js";
import registerProviders from "./registrations/providers.js";
import registerFactories from "./registrations/factories.js";
import registerMappers from "./registrations/mappers.js";
import registerParsers from "./registrations/parsers.js";
import registerCookieManagers from "./registrations/cookieManagers.js";
import registerCacheManagers from "./registrations/cacheManagers.js";
import registerStorageManagers from "./registrations/storageManagers.js";
import registerImageManagers from "./registrations/imageManagers.js";
import registerValidators from "./registrations/validators.js";
import registerDomainServices from "./registrations/domainServices.js";
import registerControllers from "./registrations/controllers.js";
import registerRouters from "./registrations/routers.js";
import registerSeeders from "./registrations/seeders.js";

const initContainer = () => {
    const container = new DIContainer();

    registerRepositories(container);
    registerInfrastructureServices(container);
    registerProviders(container);
    registerFactories(container);
    registerMappers(container);
    registerParsers(container);
    registerCookieManagers(container);
    registerCacheManagers(container);
    registerStorageManagers(container);
    registerImageManagers(container);
    registerValidators(container);
    registerDomainServices(container);
    registerControllers(container);
    registerRouters(container);
    registerSeeders(container);

    return container;
}

export default initContainer;