import {DIContainer} from "./DIContainer.js";

import registerRepositories from "./registrations/repositories.js";
import registerInfrastructureServices from "./registrations/infrastructureServices.js";
import registerProviders from "./registrations/providers.js";
import registerFactories from "./registrations/factories.js";
import registerMappers from "./registrations/mappers.js";
import registerCookieManagers from "./registrations/cookieManagers.js";
import registerStorageServices from "./registrations/storageServices.js";
import registerImageManagers from "./registrations/imageManagers.js";
import registerValidators from "./registrations/validators.js";
import registerApplicationServices from "./registrations/applicationServices.js";
import registerDomainServices from "./registrations/domainServices.js";
import registerControllers from "./registrations/controllers.js";
import registerSeeders from "./registrations/seeders.js";

const initContainer = () => {
    const container = new DIContainer();

    registerRepositories(container);
    registerInfrastructureServices(container);
    registerProviders(container);
    registerFactories(container);
    registerMappers(container);
    registerCookieManagers(container);
    registerStorageServices(container);
    registerImageManagers(container);
    registerValidators(container);
    registerApplicationServices(container);
    registerDomainServices(container);
    registerControllers(container);
    registerSeeders(container);

    return container;
}

export default initContainer;