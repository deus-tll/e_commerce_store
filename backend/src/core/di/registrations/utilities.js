import {SlugUtility} from "../../../services/utils/SlugUtility.js";
import {DateTimeUtility} from "../../../services/utils/DateTimeUtility.js";

import {UtilityTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerUtilities = (container) => {
    container.register(UtilityTypes.SLUG, SlugUtility, []);
    container.register(UtilityTypes.DATE, DateTimeUtility, []);
}

export default registerUtilities;