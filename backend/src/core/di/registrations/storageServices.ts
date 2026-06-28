import {Container} from "../Container.js";

import {IStorageProvider} from "../../../infrastructure/providers/storage/IStorageProvider.js";

import {
    CategoryStorageService,
    ProductStorageService
} from "../../../application/shared/storage/AppStorageServices.js";

const registerStorageServices = (container: Container): void => {
    container.register({
        token: CategoryStorageService
    }, [
        IStorageProvider
    ]);

    container.register({
        token: ProductStorageService
    }, [
        IStorageProvider
    ]);
}

export default registerStorageServices;