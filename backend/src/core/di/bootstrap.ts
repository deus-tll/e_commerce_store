import {Container} from "./Container.js";

import registerRepositories from "./registrations/repositories.js";
import registerInfrastructureServices from "./registrations/infrastructureServices.js";
import registerProviders from "./registrations/providers.js";
import registerCookieManagers from "./registrations/cookieManagers.js";
import registerStorageServices from "./registrations/storageServices.js";
import registerImageManagers from "./registrations/imageManagers.js";
import registerValidators from "./registrations/validators.js";
import registerApplicationServices from "./registrations/applicationServices.js";
import registerControllers from "./registrations/controllers.js";
import registerSeeders from "./registrations/seeders.js";

let _container: Container | null = null;

export function getContainer(): Container {
    if (!_container) {
        const container = new Container();

        registerProviders(container);
        registerRepositories(container);
        registerInfrastructureServices(container);
        registerCookieManagers(container);
        registerStorageServices(container);
        registerImageManagers(container);
        registerValidators(container);
        registerApplicationServices(container);
        registerControllers(container);
        registerSeeders(container);

        container.boot();

        _container = container;
    }

    return _container;
}