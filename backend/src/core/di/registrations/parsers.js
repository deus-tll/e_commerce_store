import {ProductQueryParser} from "../../../services/product/ProductQueryParser.js";
import {UserQueryParser} from "../../../services/user/UserQueryParser.js";

import {ParserTypes} from "../../../constants/ioc.js";

/**
 * @param {DIContainer} container
 * @returns {void}
 */
const registerParsers = (container) => {
    container.register(ParserTypes.PRODUCT_QUERY, ProductQueryParser, []);
    container.register(ParserTypes.USER_QUERY, UserQueryParser, []);
}

export default registerParsers;