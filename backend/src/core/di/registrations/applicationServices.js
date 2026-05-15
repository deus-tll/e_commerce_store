import {EmailNotificationService} from "../../../application/services/notifications/EmailNotificationService.js";

import {ApplicationServiceTypes, InfrastructureServiceTypes, ProviderTypes} from "../../../constants/ioc.js";
import {config} from "../../../config.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerApplicationServices = (container) => {
    container.register(ApplicationServiceTypes.EMAIL_NOTIFICATION, () => {
        const emailProvider = container.get(ProviderTypes.EMAIL);
        const templateService = container.get(InfrastructureServiceTypes.TEMPLATE);
        const resetPasswordUrlBase = new URL(config.providers.password.resetUrl, config.app.clientUrl).toString();

        return new EmailNotificationService(emailProvider, templateService, resetPasswordUrlBase);
    });
}

export default registerApplicationServices;